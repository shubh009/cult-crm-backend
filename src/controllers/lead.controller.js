
import { Lead } from '../models/Lead.js';
import { User } from '../models/User.js';

export const createLead = async (req, res) => {
  try {
    let body = req.body;

    // CASE 1: FB Test webhook → plain string
    if (typeof body === "string") {
      console.log("📩 FB Test Webhook Raw Body:", body);
      return res.status(200).send("TEST_WEBHOOK_OK");
    }

    let leadData = {};

    // CASE 2: Real FB webhook payload
    if (body.entry && Array.isArray(body.entry)) {
      const fieldData = body.entry[0]?.changes[0]?.value?.field_data || [];
      fieldData.forEach((field) => {
        const key = field.name.toLowerCase();
        const value = field.values[0];
        if (key.includes("name")) leadData.name = value;
        if (key.includes("email")) leadData.email = value;
        if (key.includes("phone")) leadData.contact = value;
        if (key.includes("city")) leadData.city = value;
        if (key.includes("requirement")) leadData.requirements = value;
      });
      leadData.status = "new";
    }

    // CASE 3: Normal frontend / Postman JSON
    else {
      leadData = {
        name: body["First name"] || body.name,
        email: body.Email || body.email,
        contact: body["Phone number"] || body.contact,
        city: body.City || body.city,
        requirements: body.Requirements || body.requirements,
        status: body.Status || body.status || "new",
      };
    }

    // Assign user (default → admin)
    let assignedTo = body.assignedTo;
    if (!assignedTo) {
      const defaultUser = await User.findOne({ email: "admin@cultcrm.com" });
      assignedTo = defaultUser ? defaultUser._id : null;
    }
    leadData.assignedTo = assignedTo;

    console.log("✅ Normalized Lead Data:", leadData);

    // Save to DB
    const lead = await Lead.create(leadData);

    return res.status(201).json({
      success: true,
      message: "Lead created",
      data: lead,
    });
  } catch (err) {
    console.error("❌ Create Lead Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};



export const listLeads = async (req, res) => {
  const { status, source, assignedTo, q } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (source) filter.source = source;
  if (assignedTo) filter.assignedTo = assignedTo;

  let query = Lead.find(filter).populate('assignedTo', 'name email role').populate('project', 'name location');
  if (q) query = query.find({ $text: { $search: q } });
  const leads = await query.sort('-createdAt');
  res.json({ success: true, data: leads });
};

export const getLead = async (req, res) => {
  const lead = await Lead.findById(req.params.id).populate('assignedTo', 'name email role').populate('project', 'name location');
  if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
  res.json({ success: true, data: lead });
};

export const updateLead = async (req, res) => {
  const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
  res.json({ success: true, data: lead });
};

export const deleteLead = async (req, res) => {
  const lead = await Lead.findByIdAndDelete(req.params.id);
  if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
  res.json({ success: true, message: 'Lead deleted' });
};
