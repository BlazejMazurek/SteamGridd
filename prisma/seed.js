import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

async function fetchWithRetry(url, retries = 5, delay = 3000) {
    for (let i = 0; i < retries; i++) {
        try {
            return await axios.get(url);
        } catch (err) {
            if (err.response && err.response.status === 429 && i < retries - 1) {
                console.log(`Limit żądań (429) dla ${url}. Czekam ${delay}ms przed ponowieniem...`);
                await new Promise(res => setTimeout(res, delay));
                delay *= 2;
            } else {
                throw err;
            }
        }
    }
}

async function main() {
    const appIdsToFetch = [
        461040, // np. Pico Park
    ];

    console.log(`Rozpoczynam pobieranie i instalowanie ${appIdsToFetch.length} gier do bazy...`);

    let successCount = 0;

    for (let i = 0; i < appIdsToFetch.length; i++) {
        const appId = appIdsToFetch[i];

        try {
            const detailsRes = await fetchWithRetry(`https://store.steampowered.com/api/appdetails?appids=${appId}`);
            const appData = detailsRes.data[appId.toString()];

            if (appData && appData.success && appData.data) {
                const data = appData.data;

                if (data.type !== 'game') continue;

                const title = data.name;
                const description = data.short_description || null;
                const releaseDate = data.release_date && data.release_date.date ? data.release_date.date : null;

                let coverImage = `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/library_600x900.jpg`;
                try {
                    await axios.head(coverImage);
                } catch {
                    coverImage = data.header_image || null;
                }

                const developerName = data.developers && data.developers.length > 0 ? data.developers[0] : null;
                const publisherName = data.publishers && data.publishers.length > 0 ? data.publishers[0] : null;
                const genresList = data.genres || [];

                const gameData = {
                    appId, // <-- appId jest teraz wewnątrz obiektu
                    title,
                    description,
                    releaseDate,
                    coverImage,
                    developer: developerName ? {
                        connectOrCreate: {
                            where: { name: developerName },
                            create: { name: developerName }
                        }
                    } : undefined,
                    publisher: publisherName ? {
                        connectOrCreate: {
                        where: { name: publisherName },
                        create: { name: publisherName }
                    }
                    } : undefined,
                    genres: {
                        connectOrCreate: genresList.map(g => ({
                            where: { name: g.description },
                            create: { name: g.description }
                        }))
                    }
                };

            await prisma.game.upsert({
                where: { appId },
                update: gameData,
                create: gameData
            });

                console.log(`[${i + 1}/${appIdsToFetch.length}] Zainstalowano / dodano grę: ${title} (AppID: ${appId})`);
                successCount++;
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (detailError) {
            console.error(`Błąd przy AppID ${appId}:`, detailError.message);
        }
    }

    console.log(`Zakończono! Pomyślnie przetworzono i zainstalowano ${successCount} gier.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });