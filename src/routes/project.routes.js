
import { Router } from 'express';
import { authRequired, permit } from '../middleware/auth.js';
import { createProject, listProjects, getProject, updateProject, deleteProject } from '../controllers/project.controller.js';

const router = Router();
router.use(authRequired);

router.route('/')
  .get(listProjects)
  .post(permit('admin', 'manager'), createProject);

router.route('/:id')
  .get(getProject)
  .put(permit('admin', 'manager'), updateProject)
  .delete(permit('admin'), deleteProject);

export default router;
