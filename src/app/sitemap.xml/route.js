import { db } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';

export async function GET() {
  const querySnapshot = await getDocs(collection(db, "anime"));
  
  // Data fetch karte waqt poster aur description bhi le lein
  const animeList = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  const baseUrl = 'https://meraanime.vercel.app';

  const urls = animeList.map(anime => `
    <url>
      <loc>${baseUrl}/portal?animeId=${anime.id}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
      <image:image>
        <image:loc>${anime.landscapeImg || anime.posterUrl || ''}</image:loc>
        <image:title>${anime.title || 'Anime'}</image:title>
      </image:image>
    </url>
  `).join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
      <url>
        <loc>${baseUrl}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>always</changefreq>
        <priority>1.0</priority>
      </url>
      ${urls}
    </urlset>`;

  return new Response(sitemap, {
    headers: { 'Content-Type': 'application/xml' },
  });
}