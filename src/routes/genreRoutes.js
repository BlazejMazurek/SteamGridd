import express from 'express';
import { getGenres, getGenreBySlugOrId } from '../controllers/genreController.js';

const router = express.Router();

router.get('/', getGenres);
router.get('/:id', getGenreBySlugOrId);

export default router;