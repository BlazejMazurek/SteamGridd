import express from 'express';
import { getPublishers, getPublisherById } from '../controllers/publisherController.js';

const router = express.Router();

router.get('/', getPublishers);
router.get('/:id', getPublisherById);

export default router;