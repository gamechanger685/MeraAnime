'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const UchihaReflex = ({ themeColor }) => {
  const [score, setScore] = useState(0);
  const [target, setTarget] = useState(null);
  const [lives, setLives] = useState(3);
  const [gameStatus, setGameStatus] = useState('waiting');
  const [difficulty, setDifficulty] = useState(1800);
  const [isShaking, setIsShaking] = useState(false);

  // Eye Stages Logic
  const getEyeStage = () => {
    if (score >= 40) return { name: 'RINNEGAN', color: '#8b5cf6', type: 'rinnegan' };
    if (score >= 25) return { name: 'MANGEKYO', color: '#ef4444', type: 'mangekyo' };
    if (score >= 12) return { name: '3-TOMOE', color: '#ff4d4d', type: 'tomoe' };
    return { name: 'AWAKENING', color: themeColor || '#ffffff', type: 'basic' };
  };
  const stage = getEyeStage();

  // 1. GAME ENGINE: Timer handling
  useEffect(() => {
    let timer;
    if (gameStatus === 'playing' && target) {
      timer = setTimeout(() => {
        handleMiss();
      }, difficulty);
    }
    return () => clearTimeout(timer); // Cleanup: Har hit pe purana timer kill
  }, [target, gameStatus]);

  // 2. SPAWN LOGIC: Naya target banana
  const spawnTarget = () => {
    const x = Math.floor(Math.random() * 70) + 15;
    const y = Math.floor(Math.random() * 60) + 20;
    setTarget({ id: Math.random(), x, y });
  };

  const handleMiss = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 200);
    
    setLives(prev => {
      const currentLives = prev - 1;
      if (currentLives <= 0) {
        setGameStatus('lost');
        setTarget(null);
        return 0;
      }
      spawnTarget(); // Next target spawn
      return currentLives;
    });
  };

  const hitTarget = (e) => {
    e.stopPropagation(); // Container click block
    setScore(s => s + 1);
    setDifficulty(prev => Math.max(prev - 40, 600)); 
    spawnTarget(); // Foran naya target
  };

  const startGame = (e) => {
    if (e) e.stopPropagation();
    setScore(0);
    setLives(5);
    setDifficulty(1800);
    setGameStatus('playing');
    spawnTarget();
  };

  return (
    <motion.div 
      animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
      className="relative w-full h-[450px] md:h-[550px] bg-[#020202] rounded-[2rem] overflow-hidden cursor-crosshair border border-white/10"
      onClick={() => {
        if (gameStatus === 'playing' && target) handleMiss();
      }}
    >
      {/* UI Hud */}
      <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-between pointer-events-none z-20">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] font-black opacity-30 uppercase tracking-[.4em]">Reflex_Link</p>
            <h3 className="text-5xl md:text-7xl font-[1000] italic leading-none" style={{ color: stage.color }}>{score}</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-2" style={{ color: stage.color }}>{stage.name}</p>
          </div>
          <div className="flex gap-2 bg-white/5 p-4 rounded-3xl border border-white/10">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`w-3 h-3 rounded-full transition-all duration-300 ${i < lives ? 'bg-red-600 shadow-[0_0_10px_#ef4444]' : 'bg-zinc-800'}`} />
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {gameStatus !== 'playing' ? (
          <motion.div 
            key="overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 bg-black/95 flex flex-col items-center justify-center p-6 text-center"
          >
            <h2 className="text-4xl md:text-6xl font-[1000] mb-6 italic uppercase tracking-tighter text-white">
              {gameStatus === 'waiting' ? 'UCHIHA_REFLEX' : 'EYE_CLOSED'}
            </h2>
            <button 
              onClick={startGame}
              className="px-12 py-5 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[.5em] hover:scale-105 active:scale-95 transition-all shadow-2xl"
            >
              Initialize Vision
            </button>
          </motion.div>
        ) : (
          target && (
            <motion.div
              key={target.id} // Important: Alag key se duplicate nahi banega
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 1.5, opacity: 0 }}
              onClick={hitTarget}
              className="absolute z-30 w-24 h-24 flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${target.x}%`, top: `${target.y}%` }}
            >
              {/* SHARINGAN EYE DESIGN */}
              <div className="relative w-20 h-20 rounded-full bg-red-600 border-[6px] border-black flex items-center justify-center shadow-[0_0_50px_rgba(239,68,68,0.6)]">
                <div className="w-4 h-4 bg-black rounded-full z-10" />
                
                {/* 3-TOMOE Pattern */}
                <div className="absolute inset-0 animate-[spin_3s_linear_infinite]">
                   <div className="absolute top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-black rounded-full" />
                   <div className="absolute bottom-2 right-2 w-3 h-3 bg-black rounded-full" />
                   <div className="absolute bottom-2 left-2 w-3 h-3 bg-black rounded-full" />
                </div>

                {/* Countdown Progress Circle */}
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <motion.circle
                    cx="50%" cy="50%" r="42%"
                    fill="transparent"
                    stroke="black"
                    strokeWidth="4"
                    initial={{ pathLength: 1 }}
                    animate={{ pathLength: 0 }}
                    transition={{ duration: difficulty / 1000, ease: "linear" }}
                  />
                </svg>
              </div>
            </motion.div>
          )
        )}
      </AnimatePresence>

      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
    </motion.div>
  );
};

export default UchihaReflex;