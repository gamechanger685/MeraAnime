'use client'; // Next.js ke liye zaroori hai

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bomb, Star } from 'lucide-react';

// ==========================================
// GAME MODULE: KAZE MINES (RESPONSIVE GRID)
// ==========================================
const KazeMines = ({ themeColor }) => {
  const [level, setLevel] = useState(1);
  const [gridSize, setGridSize] = useState(3); // Start with 3x3
  const [grid, setGrid] = useState([]);
  const [revealed, setRevealed] = useState([]);
  const [status, setStatus] = useState('waiting'); // waiting, memorizing, playing, won, lost
  const [score, setScore] = useState(0);

  // Level Logic: Level ke hisab se bombs aur size set karna
  const initLevel = (lvl) => {
    const size = lvl <= 2 ? 3 : lvl <= 5 ? 4 : lvl <= 8 ? 5 : 6;
    const totalTiles = size * size;
    const bombCount = Math.min(Math.floor(totalTiles * 0.2) + (lvl - 1), totalTiles - 5);
    
    const newGrid = Array(totalTiles).fill('diamond');
    let bombsPlaced = 0;
    while (bombsPlaced < bombCount) {
      const randomIdx = Math.floor(Math.random() * totalTiles);
      if (newGrid[randomIdx] !== 'bomb') {
        newGrid[randomIdx] = 'bomb';
        bombsPlaced++;
      }
    }

    setGridSize(size);
    setGrid(newGrid);
    setRevealed([]);
    setStatus('memorizing');

    // Memorization Phase (1.5 seconds)
    setTimeout(() => {
      setStatus('playing');
    }, 1500);
  };

  const handleTileClick = (idx) => {
    if (status !== 'playing' || revealed.includes(idx)) return;

    const newRevealed = [...revealed, idx];
    setRevealed(newRevealed);

    if (grid[idx] === 'bomb') {
      setStatus('lost');
    } else {
      setScore(s => s + (level * 10));
      
      // Win Check
      const totalDiamonds = grid.filter(t => t === 'diamond').length;
      if (newRevealed.length === totalDiamonds) {
        setStatus('won');
        // Auto start next level after 1.5s
        setTimeout(() => {
          const nextLvl = level + 1;
          setLevel(nextLvl);
          initLevel(nextLvl);
        }, 1500);
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl py-4 relative">
      {/* Game HUD */}
      <div className="mb-6 flex justify-between w-full px-6 items-end">
        <div className="text-left">
          <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em]">Rank</p>
          <h4 className="text-xl font-black italic" style={{ color: themeColor }}>LEVEL {level}</h4>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em]">Total_XP</p>
          <h4 className="text-2xl font-black italic">{score}</h4>
        </div>
      </div>

      {/* Grid - Dynamic Size */}
      <div 
        className="grid gap-2 p-3 bg-zinc-900/40 rounded-[2rem] border border-white/5 shadow-2xl transition-all duration-500"
        style={{ 
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          width: 'min(90vw, 400px)' // Responsive width
        }}
      >
        {grid.map((tile, i) => {
          const isRevealed = revealed.includes(i);
          const isBomb = tile === 'bomb';
          const showAsBomb = (status === 'memorizing' && isBomb) || (status === 'lost' && isBomb);
          
          return (
            <motion.button
              key={`${level}-${i}`}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleTileClick(i)}
              className={`
                aspect-square rounded-xl md:rounded-2xl border-2 flex items-center justify-center transition-all duration-300
                ${showAsBomb 
                  ? 'bg-red-600 border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)]' 
                  : isRevealed 
                    ? 'bg-white border-white shadow-[0_0_10px_white]' 
                    : 'bg-black/40 border-white/5'}
              `}
            >
              {showAsBomb && <Bomb size={gridSize > 5 ? 14 : 20} className="text-white" />}
              {isRevealed && !isBomb && <Star size={gridSize > 5 ? 14 : 20} className="text-black" />}
            </motion.button>
          );
        })}
      </div>

      {/* Control / Overlay Section */}
      <div className="mt-8 text-center h-16">
        <AnimatePresence mode="wait">
          {status === 'waiting' && (
            <motion.button 
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              onClick={() => { setLevel(1); initLevel(1); }}
              className="px-12 py-4 rounded-full font-black text-xs uppercase tracking-[0.5em]"
              style={{ backgroundColor: themeColor, color: '#000' }}
            >
              START OPERATION
            </motion.button>
          )}

          {status === 'won' && (
            <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-green-500 font-black italic">
              <p className="text-xs uppercase tracking-widest">Seal Complete!</p>
              <h2 className="text-2xl">LEVEL {level} CLEAR</h2>
            </motion.div>
          )}

          {status === 'lost' && (
            <motion.button 
              initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              onClick={() => { setLevel(1); initLevel(1); }}
              className="px-8 py-3 bg-red-600 text-white rounded-full font-black text-[10px] uppercase"
            >
              MISSION FAILED - RESTART
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Info Tag */}
      {status === 'playing' && (
        <p className="text-[9px] font-black opacity-20 uppercase tracking-[0.4em]">
          Diamonds Remaining: {grid.filter(t => t === 'diamond').length - revealed.length}
        </p>
      )}
    </div>
  );
};

export default KazeMines;