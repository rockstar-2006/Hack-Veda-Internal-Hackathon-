"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getAllTeamsForAdmin } from "@/lib/db";
import { Team } from "@/types";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Trophy, ShieldCheck, Mail, ArrowRight, Table, Search, RefreshCcw, MoreHorizontal, FileCheck, Circle, Clock, CheckCircle2, LayoutGrid, Users } from "lucide-react";
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
      <div className="max-w-7xl mx-auto px-4 py-20 relative min-h-screen pb-40">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-24 relative">
             <div className="max-w-3xl relative z-10">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] border border-indigo-100 mb-8 italic"
                  >
                      <Trophy className="w-4 h-4" />
                      Live Standings
                  </motion.div>
                  <h1 className="text-6xl lg:text-8xl font-black text-gray-900 leading-[0.9] tracking-tighter mb-8 italic">
                     Team <br />
                     <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-950">Leaderboard.</span>
                  </h1>
                  <p className="text-xl text-gray-400 font-bold italic leading-relaxed">
                     Track the progress, status, and shortlisting results of all participating teams in real-time.
                  </p>
             </div>
             
             {/* Search/Filter Bar */}
             <div className="w-full md:w-96 relative z-10">
                  <div className="flex items-center gap-4 bg-white p-3 rounded-[2rem] border border-gray-100 shadow-2xl shadow-indigo-600/5 focus-within:border-indigo-200 transition-all">
                      <Search className="w-5 h-5 text-gray-300 ml-4" />
                      <input 
                         type="text" 
                         placeholder="Search teams..." 
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                         className="flex-1 bg-transparent border-0 focus:outline-none focus:ring-0 text-sm font-black tracking-tight uppercase"
                      />
                      <button 
                        onClick={fetchTeams}
                        className={`p-3 rounded-2xl bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all ${refreshing ? 'animate-spin' : ''}`}
                      >
                          <RefreshCcw className="w-4 h-4" />
                      </button>
                  </div>
             </div>
        </div>

        {/* Status Indicators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
             <motion.div 
                whileHover={{ y: -10 }}
                className="p-10 rounded-[3rem] bg-white border border-gray-50 flex items-center justify-between shadow-sm"
             >
                 <div>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 italic">Total Teams</p>
                     <p className="text-5xl font-black text-gray-900 leading-none">{teams.length}</p>
                 </div>
                 <div className="w-16 h-16 rounded-[2rem] bg-indigo-50 flex items-center justify-center">
                     <Users className="w-8 h-8 text-indigo-600" />
                 </div>
             </motion.div>
             <motion.div 
                whileHover={{ y: -10 }}
                className="p-10 rounded-[3rem] bg-white border border-gray-50 flex items-center justify-between shadow-sm"
             >
                 <div>
                     <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3 italic">Shortlisted</p>
                     <p className="text-5xl font-black text-indigo-600 leading-none">{teams.filter(t => t.shortlisted).length}</p>
                 </div>
                 <div className="w-16 h-16 rounded-[2rem] bg-indigo-50 flex items-center justify-center">
                     <CheckCircle2 className="w-8 h-8 text-indigo-600" />
                 </div>
             </motion.div>
             <motion.div 
                whileHover={{ y: -10 }}
                className="p-10 rounded-[3rem] bg-indigo-900 flex items-center justify-between shadow-2xl"
             >
                 <div>
                     <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-3 italic">Submission Rate</p>
                     <p className="text-5xl font-black text-white leading-none">
                        {teams.length ? Math.floor((teams.filter(t => t.shortlisted).length / teams.length) * 100) : 0}%
                     </p>
                 </div>
                 <div className="w-16 h-16 rounded-[2rem] bg-white/10 flex items-center justify-center">
                     <LayoutGrid className="w-8 h-8 text-white" />
                 </div>
             </motion.div>
        </div>

        {/* Data List */}
        <div className="space-y-6">
             <AnimatePresence mode="popLayout">
                 {loading ? (
                      [...Array(4)].map((_, i) => (
                        <div key={i} className="h-24 rounded-[2.5rem] bg-gray-50 animate-pulse border border-gray-100" />
                      ))
                 ) : filteredTeams.length > 0 ? (
                    filteredTeams.map((t, idx) => (
                        <motion.div 
                            key={t.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`p-8 md:p-10 rounded-[3rem] bg-white border flex flex-col md:flex-row items-center justify-between group transition-all duration-700 hover:shadow-2xl hover:shadow-indigo-600/5 hover:border-indigo-100 ${t.shortlisted ? 'border-primary-100 bg-indigo-50/10' : 'border-gray-50'}`}
                        >
                            <div className="flex items-center gap-10 w-full md:w-auto">
                                <span className="text-3xl font-black text-gray-200 group-hover:text-indigo-600 transition-colors w-12 italic">
                                    {(idx + 1).toString().padStart(2, '0')}
                                </span>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-black text-gray-900 mb-1 tracking-tighter italic uppercase">{t.teamName}</h3>
                                    <div className="flex items-center gap-3">
                                        <div className="flex -space-x-2">
                                            {t.memberIds.map(id => (
                                                <div key={id} className="w-5 h-5 rounded-full bg-indigo-100 border border-white" />
                                            ))}
                                        </div>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.memberIds.length} Members</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-12 mt-8 md:mt-0 w-full md:w-auto justify-between border-t border-gray-50 md:border-0 pt-8 md:pt-0">
                                <div className="text-right">
                                     <div className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 border transition-all ${t.shortlisted ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-600/20' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                                         {t.shortlisted ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                         {t.shortlisted ? 'Shortlisted' : 'Registered'}
                                     </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                 ) : (
                     <div className="text-center py-40">
                         <Search className="w-16 h-16 text-gray-100 mx-auto mb-6" />
                         <p className="text-xl text-gray-400 font-bold italic uppercase tracking-widest">No matching teams found</p>
                     </div>
                 )}
             </AnimatePresence>
        </div>

        {/* Decorative Background Art */}
        <div className="fixed bottom-0 left-0 w-96 h-96 bg-indigo-50/20 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2" />
      </div>
    </ProtectedRoute>
  );
}
