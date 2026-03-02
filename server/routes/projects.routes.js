import { Router } from 'express';
import { getAllProjects, getProject, createProject, updateProject, deleteProject, updateMembers, createMilestone, updateMilestone, deleteMilestone } from '../controllers/projects.controller.js';

const router = Router();
router.get('/', getAllProjects);
router.get('/:id', getProject);
router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);
router.put('/:id/members', updateMembers);
router.post('/:id/milestones', createMilestone);
router.put('/:id/milestones/:mid', updateMilestone);
router.delete('/:id/milestones/:mid', deleteMilestone);

export default router;
