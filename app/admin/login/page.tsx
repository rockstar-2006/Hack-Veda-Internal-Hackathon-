"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, 
  ArrowRight, 
  Key, 
  Mail, 
  Loader2, 
  AlertCircle,
  Zap,
  Lock
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Admin session verified - expires in 8 hours (28800000 ms)
        localStorage.setItem("adminSession", "active");
        localStorage.setItem("adminEmail", email);
        localStorage.setItem("adminSessionTime", Date.now().toString());
        router.push("/admin/dashboard");
      } else {
        setError(data.message || "Invalid Admin Protocol. Access Denied.");
      }
    } catch (err) {
      setError("Connection failure. Admin vault unreachable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-50 rounded-full blur-[160px] -z-10 translate-x-1/2 -translate-y-1/2 opacity-60" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-50 rounded-full blur-[140px] -z-10 -translate-x-1/2 translate-y-1/2 opacity-60" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl p-10 md:p-16 rounded-[4rem] bg-white border-4 border-indigo-50 shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center text-center mb-12">
            <div className="w-20 h-20 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-2xl shadow-indigo-600/30">
                <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-black text-gray-900 italic tracking-tighter uppercase leading-none mb-4">Admin Vault.</h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] italic">Authorized Admins Only</p>
        </div>

        {error && (
            <div className="bg-red-50 border-2 border-red-100 p-5 rounded-3xl flex items-center gap-4 mb-8 text-red-700 animate-shake">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="font-bold text-xs uppercase tracking-tight">{error}</p>
            </div>
        )}

        <form onSubmit={handleLogin} className="space-y-10">
             <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-6">Admin Identity</label>
                 <div className="relative group">
                     <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                     <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@hackveda.in"
                        className="w-full h-20 pl-16 pr-8 rounded-[2.5rem] bg-gray-50 border-4 border-transparent focus:border-indigo-600 focus:bg-white outline-none font-bold text-lg transition-all"
                        required
                     />
                 </div>
             </div>

             <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-6">Verification Key</label>
                 <div className="relative group">
                     <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                     <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-20 pl-16 pr-8 rounded-[2.5rem] bg-gray-50 border-4 border-transparent focus:border-indigo-600 focus:bg-white outline-none font-bold text-lg transition-all"
                        required
                     />
                 </div>
             </div>

             <button 
               type="submit" 
               disabled={loading}
               className="w-full h-24 rounded-[3rem] bg-indigo-600 text-white font-black text-xl tracking-tight shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-6"
             >
                 {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : <>Access Control Center <ArrowRight className="w-6 h-6" /></>}
             </button>
        </form>

        <div className="mt-12 text-center opacity-20">
             <Zap className="w-12 h-12 text-indigo-100 mx-auto fill-indigo-100" />
        </div>
      </motion.div>
    </div>
  );
}
