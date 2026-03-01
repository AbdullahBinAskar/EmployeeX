import { Router } from 'express';
import { getDepartment, updateDepartment } from '../controllers/department.controller.js';

const router = Router();
router.get('/', getDepartment);
router.put('/', updateDepartment);

export default router;
