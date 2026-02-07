'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation'; // useRouter add kiya
import { useTheme } from '@/context/ThemeContext';
import { onAuthStateChanged } from "firebase/auth"; // Auth check
import { auth } from '@/firebase'; // Path check karlein
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import AnimeFooter from '@/components/AnimeFooter';
import MaintenanceTimer from '@/components/MaintenanceTimer';

export default function LayoutContent({ children }) {
  const [isExpanded, setIsExpanded] = useState(false); 
  const [checkingAuth, setCheckingAuth] = useState(true); // Loading state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  const theme = useTheme();
  const themeColor = theme?.themeColor || '#ff6b00'; 

  // Page check: Kaunse pages bina login ke dikhne chahiye
  const publicPages = ['/login', '/register', '/logout'];
  const isPublicPage = publicPages.includes(pathname);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        // Agar banda public page par nahi hai aur login bhi nahi hai, to bhagao login par
        if (!isPublicPage) {
          router.push('/login');
        }
      }
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, [pathname, router, isPublicPage]);

  // Favicon logic (Same as before)
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

  // 1. Agar auth check ho raha hai, to "Titan" loading screen dikhao
  if (checkingAuth) {
    return (
      <div className="h-screen bg-[#020202] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-t-transparent animate-spin rounded-full" style={{ borderColor: `${themeColor} transparent ${themeColor} ${themeColor}` }}></div>
          <p className="text-[10px] font-black tracking-[0.4em] uppercase opacity-40 text-white italic">Verifying_Identity</p>
        </div>
      </div>
    );
  }

  // 2. Agar login nahi hai aur public page bhi nahi hai, to kuch render mat karo (Redirect handle ho chuka hai)
  if (!isAuthenticated && !isPublicPage) return null;

  const layoutClasses = !isPublicPage ? (isExpanded ? 'md:ml-64 ml-0' : 'md:ml-20 ml-0') : 'ml-0';

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-x-hidden bg-[#020202]">
      {/* Sidebar sirf tab dikhao jab page public na ho */}
      {!isPublicPage && (
        <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      )}
      
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${layoutClasses}`}>
        
        {!isPublicPage && (
          <div className="sticky top-0 z-[100] w-full">
            <Navbar isExpanded={isExpanded} />
          </div>
        )}
        
        <main className={`flex-1 w-full max-w-[100vw] ${!isPublicPage ? 'mt-[90px]' : ''}`}>
          {children}
        </main>

        {!isPublicPage && <AnimeFooter />}
      </div>
    </div>
  );
}