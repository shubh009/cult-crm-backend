
import { Lead } from '../models/Lead.js';

export const createLead = async (req, res) => {
  const lead = await Lead.create({ ...req.body, assignedTo: req.body.assignedTo || req.user.id });
  res.status(201).json({ success: true, data: lead });
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
