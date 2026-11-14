import prisma from '../config/db.js';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export const getMyProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                email: true,
                avatarUrl: true,
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
                avatarUrl: true,
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
                avatarUrl: true,
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

export const uploadAvatar = async (req, res) => {
    try {
        const userId = Number(req.user.userId);

        if (!req.file) {
            return res.status(400).json({ error: 'Nie przesłano pliku ze zdjęciem.' });
        }

        const uploadDir = path.resolve('uploads', 'avatars');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const currentUser = await prisma.user.findUnique({ where: { id: userId } });
        if (currentUser?.avatarUrl) {
            const oldFileName = currentUser.avatarUrl.split('/').pop();
            const oldFilePath = path.join(uploadDir, oldFileName);
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
        }

        const filename = `avatar-${userId}-${Date.now()}.webp`;
        const outputPath = path.join(uploadDir, filename);

        await sharp(req.file.buffer)
            .resize(250, 250, { fit: 'cover' })
            .webp({ quality: 85 })
            .toFile(outputPath);

        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const avatarUrl = `${baseUrl}/uploads/avatars/${filename}`;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { avatarUrl },
            select: {
                id: true,
                username: true,
                avatarUrl: true
            }
        });

        res.status(200).json({
            message: 'Zdjęcie profilowe zostało zaktualizowane!',
            user: updatedUser
        });
    } catch (error) {
        console.error('Błąd podczas wgrywania awatara:', error);
        res.status(500).json({ error: 'Błąd serwera podczas zapisywania zdjęcia.' });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const userId = Number(req.user.userId);
        const { username, email, favoriteGenreId, favoriteGameAppIds } = req.body;

        if (username || email) {
            const existingUser = await prisma.user.findFirst({
                where: {
                    OR: [
                        username ? { username } : {},
                        email ? { email } : {}
                    ],
                    NOT: { id: userId }
                }
            });

            if (existingUser) {
                return res.status(400).json({ error: 'Nazwa użytkownika lub adres e-mail są już zajęte.' });
            }
        }

        let avatarUrl = undefined;

        if (req.file) {
            const uploadDir = path.resolve('uploads', 'avatars');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const currentUser = await prisma.user.findUnique({ where: { id: userId } });
            if (currentUser?.avatarUrl) {
                const oldFileName = currentUser.avatarUrl.split('/').pop();
                const oldFilePath = path.join(uploadDir, oldFileName);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }
            }

            const filename = `avatar-${userId}-${Date.now()}.webp`;
            const outputPath = path.join(uploadDir, filename);

            await sharp(req.file.buffer)
                .resize(250, 250, { fit: 'cover' })
                .webp({ quality: 85 })
                .toFile(outputPath);

            const baseUrl = `${req.protocol}://${req.get('host')}`;
            avatarUrl = `${baseUrl}/uploads/avatars/${filename}`;
        }

        const updateData = {};
        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (avatarUrl) updateData.avatarUrl = avatarUrl;
        
        if (favoriteGenreId !== undefined) {
            updateData.favoriteGenre = favoriteGenreId ? { connect: { id: Number(favoriteGenreId) } } : { disconnect: true };
        }

        if (favoriteGameAppIds && Array.isArray(favoriteGameAppIds)) {
            updateData.favoriteGames = {
                set: favoriteGameAppIds.map(appId => ({ appId: Number(appId) }))
            };
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                username: true,
                email: true,
                avatarUrl: true,
                favoriteGenre: { select: { id: true, name: true } },
                favoriteGames: { select: { appId: true, title: true, coverImage: true } }
            }
        });

        res.status(200).json({
            message: 'Profil został pomyślnie zaktualizowany!',
            user: updatedUser
        });
    } catch (error) {
        console.error('Błąd podczas aktualizacji profilu:', error);
        res.status(500).json({ error: 'Błąd serwera podczas aktualizacji profilu.' });
    }
};

export const getFavoriteStatus = async (req, res) => {

    try {

        const userId = req.user.userId;

        const appId = Number(req.params.appId);
 
        const found = await prisma.user.findFirst({

            where: { id: userId, favoriteGames: { some: { appId } } },

            select: { id: true }

        });
 
        res.status(200).json({ isFavorite: Boolean(found) });

    } catch (error) {

        console.error(error);

        res.status(500).json({ error: 'Błąd serwera podczas sprawdzania ulubionych.' });

    }

};
 
export const setFavorite = async (req, res) => {

    try {

        const userId = req.user.userId;

        const appId = Number(req.params.appId);

        const { value } = req.body;
 
        if (typeof value !== 'boolean') {

            return res.status(400).json({ error: 'Nieprawidłowe dane.' });

        }
 
        const game = await prisma.game.findUnique({ where: { appId } });

        if (!game) {

            return res.status(404).json({ error: 'Nie znaleziono gry.' });

        }
 
        if (value) {

            const alreadyFavorite = await prisma.user.findFirst({

                where: { id: userId, favoriteGames: { some: { appId } } },

                select: { id: true }

            });
 
            if (!alreadyFavorite) {

                const me = await prisma.user.findUnique({

                    where: { id: userId },

                    select: { _count: { select: { favoriteGames: true } } }

                });

                if (me._count.favoriteGames >= 4) {

                    return res.status(400).json({ error: 'Możesz mieć maksymalnie 4 ulubione gry.' });

                }

            }
 
            await prisma.user.update({

                where: { id: userId },

                data: { favoriteGames: { connect: { id: game.id } } }

            });

        } else {

            await prisma.user.update({

                where: { id: userId },

                data: { favoriteGames: { disconnect: { id: game.id } } }

            });

        }
 
        res.status(200).json({ isFavorite: value });

    } catch (error) {

        console.error(error);

        res.status(500).json({ error: 'Błąd serwera podczas zapisywania ulubionych.' });

    }

};
 