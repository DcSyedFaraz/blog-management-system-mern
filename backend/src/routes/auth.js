import express from 'express';
import { register, login, refresh, logout } from '../controllers/authController.js';
import verifyToken from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { registerSchema, loginSchema } from '../validators/authValidators.js';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', verifyToken, logout);

export default router;
