import express from 'express';
import { getUsers, createUser, updateUser, updateUserRole, deleteUser } from '../controllers/userController.js';
import verifyToken from '../middleware/auth.js';
import authorizeRoles from '../middleware/authorize.js';

const router = express.Router();

router.get('/', verifyToken, authorizeRoles('admin'), getUsers);
router.post('/', verifyToken, authorizeRoles('admin'), createUser);
router.put('/:id', verifyToken, authorizeRoles('admin'), updateUser);
router.patch('/:id/role', verifyToken, authorizeRoles('admin'), updateUserRole);
router.delete('/:id', verifyToken, authorizeRoles('admin'), deleteUser);

export default router;
