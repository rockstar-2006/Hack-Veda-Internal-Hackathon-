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
        <section className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 text-center md:text-left">
            <div className="flex-1">
                 <motion.div 
                   initial={{ x: -20, opacity: 0 }}
                   animate={{ x: 0, opacity: 1 }}
                   className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest mb-4 border border-indigo-100"
                 >
                      <Zap className="w-4 h-4 fill-indigo-600" />
                      HackVeda Squad Identity
                 </motion.div>
                 <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-[0.9] tracking-tight mb-4">
                    Innovation <br />
                    <span className="text-indigo-600">
                        Squad.
                    </span>
                 </h1>
                 <p className="text-sm md:text-base text-gray-500 font-medium max-w-xl">
                    Manage your elite formation. Invite collaborators and synchronize your innovation protocols.
                 </p>
            </div>
            
            {team && (
                <div className="bg-white border-2 border-indigo-50 p-6 rounded-2xl text-right shadow-sm relative overflow-hidden group w-full md:w-auto mt-6 md:mt-0">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-12 transition-transform duration-500">
                        <Users className="w-12 h-12" />
                    </div>
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Reporting Name</p>
                    <p className="text-2xl font-black text-gray-900 leading-none uppercase tracking-tight">{team.teamName}</p>
                    <div className="flex items-center justify-end gap-2 mt-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_green]" />
                         <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">Active Cycle</span>
                    </div>
                </div>
            )}
        </section>

        {team ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                
                {/* Team Members List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Squad Personnel ({members.length}/4)</h3>
                        <div className="h-px flex-1 ml-4 bg-gray-200" />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        {members.map((member) => (
                            <motion.div 
                                key={member.userId}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-6 rounded-2xl bg-white border border-gray-100 hover:border-indigo-600 hover:shadow-lg transition-all group flex flex-col justify-between h-[160px] relative overflow-hidden"
                            >
                                <div className="flex items-center justify-between relative z-10 mb-4">
                                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                        <UserCheck className="w-6 h-6" />
                                    </div>
                                    {member.userId === team.leaderId && (
                                        <div className="bg-amber-100 text-amber-700 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest">Leader</div>
                                    )}
                                </div>
                                
                                <div className="relative z-10">
                                    <h4 className="font-black text-gray-900 text-lg uppercase tracking-tight leading-none mb-2 group-hover:text-indigo-600 transition-colors truncate">{member.full_name || "Initiating..."}</h4>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        <p className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">{member.usn || "NOT SET"}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {/* Leave Action Card */}
                        <motion.div 
                            className="p-6 rounded-2xl border-2 border-dashed border-red-200 bg-red-50/50 flex flex-col justify-between h-[160px] group cursor-pointer hover:bg-red-100 transition-all relative overflow-hidden shrink-0"
                        >
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all shadow-sm mb-4">
                                <ShieldOff className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-black text-red-600 text-lg uppercase tracking-tight leading-none mb-1">Safe Disconnect</h4>
                                <p className="text-[10px] font-bold text-red-400 tracking-widest uppercase">Exit Combat Unit</p>
                            </div>
                        </motion.div>
                    </div>

                    {members.length < 2 && (
                         <div className="bg-orange-50 border border-orange-200 p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-4 text-orange-700 shadow-sm mt-6">
                            <div className="bg-white p-3 rounded-xl shadow-sm shrink-0">
                                <ShieldAlert className="w-6 h-6 text-orange-500" />
                            </div>
                            <div className="text-center sm:text-left">
                                <h4 className="font-black text-lg mb-1 tracking-tight uppercase text-orange-900">Minimum Squad Breach</h4>
                                <p className="font-medium text-sm">HackVeda standards require exactly **2 to 4 members** for deployment eligibility. Your formation is currently incomplete.</p>
                            </div>
                         </div>
                    )}
                </div>

                {/* Sidebar: Invite & Status */}
                <div className="space-y-6">
                    {/* Invite Section */}
                    <div className="p-6 md:p-8 rounded-3xl bg-gray-950 text-white relative overflow-hidden group shadow-xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 rounded-full blur-[40px] -mr-16 -mt-16" />
                        
                        <div className="flex items-center gap-3 mb-6 relative z-10">
                             <div className="bg-indigo-600 p-3 rounded-xl shadow-lg shadow-indigo-600/30">
                                 <UserPlus className="w-5 h-5" />
                             </div>
                             <div>
                                 <h3 className="text-xl font-black tracking-tight uppercase leading-none">Expansion HUB</h3>
                                 <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-1">Personnel Recruitment</p>
                             </div>
                        </div>

                        {members.length >= 4 ? (
                            <div className="p-6 bg-white/10 border border-white/20 rounded-2xl text-center relative z-10">
                                <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-3" />
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Formation Optimized</p>
                                <p className="text-base font-black text-white uppercase tracking-tight">SQUAD LIMIT REACHED</p>
                            </div>
                        ) : (
                            <div className="space-y-4 relative z-10 w-full">
                                <div className="p-4 sm:p-6 bg-white/10 border border-white/20 rounded-2xl relative group/code cursor-pointer overflow-hidden max-w-full" onClick={handleCopy}>
                                    <div className="absolute inset-0 bg-indigo-600 transform scale-x-0 group-hover/code:scale-x-100 origin-left transition-transform duration-500 opacity-20" />
                                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2 relative z-10">Secure Broadcast Key</p>
                                    <div className="flex items-center justify-between relative z-10 w-full overflow-hidden">
                                        <span className="text-2xl sm:text-3xl font-black font-mono text-white tracking-widest leading-none truncate">{team.teamCode}</span>
                                        {copied ? <Check className="w-6 h-6 text-green-400 shrink-0 ml-2" /> : <Copy className="w-6 h-6 text-indigo-500 group-hover/code:text-white transition-all shrink-0 ml-2" />}
                                    </div>
                                </div>
                                
                                <button 
                                  onClick={handleCopy}
                                  className="w-full h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center gap-3 font-bold uppercase text-xs tracking-widest shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition-all active:scale-[0.98] group"
                                >
                                    {copied ? "IDENTIFIER ARCHIVED" : <>Copy Invite Code <ArrowRight className="w-4 h-4 group-hover:translate-x-1" /></>}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Team Status Card */}
                    <div className="p-6 rounded-3xl bg-indigo-50/50 border border-indigo-100 group hover:border-indigo-600 transition-all duration-300">
                         <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-white rounded-xl border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-105 transition-transform duration-300">
                                <Trophy className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-black text-gray-900 text-lg uppercase tracking-tight leading-none mb-1">Squad Vitality</h4>
                                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Mission Readiness</p>
                            </div>
                         </div>
                         <div className="space-y-3">
                             <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm border border-transparent group-hover:border-indigo-100 transition-all">
                                 <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">REGISTRATION</span>
                                 <div className="flex items-center gap-2">
                                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_green]" />
                                      <span className="text-[10px] font-bold text-green-600 uppercase">COMMITTED</span>
                                 </div>
                             </div>
                             <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm border border-transparent group-hover:border-indigo-100 transition-all">
                                 <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">ELIGIBILITY</span>
                                 <span className={`text-[10px] font-bold uppercase ${members.length >= 2 ? 'text-indigo-600' : 'text-orange-600'}`}>
                                     {members.length >= 2 ? 'READY' : 'INCOMPLETE'}
                                 </span>
                             </div>
                         </div>
                    </div>
                </div>
            </div>
        ) : (
            <div className="max-w-md mx-auto py-20 text-center">
                 <div className="bg-indigo-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-indigo-100">
                      <Zap className="w-8 h-8 text-indigo-600 fill-indigo-600" />
                 </div>
                 <p className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-6">Unauthorized access.</p>
                 <Link href="/profile" className="inline-flex h-12 items-center justify-center gap-3 bg-gray-900 text-white px-8 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-black transition-all">
                    <ArrowLeft className="w-4 h-4" /> Return to Terminal
                 </Link>
            </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
