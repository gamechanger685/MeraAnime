"use client";
import React, { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';

function TransferContent() {
  const searchParams = useSearchParams();
  const animeName = searchParams.get('anime') || 'Unknown Anime';
  const episode = searchParams.get('episode') || '01';
  const themeColor = searchParams.get('theme') || '#00FF9D';
  
  // Is ID ko humne aapke embed link se nikala hai
  const videoID = "nfu8l"; 
  const embedUrl = `https://meraanime.embedseek.com/embed/${videoID}`;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 border-l-4 pl-6" style={{ borderColor: themeColor }}>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic">
            {animeName}
          </h1>
          <p className="text-white/50 font-mono tracking-widest uppercase text-sm mt-2">
            Neural Link: Episode {episode} — 1080P Stable Link
          </p>
        </div>

        {/* Video Player Container */}
        <div className="relative group overflow-hidden rounded-[2.5rem] border border-white/10 bg-black shadow-2xl transition-all hover:border-white/20">
          {/* Neon Glow Behind Player */}
          <div 
            className="absolute inset-0 blur-3xl opacity-10 pointer-events-none"
            style={{ backgroundColor: themeColor }}
          ></div>

          <div className="relative aspect-video w-full">
            <iframe 
              src={embedUrl}
              className="absolute inset-0 h-full w-full"
              allowFullScreen
              scrolling="no"
              frameBorder="0"
              allow="autoplay; encrypted-media"
            ></iframe>
          </div>
        </div>

        {/* Player Status Bar */}
        <div className="mt-6 flex flex-wrap justify-between items-center gap-4 px-4">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] font-bold text-white/40 tracking-[0.2em] uppercase">
              Streaming via MeraAnime Neural Mesh
            </span>
          </div>
          
          <div className="flex gap-4">
             <button className="px-6 py-2 rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all">
                Change Server
             </button>
             <button 
               className="px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-black transition-all hover:scale-105 active:scale-95"
               style={{ backgroundColor: themeColor }}
             >
                Download Episode
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white italic">Establishing Neural Connection...</div>}>
      <TransferContent />
    </Suspense>
  );
}