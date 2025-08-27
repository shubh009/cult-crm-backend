
import { Lead } from '../models/Lead.js';
import { User } from '../models/User.js';

export const createLead = async (req, res) => {
  try {
    const body = req.body || {};

    // Normalize input (Facebook OR frontend)
    const normalizedData = {
      name: body["First name"] || body.name,
      email: body.Email || body.email,
      contact: body["Phone number"] || body.contact,
      city: body.City || body.city,
      requirements: body.Requirements || body.requirements,
      status: body.Status || body.status || "new",
    };

    // Handle assignedTo
    let assignedTo = body.assignedTo;
    if (!assignedTo) {
      const defaultUser = await User.findOne({ email: "admin@cultcrm.com" });
      assignedTo = defaultUser ? defaultUser._id : null;
    }
    normalizedData.assignedTo = assignedTo;

    console.log("Assigned To:", assignedTo);

    const lead = await Lead.create(normalizedData);

    return res.status(201).json({
      success: true,
      message: "Lead created",
      data: lead,
    });
  } catch (err) {
    console.error("Create Lead Error:", err);
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
