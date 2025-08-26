
import { Project } from '../models/Project.js';

export const createProject = async (req, res) => {
  const project = await Project.create(req.body);
  res.status(201).json({ success: true, data: project });
};

export const listProjects = async (req, res) => {
  const projects = await Project.find({}).sort('-createdAt');
  res.json({ success: true, data: projects });
};

export const getProject = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
  res.json({ success: true, data: project });
};

export const updateProject = async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
  res.json({ success: true, data: project });
};

export const deleteProject = async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
  res.json({ success: true, message: 'Project deleted' });
};
