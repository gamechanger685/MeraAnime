"use client";
import React, { Suspense, useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { db } from '@/firebase'; 
import { collection, query, where, getDocs, limit, doc, runTransaction, onSnapshot } from "firebase/firestore";
import { ThumbsUp, Download, Play, Star, LayoutGrid, Info, Flame, Zap } from 'lucide-react';
// ThemeContext use karna zaroori hai colors ke liye
import { useTheme } from '@/context/ThemeContext'; 

const BUNNY_LIBRARY_ID = "593731";

function AnimePortal() {
  const { themeColor } = useTheme(); // Global theme color fetch kiya
  const searchParams = useSearchParams();
  const router = useRouter();
  const animeId = searchParams?.get('animeId'); 
  const epId = searchParams?.get('epId'); 
  
  const [videoData, setVideoData] = useState(null);
  const [episodesList, setEpisodesList] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [liked, setLiked] = useState(false);
  const isProcessing = useRef(false);

  useEffect(() => {
    if (!animeId || !epId) return;
    setLiked(!!localStorage.getItem(`liked_${epId}`));

    const unsubVideo = onSnapshot(doc(db, "episodes", epId), (doc) => {
      if (doc.exists()) setVideoData(doc.data());
    });

    const fetchAll = async () => {
      const [epSnap, trendSnap] = await Promise.all([
        getDocs(query(collection(db, "episodes"), where("anime_id", "==", animeId))),
        getDocs(query(collection(db, "anime"), limit(12)))
      ]);
      setEpisodesList(epSnap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a,b) => a.episode_number - b.episode_number));
      setRecommendations(trendSnap.docs.map(d => ({ id: d.id, ...d.data() })).filter(a => a.id !== animeId));
    };

    fetchAll();
    return () => unsubVideo();
  }, [animeId, epId]);

  const toggleLike = async () => {
    if (isProcessing.current) return;
    isProcessing.current = true;
    const prevLiked = liked;
    setLiked(!prevLiked); 

    try {
      await runTransaction(db, async (transaction) => {
        const epRef = doc(db, "episodes", epId);
        const sfDoc = await transaction.get(epRef);
        if (!sfDoc.exists()) return;
        let newLikes = (sfDoc.data().likes || 0) + (prevLiked ? -1 : 1);
        transaction.update(epRef, { likes: Math.max(0, newLikes) });
      });
      if (prevLiked) localStorage.removeItem(`liked_${epId}`);
      else localStorage.setItem(`liked_${epId}`, "true");
    } catch (e) { setLiked(prevLiked); } finally { isProcessing.current = false; }
  };

  if (!videoData) return <div className="h-screen bg-black flex items-center justify-center font-black animate-pulse uppercase tracking-[0.5em]" style={{ color: themeColor }}>INITIALIZING_NEURAL_LINK...</div>;

  return (
    <div className="min-h-screen bg-[#020202] text-[#efefef] font-sans selection:bg-[var(--accent-color)] pb-20 overflow-x-hidden">
      
      {/* BACKGROUND GLOW - Automatically uses themeColor */}
      <div className="fixed top-0 left-0 w-full h-[500px] blur-[150px] pointer-events-none -z-10 opacity-20" 
           style={{ backgroundColor: themeColor }}></div>

      <div className="max-w-[1700px] mx-auto p-4 md:p-8">
        
        {/* TOP LAYOUT: Responsive Grid */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* PLAYER (Left/Main) */}
          <div className="w-full lg:w-[68%] space-y-6">
            <div className="relative aspect-video bg-black rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5 ring-1 ring-white/10">
              <iframe 
                src={`https://iframe.mediadelivery.net/embed/${BUNNY_LIBRARY_ID}/${videoData.bunny_id}?autoplay=true`}
                className="absolute inset-0 w-full h-full"
                allowFullScreen
                style={{ border: "none" }}
              />
            </div>

            {/* ACTION BAR */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/[0.03] backdrop-blur-3xl p-5 md:p-7 rounded-[2rem] border border-white/10">
              <div className="space-y-1">
                <h1 className="text-xl md:text-3xl font-black uppercase italic tracking-tighter text-white">
                  {videoData.folder_name}
                </h1>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: themeColor }}>Episode {videoData.episode_number}</span>
                  <div className="w-1 h-1 bg-white/20 rounded-full"></div>
                  <span className="text-[10px] opacity-40 uppercase font-bold tracking-widest">4K-HDR PRO</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={toggleLike}
                  className={`group flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black transition-all border border-white/5 ${liked ? 'bg-white text-black' : 'bg-white/5 hover:bg-white/10'}`}
                >
                  <ThumbsUp size={18} fill={liked ? "black" : "none"} />
                  <span className="text-lg">{videoData.likes || 0}</span>
                </button>
                {videoData.download_url && (
                  <a href={videoData.download_url} target="_blank" 
                     className="flex items-center gap-2 px-8 py-3.5 rounded-2xl font-black text-xs transition-all shadow-xl"
                     style={{ backgroundColor: themeColor, color: '#fff' }}>
                    <Download size={18} /> DOWNLOAD
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* SIDE ANIME SECTION (Responsive Scroll) */}
          <div className="w-full lg:w-[32%] space-y-4">
            <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-6 lg:h-[630px] flex flex-col">
              <div className="flex items-center justify-between mb-6 px-2">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 flex items-center gap-2">
                  <Flame size={14} style={{ color: themeColor }} /> Trending Suggestions
                </h3>
              </div>
              
              {/* MOBILE: Left-to-Right Scroll | PC: Up-Down Scroll */}
              <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-y-auto custom-scrollbar gap-4 lg:gap-4 pb-4 lg:pb-0 scroll-smooth snap-x">
                {recommendations.map((anime) => (
                  <div 
                    key={anime.id}
                    onClick={() => router.push(`/anime/${anime.id}`)}
                    className="flex-shrink-0 w-[140px] md:w-[180px] lg:w-full group flex flex-col lg:flex-row gap-4 p-2 md:p-3 rounded-2xl hover:bg-white/[0.05] transition-all cursor-pointer border border-transparent hover:border-white/5 snap-start"
                  >
                    <div className="w-full lg:w-16 h-44 lg:h-20 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                      <img src={anime.poster} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                    </div>
                    <div className="flex flex-col justify-center gap-1">
                      <h4 className="text-[10px] md:text-[11px] font-black uppercase italic leading-tight group-hover:text-[var(--accent-color)] transition-colors line-clamp-2" style={{ color: 'inherit' }}>{anime.display_name}</h4>
                      <div className="flex items-center gap-2 text-[9px] font-bold opacity-30">
                         <Star size={10} fill="currentColor" /> 9.8 RANK
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* EPISODES GRID */}
        <div className="mt-12 space-y-8">
           <div className="flex items-center gap-4">
              <div className="w-12 h-[2px]" style={{ backgroundColor: themeColor }}></div>
              <h2 className="text-xl font-black uppercase italic flex items-center gap-3">
                 <LayoutGrid style={{ color: themeColor }} size={20} /> Season Episodes
              </h2>
           </div>

           <div className="bg-white/[0.02] border border-white/5 p-5 md:p-8 rounded-[2rem] md:rounded-[3rem] grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-4">
              {episodesList.map((ep) => (
                <button 
                  key={ep.id}
                  onClick={() => router.push(`/transfer?animeId=${animeId}&epId=${ep.id}`)}
                  className={`group relative aspect-video rounded-x3 md:rounded-2xl overflow-hidden transition-all border ${epId === ep.id ? 'border-opacity-100 shadow-2xl shadow-black' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                  style={{ 
                    backgroundColor: epId === ep.id ? themeColor : '',
                    borderColor: epId === ep.id ? themeColor : ''
                  }}
                >
                  <div className={`absolute inset-0 flex items-center justify-center font-black italic text-2xl ${epId === ep.id ? 'text-white' : 'text-white/10 group-hover:text-white/40'}`}>
                    {ep.episode_number}
                  </div>
                </button>
              ))}
           </div>
        </div>
      </div>

      <style jsx global>{`
        :root { --accent-color: ${themeColor}; }
        .custom-scrollbar::-webkit-scrollbar { height: 4px; width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: ${themeColor}33; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: ${themeColor}; }
        
        /* Smooth Mobile Scrolling */
        @media (max-width: 1024px) {
          .custom-scrollbar {
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .custom-scrollbar::-webkit-scrollbar { display: none; }
        }
      `}</style>
    </div>
  );
}

export default function Page() {
  return <Suspense><AnimePortal /></Suspense>;
}