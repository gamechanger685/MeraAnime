'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from '@/firebase'; 
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext'; 
import { Activity, Play, Star, User } from 'lucide-react';
import HeroSlider from '@/components/HeroSlider';
import { getTMDBData } from '@/lib/tmdb';

export default function Home() {
  const [enrichedData, setEnrichedData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const router = useRouter();
  const { themeColor } = useTheme();

  useEffect(() => {
    const loadData = async () => {
      try {
        const querySnapshot = await getDocs(query(collection(db, "anime"), limit(20)));
        const list = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // Placeholder loading image
          landscapeImg: 'https://placehold.co/600x400/050505/FFF?text=Loading+Neural+Grid...' 
        }));

        setEnrichedData(list);
        setIsLoading(false);

        // TMDB Enrichment (Background)
        list.forEach(async (anime, index) => {
          const tmdb = await getTMDBData(anime.title || anime.animeTitle);
          if (tmdb?.banner) {
            setEnrichedData(prev => {
              const updated = [...prev];
              if (updated[index]) updated[index].landscapeImg = tmdb.banner;
              return updated;
            });
          }
        });
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) return <div className="h-screen flex items-center justify-center bg-[#050505]"><Activity className="animate-spin" color={themeColor} /></div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      {/* 1. HERO SLIDER */}
      <div className="relative w-full">
        <HeroSlider animeData={enrichedData.slice(0, 5)} themeColor={themeColor} />
      </div>

      <div className="px-4 md:px-10 py-12 max-w-[1600px] mx-auto">
        {/* 2. PREMIUM CATEGORY BAR */}
        <div className="flex gap-4 overflow-x-auto pb-10 no-scrollbar">
          {['All', 'Action', 'Movie', 'Hindi Dub'].map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[2px] transition-all border ${
                activeCategory === cat ? 'bg-white text-black border-white scale-105' : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 3. NEURAL LIBRARY (Netflix Landscape Style) */}
        <div className="flex items-center gap-4 mb-8">
           <h3 className="text-2xl md:text-4xl font-[1000] italic uppercase tracking-tighter italic">Neural Library</h3>
           <div className="flex-1 h-[2px] bg-gradient-to-r from-white/20 to-transparent"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {enrichedData.map((anime) => (
            <div 
              key={anime.id} 
              className="group cursor-pointer"
              onClick={() => router.push(`/anime/${anime.id}`)}
            >
              {/* TMDB Image Container */}
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/5 bg-zinc-900 shadow-2xl transition-all duration-500 group-hover:border-theme/40">
                <img 
                  src={anime.landscapeImg} 
                  onError={(e) => {
                   // Agar TMDB fail ho toh Jikan wali poster dikhao, wo bhi fail ho toh placeholder
                   e.target.src = anime.poster || 'https://placehold.co/600x400/050505/FFF?text=No+Image';
                  }}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" 
                  alt="${anime.title} Hindi Dubbed Stream & Download"
                />
                
                {/* Overlay Info */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                
                <div className="absolute bottom-4 left-4">
                   <div className="flex items-center gap-2 mb-1">
                      <span className="bg-white/10 backdrop-blur-md text-[9px] px-2 py-0.5 rounded font-bold border border-white/10 uppercase tracking-tighter">HD • {anime.type || 'TV'}</span>
                   </div>
                </div>
              </div>

              {/* Title & Metadata */}
              <div className="mt-4 px-1">
                <h4 className="font-black text-lg md:text-xl uppercase truncate tracking-tight group-hover:text-theme transition-colors">
                  {anime.title || anime.animeTitle}
                </h4>
                <div className="flex items-center gap-3 mt-1 text-[11px] font-bold text-zinc-500">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star size={12} fill="currentColor" />
                    <span>{anime.score || '8.5'}</span>
                  </div>
                  <span>•</span>
                  <span className="uppercase tracking-widest text-zinc-400">Sci-Fi • Action</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}