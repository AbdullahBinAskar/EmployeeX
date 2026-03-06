import { Router } from 'express';
import { getAllEmails, getEmail, createEmail, updateEmail, deleteEmail } from '../controllers/emails.controller.js';
import { getListenerStatus } from '../services/email-listener.js';
import getDb from '../db/database.js';

const router = Router();

// Gmail listener endpoints (before /:id to avoid route conflict)
router.get('/listener/status', (req, res) => {
  res.json(getListenerStatus());
});

router.get('/listener/log', (req, res) => {
  const db = getDb();
  const limit = parseInt(req.query.limit) || 50;
  const logs = db.prepare(`
    SELECT l.*, e.subject as email_subject, e.from_address
    FROM email_processing_log l
    LEFT JOIN emails e ON e.id = l.email_id
    ORDER BY l.processed_at DESC
    LIMIT ?
  `).all(limit);
  res.json(logs);
});

// Standard CRUD
router.get('/', getAllEmails);
router.get('/:id', getEmail);
router.post('/', createEmail);
router.put('/:id', updateEmail);
router.delete('/:id', deleteEmail);

export default router;
