import { verifyAccessToken } from '../config/jwt.js';
import User from '../models/User.js';

// Validates the Bearer token and attaches the full user document to req.user.
// Fetching the user from DB (rather than trusting the JWT payload alone) ensures
// deleted accounts can't continue using valid tokens.
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.split(' ')[1]
    : null;

  if (!token) return res.status(401).json({ message: 'No token provided' });

  // verifyAccessToken throws JsonWebTokenError/TokenExpiredError on failure;
  // express-async-errors forwards those to the global errorHandler.
  const decoded = verifyAccessToken(token);
  req.user = await User.findById(decoded.id).select('-password -refreshToken');
  if (!req.user) return res.status(401).json({ message: 'User not found' });
  next();
};

export default verifyToken;
