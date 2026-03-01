import { Router } from 'express';
import { getAllEmails, getEmail, createEmail, updateEmail, deleteEmail } from '../controllers/emails.controller.js';

const router = Router();
router.get('/', getAllEmails);
router.get('/:id', getEmail);
router.post('/', createEmail);
router.put('/:id', updateEmail);
router.delete('/:id', deleteEmail);

export default router;
