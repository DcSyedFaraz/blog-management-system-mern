import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const getUsers = async (req, res) => {
  const users = await User.find().select('-password -refreshToken').sort({ createdAt: -1 });
  res.json(users);
};

export const updateUserRole = async (req, res) => {
  const { role } = req.body;
  if (!['admin', 'author'].includes(role))
    return res.status(400).json({ message: 'Invalid role. Must be admin or author.' });

  if (req.params.id === req.user._id.toString())
    return res.status(400).json({ message: 'You cannot change your own role.' });

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  ).select('-password -refreshToken');

  if (!user) return res.status(404).json({ message: 'User not found.' });
  res.json(user);
};

export const createUser = async (req, res) => {
  const { name, email, password, role = 'author' } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email already registered' });

  const user = await User.create({ name, email, password, role });
  res.status(201).json({
    _id: user._id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt,
  });
};

export const updateUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found.' });

  if (name) user.name = name;
  if (email && email !== user.email) {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });
    user.email = email;
  }
  if (password) user.password = password;
  if (role && req.params.id !== req.user._id.toString()) user.role = role;

  await user.save();
  res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt });
};

export const deleteUser = async (req, res) => {
  if (req.params.id === req.user._id.toString())
    return res.status(400).json({ message: 'You cannot delete your own account.' });

  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found.' });
  res.json({ message: 'User deleted successfully.' });
};
