'use client';

import React, { useState, useEffect, useMemo } from 'react';
// Firebase path fix
import { db } from '@/firebase'; 
import { collection, getDocs } from 'firebase/firestore';
import { useTheme } from '../../context/ThemeContext';
// Next.js Navigation fix
import { useRouter } from 'next/navigation'; 
import { Search as SearchIcon, Terminal, Zap, Play, Database, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Search = () => {
  const { themeColor } = useTheme();
  // useRouter hook for Next.js
  const router = useRouter(); 
  const [searchTerm, setSearchTerm] = useState('');
  const [allAnime, setAllAnime] = useState([]); 
  const [loading, setLoading] = useState(true);

  // 1. Database se sara data fetch karna
  useEffect(() => {
    const getAllData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "anime"));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAllAnime(data);
      } catch (err) {
        console.error("Fetch_Error:", err);
      } finally {
        setLoading(false);
      }
    };
    getAllData();
  }, []);

  // 2. Case-Insensitive Filtering Logic
  const filteredResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    
    return allAnime.filter(anime => 
      anime.title?.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 15); 
  }, [searchTerm, allAnime]);

  return (
    <div className="min-h-screen bg-[#020202] text-white pt-24 md:pt-32 pb-20 px-4 relative overflow-x-hidden">
      
      {/* Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[250px] blur-[100px] opacity-20 pointer-events-none" 
           style={{ background: `radial-gradient(circle, ${themeColor} 0%, transparent 70%)` }}></div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="flex justify-center items-center gap-2 mb-3 opacity-40">
            <Terminal size={14} style={{ color: themeColor }} />
            <span className="text-[9px] font-black uppercase tracking-[0.4em]">Case_Insensitive_Search</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black italic tracking-tighter uppercase mb-8">
            FIND_ANIME<span style={{ color: themeColor }}>.</span>SYS
          </h1>

          {/* Search Box */}
          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute -inset-1 rounded-2xl blur-md opacity-20 group-focus-within:opacity-50 transition-opacity" style={{ backgroundColor: themeColor }}></div>
            <div className="relative flex items-center bg-zinc-900/60 border border-white/10 rounded-2xl p-4 md:p-5 backdrop-blur-2xl">
              <SearchIcon className="opacity-40 mr-3 md:mr-4" size={22} />
              <input 
                type="text" 
                placeholder="Type naruto or NARUTO..."
                className="w-full bg-transparent border-none outline-none text-lg md:text-2xl font-bold placeholder:text-zinc-800"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {loading && <Loader2 className="animate-spin opacity-50" size={20} />}
              {!loading && searchTerm && (
                <button onClick={() => setSearchTerm('')} className="p-1 hover:bg-white/10 rounded-full">
                  <X size={20} className="opacity-50" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center gap-4 mb-6 px-2 opacity-40 text-[10px] font-black uppercase tracking-widest">
           <Database size={14} /> 
           <span>Active Units: {filteredResults.length}</span>
           <div className="flex-1 border-t border-white/5"></div>
        </div>

        {/* Grid Results */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredResults.map((anime) => (
              <motion.div
                key={anime.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                // router.push for Next.js
                onClick={() => router.push(`/anime/${anime.mal_id || anime.id}`)}
                className="group flex items-center gap-4 bg-zinc-900/20 border border-white/5 p-3 rounded-2xl hover:bg-zinc-900/50 hover:border-white/20 transition-all cursor-pointer"
              >
                <div className="w-16 h-24 md:w-20 md:h-28 rounded-xl overflow-hidden bg-zinc-800 shrink-0 border border-white/5 shadow-2xl">
                  <img src={anime.poster || anime.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" alt="poster" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-base md:text-lg font-black italic tracking-tight truncate group-hover:text-white transition-colors">
                    {anime.title}
                  </h3>
                  <div className="flex gap-2 mt-2">
                    <span className="text-[8px] font-black px-2 py-0.5 rounded bg-white/5 uppercase opacity-50">
                      {anime.type || 'TV'}
                    </span>
                    <span className="text-[8px] font-black px-2 py-0.5 rounded" style={{ backgroundColor: `${themeColor}20`, color: themeColor }}>
                      SYNCED
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {!loading && searchTerm && filteredResults.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[3rem]">
            <Zap size={40} className="mx-auto mb-4 opacity-10" />
            <p className="text-zinc-600 text-sm font-bold uppercase tracking-[0.2em]">Data not found in records</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;