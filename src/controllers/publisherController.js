import prisma from '../config/db.js';

export const getPublishers = async (req, res) => {
    try {
        const publishers = await prisma.publisher.findMany({
            include: {
                _count: { select: { games: true } }
            },
            orderBy: { name: 'asc' }
        });
        res.json(publishers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Nie udało się pobrać wydawców :(' });
    }
};

export const getPublisherById = async (req, res) => {
    const { id } = req.params;
    try {
        const publisher = await prisma.publisher.findUnique({
            where: { id: Number(id) },
            include: {
                games: {
                    include: { developer: true, genres: true }
                }
            }
        });
        if (!publisher) {
            return res.status(404).json({ error: 'Nie znaleziono wydawcy :(' });
        }
        res.json(publisher);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Błąd podczas pobierania wydawcy :(' });
    }
};