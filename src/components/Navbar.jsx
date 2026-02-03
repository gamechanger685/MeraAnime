'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { auth, db } from '@/firebase'; 
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { useTheme } from '@/context/ThemeContext';
import Logo from './Logo';

const Navbar = ({ isExpanded }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const { themeColor } = useTheme();
  const router = useRouter(); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const unsubDoc = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
        });
        return () => unsubDoc();
      }
    });
    return () => unsubscribe();
  }, []);

  // 🚀 AVATAR LOGIC (Gender & Gmail based)
  // Navbar.jsx snippet
const getAvatar = () => {
  // 1. Priority: Gmail ya Firebase ki stored image
  const photo = userData?.photoURL || userData?.profilePic || user?.photoURL;
  if (photo) return photo;
  
  // 2. Secondary: Gender based (Agar data ho)
  const gender = userData?.gender?.toLowerCase();
  if (gender === 'male') return `https://api.dicebear.com/7.x/avataaars/svg?seed=Felix`;
  if (gender === 'female') return `https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka`;
  
  // 3. Fallback: Unique avatar based on UID
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid || 'guest'}`;
};

  const finalName = userData?.username || user?.displayName || user?.email?.split('@')[0] || "Guest";

  return (
    <nav className={`fixed top-0 z-[4000] py-5 px-6 md:px-12 flex justify-between items-center transition-all duration-500 ease-in-out
        ${isExpanded ? 'md:left-64 md:w-[calc(100%-256px)]' : 'md:left-20 md:w-[calc(100%-80px)]'} 
        left-0 w-full bg-black border-b border-white/5`}>
      
      {/* 1. LOGO */}
      <div className={`transition-all duration-500 ${isExpanded ? 'opacity-0 -translate-x-5 pointer-events-none' : 'opacity-100 translate-x-0'}`}>
        <Logo />
      </div>

      {/* 2. PROFILE SECTION (Always Visible) */}
      <div className="flex items-center gap-6">
        <div 
          onClick={() => user ? router.push('/profile') : router.push('/profile')}
          className="group relative flex items-center gap-4 cursor-pointer"
        >
          {/* User Info */}
          <div className="hidden md:flex flex-col items-end leading-none">
            <span className="text-[14px] font-[1000] italic uppercase tracking-tighter" style={{ color: themeColor }}>
              {finalName}
            </span>
            <span className="text-[7px] text-zinc-600 font-black uppercase tracking-[0.4em] mt-1">
              {user ? (
                <>Status: <span className="text-green-500">Connected</span></>
              ) : (
                <>Link: <span className="text-zinc-500">Offline</span></>
              )}
            </span>
          </div>
          
          {/* Avatar Section */}
          <div className="relative">
            <div 
              className="absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-40 transition-all duration-500"
              style={{ backgroundColor: themeColor }}
            ></div>
            
            <div className="w-11 h-11 relative z-10 border-2 border-white/10 group-hover:border-theme transition-all rounded-full overflow-hidden">
              <img 
                src={getAvatar()} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                alt="profile" 
              />
              {user && (
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-black bg-green-500"></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;