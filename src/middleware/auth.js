
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export function authRequired(req, res, next) {
  try {
    // Prefer cookie, fallback to Authorization header
    const token = req.cookies?.token || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);
    if (!token) return res.status(401).json({ success: false, message: 'Not authenticated' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

export function permit(...roles) {
  return async (req, res, next) => {
    if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });
    const user = await User.findById(req.user.id).lean();
    if (!user) return res.status(401).json({ success: false, message: 'User not found' });
    if (!roles.includes(user.role)) return res.status(403).json({ success: false, message: 'Forbidden' });
    next();
  };
}
