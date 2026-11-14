import prisma from '../config/db.js';
const FIELDS = ['isPlayed', 'isCompleted', 'isLiked', 'isQueued'];

export const getUserGamesByStatus = async (req, res) => {
    try {
        const userId = Number(req.params.id);
        const {status} = req.params;

        const statusMap = {
            'queued': 'isQueued',
            'completed': 'isCompleted',
            'liked': 'isLiked',
            'played': 'isPlayed'
        };

        const dbField = statusMap[status];

        if (!dbField) {
            return res.status(400).json({ error: 'Nieprawidłowy status gry.' });
        }

        const userGames = await prisma.userGame.findMany({
            where: {
                userId: userId,
                [dbField]: true
            },
            orderBy: { id: 'desc' },
            include: {
                game: {
                    select: {
                        appId: true,
                        title: true,
                        coverImage: true,
                        releaseDate: true
                    }
                }
            }
        });

        const games = userGames.map(item => item.game);
        
        res.status(200).json(games);
    } catch (error) {
        console.error("Błąd podczas pobierania gier użytkownika po statusie:", error);
        res.status(500).json({ error: 'Błąd serwera podczas pobierania gier.' });
    }
};

export const getGameStatus = async (req, res) => {
    try {
        const userId = req.user.userId;
        const game = await prisma.game.findUnique({
            where: { appId: Number(req.params.appId) }
        });
        if (!game) return res.status(404).json({ error: 'Nie znaleziono gry.' });

        const entry = await prisma.userGame.findUnique({
            where: { userId_gameId: { userId, gameId: game.id } }
        });

        res.json({
            isPlayed: entry ? entry.isPlayed : false,
            isCompleted: entry ? entry.isCompleted : false,
            isLiked: entry ? entry.isLiked : false,
            isQueued: entry ? entry.isQueued : false
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Błąd podczas pobierania statusu gry.' });
    }
};

export const setGameStatus = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { field, value } = req.body;

        if (!FIELDS.includes(field) || typeof value !== 'boolean') {
            return res.status(400).json({ error: 'Nieprawidłowe dane.' });
        }

        const game = await prisma.game.findUnique({
            where: { appId: Number(req.params.appId) }
        });
        if (!game) return res.status(404).json({ error: 'Nie znaleziono gry.' });

        const entry = await prisma.userGame.upsert({
            where: { userId_gameId: { userId, gameId: game.id } },
            create: { userId, gameId: game.id, [field]: value },
            update: { [field]: value }
        });

        res.json(entry);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Błąd podczas zapisywania statusu gry.' });
    }
};