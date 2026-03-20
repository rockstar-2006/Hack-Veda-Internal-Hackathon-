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
      <div className="max-w-5xl mx-auto px-6 py-10 min-h-screen">
        
        {/* Header */}
        <section className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 text-center md:text-left">
            <div className="flex-1 space-y-4">
                 <motion.div 
                   initial={{ x: -20, opacity: 0 }}
                   animate={{ x: 0, opacity: 1 }}
                   className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest border border-red-100"
                 >
                      <Bell className="w-3.5 h-3.5 fill-red-600" />
                      Global Announcements
                 </motion.div>
                 <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight tracking-tight italic">
                    Send Updates.
                 </h1>
                 <p className="text-sm text-gray-500 font-medium max-w-2xl leading-relaxed">
                    Post new announcements and send important notifications to all participating teams.
                 </p>
            </div>
            
            <div className="bg-red-950 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden group shrink-0 min-w-[200px]">
                 <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">Status</p>
                 <p className="text-xl font-black tracking-tight">System Ready</p>
                 <div className="flex items-center gap-2 mt-2 text-red-400">
                     <div className="w-2 h-2 rounded-full bg-red-500 animate-ping shadow-[0_0_8px_red]" />
                     <span className="text-[10px] font-bold uppercase tracking-widest">Live</span>
                 </div>
                 {/* Decor */}
                 <div className="absolute -top-4 -right-4 p-4 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                     <Bell className="w-24 h-24" />
                 </div>
            </div>
        </section>

        <div className="grid lg:grid-cols-2 gap-8">
            <div>
                 <form onSubmit={handleSubmit} className="p-6 md:p-8 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-6 relative overflow-hidden group">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">Announcement Title</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Final Submission Deadline" 
                            className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-red-600 focus:bg-white outline-none font-medium text-sm transition-all focus:ring-4 focus:ring-red-600/10"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">Message Details</label>
                        <textarea 
                            placeholder="Enter the details of your announcement..." 
                            className="w-full min-h-[160px] px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-red-600 focus:bg-white outline-none font-medium text-sm transition-all resize-none focus:ring-4 focus:ring-red-600/10"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading || !title || !message}
                        className="w-full h-12 rounded-xl bg-red-600 text-white font-bold text-sm tracking-tight shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 group"
                    >
                        {loading ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <span>Broadcast <Send className="w-4 h-4 inline ml-1 group-hover:translate-x-1 transition-transform" /></span>}
                    </button>

                    <AnimatePresence>
                        {success && (
                            <motion.div 
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="p-4 bg-green-50 text-green-700 rounded-xl border border-green-100 font-bold text-xs flex items-center gap-3"
                            >
                                <ShieldCheck className="w-4 h-4" /> Announcement Sent Successfully.
                            </motion.div>
                        )}
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 font-bold text-xs flex items-center gap-3"
                            >
                                <ShieldAlert className="w-4 h-4" /> {error}
                            </motion.div>
                        )}
                    </AnimatePresence>
                 </form>
            </div>

            <div className="space-y-6">
                 <div className="p-8 rounded-2xl bg-gray-50 border border-gray-200 shadow-sm relative overflow-hidden group">
                     <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2 tracking-tight">
                         <Info className="w-5 h-5 text-indigo-600" />
                         Guidelines
                     </h3>
                     <ul className="space-y-4">
                         {[
                             "Titles must be concise and descriptive.",
                             "Keep the message actionable and polite.",
                             "Check spelling to maintain professionalism.",
                             "Sent announcements cannot be immediately deleted."
                         ].map((text, i) => (
                             <li key={i} className="flex gap-3 text-gray-600 text-sm font-medium items-start">
                                 <div className="bg-white border border-gray-200 w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-gray-500 font-bold text-[10px]">{i+1}</div>
                                 <p className="pt-0.5">{text}</p>
                             </li>
                         ))}
                     </ul>
                 </div>

                 <div className="p-8 rounded-2xl bg-indigo-950 text-white shadow-xl relative overflow-hidden group">
                     <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-6">
                             <div className="bg-indigo-600/30 p-3 rounded-xl border border-indigo-500/30">
                                 <Bell className="w-5 h-5 text-indigo-200" />
                             </div>
                             <div>
                                 <h3 className="text-lg font-black tracking-tight">Notification System</h3>
                                 <p className="text-[10px] font-bold text-indigo-400 tracking-widest uppercase mt-1">Real-time Enabled</p>
                             </div>
                        </div>
                        <p className="text-sm font-medium text-indigo-200/80 mb-6 leading-relaxed">
                            Announcements will instantly appear as popup notifications to all students currently browsing the portal.
                        </p>
                     </div>
                 </div>
            </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
