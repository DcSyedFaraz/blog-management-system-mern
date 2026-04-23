import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    tags: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

postSchema.index({ title: 'text', tags: 'text' });

export default mongoose.model('Post', postSchema);
