import express from 'express';
import { registerUser, loginUser, getUserProfile, logoutUser, getMe } from '../controllers/auth.controller.js';
import authMiddleware  from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile/:id',authMiddleware, getUserProfile);
router.post('/logout', logoutUser);
router.get('/me', authMiddleware, getMe);


export default router;
