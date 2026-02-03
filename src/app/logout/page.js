'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { getAuth, deleteUser, signOut } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore"; 
import { db, auth } from '@/firebase'; 

export default function Logout() {
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); 
  const { themeColor } = useTheme();
  const router = useRouter();
  
  // Current user ko handle karne ka sahi Next.js tarika
  const user = auth.currentUser;

  const handleAbsoluteDestruction = async () => {
    if (!user) {
      router.push('/register');
      return;
    }

    setIsDeleting(true);
    try {
      // 1. DELETE FROM FIRESTORE (Database se safaya)
      const userDocRef = doc(db, "users", user.uid);
      await deleteDoc(userDocRef);
      console.log("Terminal_Log: Database_Record_Erased");

      // 2. DELETE FROM AUTHENTICATION (Auth account destroyed)
      await deleteUser(user);
      console.log("Terminal_Log: Auth_Account_Destroyed");

      // 3. CLEAN LOCAL STORAGE & SESSION
      localStorage.clear();
      sessionStorage.clear();

      // 4. REDIRECT
      router.push('/register');
      
    } catch (error) {
      console.error("Critical_Destruction_Error:", error);
      
      // NEXT.JS / FIREBASE SECURITY TRICK:
      // Sensitive operations (account delete) ke liye fresh login chahiye hota hai
      if (error.code === 'auth/requires-recent-login') {
        alert("Security Breach Detected: Please re-login to authorize account destruction.");
        await signOut(auth);
      }
      
      localStorage.clear();
      router.push('/register');
    } finally {
      setIsDeleting(false);
    }
  };

  const upcomingAnimes = [
    "Solo Leveling Season 2 (Hindi Dub)",
    "One Piece: Final Saga Special",
    "Jujutsu Kaisen: Culling Game"
  ];

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Anime Aura */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px]" 
             style={{ background: themeColor }}></div>
      </div>

      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 items-center relative z-10 bg-[#0a0a0a] border border-white/5 p-8 md:p-12 rounded-[2rem] shadow-2xl animate-in fade-in zoom-in duration-500">
        
        {/* Left Side: Emotional Visual */}
        <div className="text-center md:text-left">
          <div className="inline-block px-4 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black tracking-[0.3em] text-zinc-500 uppercase mb-4">
            Leaving the Sanctuary?
          </div>
          <h1 className="text-5xl md:text-7xl font-[1000] italic uppercase tracking-tighter leading-[0.9] mb-6">
            WAIT, <br />
            <span style={{ color: themeColor }}>DON'T GO...</span>
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed mb-6">
            MeraAnime aapke baghair adhoora hai. Kya aap waqai wo sab kuch chorna chahte hain jo humne mil kar banaya?
          </p>
          
          <div className="bg-white/5 p-4 rounded-xl border border-white/5">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Don't miss these next week:</p>
            <ul className="space-y-2">
              {upcomingAnimes.map((anime, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-zinc-300">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: themeColor }}></span>
                  {anime}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Side: Choices */}
        <div className="flex flex-col gap-4">
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 text-center">
            <p className="italic text-zinc-300 mb-6 font-medium">"Ek baar phir soch lijiye, humara rasta abhi khatam nahi hua..."</p>
            
            <button 
              onClick={() => router.push('/')} 
              className="w-full py-4 rounded-xl font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-white/5"
              style={{ backgroundColor: themeColor, color: '#000' }}
            >
              Back to Safety 🏠
            </button>
            
            <button 
              onClick={() => setShowModal(true)}
              className="mt-6 text-zinc-500 text-xs font-bold uppercase tracking-widest hover:text-red-500 transition-colors"
            >
              I still want to leave...
            </button>
          </div>
        </div>
      </div>

      {/* --- PSYCHOLOGICAL MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 backdrop-blur-xl">
          <div className="absolute inset-0 bg-black/90" onClick={() => setShowModal(false)}></div>
          
          <div className="relative bg-[#050505] border border-red-500/20 p-10 max-w-md w-full rounded-3xl text-center shadow-[0_0_100px_rgba(255,0,0,0.2)] animate-in fade-in slide-in-from-bottom-10 duration-500">
            <div className="text-6xl mb-4 animate-bounce">💔</div>
            <h2 className="text-3xl font-black italic uppercase text-white mb-4 tracking-tighter">Ultimate Destruction?</h2>
            <p className="text-zinc-400 mb-8 text-sm leading-relaxed">
              Ye button dabate hi aapka <span className="text-red-500 font-bold underline">Auth Account</span>, <span className="text-red-500 font-bold underline">Firestore Database</span> aur <span className="text-red-500 font-bold underline">Local Session</span> hamesha ke liye mita diya jayega. 
              <br/><br/>
              Ek choti si cheez bhi baki nahi rahegi.
            </p>

            <div className="space-y-3">
              <button 
                disabled={isDeleting}
                onClick={handleAbsoluteDestruction}
                className="w-full py-4 border border-red-600 text-red-600 font-black uppercase text-[10px] tracking-[0.4em] hover:bg-red-600 hover:text-white transition-all rounded-xl disabled:opacity-50"
              >
                {isDeleting ? "ERASING DATA..." : "DESTROY EVERYTHING"}
              </button>
              
              <button 
                onClick={() => setShowModal(false)} 
                className="w-full py-4 bg-white text-black font-black uppercase text-[10px] tracking-[0.4em] rounded-xl hover:scale-105 transition-transform"
              >
                Actually, I'll stay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}