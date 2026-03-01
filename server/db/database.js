import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const DB_PATH = join(__dirname, 'employeex.db');

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
}

export default getDb;
