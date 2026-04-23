import express from 'express';
import {
  getPublicPosts,
  getMyPosts,
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  updatePostStatus,
} from '../controllers/postController.js';
import { getComments, addComment } from '../controllers/commentController.js';
import verifyToken from '../middleware/auth.js';
import authorizeRoles from '../middleware/authorize.js';
import validate from '../middleware/validate.js';
import {
  createPostSchema,
  updatePostSchema,
  statusSchema,
  commentSchema,
} from '../validators/postValidators.js';

const router = express.Router();

// Public
router.get('/', getPublicPosts);
router.get('/:id', getPost);

// Authenticated
router.get('/user/my', verifyToken, getMyPosts);
router.post('/', verifyToken, authorizeRoles('admin', 'author'), validate(createPostSchema), createPost);
router.put('/:id', verifyToken, validate(updatePostSchema), updatePost);
router.delete('/:id', verifyToken, deletePost);
router.patch('/:id/status', verifyToken, validate(statusSchema), updatePostStatus);

// Admin-only: all posts
router.get('/admin/all', verifyToken, authorizeRoles('admin'), getAllPosts);

// Comments
router.get('/:id/comments', getComments);
router.post('/:id/comments', verifyToken, validate(commentSchema), addComment);

export default router;
