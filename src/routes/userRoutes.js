import express from 'express';
import {getMyProfile, getUsers, getUserById, uploadAvatar} from '../controllers/userController.js';
import {getUserGamesByStatus} from '../controllers/libraryController.js';
import {getUserReviews} from '../controllers/reviewController.js';
import {verifyToken} from '../middlewares/authMiddleware.js';
import {upload} from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.get('/', getUsers);

router.get('/me', verifyToken, getMyProfile);
router.patch('/me/avatar', verifyToken, upload.single('avatar'), uploadAvatar);

router.get('/:id', getUserById);

router.get('/:id/games/:status', getUserGamesByStatus);
router.get('/:id/reviews', getUserReviews);

export default router;