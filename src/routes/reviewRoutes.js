import express from 'express';
import { createReview, getGameReviews } from '../controllers/reviewController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.get('/games/:gameId/reviews', getGameReviews);
router.post('/reviews', verifyToken, createReview);

export default router;