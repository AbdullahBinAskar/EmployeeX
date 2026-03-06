import Database from 'better-sqlite3';
import { readFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Use /app/data on Railway (volume mount), fallback to local db/ directory
const DATA_DIR = process.env.DATA_DIR || __dirname;
mkdirSync(DATA_DIR, { recursive: true });
const DB_PATH = join(DATA_DIR, 'employeex.db');

let db;

export function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initializeDatabase();
  }
  return db;
}

function initializeDatabase() {
  const tableCheck = db.prepare(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='department'"
  ).get();

  if (!tableCheck) {
    console.log('Initializing database schema...');
    const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
    db.exec(schema);

    console.log('Seeding database...');
    const seed = readFileSync(join(__dirname, 'seed.sql'), 'utf-8');
    db.exec(seed);

    console.log('Database initialized with seed data.');
  } else {
    console.log('Database already initialized.');
  }

  // Migrations — run on every startup, safe to re-run
  db.exec(`
    CREATE TABLE IF NOT EXISTS email_employee_links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email_id INTEGER NOT NULL REFERENCES emails(id) ON DELETE CASCADE,
      employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
      role TEXT DEFAULT 'from' CHECK(role IN ('from', 'to', 'cc')),
      UNIQUE(email_id, employee_id, role)
    );
    CREATE INDEX IF NOT EXISTS idx_email_links_email ON email_employee_links(email_id);
    CREATE INDEX IF NOT EXISTS idx_email_links_employee ON email_employee_links(employee_id);
  `);
}

export default getDb;
