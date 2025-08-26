
import { Router } from "express";
import { Lead } from "../models/Lead.js";
import { User } from "../models/User.js";

const router = Router();

/**
 * Create Lead - Handles both CRM form & Facebook webhook
 */
const authEnabled = process.env.AUTH_ENABLED === "true";
router.post("/", async (req, res) => {
  try {
    let payload = req.body;
    let leadData = {};

    // CASE 1: Facebook Lead Ads webhook payload
    if (payload.entry && Array.isArray(payload.entry)) {
      const fieldData =
        payload.entry[0]?.changes[0]?.value?.field_data || [];

      fieldData.forEach((field) => {
        const key = field.name.toLowerCase();
        const value = field.values[0];

        if (key.includes("name")) leadData.name = value;
        if (key.includes("email")) leadData.email = value;
        if (key.includes("phone")) leadData.contact = value;
        if (key.includes("city")) leadData.city = value;
        if (key.includes("requirement")) leadData.requirements = value;
      });
    }

    // CASE 2: Normal CRM form submission (Postman or your frontend)
    else {
      leadData = {
        name: payload["First name"] || payload.name,
        email: payload["Email"] || payload.email,
        contact: payload["Phone Number"] || payload.contact,
        city: payload["City"] || payload.city,
        requirements: payload["Requirements"] || payload.requirements,
      };
    }

    // Assign default user if not provided
    if (!leadData.assignedTo) {
      const defaultUser = await User.findOne({ email: "admin@cultcrm.com" });
      leadData.assignedTo = defaultUser ? defaultUser._id : null;
    }

    // Save lead in DB
    const lead = await Lead.create(leadData);

    return res
      .status(201)
      .json({ success: true, message: "Lead created", data: lead });
  } catch (err) {
    console.error("Error creating lead:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
