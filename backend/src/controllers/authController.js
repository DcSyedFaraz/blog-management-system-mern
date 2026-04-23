import User from '../models/User.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../config/jwt.js';

// Shared helper: builds both tokens from the user document.
// Called on register, login, and refresh so the payload shape stays consistent.
const tokenResponse = (user, res) => {
  const payload = { id: user._id, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  return { accessToken, refreshToken };
};

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: 'Email already registered' });

  // role is stripped by the Joi registerSchema (Joi.string().forbidden()),
  // so this always creates an author regardless of what the client sends.
  const user = await User.create({ name, email, password, role });
  const { accessToken, refreshToken } = tokenResponse(user, res);

  // Persist the refresh token so /auth/refresh can validate it against the DB,
  // making single-device logout possible by clearing this field.
  user.refreshToken = refreshToken;
  await user.save();

  res.status(201).json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    accessToken,
    refreshToken,
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  // Deliberate combined check: same 401 for "no user" and "wrong password"
  // so the response doesn't reveal whether the email exists.
  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: 'Invalid credentials' });

  const { accessToken, refreshToken } = tokenResponse(user, res);
  user.refreshToken = refreshToken;
  await user.save();

  res.json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    accessToken,
    refreshToken,
  });
};

export const refresh = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: 'Refresh token required' });

  // verifyRefreshToken throws on expiry/tampering — express-async-errors
  // forwards that to the global errorHandler automatically.
  const decoded = verifyRefreshToken(refreshToken);
  const user = await User.findById(decoded.id);

  // DB check ensures that a previously-issued token can't be replayed after logout
  // (logout nullifies user.refreshToken).
  if (!user || user.refreshToken !== refreshToken)
    return res.status(403).json({ message: 'Invalid refresh token' });

  // Rotate: issue new pair and overwrite the stored token (old one is now invalid).
  const payload = { id: user._id, role: user.role };
  const newAccessToken = signAccessToken(payload);
  const newRefreshToken = signRefreshToken(payload);
  user.refreshToken = newRefreshToken;
  await user.save();

  res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
};

export const logout = async (req, res) => {
  // Nullify stored refresh token so replayed tokens are rejected by /auth/refresh.
  req.user.refreshToken = null;
  await req.user.save();
  res.json({ message: 'Logged out' });
};
