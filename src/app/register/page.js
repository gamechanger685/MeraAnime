'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { auth, db } from '@/firebase'; 
import { 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  updateProfile 
} from "firebase/auth"; 
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from 'next/navigation'; 
import Link from 'next/link'; 
import { Eye, EyeOff, ChevronDown, Loader2 } from 'lucide-react'; 
import { useTheme } from '@/context/ThemeContext'; 
import { motion } from 'framer-motion';

const RegisterFormParticles = ({ color }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    const resizeCanvas = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    const particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * (canvas.width || 400),
      y: Math.random() * (canvas.height || 500),
      vx: (Math.random() - 0.5) * 2.5,
      vy: (Math.random() - 0.5) * 2.5,
      size: Math.random() * 2 + 2,
    }));
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.3;
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [color]);
  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none rounded-[2rem] md:rounded-[3rem]" />;
};

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [gender, setGender] = useState('male');
  
  const router = useRouter();
  const { themeColor } = useTheme();

  const AVATARS = {
    male: ["https://api.dicebear.com/7.x/avataaars/svg?seed=Felix", "https://api.dicebear.com/7.x/avataaars/svg?seed=Zoro", "https://api.dicebear.com/7.x/avataaars/svg?seed=Luffy", "https://api.dicebear.com/7.x/avataaars/svg?seed=Goku", "https://api.dicebear.com/7.x/avataaars/svg?seed=Naruto"],
    female: ["https://api.dicebear.com/7.x/avataaars/svg?seed=Lilly", "https://api.dicebear.com/7.x/avataaars/svg?seed=Nami", "https://api.dicebear.com/7.x/avataaars/svg?seed=Hinata", "https://api.dicebear.com/7.x/avataaars/svg?seed=Sakura", "https://api.dicebear.com/7.x/avataaars/svg?seed=Mikasa"]
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === "username") {
      const isValid = /^[a-zA-Z0-9_]*$/.test(value);
      setFieldErrors(prev => ({ ...prev, username: !isValid ? "ALPHANUMERIC ONLY" : "" }));
    }
    
    // Immediate check for password mismatch
    if (name === "confirmPassword") {
      setFieldErrors(prev => ({ ...prev, confirm: value !== formData.password ? "MISMATCH" : "" }));
    }
  }, [formData.password]);

  const handleRegister = async (e) => {
    e.preventDefault();
    // Security: Stop if passwords don't match or username is invalid
    if (formData.password !== formData.confirmPassword) {
      setServerError("PASSWORDS DO NOT MATCH");
      return;
    }
    if (fieldErrors.username) return;

    setFormLoading(true);
    setServerError('');
    
    try {
      await setPersistence(auth, browserLocalPersistence);
      const res = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      
      const avatarPool = AVATARS[gender];
      const finalAvatar = avatarPool[Math.floor(Math.random() * avatarPool.length)];
      
      await updateProfile(res.user, { displayName: formData.username, photoURL: finalAvatar });
      
      await setDoc(doc(db, "users", res.user.uid), {
        username: formData.username,
        email: formData.email,
        uid: res.user.uid,
        gender,
        photoURL: finalAvatar,
        createdAt: serverTimestamp(),
        downloads: 0 
      });
      router.push('/');
    } catch (err) {
      setServerError(err.code?.split('/')[1]?.toUpperCase() || "ACCESS DENIED");
    } finally { setFormLoading(false); }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await setPersistence(auth, browserLocalPersistence);
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      const userDoc = await getDoc(doc(db, "users", res.user.uid));
      await setDoc(doc(db, "users", res.user.uid), {
        username: res.user.displayName,
        email: res.user.email,
        uid: res.user.uid,
        photoURL: res.user.photoURL,
        createdAt: userDoc.exists() ? userDoc.data().createdAt : serverTimestamp(),
        downloads: userDoc.exists() ? userDoc.data().downloads : 0
      }, { merge: true });
      router.push('/');
    } catch { setServerError("GOOGLE SYNC FAILED"); }
    finally { setGoogleLoading(false); }
  };

  return (
    <div className="min-h-screen w-full bg-[#030303] flex flex-col relative overflow-x-hidden selection:bg-white/20">
      
      <nav className="fixed top-0 left-0 w-full z-[5000] px-6 py-4 md:px-12 bg-black/60 backdrop-blur-xl border-b border-white/5 flex justify-between items-center">
        <h1 className="text-white text-xl md:text-2xl font-black italic tracking-tighter">
          Mera<span style={{ color: themeColor }}>Anime</span>
        </h1>
        <button onClick={() => router.push('/login')} className="px-6 py-2 text-[11px] font-black rounded-full transition-all active:scale-95 shadow-lg border border-white/5" style={{ backgroundColor: themeColor, color: '#000' }}>LOGIN</button>
      </nav>

      <div className="flex-1 flex items-center justify-center pt-24 pb-12 px-4 md:px-10">
        <div className="w-full max-w-[1600px] flex items-center justify-center gap-4 lg:gap-16 xl:gap-24">
          
          {/* Left Character */}
          <div className="hidden xl:flex flex-1 justify-end items-center transition-all">
            <motion.img 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              src="/images/demon.webp" 
              className="max-h-[85vh] 2xl:max-h-[85vh] w-auto object-contain drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]"
              alt="Character Left"
            />
          </div>

          {/* Form Container - Improved for Large Screens */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-[480px] 2xl:max-w-[550px] bg-zinc-950/40 backdrop-blur-3xl border border-white/10 p-8 md:p-14 rounded-[2.5rem] md:rounded-[3.5rem] relative z-10 shadow-2xl overflow-hidden flex-shrink-0"
          >
            <RegisterFormParticles color={themeColor} />
            <div className="relative z-10 text-center">
              <h2 className="text-4xl 2xl:text-5xl font-[1000] italic tracking-tighter uppercase mb-8" style={{ color: themeColor }}>Register</h2>
              
              {serverError && (
                <div className="bg-red-500/10 border-l-4 border-red-500 text-red-500 py-3 px-4 rounded-md text-[10px] font-black mb-6 uppercase text-left">{serverError}</div>
              )}

              <form onSubmit={handleRegister} className="space-y-4 md:space-y-5">
                <input name="username" type="text" placeholder="USERNAME" required className="w-full bg-black/60 border border-white/5 p-4 md:p-5 rounded-2xl text-white font-bold outline-none text-xs md:text-sm transition-all focus:border-white/20" onChange={handleChange} />
                
                <input name="email" type="email" placeholder="EMAIL" required className="w-full bg-black/60 border border-white/5 p-4 md:p-5 rounded-2xl text-white font-bold outline-none text-xs md:text-sm transition-all focus:border-white/20" onChange={handleChange} />
                
                <div className="relative">
                  <input name="password" type={showPassword ? "text" : "password"} placeholder="PASSWORD" required className="w-full bg-black/60 border border-white/5 p-4 md:p-5 rounded-2xl text-white font-bold outline-none text-xs md:text-sm transition-all focus:border-white/20" onChange={handleChange} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-600">
                    {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                  </button>
                </div>

                <div className="relative">
                  <input name="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="CONFIRM PASSWORD" required className={`w-full bg-black/60 border ${fieldErrors.confirm ? 'border-red-500' : 'border-white/5'} p-4 md:p-5 rounded-2xl text-white font-bold outline-none text-xs md:text-sm transition-all focus:border-white/20`} onChange={handleChange} />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-600">
                    {showConfirmPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                  </button>
                </div>

                <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full bg-black/60 border-2 border-white/5 p-4 md:p-5 rounded-2xl text-white font-bold outline-none appearance-none text-[10px] md:text-xs tracking-widest" style={{ borderLeft: `4px solid ${themeColor}` }}>
                  <option value="male">MALE</option>
                  <option value="female">FEMALE</option>
                </select>

                <button disabled={formLoading || googleLoading} style={{ backgroundColor: themeColor }} className="w-full text-black py-5 md:py-6 rounded-2xl font-[1000] uppercase text-[11px] md:text-xs shadow-xl active:scale-95 transition-all hover:brightness-110">
                  {formLoading ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'CREATE IDENTITY'}
                </button>

                <div className="relative flex items-center my-6">
                  <div className="flex-grow border-t border-white/5"></div>
                  <span className="mx-4 text-zinc-800 text-[8px] font-black uppercase tracking-[0.2em]">OR</span>
                  <div className="flex-grow border-t border-white/5"></div>
                </div>

                <button type="button" onClick={handleGoogle} disabled={formLoading || googleLoading} className="w-full bg-white text-black py-4 md:py-5 rounded-2xl font-black text-[10px] md:text-xs uppercase flex items-center justify-center gap-3 active:scale-95 transition-all hover:bg-zinc-200">
                   <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-4 h-4" /> Register with Google
                </button>
              </form>
              <p className="text-[10px] text-zinc-600 mt-8 font-bold uppercase tracking-wider">
                Existing Entity? <Link href="/login" style={{ color: themeColor }} className="hover:underline">Login Here</Link>
              </p>
            </div>
          </motion.div>

          {/* Right Character */}
          <div className="hidden xl:flex flex-1 justify-start items-center transition-all">
            <motion.img 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              src="/images/knight.webp" 
              className="max-h-[90vh] 2xl:max-h-[95vh] w-auto object-contain drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]"
              alt="Character Right"
            />
          </div>

        </div>
      </div>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: ${themeColor}; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Register;