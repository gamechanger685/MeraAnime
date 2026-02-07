"use client";
import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { db } from '@/firebase'; 
import { collection, query, where, getDocs, limit, doc, updateDoc, increment, addDoc, orderBy, onSnapshot } from "firebase/firestore";
import { ThumbsUp, ThumbsDown, Share2, Download, MessageCircle, Play, User, Star, Clock } from 'lucide-react';

const BUNNY_LIBRARY_ID = "593731";

function AnimePortal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const animeId = searchParams?.get('animeId'); 
  const epId = searchParams?.get('epId'); 
  
  const [videoData, setVideoData] = useState(null);
  const [episodesList, setEpisodesList] = useState([]);
  const [trending, setTrending] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [userAction, setUserAction] = useState(null);

  // 1. Dynamic Theme Picker
  const currentTheme = videoData?.theme_color || '#00ffaa';

  useEffect(() => {
    if (!animeId || !epId) return;

    const fetchData = async () => {
      try {
        // Fetch All Episodes for the Grid
        const q = query(collection(db, "episodes"), where("mal_id", "==", String(animeId)));
        const snap = await getDocs(q);
        const eps = [];
        snap.forEach(doc => {
          const data = { id: doc.id, ...doc.data() };
          eps.push(data);
          if (doc.id === epId) setVideoData(data);
        });
        setEpisodesList(eps.sort((a, b) => a.episode_number - b.episode_number));

        // Sync User Action (Like/Dislike) from LocalStorage
        const savedAction = localStorage.getItem(`action_${epId}`);
        if (savedAction) setUserAction(savedAction);

        // Fetch Recommendations (Limited to 6)
        const trendSnap = await getDocs(query(collection(db, "anime"), limit(6)));
        setTrending(trendSnap.docs.map(d => ({ id: d.id, ...d.data() })).filter(a => a.id !== animeId));

      } catch (err) { console.error("Fetch Error:", err); }
    };

    fetchData();

    // 2. Real-time Comments Listener (Upgrade)
    const qComm = query(collection(db, "comments"), where("epId", "==", epId), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(qComm, (snapshot) => {
      setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [animeId, epId]);

  const handleInteraction = async (type) => {
    if (!epId) return;
    const epRef = doc(db, "episodes", epId);
    let newUserAction = userAction === type ? null : type;

    try {
      // Logic for atomic updates in Firestore
      if (type === 'like') {
        await updateDoc(epRef, {
          likes: userAction === 'like' ? increment(-1) : increment(1),
          dislikes: userAction === 'dislike' ? increment(-1) : increment(0)
        });
      } else {
        await updateDoc(epRef, {
          dislikes: userAction === 'dislike' ? increment(-1) : increment(1),
          likes: userAction === 'like' ? increment(-1) : increment(0)
        });
      }
      setUserAction(newUserAction);
      newUserAction ? localStorage.setItem(`action_${epId}`, newUserAction) : localStorage.removeItem(`action_${epId}`);
    } catch (err) { console.error(err); }
  };

  const postComment = async () => {
    if(!newComment.trim()) return;
    try {
      await addDoc(collection(db, "comments"), {
        epId,
        text: newComment,
        user: "Otaku_" + Math.floor(Math.random() * 999), // Guest placeholder
        timestamp: new Date(),
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${Date.now()}`
      });
      setNewComment("");
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 p-4 lg:p-10 font-sans">
      <div className="max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN: PLAYER & INFO */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* PLAYER WITH THEME GLOW */}
          <div className="relative aspect-video w-full rounded-[1rem] overflow-hidden bg-black shadow-2xl border border-white/5" 
               style={{ boxShadow: `0 30px 100px -20px ${currentTheme}20` }}>
            <iframe 
              src={`https://iframe.mediadelivery.net/embed/${BUNNY_LIBRARY_ID}/${videoData?.bunny_id}?autoplay=true`}
              className="absolute inset-0 w-full h-full"
              allowFullScreen
            />
          </div>

          {/* TITLE & ACTIONS */}
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h1 className="text-3xl font-black italic uppercase tracking-tighter leading-none">
                  {videoData?.anime_title}
                </h1>
              </div>
              
              <div className="flex items-center bg-zinc-900/50 rounded-2xl p-1 border border-white/5">
                <button onClick={() => handleInteraction('like')} 
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl transition-all ${userAction === 'like' ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                  <ThumbsUp size={18} style={{ color: userAction === 'like' ? currentTheme : 'white' }} />
                  <span className="text-sm font-black">{videoData?.likes || 0}</span>
                </button>
                <div className="w-[1px] h-4 bg-white/10 mx-1" />
                <button onClick={() => handleInteraction('dislike')} 
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl transition-all ${userAction === 'dislike' ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                  <ThumbsDown size={18} style={{ color: userAction === 'dislike' ? '#ff4444' : 'white' }} />
                </button>
              </div>
            </div>

            {/* DOWNLOAD BUTTON (THEME INJECTED) */}
            <div className="flex gap-4">
              {videoData?.download_url && (
                <a 
                  href={videoData.download_url} 
                  target="_blank" 
                  style={{ backgroundColor: currentTheme }}
                  className="flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-4 text-black rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg"
                >
                  <Download size={20} /> Download
                </a>
              )}
            </div>
          </div>

          {/* EPISODE SELECTOR */}
          <div className="bg-zinc-900/20 p-5 rounded-[2.5rem] border border-white/5">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] mb-3 opacity-30">Selection Matrix</h3>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-15 gap-3">
              {episodesList.map((ep) => (
                <button
                  key={ep.id}
                  onClick={() => router.push(`/transfer?animeId=${animeId}&epId=${ep.id}`)}
                  style={{ 
                    backgroundColor: epId === ep.id ? currentTheme : 'transparent',
                    borderColor: epId === ep.id ? currentTheme : 'rgba(255,255,255,0.1)'
                  }}
                  className={`py-4 rounded-2xl font-black text-xs border transition-all ${epId === ep.id ? 'text-black scale-100 shadow-xl' : 'text-zinc-500 hover:border-white/40'}`}
                >
                  {ep.episode_number}
                </button>
              ))}
            </div>
          </div>

          {/* COMMENTS (REAL-TIME) */}
          <div className="space-y-8">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-zinc-900 rounded-2xl border border-white/5"><MessageCircle size={20} style={{ color: currentTheme }} /></div>
                <h3 className="text-xl font-black tracking-tighter uppercase italic">{comments.length} Thoughts</h3>
             </div>
             
             <div className="bg-zinc-900/20 p-6 rounded-[2rem] border border-white/5 flex gap-4">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user`} className="w-12 h-12 rounded-full bg-zinc-800" />
                <div className="flex-1 space-y-4">
                  <textarea 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..." 
                    className="w-full bg-transparent border-b border-white/10 py-2 focus:border-white outline-none text-sm transition-all resize-none h-12"
                  />
                  <div className="flex justify-end">
                    <button onClick={postComment} style={{ backgroundColor: currentTheme }} className="px-8 py-2.5 text-black rounded-xl text-xs font-black uppercase tracking-widest">Post</button>
                  </div>
                </div>
             </div>

             <div className="space-y-6">
                {comments.map((c) => (
                  <div key={c.id} className="flex gap-4 p-4 rounded-2xl hover:bg-white/[0.02] transition-all group">
                    <img src={c.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${c.user}`} className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10" />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-black text-white italic uppercase tracking-wider">@{c.user}</span>
                        <span className="text-[9px] font-bold text-zinc-600 uppercase">Incoming_Packet</span>
                      </div>
                      <p className="text-sm text-zinc-400 font-medium leading-relaxed">{c.text}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN: TRENDING (CLEANED) */}
        <div className="lg:col-span-4">
          <div className="bg-zinc-900/10 p-8 rounded-[3rem] border border-white/5 sticky top-10">
            <h2 className="text-xs font-black uppercase tracking-[0.5em] mb-8 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentTheme }}></span> Hot_Recs
            </h2>
            <div className="space-y-6">
              {trending.map((anime) => (
                <div key={anime.id} onClick={() => router.push(`/transfer?animeId=${anime.id}`)}
                  className="flex gap-5 cursor-pointer group">
                  <div className="w-20 h-28 rounded-2xl overflow-hidden shadow-2xl border border-white/5 flex-shrink-0 relative">
                    <img src={anime.poster} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <Play size={20} fill="white" />
                    </div>
                  </div>
                  <div className="flex flex-col justify-center gap-2">
                    <h4 className="text-xs font-black uppercase leading-tight line-clamp-2 group-hover:text-zinc-400 transition-colors tracking-tighter">
                      {anime.title}
                    </h4>
                    <div className="flex items-center gap-3">
                       <div className="flex items-center gap-1 text-[9px] font-black text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-md italic">
                          <Star size={10} fill="currentColor" /> 8.9
                       </div>
                       <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">TV Series</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="bg-[#050505] h-screen" />}>
      <AnimePortal />
    </Suspense>
  );
}