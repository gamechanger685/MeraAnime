'use client'; // Next.js ke liye zaroori hai

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, LayoutGrid } from 'lucide-react';

// ==========================================
// GAME MODULE: MEMORY SEAL (FIXED ERROR)
// ==========================================
const MemorySeal = ({ themeColor }) => {
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [isDisplaying, setIsDisplaying] = useState(false);
  const [activeTile, setActiveTile] = useState(null);
  const [level, setLevel] = useState(1);
  const [status, setStatus] = useState('waiting'); // waiting, playing, lost

  // Jutsu Sound/Visual feedback symbols
  const symbols = ['⚡', '🔥', '💧', '🍃', '🌑', '☀️', '🌀', '❄️', '☄️'];

  const startNextLevel = (currentLevel) => {
    setStatus('playing');
    setUserSequence([]);
    setIsDisplaying(true);
    
    // Generate new random sequence for this level
    const newSequence = [];
    for (let i = 0; i < currentLevel + 2; i++) {
      newSequence.push(Math.floor(Math.random() * 9));
    }
    setSequence(newSequence);
    playSequence(newSequence);
  };

  const playSequence = async (seq) => {
    for (let i = 0; i < seq.length; i++) {
      await new Promise(r => setTimeout(r, 600));
      setActiveTile(seq[i]);
      await new Promise(r => setTimeout(r, 400));
      setActiveTile(null);
    }
    setIsDisplaying(false);
  };

  const handleTileClick = (index) => {
    if (isDisplaying || status !== 'playing') return;

    const newUsersSeq = [...userSequence, index];
    setUserSequence(newUsersSeq);
    
    // Flash tile on click
    setActiveTile(index);
    setTimeout(() => setActiveTile(null), 200);

    // Check if correct
    if (index !== sequence[userSequence.length]) {
      setStatus('lost');
      return;
    }

    // Check if level complete
    if (newUsersSeq.length === sequence.length) {
      setTimeout(() => {
        setLevel(prev => prev + 1);
        startNextLevel(level + 1);
      }, 800);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md py-6 relative">
      {/* Header Info */}
      <div className="mb-10 text-center">
        <div className="px-4 py-1 rounded-full border border-white/10 bg-white/5 text-[9px] font-black tracking-[0.3em] mb-3 inline-block" style={{ color: themeColor }}>
          CIPHER_STRENGTH: LEVEL {level}
        </div>
        <h3 className="text-3xl md:text-5xl font-[1000] italic uppercase tracking-tighter">
          MEMORY<span style={{ color: themeColor }}>_</span>SEAL
        </h3>
      </div>

      {/* The 3x3 Grid */}
      <div className="grid grid-cols-3 gap-3 md:gap-4 p-4 bg-zinc-900/40 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
        {/* Progress Background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" 
             style={{ background: `radial-gradient(circle at center, ${themeColor} 0%, transparent 70%)` }} />
        
        {[...Array(9)].map((_, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleTileClick(i)}
            disabled={isDisplaying}
            className={`
              w-20 h-20 md:w-24 md:h-24 rounded-2xl border-2 flex items-center justify-center text-2xl transition-all duration-200
              ${activeTile === i 
                ? 'bg-white border-white shadow-[0_0_30px_#fff] scale-105' 
                : 'bg-black/40 border-white/5 hover:border-white/20'}
            `}
          >
            <span className={`transition-opacity duration-300 ${activeTile === i ? 'opacity-100' : 'opacity-10'}`}>
              {symbols[i]}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Interaction Status */}
      <div className="mt-8 h-6">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 animate-pulse">
          {isDisplaying ? "WATCH THE SEAL SEQUENCE" : "REPEAT THE HAND SIGNS"}
        </p>
      </div>

      {/* Overlay Screens */}
      <AnimatePresence>
        {status !== 'playing' && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 bg-black/95 rounded-[3rem] border border-white/5 flex flex-col items-center justify-center p-8 text-center"
          >
            <LayoutGrid size={48} className="mb-6 opacity-20" />
            <h2 className="text-4xl font-[1000] italic uppercase tracking-tighter mb-2">
              {status === 'waiting' ? 'CIPHER_INIT' : 'SEAL_BROKEN'}
            </h2>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] mb-10">
              {status === 'waiting' ? 'Memorize the jutsu sequence' : `Max Level Reached: ${level}`}
            </p>
            <button 
              onClick={() => { setLevel(1); startNextLevel(1); }}
              className="px-12 py-4 rounded-full font-black text-xs uppercase tracking-[0.5em] transition-all hover:scale-105"
              style={{ backgroundColor: themeColor, color: '#000' }}
            >
              {status === 'waiting' ? 'START MISSION' : 'TRY AGAIN'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => alert("Watch which tiles light up, then click them in the same order.")}
        className="mt-8 text-zinc-600 hover:text-white transition-colors"
      >
        <HelpCircle size={20} />
      </button>
    </div>
  );
};

export default MemorySeal;