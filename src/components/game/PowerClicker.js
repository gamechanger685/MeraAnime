'use client'; // Next.js ke liye zaroori hai

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';

// ==========================================
// GAME MODULE: POWER CLICKER (FIXED HEIGHT)
// ==========================================
const PowerClicker = ({ themeColor }) => {
  const [power, setPower] = useState(0);
  const [isCharging, setIsCharging] = useState(false);
  const [clicks, setClicks] = useState([]);
  const [rank, setRank] = useState("GENIN");

  // Rank Evolution Logic
  useEffect(() => {
    if (power > 500) setRank("HOKAGE");
    else if (power > 250) setRank("SANNIN");
    else if (power > 100) setRank("JONIN");
    else if (power > 50) setRank("CHUNIN");
    else setRank("GENIN");
  }, [power]);

  const handlePowerClick = (e) => {
    setPower(p => p + 1);
    setIsCharging(true);
    setTimeout(() => setIsCharging(false), 80);

    // Dynamic Floating Text Position
    const rect = e.currentTarget.getBoundingClientRect();
    const newClick = {
      id: Date.now(),
      x: Math.random() * 100 - 50, // Random horizontal spread
      y: -20
    };
    
    setClicks(prev => [...prev, newClick]);
    setTimeout(() => {
      setClicks(prev => prev.filter(c => c.id !== newClick.id));
    }, 800);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full py-4 md:py-10 relative overflow-hidden">
      
      {/* Background Power Aura */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none transition-all duration-1000"
        style={{ 
          background: `radial-gradient(circle at center, ${themeColor} 0%, transparent 70%)`,
          transform: `scale(${1 + (power % 100) / 100})`
        }} 
      />

      <div className="text-center z-10 mb-6">
        <motion.div
          key={rank}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="px-4 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-black tracking-[0.4em] mb-4 inline-block"
          style={{ color: themeColor }}
        >
          RANK: {rank}
        </motion.div>
        
        <h2 className="text-3xl md:text-5xl font-[1000] italic uppercase tracking-tighter mb-2">
          CHAKRA_RESERVE
        </h2>
        
        <motion.p 
          key={power}
          initial={{ scale: 1.1, filter: "brightness(2)" }}
          animate={{ scale: 1, filter: "brightness(1)" }}
          className="text-6xl md:text-9xl font-black" 
          style={{ 
            color: themeColor,
            textShadow: `0 0 40px ${themeColor}88`
          }}
        >
          {power}
        </motion.p>
      </div>

      {/* Main Clicking Sphere */}
      <div className="relative group">
        <AnimatePresence>
          {clicks.map(click => (
            <motion.span
              key={click.id}
              initial={{ opacity: 1, y: 0, x: click.x, scale: 1 }}
              animate={{ opacity: 0, y: -150, x: click.x * 2, scale: 1.5 }}
              className="absolute top-0 left-1/2 z-[100] font-black text-2xl pointer-events-none select-none"
              style={{ color: themeColor }}
            >
              +1
            </motion.span>
          ))}
        </AnimatePresence>

        {/* Outer Pulsing Aura */}
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -inset-8 rounded-full blur-2xl pointer-events-none"
          style={{ backgroundColor: themeColor }}
        />

        <motion.button 
          whileTap={{ scale: 0.9 }} 
          onClick={handlePowerClick}
          className="w-40 h-40 md:w-60 md:h-60 rounded-full border-[8px] flex flex-col items-center justify-center bg-[#050505] shadow-2xl relative z-10 overflow-hidden"
          style={{ 
            borderColor: themeColor,
            boxShadow: isCharging ? `0 0 80px ${themeColor}` : `0 0 30px ${themeColor}33`
          }}
        >
          {/* Inner Liquid Fill Effect */}
          <motion.div 
            className="absolute bottom-0 left-0 right-0 z-0 opacity-20"
            style={{ 
              backgroundColor: themeColor,
              height: `${(power % 100)}%`
            }}
          />

          <Zap 
            size={isCharging ? 70 : 60} 
            className="z-10 transition-all duration-75"
            style={{ 
              color: themeColor,
              filter: isCharging ? 'drop-shadow(0 0 20px white)' : 'none'
            }} 
          />
        </motion.button>
      </div>

      <div className="mt-12 w-full max-w-[250px] space-y-4">
        <div className="flex justify-between text-[8px] font-black uppercase tracking-widest opacity-40">
          <span>Progress to Next Rank</span>
          <span>{power % 100}%</span>
        </div>
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-[2px] border border-white/5">
          <motion.div 
            className="h-full rounded-full"
            animate={{ width: `${(power % 100)}%` }}
            style={{ 
              backgroundColor: themeColor,
              boxShadow: `0 0 10px ${themeColor}`
            }}
          />
        </div>
        <p className="text-center text-[9px] font-black opacity-20 uppercase tracking-[0.3em]">
          Focus your chakra to transcend limits
        </p>
      </div>
    </div>
  );
};

export default PowerClicker;