"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useTeam } from "@/hooks/useTeam";
import { createTeam, joinTeam, getUserProfile, updateUserProfile, getAnnouncements, updateTeamName } from "@/lib/db";
import { Team, UserProfile, Announcement } from "@/types";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { 
  Trophy, 
  Users, 
  Plus, 
  ShieldCheck, 
  Mail, 
  ArrowRight, 
  UserPlus, 
  Key, 
  Copy,
  Info, 
  Calendar, 
  MessageSquare, 
  Clock, 
  FileCheck, 
  Edit, 
  Save, 
  Trash2, 
  GraduationCap,
  Loader2,
  Zap,
  Bell,
  Settings,
  ChevronRight,
  Phone,
  ChevronDown,
  X
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Countdown } from "@/components/Countdown";
import { Toast, ToastType } from "@/components/Toast";

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { team, loading: teamLoading } = useTeam();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  
  // Setup Form States
  const [fullName, setFullName] = useState("");
  const [usn, setUsn] = useState("");
  const [branch, setBranch] = useState("CSE");
  const [year, setYear] = useState("1st Year");
  const [phone, setPhone] = useState("");

  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamCode, setTeamCode] = useState("");
  const [error, setError] = useState("");
  const [currentTeamName, setCurrentTeamName] = useState("");
  const isMountedRef = useRef(true);
  const requestInProgressRef = useRef(false);

  const fetchData = async () => {
    if (!user || !isMountedRef.current) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const [profileData, annData] = await Promise.all([
          getUserProfile(user.uid),
          getAnnouncements()
      ]);
      
      if (!isMountedRef.current) return;
      
      if (annData) setAnnouncements(annData);
      if (profileData) {
          setProfile(profileData);
          setFullName(profileData.full_name || "");
          setUsn(profileData.usn || "");
          setBranch(profileData.branch || "CSE");
          setYear(profileData.year || "3rd Year");
          setPhone(profileData.phone || "");
          if (!profileData.full_name) setShowSetup(true);
      } else {
          setShowSetup(true);
      }
    } catch (err: any) {
      if (isMountedRef.current) {
        console.error("Error fetching data:", err);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    fetchData();
    return () => {
      isMountedRef.current = false;
    };
  }, [user]);

  useEffect(() => {
    if (team) {
       setCurrentTeamName(team.teamName);
    }
  }, [team]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user) return;
      setProfileSaving(true);
      setError("");
      try {
          const promises: Promise<any>[] = [
              updateUserProfile(user.uid, {
                  full_name: fullName,
                  usn: usn,
                  branch: branch,
                  year: year,
                  phone: phone,
                  email: user.email
              })
          ];

          if (team && team.leaderId === user.uid && currentTeamName !== team.teamName) {
              promises.push(updateTeamName(team.id!, currentTeamName));
          }

          await Promise.all(promises);

          setProfile({ userId: user.uid, email: user.email, role: "student", full_name: fullName, usn, branch, year, phone });
          setShowSetup(false);
      } catch (err: any) {
          setError("Failed to update settings. " + err.message);
      } finally {
          setProfileSaving(false);
      }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: ToastType } | null>(null);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim() || isSubmitting || requestInProgressRef.current) return;
    
    requestInProgressRef.current = true;
    setError("");
    setIsSubmitting(true);
    try {
      await createTeam(user!.uid, teamName);
      if (isMountedRef.current) {
        setIsCreating(false);
        setToast({ message: "TEAM CREATED SUCCESSFULLY!", type: "success" });
      }
    } catch (err: any) {
        if (isMountedRef.current) {
          setError(err.message || "Something went wrong. Try again.");
        }
    } finally {
        if (isMountedRef.current) {
          setIsSubmitting(false);
        }
        requestInProgressRef.current = false;
    }
  };

  const handleJoinTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamCode.trim() || isSubmitting || requestInProgressRef.current) return;
    
    requestInProgressRef.current = true;
    setError("");
    setIsSubmitting(true);
    try {
      await joinTeam(teamCode, user!.uid);
      if (isMountedRef.current) {
        setIsJoining(false);
        setToast({ message: "JOINED TEAM SUCCESSFULLY!", type: "success" });
      }
    } catch (err: any) {
        if (isMountedRef.current) {
          setError(err.message || "Could not join team. Check the code.");
        }
    } finally {
        if (isMountedRef.current) {
          setIsSubmitting(false);
        }
        requestInProgressRef.current = false;
    }
  };
  
  if (loading || teamLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
          <div className="relative">
              <div className="w-24 h-24 border-8 border-black border-t-pink-500 rounded-full animate-spin shadow-[8px_8px_0_#000]" />
              <Zap className="absolute inset-0 m-auto w-10 h-10 text-black fill-yellow-400 animate-pulse" />
          </div>
          <p className="font-comic text-2xl tracking-[0.2em] text-black uppercase animate-bounce">Awakening Terminal...</p>
      </div>
    );
  }

  if (showSetup) {
      return (
          <ProtectedRoute>
              <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 lg:py-20 min-h-screen font-sans">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="p-6 md:p-10 rounded-3xl bg-pink-400 border-4 border-black shadow-[10px_10px_0px_#000] relative overflow-hidden"
                  >
                        {/* Halftone / Line Pattern Background (Simulated via CSS) */}
                        <div 
                            className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
                            style={{ 
                            backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', 
                            backgroundSize: '24px 24px' 
                            }} 
                        />
                        
                         <div className="flex items-center justify-between mb-8 relative z-10">
                              <div className="flex items-center gap-4">
                                   <div className="bg-yellow-300 p-3 rounded-xl border-4 border-black shadow-[4px_4px_0_#000]">
                                       <Settings className="w-8 h-8 text-black animate-spin-slow" />
                                   </div>
                                   <h2 className="text-4xl md:text-5xl font-comic text-white drop-shadow-[2px_2px_0_#000] tracking-wider uppercase">UPDATE PROFILE!</h2>
                              </div>
                              <button 
                                type="button"
                                onClick={() => setShowSetup(false)}
                                className="flex items-center gap-2 px-4 py-2 md:py-3 bg-red-400 border-4 border-black rounded-2xl shadow-[4px_4px_0_#000] hover:bg-red-500 text-black transition-all transform hover:-translate-y-1 hover:shadow-[6px_6px_0_#000]"
                              >
                                  <span className="font-comic text-xl tracking-widest uppercase">CLOSE</span>
                                  <X className="w-6 h-6 stroke-[4]" />
                              </button>
                         </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-500 text-white border-4 border-black rounded-xl font-bold shadow-[4px_4px_0_#000] relative z-10">
                                {error}
                            </div>
                        )}
                        
                        <form onSubmit={handleProfileUpdate} className="space-y-6 relative z-10 bg-white p-6 md:p-8 rounded-2xl border-4 border-black shadow-[6px_6px_0px_#000]">
                             {team && team.leaderId === user?.uid && (
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-black uppercase tracking-widest pl-2 block">Team Name</label>
                                    <input 
                                        type="text" 
                                        value={currentTeamName}
                                        onChange={(e) => setCurrentTeamName(e.target.value)}
                                        placeholder="Team Name"
                                        className="w-full h-14 px-4 rounded-xl bg-yellow-100 border-4 border-black focus:bg-yellow-300 outline-none transition-all font-bold text-sm shadow-[4px_4px_0_#000] focus:translate-y-1 focus:shadow-[0_0_0_#000]"
                                        required
                                    />
                                </div>
                             )}
                             <div className="space-y-2">
                                 <label className="text-xs font-bold text-black uppercase tracking-widest pl-2 block">Full Name</label>
                                 <input 
                                   type="text" 
                                   value={fullName}
                                   onChange={(e) => setFullName(e.target.value)}
                                   placeholder="Your Full Name"
                                   className="w-full h-14 px-4 rounded-xl bg-gray-50 border-4 border-black focus:bg-white outline-none transition-all font-bold text-sm shadow-[4px_4px_0_#000] focus:translate-y-1 focus:shadow-[0_0_0_#000]"
                                   required
                                 />
                             </div>
                             
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-black uppercase tracking-widest pl-2 block">USN</label>
                                    <input 
                                      type="text" 
                                      value={usn}
                                      onChange={(e) => setUsn(e.target.value)}
                                      placeholder="Ex: 4SO23CS..."
                                      className="w-full h-14 px-4 rounded-xl bg-gray-50 border-4 border-black focus:bg-white outline-none transition-all font-bold text-sm shadow-[4px_4px_0_#000] focus:translate-y-1 focus:shadow-[0_0_0_#000]"
                                      required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-black uppercase tracking-widest pl-2 block">Branch</label>
                                    <div className="relative">
                                        <select 
                                          value={branch}
                                          onChange={(e) => setBranch(e.target.value)}
                                          className="w-full h-14 pl-4 pr-10 rounded-xl bg-cyan-100 border-4 border-black focus:bg-cyan-200 outline-none transition-all font-bold text-sm appearance-none cursor-pointer shadow-[4px_4px_0_#000] focus:translate-y-1 focus:shadow-[0_0_0_#000]"
                                          required
                                        >
                                            <option value="CSE">CSE</option>
                                            <option value="ISE">ISE</option>
                                            <option value="AIML">AIML</option>
                                            <option value="AI-DS">AI-DS</option>
                                            <option value="ECE">ECE</option>
                                            <option value="EEE">EEE</option>
                                            <option value="ME">ME</option>
                                            <option value="CV">CV</option>
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" />
                                    </div>
                                </div>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-black uppercase tracking-widest pl-2 block">Phone Number</label>
                                    <div className="relative">
                                        <input 
                                          type="tel" 
                                          value={phone}
                                          onChange={(e) => setPhone(e.target.value)}
                                          placeholder="Ex: 9876543210"
                                          className="w-full h-14 pl-12 pr-4 rounded-xl bg-gray-50 border-4 border-black focus:bg-white outline-none transition-all font-bold text-sm shadow-[4px_4px_0_#000] focus:translate-y-1 focus:shadow-[0_0_0_#000]"
                                          required
                                        />
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-black uppercase tracking-widest pl-2 block">Year of Study</label>
                                    <select 
                                         value={year}
                                         onChange={(e) => setYear(e.target.value)}
                                         className="w-full h-14 px-4 rounded-xl bg-purple-100 border-4 border-black focus:bg-purple-200 outline-none transition-all font-bold text-sm appearance-none cursor-pointer shadow-[4px_4px_0_#000] focus:translate-y-1 focus:shadow-[0_0_0_#000]"
                                         required
                                       >
                                           <option value="1st Year">1st Year</option>
                                           <option value="2nd Year">2nd Year</option>
                                           <option value="3rd Year">3rd Year</option>
                                           <option value="Final Year">Final Year</option>
                                       </select>
                                </div>
                             </div>

                             <motion.button 
                               whileHover={{ scale: 1.02 }}
                               whileTap={{ scale: 0.95, y: 4, boxShadow: "0_0_0_#000" }}
                               type="submit" 
                               disabled={profileSaving}
                               className="w-full h-14 rounded-xl bg-yellow-400 text-black border-4 border-black flex items-center justify-center gap-2 text-lg font-comic tracking-widest uppercase mt-6 shadow-[6px_6px_0px_#000] transition-all disabled:opacity-50"
                             >
                                 {profileSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : "Save Profile & Finish!"}
                             </motion.button>
                             
                             {profile?.full_name ? (
                                 <button 
                                   type="button"
                                   onClick={() => setShowSetup(false)}
                                   className="w-full h-10 mt-2 rounded-lg text-gray-400 font-bold uppercase text-[10px] tracking-widest hover:text-black transition-colors"
                                 >
                                     DISCARD CHANGES
                                 </button>
                             ) : (
                                 <div className="w-full text-center mt-6 p-4 bg-black/5 rounded-xl border-2 border-dashed border-black/20">
                                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] leading-relaxed">
                                         You must complete your profile to access the Hackathon Terminal.
                                     </p>
                                 </div>
                             )}
                        </form>
                  </motion.div>
              </div>
          </ProtectedRoute>
      );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 min-h-screen font-sans">
        
        {/* Floating Profile Settings Button */}
        <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-[1000] pointer-events-auto">
             <motion.button 
               whileHover={{ scale: 1.1, rotate: 180 }}
               whileTap={{ scale: 0.9, rotate: -45 }}
               onClick={() => {
                   console.log("Settings clicked!");
                   setShowSetup(true);
               }}
               className="group p-4 bg-cyan-100 border-4 border-black text-black rounded-3xl shadow-[6px_6px_0_#000] hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all flex items-center justify-center relative active:translate-y-1 active:shadow-none"
             >
                 <Settings className="w-8 h-8 md:w-10 md:h-10 group-active:animate-spin" />
                 <div className="absolute -top-12 right-0 bg-black text-white text-[10px] font-black px-3 py-1.5 rounded-lg border-2 border-white opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap shadow-[4px_4px_0_#000]">
                      SETUP PROFILE (CLICK!)
                 </div>
             </motion.button>
        </div>

        {/* Header Section */}
        <section className="mb-12 md:mb-16 flex flex-col items-center justify-center gap-8 lg:gap-12 text-center w-full">
            <div className="flex-1 space-y-4 md:space-y-6 flex flex-col items-center">
                 <motion.div 
                   initial={{ x: -50, opacity: 0 }}
                   animate={{ x: 0, opacity: 1 }}
                   transition={{ type: "spring", bounce: 0.6 }}
                   className="inline-flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-xl border-4 border-black shadow-[4px_4px_0_#000]"
                 >
                      <Zap className="w-5 h-5 fill-black" />
                      <span className="font-comic text-xl tracking-wider">MY PROFILE DASHBOARD</span>
                 </motion.div>
                 
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-comic text-black leading-none drop-shadow-[4px_4px_0_#ff007f] uppercase">
                    HELLO, <br />
                    <span className="text-white drop-shadow-[4px_4px_0_#000]">
                        {profile?.full_name?.split(" ")[0] || "STUDENT"}!
                    </span>
                  </h1>
                 
                  <div className="flex flex-wrap items-center justify-center gap-4">
                       <motion.div whileHover={{ y: -4 }} className="px-5 py-3 bg-purple-400 border-4 border-black text-black font-bold uppercase tracking-wider text-xs md:text-sm rounded-xl shadow-[4px_4px_0_#000] flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            {team?.teamName || "READY TO JOIN?"}
                       </motion.div>
                       
                       {profile?.usn && (
                           <motion.div 
                             initial={{ opacity: 0, scale: 0.8 }}
                             animate={{ opacity: 1, scale: 1 }}
                             className="flex flex-col gap-2"
                           >
                                <motion.div 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center gap-3 bg-white border-4 border-black p-2 pr-6 rounded-2xl shadow-[6px_6px_0_#000] group cursor-pointer relative overflow-hidden"
                                    onClick={() => {
                                        if (profile?.usn) {
                                            navigator.clipboard.writeText(profile.usn);
                                            alert("PROFILE CODE COPIED!");
                                        }
                                    }}
                                >
                                    <div className="absolute inset-0 bg-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="bg-cyan-400 p-3 rounded-xl border-4 border-black shadow-[3px_3px_0_#000] relative z-10">
                                         <Key className="w-5 h-5 text-black" />
                                    </div>
                                    <div className="flex flex-col relative z-10">
                                         <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">YOUR PROFILE CODE (USN)</span>
                                         <span className="text-xl font-comic text-black uppercase tracking-widest">{profile.usn}</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1 ml-4 border-l-2 border-gray-100 pl-4 relative z-10">
                                         <Copy className="w-5 h-5 text-gray-400 group-hover:text-black group-hover:scale-110 transition-all" />
                                         <span className="text-[8px] font-black text-gray-400 group-hover:text-black uppercase">COPY!</span>
                                    </div>
                                </motion.div>
                                <p className="text-[10px] font-black text-pink-500 uppercase tracking-[0.2em] px-2 animate-pulse">
                                    Send this code to your Leader to get added! 🚀
                                </p>
                           </motion.div>
                       )}
                  </div>

                 {/* Team Code & Action Buttons */}
                 <div className="flex flex-col items-center lg:items-start gap-6 mt-8">
                     {team ? (
                         <motion.div 
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           className="inline-flex items-center gap-4 bg-black p-4 rounded-2xl border-4 border-black shadow-[6px_6px_0_#ff007f]"
                         >
                              <div className="flex flex-col text-left">
                                   <span className="text-[10px] font-black text-pink-400 uppercase tracking-widest">YOUR TEAM CODE</span>
                                   <span className="text-2xl font-comic text-white tracking-[0.2em] leading-none mt-1">{team.teamCode || "------"}</span>
                              </div>
                              <button 
                                onClick={() => {
                                   navigator.clipboard.writeText(team.teamCode || "");
                                   alert("TEAM CODE COPIED! GIVE THIS TO YOUR FRIENDS TO INVITE THEM!");
                                }}
                                className="p-3 bg-yellow-400 border-2 border-black rounded-xl hover:scale-110 active:scale-95 transition-all shadow-[2px_2px_0_#000]"
                                title="Copy Team Code"
                              >
                                   <Key className="w-5 h-5 text-black stroke-[3]" />
                               </button>
                         </motion.div>
                     ) : (
                         <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                              <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsCreating(true)}
                                className="px-6 py-4 bg-pink-400 border-4 border-black text-black font-comic text-xl uppercase tracking-widest rounded-2xl shadow-[6px_6px_0_#000] flex items-center gap-2 transition-all"
                              >
                                   <Plus className="w-6 h-6 stroke-[3]" /> CREATE TEAM!
                              </motion.button>
                              <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsJoining(true)}
                                className="px-6 py-4 bg-cyan-400 border-4 border-black text-black font-comic text-xl uppercase tracking-widest rounded-2xl shadow-[6px_6px_0_#000] flex items-center gap-2 transition-all"
                              >
                                   <UserPlus className="w-6 h-6 stroke-[3]" /> JOIN TEAM
                              </motion.button>
                         </div>
                     )}
                 </div>
            </div>

            {/* Countdown Component */}
            <motion.div 
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="p-1 rounded-3xl bg-black shadow-[8px_8px_0_#ff007f] w-full lg:w-fit transform hover:-rotate-1 transition-transform"
            >
                <div className="bg-white p-6 md:p-8 rounded-[22px]">
                   <Countdown targetDate="2026-04-10T10:00:00" label="HACKATHON STARTING IN" />
                </div>
            </motion.div>
        </section>



        {/* Global Action Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16">
            {[
                { label: 'TEAM', desc: 'Member Info', href: '/team', icon: Users, color: 'bg-yellow-400' },
                { label: 'SUBMIT', desc: 'Upload PDF', href: '/submission', icon: FileCheck, color: 'bg-cyan-400' },
                { label: 'SCHEDULE', desc: 'Full Program', href: '/schedule', icon: Calendar, color: 'bg-pink-400' },
                { label: 'PRIZES', desc: 'Winning Gifts', href: '/prizes', icon: Trophy, color: 'bg-purple-400' }
            ].map((box, i) => (
                <motion.div
                    key={i} 
                    onClick={() => router.push(box.href)}
                    className="group cursor-pointer p-6 md:p-8 rounded-3xl border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] flex flex-col justify-between min-h-[180px] md:min-h-[200px] bg-white relative overflow-hidden transition-colors duration-200 hover:bg-black"
                    whileHover={{ 
                        scale: 1.05, 
                        rotate: i % 2 === 0 ? 1 : -1
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ 
                        x: { repeat: Infinity, duration: 0.1 },
                        y: { repeat: Infinity, duration: 0.1 },
                        scale: { type: "spring", stiffness: 400, damping: 10 }
                    }}
                >
                        <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl border-4 border-black flex items-center justify-center mb-4 transition-all duration-300 shadow-[4px_4px_0_#000] ${box.color}`}>
                            <box.icon className="w-8 h-8 md:w-10 md:h-10 text-black stroke-[2.5]" />
                        </div>
                        <div className="relative z-10">
                            <h4 className="text-2xl md:text-3xl font-comic tracking-widest uppercase mb-1 text-black group-hover:text-white transition-colors">{box.label}</h4>
                            <p className="text-xs md:text-sm font-bold text-gray-700 uppercase tracking-widest group-hover:text-gray-300 transition-colors">{box.desc}</p>
                        </div>

                        {/* Animated "CLICK HERE" Peek-a-boo */}
                        <div className="absolute top-4 right-4 bg-pink-500 text-white font-black text-[11px] px-3 py-1.5 rounded-lg border-2 border-black -rotate-12 transition-all transform group-hover:scale-125 z-20 shadow-[2px_2px_0_#000] animate-bounce">
                             CLICK HERE!
                        </div>

                        {/* Halftone hover effect */}
                        <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full ${box.color} border-4 border-black opacity-0 group-hover:opacity-100 group-hover:scale-[2.5] transition-all duration-500 z-0`} />
                        <div className="absolute right-6 bottom-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300 z-10">
                            <ArrowRight className="w-8 h-8 text-white stroke-[3]" />
                        </div>
                </motion.div>
            ))}
        </section>

        {/* Notifications Bar */}
        <section className="p-6 md:p-8 rounded-3xl bg-white border-4 border-black shadow-[10px_10px_0_#00f0ff] relative overflow-hidden">
             {/* Action Lines Background */}
             <div className="absolute inset-0 opacity-10 [background:repeating-linear-gradient(45deg,#000,#000_2px,transparent_2px,transparent_20px)] pointer-events-none" />

             <div className="flex flex-col md:flex-row items-center gap-6 relative z-10 w-full text-center md:text-left">
                 <motion.div 
                    animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                    transition={{ duration: 0.5, delay: 2, repeat: Infinity, repeatDelay: 3 }}
                    className="bg-red-500 p-4 md:p-5 rounded-2xl border-4 border-black shadow-[4px_4px_0_#000] shrink-0 relative"
                 >
                     <Bell className="w-8 h-8 md:w-10 md:h-10 text-white stroke-[2.5]" />
                     {announcements.length > 0 && <span className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full border-4 border-black animate-bounce" />}
                 </motion.div>
                 <div className="flex-1">
                     <div className="inline-flex justify-center md:justify-start items-center gap-2 text-black font-bold text-xs uppercase tracking-widest mb-2 w-full">
                          <span className="w-3 h-3 rounded-full bg-red-500 border-2 border-black animate-pulse" />
                          LATEST NEWS
                     </div>
                     {announcements.length > 0 ? (
                         <>
                             <h3 className="font-comic text-2xl md:text-4xl tracking-wider mb-2 text-black">{announcements[0].title}</h3>
                             <p className="text-gray-800 font-bold text-sm md:text-base line-clamp-2">{announcements[0].message}</p>
                         </>
                     ) : (
                         <>
                             <h3 className="font-comic text-2xl md:text-4xl tracking-wider mb-2 text-black">NO NEWS YET!</h3>
                             <p className="text-gray-800 font-bold text-sm md:text-base">Check back later for any updates from the organizers.</p>
                         </>
                     )}
                 </div>
                 <Link href="/schedule" className="mt-4 md:mt-0">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95, y: 2, boxShadow: "0 0 0 #000" }}
                      className="px-6 py-4 rounded-xl bg-black text-white border-2 border-black flex items-center justify-center font-comic text-xl uppercase tracking-widest transition-all shadow-[6px_6px_0_#00f0ff]"
                    >
                        SEE SCHEDULE <ChevronRight className="w-6 h-6 ml-2" />
                    </motion.button>
                 </Link>
             </div>
        </section>

        {/* Team Modals */}
        <AnimatePresence>
            {(isCreating || isJoining) && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div 
                        initial={{ scale: 0.5, opacity: 0, rotate: 10 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 0.8, opacity: 0, rotate: -10 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                        className="relative bg-white p-8 md:p-12 rounded-3xl w-full max-w-lg border-4 border-black shadow-[12px_12px_0_#ff007f]"
                    >
                         {/* Pattern */}
                         <div className="absolute inset-0 opacity-10 pointer-events-none rounded-3xl border-[20px] border-white z-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '16px 16px' }} />

                         <button onClick={() => { setIsCreating(false); setIsJoining(false); }} className="absolute top-4 right-4 md:top-6 md:right-6 p-2 rounded-xl bg-gray-100 border-2 border-black hover:bg-red-500 hover:text-white transition-all z-20 shadow-[2px_2px_0_#000]">
                             <X className="w-6 h-6 stroke-[3]" />
                         </button>
                         <h3 className="text-4xl md:text-5xl font-comic text-black mb-2 tracking-wider drop-shadow-[2px_2px_0_#00f0ff] uppercase relative z-10">
                            {isCreating ? "CREATE TEAM!" : "JOIN PROJECT!"}
                         </h3>
                         <p className="text-sm md:text-base font-bold text-gray-600 mb-8 relative z-10">
                            {isCreating ? "PICK A GREAT TEAM NAME" : "ENTER YOUR TEAM CODE"}
                            <span className="block text-[10px] text-gray-400 mt-1 italic">
                                {!isCreating && "Ask your team leader for the code!"}
                            </span>
                         </p>
                         
                         <form onSubmit={isCreating ? handleCreateTeam : handleJoinTeam} className="space-y-6 relative z-10">
                              <div className="space-y-2">
                                  <label className="text-sm font-bold text-black uppercase tracking-widest block">{isCreating ? "Team Name" : "Team Code"}</label>
                                  <input 
                                    type="text" 
                                    value={isCreating ? teamName : teamCode}
                                    onChange={(e) => isCreating ? setTeamName(e.target.value) : setTeamCode(e.target.value.toUpperCase())}
                                    placeholder={isCreating ? "e.g. TEAM_ALPHA" : "e.g. 000000"}
                                    className="w-full h-16 px-6 rounded-2xl bg-white border-4 border-black outline-none font-comic text-2xl uppercase transition-all shadow-[6px_6px_0_#000] focus:shadow-[0_0_0_#000] focus:translate-y-1"
                                    required
                                  />
                              </div>
                              <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.95, y: 4, boxShadow: "0 0 0 #000" }}
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full h-16 rounded-2xl bg-yellow-400 text-black border-4 border-black font-custom text-2xl tracking-widest uppercase shadow-[8px_8px_0_#000] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                              >
                                   {isSubmitting ? (
                                       <Loader2 className="w-8 h-8 animate-spin" />
                                   ) : (
                                       <>
                                           {isCreating ? "CREATE" : "JOIN"} <Zap className="w-6 h-6 fill-black stroke-[2]" />
                                       </>
                                   )}
                              </motion.button>
                         </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

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
