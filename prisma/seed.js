import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Czysta lista kategorii bez duplikatów obcojęzycznych
const ALLOWED_GENRES = new Set([
    'Action',
    'Casual',
    'Indie',
    'Free To Play',
    'Adventure',
    'Animation & Modeling',
    'Video Production',
    'RPG',
    'Strategy',
    'Simulation',
    'Massively Multiplayer',
    'Racing',
    'Early Access',
    'Sports',
    'Violent',
    'Design & Illustration',
    'Game Development',
    'Photo Editing',
    'Utilities',
    'Audio Production',
    'Software Training',
    'Nudity',
    'Web Publishing',
    'Gore',
    'Education',
    'Movie',
    'Sexual Content',
    'Accounting'
]);

// Kategorie, które oznaczają grę jako 18+
const ADULT_GENRES = new Set([
    'Violent',
    'Nudity',
    'Gore',
    'Sexual Content'
]);

async function main() {
    // Najpierw upewniamy się, że wszystkie dozwolone kategorie istnieją w bazie
    for (const name of ALLOWED_GENRES) {
        await prisma.genre.upsert({
            where: { name },
            update: {},
            create: { name }
        });
    }

    const dbGenres = await prisma.genre.findMany({
        where: { name: { in: Array.from(ALLOWED_GENRES) } }
    });
    const genreByName = new Map(dbGenres.map(g => [g.name, g]));

    const games = await prisma.game.findMany({
        include: { genres: true }
    });

    console.log(`Sprawdzam ${games.length} gier...`);

    let updatedCount = 0;
    let adultCount = 0;

    for (const game of games) {
        // Zostawiamy tylko kategorie z dozwolonej listy
        const filteredGenres = game.genres.filter(g => ALLOWED_GENRES.has(g.name));

        // Sprawdzamy, czy gra ma jakąkolwiek kategorię 18+
        const hasAdultGenre = filteredGenres.some(g => ADULT_GENRES.has(g.name));

        await prisma.game.update({
            where: { id: game.id },
            data: {
                isAdultOnly: hasAdultGenre,
                genres: {
                    set: filteredGenres.map(g => ({ id: g.id }))
                }
            }
        });

        updatedCount++;
        if (hasAdultGenre) {
            adultCount++;
        }
    }

    console.log(`Zaktualizowano ${updatedCount} gier. Oznaczono jako 18+: ${adultCount}.`);
}

main()
    .catch((err) => {
        console.error('Błąd podczas aktualizacji gier:', err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });