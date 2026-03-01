import { Router } from 'express';
import { getAllMeetings, getMeeting, createMeeting, updateMeeting } from '../controllers/meetings.controller.js';

const router = Router();
router.get('/', getAllMeetings);
router.get('/:id', getMeeting);
router.post('/', createMeeting);
router.put('/:id', updateMeeting);

export default router;
