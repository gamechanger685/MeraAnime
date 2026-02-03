'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Star, TrendingUp } from 'lucide-react'; // Zap ki jagah TrendingUp (Aapki choice)
import { useTheme } from '@/context/ThemeContext';
import { getTMDBData } from '@/lib/tmdb';

const HeroSlider = ({ animeData }) => {
  const [current, setCurrent] = useState(0);
  const [assets, setAssets] = useState({});
  const { themeColor } = useTheme();
  const router = useRouter();
  const SLIDE_DURATION = 8000;

  // 1. Deduplication & 5 Slide Limit (Aapka Original Logic + Latest First)
  const filteredSlides = useMemo(() => {
    if (!animeData || !Array.isArray(animeData)) return [];
    
    const uniqueAnimes = [];
    const seenIds = new Set();

    // Latest Entries Pehle (Reverse logic)
    const latestFirstArray = [...animeData].reverse();

    for (const anime of latestFirstArray) {
      const id = String(anime.mal_id || anime.id);
      if (!seenIds.has(id)) {
        uniqueAnimes.push(anime);
        seenIds.add(id);
      }
      if (uniqueAnimes.length === 5) break;
    }
    return uniqueAnimes;
  }, [animeData]);

  // 2. Load Assets (Aapka Logic + Advanced Error Handling)
  useEffect(() => {
    if (filteredSlides.length === 0) return;
    
    const loadHeroAssets = async () => {
      const updatedAssets = {};
      
      // Saare fetch ek saath (Parallel)
      const fetchPromises = filteredSlides.map(async (anime) => {
        if (assets[anime.mal_id]) return null; 

        try {
          const data = await getTMDBData(anime.title || anime.animeTitle);
          return { 
            id: anime.mal_id, 
            banner: data?.banner || anime.images?.jpg?.large_image_url || anime.poster || anime.landscapeImg,
            logo: data?.logo || null 
          };
        } catch (e) {
          return { 
            id: anime.mal_id, 
            banner: anime.images?.jpg?.large_image_url || anime.poster || anime.landscapeImg,
            logo: null 
          };
        }
      });

      const results = await Promise.all(fetchPromises);
      results.forEach(res => {
        if (res) updatedAssets[res.id] = { banner: res.banner, logo: res.logo };
      });
      
      setAssets(prev => ({ ...prev, ...updatedAssets }));
    };

    loadHeroAssets();
  }, [filteredSlides]);

  const slides = useMemo(() => {
    return filteredSlides.map(item => ({
      ...item,
      displayImage: assets[item.mal_id]?.banner || item.images?.jpg?.large_image_url || item.poster || item.landscapeImg,
      displayLogo: assets[item.mal_id]?.logo
    }));
  }, [filteredSlides, assets]);

  const next = useCallback(() => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  useEffect(() => {
    const interval = setInterval(next, SLIDE_DURATION);
    return () => clearInterval(interval);
  }, [next]);

  if (!slides.length) return null;

  return (
    <section className="relative w-full h-[65vh] lg:h-[85vh] bg-[#050505] overflow-hidden select-none">
      
      {/* LAYER 1: CINEMATIC BACKGROUND */}
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={slides[current].mal_id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <img 
            src={slides[current].displayImage} 
            className="w-full h-full object-cover object-center lg:object-[center_20%] opacity-60" 
            alt="Anime Banner"
            style={{ animation: 'kenburns 20s linear infinite' }}
          />
          
          {/* ADVANCED CINEMATIC GRADIENTS */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/60 to-transparent hidden lg:block w-[70%]" />
          <div className="absolute inset-0 bg-black/30 lg:hidden" />
        </motion.div>
      </AnimatePresence>

      {/* LAYER 2: Content (Logo & Text) */}
      <div className="relative z-20 h-full max-w-[1400px] mx-auto px-6 sm:px-12 flex flex-col justify-end pb-16 lg:justify-center lg:pb-0">
        <div className="w-full lg:w-[55%] flex flex-col items-start space-y-6">

          {/* Badges */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={`badge-${current}`}
            className="flex items-center gap-3"
          >
            <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-sm text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2 border border-white/5">
              <TrendingUp size={12} style={{ color: themeColor }} className="animate-pulse" /> Trending
            </span>
            <span className="flex items-center gap-1.5 text-white font-bold text-sm bg-black/40 px-2 py-1 rounded border border-white/5">
              <Star size={14} fill="#FFD700" stroke="#FFD700" /> {slides[current].score || "8.5"}
            </span>
          </motion.div>

          {/* Logo with Dynamic Reveal */}
          <motion.div 
            key={`logo-${current}`}
            initial={{ opacity: 0, x: -50, filter: 'blur(10px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {slides[current].displayLogo ? (
              <div className="relative">
                <div className="absolute inset-0 bg-black/40 blur-3xl rounded-full scale-125 -z-10" />
                <img 
                  src={slides[current].displayLogo} 
                  alt={slides[current].title}
                  className="max-h-[80px] sm:max-h-[120px] lg:max-h-[160px] w-auto object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]"
                />
              </div>
            ) : (
              <h1 className="text-5xl lg:text-7xl font-black text-white uppercase italic leading-none tracking-tighter drop-shadow-2xl">
                {slides[current].title || slides[current].animeTitle}
              </h1>
            )}
          </motion.div>

          <motion.p 
            key={`synopsis-${current}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/80 text-sm lg:text-base max-w-lg font-medium line-clamp-2 lg:line-clamp-3 leading-relaxed drop-shadow-md"
          >
            {slides[current].synopsis || "Experience the next level of storytelling. Watch the latest episodes in stunning high definition."}
          </motion.p>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-4">
            <button 
              onClick={() => router.push(`/anime/${slides[current].mal_id}`)}
              style={{ backgroundColor: themeColor }}
              className="group relative flex items-center gap-3 text-black px-10 py-4 rounded-sm font-black uppercase text-xs tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
              <Play size={18} fill="black" /> Watch Now
            </button>
            <div className="flex gap-2">
              <button onClick={prev} className="p-4 bg-white/5 hover:bg-white/15 backdrop-blur-sm rounded-sm text-white transition-all border border-white/5 group">
                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              </button>
              <button onClick={next} className="p-4 bg-white/5 hover:bg-white/15 backdrop-blur-sm rounded-sm text-white transition-all border border-white/5 group">
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Progress Bar (Crunchyroll Style) */}
          <div className="flex gap-3 w-full max-w-[300px] pt-6">
            {slides.map((_, i) => (
              <div 
                key={i} 
                className="h-[4px] flex-1 bg-white/10 rounded-full overflow-hidden cursor-pointer group"
                onClick={() => setCurrent(i)}
              >
                {current === i && (
                  <motion.div
                    className="h-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: SLIDE_DURATION / 1000, ease: "linear" }}
                    style={{backgroundColor: themeColor}}
                  />
                )}
                {i < current && <div className="h-full w-full opacity-60" style={{backgroundColor: themeColor}} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes kenburns { 
          0% { transform: scale(1) translate(0, 0); } 
          50% { transform: scale(1.1) translate(-1%, -0.5%); }
          100% { transform: scale(1.15) translate(-2%, -1%); } 
        }
      `}</style>
    </section>
  );
};

export default HeroSlider;