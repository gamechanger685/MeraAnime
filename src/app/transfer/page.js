'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { 
  ChevronLeft, Database, Zap, Shield, 
  HardDrive, Globe, Cloud, Activity 
} from 'lucide-react';

function TransferContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { themeColor } = useTheme();
  
  // Data extraction from URL or State
  // Note: Real world mein aap anime ID se data fetch karenge, 
  // yahan hum placeholder logic rakh rahe hain.
  const animeTitle = searchParams.get('anime') || 'UNKNOWN_UNIT';
  const epNum = searchParams.get('ep') || '0';
  
  // Placeholder Episode Data (Since we can't pass objects easily via URL)
  // Ideally, you'd fetch this from your database using ID
  const [selectedQuality, setSelectedQuality] = useState(null);

  const qualities = {
    p480: { "Terabox": "#", "Filepress": "#" },
    p720: { "Mega": "#", "GDTot": "#", "Cloud_Core": "#" },
    p1080: { "Terabox_HD": "#", "Direct_Source": "#" }
  };

  const getAvailableLinks = (q) => {
    const qualityData = qualities[`p${q}`] || {};
    return Object.entries(qualityData).filter(([key, value]) => value && value !== "");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6 md:px-12 relative overflow-hidden">
      
      {/* Neural Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[150px] opacity-20" 
           style={{ backgroundColor: themeColor }}></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div className="space-y-2">
            <button 
              onClick={() => router.back()} 
              className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] hover:text-white transition-all"
            >
              <ChevronLeft size={14} /> Re-Initialize Neural Link
            </button>
            <h1 className="text-4xl md:text-6xl font-[1000] italic uppercase tracking-tighter">
              Extraction <span style={{ color: themeColor }}>Phase_{epNum}</span>
            </h1>
            <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
               <Activity size={12} style={{ color: themeColor }} /> Unit: {animeTitle}
            </div>
          </div>
        </div>

        {/* STEP 1: QUALITY SELECTION */}
        {!selectedQuality ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in zoom-in duration-500">
            {[480, 720, 1080].map((q) => (
              <button 
                key={q}
                onClick={() => setSelectedQuality(q)}
                className="group relative p-8 bg-zinc-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-white/20 transition-all hover:-translate-y-2"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity" style={{ backgroundColor: themeColor }}></div>
                <Database size={24} className="mb-4 text-zinc-500 group-hover:text-white transition-colors" />
                <h3 className="text-3xl font-black italic mb-1">{q}P</h3>
                <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">Neural Resolution</p>
                <div className="mt-6 w-full h-[2px] bg-white/5 overflow-hidden">
                    <div className="h-full w-1/2 group-hover:w-full transition-all duration-700" style={{ backgroundColor: themeColor }}></div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          /* STEP 2: SERVER LINKS */
          <div className="space-y-6 animate-in slide-in-from-bottom-10 duration-500">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-black uppercase tracking-[0.5em] text-zinc-500">Available Cloud Core Servers ({selectedQuality}P)</h2>
              <button onClick={() => setSelectedQuality(null)} className="text-[9px] font-black uppercase text-zinc-400 hover:text-white underline decoration-zinc-700">Change Quality</button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {getAvailableLinks(selectedQuality).length > 0 ? (
                getAvailableLinks(selectedQuality).map(([provider, url]) => (
                  <a 
                    key={provider}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-6 bg-white/5 border border-white/5 rounded-3xl flex items-center justify-between hover:bg-white/10 hover:border-white/20 transition-all"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-black/40 border border-white/5 group-hover:scale-110 transition-transform" style={{ color: themeColor }}>
                        {getServerIcon(provider)}
                      </div>
                      <div>
                        <h4 className="text-xl font-black italic uppercase tracking-tighter">{provider.replace('_', ' ')}</h4>
                        <p className="text-[8px] text-zinc-500 font-black uppercase tracking-[0.2em]">Protocol: Secured • Direct Tunnel Ready</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="hidden md:block text-right">
                          <p className="text-[8px] font-black uppercase text-zinc-600">Speed</p>
                          <p className="text-[10px] font-black italic" style={{ color: themeColor }}>UNLIMITED</p>
                       </div>
                       <div className="p-4 rounded-xl bg-white/5 group-hover:bg-white/10 transition-all" style={{ color: themeColor }}>
                          <Zap size={20} fill="currentColor" />
                       </div>
                    </div>
                  </a>
                ))
              ) : (
                <div className="p-12 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
                   <p className="text-zinc-500 font-black uppercase tracking-widest text-xs">No active nodes found for this resolution.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Security Footer */}
        <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 opacity-30">
           <div className="flex items-center gap-2">
             <Shield size={14} />
             <span className="text-[8px] font-black uppercase tracking-[0.3em]">AES-256 Extraction Protocol</span>
           </div>
           <span className="text-[8px] font-black uppercase tracking-[0.3em]">Neural_Sync_Active</span>
        </div>
      </div>
    </div>
  );
}

const getServerIcon = (name) => {
  const n = name.toLowerCase();
  if (n.includes('terabox')) return <Cloud size={24} />;
  if (n.includes('filepress')) return <HardDrive size={24} />;
  if (n.includes('mega')) return <Shield size={24} />;
  if (n.includes('gdtot')) return <Globe size={24} />;
  return <HardDrive size={24} />;
};

// 2. Main export mein Suspense wrap karein
export default function Transfer() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Initializing Neural Link...</div>}>
      <TransferContent />
    </Suspense>
  );
}