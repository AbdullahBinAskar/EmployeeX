import getDb from '../db/database.js';

export function getAllProjects(req, res) {
  const db = getDb();
  let query = 'SELECT * FROM projects';
  const params = [];
  const conditions = [];

  if (req.query.status) {
    conditions.push('status = ?');
    params.push(req.query.status);
  }
  if (req.query.health) {
    conditions.push('health = ?');
    params.push(req.query.health);
  }
  if (req.query.priority) {
    conditions.push('priority = ?');
    params.push(req.query.priority);
  }

  if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
  query += " ORDER BY CASE priority WHEN 'critical' THEN 1 WHEN 'high' THEN 2 WHEN 'medium' THEN 3 WHEN 'low' THEN 4 END, start_date DESC";

  const projects = db.prepare(query).all(...params);

  // Enrich with member count and lead
  const memberStmt = db.prepare(`
    SELECT e.id, e.name, e.avatar, pm.role FROM project_members pm
    JOIN employees e ON e.id = pm.employee_id
    WHERE pm.project_id = ?
  `);

  const deliverableCountStmt = db.prepare(`
    SELECT COUNT(*) as total,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
    FROM deliverables WHERE project_id = ?
  `);

  const result = projects.map(p => {
    p.tags = JSON.parse(p.tags || '[]');
    const members = memberStmt.all(p.id);
    const lead = members.find(m => m.role === 'lead');
    const delCounts = deliverableCountStmt.get(p.id);
    return {
      ...p,
      members,
      lead: lead ? { id: lead.id, name: lead.name, avatar: lead.avatar } : null,
      deliverable_count: delCounts.total,
      deliverable_completed: delCounts.completed,
    };
  });

  res.json(result);
}

export function getProject(req, res) {
  const db = getDb();
  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });

  project.tags = JSON.parse(project.tags || '[]');

  // Team members
  const members = db.prepare(`
    SELECT e.*, pm.role as member_role FROM employees e
    JOIN project_members pm ON pm.employee_id = e.id
    WHERE pm.project_id = ?
  `).all(req.params.id);
  members.forEach(m => { m.skills = JSON.parse(m.skills || '[]'); });

  // Milestones
  const milestones = db.prepare('SELECT * FROM milestones WHERE project_id = ? ORDER BY due_date').all(req.params.id);

  // Deliverables
  const deliverables = db.prepare(`
    SELECT d.*, e.name as assignee_name, e.avatar as assignee_avatar
    FROM deliverables d
    LEFT JOIN employees e ON e.id = d.assignee_id
    WHERE d.project_id = ?
    ORDER BY d.due_date
  `).all(req.params.id);

  // Emails
  const emails = db.prepare('SELECT * FROM emails WHERE project_id = ? ORDER BY date DESC').all(req.params.id);

  // Meetings
  const meetings = db.prepare('SELECT * FROM meetings WHERE project_id = ? ORDER BY date DESC').all(req.params.id);
  meetings.forEach(m => {
    m.decisions = JSON.parse(m.decisions || '[]');
    m.action_items = JSON.parse(m.action_items || '[]');
    m.attendees = db.prepare(`
      SELECT e.id, e.name, e.avatar FROM employees e
      JOIN meeting_attendees ma ON ma.employee_id = e.id
      WHERE ma.meeting_id = ?
    `).all(m.id);
  });

  res.json({ ...project, members, milestones, deliverables, emails, meetings });
}

export function createProject(req, res) {
  const db = getDb();
  const { name, description, status, health, priority, progress, start_date, target_date, budget, tags, members } = req.body;

  const result = db.prepare(`
    INSERT INTO projects (name, description, status, health, priority, progress, start_date, target_date, budget, tags)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(name, description, status || 'planning', health || 'green', priority || 'medium', progress || 0, start_date, target_date, budget, JSON.stringify(tags || []));

  const projectId = result.lastInsertRowid;

  if (members && members.length) {
    const insertMember = db.prepare('INSERT INTO project_members (project_id, employee_id, role) VALUES (?, ?, ?)');
    for (const m of members) {
      insertMember.run(projectId, m.employee_id, m.role || 'member');
    }
  }

  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(projectId);
  project.tags = JSON.parse(project.tags || '[]');
  res.status(201).json(project);
}

export function updateProject(req, res) {
  const db = getDb();
  const existing = db.prepare('SELECT id FROM projects WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Project not found' });

  const { name, description, status, health, priority, progress, start_date, target_date, actual_end_date, budget, tags } = req.body;
  db.prepare(`
    UPDATE projects SET
      name = COALESCE(?, name),
      description = COALESCE(?, description),
      status = COALESCE(?, status),
      health = COALESCE(?, health),
      priority = COALESCE(?, priority),
      progress = COALESCE(?, progress),
      start_date = COALESCE(?, start_date),
      target_date = COALESCE(?, target_date),
      actual_end_date = COALESCE(?, actual_end_date),
      budget = COALESCE(?, budget),
      tags = COALESCE(?, tags)
    WHERE id = ?
  `).run(name, description, status, health, priority, progress, start_date, target_date, actual_end_date, budget, tags ? JSON.stringify(tags) : null, req.params.id);

  const updated = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  updated.tags = JSON.parse(updated.tags || '[]');
  res.json(updated);
}

export function deleteProject(req, res) {
  const db = getDb();
  const existing = db.prepare('SELECT id FROM projects WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Project not found' });

  db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
  res.json({ success: true });
}
