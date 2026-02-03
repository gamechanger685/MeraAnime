'use client';

import React, { useState, useEffect } from 'react';
import { auth, db } from '@/firebase';
import { updateProfile } from "firebase/auth";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { 
  User, Palette, Shield, Save, Cpu, Activity, 
  Zap, Volume2, VolumeX, Monitor, Fingerprint, 
  AlignLeft, Loader2 
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext'; 

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const { themeColor, setThemeColor } = useTheme();

  // --- SETTINGS STATES ---
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [glitchActive, setGlitchActive] = useState(false);
  const [bioAuth, setBioAuth] = useState(false);

  // --- REAL-TIME STATS ---
  const [fps, setFps] = useState(60);
  const [temp, setTemp] = useState(42);

  // Initial Fetch: Next.js Auth is a bit tricky, we wait for auth state
  useEffect(() => {
    const fetchUserData = async (user) => {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setBio(docSnap.data().bio || '');
        setUsername(user.displayName || docSnap.data().username || '');
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) fetchUserData(user);
    });
    return () => unsubscribe();
  }, []);

  // System Stats Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setFps(Math.floor(Math.random() * (62 - 58 + 1)) + 58);
      setTemp(Math.floor(Math.random() * (45 - 38 + 1)) + 38);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const playClick = () => {
    if (soundEnabled) {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
      audio.volume = 0.1;
      audio.play().catch(() => {});
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    
    playClick();
    setBioAuth(true); 
    setLoading(true);
    
    try {
      // 1. Update Firebase Auth
      await updateProfile(auth.currentUser, { displayName: username });
      
      // 2. Update Firestore
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, { 
        username: username,
        bio: bio 
      });
      
      setMessage({ type: 'success', text: 'PROTOCOL SYNCED: 100%' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'SYNC INTERRUPTED' });
    } finally {
      setLoading(false);
      setBioAuth(false);
    }
  };

  return (
    <div className={`min-h-screen bg-[#050505] text-white p-6 md:p-12 pt-32 md:pt-10 relative overflow-hidden ${glitchActive ? 'animate-pulse' : ''}`}>
      
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: `linear-gradient(${themeColor} 1px, transparent 1px), linear-gradient(90deg, ${themeColor} 1px, transparent 1px)`, backgroundSize: '50px 50px' }}>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="mb-12 relative z-10">
          <h1 className="text-6xl font-[1000] italic tracking-tighter uppercase" style={{ color: themeColor, textShadow: `0 0 30px ${themeColor}66` }}>
            Settings
          </h1>
          <p className="text-[10px] font-black text-zinc-500 tracking-[0.5em] uppercase mt-2 flex items-center gap-2">
            <Activity size={12} className="text-green-500 animate-pulse" /> Connection: Encrypted_X2
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 relative z-10">
          
          {/* Navigation Tabs */}
          <div className="w-full lg:w-72 space-y-3">
            <TabBtn id="profile" icon={<User size={18}/>} label="Identity" active={activeTab} onClick={setActiveTab} themeColor={themeColor} />
            <TabBtn id="theme" icon={<Palette size={18}/>} label="Visuals" active={activeTab} onClick={setActiveTab} themeColor={themeColor} />
            <TabBtn id="system" icon={<Cpu size={18}/>} label="Hardware" active={activeTab} onClick={setActiveTab} themeColor={themeColor} />
          </div>

          {/* Settings Panel */}
          <div className="flex-1 bg-black/60 border border-white/10 rounded-[3rem] p-8 md:p-12 backdrop-blur-3xl shadow-2xl relative overflow-hidden min-h-[500px]">
            
            {message.text && (
              <div className="absolute top-6 right-6 px-6 py-2 rounded-full border border-green-500/50 bg-green-500/10 text-green-500 text-[10px] font-black uppercase animate-in fade-in zoom-in z-50">
                {message.text}
              </div>
            )}

            {activeTab === 'profile' && (
              <form onSubmit={handleUpdateProfile} className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-zinc-500 tracking-[0.3em] uppercase flex items-center gap-2">
                     <Fingerprint size={12} /> System Alias
                  </label>
                  <input 
                    type="text" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none font-black text-lg focus:border-white transition-all"
                    style={{ borderLeft: `8px solid ${themeColor}` }}
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-zinc-500 tracking-[0.3em] uppercase flex items-center gap-2">
                     <AlignLeft size={12} /> Neural Bio-Stream
                  </label>
                  <textarea 
                    value={bio} 
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Describe your essence..."
                    rows="4"
                    className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none font-mono text-sm focus:border-white transition-all resize-none"
                    style={{ borderLeft: `8px solid ${themeColor}` }}
                  />
                </div>

                <button 
                  disabled={loading}
                  className="group relative overflow-hidden px-12 py-5 rounded-2xl transition-all active:scale-95"
                  style={{ backgroundColor: themeColor }}
                >
                  <span className="relative z-10 flex items-center gap-3 text-black font-[1000] uppercase text-sm">
                    {bioAuth ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                    {loading ? 'SYNCING...' : 'Save Protocol'}
                  </span>
                </button>
              </form>
            )}

            {activeTab === 'theme' && (
              <div className="space-y-10 animate-in slide-in-from-right-8 duration-500">
                 <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-6">Accent Color Palette</p>
                 <div className="flex flex-wrap gap-5">
                   {['#ff6b00', '#00d4ff', '#ff007a', '#a200ff', '#39ff14'].map(color => (
                     <button key={color} onClick={() => {setThemeColor(color); playClick();}} className="w-14 h-14 rounded-2xl transition-all border-2" style={{ backgroundColor: color, borderColor: themeColor === color ? 'white' : 'transparent', boxShadow: themeColor === color ? `0 0 30px ${color}` : 'none' }} />
                   ))}
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/5">
                   <ToggleBox label="Audio Haptics" desc="Interface feedback" active={soundEnabled} toggle={() => setSoundEnabled(!soundEnabled)} icon={soundEnabled ? <Volume2 /> : <VolumeX />} />
                   <ToggleBox label="Glitch FX" desc="Simulated instability" active={glitchActive} toggle={() => setGlitchActive(!glitchActive)} icon={<Monitor />} />
                 </div>
              </div>
            )}

            {activeTab === 'system' && (
              <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <StatBox label="FPS" value={fps} color="#39ff14" />
                    <StatBox label="LATENCY" value="12ms" color="#ff007a" />
                    <StatBox label="DISK_I/O" value="READ" color="#00d4ff" />
                    <StatBox label="THERMALS" value={`${temp}°C`} color={themeColor} />
                 </div>
                 <div className="p-8 rounded-[2rem] bg-white/5 border border-white/5 font-mono text-[10px] text-zinc-500 space-y-2">
                    <p>{`> Initializing system check...`}</p>
                    <p className="text-green-500">{`> CPU: Quantum-Snapdragon-X9`}</p>
                    <p className="text-blue-500">{`> Memory: 16.0GB Hyper-Sync`}</p>
                    <p>{`> Connection: SECURE_V3`}</p>
                 </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB COMPONENTS ---
const TabBtn = ({ id, icon, label, active, onClick, themeColor }) => (
  <button onClick={() => onClick(id)} className={`w-full flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 font-black text-[11px] uppercase tracking-widest ${active === id ? 'text-black translate-x-4 shadow-2xl' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`} style={{ backgroundColor: active === id ? themeColor : 'transparent' }}>
    {icon} {label}
  </button>
);

const ToggleBox = ({ label, desc, active, toggle, icon }) => (
  <div className="p-6 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-between group hover:border-white/20 transition-all">
    <div className="flex items-center gap-4 text-left">
      <div className="text-zinc-500 group-hover:text-white transition-colors">{icon}</div>
      <div>
        <p className="text-xs font-black uppercase italic">{label}</p>
        <p className="text-[9px] text-zinc-500 uppercase">{desc}</p>
      </div>
    </div>
    <button onClick={toggle} className={`w-12 h-6 rounded-full relative transition-all ${active ? 'bg-green-500' : 'bg-zinc-800'}`}>
      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${active ? 'right-1' : 'left-1'}`} />
    </button>
  </div>
);

const StatBox = ({ label, value, color }) => (
  <div className="p-6 bg-white/5 border border-white/10 rounded-3xl group hover:scale-105 transition-transform cursor-crosshair">
    <p className="text-2xl font-black italic mb-1" style={{ color }}>{value}</p>
    <p className="text-[8px] text-zinc-500 uppercase font-black tracking-widest">{label}</p>
  </div>
);