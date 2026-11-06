import prisma from '../config/db.js';

export const getGames = async(req, res) => {
    try {
        const { title } = req.query;
        let games;
        
        const queryOptions = {
            include: {
                developer: true,
                publisher: true,
                genres: true,
                reviews: {
                    include: {
                        user: {
                            select: { username: true }
                        }
                    }
                }
            }
        };

        if (title) {
            queryOptions.where = {
                title: {
                    contains: title,
                    mode: 'insensitive',
                },
            };
        }

        games = await prisma.game.findMany(queryOptions);
        res.json(games);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Nie udało się pobrać gier z bazy :(' });
    }
};

export const getGameByAppId = async(req, res) => {
    const { appId } = req.params;

    try {
        const game = await prisma.game.findUnique({
            where: { appId: Number(appId) },
            include: {
                developer: true,
                publisher: true,
                genres: true,
                reviews: {
                    include: {
                        user: {
                            select: { username: true }
                        }
                    }
                }
            }
        });

        if (!game) {
            return res.status(404).json({ error: 'Nie znaleziono gry o podanym AppID :(' });
        }

        res.json(game);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Błąd podczas pobierania danych :(' });
    }
};

export const createGame = async(req, res) => {
    const { appId, title, description, releaseDate, coverImage, genres, publisher, developer } = req.body;

    try {
        const newGame = await prisma.game.create({
            data: {
                appId: Number(appId),
                title,
                description,
                releaseDate,
                coverImage,
                developer: developer ? {
                    connectOrCreate: {
                        where: { name: developer },
                        create: { name: developer }
                    }
                } : undefined,
                publisher: publisher ? {
                    connectOrCreate: {
                        where: { name: publisher },
                        create: { name: publisher }
                    }
                } : undefined,
                genres: genres ? {
                    connectOrCreate: genres.map(genreName => ({
                        where: { name: genreName },
                        create: { name: genreName }
                    }))
                } : undefined,
            },
            include: {
                developer: true,
                publisher: true,
                genres: true
            }
        });
        
        res.status(201).json({ message: 'Gra została dodana', game: newGame });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Podana gra już istnieje lub wystąpił błąd :(' });
    }
};

export const deleteGame = async(req, res) => {
    const { appId } = req.params;
    
    try {
        await prisma.game.delete({
            where: { appId: Number(appId) },
        });
        res.json({ message: 'Gra została usunięta' });
    } catch (error) {
        console.error(error);
        res.status(404).json({ error: 'Nie znaleziono gry o podanym AppID :(' });
    }
};