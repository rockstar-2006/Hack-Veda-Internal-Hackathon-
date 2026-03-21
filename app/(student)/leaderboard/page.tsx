"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getAllTeamsForAdmin } from "@/lib/db";
import { Team } from "@/types";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Trophy, ShieldCheck, Mail, ArrowRight, Table, Search, RefreshCcw, MoreHorizontal, FileCheck, Circle, Clock, CheckCircle2, Users, Zap } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [teams, setTeams] = useState<(Team & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchTeams = async () => {
    setLoading(true);
    setRefreshing(true);
    try {
      const data = await getAllTeamsForAdmin();
      setTeams(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const filteredTeams = teams.filter(t => 
    t.teamName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 relative min-h-screen pb-40 font-sans">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-24 relative">
             <div className="max-w-3xl relative z-10">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 bg-yellow-400 text-black px-5 py-2 rounded-2xl text-lg font-bold uppercase tracking-widest border-4 border-black shadow-[4px_4px_0_#000] transform rotate-2 mb-8"
                  >
                      <Trophy className="w-6 h-6 fill-yellow-200" />
                      LIVE STANDINGS!
                  </motion.div>
                   <h1 className="text-6xl lg:text-9xl font-comic text-black leading-none uppercase mb-8 drop-shadow-[4px_4px_0_#ff007f] transform -rotate-1">
                      EVENT <br />
                      <span className="text-white drop-shadow-[4px_4px_0_#000]">SCOREBOARD!</span>
                   </h1>
                  <p className="text-xl text-black bg-white p-4 border-4 border-black shadow-[6px_6px_0_#00f0ff] rounded-xl transform rotate-1 font-bold">
                     Track the progress, status, and shortlisting results of all participating teams in real-time. THE RACE IS ON!
                  </p>
             </div>
             
             {/* Search Bar */}
             <div className="w-full md:w-96 relative z-10 px-2 sm:px-0">
                  <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border-4 border-black shadow-[8px_8px_0_#000] focus-within:-translate-y-1 transition-all">
                      <Search className="w-6 h-6 text-black stroke-[3]" />
                      <input 
                         type="text" 
                         placeholder="FIND TEAM..." 
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                         className="flex-1 bg-transparent border-0 focus:outline-none focus:ring-0 text-lg font-comic tracking-widest uppercase placeholder:text-gray-400"
                      />
                      <button 
                        onClick={fetchTeams}
                        className={`p-3 rounded-xl bg-pink-400 text-black border-2 border-black hover:bg-black hover:text-white transition-all shadow-[2px_2px_0_#000] active:translate-y-1 active:shadow-none ${refreshing ? 'animate-spin' : ''}`}
                      >
                          <RefreshCcw className="w-5 h-5 stroke-[3]" />
                      </button>
                  </div>
             </div>
        </div>

        {/* Status Indicators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-20 relative z-10">
             <motion.div 
                whileHover={{ y: -10, rotate: -2 }}
                className="p-10 rounded-[2.5rem] bg-yellow-400 border-4 border-black flex items-center justify-between shadow-[10px_10px_0_#000] relative overflow-hidden"
             >
                 <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '16px 16px' }} />
                 <div className="relative z-10">
                     <p className="text-sm font-comic text-black uppercase tracking-widest mb-3 bg-white inline-block px-2 border-2 border-black rounded">TOTAL TEAMS</p>
                     <p className="text-7xl font-comic text-black leading-none drop-shadow-[2px_2px_0_#fff]">{teams.length}</p>
                 </div>
                 <div className="w-20 h-20 rounded-2xl bg-white border-4 border-black flex items-center justify-center shadow-[4px_4px_0_#000] relative z-10">
                     <Users className="w-10 h-10 text-black stroke-[3]" />
                 </div>
             </motion.div>

             <motion.div 
                whileHover={{ y: -10, rotate: 2 }}
                className="p-10 rounded-[2.5rem] bg-cyan-400 border-4 border-black flex items-center justify-between shadow-[10px_10px_0_#000] relative overflow-hidden"
             >
                 <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '16px 16px' }} />
                 <div className="relative z-10">
                     <p className="text-sm font-comic text-black uppercase tracking-widest mb-3 bg-white inline-block px-2 border-2 border-black rounded">SHORTLISTED</p>
                     <p className="text-7xl font-comic text-black leading-none drop-shadow-[2px_2px_0_#fff]">{teams.filter(t => t.shortlisted).length}</p>
                 </div>
                 <div className="w-20 h-20 rounded-2xl bg-white border-4 border-black flex items-center justify-center shadow-[4px_4px_0_#000] relative z-10">
                     <CheckCircle2 className="w-10 h-10 text-black stroke-[3]" />
                 </div>
             </motion.div>

             <motion.div 
                whileHover={{ y: -10, rotate: -1 }}
                className="p-10 rounded-[2.5rem] bg-pink-400 border-4 border-black flex items-center justify-between shadow-[10px_10px_0_#000] relative overflow-hidden"
             >
                 <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '16px 16px' }} />
                 <div className="relative z-10">
                     <p className="text-sm font-comic text-black uppercase tracking-widest mb-3 bg-white inline-block px-2 border-2 border-black rounded">SUCCESS RATE</p>
                     <p className="text-7xl font-comic text-black leading-none drop-shadow-[2px_2px_0_#fff]">
                        {teams.length ? Math.floor((teams.filter(t => t.shortlisted).length / teams.length) * 100) : 0}%
                     </p>
                 </div>
                 <div className="w-20 h-20 rounded-2xl bg-white border-4 border-black flex items-center justify-center shadow-[4px_4px_0_#000] relative z-10">
                     <Zap className="w-10 h-10 text-black fill-yellow-400 stroke-[3]" />
                 </div>
             </motion.div>
        </div>

        {/* Data List */}
        <div className="space-y-8 relative z-10">
             <AnimatePresence mode="popLayout">
                 {loading ? (
                      [...Array(4)].map((_, i) => (
                        <div key={i} className="h-32 rounded-3xl bg-gray-200 animate-pulse border-4 border-black shadow-[8px_8px_0_#000]" />
                      ))
                 ) : filteredTeams.length > 0 ? (
                    filteredTeams.map((t, idx) => (
                        <motion.div 
                            key={t.id}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: idx * 0.05 }}
                            whileHover={{ scale: 1.02, x: 10 }}
                            className={`p-6 md:p-8 rounded-[3rem] bg-white border-4 border-black flex flex-col md:flex-row items-center justify-between group transition-all shadow-[12px_12px_0_#000] hover:shadow-[16px_16px_0_#ff007f] relative overflow-hidden`}
                        >
                            {/* Halftone BG on hover */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '16px 16px' }} />

                            <div className="flex items-center gap-6 md:gap-10 w-full md:w-auto relative z-10">
                                <span className="text-4xl md:text-5xl font-comic text-gray-200 group-hover:text-black transition-colors w-16 text-center transform -rotate-12">
                                    {(idx + 1).toString().padStart(2, '0')}
                                </span>
                                <div className="flex-1">
                                    <h3 className="text-3xl md:text-4xl font-comic text-black mb-2 tracking-widest uppercase drop-shadow-[2px_2px_0_#00f0ff]">{t.teamName}</h3>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2 bg-gray-100 border-2 border-black px-3 py-1 rounded-xl">
                                            <Users className="w-4 h-4 text-black" />
                                            <span className="text-xs font-bold text-black uppercase tracking-widest">{t.memberIds.length} TEAM MEMBERS</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-12 mt-8 md:mt-0 w-full md:w-auto justify-end relative z-10">
                                <div className="text-right">
                                     <div className={`px-8 py-4 rounded-2xl text-lg font-comic uppercase tracking-widest flex items-center gap-4 border-4 border-black shadow-[6px_6px_0_#000] group-hover:shadow-[8px_8px_0_#000] rotate-1 group-hover:rotate-0 transition-all ${t.shortlisted ? 'bg-indigo-400 text-white' : 'bg-gray-100 text-black'}`}>
                                         {t.shortlisted ? <CheckCircle2 className="w-6 h-6 stroke-[3]" /> : <Clock className="w-6 h-6 stroke-[3]" />}
                                         {t.shortlisted ? 'SHORTLISTED!' : 'REGISTERED'}
                                     </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                 ) : (
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center py-40 bg-white border-4 border-black rounded-3xl shadow-[12px_12px_0_#000]"
                    >
                         <Search className="w-32 h-32 text-gray-200 mx-auto mb-8 animate-bounce" />
                         <p className="text-4xl font-comic text-black uppercase tracking-widest drop-shadow-[2px_2px_0_#fff]">NO MATCHING TEAMS FOUND!</p>
                         <button onClick={() => setSearchTerm("")} className="mt-8 bg-yellow-400 text-black border-4 border-black px-8 py-3 rounded-xl font-comic text-xl uppercase tracking-widest shadow-[6px_6px_0_#000] hover:translate-y-1 hover:shadow-none transition-all">CLEAR SCAN</button>
                    </motion.div>
                 )}
             </AnimatePresence>
        </div>

      </div>
    </ProtectedRoute>
  );
}
