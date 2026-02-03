'use client'; // Next.js ke liye zaroori hai

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Shield, Activity } from 'lucide-react';

// ==========================================
// GAME MODULE: KAZE QUIZ (RESPONSIVE OPTIONS)
// ==========================================
const KazeQuiz = ({ themeColor }) => {
  const questions = [
    {
      q: "Who created the Shadow Clone Jutsu?",
      options: ["Tobirama Senju", "Minato Namikaze", "Naruto Uzumaki", "Hashirama Senju"],
      ans: 0
    },
    {
      q: "What is the name of Goku's signature move?",
      options: ["Rasengan", "Kamehameha", "Special Beam Cannon", "Final Flash"],
      ans: 1
    },
    {
      q: "Who is known as the 'Strongest Sorcerer' in JJK?",
      options: ["Sukuna", "Yuta Okkotsu", "Satoru Gojo", "Toji Fushiguro"],
      ans: 2
    },
    {
      q: "Which anime features a notebook that can kill people?",
      options: ["Code Geass", "Death Note", "Psycho-Pass", "Monster"],
      ans: 1
    },
    {
      q: "What is Luffy's ultimate goal?",
      options: ["Become Hokage", "Find the One Piece", "Kill all Titans", "Catch 'em all"],
      ans: 1
    }
  ];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAns, setSelectedAns] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const handleAnswer = (idx) => {
    if (selectedAns !== null) return; // Double click block
    
    setSelectedAns(idx);
    const correct = idx === questions[currentIdx].ans;
    setIsCorrect(correct);

    if (correct) setScore(s => s + 1);

    setTimeout(() => {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(prev => prev + 1);
        setSelectedAns(null);
        setIsCorrect(null);
      } else {
        setShowResult(true);
      }
    }, 1000);
  };

  const restart = () => {
    setCurrentIdx(0);
    setScore(0);
    setShowResult(false);
    setSelectedAns(null);
    setIsCorrect(null);
  };

  return (
    <div className="w-full max-w-2xl flex flex-col items-center py-4 md:py-10 px-2">
      {!showResult ? (
        <motion.div 
          key={currentIdx}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-full"
        >
          {/* Progress Header */}
          <div className="flex justify-between items-center mb-8 px-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-black opacity-30 uppercase tracking-widest">Question</span>
              <span className="text-2xl font-black italic">{currentIdx + 1}<span className="text-sm opacity-20">/{questions.length}</span></span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black opacity-30 uppercase tracking-widest">Current Score</span>
              <span className="text-2xl font-black italic" style={{ color: themeColor }}>{score * 10}</span>
            </div>
          </div>

          {/* Question Card */}
          <div className="w-full bg-zinc-900/50 p-8 md:p-14 rounded-[2.5rem] border border-white/5 mb-8 text-center shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                <motion.div 
                  className="h-full" 
                  initial={{ width: 0 }} 
                  animate={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                  style={{ backgroundColor: themeColor, boxShadow: `0 0 15px ${themeColor}` }}
                />
             </div>
             <Trophy className="absolute -bottom-4 -right-4 size-24 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
             <h2 className="text-xl md:text-3xl font-[1000] italic leading-tight uppercase tracking-tighter">
                {questions[currentIdx].q}
             </h2>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full px-2">
            {questions[currentIdx].options.map((opt, i) => {
              const isSelected = selectedAns === i;
              const isActuallyCorrect = i === questions[currentIdx].ans;
              
              let borderColor = "border-white/10";
              let bgColor = "bg-white/5";

              if (isSelected) {
                borderColor = isCorrect ? "border-green-500" : "border-red-500";
                bgColor = isCorrect ? "bg-green-500/20" : "bg-red-500/20";
              } else if (selectedAns !== null && isActuallyCorrect) {
                borderColor = "border-green-500";
                bgColor = "bg-green-500/10";
              }

              return (
                <motion.button 
                  key={i}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(i)}
                  className={`p-5 md:p-7 rounded-2xl font-bold text-left transition-all border-2 flex items-center justify-between group ${borderColor} ${bgColor}`}
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center text-[10px] border border-white/5 group-hover:border-white/20 transition-all">0{i+1}</span>
                    <span className="text-sm md:text-base uppercase tracking-tight">{opt}</span>
                  </div>
                  {isSelected && (isCorrect ? <Shield size={18} className="text-green-500" /> : <Activity size={18} className="text-red-500" />)}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      ) : (
        /* Result Screen */
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md bg-zinc-900/40 p-10 rounded-[3rem] border border-white/10 text-center backdrop-blur-3xl"
        >
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
            <Trophy size={40} style={{ color: themeColor }} />
          </div>
          <h2 className="text-4xl font-[1000] italic uppercase tracking-tighter mb-2">COMPLETE</h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] mb-8">Shinobi Intelligence Assessment</p>
          
          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
              <p className="text-[8px] font-black opacity-30 uppercase mb-1">Accuracy</p>
              <p className="text-2xl font-black">{(score / questions.length) * 100}%</p>
            </div>
            <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
              <p className="text-[8px] font-black opacity-30 uppercase mb-1">XP Earned</p>
              <p className="text-2xl font-black" style={{ color: themeColor }}>+{score * 50}</p>
            </div>
          </div>

          <button 
            onClick={restart}
            className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.4em] transition-all"
            style={{ backgroundColor: themeColor, color: '#000' }}
          >
            RE-TAKE EXAM
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default KazeQuiz;