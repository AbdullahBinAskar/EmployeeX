import getDb from '../db/database.js';

export function getDepartment(req, res) {
  const db = getDb();
  const dept = db.prepare('SELECT * FROM department LIMIT 1').get();
  if (!dept) return res.status(404).json({ error: 'Department not found' });
  res.json(dept);
}

export function updateDepartment(req, res) {
  const db = getDb();
  const dept = db.prepare('SELECT id FROM department LIMIT 1').get();
  if (!dept) return res.status(404).json({ error: 'Department not found' });

  const { name, name_ar, director, employee_x_email, color, description } = req.body;
  db.prepare(`
    UPDATE department SET
      name = COALESCE(?, name),
      name_ar = COALESCE(?, name_ar),
      director = COALESCE(?, director),
      employee_x_email = COALESCE(?, employee_x_email),
      color = COALESCE(?, color),
      description = COALESCE(?, description)
    WHERE id = ?
  `).run(name, name_ar, director, employee_x_email, color, description, dept.id);

  const updated = db.prepare('SELECT * FROM department WHERE id = ?').get(dept.id);
  res.json(updated);
}
