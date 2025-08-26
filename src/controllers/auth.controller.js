
import jwt from 'jsonwebtoken';
import { User } from "../models/User.js";

function sign(user) {
  return jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ success: false, message: 'Email already registered' });
  const user = await User.create({ name, email, password, role });
  const token = sign(user);
  const cookieOptions = {
    httpOnly: true,
    secure: String(process.env.COOKIE_SECURE) === 'true',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
  res.cookie('token', token, cookieOptions);
  res.status(201).json({ success: true, data: { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token } });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
  const ok = await user.comparePassword(password);
  if (!ok) return res.status(401).json({ success: false, message: 'Invalid credentials' });
  const token = sign(user);
  const cookieOptions = {
    httpOnly: true,
    secure: String(process.env.COOKIE_SECURE) === 'true',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
  res.cookie('token', token, cookieOptions);
  res.json({ success: true, data: { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token } });
};

export const me = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json({ success: true, data: { user } });
};

export const logout = async (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out' });
};
