'use client';

import React, { useState, useEffect } from 'react';
import { auth, db } from '@/firebase'; // Path update
import { doc, onSnapshot } from 'firebase/firestore';
import { useTheme } from '@/context/ThemeContext';
import { 
  Terminal, Shield, Award, Download, Database, 
  Fingerprint, Box, Flame, Loader2 
} from 'lucide-react';

export default function Profile() {
  const { themeColor } = useTheme();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Next.js mein auth state change hone ka intezar karna parta hai
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const unsubDoc = onSnapshot(doc(db, "users", user.uid), (snap) => {
          if (snap.exists()) {
            setUserData(snap.data());
          }
          setLoading(false);
        });
        return () => unsubDoc();
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Profile page.js snippet
const getAvatar = () => {
  const user = auth.currentUser;
  // Exact same logic as Navbar
  const photo = userData?.photoURL || userData?.profilePic || user?.photoURL;
  if (photo) return photo;

  const gender = userData?.gender?.toLowerCase();
  if (gender === 'male') return `https://api.dicebear.com/7.x/avataaars/svg?seed=Felix`;
  if (gender === 'female') return `https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka`;

  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid || 'guest'}`;
};

  if (loading) return (
    <div className="h-screen bg-[#020202] flex flex-col items-center justify-center">
      <Loader2 className="animate-spin mb-4" size={40} style={{ color: themeColor }} />
      <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600">Retrieving_User_Protocol</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#010101] text-white pt-28 pb-20 px-4 md:px-10 relative overflow-hidden">
      
      {/* 🌌 NEURAL GRID BACKGROUND */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `linear-gradient(${themeColor} 1px, transparent 1px), linear-gradient(90deg, ${themeColor} 1px, transparent 1px)`, backgroundSize: '50px 50px' }}>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* --- TOP SECTION: IDENTITY --- */}
        <div className="flex flex-col md:flex-row gap-10 items-center mb-16">
          <div className="relative">
            <div className="w-56 h-56 rounded-full border-4 p-2 relative z-10 bg-[#010101]" style={{ borderColor: themeColor }}>
              <img src={getAvatar()} className="w-full h-full rounded-full object-cover" alt="pfp" />
              {/* Level Badge */}
              <div className="absolute -bottom-2 right-10 text-black text-[10px] font-black px-3 py-1 rounded-full shadow-xl" style={{ backgroundColor: themeColor }}>
                LVL {Math.floor((userData?.downloads || 0) / 5) + 1}
              </div>
            </div>
            <div className="absolute inset-0 blur-[60px] opacity-20 animate-pulse" style={{ backgroundColor: themeColor }}></div>
          </div>

          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <Fingerprint size={16} style={{ color: themeColor }} />
              <span className="text-[10px] tracking-[0.4em] opacity-40 font-bold uppercase">System Identifier Linked</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase mb-4 leading-none">
              {userData?.username || "SUBJECT"}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <span className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold tracking-widest uppercase flex items-center gap-2">
                <Shield size={12} style={{ color: themeColor }} /> {userData?.gender || 'Warrior'}
              </span>
              <span className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold tracking-widest uppercase flex items-center gap-2">
                <Flame size={12} className="text-orange-500" /> {(userData?.downloads || 0) > 50 ? 'Ancient' : 'Rookie'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- LEFT COLUMN: THE CORE STATS --- */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gradient-to-br from-zinc-900/50 to-black p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Box size={150} />
              </div>
              <h3 className="text-[10px] font-black tracking-[0.3em] uppercase opacity-40 mb-8">Neural Performance</h3>
              
              <div className="space-y-8">
                <StatBar label="Download Affinity" percent={Math.min((userData?.downloads || 0) * 2, 100)} color={themeColor} />
                <StatBar label="System Authority" percent={65} color="#3b82f6" />
                <StatBar label="Data Resonance" percent={40} color="#a855f7" />
              </div>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-zinc-900/20 border border-white/5 italic">
               <Terminal size={14} className="mb-4 opacity-30" />
               <p className="text-zinc-400 font-mono text-sm leading-relaxed">
                 "{userData?.bio || "No data stream found. User is currently operating in stealth mode."}"
               </p>
            </div>
          </div>

          {/* --- RIGHT COLUMN: THE DASHBOARD --- */}
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FeatureCard 
                icon={<Download size={24} />} 
                title="Total Syncs" 
                value={userData?.downloads || 0} 
                sub="Files successfully indexed"
                color={themeColor}
              />
              <FeatureCard 
                icon={<Database size={24} />} 
                title="Data Volume" 
                value={`${((userData?.downloads || 0) * 0.45).toFixed(1)} GB`} 
                sub="Estimated bandwidth"
                color="#00f2ff"
              />
            </div>

            {/* ACHIEVEMENTS */}
            <div className="bg-white/[0.02] p-8 rounded-[3rem] border border-white/5">
              <h3 className="text-xs font-black tracking-widest uppercase mb-8 flex items-center gap-3">
                <Award size={16} style={{ color: themeColor }} /> Unlocked Titles
              </h3>
              <div className="flex flex-wrap gap-4">
                <Badge title="First Contact" desc="Joined the System" active={true} color={themeColor} />
                <Badge title="Data Leech" desc="10+ Downloads" active={(userData?.downloads >= 10)} color="#3b82f6" />
                <Badge title="Archive Master" desc="50+ Downloads" active={(userData?.downloads >= 50)} color="#a855f7" />
                <Badge title="System Monarch" desc="100+ Downloads" active={(userData?.downloads >= 100)} color="#f59e0b" />
              </div>
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
      `}</style>
    </div>
  );
}

// --- HELPER COMPONENTS ---
const StatBar = ({ label, percent, color }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
      <span className="opacity-60">{label}</span>
      <span style={{ color }}>{percent}%</span>
    </div>
    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
      <div className="h-full transition-all duration-1000" style={{ width: `${percent}%`, backgroundColor: color, boxShadow: `0 0 10px ${color}` }}></div>
    </div>
  </div>
);

const FeatureCard = ({ icon, title, value, sub, color }) => (
  <div className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all group">
    <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" style={{ color }}>
      {icon}
    </div>
    <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">{title}</h4>
    <p className="text-4xl font-black italic tracking-tighter mb-2">{value}</p>
    <p className="text-[9px] font-bold uppercase opacity-20 tracking-tighter">{sub}</p>
  </div>
);

const Badge = ({ title, desc, active, color }) => (
  <div className={`p-4 rounded-2xl border transition-all duration-500 flex flex-col items-center justify-center text-center w-32 ${active ? 'opacity-100' : 'opacity-10 grayscale'}`}
       style={{ borderColor: active ? `${color}44` : '#ffffff11', backgroundColor: active ? `${color}05` : 'transparent' }}>
    <Award size={20} className="mb-2" style={{ color: active ? color : '#555' }} />
    <p className="text-[9px] font-black uppercase leading-tight mb-1">{title}</p>
    <p className="text-[7px] font-medium opacity-40 uppercase tracking-tighter">{desc}</p>
  </div>
);