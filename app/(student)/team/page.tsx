"use client";

import { useTeam } from "@/hooks/useTeam";
import { useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { 
  Users, 
  Copy, 
  Check, 
  ShieldCheck, 
  UserCheck, 
  ShieldOff,
  CheckCircle2,
  UserPlus,
  Trophy,
  Loader2,
  Zap,
  ArrowLeft,
  ShieldAlert
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { getUserProfile, addTeammateByUSN, leaveTeam } from "@/lib/db";
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

    const fetchOrderlyMembers = async () => {
        setLoading(true);
        try {
            const profilePromises = team.memberIds.map(id => getUserProfile(id));
            const profiles = await Promise.all(profilePromises);
            
            const enriched = team.memberIds.map((id, index) => {
                const teamSnippet = team.memberProfiles?.find(p => p.userId === id);
                const fetchedProfile = profiles[index];
                
                return {
                    userId: id,
                    full_name: fetchedProfile?.full_name || teamSnippet?.full_name || (id === user?.uid ? (user.displayName || "YOU") : "STUDENT JOINED"),
                    usn: fetchedProfile?.usn || teamSnippet?.usn || (id === user?.uid ? "..." : "PROFILE PENDING"),
                    branch: fetchedProfile?.branch || teamSnippet?.branch || "...",
                    year: fetchedProfile?.year || teamSnippet?.year || "...",
                    role: "student" as any
                } as UserProfile;
            });
            
            setMembers(enriched);
        } catch (err) {
            console.error("Fetch members error:", err);
        } finally {
            setLoading(false);
        }
    };

    fetchOrderlyMembers();
  }, [team?.memberIds, team?.id, user]);

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
        <section className="mb-12 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-center lg:text-left">
                 <motion.div 
                   initial={{ x: -20, opacity: 0 }}
                   animate={{ x: 0, opacity: 1 }}
                   className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl border-4 border-black mb-4 shadow-[4px_4px_0_#ff007f]"
                 >
                      <Zap className="w-5 h-5 text-yellow-400" />
                      <span className="font-comic text-xl tracking-wider uppercase">Team Hub</span>
                 </motion.div>
                 <h1 className="text-6xl md:text-8xl font-comic text-black leading-none drop-shadow-[4px_4px_0_#ff007f] uppercase mb-4">
                    MY TEAM
                 </h1>
                 <p className="text-gray-600 font-bold max-w-xl uppercase text-xs tracking-[0.2em] leading-relaxed">
                    Collaboration is the key to innovation. Manage your roster and prepare for the hackathon deployment.
                 </p>
            </div>
            
            {team && (
                <div className="bg-white border-4 border-black p-6 rounded-[32px] shadow-[8px_8px_0_#000] min-w-[300px]">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Assigned Unit</p>
                    <p className="text-4xl font-comic text-black leading-none uppercase">{team.teamName}</p>
                    <div className="flex items-center gap-2 mt-4">
                         <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-black animate-pulse" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-black/60">Deployment Active</span>
                    </div>
                </div>
            )}
        </section>

        {team ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                
                {/* Team Members List (Terminal Style) */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white border-4 border-black shadow-[8px_8px_0_#000] rounded-[32px] overflow-hidden">
                        <div className="bg-black p-5 flex items-center justify-between text-white border-b-4 border-black">
                            <div className="flex items-center gap-3">
                                <Users className="w-6 h-6 text-yellow-400" />
                                <h3 className="font-comic uppercase tracking-widest text-xl">Team Roster</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="bg-green-500 w-2.5 h-2.5 rounded-full animate-pulse border border-white" />
                                <span className="text-[10px] font-black uppercase tracking-tighter opacity-80">Live Synced</span>
                            </div>
                        </div>

                        <div className="divide-y-4 divide-black bg-[#f8f9fa]">
                            {team.memberIds.map((memberId, index) => {
                                const member = members.find(m => m.userId === memberId);
                                const isLeader = memberId === team.leaderId;
                                const isYou = memberId === user?.uid;
                                
                                const name = member?.full_name || (isYou ? (user?.displayName || "YOU") : "STUDENT JOINED");
                                const usn = member?.usn || (isYou ? "YOUR PROFILE" : "VERIFYING...");
                                
                                return (
                                    <motion.div 
                                        key={memberId + "-" + index}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 group transition-colors ${isYou ? 'bg-cyan-50' : 'hover:bg-white'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-14 h-14 rounded-2xl border-4 border-black flex items-center justify-center shadow-[4px_4px_0_#000] ${isLeader ? 'bg-yellow-400' : 'bg-white'}`}>
                                                {isLeader ? <ShieldCheck className="w-8 h-8" /> : <UserCheck className="w-8 h-8" />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-comic text-2xl text-black leading-none uppercase">{name}</h4>
                                                    {isYou && <span className="text-[10px] bg-black text-white px-2 py-1 rounded font-black uppercase">YOU</span>}
                                                </div>
                                                <p className="text-xs font-black text-gray-400 mt-2 uppercase tracking-widest">{usn}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                             <div className="hidden md:flex flex-col items-end">
                                                  <span className="text-[10px] font-black text-gray-300 uppercase mb-1">Classification</span>
                                                  <span className="text-xs font-black text-black uppercase tracking-wider">{member?.branch || member?.year || "ENGINEERING"}</span>
                                             </div>
                                             <div className={`px-6 py-3 rounded-2xl border-4 border-black font-black text-sm uppercase shadow-[4px_4px_0_#000] ${isLeader ? 'bg-black text-yellow-400' : 'bg-white text-black'}`}>
                                                 {isLeader ? "Lead" : "Member"}
                                             </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Team Rules or Status */}
                    {(team?.memberIds?.length || 0) < 2 && (
                         <div className="bg-red-500 border-4 border-black p-8 rounded-[32px] flex flex-col md:flex-row items-center gap-8 text-white shadow-[10px_10px_0_#000] mt-10">
                            <div className="bg-white p-5 border-4 border-black rounded-2xl shadow-[6px_6px_0_#000]">
                                <ShieldAlert className="w-12 h-12 text-red-600" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-comic text-3xl mb-2 tracking-wider uppercase">INCOMPLETE TEAM</h4>
                                <p className="font-bold text-sm uppercase tracking-widest leading-relaxed opacity-90">HackVeda requires teams to have 2 to 4 members to participate. Your team is currently below the threshold.</p>
                            </div>
                         </div>
                    )}
                </div>

                {/* Sidebar Controls */}
                <div className="space-y-10">
                    {/* Invite/Add Section */}
                    {team?.leaderId === user?.uid && (
                      <div className="bg-white border-4 border-black p-8 rounded-[32px] shadow-[10px_10px_0_#000] space-y-8">
                         <div className="flex items-center gap-4">
                              <div className="bg-black text-white p-4 rounded-2xl border-4 border-black">
                                   <UserPlus className="w-8 h-8" />
                              </div>
                              <h3 className="text-2xl font-comic uppercase tracking-widest">Add Teammate</h3>
                         </div>

                         {team?.memberIds?.length < 4 ? (
                             <form onSubmit={handleAddTeammate} className="space-y-4">
                                  <input 
                                      type="text"
                                      value={inviteUSN}
                                      onChange={(e) => setInviteUSN(e.target.value.toUpperCase())}
                                      placeholder="ENTER USN (Ex: 4SO22...)"
                                      className="w-full h-16 px-6 border-4 border-black rounded-2xl font-comic text-xl uppercase outline-none focus:bg-yellow-50 shadow-[4px_4px_0_#000]"
                                      required
                                  />
                                  <motion.button
                                      whileTap={{ scale: 0.95 }}
                                      type="submit"
                                      disabled={inviting}
                                      className="w-full h-16 bg-cyan-400 border-4 border-black rounded-2xl font-comic text-2xl uppercase tracking-widest shadow-[6px_6px_0_#000] hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2"
                                  >
                                      {inviting ? <Loader2 className="w-6 h-6 animate-spin" /> : "ADD MEMBER"}
                                  </motion.button>
                             </form>
                         ) : (
                             <div className="p-6 bg-red-50 border-4 border-black rounded-2xl text-center">
                                 <CheckCircle2 className="w-10 h-10 text-black mx-auto mb-2" />
                                 <p className="font-black text-xs uppercase tracking-widest">TEAM CAPACITY REACHED</p>
                             </div>
                         )}

                         <div className="pt-6 border-t-4 border-black space-y-4">
                              <p className="text-[10px] font-black text-black/40 uppercase tracking-widest">Or Share Invitation Code</p>
                              <div 
                                onClick={handleCopy}
                                className="group cursor-pointer p-6 bg-yellow-400 border-4 border-black rounded-2xl shadow-[6px_6px_0_#000] flex items-center justify-between hover:translate-y-1 hover:shadow-none transition-all"
                              >
                                  <span className="text-4xl font-comic uppercase">{team?.teamCode}</span>
                                  {copied ? <Check className="w-8 h-8" /> : <Copy className="w-8 h-8 group-hover:scale-110 transition-transform" />}
                              </div>
                         </div>
                      </div>
                    )}

                    {/* Actions Card */}
                    <div className="bg-white border-4 border-black p-8 rounded-[32px] shadow-[10px_10px_0_#000] space-y-6">
                        <div className="flex items-center gap-4 mb-4">
                            <Trophy className="w-8 h-8 text-black" />
                            <h3 className="text-2xl font-comic uppercase tracking-widest">Team Stats</h3>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                             <div className="bg-[#f8f9fa] border-4 border-black p-4 rounded-2xl text-center">
                                 <p className="text-[10px] font-black text-black/30 uppercase mb-1">Status</p>
                                 <p className="text-xs font-black text-black uppercase">{(team?.memberIds?.length || 0) >= 2 ? "Ready" : "Incomplete"}</p>
                             </div>
                             <div className="bg-[#f8f9fa] border-4 border-black p-4 rounded-2xl text-center">
                                 <p className="text-[10px] font-black text-black/30 uppercase mb-1">Members</p>
                                 <p className="text-xs font-black text-black uppercase">{team?.memberIds?.length || 0}/4</p>
                             </div>
                        </div>

                        <motion.button 
                            whileTap={{ scale: 0.95 }}
                            onClick={handleLeaveTeam}
                            className="w-full h-14 bg-white hover:bg-red-400 border-4 border-black rounded-2xl flex items-center justify-center gap-3 font-comic text-xl uppercase tracking-widest shadow-[6px_6px_0_#000] transition-colors mt-6"
                        >
                            <ShieldOff className="w-6 h-6" /> Leave Team
                        </motion.button>
                    </div>
                </div>
            </div>
        ) : (
            <div className="max-w-md mx-auto py-20 text-center">
                 <p className="text-3xl font-comic uppercase text-black mb-8">NO TEAM DETECTED</p>
                 <Link href="/profile" className="inline-flex h-16 items-center justify-center px-10 bg-black text-white rounded-2xl border-4 border-black shadow-[8px_8px_0_#ff007f] font-comic text-xl uppercase tracking-widest transition-all">
                    Back to Profile
                 </Link>
            </div>
        )}

        <AnimatePresence>
          {toast && (
            <Toast 
              message={toast.message} 
              type={toast.type} 
              onClose={() => setToast(null)} 
            />
          )}
        </AnimatePresence>
      </div>
    </ProtectedRoute>
  );
}
