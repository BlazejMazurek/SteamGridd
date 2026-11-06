import prisma from '../config/db.js';

export const getDevelopers = async (req, res) => {
    try {
        const developers = await prisma.developer.findMany({
            include: {
                _count: { select: { games: true } }
            },
            orderBy: { name: 'asc' }
        });
        res.json(developers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Nie udało się pobrać deweloperów :(' });
    }
};

export const getDeveloperById = async (req, res) => {
    const { id } = req.params;
    try {
        const developer = await prisma.developer.findUnique({
            where: { id: Number(id) },
            include: {
                games: {
                    include: { publisher: true, genres: true }
                }
            }
        });
        if (!developer) {
            return res.status(404).json({ error: 'Nie znaleziono dewelopera :(' });
        }
        res.json(developer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Błąd podczas pobierania dewelopera :(' });
    }
};