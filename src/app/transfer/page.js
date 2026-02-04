"use client";
import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function TransferContent() {
  const searchParams = useSearchParams();
  const animeName = searchParams.get('anime') || 'Anime Player';
  const episode = searchParams.get('episode') || '01';
  const themeColor = searchParams.get('theme') || '#00FF9D';
  
  // Environment variable se API key uthana (Secure way)
  const API_KEY = process.env.NEXT_PUBLIC_SEEK_API_KEY; 
  const videoID = "evsd6"; 

  // SeekStreaming API format for authorized playback
  // Hum subdomain ki jagah direct domain use karenge authorization ke liye
  const embedUrl = `https://seekstreaming.com/e/${videoID}?api_key=${API_KEY}`;
  const downloadUrl = `https://seekstreaming.com/e/${videoID}?dl=1&api_key=${API_KEY}`;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 border-l-4 pl-6" style={{ borderColor: themeColor }}>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic">{animeName}</h1>
          <p className="text-white/50 font-mono tracking-widest uppercase text-[10px] mt-2">
            Status: {API_KEY ? 'API_CONNECTED' : 'API_MISSING'} // Isse humein pata chal jayega key mil rahi hai ya nahi
          </p>
        </div>

        <div className="relative group overflow-hidden rounded-[2.5rem] border border-white/10 bg-black">
          <div className="relative aspect-video w-full">
            {API_KEY ? (
              <iframe 
                src={embedUrl}
                className="absolute inset-0 h-full w-full"
                allowFullScreen
                frameBorder="0"
                allow="autoplay; encrypted-media"
              ></iframe>
            ) : (
              <div className="flex items-center justify-center h-full text-zinc-500 uppercase text-[10px] tracking-widest">
                Waiting for API Handshake...
              </div>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div className="mt-8 flex justify-end">
          <a 
            href={downloadUrl}
            target="_blank"
            className="px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest text-black transition-all hover:scale-105"
            style={{ backgroundColor: themeColor }}
          >
            Download Link
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center">Loading Neural Player...</div>}>
      <TransferContent />
    </Suspense>
  );
}