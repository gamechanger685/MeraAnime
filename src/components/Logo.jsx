'use client';

import React from 'react';
// Path fix: Agar aapki file src/components mein hai, 
// toh context ka path check kar lein
import { useTheme } from '../context/ThemeContext';

const Logo = () => {
  // useTheme ko safely access karein
  const theme = useTheme();
  // Safe check: Agar context load nahi hua toh default color use karein
  const themeColor = theme?.themeColor || '#ff6b00';
  
  return (
    <div className="flex items-center gap-3 group cursor-pointer select-none">
      {/* The Iconic Mark */}
      <div className="relative flex items-center justify-center">
        <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="50" fill={themeColor} />
          <path 
            d="M25 35 L50 65 L75 35" 
            stroke="black" 
            strokeWidth="12" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <circle cx="50" cy="50" r="10" fill="white" />
        </svg>
      </div>

      {/* Branding Text - Ultra Bold & Italic */}
      <div className="flex flex-col leading-[0.8]">
        <h1 className="text-3xl font-[1000] italic tracking-tighter text-white flex items-center">
          Mera<span style={{ color: themeColor }}>Anime</span>
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <div className="h-[1px] w-4" style={{ backgroundColor: themeColor }}></div>
          <span className="text-[8px] font-black tracking-[0.4em] text-zinc-500 uppercase">
            Anime Heaven
          </span>
        </div>
      </div>
    </div>
  );
};

export default Logo;