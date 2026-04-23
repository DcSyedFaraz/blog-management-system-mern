import { verifyAccessToken } from '../config/jwt.js';
import User from '../models/User.js';

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.split(' ')[1]
    : null;

  if (!token) return res.status(401).json({ message: 'No token provided' });

  const decoded = verifyAccessToken(token);
  req.user = await User.findById(decoded.id).select('-password -refreshToken');
  if (!req.user) return res.status(401).json({ message: 'User not found' });
  next();
};

export default verifyToken;
