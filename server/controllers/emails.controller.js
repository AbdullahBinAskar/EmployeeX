import getDb from '../db/database.js';

export function getAllEmails(req, res) {
  const db = getDb();
  let query = `
    SELECT e.*, p.name as project_name, emp.name as employee_name
    FROM emails e
    LEFT JOIN projects p ON p.id = e.project_id
    LEFT JOIN employees emp ON emp.id = e.employee_id
  `;
  const params = [];
  const conditions = [];

  if (req.query.projectId) { conditions.push('e.project_id = ?'); params.push(req.query.projectId); }
  if (req.query.employeeId) { conditions.push('e.employee_id = ?'); params.push(req.query.employeeId); }
  if (req.query.classification) { conditions.push('e.classification = ?'); params.push(req.query.classification); }
  if (req.query.status) { conditions.push('e.status = ?'); params.push(req.query.status); }
  if (req.query.priority) { conditions.push('e.priority = ?'); params.push(req.query.priority); }

  if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
  query += ' ORDER BY e.date DESC';

  res.json(db.prepare(query).all(...params));
}

export function getEmail(req, res) {
  const db = getDb();
  const email = db.prepare(`
    SELECT e.*, p.name as project_name, emp.name as employee_name
    FROM emails e
    LEFT JOIN projects p ON p.id = e.project_id
    LEFT JOIN employees emp ON emp.id = e.employee_id
    WHERE e.id = ?
  `).get(req.params.id);
  if (!email) return res.status(404).json({ error: 'Email not found' });
  res.json(email);
}

export function createEmail(req, res) {
  const db = getDb();
  const { from_address, to_address, cc, subject, body, date, classification, status, priority, project_id, employee_id, has_attachment } = req.body;
  const result = db.prepare(`
    INSERT INTO emails (from_address, to_address, cc, subject, body, date, classification, status, priority, project_id, employee_id, has_attachment)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(from_address, to_address, cc, subject, body, date, classification || 'general', status || 'unread', priority || 'normal', project_id, employee_id, has_attachment || 0);

  const email = db.prepare('SELECT * FROM emails WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(email);
}

export function updateEmail(req, res) {
  const db = getDb();
  const existing = db.prepare('SELECT id FROM emails WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Email not found' });

  const { status, classification, project_id, employee_id } = req.body;
  db.prepare(`
    UPDATE emails SET
      status = COALESCE(?, status),
      classification = COALESCE(?, classification),
      project_id = COALESCE(?, project_id),
      employee_id = COALESCE(?, employee_id)
    WHERE id = ?
  `).run(status, classification, project_id, employee_id, req.params.id);

  const updated = db.prepare('SELECT * FROM emails WHERE id = ?').get(req.params.id);
  res.json(updated);
}

export function deleteEmail(req, res) {
  const db = getDb();
  const existing = db.prepare('SELECT id FROM emails WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Email not found' });

  db.prepare('DELETE FROM emails WHERE id = ?').run(req.params.id);
  res.json({ success: true });
}
