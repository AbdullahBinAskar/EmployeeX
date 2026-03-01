import getDb from '../db/database.js';

export function getAllMeetings(req, res) {
  const db = getDb();
  let query = 'SELECT * FROM meetings';
  const params = [];
  const conditions = [];

  if (req.query.projectId) { conditions.push('project_id = ?'); params.push(req.query.projectId); }
  if (req.query.status) { conditions.push('status = ?'); params.push(req.query.status); }

  if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
  query += ' ORDER BY date DESC';

  const meetings = db.prepare(query).all(...params);

  const attendeeStmt = db.prepare(`
    SELECT e.id, e.name, e.avatar FROM employees e
    JOIN meeting_attendees ma ON ma.employee_id = e.id
    WHERE ma.meeting_id = ?
  `);

  const projectStmt = db.prepare('SELECT id, name FROM projects WHERE id = ?');

  const result = meetings.map(m => {
    m.decisions = JSON.parse(m.decisions || '[]');
    m.action_items = JSON.parse(m.action_items || '[]');
    m.attendees = attendeeStmt.all(m.id);
    if (m.project_id) {
      const proj = projectStmt.get(m.project_id);
      m.project_name = proj ? proj.name : null;
    }
    return m;
  });

  res.json(result);
}

export function getMeeting(req, res) {
  const db = getDb();
  const meeting = db.prepare('SELECT * FROM meetings WHERE id = ?').get(req.params.id);
  if (!meeting) return res.status(404).json({ error: 'Meeting not found' });

  meeting.decisions = JSON.parse(meeting.decisions || '[]');
  meeting.action_items = JSON.parse(meeting.action_items || '[]');

  meeting.attendees = db.prepare(`
    SELECT e.id, e.name, e.avatar, e.role FROM employees e
    JOIN meeting_attendees ma ON ma.employee_id = e.id
    WHERE ma.meeting_id = ?
  `).all(req.params.id);

  if (meeting.project_id) {
    const proj = db.prepare('SELECT id, name FROM projects WHERE id = ?').get(meeting.project_id);
    meeting.project_name = proj ? proj.name : null;
  }

  res.json(meeting);
}

export function createMeeting(req, res) {
  const db = getDb();
  const { title, date, time, duration_minutes, location, status, project_id, summary, decisions, action_items, notes, attendees } = req.body;

  const result = db.prepare(`
    INSERT INTO meetings (title, date, time, duration_minutes, location, status, project_id, summary, decisions, action_items, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(title, date, time, duration_minutes || 60, location, status || 'scheduled', project_id, summary, JSON.stringify(decisions || []), JSON.stringify(action_items || []), notes);

  const meetingId = result.lastInsertRowid;

  if (attendees && attendees.length) {
    const insertAttendee = db.prepare('INSERT INTO meeting_attendees (meeting_id, employee_id) VALUES (?, ?)');
    for (const empId of attendees) {
      insertAttendee.run(meetingId, empId);
    }
  }

  const meeting = db.prepare('SELECT * FROM meetings WHERE id = ?').get(meetingId);
  meeting.decisions = JSON.parse(meeting.decisions || '[]');
  meeting.action_items = JSON.parse(meeting.action_items || '[]');
  res.status(201).json(meeting);
}

export function updateMeeting(req, res) {
  const db = getDb();
  const existing = db.prepare('SELECT id FROM meetings WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Meeting not found' });

  const { title, date, time, duration_minutes, location, status, project_id, summary, decisions, action_items, notes } = req.body;
  db.prepare(`
    UPDATE meetings SET
      title = COALESCE(?, title),
      date = COALESCE(?, date),
      time = COALESCE(?, time),
      duration_minutes = COALESCE(?, duration_minutes),
      location = COALESCE(?, location),
      status = COALESCE(?, status),
      project_id = COALESCE(?, project_id),
      summary = COALESCE(?, summary),
      decisions = COALESCE(?, decisions),
      action_items = COALESCE(?, action_items),
      notes = COALESCE(?, notes)
    WHERE id = ?
  `).run(title, date, time, duration_minutes, location, status, project_id, summary, decisions ? JSON.stringify(decisions) : null, action_items ? JSON.stringify(action_items) : null, notes, req.params.id);

  const updated = db.prepare('SELECT * FROM meetings WHERE id = ?').get(req.params.id);
  updated.decisions = JSON.parse(updated.decisions || '[]');
  updated.action_items = JSON.parse(updated.action_items || '[]');
  res.json(updated);
}
