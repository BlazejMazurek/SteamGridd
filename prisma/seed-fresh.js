import { PrismaClient } from '@prisma/client';
import axios from 'axios';
const prisma = new PrismaClient();

// Numery AppID wybranych premier ze Steama
const targetAppIds = [
    3357650,
    2416450,
    3008130,
    3405340,
];

async function seedFreshGames() {
  for (const appId of targetAppIds) {
    try {
      const res = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${appId}`);
      const data = res.data[appId]?.data;

      if (data && data.type === 'game') {
        const coverImage = `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${appId}/library_600x900.jpg`;
        
        await prisma.game.upsert({
          where: { appId: Number(appId) },
          update: {},
          create: {
            appId: Number(appId),
            title: data.name,
            description: data.short_description || '',
            coverImage: coverImage,
            releaseDate: data.release_date?.date || '',
            developer: data.developers?.[0] || 'Unknown',
            publisher: data.publishers?.[0] || 'Unknown',
            genre: data.genres?.[0]?.description || 'Indie'
          }
        });
        console.log(`Dodano świeżaka: ${data.name}`);
      }
    } catch (e) {
      console.error(`Błąd przy ${appId}:`, e.message);
    }
  }
}

seedFreshGames().finally(() => prisma.$disconnect());