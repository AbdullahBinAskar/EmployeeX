import { Router } from 'express';
import { getAllKpis, createKpi, updateKpi, deleteKpi } from '../controllers/kpis.controller.js';

const router = Router();
router.get('/', getAllKpis);
router.post('/', createKpi);
router.put('/:id', updateKpi);
router.delete('/:id', deleteKpi);

export default router;
