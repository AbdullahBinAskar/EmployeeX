import { Router } from 'express';
import { getAllEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee, getEmployeeActivity } from '../controllers/employees.controller.js';

const router = Router();
router.get('/', getAllEmployees);
router.get('/:id', getEmployee);
router.post('/', createEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);
router.get('/:id/activity', getEmployeeActivity);

export default router;
