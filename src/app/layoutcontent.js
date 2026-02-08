'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { onAuthStateChanged } from "firebase/auth"; 
import { auth } from '@/firebase'; 
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import AnimeFooter from '@/components/AnimeFooter';

export default function LayoutContent({ children }) {
  const [isExpanded, setIsExpanded] = useState(false); 
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  const theme = useTheme();
  const themeColor = theme?.themeColor || '#ff6b00'; 

  const publicPages = ['/login', '/register', '/logout'];
  const isPublicPage = publicPages.includes(pathname);

  useEffect(() => {
    // --- BYPASS FOR SEARCH ENGINE BOTS ---
    const userAgent = typeof window !== 'undefined' ? navigator.userAgent.toLowerCase() : '';
    const isBot = /googlebot|bingbot|yandexbot|duckduckbot|slurp|baiduspider|crawler|spider|robot|crawling/i.test(userAgent);

    if (isBot) {
      setIsAuthenticated(true);
      setCheckingAuth(false);
      return; // Robots ko login ki zaroorat nahi
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        if (!isPublicPage) {
          router.push('/login');
        }
      }
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, [pathname, router, isPublicPage]);

  useEffect(() => {
    const updateFavicon = () => {
      const link = document.querySelector("link[rel~='icon']");
      if (link) {
        const svgIcon = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='${themeColor.replace('#', '%23')}' /><path d='M25 35 L50 65 L75 35' stroke='black' stroke-width='12' stroke-linecap='round' stroke-linejoin="round" /><circle cx='50' cy='50' r='10' fill='white' /></svg>`.trim();
        link.href = `data:image/svg+xml,${svgIcon}`;
      }
    };
    updateFavicon();
  }, [themeColor]);

  if (checkingAuth) {
    return (
      <div className="h-screen bg-[#020202] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-t-transparent animate-spin rounded-full" style={{ borderColor: `${themeColor} transparent ${themeColor} ${themeColor}` }}></div>
      </div>
    );
  }

  if (!isAuthenticated && !isPublicPage) return null;

  const layoutClasses = !isPublicPage ? (isExpanded ? 'md:ml-64 ml-0' : 'md:ml-20 ml-0') : 'ml-0';

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#020202]">
      {!isPublicPage && <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${layoutClasses}`}>
        {!isPublicPage && <div className="sticky top-0 z-[100]"><Navbar isExpanded={isExpanded} /></div>}
        <main className={`flex-1 w-full ${!isPublicPage ? 'mt-[90px]' : ''}`}>{children}</main>
        {!isPublicPage && <AnimeFooter />}
      </div>
    </div>
  );
}