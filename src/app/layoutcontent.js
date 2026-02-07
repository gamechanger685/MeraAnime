'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import AnimeFooter from '@/components/AnimeFooter';
import MaintenanceTimer from '@/components/MaintenanceTimer';

export default function LayoutContent({ children }) {
  const [isLive, setIsLive] = useState(true); 
  const [isExpanded, setIsExpanded] = useState(false); 
  const pathname = usePathname();
  
  const theme = useTheme();
  const themeColor = theme?.themeColor || '#ff6b00'; 

  // Favicon Dynamic Update Logic
  useEffect(() => {
    const updateFavicon = () => {
      const link = document.querySelector("link[rel~='icon']");
      if (link) {
        const svgIcon = `
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
            <circle cx='50' cy='50' r='50' fill='${themeColor.replace('#', '%23')}' />
            <path d='M25 35 L50 65 L75 35' stroke='black' stroke-width='12' stroke-linecap='round' stroke-linejoin="round" />
            <circle cx='50' cy='50' r='10' fill='white' />
          </svg>
        `.trim();
        link.href = `data:image/svg+xml,${svgIcon}`;
      }
    };
    updateFavicon();
  }, [themeColor]);

  const hideLayout = ['/login', '/register', '/logout'].includes(pathname);
  const layoutClasses = !hideLayout ? (isExpanded ? 'md:ml-64 ml-0' : 'md:ml-20 ml-0') : 'ml-0';

  // YAHAN SE HTML, HEAD, BODY HATADEIN
  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-x-hidden bg-[#050505]">
      {!hideLayout && (
        <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      )}
      
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${layoutClasses}`}>
        {!isLive && <MaintenanceTimer onComplete={() => console.log("Site Locked!")} />}
        
        {!hideLayout && (
          <div className="sticky top-0 z-[100] w-full">
            <Navbar isExpanded={isExpanded} />
          </div>
        )}
        
        <main className="flex-1 w-full max-w-[100vw] mt-[90px]">
          {children}
        </main>

        {!hideLayout && <AnimeFooter />}
      </div>
    </div>
  );
}