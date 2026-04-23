import express from 'express';
import { getPostStats } from '../controllers/statsController.js';
import verifyToken from '../middleware/auth.js';
import authorizeRoles from '../middleware/authorize.js';

const router = express.Router();

router.get('/posts', verifyToken, authorizeRoles('admin'), getPostStats);

export default router;
