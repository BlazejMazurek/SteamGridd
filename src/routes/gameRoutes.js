import express from 'express';
import {getGames, getGameByAppId, createGame, deleteGame} from '../controllers/gameController.js';

const router = express.Router();

router.get('/', getGames);
router.get('/steam/:appId', getGameByAppId);
router.post('/', createGame);
router.delete('/', deleteGame);

export default router;