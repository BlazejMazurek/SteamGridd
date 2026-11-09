import prisma from '../config/db.js';

export const getMyProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                email: true,
                createdAt: true,
                favoriteGenre: {
                    select: { id: true, name: true }
                },
                favoriteGames: {
                    select: { appId: true, title: true, coverImage: true }
                },
                reviews: {
                    include: {
                        game: {
                            select: { appId: true, title: true, coverImage: true }
                        }
                    }
                },
                library: {
                    include: {
                        game: {
                            select: { appId: true, title: true, coverImage: true, releaseDate: true }
                        }
                    }
                }
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'Nie znaleziono użytkownika.' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Błąd podczas pobierania profilu:", error);
        res.status(500).json({ error: 'Błąd serwera podczas pobierania profilu.' });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                favoriteGenre: { select: { name: true } },
                _count: { select: { reviews: true } }
            }
        });

        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Błąd serwera podczas pobierania użytkowników.' });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(req.params.id) },
            select: {
                id: true,
                username: true,
                favoriteGenre: { select: { id: true, name: true } },
                favoriteGames: { select: { appId: true, title: true, coverImage: true } },
                reviews: {
                    include: {
                        game: { select: { appId: true, title: true, coverImage: true } }
                    }
                }
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'Nie znaleziono użytkownika.' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Błąd serwera podczas pobierania użytkownika.' });
    }
};