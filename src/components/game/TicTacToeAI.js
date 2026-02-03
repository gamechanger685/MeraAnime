'use client'; // Next.js ke liye zaroori hai

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw } from 'lucide-react';

// ==========================================
// GAME MODULE: NINJA TACTICS (FIXED BOXES)
// ==========================================
const TicTacToeAI = ({ themeColor }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerNext, setIsPlayerNext] = useState(true);
  const [status, setStatus] = useState("YOUR MOVE, SHINOBI");
  const [winningLine, setWinningLine] = useState(null);
  const [scores, setScores] = useState({ player: 0, bot: 0 });

  const player = '🍥'; 
  const bot = '⚡';   

  const winPatterns = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

  const calculateWinner = (squares) => {
    for (let i = 0; i < winPatterns.length; i++) {
      const [a, b, c] = winPatterns[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: winPatterns[i] };
      }
    }
    return squares.includes(null) ? null : { winner: 'Draw', line: null };
  };

  const minimax = (newBoard, depth, isMaximizing) => {
    const res = calculateWinner(newBoard);
    if (res?.winner === bot) return 10 - depth;
    if (res?.winner === player) return depth - 10;
    if (res?.winner === 'Draw') return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (!newBoard[i]) {
          newBoard[i] = bot;
          let score = minimax(newBoard, depth + 1, false);
          newBoard[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (!newBoard[i]) {
          newBoard[i] = player;
          let score = minimax(newBoard, depth + 1, true);
          newBoard[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  useEffect(() => {
    const result = calculateWinner(board);
    if (!isPlayerNext && !result) {
      setStatus("SASUKE IS THINKING...");
      const timer = setTimeout(() => {
        let bestScore = -Infinity;
        let move;
        const tempBoard = [...board];
        for (let i = 0; i < 9; i++) {
          if (!tempBoard[i]) {
            tempBoard[i] = bot;
            let score = minimax(tempBoard, 0, false);
            tempBoard[i] = null;
            if (score > bestScore) {
              bestScore = score;
              move = i;
            }
          }
        }
        if (move !== undefined) makeMove(move, bot);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isPlayerNext]);

  const makeMove = (i, symbol) => {
    if (board[i] || calculateWinner(board)) return;
    
    const newBoard = [...board];
    newBoard[i] = symbol;
    setBoard(newBoard);
    
    const result = calculateWinner(newBoard);
    if (result) {
      setWinningLine(result.line);
      if (result.winner === 'Draw') {
        setStatus("STALEMATE!");
      } else {
        setStatus(result.winner === player ? "VICTORY!" : "DEFEAT!");
        setScores(s => ({...s, [result.winner === player ? 'player' : 'bot']: s[result.winner === player ? 'player' : 'bot'] + 1}));
      }
    } else {
      setIsPlayerNext(symbol === bot);
      setStatus(symbol === bot ? "YOUR MOVE, SHINOBI" : "SASUKE ANALYZING...");
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerNext(true);
    setStatus("YOUR MOVE, SHINOBI");
    setWinningLine(null);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md p-4">
      {/* Scoreboard */}
      <div className="flex justify-between w-full mb-8 bg-white/5 p-4 rounded-2xl border border-white/10">
        <div className="text-center">
          <p className="text-[10px] font-black opacity-40 uppercase">Naruto</p>
          <p className="text-2xl font-black" style={{ color: themeColor }}>{scores.player}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-px w-8 bg-white/20" />
          <span className="text-[10px] font-black opacity-20 italic">VS</span>
          <div className="h-px w-8 bg-white/20" />
        </div>
        <div className="text-center">
          <p className="text-[10px] font-black opacity-40 uppercase">Sasuke</p>
          <p className="text-2xl font-black text-red-500">{scores.bot}</p>
        </div>
      </div>

      {/* Game Status */}
      <div className="mb-6 text-center h-8 flex items-center justify-center">
        <motion.p 
          key={status}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-[1000] tracking-[0.3em] uppercase"
          style={{ color: status.includes('VICTORY') ? '#22c55e' : status.includes('DEFEAT') ? '#ef4444' : themeColor }}
        >
          {status}
        </motion.p>
      </div>

      {/* The Grid */}
      <div className="relative grid grid-cols-3 gap-3 w-full aspect-square p-3 bg-zinc-900/50 rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
        {board.map((cell, i) => {
          const isWinningCell = winningLine?.includes(i);
          return (
            <motion.button
              key={i}
              whileTap={{ scale: 0.9 }}
              onClick={() => isPlayerNext && makeMove(i, player)}
              className={`relative z-10 aspect-square rounded-2xl bg-black/40 border flex items-center justify-center text-4xl md:text-5xl transition-all duration-300
                ${isWinningCell ? 'border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'border-white/5 hover:border-white/20'}
              `}
            >
              <AnimatePresence>
                {cell && (
                  <motion.span
                    initial={{ scale: 0, rotate: -45, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    className="select-none"
                    style={{ filter: isWinningCell ? 'drop-shadow(0 0 10px white)' : 'none' }}
                  >
                    {cell}
                  </motion.span>
                )}
              </AnimatePresence>
              {/* Highlight background if winner */}
              {isWinningCell && (
                <motion.div 
                  layoutId="win-glow"
                  className="absolute inset-0 rounded-2xl opacity-20"
                  style={{ backgroundColor: themeColor }}
                />
              )}
            </motion.button>
          );
        })}

        {/* Dynamic Background Grid Lines */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-5 pointer-events-none">
          {[...Array(9)].map((_, i) => <div key={i} className="border-[0.5px] border-white" />)}
        </div>
      </div>

      {/* Reset & Controls */}
      <div className="flex gap-4 mt-8">
        <button 
          onClick={resetGame}
          className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
        >
          <RotateCcw size={14} style={{ color: themeColor }} /> RESET JUTSU
        </button>
      </div>
    </div>
  );
};

// File ke aakhir mein ye hona zaroori hai
export default TicTacToeAI;