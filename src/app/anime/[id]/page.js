'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; 
import { useTheme } from '@/context/ThemeContext'; 
import { 
  Play, Loader2, Star, Calendar, Activity, Database, 
  Clock, TrendingUp, Info, ChevronRight, Hash, 
  ShieldCheck, Globe, Zap, Layers, Share2, Library, BookOpenCheck, Box
} from 'lucide-react';
import { db } from '@/firebase'; 
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { getTMDBData } from '@/lib/tmdb';

function AnimeDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { themeColor, playNeuralClick } = useTheme(); 
  const [animeData, setAnimeData] = useState(null);
  const [tmdb, setTmdb] = useState({ logo: null, poster: null, rating: null, year: null, votes: null });
  const [dbEpisodes, setDbEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const animeSnap = await getDoc(doc(db, "anime", id.toString()));
        if (animeSnap.exists()) {
          const fData = animeSnap.data();
          setAnimeData(fData);
          const assets = await getTMDBData(fData.display_name || fData.title);
          if (assets) setTmdb({ 
            logo: assets.logo, 
            poster: assets.poster, 
            rating: assets.rating, 
            year: assets.year,
            votes: assets.vote_count
          });
        }
        const q = query(collection(db, "episodes"), where("anime_id", "==", id.toString()));
        const querySnapshot = await getDocs(q);
        setDbEpisodes(querySnapshot.docs.map(d => ({ id: d.id, ...d.data() })).sort((a,b) => a.episode_number - b.episode_number));
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#020202]"><Loader2 className="animate-spin" style={{color: themeColor}} /></div>;

  return (
    /* Added pb-48 for extra breathing room at the bottom of the page */
    <div className="min-h-screen bg-[#020202] text-white selection:bg-[var(--accent-color)] selection:text-black font-sans pb-4 py-[-20]">
      
      {/* ATMOSPHERIC LAYER */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[800px] h-[800px] blur-[150px] opacity-[0.08]" style={{ backgroundColor: themeColor }}></div>
      </div>

      <div className="relative z-10 max-w-[1300px] mx-auto px-6 pt-4 lg:pt-8">
        
        {/* SECTION 1: THE CORE IDENTITY */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Poster Module */}
          <div className="w-[280px] lg:w-[340px] shrink-0 mx-auto lg:mx-0">
            <div className="relative group perspective-1000">
              <div className="absolute -inset-1 rounded-[2rem] blur-xl opacity-20 group-hover:opacity-40 transition-all duration-700" style={{ backgroundColor: themeColor }}></div>
              <div className="relative aspect-[2/3] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
                <img src={tmdb.poster || animeData?.poster} className="w-full h-full object-cover" alt="Anime Poster" />
              </div>
            </div>
            
            <div className="mt-8 space-y-3">
              <button 
                onClick={() => { playNeuralClick?.(); router.push(`/transfer?animeId=${id}&epId=${dbEpisodes[0]?.id}`); }}
                style={{ backgroundColor: themeColor }}
                className="w-full py-4 rounded-xl text-black font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
              >
                <Play size={16} fill="black" /> Watch & Download
              </button>
              <div className="flex gap-3">
                <div className="flex-1 bg-white/5 border border-white/10 p-3 rounded-xl text-center">
                   <p className="text-[8px] font-black uppercase opacity-30 tracking-widest mb-1">TMDB Score</p>
                   <p className="text-sm font-black italic">{tmdb.rating || '8.5'}</p>
                </div>
                <div className="flex-1 bg-white/5 border border-white/10 p-3 rounded-xl text-center">
                   <p className="text-[8px] font-black uppercase opacity-30 tracking-widest mb-1">Status</p>
                   <p className="text-sm font-black italic uppercase tracking-tighter text-[var(--accent-color)]">{animeData?.status || 'Active'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* SYNOPSIS PRIME: The Story Engine */}
          <div className="flex-1 space-y-10">
            <header className="space-y-4">
              {tmdb.logo ? (
                <img src={tmdb.logo} className="h-25 lg:h-36 object-contain" alt="Anime Logo" />
              ) : (
                <h1 className="text-1xl lg:text-4xl font-black uppercase italic tracking-tighter">{animeData?.display_name}</h1>
              )}
              <div className="flex flex-wrap gap-2 pt-2">
                {(animeData?.genres || ["Seinen", "Action", "Psychological"]).map(g => (
                  <span key={g} className="px-4 py-1.5 bg-white/5 border border-white/5 rounded-lg text-[9px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 hover:bg-white/10 transition-all">
                    {g}
                  </span>
                ))}
              </div>
            </header>

            <div className="relative">
              <div className="absolute -left-8 top-0 bottom-0 w-[1px] bg-gradient-to-b from-[var(--accent-color)] to-transparent opacity-30"></div>
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-[var(--accent-color)]/10 rounded-lg text-[var(--accent-color)]">
                      <BookOpenCheck size={16} />
                   </div>
                   <h2 className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40">Synopsis_Intelligence</h2>
                </div>
                <p className="text-xl lg:text-3xl font-medium leading-[1.6] text-zinc-300 italic font-serif">
                  {animeData?.description || "In a world where every action has a ripple effect, the narrative explores the boundaries of human will and destiny. This masterpiece redefines the genre with its intricate plot and breathtaking visuals."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: THE ENCYCLOPEDIA MATRIX */}
        <div className="mt-32">
          
          <div className="flex items-center gap-6 mb-12 group">
             <div className="relative">
                <div className="absolute inset-0 bg-[var(--accent-color)] blur-md opacity-20 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative p-4 bg-white/5 border border-white/10 rounded-2xl text-[var(--accent-color)] transition-transform group-hover:rotate-12">
                   <Library size={28} strokeWidth={1.5} />
                </div>
             </div>
             <div>
                <h2 className="text-2xl font-black uppercase italic tracking-tighter">Encyclopedia</h2>
                <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-20">Comprehensive_Data_Archive</p>
             </div>
             <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <EncyclopediaBox label="Production Matrix" icon={<Database size={14}/>}>
              <InfoLine label="Animation Studio" value={animeData?.studio || "Studio Mappa"} />
              <InfoLine label="Original Source" value="Manga Serialization" />
              <InfoLine label="Licensing" value="MeraAnime Global" />
            </EncyclopediaBox>

            <EncyclopediaBox label="Temporal Archive" icon={<Clock size={14}/>}>
              <InfoLine label="Release Date" value={tmdb.year || "2024"} />
              <InfoLine label="Seasonality" value="Winter / Fall" />
              <InfoLine label="File Size" value="~1.4GB / 4K" />
            </EncyclopediaBox>

            <EncyclopediaBox label="Global Ranking" icon={<TrendingUp size={14}/>}>
              <InfoLine label="Ranked" value="#12 Overall" />
              <InfoLine label="Popularity" value="#204" />
              <InfoLine label="User Score" value={`${tmdb.rating || '8.5'} / 10`} />
            </EncyclopediaBox>

            <EncyclopediaBox label="System Specs" icon={<ShieldCheck size={14}/>}>
              <div className="flex flex-wrap gap-2 pt-2">
                 {["4K UHD", "HDR10", "Neural-Audio", "60 FPS"].map(tag => (
                   <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-[8px] font-black uppercase opacity-40">
                      {tag}
                   </span>
                 ))}
              </div>
              <p className="text-[8px] font-black uppercase opacity-20 mt-4 tracking-widest leading-relaxed">
                Hardware acceleration enabled for seamless playback.
              </p>
            </EncyclopediaBox>
          </div>
        </div>

        {/* SPACER FOR FOOTER GAP */}
        <div className="h-20 w-full" />

      </div>

      <style jsx global>{`
        :root { --accent-color: ${themeColor}; }
        body { background-color: #020202; }
      `}</style>
    </div>
  );
}

function EncyclopediaBox({ label, icon, children }) {
  return (
    <div className="bg-white/[0.03] border border-white/5 p-8 rounded-[2.5rem] space-y-6 hover:bg-white/[0.05] hover:border-white/10 transition-all group">
      <div className="flex items-center gap-3">
         <div className="text-[var(--accent-color)] opacity-40 group-hover:opacity-100 transition-opacity">
            {icon}
         </div>
         <h4 className="text-[10px] font-black uppercase tracking-widest opacity-30">{label}</h4>
      </div>
      <div className="space-y-5">
         {children}
      </div>
    </div>
  );
}

function InfoLine({ label, value }) {
  return (
    <div className="space-y-1">
       <p className="text-[8px] font-black uppercase opacity-20 tracking-widest">{label}</p>
       <p className="text-sm font-bold text-zinc-300">{value}</p>
    </div>
  );
}

export default AnimeDetails;