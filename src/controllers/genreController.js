import prisma from '../config/db.js';

export const getGenres = async (req, res) => {
    try {
        const genres = await prisma.genre.findMany({
            include: {
                _count: {
                    select: { games: true }
                }
            }
        });
        res.json(genres);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Nie udało się pobrać gatunków :(' });
    }
};

export const getGenreBySlugOrId = async (req, res) => {
    const { id } = req.params;
    try {
        const genre = await prisma.genre.findUnique({
            where: { id: Number(id) },
            include: {
                games: {
                    include: {
                        developer: true,
                        publisher: true
                    }
                }
            }
        });

        if (!genre) {
            return res.status(404).json({ error: 'Nie znaleziono takiego gatunku :(' });
        }

        res.json(genre);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Błąd podczas pobierania gatunku :(' });
    }
};