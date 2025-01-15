import express from 'express';
import { getPosts, createPost, likePost } from '../controllers/posts.js';

const router = express.Router();

router.get('/posts', getPosts);
router.post('/posts/create', createPost);
router.post('/posts/like/:id', likePost);

export default router;
