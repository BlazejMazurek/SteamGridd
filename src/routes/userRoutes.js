import express from 'express';
import { getMyProfile, getUsers, getUserById } from '../controllers/userController.js';
import { getUserGamesByStatus } from '../controllers/libraryController.js';
import { getUserReviews } from '../controllers/reviewController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getUsers);
router.get('/me', verifyToken, getMyProfile);
router.get('/:id', getUserById);

router.get('/:id/games/:status', getUserGamesByStatus);
router.get('/:id/reviews', getUserReviews);

export default router;