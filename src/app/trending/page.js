'use client';
import React, { useState, useEffect } from 'react';
import { db } from '@/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { useTheme } from '@/context/ThemeContext'; 
import { TrendingUp, Star, Play, Zap, Award, Loader2, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function TrendingPage() {
  const [trendingAnime, setTrendingAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const { themeColor } = useTheme();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const q = query(
          collection(db, "anime"), 
          orderBy("rating", "desc"), 
          limit(20) 
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTrendingAnime(data);
      } catch (error) {
        console.error("Error fetching trending:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#020202]">
      <Loader2 className="animate-spin mb-4" style={{color: themeColor}} size={40} />
      <p className="text-[10px] font-black tracking-[0.5em] uppercase opacity-20 text-white">Analyzing Trends</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020202] text-white pb-32 selection:bg-[var(--accent-color)] selection:text-black">
      
      {/* 1. DYNAMIC BACKGROUND AURAS */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full blur-[150px] opacity-[0.1]" style={{ backgroundColor: themeColor }}></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full blur-[120px] opacity-[0.05]" style={{ backgroundColor: themeColor }}></div>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 pt-5 lg:pt-15">
        
        {/* 2. CINEMATIC HEADER */}
        <header className="mb-20 space-y-4">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-white/5 border border-white/10 rounded-lg text-[var(--accent-color)]">
                <TrendingUp size={20} />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 italic">Live_Chart_Update</span>
          </div>
          <h1 className="text-5xl lg:text-8xl font-black uppercase italic tracking-tighter leading-none">
            Top <span style={{ color: themeColor }}>Trending</span>
          </h1>
          <p className="text-zinc-500 max-w-xl text-sm lg:text-base font-medium leading-relaxed">
            The most watched Hindi Dubbed masterpieces of the week. Ranked by the neural community and global viewership.
          </p>
        </header>

        {/* 3. THE RANKING GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {trendingAnime.map((anime, index) => (
            <Link key={anime.id} href={`/portal?animeId=${anime.id}`}>
              <div className="group relative">
                
                {/* Ranking Ghost Number (Background) */}
                <div className="absolute -top-12 -left-4 text-9xl font-black opacity-[0.03] italic pointer-events-none group-hover:opacity-[0.07] transition-all duration-500">
                  {index + 1}
                </div>

                {/* Card Container */}
                <div className="relative overflow-hidden rounded-[2rem] bg-white/[0.02] border border-white/5 transition-all duration-500 group-hover:border-white/20 group-hover:translate-y-[-10px] group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)]">
                  
                  {/* Poster Aspect Ratio */}
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img 
                      src={anime.posterUrl || anime.poster || '/placeholder.jpg'} 
                      alt={anime.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Glass Overlay (Hover Only) */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-sm">
                       <div className="p-4 rounded-full bg-white text-black scale-50 group-hover:scale-100 transition-transform duration-500">
                          <Play size={24} fill="black" />
                       </div>
                    </div>

                    {/* Ranking Tag */}
                    <div className="absolute top-4 left-4 px-3 py-1 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg">
                       <span className="text-[10px] font-black italic tracking-widest text-[var(--accent-color)]">RANK #{index + 1}</span>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="p-6 space-y-4">
                    <h2 className="text-base font-black uppercase italic tracking-tight truncate group-hover:text-[var(--accent-color)] transition-colors">
                      {anime.title || anime.display_name}
                    </h2>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <Star size={14} className="text-yellow-500" fill="currentColor" />
                        <span className="text-xs font-black italic">{anime.rating || '8.2'}</span>
                      </div>
                      <div className="flex items-center gap-1 opacity-30 text-[9px] font-black uppercase tracking-widest">
                         {anime.type || 'TV'} <ChevronRight size={10} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 4. FOOTER SPACER */}
        <div className="h-32" />
      </div>

      <style jsx global>{`
        :root { --accent-color: ${themeColor}; }
        body { background-color: #020202; }
      `}</style>
    </div>
  );
}