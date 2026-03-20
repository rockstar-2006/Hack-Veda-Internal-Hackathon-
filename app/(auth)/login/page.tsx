"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { loginWithGoogle } from "@/lib/auth";
import { Trophy, ArrowRight, ShieldCheck, Mail, Sparkles, Zap, Rocket, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user && !loading && !isAdminMode) {
      router.push("/profile");
    }
  }, [user, loading, router, isAdminMode]);

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      router.push("/profile");
    } catch (error: any) {
      console.error(error.message);
      setError(error.message || "Failed to login. Please ensure you use @sode-edu.in email.");
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("adminSession", "active");
        localStorage.setItem("adminEmail", email);
        router.push("/admin/dashboard");
      } else {
        setError(data.message || "Invalid Admin Protocol. Access Denied.");
      }
    } catch (err) {
      setError("Connection failure. Admin vault unreachable.");
    } finally {
      setAdminLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-16 h-16 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin mb-6" />
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] animate-pulse italic">Authenticated Access...</p>
    </div>
  );

  return (
    <div className="min-h-screen relative bg-yellow-400 selection:bg-black selection:text-white overflow-hidden flex items-center justify-center p-4 sm:p-6 md:p-8 font-sans">
      
      {/* Halftone / Line Pattern Background (Simulated via CSS) */}
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', 
          backgroundSize: '24px 24px' 
        }} 
      />
      
      {/* Floating Animated Comic Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 hidden lg:block">
          {[
            { icon: Zap, top: '15%', right: '10%', delay: 0, color: 'bg-cyan-400', rotate: 12 },
            { icon: Rocket, bottom: '20%', left: '8%', delay: 1.5, color: 'bg-pink-400', rotate: -15 },
            { icon: Trophy, top: '25%', left: '12%', delay: 3, color: 'bg-white', rotate: 20 },
            { icon: Sparkles, bottom: '15%', right: '15%', delay: 0.8, color: 'bg-purple-400', rotate: -10 },
          ].map((item, i) => (
             <motion.div
               key={i}
               animate={{ 
                 y: [0, -30, 0],
                 rotate: [item.rotate, item.rotate + 10, item.rotate],
               }}
               transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: item.delay }}
               className={`absolute ${item.color} p-4 rounded-full border-4 border-black shadow-[6px_6px_0px_#000]`}
               style={{ top: item.top, bottom: item.bottom, left: item.left, right: item.right }}
             >
                <item.icon className="w-8 h-8 md:w-10 md:h-10 text-black stroke-[2.5]" />
             </motion.div>
          ))}
      </div>

      <motion.div 
        initial={{ scale: 0.8, y: 50, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
        className="w-full max-w-4xl grid lg:grid-cols-2 bg-white rounded-3xl border-4 border-black shadow-[12px_12px_0px_rgba(0,0,0,1)] relative z-10 overflow-hidden"
      >
        {/* Visual Brand Section */}
        <div className="hidden lg:flex relative p-8 md:p-10 bg-cyan-400 border-r-4 border-black overflow-hidden flex-col justify-between group">
            {/* Action Lines Background */}
            <div className="absolute inset-0 opacity-20 [background:repeating-linear-gradient(45deg,#000,#000_2px,transparent_2px,transparent_20px)] pointer-events-none" />

            <div className="relative z-10">
               <motion.div 
                 whileHover={{ scale: 1.05, rotate: -2 }}
                 className="inline-flex items-center gap-2 bg-yellow-300 px-4 py-2 border-2 border-black rounded-lg shadow-[4px_4px_0px_#000] mb-8 w-fit"
               >
                   <Zap className="w-5 h-5 text-black fill-black" />
                   <span className="font-comic text-xl text-black tracking-wider w-fit">HACKVEDA 2026</span>
               </motion.div>
               
               <h1 className="font-comic text-6xl md:text-7xl text-black leading-none mb-4 uppercase drop-shadow-[3px_3px_0_#fff]">
                 BEYOND<br />LIMITS!
               </h1>
               
               <p className="text-sm md:text-base text-black font-bold bg-white/80 p-4 border-2 border-black rounded-xl shadow-[4px_4px_0px_#000]">
                 Shri Madhwa Vadiraja Institute’s flagship innovation terminal. 
                 Deploy your ideas on the official portal.
               </p>
            </div>

            <div className="relative z-10 grid grid-cols-2 gap-4 mt-8">
                <motion.div whileHover={{ y: -5 }} className="bg-pink-400 p-4 rounded-xl border-4 border-black shadow-[6px_6px_0px_#000]">
                    <p className="font-comic text-4xl text-black drop-shadow-[2px_2px_0_#fff]">150+</p>
                    <p className="font-bold text-black uppercase tracking-widest text-xs mt-1">Students</p>
                </motion.div>
                <motion.div whileHover={{ y: -5 }} className="bg-yellow-300 p-4 rounded-xl border-4 border-black shadow-[6px_6px_0px_#000]">
                    <p className="font-comic text-4xl text-black drop-shadow-[2px_2px_0_#fff]">₹80K</p>
                    <p className="font-bold text-black uppercase tracking-widest text-xs mt-1">Prize Pool</p>
                </motion.div>
            </div>
        </div>

        {/* Authentication Section */}
        <div className="p-6 sm:p-8 md:p-12 flex flex-col justify-center bg-white relative">
            <div className="max-w-xs md:max-w-sm mx-auto w-full relative z-10">
                
                {/* Mobile Branding (Visible only on small screens) */}
                <div className="lg:hidden flex justify-center mb-8">
                    <motion.div 
                        whileTap={{ scale: 0.9 }}
                        className="inline-flex items-center gap-2 bg-cyan-400 px-4 py-2 border-4 border-black rounded-xl shadow-[4px_4px_0px_#000]"
                    >
                        <Zap className="w-6 h-6 text-black fill-black" />
                        <span className="font-comic text-2xl text-black tracking-wider">HACKVEDA!</span>
                    </motion.div>
                </div>

                <div className="mb-8 text-center lg:text-left">
                    <h2 className="font-comic text-4xl md:text-5xl text-black uppercase tracking-wider mb-2 drop-shadow-[2px_2px_0_#ff007f]">
                        {isAdminMode ? "ADMIN VAULT" : "WELCOME!"}
                    </h2>
                    <p className="text-sm md:text-base font-bold text-gray-700 bg-gray-100 p-3 border-2 border-black rounded-lg shadow-[3px_3px_0_#000]">
                        {isAdminMode ? "Enter your secret credentials to continue!" : "Sign in using your SODE college email!"}
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {!isAdminMode ? (
                        <motion.div 
                            key="student"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4 md:space-y-6"
                        >
                            <motion.button
                                whileHover={{ scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.95, y: 2, boxShadow: "0px 0px 0px #000" }}
                                onClick={handleGoogleLogin}
                                className="w-full h-14 bg-white border-4 border-black text-black flex items-center justify-center gap-3 rounded-2xl font-bold text-sm md:text-base shadow-[6px_6px_0px_#000] transition-all"
                            >
                                <div className="bg-gray-100 p-1.5 rounded-lg border-2 border-black">
                                    <img src="https://www.google.com/favicon.ico" className="w-4 h-4 md:w-5 md:h-5" alt="Google" />
                                </div>
                                SIGN IN WITH GOOGLE
                            </motion.button>
                            
                            <div className="relative py-4 flex items-center justify-center">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t-4 border-black border-dashed"></div>
                                </div>
                                <div className="relative bg-white px-4">
                                    <span className="font-comic text-lg bg-pink-400 px-3 py-1 border-2 border-black rounded-full shadow-[2px_2px_0_#000] text-black uppercase">OR</span>
                                </div>
                            </div>

                            <motion.button 
                                whileHover={{ scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.95, y: 2, boxShadow: "0px 0px 0px #000" }}
                                onClick={() => setIsAdminMode(true)}
                                className="w-full h-14 bg-gray-900 border-4 border-black text-white flex items-center justify-center gap-2 rounded-2xl font-bold text-sm md:text-base shadow-[6px_6px_0px_#000] transition-all"
                            >
                                <ShieldCheck className="w-5 h-5 text-yellow-400" />
                                LOGIN AS ADMIN
                            </motion.button>
                        </motion.div>
                    ) : (
                        <motion.form 
                            key="admin"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            onSubmit={handleAdminLogin}
                            className="space-y-4 md:space-y-6"
                        >
                             <div className="space-y-4">
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black group-focus-within:text-pink-600 transition-colors z-10" />
                                    <input 
                                        type="email" 
                                        placeholder="Admin Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full h-14 pl-12 pr-4 rounded-xl bg-white border-4 border-black text-black font-bold text-sm md:text-base shadow-[4px_4px_0px_#000] focus:shadow-[6px_6px_0px_#ff007f] outline-none transition-all placeholder:text-gray-400 focus:-translate-y-1"
                                        required
                                    />
                                </div>
                                <div className="relative group">
                                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black group-focus-within:text-pink-600 transition-colors z-10" />
                                    <input 
                                        type="password" 
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full h-14 pl-12 pr-4 rounded-xl bg-white border-4 border-black text-black font-bold text-sm md:text-base shadow-[4px_4px_0px_#000] focus:shadow-[6px_6px_0px_#ff007f] outline-none transition-all placeholder:text-gray-400 focus:-translate-y-1"
                                        required
                                    />
                                </div>
                             </div>

                             <motion.button
                                whileHover={{ scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.95, y: 2, boxShadow: "0px 0px 0px #000" }}
                                type="submit"
                                disabled={adminLoading}
                                className="w-full h-14 bg-pink-500 border-4 border-black text-white flex items-center justify-center gap-2 rounded-xl font-black text-base md:text-lg shadow-[6px_6px_0px_#000] transition-all disabled:opacity-70"
                            >
                                {adminLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <span className="font-comic tracking-widest">ACCESS CONSOLE</span>}
                                {!adminLoading && <ArrowRight className="w-5 h-5" />}
                            </motion.button>

                            <button 
                                type="button"
                                onClick={() => setIsAdminMode(false)}
                                className="w-full py-2 text-center text-sm font-bold text-gray-500 hover:text-black transition-colors flex items-center justify-center underline decoration-2 underline-offset-4"
                            >
                                Wait, take me back!
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20, rotate: -5 }}
                        animate={{ opacity: 1, y: 0, rotate: 0 }}
                        className="mt-6 p-4 bg-red-500 border-4 border-black rounded-xl shadow-[4px_4px_0px_#000] flex items-start gap-3 text-white"
                    >
                        <AlertCircle className="w-6 h-6 shrink-0 text-white" />
                        <p className="font-bold text-sm md:text-base">{error}</p>
                    </motion.div>
                )}
            </div>
        </div>
      </motion.div>

      {/* Footer Decoration */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center pointer-events-none z-10">
          <p className="font-comic text-lg text-black bg-white px-4 py-1 border-2 border-black rounded-full shadow-[2px_2px_0_#000]">© 2026 HACKVEDA</p>
      </div>
    </div>
  );
}
