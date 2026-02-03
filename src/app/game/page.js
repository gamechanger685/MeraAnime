'use client';

import React, { useState, Suspense, lazy } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { 
  Gamepad2, Swords, Brain, Zap, Target, 
  RotateCcw, LayoutGrid, Star, Bomb, Activity 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- ALL DYNAMIC IMPORTS ---
const TicTacToeAI = lazy(() => import('@/components/game/TicTacToeAI'));
const HeroDecode = lazy(() => import('@/components/game/HeroDecode'));
const PowerClicker = lazy(() => import('@/components/game/PowerClicker'));
const MemorySeal = lazy(() => import('@/components/game/MemorySeal'));
const UchihaReflex = lazy(() => import('@/components/game/UchihaReflex'));
const KazeMines = lazy(() => import('@/components/game/KazeMines'));
const KazeQuiz = lazy(() => import('@/components/game/KazeQuiz'));

const GameArcade = () => {
  const { themeColor } = useTheme();
  const [activeGame, setActiveGame] = useState(null);

  const gamesList = [
    { id: 'tictac', title: "Tactics", desc: "VS Sasuke AI", icon: <Swords size={20} />, color: "#ff4d4d" },
    { id: 'word', title: "Decode", desc: "Anime Words", icon: <Brain size={20} />, color: "#4da6ff" },
    { id: 'clicker', title: "Power", desc: "SSJ Level", icon: <Zap size={20} />, color: "#ffcc00" },
    { id: 'reflex', title: "Reflex", desc: "Uchiha Eye", icon: <Target size={20} />, color: "#a855f7" },
    { id: 'memory', title: "Seal", desc: "Jutsu Match", icon: <LayoutGrid size={20} />, color: "#10b981" },
    { id: 'quiz', title: "Kage", desc: "Lore Quiz", icon: <Star size={20} />, color: "#f97316" },
    { id: 'bomber', title: "Mines", desc: "Clay Trap", icon: <Bomb size={20} />, color: "#ef4444" },
  ];

  return (
    <div className="min-h-screen bg-[#020202] text-white pt-20 md:pt-10 pb-10 px-2 sm:px-4 overflow-x-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* --- HEADER --- */}
        <header className="flex flex-col items-center mb-8 md:mb-12 text-center">
          <motion.div initial={{ y: -20 }} animate={{ y: 0 }} className="flex items-center gap-3">
            <Gamepad2 size={24} style={{ color: themeColor }} />
            <h1 className="text-3xl md:text-6xl font-[1000] italic uppercase tracking-tighter">
              SHINOBI<span style={{ color: themeColor }}>.</span>ARCADE
            </h1>
          </motion.div>
          <p className="text-zinc-600 font-black tracking-[0.3em] text-[8px] md:text-[10px] uppercase italic">
            Neural Gaming Interface v4.0
          </p>
        </header>

        <AnimatePresence mode="wait">
          {!activeGame ? (
            /* --- MAIN MENU --- */
            <motion.div 
              key="menu"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6"
            >
              {gamesList.map((game) => (
                <div
                  key={game.id}
                  onClick={() => setActiveGame(game.id)}
                  className="group bg-zinc-900/30 border border-white/5 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] backdrop-blur-xl hover:border-white/20 transition-all cursor-pointer relative overflow-hidden"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl mb-3 md:mb-4 flex items-center justify-center transition-transform group-hover:scale-110 duration-500" 
                       style={{ backgroundColor: `${game.color}15`, color: game.color }}>
                    {game.icon}
                  </div>
                  <h3 className="text-sm md:text-lg font-black italic uppercase tracking-tighter">{game.title}</h3>
                  <p className="text-zinc-600 text-[8px] md:text-[10px] font-bold mt-1 uppercase tracking-widest">{game.desc}</p>
                </div>
              ))}
            </motion.div>
          ) : (
            /* --- GAME VIEWPORT --- */
            <motion.div 
              key="stage"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col items-center"
            >
              <button 
                onClick={() => setActiveGame(null)}
                className="mb-6 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black hover:bg-red-500/20 transition-all uppercase tracking-widest flex items-center gap-2"
              >
                <RotateCcw size={14} /> Back to Menu
              </button>

              {/* CLEAN GAME BOX (No Placeholder Text) */}
              <div className="w-full max-w-4xl min-h-[450px] md:min-h-[550px] bg-zinc-900/10 border border-white/5 rounded-[2rem] md:rounded-[3rem] p-2 md:p-8 backdrop-blur-3xl shadow-2xl relative flex justify-center items-center overflow-hidden">
                
                <Suspense fallback={
                  <div className="flex flex-col items-center gap-4">
                    <Activity className="animate-spin" style={{ color: themeColor }} />
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500">Syncing Module...</p>
                  </div>
                }>
                  {/* --- GAME SWITCHER --- */}
                  {activeGame === 'tictac' && <TicTacToeAI themeColor={themeColor} />}
                  {activeGame === 'word' && <HeroDecode themeColor={themeColor} />}
                  {activeGame === 'clicker' && <PowerClicker themeColor={themeColor} />}
                  {activeGame === 'reflex' && <UchihaReflex themeColor={themeColor} />}
                  {activeGame === 'memory' && <MemorySeal themeColor={themeColor} />}
                  {activeGame === 'quiz' && <KazeQuiz themeColor={themeColor} />}
                  {activeGame === 'bomber' && <KazeMines themeColor={themeColor} />}
                </Suspense>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GameArcade;