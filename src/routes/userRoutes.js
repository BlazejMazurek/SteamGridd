import express from 'express';
import {getMyProfile, getUsers, getUserById, uploadAvatar, updateProfile, getFavoriteStatus, setFavorite} from '../controllers/userController.js';
import {getUserGamesByStatus, getGameStatus, setGameStatus} from '../controllers/libraryController.js';
import {getUserReviews} from '../controllers/reviewController.js';
import {verifyToken} from '../middlewares/authMiddleware.js';
import {upload} from '../middlewares/uploadMiddleware.js';
 
const router = express.Router();
 
router.get('/', getUsers);
 
router.get('/me', verifyToken, getMyProfile);
router.patch('/me/avatar', verifyToken, upload.single('avatar'), uploadAvatar);
router.patch('/me', verifyToken, upload.single('avatar'), updateProfile);
 
router.get('/me/games/:appId', verifyToken, getGameStatus);
router.put('/me/games/:appId', verifyToken, setGameStatus);
 
router.get('/me/favorites/:appId', verifyToken, getFavoriteStatus);
router.put('/me/favorites/:appId', verifyToken, setFavorite);
 
router.get('/:id', getUserById);
 
router.get('/:id/games/:status', getUserGamesByStatus);
router.get('/:id/reviews', getUserReviews);
 
export default router;