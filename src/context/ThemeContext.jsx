'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // 1. Persistent State (Next.js fix: Pehle default value, phir useEffect mein check)
  const [themeColor, setThemeColor] = useState('#ff6b00');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [clickAudio, setClickAudio] = useState(null);

  // 2. Initialization (Sirf client-side par chalega)
  useEffect(() => {
    // LocalStorage se data uthana
    const savedTheme = localStorage.getItem('neural-theme');
    const savedSound = localStorage.getItem('neural-sound');
    
    if (savedTheme) setThemeColor(savedTheme);
    if (savedSound !== null) setSoundEnabled(JSON.parse(savedSound));

    // Audio object ko client-side par hi initialize karna
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
    audio.volume = 0.05;
    setClickAudio(audio);
  }, []);

  // 3. Global Sync Logic
  useEffect(() => {
    // LocalStorage Sync
    localStorage.setItem('neural-theme', themeColor);
    localStorage.setItem('neural-sound', JSON.stringify(soundEnabled));

    // CSS Variables Injection
    document.documentElement.style.setProperty('--accent-color', themeColor);
    document.documentElement.style.setProperty('--accent-glow', `${themeColor}66`); 
    
    // Neural Body Glow Effect
    document.body.style.boxShadow = `inset 0 0 100px ${themeColor}11`;
  }, [themeColor, soundEnabled]);

  // 4. Audio Feedback Logic
  const playNeuralClick = () => {
    if (soundEnabled && clickAudio) {
      clickAudio.currentTime = 0; // Reset for rapid clicks
      clickAudio.play().catch(() => {});
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      themeColor, 
      setThemeColor, 
      soundEnabled, 
      setSoundEnabled, 
      playNeuralClick 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);