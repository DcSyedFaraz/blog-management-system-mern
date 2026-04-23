import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['admin', 'author'], default: 'author' },
    // Stored so logout can invalidate tokens without a separate token blacklist table.
    refreshToken: { type: String, default: null },
  },
  { timestamps: true }
);

// Hash password before insert or update. The isModified guard prevents
// re-hashing an already-hashed value when other fields are saved.
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
