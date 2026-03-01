import getDb from '../db/database.js';

export function getAllDeliverables(req, res) {
  const db = getDb();
  let query = `
    SELECT d.*, p.name as project_name, e.name as assignee_name, e.avatar as assignee_avatar
    FROM deliverables d
    JOIN projects p ON p.id = d.project_id
    LEFT JOIN employees e ON e.id = d.assignee_id
  `;
  const params = [];
  const conditions = [];

  if (req.query.status) { conditions.push('d.status = ?'); params.push(req.query.status); }
  if (req.query.projectId) { conditions.push('d.project_id = ?'); params.push(req.query.projectId); }
  if (req.query.assigneeId) { conditions.push('d.assignee_id = ?'); params.push(req.query.assigneeId); }
  if (req.query.priority) { conditions.push('d.priority = ?'); params.push(req.query.priority); }

  if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
  query += ' ORDER BY d.due_date';

  res.json(db.prepare(query).all(...params));
}

export function getDeliverable(req, res) {
  const db = getDb();
  const d = db.prepare(`
    SELECT d.*, p.name as project_name, e.name as assignee_name, e.avatar as assignee_avatar
    FROM deliverables d
    JOIN projects p ON p.id = d.project_id
    LEFT JOIN employees e ON e.id = d.assignee_id
    WHERE d.id = ?
  `).get(req.params.id);
  if (!d) return res.status(404).json({ error: 'Deliverable not found' });
  res.json(d);
}

export function createDeliverable(req, res) {
  const db = getDb();
  const { project_id, assignee_id, title, description, status, priority, due_date, notes } = req.body;
  const result = db.prepare(`
    INSERT INTO deliverables (project_id, assignee_id, title, description, status, priority, due_date, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(project_id, assignee_id, title, description, status || 'not_started', priority || 'medium', due_date, notes);

  const d = db.prepare('SELECT * FROM deliverables WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(d);
}

export function updateDeliverable(req, res) {
  const db = getDb();
  const existing = db.prepare('SELECT id FROM deliverables WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Deliverable not found' });

  const { project_id, assignee_id, title, description, status, priority, due_date, completed_date, delay_days, notes } = req.body;
  db.prepare(`
    UPDATE deliverables SET
      project_id = COALESCE(?, project_id),
      assignee_id = COALESCE(?, assignee_id),
      title = COALESCE(?, title),
      description = COALESCE(?, description),
      status = COALESCE(?, status),
      priority = COALESCE(?, priority),
      due_date = COALESCE(?, due_date),
      completed_date = COALESCE(?, completed_date),
      delay_days = COALESCE(?, delay_days),
      notes = COALESCE(?, notes)
    WHERE id = ?
  `).run(project_id, assignee_id, title, description, status, priority, due_date, completed_date, delay_days, notes, req.params.id);

  const updated = db.prepare('SELECT * FROM deliverables WHERE id = ?').get(req.params.id);
  res.json(updated);
}

export function deleteDeliverable(req, res) {
  const db = getDb();
  const existing = db.prepare('SELECT id FROM deliverables WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Deliverable not found' });

  db.prepare('DELETE FROM deliverables WHERE id = ?').run(req.params.id);
  res.json({ success: true });
}
