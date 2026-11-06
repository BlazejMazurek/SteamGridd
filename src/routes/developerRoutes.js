import express from 'express';
import { getDevelopers, getDeveloperById } from '../controllers/developerController.js';

const router = express.Router();

router.get('/', getDevelopers);
router.get('/:id', getDeveloperById);

export default router;