'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext'; 
import './Maintenance.css';

const MaintenanceTimer = ({ isVisible = true, onComplete }) => {
  const { themeColor } = useTheme();
  
  // Next.js Fix: Initial state null rakhein taake server aur client mismatch na ho
  const [timeLeft, setTimeLeft] = useState(null);
  const [isStuck, setIsStuck] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Sirf pehli baar mount hone par chale
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Client-side par hi localStorage access karein
    if (!mounted) return;

    if (!isVisible) {
      localStorage.removeItem('maintenance_target');
      setIsStuck(false);
      setTimeLeft(null);
      return;
    }

    const getTargetTime = () => {
      const now = new Date().getTime();
      let savedTarget = localStorage.getItem('maintenance_target');
      
      if (!savedTarget || now > parseInt(savedTarget)) {
        const newTarget = now + (5 * 60 * 1000); 
        localStorage.setItem('maintenance_target', newTarget);
        return newTarget;
      }
      return parseInt(savedTarget);
    };

    const target = getTargetTime();

    const interval = setInterval(() => {
      const currentTime = new Date().getTime();
      const distance = target - currentTime;

      if (distance <= 0) {
        setTimeLeft(0);
        setIsStuck(true);
        clearInterval(interval);
        if (onComplete) onComplete();
      } else {
        setTimeLeft(distance);
        setIsStuck(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isVisible, onComplete, mounted]);

  useEffect(() => {
    if (isStuck) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isStuck]);

  // Next.js safety: Jab tak component puri tarah load na ho, kuch render na karein
  if (!mounted || !isVisible || timeLeft === null) return null;

  // --- RENDERING LOGIC (Baki UI wahi purani hai) ---
  if (isStuck) {
    return (
      <div className="stuck-screen anime-theme">
        <div className="scanline"></div>
        <div className="psychology-box">
          <div className="status-badge" style={{ color: themeColor, borderColor: themeColor }}>
            TRAINING ARC ACTIVE
          </div>
          <h1 className="glitch-text" style={{ textShadow: `0 0 20px ${themeColor}` }}>
            LEVELING <span style={{ color: themeColor }}>UP</span>
          </h1>
          <div className="evolution-bar">
            <div className="loading-bar-wrapper" style={{ borderColor: `${themeColor}44` }}>
              <div className="progress-neon" style={{ backgroundColor: themeColor, width: '98%' }}></div>
            </div>
          </div>
          <p className="return-note">Wapas zarur ana, naye surprises aapka intezar kar rahe hain.</p>
        </div>
      </div>
    );
  }

  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return (
    <div className={`anime-timer-card ${timeLeft < 30000 ? 'rage-mode' : ''}`} style={{ '--aura-color': themeColor }}>
      <div className="timer-main">
        <span className="digital-time">
          {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </span>
        <div className="energy-bar-bg">
          <div className="energy-fill-neon" 
               style={{ 
                 width: `${(timeLeft / (5 * 60 * 1000)) * 100}%`, 
                 background: themeColor,
                 boxShadow: `0 0 15px ${themeColor}`
               }}>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceTimer;