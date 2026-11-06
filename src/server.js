import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import gameRoutes from './routes/gameRoutes.js';
import authRoutes from './routes/authRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js';
import genreRoutes from './routes/genreRoutes.js';
import publisherRoutes from './routes/publisherRoutes.js';
import developerRoutes from './routes/developerRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({message: 'Backend działa pomyślnie!'});
});

app.use('/api/games', gameRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', reviewRoutes);
app.use('/api', genreRoutes);
app.use('/api/publishers', publisherRoutes);
app.use('/api/developers', developerRoutes);

app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
});