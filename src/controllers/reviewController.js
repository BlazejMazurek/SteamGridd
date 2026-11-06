import prisma from '../config/db.js';

export const createReview = async (req, res) => {
    try {
        const { rating, comment,imageUrl, gameId } = req.body;
        const userId = req.user.userId;
        const numRating = Number(rating);

        if (isNaN(numRating) || numRating < 0.5 || numRating > 5.0 || (numRating * 2) % 1 !== 0) {
            return res.status(400).json({ error: 'Ocena musi być w przedziale od 0.5 do 5.0'});
        }

        if (!gameId) {
            return res.status(400).json({ error: 'ID gry jest wymagane.' });
        }

        const gameExists = await prisma.game.findUnique({
            where: { id: Number(gameId) }
        });

        if (!gameExists) {
            return res.status(404).json({ error: 'Nie znaleziono takiej gry w bazie.' });
        }

        const existingReview = await prisma.review.findFirst({
            where: {
                userId: Number(userId),
                gameId: Number(gameId)
            }
        });

        if (existingReview) {
            return res.status(400).json({ error: 'Już dodałeś recenzję dla tej gry.' });
        }

        const newReview = await prisma.review.create({
            data: {
                rating: Number(rating),
                comment,
                imageUrl,
                userId: Number(userId),
                gameId: Number(gameId)
            },
            include: {
                user: {
                    select: { username: true } 
                }
            }
        });

        res.status(201).json({
            message: 'Recenzja została dodana pomyślnie!',
            review: newReview
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Błąd podczas dodawania recenzji.' });
    }
};

export const getGameReviews = async (req, res) => {
    try {
        const { gameId } = req.params;

        const reviews = await prisma.review.findMany({
            where: { gameId: Number(gameId) },
            include: {
                user: {
                    select: { username: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Błąd podczas pobierania recenzji.' });
    }
};