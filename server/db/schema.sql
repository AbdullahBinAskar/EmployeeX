-- Employee X "Big Brother" Schema

CREATE TABLE IF NOT EXISTS department (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  name_ar TEXT,
  director TEXT NOT NULL,
  employee_x_email TEXT,
  color TEXT DEFAULT '#0EA5E9',
  description TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS employees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  email TEXT,
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'absent', 'on_leave', 'inactive')),
  avatar TEXT,
  skills TEXT DEFAULT '[]',        -- JSON array
  capacity INTEGER DEFAULT 100,    -- percentage 0-100
  join_date TEXT,
  phone TEXT,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK(status IN ('planning', 'active', 'on_hold', 'completed', 'cancelled')),
  health TEXT DEFAULT 'green' CHECK(health IN ('green', 'yellow', 'red')),
  priority TEXT DEFAULT 'medium' CHECK(priority IN ('critical', 'high', 'medium', 'low')),
  progress INTEGER DEFAULT 0 CHECK(progress >= 0 AND progress <= 100),
  start_date TEXT,
  target_date TEXT,
  actual_end_date TEXT,
  budget TEXT,
  tags TEXT DEFAULT '[]',          -- JSON array
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS project_members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK(role IN ('lead', 'member', 'reviewer')),
  UNIQUE(project_id, employee_id)
);

CREATE TABLE IF NOT EXISTS milestones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  due_date TEXT,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'in_progress', 'completed', 'overdue')),
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS deliverables (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  assignee_id INTEGER REFERENCES employees(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'not_started' CHECK(status IN ('not_started', 'in_progress', 'in_review', 'completed', 'blocked', 'overdue')),
  priority TEXT DEFAULT 'medium' CHECK(priority IN ('critical', 'high', 'medium', 'low')),
  due_date TEXT,
  completed_date TEXT,
  delay_days INTEGER DEFAULT 0,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS emails (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  from_address TEXT NOT NULL,
  to_address TEXT,
  cc TEXT,
  subject TEXT NOT NULL,
  body TEXT,
  date TEXT DEFAULT (datetime('now')),
  classification TEXT DEFAULT 'general' CHECK(classification IN ('action_required', 'fyi', 'escalation', 'update', 'request', 'general')),
  status TEXT DEFAULT 'unread' CHECK(status IN ('unread', 'read', 'replied', 'flagged')),
  priority TEXT DEFAULT 'normal' CHECK(priority IN ('urgent', 'high', 'normal', 'low')),
  project_id INTEGER REFERENCES projects(id) ON DELETE SET NULL,
  employee_id INTEGER REFERENCES employees(id) ON DELETE SET NULL,
  has_attachment INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS meetings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT,
  duration_minutes INTEGER DEFAULT 60,
  location TEXT,
  status TEXT DEFAULT 'scheduled' CHECK(status IN ('scheduled', 'completed', 'cancelled')),
  project_id INTEGER REFERENCES projects(id) ON DELETE SET NULL,
  summary TEXT,
  decisions TEXT DEFAULT '[]',      -- JSON array
  action_items TEXT DEFAULT '[]',   -- JSON array
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS meeting_attendees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  meeting_id INTEGER NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  UNIQUE(meeting_id, employee_id)
);

CREATE TABLE IF NOT EXISTS kpis (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  metric_name TEXT NOT NULL,
  target_value REAL,
  current_value REAL,
  unit TEXT DEFAULT '',
  period TEXT DEFAULT 'Q1 2026',
  status TEXT DEFAULT 'on_track' CHECK(status IN ('on_track', 'at_risk', 'behind', 'exceeded', 'met')),
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_project_members_project ON project_members(project_id);
CREATE INDEX IF NOT EXISTS idx_project_members_employee ON project_members(employee_id);
CREATE INDEX IF NOT EXISTS idx_deliverables_project ON deliverables(project_id);
CREATE INDEX IF NOT EXISTS idx_deliverables_assignee ON deliverables(assignee_id);
CREATE INDEX IF NOT EXISTS idx_emails_project ON emails(project_id);
CREATE INDEX IF NOT EXISTS idx_emails_employee ON emails(employee_id);
CREATE INDEX IF NOT EXISTS idx_meetings_project ON meetings(project_id);
CREATE INDEX IF NOT EXISTS idx_meeting_attendees_meeting ON meeting_attendees(meeting_id);
CREATE INDEX IF NOT EXISTS idx_meeting_attendees_employee ON meeting_attendees(employee_id);
CREATE INDEX IF NOT EXISTS idx_kpis_employee ON kpis(employee_id);
CREATE INDEX IF NOT EXISTS idx_milestones_project ON milestones(project_id);
