import { db } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';

export async function GET() {
  const querySnapshot = await getDocs(collection(db, "anime"));
  const episodes = querySnapshot.docs.map(doc => doc.id);

  const baseUrl = 'https://meraanime.vercel.app';

  // Har anime ke liye URL generate karna
  const urls = episodes.map(id => `
    <url>
      <loc>${baseUrl}/portal?animeId=${id}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.8</priority>
    </url>
  `).join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
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