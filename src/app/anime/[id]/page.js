'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; // Navigation fix
import { useTheme } from '@/context/ThemeContext'; 
import { ChevronLeft, Play, Layers, Loader2 } from 'lucide-react';
import { db } from '@/firebase'; 
import { collection, query, where, getDocs, doc, getDoc, setDoc } from "firebase/firestore";

function AnimeDetails() {
  const params = useParams(); // Next.js dynamic params
  const id = params.id;
  const router = useRouter(); // useNavigate ki jagah useRouter
  const { themeColor } = useTheme(); 
  
  const [animeData, setAnimeData] = useState(null);
  const [dbEpisodes, setDbEpisodes] = useState([]); 
  const [availableSeasons, setAvailableSeasons] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('seasons'); 
  const [selectedSeason, setSelectedSeason] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        
        // 1. Firebase se data uthao
        const animeRef = doc(db, "anime", id.toString());
        const animeSnap = await getDoc(animeRef);

        let basicData = null;
        let needsJikanUpdate = true;

        if (animeSnap.exists()) {
          basicData = animeSnap.data();
          setAnimeData(basicData);
          if (basicData.synopsis) {
            needsJikanUpdate = false;
          }
        }

        // 2. SMART CACHING
        if (needsJikanUpdate) {
          try {
            const jikanRes = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
            const jikan = await jikanRes.json();
            
            if (jikan.data) {
              const updatedInfo = {
                title: basicData?.title || jikan.data.title,
                poster: basicData?.poster || jikan.data.images.jpg.large_image_url,
                synopsis: jikan.data.synopsis,
                rating: jikan.data.score || basicData?.rating || "N/A",
                type: jikan.data.type || basicData?.type || "TV",
                mal_id: id.toString(),
                last_cached: new Date().getTime()
              };

              setAnimeData(prev => ({ ...prev, ...updatedInfo }));
              await setDoc(animeRef, updatedInfo, { merge: true });
            }
          } catch (e) { 
            console.log("Terminal_Log: Jikan_Core_Offline"); 
          }
        }

        // 3. Episodes fetch logic
        const q = query(collection(db, "episodes"), where("mal_id", "==", id.toString()));
        const querySnapshot = await getDocs(q);
        const rawEps = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        const cleanEps = rawEps.filter((value, index, self) =>
          index === self.findIndex((t) => (
            t.episode_number === value.episode_number && t.season_number === value.season_number
          ))
        );
        
        setDbEpisodes(cleanEps);
        const seasons = [...new Set(cleanEps.map(item => Number(item.season_number) || 1))].sort((a, b) => a - b);
        setAvailableSeasons(seasons);

      } catch (err) {
        console.error("Critical_System_Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center">
      <Loader2 className="animate-spin mb-4" size={40} style={{ color: themeColor }} />
      <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600">Syncing Central Core</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020202] text-white pt-7 pb-12 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Poster Section */}
        <div className="lg:col-span-4">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-[10px] font-black uppercase mb-8 text-zinc-500 hover:text-white">
            <ChevronLeft size={14} /> Back to Interface
          </button>
          <div className="rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl relative">
             <img src={animeData?.poster} className="w-full object-cover" alt="poster" />
             <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                <p className="text-xs font-black italic text-orange-500">⭐ {animeData?.rating || 'N/A'}</p>
             </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="lg:col-span-8">
          <h1 className="text-5xl lg:text-7xl font-[1000] italic uppercase tracking-tighter mb-6 leading-none">
            {animeData?.title}
          </h1>
          <p className="text-zinc-400 text-xs md:text-sm leading-relaxed mb-10 italic max-w-3xl">
            {animeData?.synopsis}
          </p>

          <div className="bg-zinc-900/20 border border-white/5 rounded-[3rem] p-8 lg:p-12 backdrop-blur-3xl">
            <h2 className="text-xl font-black italic uppercase mb-10 flex items-center gap-3">
               <Layers size={20} style={{ color: themeColor }} />
               {viewMode === 'seasons' ? 'Available Seasons' : `Season ${selectedSeason} Units`}
            </h2>

            {viewMode === 'seasons' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableSeasons.length > 0 ? availableSeasons.map(s => (
                  <button key={s} onClick={() => { setSelectedSeason(s); setViewMode('episodes'); }}
                    className="p-8 bg-white/5 border border-white/5 rounded-[2.5rem] flex justify-between items-center group hover:bg-white/10 transition-all">
                    <span className="text-2xl font-black italic">PHASE {s}</span>
                    <Play size={20} fill={themeColor} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                )) : (
                  <div className="col-span-2 py-20 text-center border-2 border-dashed border-white/5 rounded-[2.5rem] opacity-20">
                     <p className="font-black uppercase tracking-widest">No_Data_In_Local_Database</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
  {dbEpisodes
    .filter(e => Number(e.season_number) === selectedSeason)
    .sort((a, b) => a.episode_number - b.episode_number)
    .map(ep => (
      <button 
        key={ep.id} 
        // FIX: Next.js App Router format
                onClick={() => router.push(`/transfer?animeId=${id}&epId=${ep.id}&theme=${themeColor.replace('#', '')}`)}
               className="aspect-square bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center font-black hover:scale-105 transition-all active:scale-95"
               style={{ borderBottom: `2px solid ${themeColor}` }} // Chota sa neon touch niche
               >
              {ep.episode_number}
             </button>
            ))}
          </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnimeDetails;