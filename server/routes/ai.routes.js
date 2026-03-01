import { Router } from 'express';
import { chat, generateReport, evaluate, getInsights, getRisks } from '../controllers/ai.controller.js';

const router = Router();
router.post('/chat', chat);
router.post('/report', generateReport);
router.post('/evaluate', evaluate);
router.post('/insights', getInsights);
router.post('/risks', getRisks);

export default router;
