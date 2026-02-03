'use client';

import React from 'react';
// Next.js mein Link use hota hai, aur active page ke liye usePathname
import Link from 'next/link'; 
import { usePathname } from 'next/navigation'; 
import { Home as HomeIcon, TrendingUp, Bookmark, Settings, LogOut, Zap, Search, Gamepad, Gamepad2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext'; 
import Logo from './Logo';

const Sidebar = ({ isExpanded, setIsExpanded }) => {
  // location ki jagah pathname use hota hai Next.js mein
  const pathname = usePathname(); 
  const { themeColor } = useTheme(); 
  
  const navItems = [
    { icon: <HomeIcon size={22}/>, label: "Home", to: "/" },
    { icon: <TrendingUp size={22}/>, label: "Trending", to: "/trending" },
    { icon: <Search size={22}/>, label: "Search", to: "/search" },
    { icon: <Gamepad2 size={22}/>, label: "Game", to: "/game" },
    { icon: <Settings size={22}/>, label: "Settings", to: "/settings" },
  ];

  return (
    <>
      {/* --- DESKTOP SIDEBAR (Visible on md+ screens) --- */}
      <aside 
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className={`hidden md:flex fixed left-0 top-0 h-screen bg-[#050505] border-r border-white/5 z-[6000] flex-col transition-all duration-500 overflow-hidden ${isExpanded ? 'w-64' : 'w-20'}`}
      >
        <div className="p-5.5 mb-6 flex items-center gap-1 shrink-0">
          <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="50" fill={themeColor} />
            <path 
              d="M25 35 L50 65 L75 35" 
              stroke="black" 
              strokeWidth="12" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
            <circle cx="50" cy="50" r="10" fill="white" />
          </svg>
          <span className={`font-black text-3xl tracking-tighter italic text-white transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
            Mera<span style={{ color: themeColor }}>Anime</span>
          </span>
        </div>

        <div className="flex-1 px-4 space-y-2 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => (
            <NavItem 
              key={item.to}
              icon={item.icon} 
              label={item.label} 
              to={item.to} 
              // location.pathname ki jagah ab pathname use ho raha hai
              active={pathname === item.to} 
              themeColor={themeColor} 
              isExpanded={isExpanded} 
            />
          ))}
        </div>

        <div className="p-4 mt-auto border-t border-white/5 shrink-0">
          {/* to="/logout" ki jagah href="/logout" */}
          <Link href="/logout" className="flex items-center gap-6 w-full p-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all">
            <div className="min-w-[24px]"><LogOut size={20} /></div>
            {isExpanded && <span className="font-black text-[10px] tracking-[0.2em] uppercase">Disconnect</span>}
          </Link>
        </div>
      </aside>

      {/* --- MOBILE NAVIGATION DOCK --- */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-[9999] px-4 pb-6 pt-2 bg-gradient-to-t from-black via-black/90 to-transparent">
        <div className="flex items-center justify-around bg-zinc-900/80 backdrop-blur-2xl border border-white/10 h-16 rounded-2xl px-2 shadow-2xl relative">
          {navItems.map((item) => {
            const isActive = pathname === item.to;
            return (
              <Link 
                key={item.to} 
                href={item.to} 
                className="relative flex flex-col items-center justify-center w-full h-full transition-all duration-300"
                style={{ color: isActive ? themeColor : '#71717a' }}
              >
                {isActive && (
                  <div 
                    className="absolute inset-0 blur-xl opacity-20 rounded-full scale-50" 
                    style={{ backgroundColor: themeColor }}
                  />
                )}
                
                <div className={`relative z-10 transition-transform duration-300 ${isActive ? '-translate-y-1 scale-110' : ''}`}>
                  {item.icon}
                </div>
                
                {isActive && (
                  <div 
                    className="absolute bottom-2 w-1 h-1 rounded-full animate-pulse"
                    style={{ backgroundColor: themeColor, boxShadow: `0 0 10px ${themeColor}` }}
                  />
                )}
              </Link>
            );
          })}

          <Link href="/logout" className="flex items-center justify-center w-full h-full text-red-500 opacity-60">
            <LogOut size={20} />
          </Link>
        </div>
      </nav>
    </>
  );
};

const NavItem = ({ icon, label, to, active, themeColor, isExpanded }) => (
  <Link 
    href={to} 
    style={active ? { backgroundColor: themeColor, boxShadow: `0 0 20px ${themeColor}44` } : {}}
    className={`flex items-center gap-6 w-full p-3 rounded-xl transition-all ${active ? 'text-black' : 'text-zinc-500 hover:text-white'}`}
  >
    <div className={`min-w-[24px] flex justify-center ${active ? 'scale-110' : ''}`}>{icon}</div>
    <span className={`font-black text-[10px] tracking-[0.2em] uppercase transition-all ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
      {label}
    </span>
  </Link>
);

export default Sidebar;