import getDb from '../db/database.js';

export function getAllKpis(req, res) {
  const db = getDb();
  let query = `
    SELECT k.*, e.name as employee_name, e.avatar as employee_avatar
    FROM kpis k
    JOIN employees e ON e.id = k.employee_id
  `;
  const params = [];
  const conditions = [];

  if (req.query.employeeId) { conditions.push('k.employee_id = ?'); params.push(req.query.employeeId); }
  if (req.query.status) { conditions.push('k.status = ?'); params.push(req.query.status); }
  if (req.query.period) { conditions.push('k.period = ?'); params.push(req.query.period); }

  if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
  query += ' ORDER BY k.employee_id, k.id';

  res.json(db.prepare(query).all(...params));
}

export function createKpi(req, res) {
  const db = getDb();
  const { employee_id, metric_name, target_value, current_value, unit, period, status, notes } = req.body;
  const result = db.prepare(`
    INSERT INTO kpis (employee_id, metric_name, target_value, current_value, unit, period, status, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(employee_id, metric_name, target_value, current_value, unit || '', period || 'Q1 2026', status || 'on_track', notes);

  const kpi = db.prepare('SELECT * FROM kpis WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(kpi);
}

export function updateKpi(req, res) {
  const db = getDb();
  const existing = db.prepare('SELECT id FROM kpis WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'KPI not found' });

  const { metric_name, target_value, current_value, unit, period, status, notes } = req.body;
  db.prepare(`
    UPDATE kpis SET
      metric_name = COALESCE(?, metric_name),
      target_value = COALESCE(?, target_value),
      current_value = COALESCE(?, current_value),
      unit = COALESCE(?, unit),
      period = COALESCE(?, period),
      status = COALESCE(?, status),
      notes = COALESCE(?, notes)
    WHERE id = ?
  `).run(metric_name, target_value, current_value, unit, period, status, notes, req.params.id);

  const updated = db.prepare('SELECT * FROM kpis WHERE id = ?').get(req.params.id);
  res.json(updated);
}

export function deleteKpi(req, res) {
  const db = getDb();
  const existing = db.prepare('SELECT id FROM kpis WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'KPI not found' });

  db.prepare('DELETE FROM kpis WHERE id = ?').run(req.params.id);
  res.json({ success: true });
}
