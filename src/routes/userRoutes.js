import express from 'express';
import { getMyProfile, getUsers, getUserById } from '../controllers/userController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getUsers);
router.get('/me', verifyToken, getMyProfile);
router.get('/:id', getUserById);

export default router;