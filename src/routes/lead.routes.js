
import { Router } from 'express';
import { authRequired, permit } from '../middleware/auth.js';
import { createLead, listLeads, getLead, updateLead, deleteLead } from '../controllers/lead.controller.js';

const router = Router();

//router.use(authRequired);

router.route('/')
  .get(listLeads)
  .post(permit('admin', 'manager', 'agent'), createLead);

router.route('/:id')
  .get(getLead)
  .put(permit('admin', 'manager', 'agent'), updateLead)
  .delete(permit('admin', 'manager'), deleteLead);

export default router;
