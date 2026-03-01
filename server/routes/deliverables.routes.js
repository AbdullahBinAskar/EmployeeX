import { Router } from 'express';
import { getAllDeliverables, getDeliverable, createDeliverable, updateDeliverable, deleteDeliverable } from '../controllers/deliverables.controller.js';

const router = Router();
router.get('/', getAllDeliverables);
router.get('/:id', getDeliverable);
router.post('/', createDeliverable);
router.put('/:id', updateDeliverable);
router.delete('/:id', deleteDeliverable);

export default router;
