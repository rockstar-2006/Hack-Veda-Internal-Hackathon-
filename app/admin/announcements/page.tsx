"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { createAnnouncement } from "@/lib/db";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { 
  MessageSquare, 
  Send, 
  ArrowLeft, 
  ShieldCheck, 
  Info, 
  AlertOctagon, 
  Trash2, 
  Calendar, 
  RefreshCcw, 
  Bell,
  Zap,
  ArrowRight,
  ShieldAlert
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminAnnouncements() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;
    setLoading(true);
    setSuccess(false);
    setError("");

    try {
      await createAnnouncement(title, message);
      setSuccess(true);
      setTitle("");
      setMessage("");
    } catch (err: any) {
      setError(err.message || "Protocol Failure: Announcement could not be archived.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="max-w-6xl mx-auto px-6 py-20 min-h-screen pb-40">
        
        {/* Header */}
        <section className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12 text-center md:text-left">
            <div className="flex-1 space-y-10">
                 <motion.div 
                   initial={{ x: -20, opacity: 0 }}
                   animate={{ x: 0, opacity: 1 }}
                   className="inline-flex items-center gap-3 bg-red-50 text-red-700 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] italic border border-red-100"
                 >
                      <Bell className="w-4 h-4 fill-red-600" />
                      Announcement Center
                 </motion.div>
                 <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight tracking-tighter italic">
                    Send <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-950 font-black">
                        Updates.
                    </span>
                 </h1>
                 <p className="text-lg text-gray-400 font-bold max-w-2xl italic leading-relaxed">
                    Post new announcements and send important notifications to all participating teams.
                 </p>
            </div>
            
            <div className="bg-red-950 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group shrink-0">
                 <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-2 italic">Broadcast Power</p>
                 <p className="text-3xl font-black italic tracking-tighter">Level 4 Clearance</p>
                 <div className="flex items-center gap-2 mt-4 text-red-500">
                     <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping shadow-[0_0_12px_red]" />
                     <span className="text-[10px] font-black uppercase tracking-[0.2em]">Transmission Ready</span>
                 </div>
                 {/* Decor */}
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                     <Bell className="w-24 h-24" />
                 </div>
            </div>
        </section>

        <div className="grid lg:grid-cols-2 gap-12">
            <div>
                 <form onSubmit={handleSubmit} className="p-12 md:p-16 rounded-[4.5rem] bg-white border-4 border-indigo-50 shadow-2xl shadow-indigo-600/5 space-y-12 relative overflow-hidden group">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-4 block italic">Archive Headline</label>
                        <input 
                            type="text" 
                            placeholder="Ex: FINAL SUBMISSION DEADLINE EXTENDED" 
                            className="w-full h-20 px-10 rounded-3xl bg-gray-50 border-4 border-transparent focus:border-red-600 focus:bg-white outline-none font-black text-xl italic tracking-tighter uppercase transition-all"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-4 block italic">Transmission Intel</label>
                        <textarea 
                            placeholder="Input detailed directive here..." 
                            className="w-full min-h-[240px] px-10 py-8 rounded-[3rem] bg-gray-50 border-4 border-transparent focus:border-red-600 focus:bg-white outline-none font-bold text-lg italic transition-all resize-none"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading || !title || !message}
                        className="w-full h-24 rounded-[3rem] bg-indigo-600 text-white font-black text-2xl tracking-tight shadow-3xl shadow-indigo-600/40 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-6 group"
                    >
                        {loading ? <RefreshCcw className="w-8 h-8 animate-spin" /> : <>Initiate Broadcast <Send className="w-6 h-6 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" /></>}
                    </button>

                    <AnimatePresence>
                        {success && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="p-8 bg-green-50 text-green-700 rounded-[2.5rem] border-4 border-green-100 font-black text-sm uppercase italic tracking-widest text-center flex items-center justify-center gap-4"
                            >
                                <ShieldCheck className="w-6 h-6" /> Transmission Successful.
                            </motion.div>
                        )}
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="p-8 bg-red-50 text-red-700 rounded-[2.5rem] border-4 border-red-100 font-black text-sm uppercase italic tracking-widest text-center flex items-center justify-center gap-4"
                            >
                                <ShieldAlert className="w-6 h-6" /> {error}
                            </motion.div>
                        )}
                    </AnimatePresence>
                    
                    {/* Background Icon Watermark */}
                    <div className="absolute bottom-0 right-0 p-10 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-1000 -z-0 bg-red-600 rounded-full scale-150 blur-3xl" />
                 </form>
            </div>

            <div className="space-y-12">
                 <div className="p-12 rounded-[4rem] bg-indigo-50 border-4 border-indigo-100 shadow-2xl shadow-indigo-600/5 relative overflow-hidden group">
                     <h3 className="text-2xl font-black text-indigo-950 mb-10 flex items-center gap-4 uppercase italic tracking-tighter">
                         <Info className="w-6 h-6 text-indigo-600" />
                         Transmission Standards
                     </h3>
                     <ul className="space-y-8">
                         {[
                             "Headers must be concise (Max 50 characters).",
                             "Directives should be actionable and time-sensitive.",
                             "Avoid ambiguity in technical instructions.",
                             "All transmissions are logged for audit purposes."
                         ].map((text, i) => (
                             <li key={i} className="flex gap-6 text-indigo-900 text-base font-bold items-start group/li italic">
                                 <div className="bg-indigo-600 w-8 h-8 rounded-2xl flex items-center justify-center shrink-0 text-white font-black text-[10px] shadow-lg shadow-indigo-600/20 group-hover/li:rotate-12 transition-transform">{i+1}</div>
                                 <p className="pt-1">{text}</p>
                             </li>
                         ))}
                     </ul>
                     <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:rotate-12 transition-transform duration-1000">
                         <Zap className="w-48 h-48" />
                     </div>
                 </div>

                 <div className="p-12 rounded-[4rem] bg-gray-950 text-white border-4 border-gray-900 shadow-3xl relative overflow-hidden group">
                     <div className="relative z-10">
                        <div className="flex items-center gap-6 mb-10">
                             <div className="bg-red-600 p-5 rounded-3xl shadow-2xl shadow-red-600/30 group-hover:rotate-45 transition-transform duration-700">
                                 <Bell className="w-8 h-8" />
                             </div>
                             <div>
                                 <h3 className="text-2xl font-black uppercase tracking-tighter italic">Fleet Tracker</h3>
                                 <p className="text-[10px] font-black text-red-500 tracking-[0.4em] uppercase italic animate-pulse">Connection Secured</p>
                             </div>
                        </div>
                        <p className="text-base font-bold text-gray-400 italic mb-10 border-l-4 border-red-600 pl-8 leading-relaxed">
                            Authorized broadcasts are pushed to all active terminals via edge-cached optimization. 
                        </p>
                        <button className="flex items-center gap-4 text-white font-black text-xs uppercase tracking-[0.3em] hover:text-red-500 transition-all group/btn italic">
                            Archive History <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-3 transition-transform" />
                        </button>
                     </div>
                     <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-red-600/10 rounded-full blur-[120px] pointer-events-none group-hover:scale-150 transition-transform duration-[2000ms]" />
                 </div>
            </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
