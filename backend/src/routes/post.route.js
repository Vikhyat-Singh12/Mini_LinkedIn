import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import upload from '../utils/upload.js';
import {
  createPost,
  getAllPosts,
  getUserPosts
} from '../controllers/post.controller.js';

const router = express.Router();

router.get('/', getAllPosts);
router.get('/user/:userId', getUserPosts);
router.post('/create', authMiddleware, upload.single('image'), createPost);

export default router;
