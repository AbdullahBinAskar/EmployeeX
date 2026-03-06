import getDb from '../db/database.js';

export function getAllEmployees(req, res) {
  const db = getDb();
  const employees = db.prepare('SELECT * FROM employees ORDER BY id').all();
  // Parse JSON fields
  const result = employees.map(e => ({ ...e, skills: JSON.parse(e.skills || '[]') }));
  res.json(result);
}

export function getEmployee(req, res) {
  const db = getDb();
  const emp = db.prepare('SELECT * FROM employees WHERE id = ?').get(req.params.id);
  if (!emp) return res.status(404).json({ error: 'Employee not found' });

  emp.skills = JSON.parse(emp.skills || '[]');

  // Get projects
  const projects = db.prepare(`
    SELECT p.*, pm.role as member_role FROM projects p
    JOIN project_members pm ON pm.project_id = p.id
    WHERE pm.employee_id = ?
    ORDER BY p.start_date DESC
  `).all(req.params.id);
  projects.forEach(p => { p.tags = JSON.parse(p.tags || '[]'); });

  // Get deliverables
  const deliverables = db.prepare(`
    SELECT d.*, p.name as project_name FROM deliverables d
    JOIN projects p ON p.id = d.project_id
    WHERE d.assignee_id = ?
    ORDER BY d.due_date
  `).all(req.params.id);

  // Get KPIs
  const kpis = db.prepare('SELECT * FROM kpis WHERE employee_id = ? ORDER BY id').all(req.params.id);

  // Get emails linked by employee_id OR matching sender email
  const emails = db.prepare(`
    SELECT e.*, p.name as project_name FROM emails e
    LEFT JOIN projects p ON p.id = e.project_id
    WHERE e.employee_id = ? OR LOWER(e.from_address) LIKE '%' || LOWER(?) || '%'
    ORDER BY e.date DESC
  `).all(req.params.id, emp.email || '');

  // Get meetings
  const meetings = db.prepare(`
    SELECT m.* FROM meetings m
    JOIN meeting_attendees ma ON ma.meeting_id = m.id
    WHERE ma.employee_id = ?
    ORDER BY m.date DESC LIMIT 10
  `).all(req.params.id);
  meetings.forEach(m => {
    m.decisions = JSON.parse(m.decisions || '[]');
    m.action_items = JSON.parse(m.action_items || '[]');
  });

  res.json({ ...emp, projects, deliverables, kpis, emails, meetings });
}

export function createEmployee(req, res) {
  const db = getDb();
  const { name, role, email, status, avatar, skills, capacity, join_date, phone, notes } = req.body;
  const result = db.prepare(`
    INSERT INTO employees (name, role, email, status, avatar, skills, capacity, join_date, phone, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(name, role, email, status || 'active', avatar, JSON.stringify(skills || []), capacity || 100, join_date, phone, notes);

  const emp = db.prepare('SELECT * FROM employees WHERE id = ?').get(result.lastInsertRowid);
  emp.skills = JSON.parse(emp.skills || '[]');
  res.status(201).json(emp);
}

export function updateEmployee(req, res) {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM employees WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Employee not found' });

  const { name, role, email, status, avatar, skills, capacity, join_date, phone, notes } = req.body;
  db.prepare(`
    UPDATE employees SET
      name = COALESCE(?, name),
      role = COALESCE(?, role),
      email = COALESCE(?, email),
      status = COALESCE(?, status),
      avatar = COALESCE(?, avatar),
      skills = COALESCE(?, skills),
      capacity = COALESCE(?, capacity),
      join_date = COALESCE(?, join_date),
      phone = COALESCE(?, phone),
      notes = COALESCE(?, notes)
    WHERE id = ?
  `).run(name, role, email, status, avatar, skills ? JSON.stringify(skills) : null, capacity, join_date, phone, notes, req.params.id);

  const updated = db.prepare('SELECT * FROM employees WHERE id = ?').get(req.params.id);
  updated.skills = JSON.parse(updated.skills || '[]');
  res.json(updated);
}

export function deleteEmployee(req, res) {
  const db = getDb();
  const existing = db.prepare('SELECT id FROM employees WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Employee not found' });

  db.prepare('DELETE FROM employees WHERE id = ?').run(req.params.id);
  res.json({ success: true });
}

export function getEmployeeActivity(req, res) {
  const db = getDb();
  const emp = db.prepare('SELECT id, name FROM employees WHERE id = ?').get(req.params.id);
  if (!emp) return res.status(404).json({ error: 'Employee not found' });

  const emails = db.prepare(`
    SELECT 'email' as type, subject as title, date as timestamp, classification, priority
    FROM emails WHERE employee_id = ? ORDER BY date DESC LIMIT 20
  `).all(req.params.id);

  const deliverables = db.prepare(`
    SELECT 'deliverable' as type, title, created_at as timestamp, status, priority
    FROM deliverables WHERE assignee_id = ? ORDER BY created_at DESC LIMIT 20
  `).all(req.params.id);

  const meetings = db.prepare(`
    SELECT 'meeting' as type, m.title, m.date as timestamp, m.status
    FROM meetings m JOIN meeting_attendees ma ON ma.meeting_id = m.id
    WHERE ma.employee_id = ? ORDER BY m.date DESC LIMIT 20
  `).all(req.params.id);

  const activity = [...emails, ...deliverables, ...meetings]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 30);

  res.json(activity);
}
