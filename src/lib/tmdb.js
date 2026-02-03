// lib/tmdb.js
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export const getTMDBData = async (title) => {
  if (!title) return { banner: null, logo: null };
  try {
    const searchRes = await fetch(
      `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(title)}`
    );
    const searchData = await searchRes.json();
    const result = searchData.results?.[0];

    if (!result) return { banner: null, logo: null };

    // Logo nikalne ke liye detail fetch karni parti hai
    const detailRes = await fetch(
      `https://api.themoviedb.org/3/${result.media_type}/${result.id}/images?api_key=${API_KEY}`
    );
    const detailData = await detailRes.json();
    
    // English logo dhoondo
    const logo = detailData.logos?.find(l => l.iso_639_1 === 'en' || !l.iso_639_1);

    return {
      banner: result.backdrop_path ? `https://image.tmdb.org/t/p/w1280${result.backdrop_path}` : null,
      logo: logo ? `https://image.tmdb.org/t/p/w500${logo.file_path}` : null 
    };
  } catch (error) {
    return { banner: null, logo: null };
  }
};