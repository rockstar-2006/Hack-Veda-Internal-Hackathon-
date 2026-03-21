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
  GraduationCap,
  Trophy,
  Loader2,
  AlertCircle,
  Zap,
  ArrowRight,
  ShieldAlert
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { updateUserProfile, getUserProfile, addTeammateByUSN, leaveTeam } from "@/lib/db";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserProfile } from "@/types";
import { Toast, ToastType } from "@/components/Toast";

export default function TeamPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { team, loading: teamLoading, refreshTeam } = useTeam();
  const [copied, setCopied] = useState(false);
  const [members, setMembers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteUSN, setInviteUSN] = useState("");
  const [inviting, setInviting] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: ToastType } | null>(null);

  useEffect(() => {
    if (!team || team.memberIds.length === 0) {
        setMembers([]);
        setLoading(false);
        return;
    }

    const validMemberIds = team.memberIds.filter(id => !!id);
    if (validMemberIds.length === 0) {
        setMembers([]);
        setLoading(false);
        return;
    }

    setLoading(true);
    console.log("SYNC: Listening for profiles of", validMemberIds);
    
    // Real-time listener for the team members' profiles
    const q = query(
        collection(db, "users"), 
        where("userId", "in", validMemberIds)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const profileMap = new Map();
        snapshot.docs.forEach(doc => {
            const data = doc.data() as UserProfile;
            if (data.userId) profileMap.set(data.userId, data);
        });
        
        // Match profiles back to IDs to maintain order and detect missing profiles
        const enrichedMembers = team.memberIds.map(id => {
            const profile = profileMap.get(id);
            if (profile) return profile;
            
            return {
                userId: id,
                full_name: "STUDENT JOINED",
                role: "student",
                usn: "PENDING PROFILE",
                branch: "..."
            } as UserProfile;
        });
        
        setMembers(enrichedMembers);
        setLoading(false);
    }, (err) => {
        console.error("Error listening for members:", err);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [team?.memberIds]);

  const handleCopy = () => {
    if (team?.teamCode) {
      navigator.clipboard.writeText(team.teamCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      setToast({ message: "TEAM CODE COPIED!", type: "success" });
    }
  };

  const handleAddTeammate = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!team || !inviteUSN.trim()) return;
      if (team.leaderId !== user?.uid) {
          setToast({ message: "ONLY LEADERS CAN ADD MEMBERS!", type: "error" });
          return;
      }
      if (members.length >= 4) {
          setToast({ message: "TEAM IS FULL!", type: "error" });
          return;
      }

      setInviting(true);
      try {
          await addTeammateByUSN(team.id!, inviteUSN);
          setToast({ message: `${inviteUSN} ADDED TO TEAM!`, type: "success" });
          setInviteUSN("");
          refreshTeam?.();
      } catch (err: any) {
          setToast({ message: err.message || "FAILED TO ADD MEMBER", type: "error" });
      } finally {
          setInviting(false);
      }
  };

  const handleLeaveTeam = async () => {
      if (!team || !user?.uid) return;
      if (confirm("Are you sure you want to leave this team? If you are the leader, the entire team will be deleted!")) {
          setLoading(true);
          try {
              await leaveTeam(team.id!, user.uid);
              setToast({ message: "SUCCESSFULLY LEFT TEAM!", type: "success" });
              setTimeout(() => {
                  router.push('/profile');
              }, 1000);
          } catch (err: any) {
              setToast({ message: err.message || "FAILED TO LEAVE TEAM", type: "error" });
              setLoading(false);
          }
      }
  };

  if (teamLoading || (team && loading)) return null;

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:py-20 min-h-screen pb-40 relative font-sans">
        
        {/* Header Section */}
        <section className="mb-12 flex flex-col items-center justify-center gap-6 text-center">
            <div className="flex-1 flex flex-col items-center">
                 <motion.div 
                   initial={{ x: -20, opacity: 0 }}
                   animate={{ x: 0, opacity: 1 }}
                   className="inline-flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-xl border-4 border-black shadow-[4px_4px_0_#000] mb-4"
                 >
                      <Zap className="w-5 h-5 fill-black" />
                      <span className="font-comic text-xl tracking-wider uppercase">Team Stats</span>
                 </motion.div>
                 <h1 className="text-6xl md:text-8xl lg:text-9xl font-comic text-black leading-none drop-shadow-[4px_4px_0_#ff007f] uppercase mb-4">
                    MY <br />
                    <span className="text-white drop-shadow-[4px_4px_0_#000]">
                        TEAM!
                    </span>
                 </h1>
                 <p className="text-sm md:text-base text-gray-800 font-bold max-w-xl bg-white p-4 border-4 border-black shadow-[4px_4px_0_#00f0ff] rounded-xl transform -rotate-1 center-text">
                    Manage your team. Invite members to join your group and innovate correctly!
                 </p>
            </div>
            
            {team && (
                <div className="bg-cyan-400 border-4 border-black p-6 rounded-2xl text-right shadow-[8px_8px_0_#000] relative overflow-hidden group w-full md:w-auto mt-6 md:mt-0 transform rotate-1 hover:rotate-0 transition-transform">
                    <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:rotate-12 transition-transform duration-500">
                        <Users className="w-16 h-16 text-black" />
                    </div>
                    <p className="text-xs font-bold text-black uppercase tracking-widest mb-1 relative z-10 bg-white inline-block px-2 py-1 border-2 border-black rounded-lg">Team Name</p>
                    <p className="text-4xl font-comic text-white drop-shadow-[2px_2px_0_#000] leading-none uppercase mt-2 relative z-10">{team.teamName}</p>
                    <div className="flex items-center justify-end gap-2 mt-4 relative z-10">
                         <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-black animate-pulse" />
                         <span className="text-xs font-bold uppercase tracking-widest text-black">Active Status</span>
                    </div>
                </div>
            )}
        </section>

        {team ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                
                {/* Team Members List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between bg-white p-4 border-4 border-black shadow-[4px_4px_0_#000] rounded-2xl">
                        <h3 className="text-xl font-comic text-black tracking-widest uppercase">Team Members ({team.memberIds?.length || 0}/4)</h3>
                        <Users className="w-6 h-6 stroke-[3]" />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                        {team.memberIds.map((memberId, index) => {
                            const member = members.find(m => m.userId === memberId);
                            // Fallback if profile not found yet in the state
                            const memberData = member || {
                                userId: memberId,
                                full_name: "STUDENT JOINED",
                                usn: "PROFILE PENDING",
                                role: "student" as any,
                                branch: "...",
                                year: "..."
                            };

                            const colors = ['bg-pink-400', 'bg-yellow-400', 'bg-cyan-400', 'bg-purple-400'];
                            const color = colors[index % colors.length];
                            
                            return (
                                <motion.div 
                                    key={memberId + "-" + index}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className={`p-6 rounded-3xl ${color} border-4 border-black shadow-[6px_6px_0_#000] hover:-translate-y-2 hover:shadow-[10px_10px_0_#000] transition-all group flex flex-col justify-between h-[180px] relative overflow-hidden`}
                                >
                                    {/* Halftone pattern */}
                                    <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '16px 16px' }} />

                                    <div className="flex items-center justify-between relative z-10 mb-4">
                                        <div className="w-14 h-14 bg-white border-4 border-black rounded-2xl flex items-center justify-center text-black shadow-[4px_4px_0_#000] group-hover:scale-110 transition-transform">
                                            <UserCheck className="w-8 h-8 stroke-[3]" />
                                        </div>
                                        {memberId === team.leaderId && (
                                            <div className="bg-black text-yellow-400 px-4 py-2 border-2 border-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-[2px_2px_0_#fff] rotate-3">Leader</div>
                                        )}
                                    </div>
                                    
                                    <div className="relative z-10 bg-white p-4 border-4 border-black rounded-xl shadow-[4px_4px_0_#000] w-full mt-auto">
                                         <h4 className="font-comic text-black text-2xl uppercase tracking-wider leading-none mb-3 truncate">{memberData.full_name || "INITIATING..."}</h4>
                                         
                                         <div className="space-y-2">
                                             <div className="flex items-center justify-between">
                                                  <div className="flex items-center gap-2">
                                                       <div className="w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-black animate-pulse" />
                                                       <p className="text-xs font-black text-gray-700 tracking-widest uppercase">{memberData.usn || "NOT SET"}</p>
                                                  </div>
                                                  <span className="text-[10px] font-black bg-black text-white px-2 py-0.5 rounded border border-white uppercase">{memberData.branch || "???"}</span>
                                             </div>
                                             
                                             <div className="flex items-center justify-between border-t border-gray-100 pt-2">
                                                  <div className="flex items-center gap-1.5 text-gray-500">
                                                       <GraduationCap className="w-3.5 h-3.5" />
                                                       <span className="text-[10px] font-bold uppercase">{memberData.year || "YEAR?"}</span>
                                                  </div>
                                                  {memberId !== team.leaderId && (
                                                       <span className="text-[10px] font-bold text-gray-400 uppercase italic">Active Team Member</span>
                                                  )}
                                             </div>
                                         </div>
                                    </div>
                                </motion.div>
                            );
                        })}

                        {/* Leave Action Card */}
                        <motion.div 
                            onClick={handleLeaveTeam}
                            className="p-6 rounded-3xl border-4 border-black bg-white flex flex-col justify-between h-[180px] group cursor-pointer hover:bg-red-400 transition-colors relative overflow-hidden shrink-0 shadow-[6px_6px_0_#000] hover:-translate-y-2 hover:shadow-[10px_10px_0_#000]"
                        >
                            <div className="w-14 h-14 bg-red-400 border-4 border-black rounded-2xl flex items-center justify-center text-black shadow-[4px_4px_0_#000] group-hover:bg-white transition-colors mb-4 relative z-10">
                                <ShieldOff className="w-8 h-8 stroke-[3]" />
                            </div>
                            <div className="relative z-10 bg-black p-4 rounded-xl text-white transform group-hover:rotate-1 transition-transform">
                                <h4 className="font-comic text-2xl uppercase tracking-wider leading-none mb-1">Leave Team</h4>
                                <p className="text-[10px] font-bold text-gray-300 tracking-widest uppercase">Remove yourself</p>
                            </div>
                        </motion.div>
                    </div>

                    {members.length < 2 && (
                         <div className="bg-red-400 border-4 border-black p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-6 text-black shadow-[8px_8px_0_#000] mt-8 transform -rotate-[0.5deg]">
                            <div className="bg-white p-4 border-4 border-black rounded-xl shadow-[4px_4px_0_#000] shrink-0 animate-bounce">
                                <ShieldAlert className="w-8 h-8 text-black stroke-[3]" />
                            </div>
                            <div className="text-center sm:text-left bg-white p-4 border-4 border-black rounded-xl">
                                <h4 className="font-comic text-2xl mb-2 tracking-wider uppercase text-black">INCOMPLETE TEAM</h4>
                                <p className="font-bold text-sm text-gray-800">HackVeda requires teams to have 2 to 4 members to participate. Your team is currently incomplete.</p>
                            </div>
                         </div>
                    )}
                </div>

                {/* Sidebar: Invite & Status */}
                <div className="space-y-8">
                    {/* Invite Section */}
                    {team.leaderId === user?.uid && (
                    <div className="p-6 md:p-8 rounded-3xl bg-pink-400 border-4 border-black shadow-[10px_10px_0_#000] relative overflow-hidden group transform rotate-1">
                        {/* Halftone Pattern */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '16px 16px' }} />
                        
                        <div className="flex items-center gap-4 mb-6 relative z-10">
                             <div className="bg-white p-4 border-4 border-black rounded-2xl shadow-[4px_4px_0_#000] transform -rotate-6">
                                 <UserPlus className="w-8 h-8 text-black stroke-[3]" />
                             </div>
                             <div className="bg-black text-white p-3 rounded-xl border-4 border-white shadow-[4px_4px_0_#00f0ff] transform rotate-2">
                                 <h3 className="text-2xl font-comic tracking-widest uppercase leading-none mb-1">ADD MEMBERS</h3>
                                 <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mt-1">GROWING THE TEAM</p>
                             </div>
                        </div>

                        {members.length >= 4 ? (
                            <div className="p-6 bg-white border-4 border-black rounded-2xl text-center relative z-10 shadow-[6px_6px_0_#000]">
                                <CheckCircle2 className="w-12 h-12 text-black stroke-[3] mx-auto mb-4" />
                                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2 bg-yellow-300 inline-block px-3 py-1 rounded-md border-2 border-black">Team Full</p>
                                <p className="text-2xl font-comic text-black uppercase tracking-widest drop-shadow-[2px_2px_0_#ff007f]">MAX LIMIT REACHED</p>
                            </div>
                        ) : (
                            <div className="space-y-6 relative z-10 w-full">
                                {/* Option 1: Add by USN (Direct) */}
                                {team.leaderId === user?.uid && (
                                    <form onSubmit={handleAddTeammate} className="bg-white p-6 border-4 border-black rounded-2xl shadow-[6px_6px_0_#000] space-y-4">
                                         <p className="text-xs font-black text-black uppercase tracking-widest bg-cyan-100 border-2 border-black inline-block px-2 py-1 rounded-lg">Add By Profile Code (USN)</p>
                                         <div className="flex flex-col gap-3">
                                            <input 
                                                type="text"
                                                value={inviteUSN}
                                                onChange={(e) => setInviteUSN(e.target.value.toUpperCase())}
                                                placeholder="ENTER USN (Ex: 4SO22CS001)"
                                                className="w-full h-12 px-4 border-4 border-black rounded-xl font-comic text-lg uppercase outline-none focus:bg-yellow-50 transition-all shadow-[4px_4px_0_#000]"
                                                required
                                            />
                                            <motion.button
                                                whileTap={{ scale: 0.95 }}
                                                type="submit"
                                                disabled={inviting}
                                                className="w-full h-12 bg-pink-400 border-4 border-black rounded-xl font-comic text-xl uppercase tracking-widest shadow-[4px_4px_0_#000] hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2"
                                            >
                                                {inviting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>ADD TO TEAM <UserPlus className="w-5 h-5 stroke-[3]" /></>}
                                            </motion.button>
                                         </div>
                                    </form>
                                )}

                                <div className="p-4 sm:p-6 bg-white border-4 border-black rounded-2xl shadow-[6px_6px_0_#000] relative group/code cursor-pointer overflow-hidden transform -rotate-1 hover:rotate-0 transition-transform" onClick={handleCopy}>
                                    <div className="absolute top-2 right-2 bg-cyan-400 text-black font-black text-[10px] px-2 py-1 rounded-lg border-2 border-black rotate-6 animate-pulse z-20 shadow-[2px_2px_0_#000]">CLICK TO COPY!</div>
                                    <p className="text-xs font-bold text-black uppercase tracking-widest mb-4 bg-yellow-300 border-2 border-black inline-block px-2 py-1 rounded-lg mt-2">Share Team Code</p>
                                    <div className="flex items-center justify-between w-full">
                                        <span className="text-3xl sm:text-4xl font-comic text-black tracking-widest leading-none drop-shadow-[2px_2px_0_#ff007f]">{team.teamCode}</span>
                                        {copied ? <Check className="w-8 h-8 text-black stroke-[4] shrink-0 ml-2 animate-bounce" /> : <Copy className="w-8 h-8 text-black group-hover/code:scale-110 stroke-[3] transition-all shrink-0 ml-2" />}
                                    </div>
                                </div>
                                
                                <div className="relative w-full">
                                  <div className="absolute -top-3 -right-2 bg-pink-500 text-white font-black text-[10px] px-2 py-1 rounded-lg border-2 border-black rotate-12 animate-bounce z-20 shadow-[2px_2px_0_#000]">CLICK HERE!</div>
                                  <motion.button 
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.95, y: 4, boxShadow: "0 0 0 #000" }}
                                  onClick={() => {
                                      const text = `Hey! Join my team on HackVeda. Use this team code: ${team.teamCode}`;
                                      if (navigator.share) {
                                          navigator.share({
                                              title: 'Join my HackVeda Team!',
                                              text: text,
                                              url: window.location.origin
                                          });
                                      } else {
                                          handleCopy();
                                      }
                                  }}
                                  className="w-full h-16 bg-yellow-400 text-black border-4 border-black rounded-2xl flex items-center justify-center gap-3 font-comic text-xl uppercase tracking-widest shadow-[8px_8px_0_#000] transition-all relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 opacity-10 pointer-events-none bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#000_10px,#000_20px)]" />
                                    <span className="relative z-10 flex items-center gap-3">
                                      {copied ? "COPIED!" : <>SHARE TEAM CODE <Zap className="w-6 h-6 stroke-[3] fill-black" /></>}
                                    </span>
                                  </motion.button>
                                </div>
                                <p className="text-[10px] font-black text-black/50 uppercase tracking-widest text-center mt-4">
                                     Teammates must enter this code on their dashboard to join!
                                </p>
                            </div>
                        )}
                    </div>
                    )}

                    {/* Team Status Card */}
                    <div className="p-6 md:p-8 rounded-3xl bg-cyan-400 border-4 border-black shadow-[10px_10px_0_#000] transform -rotate-1 relative overflow-hidden">
                         <div className="flex items-center gap-4 mb-6 relative z-10">
                            <div className="w-14 h-14 bg-white border-4 border-black rounded-2xl flex items-center justify-center text-black shadow-[4px_4px_0_#000] transform rotate-6">
                                <Trophy className="w-8 h-8 stroke-[3]" />
                            </div>
                            <div className="bg-black text-white p-3 rounded-xl border-4 border-white shadow-[4px_4px_0_#ff007f] transform -rotate-2">
                                <h4 className="font-comic text-2xl uppercase tracking-widest leading-none mb-1">TEAM STATUS</h4>
                                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">READY TO GO</p>
                            </div>
                         </div>
                         <div className="space-y-4 relative z-10 relative">
                             <div className="flex justify-between items-center p-4 bg-white border-4 border-black rounded-xl shadow-[6px_6px_0_#000]">
                                 <span className="text-xs font-bold text-black uppercase tracking-widest">REGISTRATION</span>
                                 <div className="flex items-center gap-2 bg-green-400 px-3 py-1 border-2 border-black rounded-lg shadow-[2px_2px_0_#000]">
                                      <div className="w-2.5 h-2.5 rounded-full bg-white border-2 border-black animate-pulse" />
                                      <span className="text-[10px] font-bold text-black uppercase tracking-widest">COMMITTED</span>
                                 </div>
                             </div>
                             <div className="flex justify-between items-center p-4 bg-white border-4 border-black rounded-xl shadow-[6px_6px_0_#000]">
                                 <span className="text-xs font-bold text-black uppercase tracking-widest">ELIGIBILITY</span>
                                 <div className={`flex items-center gap-2 px-3 py-1 border-2 border-black rounded-lg shadow-[2px_2px_0_#000] ${members.length >= 2 ? 'bg-indigo-400' : 'bg-red-400'}`}>
                                     <span className={`text-[10px] font-bold uppercase text-white tracking-widest`}>
                                         {members.length >= 2 ? 'READY TO DEPLOY' : 'INCOMPLETE TEAM'}
                                     </span>
                                 </div>
                             </div>
                         </div>
                    </div>
                </div>
            </div>
        ) : (
            <div className="max-w-md mx-auto py-20 text-center relative z-10">
                 <div className="bg-red-400 w-24 h-24 border-4 border-black rounded-full shadow-[8px_8px_0_#000] flex items-center justify-center mx-auto mb-8 animate-bounce">
                      <Zap className="w-12 h-12 text-black fill-black" />
                 </div>
                 <p className="text-4xl font-comic text-black uppercase tracking-widest mb-8 drop-shadow-[2px_2px_0_#fff]">UNAUTHORIZED ACCESS!</p>
                 <Link href="/profile" className="inline-flex h-16 items-center justify-center gap-3 bg-black text-white px-8 rounded-2xl border-4 border-black shadow-[8px_8px_0_#00f0ff] font-comic text-xl uppercase tracking-widest hover:-translate-y-1 hover:shadow-[12px_12px_0_#00f0ff] active:translate-y-2 active:shadow-none transition-all">
                    <ArrowLeft className="w-6 h-6 stroke-[3]" /> RETURN TO TERMINAL
                 </Link>
            </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
