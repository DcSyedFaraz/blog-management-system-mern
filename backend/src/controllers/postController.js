import Post from '../models/Post.js';

export const getPublicPosts = async (req, res) => {
  const { page = 1, limit = 10, search, sortBy = 'createdAt' } = req.query;
  const filter = { status: 'published' };

  if (search) filter.$text = { $search: search };

  const total = await Post.countDocuments(filter);
  const posts = await Post.find(filter)
    .populate('author', 'name')
    .sort({ [sortBy]: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({
    posts,
    pagination: {
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  });
};

export const getMyPosts = async (req, res) => {
  const { page = 1, limit = 10, search, status, sortBy = 'createdAt' } = req.query;
  const filter = { author: req.user._id };

  if (status) filter.status = status;
  if (search) filter.$text = { $search: search };

  const total = await Post.countDocuments(filter);
  const posts = await Post.find(filter)
    .populate('author', 'name')
    .sort({ [sortBy]: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({
    posts,
    pagination: {
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  });
};

export const getAllPosts = async (req, res) => {
  const { page = 1, limit = 10, search, status, sortBy = 'createdAt' } = req.query;
  const filter = {};

  if (status) filter.status = status;
  if (search) filter.$text = { $search: search };

  const total = await Post.countDocuments(filter);
  const posts = await Post.find(filter)
    .populate('author', 'name email')
    .sort({ [sortBy]: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({
    posts,
    pagination: {
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  });
};

export const getPost = async (req, res) => {
  const post = await Post.findById(req.params.id).populate('author', 'name email');
  if (!post) return res.status(404).json({ message: 'Post not found' });
  res.json(post);
};

export const createPost = async (req, res) => {
  const post = await Post.create({ ...req.body, author: req.user._id });
  res.status(201).json(post);
};

export const updatePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin')
    return res.status(403).json({ message: 'Not authorized to update this post' });

  const updated = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.json(updated);
};

export const deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin')
    return res.status(403).json({ message: 'Not authorized to delete this post' });

  await post.deleteOne();
  res.json({ message: 'Post deleted successfully' });
};

export const updatePostStatus = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin')
    return res.status(403).json({ message: 'Not authorized' });

  post.status = req.body.status;
  await post.save();
  res.json(post);
};
