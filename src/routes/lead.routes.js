import { Router } from "express";
import { createLead, listLeads, getLead, updateLead, deleteLead } from "../controllers/lead.controller.js";
import { User } from "../models/User.js";
// import { authRequired, permit } from "../middleware/auth.js"; // uncomment if using auth

const router = Router();

// Toggle authentication via environment variable
const authEnabled = process.env.AUTH_ENABLED === "true";

/**
 * @route   GET /api/leads
 * @desc    List all leads
 */
router.get("/", listLeads);

/**
 * @route   POST /api/leads
 * @desc    Create a new lead
 */
router.post("/", bodyParser.text({ type: "*/*" }), createLead);

/**
 * @route   GET /api/leads/:id
 * @desc    Get a single lead
 * @route   PUT /api/leads/:id
 * @desc    Update a lead
 * @route   DELETE /api/leads/:id
 * @desc    Delete a lead
 */
if (authEnabled) {
  // Auth enabled → use permit middleware
  router
    .route("/:id")
    .get(getLead)
    .put((req, res, next) => permit("admin", "manager", "agent")(req, res, next), updateLead)
    .delete((req, res, next) => permit("admin", "manager")(req, res, next), deleteLead);
} else {
  // Auth disabled → no middleware
  router
    .route("/:id")
    .get(getLead)
    .put(updateLead)
    .delete(deleteLead);
}

export default router;
