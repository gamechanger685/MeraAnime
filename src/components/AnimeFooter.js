'use client';

import React from 'react';
import Link from 'next/link'; // Next.js Link
import { useTheme } from '../context/ThemeContext';

const AnimeFooter = () => {
  const { themeColor } = useTheme();

  return (
    <footer className="w-full bg-[#050505] border-t border-white/5 pt-16 pb-8 px-6 md:px-12 relative overflow mt-auto">
      {/* Cinematic Top Glow Line */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] opacity-60 shadow-[0_0_50px_2px]"
        style={{ backgroundColor: themeColor, boxShadow: `0 0 40px 2px ${themeColor}` }}
      ></div>

      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Section 1: Brand & Bio */}
          <div className="md:col-span-1 flex flex-col gap-4">
            <h2 className="text-2xl font-[1000] italic tracking-tighter text-white">
              Mera<span style={{ color: themeColor }}>Anime</span>
            </h2>
            <p className="text-[10px] text-zinc-500 font-bold leading-relaxed tracking-widest uppercase">
              The ultimate vault for legendary stories. High-speed streaming, secure interface, and a community built for the elite.
            </p>
          </div>

          {/* Section 2: Quick Navigation */}
          <div className="flex flex-col gap-4">
            <span className="text-[11px] font-black text-white tracking-[0.2em] uppercase border-l-2 pl-3" style={{ borderColor: themeColor }}>Navigation</span>
            <div className="flex flex-col gap-2">
              {/* FIXED: 'to' changed to 'href' */}
              <Link href="/" className="text-[9px] text-zinc-600 hover:text-white transition-all font-bold uppercase tracking-widest">Home Portal</Link>
              <Link href="/login" className="text-[9px] text-zinc-600 hover:text-white transition-all font-bold uppercase tracking-widest">User Entry</Link>
              <Link href="/register" className="text-[9px] text-zinc-600 hover:text-white transition-all font-bold uppercase tracking-widest">Join Vault</Link>
            </div>
          </div>

          {/* Section 3: Legal & Security */}
          <div className="flex flex-col gap-4">
            <span className="text-[11px] font-black text-white tracking-[0.2em] uppercase border-l-2 pl-3" style={{ borderColor: themeColor }}>Security</span>
            <div className="flex flex-col gap-2">
              <Link href="/info/privacy" className="text-[9px] text-zinc-600 hover:text-white cursor-pointer font-bold uppercase tracking-widest">Privacy Protocol</Link>
              <span className="text-[9px] text-zinc-600 hover:text-white cursor-pointer font-bold uppercase tracking-widest">Terms of Service</span>
              <span className="text-[9px] text-zinc-600 hover:text-white cursor-pointer font-bold uppercase tracking-widest">Support Center</span>
            </div>
          </div>

          {/* Section 4: Social Nexus */}
          <div className="flex flex-col items-center md:items-end gap-6">
            <span className="text-[11px] font-black text-white tracking-[0.2em] uppercase">Connect With Us</span>
            <div className="flex gap-4">
              {/* Discord */}
              <a href="https://discord.gg/yourlink" target="_blank" rel="noreferrer" 
                 className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
                 style={{ '--glow': themeColor }}>
                <img src="https://www.svgrepo.com/show/353655/discord-icon.svg" className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" alt="Discord" />
              </a>
              {/* X (Twitter) */}
              <a href="https://twitter.com/yourlink" target="_blank" rel="noreferrer" 
                 className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:scale-110 active:scale-95 transition-all group">
                <img src="https://www.svgrepo.com/show/447194/x.svg" className="w-4 h-4 invert opacity-50 group-hover:opacity-100 transition-opacity" alt="X" />
              </a>
              {/* Instagram */}
              <a href="https://instagram.com/yourlink" target="_blank" rel="noreferrer" 
                 className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:scale-110 active:scale-95 transition-all group">
                <img src="https://www.svgrepo.com/show/452229/instagram.svg" className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" alt="Instagram" />
              </a>
            </div>
            {/* Status Pulse */}
            <div className="flex items-center gap-2 px-4 py-2 bg-black/50 border border-white/5 rounded-full shadow-inner">
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: themeColor }}></div>
              <span className="text-[8px] text-zinc-400 font-[1000] tracking-widest uppercase italic">Neural Network: Online</span>
            </div>
          </div>

        </div>

        {/* Final Copyright Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 gap-4">
          <div className="text-[9px] text-zinc-800 font-black tracking-[0.3em] uppercase italic">
            © 2026 MeraAnime // Developed by <span style={{ color: themeColor }} className="cursor-help">Alpha Protocol</span>
          </div>
          <div className="flex gap-6">
            <span className="text-[8px] text-zinc-900 font-bold uppercase tracking-tighter">AES-256 Bit Encryption</span>
            <span className="text-[8px] text-zinc-900 font-bold uppercase tracking-tighter">Status: Protected</span>
          </div>
        </div>

      </div>
      
    </footer>
  );
};

export default AnimeFooter;