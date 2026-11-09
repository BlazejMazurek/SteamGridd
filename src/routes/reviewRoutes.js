import express from 'express';
import {createReview, getGameReviews} from '../controllers/reviewController.js';
import {verifyToken} from '../middlewares/authMiddleware.js';
import {upload} from '../middlewares/uploadMiddleware.js';

const router = express.Router();
router.get('/games/:appId/reviews', getGameReviews);
router.post('/reviews', verifyToken, upload.single('image'), createReview);

export default router;