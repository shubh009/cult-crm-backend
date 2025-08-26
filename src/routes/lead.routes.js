import { Router } from "express";
import { createLead, listLeads, getLead, updateLead, deleteLead } from "../controllers/lead.controller.js";
import { permit } from "../middleware/auth.js";

const router = Router();

const authEnabled = process.env.AUTH_ENABLED === "true";

// If auth enabled → secure routes
if (authEnabled) {
  router.route("/")
    .get(listLeads)
    .post(permit("admin", "manager", "agent"), createLead);

  router.route("/:id")
    .get(getLead)
    .put(permit("admin", "manager", "agent"), updateLead)
    .delete(permit("admin", "manager"), deleteLead);

} else {
  // Auth disabled → all routes open
  router.route("/")
    .get(listLeads)
    .post(createLead);

  router.route("/:id")
    .get(getLead)
    .put(updateLead)
    .delete(deleteLead);
}

export default router;
