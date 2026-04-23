import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

export const getComments = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  const comments = await Comment.find({ post: req.params.id })
    .populate('author', 'name')
    .sort({ createdAt: -1 });
  res.json(comments);
};

export const addComment = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  const comment = await Comment.create({
    content: req.body.content,
    author: req.user._id,
    post: req.params.id,
  });
  await comment.populate('author', 'name');
  res.status(201).json(comment);
};
