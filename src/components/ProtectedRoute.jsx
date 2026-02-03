'use client';

import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from "firebase/auth";
// Firebase path fix (Next.js short-cut use karein)
import { auth } from '@/lib/firebase'; 
// Next.js mein navigation ke liye useRouter zaroori hai
import { useRouter } from 'next/navigation';

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  // useRouter initialize kiya
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        // navigate('/login') ki jagah router.push use hoga
        router.push('/login');
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="h-screen bg-[#050505] flex items-center justify-center text-[#ff6b00] font-black italic tracking-widest uppercase">
        Verifying Identity...
      </div>
    );
  }

  return user ? children : null;
};

export default ProtectedRoute;