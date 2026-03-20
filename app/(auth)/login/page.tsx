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
    <div className="min-h-screen relative bg-[#fafafa] selection:bg-indigo-100 overflow-hidden flex items-center justify-center p-4 sm:p-8">
      
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-50/50 rounded-full blur-[120px] -z-0 translate-x-1/3 -translate-y-1/3 pointer-events-none opacity-60" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-50/40 rounded-full blur-[100px] -z-0 -translate-x-1/3 translate-y-1/3 pointer-events-none opacity-60" />
      
      {/* Floating Icons Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden hidden lg:block">
          {[
            { icon: Zap, top: '20%', right: '15%', delay: 0, color: 'text-indigo-400' },
            { icon: Rocket, bottom: '25%', left: '10%', delay: 2, color: 'text-blue-400' },
            { icon: Trophy, top: '30%', left: '15%', delay: 4, color: 'text-amber-400' },
            { icon: Sparkles, bottom: '20%', right: '20%', delay: 1, color: 'text-indigo-300' },
          ].map((item, i) => (
             <motion.div
               key={i}
               animate={{ 
                 y: [0, -20, 0],
                 rotate: [0, 5, -5, 0],
                 opacity: [0.3, 0.6, 0.3]
               }}
               transition={{ duration: 10 + i * 2, repeat: Infinity, delay: item.delay }}
               className={`absolute ${item.color}`}
               style={{ top: item.top, bottom: item.bottom, left: item.left, right: item.right }}
             >
                <item.icon className="w-12 h-12 stroke-[1]" />
             </motion.div>
          ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "circOut" }}
        className="w-full max-w-5xl grid lg:grid-cols-5 bg-white/70 backdrop-blur-xl rounded-3xl border border-gray-100 shadow-xl relative z-10 overflow-hidden"
      >
        {/* Visual Brand Section */}
        <div className="hidden lg:flex lg:col-span-2 relative p-12 bg-indigo-950 overflow-hidden flex-col justify-between group">
            <div className="relative z-10">
               <div className="inline-flex items-center gap-3 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 mb-12 italic">
                   <Zap className="w-4 h-4 text-indigo-400 fill-indigo-400" />
                   <span className="text-[10px] font-bold text-white uppercase tracking-widest">Hackveda 2026</span>
               </div>
               
               <h1 className="text-5xl font-black text-white leading-tight tracking-tight italic uppercase mb-6">
                 Beyond <br />
                 <span className="text-indigo-400">Limits.</span>
               </h1>
               
               <p className="text-sm text-indigo-200/80 font-medium italic leading-relaxed">
                 Shri Madhwa Vadiraja Institute’s flagship innovation terminal. 
                 Deploy your ideas on the official portal.
               </p>
            </div>

            <div className="relative z-10 grid grid-cols-2 gap-6">
                <div>
                    <p className="text-3xl font-black text-white italic">150+</p>
                    <p className="text-[10px] font-bold text-indigo-400/70 uppercase tracking-widest mt-1">Students</p>
                </div>
                <div>
                    <p className="text-3xl font-black text-white italic">₹80K</p>
                    <p className="text-[10px] font-bold text-indigo-400/70 uppercase tracking-widest mt-1">Prize Pool</p>
                </div>
            </div>

            {/* Background Graphic Decor */}
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-1000 rotate-12 pointer-events-none">
                <Trophy className="w-64 h-64" />
            </div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-600/30 rounded-full blur-[80px] pointer-events-none" />
        </div>

        {/* Authentication Section */}
        <div className="lg:col-span-3 p-8 sm:p-12 md:p-16 flex flex-col justify-center bg-white">
            <div className="max-w-sm mx-auto w-full">
                
                {/* Mobile Branding (Visible only on small screens) */}
                <div className="lg:hidden flex items-center justify-center gap-2 mb-10">
                    <div className="bg-indigo-600 p-2 rounded-xl">
                        <Zap className="w-5 h-5 text-white fill-white" />
                    </div>
                    <span className="text-xl font-black text-gray-900 tracking-tight italic uppercase">Hackveda.</span>
                </div>

                <div className="mb-10 text-center lg:text-left">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight italic mb-2">
                        {isAdminMode ? "Admin Console." : "Welcome Back."}
                    </h2>
                    <p className="text-sm font-medium text-gray-500">
                        {isAdminMode ? "Enter your vault credentials to continue." : "Sign in with your SODE college email."}
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {!isAdminMode ? (
                        <motion.div 
                            key="student"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="space-y-6"
                        >
                            <button
                                onClick={handleGoogleLogin}
                                className="w-full h-14 bg-gray-900 text-white flex items-center justify-center gap-3 rounded-2xl hover:bg-black transition-all font-bold text-sm group active:scale-[0.98] shadow-lg shadow-gray-200"
                            >
                                <div className="bg-white p-1.5 rounded-lg flex items-center justify-center">
                                    <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                                </div>
                                Sign in with Google
                            </button>
                            
                            <div className="flex items-center gap-4 py-2 opacity-50">
                                <div className="h-[1px] bg-gray-200 flex-1" />
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Or</span>
                                <div className="h-[1px] bg-gray-200 flex-1" />
                            </div>

                            <button 
                                onClick={() => setIsAdminMode(true)}
                                className="w-full py-3 text-center text-xs font-bold text-gray-500 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"
                            >
                                <ShieldCheck className="w-4 h-4" />
                                Login as Administrator
                            </button>
                        </motion.div>
                    ) : (
                        <motion.form 
                            key="admin"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            onSubmit={handleAdminLogin}
                            className="space-y-5"
                        >
                             <div className="space-y-4">
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                    <input 
                                        type="email" 
                                        placeholder="Admin Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full h-14 pl-12 pr-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-indigo-600 focus:bg-white outline-none font-medium text-sm transition-all focus:ring-4 focus:ring-indigo-600/10"
                                        required
                                    />
                                </div>
                                <div className="relative group">
                                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                    <input 
                                        type="password" 
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full h-14 pl-12 pr-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-indigo-600 focus:bg-white outline-none font-medium text-sm transition-all focus:ring-4 focus:ring-indigo-600/10"
                                        required
                                    />
                                </div>
                             </div>

                             <button
                                type="submit"
                                disabled={adminLoading}
                                className="w-full h-14 bg-indigo-600 text-white flex items-center justify-center gap-3 rounded-2xl hover:bg-indigo-700 transition-all font-bold text-sm group active:scale-[0.98] shadow-lg shadow-indigo-600/20 disabled:opacity-70 disabled:pointer-events-none"
                            >
                                {adminLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Access Console</span>}
                                {!adminLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                            </button>

                            <button 
                                type="button"
                                onClick={() => setIsAdminMode(false)}
                                className="w-full py-3 text-center text-xs font-bold text-gray-500 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"
                            >
                                Return to Student Sign In
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-700"
                    >
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <p className="text-xs font-medium leading-relaxed">{error}</p>
                    </motion.div>
                )}
            </div>
        </div>
      </motion.div>

      {/* Footer Decoration */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center opacity-40 select-none pointer-events-none">
          <p className="text-[10px] font-bold text-gray-500">© 2026 Hackveda | SMVITM</p>
      </div>
    </div>
  );
}
