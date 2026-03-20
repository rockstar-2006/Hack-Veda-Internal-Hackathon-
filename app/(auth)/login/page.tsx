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
    <div className="min-h-screen relative bg-[#fafafa] selection:bg-indigo-100 overflow-hidden flex items-center justify-center p-6 sm:p-10">
      
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-indigo-50/50 rounded-full blur-[180px] -z-0 translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-blue-50/40 rounded-full blur-[160px] -z-0 -translate-x-1/2 translate-y-1/2 pointer-events-none opacity-60" />
      
      {/* Floating Icons Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[
            { icon: Zap, top: '15%', right: '10%', delay: 0, color: 'text-indigo-400' },
            { icon: Rocket, bottom: '20%', left: '8%', delay: 2, color: 'text-blue-400' },
            { icon: Trophy, top: '25%', left: '12%', delay: 4, color: 'text-amber-400' },
            { icon: Sparkles, bottom: '15%', right: '15%', delay: 1, color: 'text-indigo-300' },
            { icon: ShieldCheck, top: '45%', right: '5%', delay: 3, color: 'text-indigo-200' },
          ].map((item, i) => (
             <motion.div
               key={i}
               animate={{ 
                 y: [0, -40, 0],
                 rotate: [0, 10, -10, 0],
                 opacity: [0.1, 0.2, 0.1]
               }}
               transition={{ duration: 10 + i * 2, repeat: Infinity, delay: item.delay }}
               className={`absolute ${item.color} hidden sm:block`}
               style={{ top: item.top, bottom: item.bottom, left: item.left, right: item.right }}
             >
                <item.icon className="w-24 h-24 stroke-[0.5]" />
             </motion.div>
          ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className="w-full max-w-7xl grid lg:grid-cols-2 bg-white/40 backdrop-blur-2xl rounded-[4rem] border-8 border-white border-opacity-60 shadow-2xl relative z-10 overflow-hidden"
      >
        {/* Visual Brand Section */}
        <div className="hidden lg:block relative p-20 bg-indigo-950 overflow-hidden group">
            <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                   <div className="inline-flex items-center gap-4 bg-white/10 px-6 py-2.5 rounded-2xl backdrop-blur-xl border border-white/10 mb-20 italic">
                       <Zap className="w-5 h-5 text-indigo-400 fill-indigo-400" />
                       <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Hackveda 2026</span>
                   </div>
                   
                   <h1 className="text-8xl font-black text-white leading-[0.85] tracking-tighter italic uppercase mb-12">
                     Beyond <br />
                     <span className="text-indigo-400">Limits.</span>
                   </h1>
                   
                   <p className="text-xl text-indigo-200/60 font-medium italic max-w-sm leading-relaxed">
                     Shri Madhwa Vadiraja Institute’s flagship innovation terminal. 
                     Deploy your ideas on the official portal.
                   </p>
                </div>

                <div className="grid grid-cols-2 gap-10">
                    <div className="group/stat">
                        <p className="text-5xl font-black text-white italic group-hover/stat:text-indigo-400 transition-colors">150+</p>
                        <p className="text-[10px] font-black text-indigo-400/50 uppercase tracking-widest mt-2 italic">Student Leads</p>
                    </div>
                    <div className="group/stat">
                        <p className="text-5xl font-black text-white italic group-hover/stat:text-indigo-400 transition-colors">₹80K</p>
                        <p className="text-[10px] font-black text-indigo-400/50 uppercase tracking-widest mt-2 italic">Grand Reserve</p>
                    </div>
                </div>
            </div>

            {/* Background Graphic Decor */}
            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-1000 rotate-12">
                <Trophy className="w-96 h-96" />
            </div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-[100px]" />
        </div>

        {/* Authentication Section */}
        <div className="p-10 sm:p-20 flex flex-col justify-center bg-white/30 backdrop-blur-md">
            <div className="max-w-md mx-auto w-full">
                <div className="mb-16">
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em] mb-4 italic">Authorize Protocol</p>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-950 tracking-tighter italic leading-none mb-4">
                        Secure <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-950">
                            Login.
                        </span>
                    </h2>
                </div>

                <AnimatePresence mode="wait">
                    {!isAdminMode ? (
                        <motion.div 
                            key="student"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <button
                                onClick={handleGoogleLogin}
                                className="w-full h-24 bg-gray-950 text-white flex items-center justify-center gap-6 rounded-[3rem] hover:bg-black transition-all font-black text-xl group active:scale-[0.98] shadow-3xl shadow-gray-200"
                            >
                                <div className="bg-white p-2.5 rounded-2xl">
                                    <img src="https://www.google.com/favicon.ico" className="w-6 h-6" alt="Google" />
                                </div>
                                <span className="italic uppercase tracking-tighter">Sign in with ID</span>
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-3 transition-transform" />
                            </button>
                            
                            <div className="flex items-center gap-4 py-4 opacity-30">
                                <div className="h-[1px] bg-gray-900 flex-1" />
                                <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest italic">Vault Guard</span>
                                <div className="h-[1px] bg-gray-900 flex-1" />
                            </div>

                            <button 
                                onClick={() => setIsAdminMode(true)}
                                className="w-full py-4 text-center text-xs font-black text-gray-400 uppercase tracking-widest hover:text-indigo-600 transition-colors italic group flex items-center justify-center gap-3"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-100 group-hover:bg-indigo-600 transition-colors" />
                                Access Administrator Vault
                            </button>
                        </motion.div>
                    ) : (
                        <motion.form 
                            key="admin"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            onSubmit={handleAdminLogin}
                            className="space-y-6"
                        >
                             <div className="space-y-5">
                                <div className="relative group">
                                    <Mail className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                    <input 
                                        type="email" 
                                        placeholder="Vault Identifier"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full h-20 pl-20 pr-8 rounded-[2rem] bg-gray-50/50 border-4 border-transparent focus:border-indigo-600 focus:bg-white outline-none font-black text-lg italic tracking-tighter uppercase transition-all shadow-sm"
                                        required
                                    />
                                </div>
                                <div className="relative group">
                                    <ShieldCheck className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                    <input 
                                        type="password" 
                                        placeholder="Access Key"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full h-20 pl-20 pr-8 rounded-[2rem] bg-gray-50/50 border-4 border-transparent focus:border-indigo-600 focus:bg-white outline-none font-black text-lg italic tracking-tighter uppercase transition-all shadow-sm"
                                        required
                                    />
                                </div>
                             </div>

                             <button
                                type="submit"
                                disabled={adminLoading}
                                className="w-full h-24 bg-indigo-600 text-white flex items-center justify-center gap-6 rounded-[3rem] hover:bg-indigo-700 transition-all font-black text-xl group active:scale-[0.98] shadow-3xl shadow-indigo-600/30"
                            >
                                {adminLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : <span className="italic uppercase tracking-tighter">Enter Vault Control</span>}
                                {!adminLoading && <ArrowRight className="w-6 h-6 group-hover:translate-x-3 transition-transform" />}
                            </button>

                            <button 
                                type="button"
                                onClick={() => setIsAdminMode(false)}
                                className="w-full py-4 text-center text-xs font-black text-gray-400 uppercase tracking-widest hover:text-indigo-600 transition-colors italic group flex items-center justify-center gap-3"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-100 group-hover:bg-indigo-600 transition-colors" />
                                Revert to Student Portal
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-12 p-8 bg-red-50 border-4 border-red-100 rounded-[3rem] flex items-center gap-6 text-red-700 shadow-xl shadow-red-600/5"
                    >
                        <AlertCircle className="w-8 h-8 shrink-0" />
                        <p className="text-xs font-black uppercase tracking-tight italic leading-relaxed">{error}</p>
                    </motion.div>
                )}
            </div>
        </div>
      </motion.div>

      {/* Footer Decoration */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center opacity-30 select-none pointer-events-none">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] italic">Shri Madhwa Vadiraja Institute of Technology & Management</p>
      </div>

    </div>
  );
}
