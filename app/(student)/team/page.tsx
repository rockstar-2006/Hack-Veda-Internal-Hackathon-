"use client";

import { useTeam } from "@/hooks/useTeam";
import { useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { 
  Users, 
  Key, 
  Copy, 
  Check, 
  ShieldCheck, 
  Mail, 
  ArrowLeft, 
  MoreHorizontal, 
  UserCheck, 
  ShieldOff,
  CheckCircle2,
  UserPlus,
  Trophy,
  Loader2,
  AlertCircle,
  Zap,
  ArrowRight,
  ShieldAlert
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { updateUserProfile, getUserProfile } from "@/lib/db";
import { UserProfile } from "@/types";

export default function TeamPage() {
  const { user } = useAuth();
  const { team, loading: teamLoading } = useTeam();
  const [copied, setCopied] = useState(false);
  const [members, setMembers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    if (team) {
      setLoading(true);
      try {
        const profilePromises = team.memberIds.map(id => getUserProfile(id));
        const profiles = await Promise.all(profilePromises);
        setMembers(profiles.filter(p => p !== null) as UserProfile[]);
      } catch (err) {
        console.error("Error fetching members:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [team]);

  const handleCopy = () => {
    if (team?.teamCode) {
      navigator.clipboard.writeText(team.teamCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (teamLoading || (team && loading)) return null;

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-6 py-20 min-h-screen pb-40 relative">
        
        {/* Header Section */}
        <section className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12 text-center md:text-left">
            <div className="flex-1">
                 <motion.div 
                   initial={{ x: -20, opacity: 0 }}
                   animate={{ x: 0, opacity: 1 }}
                   className="inline-flex items-center gap-3 bg-indigo-50 text-indigo-700 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] mb-10 italic border border-indigo-100"
                 >
                      <Zap className="w-4 h-4 fill-indigo-600" />
                      HackVeda Squad Identity
                 </motion.div>
                 <h1 className="text-6xl md:text-8xl font-black text-gray-900 leading-[0.8] tracking-tighter mb-10 italic">
                    Innovation <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-950">
                        Squad.
                    </span>
                 </h1>
                 <p className="text-xl text-gray-400 font-bold max-w-2xl italic leading-relaxed">
                    Manage your elite formation. Invite collaborators and synchronize your innovation protocols.
                 </p>
            </div>
            
            {team && (
                <div className="bg-white border-4 border-indigo-50 p-10 rounded-[3rem] text-right shadow-2xl shadow-indigo-600/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-12 transition-transform duration-700">
                        <Users className="w-20 h-20" />
                    </div>
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3 italic">Reporting Name</p>
                    <p className="text-3xl font-black text-gray-900 leading-none uppercase italic tracking-tighter">{team.teamName}</p>
                    <div className="flex items-center justify-end gap-2 mt-4">
                         <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_green]" />
                         <span className="text-[11px] font-black uppercase tracking-widest text-indigo-600">Active Cycle</span>
                    </div>
                </div>
            )}
        </section>

        {team ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                {/* Team Members List */}
                <div className="lg:col-span-2 space-y-12">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] italic">Squad Personnel ({members.length}/4)</h3>
                        <div className="h-[2px] flex-1 mx-10 bg-indigo-50/50" />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-8">
                        {members.map((member) => (
                            <motion.div 
                                key={member.userId}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-10 rounded-[3.5rem] bg-white border-4 border-indigo-50 hover:border-indigo-600 hover:shadow-2xl hover:shadow-indigo-600/5 transition-all group flex flex-col justify-between h-[280px] relative overflow-hidden"
                            >
                                <div className="flex items-center justify-between relative z-10">
                                    <div className="w-16 h-16 bg-gray-50 rounded-[1.8rem] flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-xl border border-indigo-50/50">
                                        <UserCheck className="w-8 h-8" />
                                    </div>
                                    {member.userId === team.leaderId && (
                                        <div className="bg-amber-100 text-amber-700 px-5 py-2 rounded-2xl text-[10px] font-black uppercase italic tracking-widest shadow-sm">Leader</div>
                                    )}
                                </div>
                                
                                <div className="relative z-10">
                                    <h4 className="font-black text-gray-900 text-2xl uppercase italic tracking-tighter leading-none mb-3 group-hover:text-indigo-600 transition-colors truncate pr-10">{member.full_name || "Initiating..."}</h4>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <p className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase italic">{member.usn || "NOT SET"}</p>
                                    </div>
                                </div>

                                <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-1000 -z-0 bg-indigo-600 rounded-full scale-150 blur-3xl" />
                            </motion.div>
                        ))}

                        {/* Leave Action Card */}
                        <motion.div 
                            className="p-10 rounded-[3.5rem] border-4 border-dashed border-red-100 bg-red-50/10 flex flex-col justify-between h-[280px] group cursor-pointer hover:bg-red-50 transition-all duration-500 relative overflow-hidden shrink-0"
                        >
                            <div className="w-16 h-16 bg-white rounded-[1.8rem] flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all shadow-xl border border-red-50 relative z-10">
                                <ShieldOff className="w-8 h-8" />
                            </div>
                            <div className="relative z-10">
                                <h4 className="font-black text-red-600 text-2xl uppercase italic tracking-tighter leading-none mb-3">Safe Disconnect</h4>
                                <p className="text-[10px] font-black text-red-400 tracking-[0.2em] uppercase italic">Exit Combat Unit</p>
                            </div>
                        </motion.div>
                    </div>

                    {members.length < 2 && (
                         <div className="bg-orange-50 border-4 border-orange-100 p-12 rounded-[4rem] flex flex-col md:flex-row items-center gap-10 text-orange-700 shadow-2xl shadow-orange-500/5">
                            <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-orange-500/10 shrink-0">
                                <ShieldAlert className="w-10 h-10 text-orange-500" />
                            </div>
                            <div className="text-center md:text-left">
                                <h4 className="font-black text-2xl mb-2 italic tracking-tighter leading-none uppercase text-orange-950">Minimum Squad Breach</h4>
                                <p className="font-bold text-base tracking-tight opacity-70 italic">HackVeda standards require exactly **2 to 4 members** for deployment eligibility. Your current formation is incomplete.</p>
                            </div>
                         </div>
                    )}
                </div>

                {/* Sidebar: Invite & Status */}
                <div className="space-y-12">
                    {/* Invite Section */}
                    <div className="p-12 rounded-[4.5rem] bg-gray-950 text-white relative overflow-hidden group shadow-2xl border-4 border-gray-900">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] -mr-32 -mt-32" />
                        
                        <div className="flex items-center gap-4 mb-14 relative z-10">
                             <div className="bg-indigo-600 p-4 rounded-2xl shadow-xl shadow-indigo-600/30">
                                 <UserPlus className="w-6 h-6" />
                             </div>
                             <div>
                                 <h3 className="text-2xl font-black italic tracking-tighter uppercase leading-none">Expansion HUB</h3>
                                 <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-1">Personnel Recruitment</p>
                             </div>
                        </div>

                        {members.length >= 4 ? (
                            <div className="p-10 bg-white/5 border-2 border-white/10 rounded-[3rem] text-center relative z-10 backdrop-blur-sm">
                                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-6 drop-shadow-[0_0_10px_green]" />
                                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">Formation Optimized</p>
                                <p className="text-xl font-black text-white italic tracking-tighter">SQUAD LIMIT REACHED</p>
                            </div>
                        ) : (
                            <div className="space-y-10 relative z-10">
                                <div className="p-10 bg-white/5 border-4 border-white/10 rounded-[3.5rem] relative group/code cursor-pointer overflow-hidden backdrop-blur-md" onClick={handleCopy}>
                                    <div className="absolute inset-0 bg-indigo-600 transform scale-x-0 group-hover/code:scale-x-100 origin-left transition-transform duration-700 opacity-20" />
                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-4 relative z-10 italic">Secure Broadcast Key</p>
                                    <div className="flex items-center justify-between relative z-10">
                                        <span className="text-5xl font-black tracking-[0.3em] font-mono text-white tracking-widest leading-none italic">{team.teamCode}</span>
                                        {copied ? <Check className="w-7 h-7 text-green-400" /> : <Copy className="w-7 h-7 text-indigo-500 group-hover/code:text-white transition-all duration-500" />}
                                    </div>
                                </div>
                                
                                <button 
                                  onClick={handleCopy}
                                  className="w-full h-24 bg-indigo-600 text-white rounded-[2.5rem] flex items-center justify-center gap-6 font-black uppercase text-sm tracking-[0.3em] shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all active:scale-95 group"
                                >
                                    {copied ? "IDENTIFIER ARCHIVED" : <>Copy Invite Code <ArrowRight className="w-5 h-5 group-hover:translate-x-3 transition-transform" /></>}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Team Status Card */}
                    <div className="p-12 rounded-[4rem] bg-indigo-50/50 border-4 border-indigo-50 group hover:border-indigo-600 transition-all duration-500">
                         <div className="flex items-center gap-5 mb-10">
                            <div className="w-16 h-16 bg-white rounded-[1.8rem] border-2 border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xl group-hover:rotate-12 transition-transform duration-700">
                                <Trophy className="w-8 h-8" />
                            </div>
                            <div>
                                <h4 className="font-black text-gray-950 text-2xl uppercase italic tracking-tighter leading-none mb-1">Squad Vitality</h4>
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest italic">Mission Readiness</p>
                            </div>
                         </div>
                         <div className="space-y-6">
                             <div className="flex justify-between items-center p-6 bg-white rounded-[2rem] shadow-sm border-2 border-transparent group-hover:border-indigo-100 transition-all">
                                 <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] italic">REGISTRATION</span>
                                 <div className="flex items-center gap-3">
                                      <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_green]" />
                                      <span className="text-[11px] font-black text-green-600 uppercase italic">COMMITTED</span>
                                 </div>
                             </div>
                             <div className="flex justify-between items-center p-6 bg-white rounded-[2rem] shadow-sm border-2 border-transparent group-hover:border-indigo-100 transition-all">
                                 <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] italic">ELIGIBILITY</span>
                                 <span className={`text-[11px] font-black uppercase italic ${members.length >= 2 ? 'text-indigo-600' : 'text-orange-600'}`}>
                                     {members.length >= 2 ? 'READY' : 'INCOMPLETE'}
                                 </span>
                             </div>
                         </div>
                    </div>
                </div>
            </div>
        ) : (
            <div className="max-w-xl mx-auto py-40 text-center">
                 <div className="bg-indigo-50 w-24 h-24 rounded-[3rem] flex items-center justify-center mx-auto mb-10 shadow-xl border border-indigo-100">
                      <Zap className="w-12 h-12 text-indigo-600 fill-indigo-600" />
                 </div>
                 <p className="text-3xl font-black text-gray-950 uppercase italic tracking-tighter mb-6">Unauthorized access.</p>
                 <Link href="/profile" className="inline-flex h-20 items-center justify-center gap-6 bg-gray-950 text-white px-12 rounded-3xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all">
                    <ArrowLeft className="w-5 h-5" /> Return to Terminal
                 </Link>
            </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
