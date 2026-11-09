import prisma from '../config/db.js';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export const createReview = async (req, res) => {
    try {
        const { rating, comment, appId } = req.body;
        const userId = req.user.userId;
        const numRating = Number(rating);

        if (isNaN(numRating) || numRating < 0.5 || numRating > 5.0 || (numRating * 2) % 1 !== 0) {
            return res.status(400).json({ error: 'Ocena musi być w przedziale od 0.5 do 5.0'});
        }

        if (!gameId) {
            return res.status(400).json({ error: 'ID gry jest wymagane.' });
        }

        const gameExists = await prisma.game.findUnique({
            where: { appId: Number(appId) }
        });

        if (!gameExists) {
            return res.status(404).json({ error: 'Nie znaleziono takiej gry w bazie.' });
        }

        const existingReview = await prisma.review.findFirst({
            where: {
                userId: Number(userId),
                appId: Number(appId)
            }
        });

        if (existingReview) {
            return res.status(400).json({ error: 'Już dodałeś recenzję dla tej gry.' });
        }

        let imageUrl = null;

        if (req.file) {
            const uploadDir = path.resolve('uploads');
            if (!fs.existsSync(uploadDir)) {
                fs.existsSync(uploadDir) || fs.mkdirSync(uploadDir, { recursive: true });
            }

            const filename = `review-${userId}-${Date.now()}.webp`;
            const outputPath = path.join(uploadDir, filename);

            await sharp(req.file.buffer)
                .resize({ width: 800, withoutEnlargement: true })
                .webp({ quality: 80 })
                .toFile(outputPath);

            const baseUrl = `${req.protocol}://${req.get('host')}`;
            imageUrl = `${baseUrl}/uploads/${filename}`;
        }

        const newReview = await prisma.review.create({
            data: {
                rating: Number(rating),
                comment,
                imageUrl,
                user: {
                    connect: {id: Number(userId)}
                },
                game: {
                    connect: {appId: Number(appId)} 
                }
            },
            include: {
                user: {
                    select: { username: true } 
                },
                game: true
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
        const {appId} = req.params;
        const reviews = await prisma.review.findMany({
            where: {
                game: {
                    appId: Number(appId)
                }
            },
            include: {
                user: {
                    select: { username: true }
                },
                game: true
            }
        });
        res.json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Błąd podczas pobierania recenzji.' });
    }
};