'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Brain } from 'lucide-react';

const HeroDecode = ({ themeColor }) => {
  const characters = [
    { name: "NARUTO", hint: "Hidden Leaf's Number One Ninja", series: "Naruto" },
    { name: "SAITAMA", hint: "The Hero who can end any fight in one punch", series: "One Punch Man" },
    { name: "ITACHI", hint: "Sacrificed everything to protect the village from shadows", series: "Naruto" },
    { name: "GOJO", hint: "The strongest Sorcerer with the Six Eyes", series: "Jujutsu Kaisen" },
    { name: "LUFFY", hint: "Boy who made of rubber, seeking the ultimate treasure", series: "One Piece" },
    { name: "ZORO", hint: "Three-sword style master seeking to be the greatest", series: "One Piece" },
    { name: "EREN", hint: "He sought freedom beyond the walls at any cost", series: "Attack on Titan" },
    { name: "LEVI", hint: "Humanity's cleanest and strongest soldier", series: "Attack on Titan" }
  ];

  const [gameState, setGameState] = useState({
    wordData: characters[Math.floor(Math.random() * characters.length)],
    guessed: [],
    mistakes: 0,
    maxMistakes: 6,
    status: 'playing',
    timeLeft: 45
  });

  useEffect(() => {
    let timer;
    if (gameState.status === 'playing' && gameState.timeLeft > 0) {
      timer = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1,
          status: prev.timeLeft <= 1 ? 'lost' : 'playing'
        }));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState.status, gameState.timeLeft]);

  const handleGuess = (letter) => {
    if (gameState.guessed.includes(letter) || gameState.status !== 'playing') return;
    const isCorrect = gameState.wordData.name.includes(letter);
    const newGuessed = [...gameState.guessed, letter];
    const newMistakes = isCorrect ? gameState.mistakes : gameState.mistakes + 1;
    let newStatus = 'playing';
    if (newMistakes >= gameState.maxMistakes) newStatus = 'lost';
    else if (gameState.wordData.name.split('').every(l => newGuessed.includes(l))) newStatus = 'won';
    setGameState(prev => ({ ...prev, guessed: newGuessed, mistakes: newMistakes, status: newStatus }));
  };

  const resetGame = () => {
    setGameState({
      wordData: characters[Math.floor(Math.random() * characters.length)],
      guessed: [],
      mistakes: 0,
      maxMistakes: 6,
      status: 'playing',
      timeLeft: 45
    });
  };

  return (
    // 1. MOBILE FIX: 'w-full' aur 'px-2' use kiya taake side se jagah khatam ho
    <div className="w-full max-w-full lg:max-w-3xl flex flex-col items-center px-2 sm:px-4 py-2 mx-auto overflow-x-hidden">
      
      {/* Top HUD */}
      <div className="w-full flex justify-between items-end mb-4 border-b border-white/10 pb-4">
        <div>
          <p className="text-[8px] sm:text-[10px] font-black opacity-40 uppercase tracking-[0.1em] sm:tracking-[0.2em]">Security_Override</p>
          <h4 className="text-lg sm:text-xl font-black italic" style={{ color: themeColor }}>DECODING...</h4>
        </div>
        <div className="text-right">
          <p className="text-[8px] sm:text-[10px] font-black opacity-40 uppercase mb-1 text-red-500">Stability</p>
          <div className="flex gap-0.5 sm:gap-1">
            {[...Array(gameState.maxMistakes)].map((_, i) => (
              <div key={i} className={`h-1 w-3 sm:w-6 rounded-full transition-all duration-500 ${i < (gameState.maxMistakes - gameState.mistakes) ? 'bg-red-500 shadow-[0_0_5px_red]' : 'bg-white/5'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Timer & Hint Card */}
      <div className="relative w-full bg-white/5 p-3 sm:p-6 rounded-xl sm:rounded-2xl border border-white/10 mb-4 sm:mb-8 overflow-hidden">
        <div className="absolute top-0 left-0 h-1 bg-white/20 transition-all duration-1000" style={{ width: `${(gameState.timeLeft / 45) * 100}%`, backgroundColor: themeColor }} />
        
        <div className="flex items-center gap-2 sm:gap-4 mb-2">
          <div className="p-1.5 rounded-lg bg-black/40 border border-white/5">
             <Brain size={16} className="sm:w-5 sm:h-5" style={{ color: themeColor }} />
          </div>
          <span className="text-[8px] sm:text-[10px] font-black tracking-widest opacity-50 uppercase">Intel_Hint</span>
          <span className="ml-auto font-mono text-sm sm:text-base font-bold" style={{ color: gameState.timeLeft < 10 ? '#ef4444' : themeColor }}>
            00:{gameState.timeLeft < 10 ? `0${gameState.timeLeft}` : gameState.timeLeft}
          </span>
        </div>
        
        <p className="text-xs sm:text-lg font-bold italic uppercase tracking-tight leading-tight">
          "{gameState.wordData.hint}"
        </p>
      </div>

      {/* Word Display - Responsive sizes */}
      <div className="flex flex-wrap justify-center gap-1.5 sm:gap-4 mb-8 sm:mb-12 min-h-[50px]">
        {gameState.wordData.name.split('').map((l, i) => (
          <motion.div key={i} className="w-6 h-10 sm:w-14 sm:h-20 flex flex-col items-center justify-center">
            <span className="text-xl sm:text-5xl font-[1000] italic" 
                  style={{ color: gameState.guessed.includes(l) ? themeColor : 'transparent' }}>
              {gameState.guessed.includes(l) ? l : ""}
            </span>
            <div className="w-full h-0.5 sm:h-1 mt-1 rounded-full bg-white/10" 
                 style={{ backgroundColor: gameState.guessed.includes(l) ? themeColor : 'rgba(255,255,255,0.1)' }} />
          </motion.div>
        ))}
      </div>

      {/* Keyboard - Mobile Optimized Grid */}
      {/* 2. MOBILE FIX: Grid cols 7 se small screens par letters fit aayenge */}
      <div className="grid grid-cols-7 sm:grid-cols-9 gap-1 sm:gap-2.5 w-full max-w-full">
        {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('').map(l => {
          const isGuessed = gameState.guessed.includes(l);
          const isCorrect = isGuessed && gameState.wordData.name.includes(l);
          return (
            <motion.button 
              key={l}
              whileTap={{ scale: 0.9 }}
              disabled={isGuessed || gameState.status !== 'playing'}
              onClick={() => handleGuess(l)}
              className={`
                aspect-square flex items-center justify-center rounded-md sm:rounded-xl text-[10px] sm:text-sm font-black transition-all border
                ${!isGuessed ? 'bg-white/5 border-white/10 text-white' : 
                  isCorrect ? 'bg-green-500/20 border-green-500/50 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500/40'}
              `}
            >
              {l}
            </motion.button>
          );
        })}
      </div>

      {/* Overlay - Fixed for Mobile */}
      <AnimatePresence>
        {gameState.status !== 'playing' && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center"
          >
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-zinc-900 border border-white/10 p-6 sm:p-12 rounded-[2rem] max-w-xs sm:max-w-sm w-full">
              <h2 className={`text-4xl sm:text-6xl font-[1000] italic mb-4 ${gameState.status === 'won' ? 'text-green-500' : 'text-red-500'}`}>
                {gameState.status === 'won' ? 'SUCCESS' : 'FAILED'}
              </h2>
              <p className="text-zinc-500 font-bold mb-8 text-[10px] sm:text-xs uppercase">Target: <span className="text-white">{gameState.wordData.name}</span></p>
              <button onClick={resetGame} className="w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest" style={{ backgroundColor: themeColor, color: '#000' }}>
                RE-SYNC
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeroDecode;