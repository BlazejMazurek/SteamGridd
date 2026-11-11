import prisma from '../config/db.js';

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