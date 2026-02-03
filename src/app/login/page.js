'use client';

import React, { useState, useEffect, useRef } from 'react';
import { auth } from '@/firebase'; // Path fix
import { 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth";
import { useRouter } from 'next/navigation'; // Next.js navigation
import Link from 'next/link'; // Next.js Link
import { Eye, EyeOff, Loader2 } from 'lucide-react'; 
import { useTheme } from '@/context/ThemeContext'; 

// Particles Component (Logic bilkul same hai)
const LoginFormParticles = ({ color }) => {
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

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false); 
  const router = useRouter(); // router handle kiya
  const { themeColor } = useTheme();

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleSocialLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithPopup(auth, provider);
      router.push('/'); 
    } catch (err) {
      setServerError("Sync Failed. Protocol Breach.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setServerError('');
    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      router.push('/'); 
    } catch (err) {
      const msg = err.code?.split('/')[1]?.replace(/-/g, ' ') || "Error";
      setServerError(`Access Denied: ${msg.toUpperCase()}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] flex flex-col relative selection:bg-white/20 overflow-x-hidden custom-scrollbar">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-[5000] px-6 py-4 md:px-12 md:py-5 flex justify-between items-center bg-black/60 backdrop-blur-xl border-b border-white/5">
        <h1 className="text-white text-xl md:text-2xl font-black italic tracking-tighter cursor-pointer">
          Mera<span style={{ color: themeColor }}>Anime</span>
        </h1>
        <button 
          onClick={() => router.push('/register')}
          className="px-5 py-2 md:px-8 md:py-2.5 text-[9px] md:text-[11px] font-black rounded-full transition-all active:scale-95 shadow-lg border border-white/5" 
          style={{ backgroundColor: themeColor, color: '#000' }}
        >
          REGISTER
        </button>
      </nav>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 pt-24 flex flex-col relative z-10 ">
        <div className="flex-grow flex items-center justify-center px-4 py-10 relative">
          
          {/* Note: In images ko 'public' folder mein rakhna behtar hai */}
          <img src="/images/girl.webp" className="hidden xl:block absolute left-[19.4%] h-[520px] pointer-events-none" alt="Anime Girl" />
          <img src="/images/boy.png" className="hidden xl:block absolute right-[24.1%] h-[550px] pointer-events-none" alt="Anime Boy" />

          {/* FORM */}
          <div className="w-full max-w-[420px] bg-zinc-950/40 backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3rem] z-10 shadow-2xl relative overflow-hidden">
            <LoginFormParticles color={themeColor} />

            <div className="relative z-10">
              <div className="flex flex-col items-center mb-6">
                <h2 className="text-3xl md:text-4xl font-[1000] italic tracking-tighter uppercase" style={{ color: themeColor }}>LOG IN</h2>
              </div>
              
              {serverError && (
                <div className="bg-red-500/10 border-l-4 border-red-500 text-red-500 py-2 px-3 rounded-md text-[9px] font-bold mb-4 uppercase tracking-widest">
                  {serverError}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <input 
                  name="email" type="email" placeholder="EMAIL" required 
                  className="w-full bg-black/60 border border-white/5 p-4 rounded-2xl text-white font-bold outline-none focus:border-white/20 transition-all text-xs"
                  value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} 
                />

                <div className="relative">
                  <input 
                    name="password" type={showPassword ? "text" : "password"} placeholder="PASSWORD" required 
                    className="w-full bg-black/60 border border-white/5 p-4 rounded-2xl text-white font-bold outline-none focus:border-white/20 transition-all text-xs"
                    value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} 
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-4 text-zinc-600">
                    {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>

                <div className="flex items-center gap-2 px-2">
                  <input 
                    type="checkbox" id="remember" className="w-4 h-4 rounded cursor-pointer accent-zinc-100" 
                    checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember" className="text-[9px] text-zinc-500 font-black uppercase cursor-pointer">Remember Me</label>
                </div>
                
                <button 
                  disabled={loading}
                  style={{ backgroundColor: themeColor }} 
                  className="w-full text-black py-4 md:py-5 rounded-2xl font-[1000] uppercase text-[11px] shadow-xl hover:brightness-110 active:scale-[0.98] transition-all mt-4 flex justify-center items-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : 'Login'}
                </button>

                <p className="text-center text-[9px] text-zinc-600 mt-6 font-bold uppercase tracking-widest">
                  Unknown Entity? <Link href="/register" style={{ color: themeColor }} className="hover:underline">Register Me</Link>
                </p>

                <div className="relative flex items-center my-6">
                  <div className="flex-grow border-t border-white/5"></div>
                  <span className="mx-4 text-zinc-800 text-[8px] font-black">OR</span>
                  <div className="flex-grow border-t border-white/5"></div>
                </div>

                <button 
                  type="button" onClick={handleSocialLogin} disabled={loading}
                  className="w-full bg-white/95 hover:bg-white text-black py-4 rounded-2xl font-black text-[10px] uppercase flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                >
                  <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-4 h-4" alt="Google" />
                  Login with Google 
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        body { overflow-y: auto; overflow-x: hidden; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #050505; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: ${themeColor}; 
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default Login;