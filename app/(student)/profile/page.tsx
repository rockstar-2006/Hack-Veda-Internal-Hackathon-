"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getMyTeam, createTeam, joinTeam, getUserProfile, updateUserProfile, getAnnouncements, updateTeamName } from "@/lib/db";
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
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Countdown } from "@/components/Countdown";
import dynamic from "next/dynamic";

// Dynamic import for Lottie to avoid SSR issues
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function ProfilePage() {
  const { user } = useAuth();
  const [team, setTeam] = useState<Team | null>(null);
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

  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamCode, setTeamCode] = useState("");
  const [error, setError] = useState("");
  const [currentTeamName, setCurrentTeamName] = useState("");

  const fetchData = async () => {
    if (user) {
      setLoading(true);
      try {
        const [teamData, profileData, annData] = await Promise.all([
            getMyTeam(user.uid),
            getUserProfile(user.uid),
            getAnnouncements()
        ]);
        
        if (teamData) {
            setTeam(teamData);
            setCurrentTeamName(teamData.teamName);
        }
        if (annData) setAnnouncements(annData);
        if (profileData) {
            setProfile(profileData);
            setFullName(profileData.full_name || "");
            setUsn(profileData.usn || "");
            setBranch(profileData.branch || "CSE");
            setYear(profileData.year || "3rd Year");
            if (!profileData.full_name) setShowSetup(true);
        } else {
            setShowSetup(true);
        }
      } catch (err: any) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

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
                  email: user.email
              })
          ];

          if (team && team.leaderId === user.uid && currentTeamName !== team.teamName) {
              promises.push(updateTeamName(team.id!, currentTeamName));
          }

          await Promise.all(promises);

          setProfile({ userId: user.uid, email: user.email, role: "student", full_name: fullName, usn, branch, year });
          if (team && team.leaderId === user.uid) {
              setTeam({ ...team, teamName: currentTeamName });
          }
          setShowSetup(false);
      } catch (err: any) {
          setError("Failed to update settings. " + err.message);
      } finally {
          setProfileSaving(false);
      }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return;
    setError("");
    try {
      const newTeam = await createTeam(user!.uid, teamName);
      setTeam(newTeam);
      setIsCreating(false);
    } catch (err: any) {
        setError(err.message || "Something went wrong. Try again.");
    }
  };

  const handleJoinTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamCode.trim()) return;
    setError("");
    try {
      const joinedTeam = await joinTeam(teamCode, user!.uid);
      setTeam(joinedTeam);
      setIsJoining(false);
    } catch (err: any) {
        setError(err.message || "Could not join team. Check the code.");
    }
  };
  
  if (loading) return null;

  if (showSetup) {
      return (
          <ProtectedRoute>
              <div className="max-w-2xl mx-auto px-6 py-20 lg:py-40 min-h-screen">
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-10 md:p-14 rounded-[4rem] bg-white border-4 border-indigo-50 shadow-2xl relative overflow-hidden"
                  >
                        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/5 rounded-full blur-[80px] -mr-24 -mt-24" />
                        
                        <div className="flex items-center gap-4 mb-12 relative z-10">
                             <div className="bg-indigo-600 p-4 rounded-3xl shadow-xl shadow-indigo-600/30">
                                 <Settings className="w-8 h-8 text-white animate-spin-slow" />
                             </div>
                             <h2 className="text-4xl font-black text-gray-900 italic tracking-tighter uppercase leading-none">Settings & <br /> Profile.</h2>
                        </div>

                        {error && (
                            <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-red-100 italic">
                                {error}
                            </div>
                        )}
                        
                        <form onSubmit={handleProfileUpdate} className="space-y-8">
                             {team && team.leaderId === user?.uid && (
                                <div className="space-y-2 p-6 bg-indigo-50/50 rounded-3xl border-2 border-dashed border-indigo-100">
                                    <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest pl-4">Team Designation (Leader Only)</label>
                                    <input 
                                        type="text" 
                                        value={currentTeamName}
                                        onChange={(e) => setCurrentTeamName(e.target.value)}
                                        placeholder="Team Name"
                                        className="w-full h-16 px-8 rounded-3xl bg-white border-4 border-transparent focus:border-indigo-600 outline-none transition-all font-black text-lg italic"
                                        required
                                    />
                                </div>
                             )}
                             <div className="space-y-2">
                                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">Full Name</label>
                                 <input 
                                   type="text" 
                                   value={fullName}
                                   onChange={(e) => setFullName(e.target.value)}
                                   placeholder="Your Full Name"
                                   className="w-full h-16 px-8 rounded-3xl bg-gray-50 border-4 border-transparent focus:border-indigo-600 focus:bg-white outline-none transition-all font-black text-lg"
                                   required
                                 />
                             </div>
                             
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">USN</label>
                                    <input 
                                      type="text" 
                                      value={usn}
                                      onChange={(e) => setUsn(e.target.value)}
                                      placeholder="Ex: 4SO23CS..."
                                      className="w-full h-16 px-8 rounded-3xl bg-gray-50 border-4 border-transparent focus:border-indigo-600 focus:bg-white outline-none transition-all font-black text-lg"
                                      required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">Branch</label>
                                    <select 
                                      value={branch}
                                      onChange={(e) => setBranch(e.target.value)}
                                      className="w-full h-16 px-8 rounded-3xl bg-gray-50 border-4 border-transparent focus:border-indigo-600 focus:bg-white outline-none transition-all font-black text-lg appearance-none cursor-pointer"
                                      required
                                    >
                                        <option value="CSE">CSE</option>
                                        <option value="ISE">ISE</option>
                                        <option value="AIML">AIML</option>
                                        <option value="ECE">ECE</option>
                                        <option value="EEE">EEE</option>
                                        <option value="ME">ME</option>
                                        <option value="CV">CV</option>
                                    </select>
                                </div>
                             </div>

                             <div className="space-y-2">
                                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">Year of Study</label>
                                 <select 
                                      value={year}
                                      onChange={(e) => setYear(e.target.value)}
                                      className="w-full h-16 px-8 rounded-3xl bg-gray-50 border-4 border-transparent focus:border-indigo-600 focus:bg-white outline-none transition-all font-black text-lg appearance-none cursor-pointer"
                                      required
                                    >
                                        <option value="1st Year">1st Year</option>
                                        <option value="2nd Year">2nd Year</option>
                                        <option value="3rd Year">3rd Year</option>
                                        <option value="Final Year">Final Year</option>
                                    </select>
                             </div>

                             <button 
                               type="submit" 
                               disabled={profileSaving}
                               className="w-full h-24 rounded-[3rem] bg-indigo-600 text-white flex items-center justify-center gap-4 text-xl font-black tracking-tight mt-10 shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
                             >
                                 {profileSaving ? <Loader2 className="w-8 h-8 animate-spin" /> : "Save All Changes"}
                             </button>
                             <button 
                               type="button"
                               onClick={() => setShowSetup(false)}
                               className="w-full h-16 rounded-[2rem] text-gray-400 font-black uppercase text-[10px] tracking-widest hover:text-gray-900 transition-colors"
                             >
                                 Discard Changes
                             </button>
                        </form>
                  </motion.div>
              </div>
          </ProtectedRoute>
      );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-6 py-20 min-h-screen pb-40 relative">
        
        {/* Profile Settings Toggle */}
        <div className="absolute top-10 right-10 z-[50]">
             <button 
               onClick={() => setShowSetup(true)}
               className="p-5 bg-white border-4 border-indigo-50 text-indigo-600 rounded-[2rem] shadow-2xl shadow-indigo-600/5 hover:border-indigo-600 transition-all active:scale-95 group"
               title="Update Profile"
             >
                 <Settings className="group-hover:rotate-90 transition-transform duration-500" />
             </button>
        </div>

        {/* Merged Header Section (Compact) */}
        <section className="mb-20 flex flex-col lg:flex-row items-center lg:items-end justify-between gap-12 lg:gap-24 text-center lg:text-left">
            <div className="flex-1 space-y-10">
                 <motion.div 
                   initial={{ x: -20, opacity: 0 }}
                   animate={{ x: 0, opacity: 1 }}
                   className="inline-flex items-center gap-3 bg-indigo-50 text-indigo-700 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] italic border border-indigo-100"
                 >
                      <Zap className="w-4 h-4 fill-indigo-600" />
                      Hackveda Dashboard
                 </motion.div>
                 
                  <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight tracking-tighter italic">
                    Welcome, <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-950 font-black">
                        {profile?.full_name?.split(" ")[0] || "Innovator"}.
                    </span>
                  </h1>
                 
                 <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 uppercase font-black text-[10px] italic tracking-widest">
                      <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center gap-3">
                           <Users className="w-5 h-5 text-white" />
                           {team?.teamName || "NO TEAM"}
                      </div>
                      <div className="bg-gray-50 px-6 py-3 rounded-2xl border-4 border-gray-100 flex items-center gap-3 text-gray-400">
                           <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_green]" />
                           {profile?.usn || "NOT INITIALIZED"}
                      </div>
                 </div>
            </div>

            {/* Countdown Component on the Right */}
            <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="p-8 md:p-14 rounded-[3.5rem] bg-white border-4 border-indigo-50 shadow-2xl relative group hover:border-indigo-600 transition-all duration-700"
            >
                 <Countdown targetDate="2026-04-10T10:00:00" label="Countdown to Hackveda Start" />
                 
                 {/* Subtle Watermark Decoration */}
                 <div className="absolute top-[-20%] right-[-10%] opacity-[0.03] pointer-events-none transition-transform duration-1000 group-hover:scale-110">
                    <Trophy className="w-64 h-64 text-indigo-900" />
                 </div>
            </motion.div>
        </section>



        {/* Global Action Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
                { label: 'TEAM', desc: 'Team Registration', href: '/team', icon: Users },
                { label: 'SUBMIT', desc: 'Upload Your Proposal', href: '/submission', icon: FileCheck },
                { label: 'SCHEDULE', desc: 'Event Timeline', href: '/schedule', icon: Calendar },
                { label: 'PRIZES', desc: 'Winner Rewards', href: '/prizes', icon: Trophy }
            ].map((box, i) => (
                <Link 
                    key={i} 
                    href={box.href}
                    className="p-12 rounded-[4rem] bg-white border-4 border-indigo-50 hover:border-indigo-600 hover:shadow-2xl hover:shadow-indigo-600/10 transition-all duration-500 group relative overflow-hidden h-[340px] flex flex-col justify-between"
                >
                    <div className="w-20 h-20 rounded-[2.5rem] bg-indigo-50 border-2 border-indigo-100 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-600 transition-all duration-700">
                        <box.icon className="w-10 h-10 text-indigo-600 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                        <h4 className="text-xl md:text-2xl font-black italic tracking-tighter uppercase leading-none mb-2 group-hover:text-indigo-600 transition-colors">{box.label}</h4>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic">{box.desc}</p>
                    </div>
                    <div className="absolute bottom-10 right-10 opacity-0 group-hover:opacity-100 group-hover:translate-x-3 transition-all duration-500">
                         <ArrowRight className="w-10 h-10 text-indigo-600" />
                    </div>
                </Link>
            ))}
        </section>

        {/* Notifications Bar */}
        <section className="mt-20 p-12 md:p-16 rounded-[4.5rem] bg-gray-950 text-white relative overflow-hidden shadow-2xl border-4 border-gray-900">
             <div className="flex flex-col md:flex-row items-center gap-14 relative z-10">
                 <div className="bg-indigo-600 p-8 rounded-[3rem] shadow-2xl shadow-indigo-600/40 shrink-0 relative">
                     <Bell className="w-12 h-12 text-white animate-bounce-subtle" />
                     {announcements.length > 0 && <span className="absolute top-0 right-0 w-6 h-6 bg-red-500 rounded-full border-4 border-gray-950 animate-ping" />}
                 </div>
                 <div className="flex-1 text-center md:text-left">
                     <div className="inline-flex items-center gap-3 text-indigo-400 font-black text-[10px] uppercase tracking-[0.4em] mb-6 italic">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_15px_red] animate-pulse" />
                          Official Updates
                     </div>
                     {announcements.length > 0 ? (
                         <>
                             <h3 className="text-2xl md:text-3xl font-black italic tracking-tighter mb-3 uppercase">{announcements[0].title}</h3>
                             <p className="text-gray-400 font-bold italic text-base line-clamp-2 max-w-4xl">{announcements[0].message}</p>
                         </>
                     ) : (
                         <>
                             <h3 className="text-2xl md:text-3xl font-black italic tracking-tighter mb-3 uppercase">System Synchronized.</h3>
                             <p className="text-gray-400 font-bold italic text-base">Awaiting official directives from the Hackveda central hub.</p>
                         </>
                     )}
                 </div>
                 <Link href="/schedule" className="h-20 px-12 rounded-3xl bg-white text-gray-950 flex items-center justify-center font-black uppercase text-sm tracking-[0.2em] italic hover:bg-gray-200 transition-all shrink-0 active:scale-95 group">
                    View Schedule <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                 </Link>
             </div>
             
             {/* Dynamic Background Pattern */}
             <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/40 via-transparent to-transparent opacity-50" />
             <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </section>

        {/* Team Modals */}
        <AnimatePresence>
            {(isCreating || isJoining) && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 50 }}
                        className="relative bg-white p-14 md:p-20 rounded-[4.5rem] w-full max-w-2xl shadow-2xl border-4 border-indigo-50"
                    >
                         <button onClick={() => { setIsCreating(false); setIsJoining(false); }} className="absolute top-10 right-10 p-4 rounded-2xl bg-gray-50 text-gray-400 hover:text-indigo-600 transition-all">
                             <X className="w-6 h-6" />
                         </button>
                          <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 italic tracking-tighter uppercase leading-none">
                            {isCreating ? "Create Team." : "Join Team."}
                         </h3>
                         <p className="text-lg font-bold text-gray-400 mb-14 uppercase tracking-widest italic">{isCreating ? "Choose your team name" : "Enter the team code"}</p>
                         
                         <form onSubmit={isCreating ? handleCreateTeam : handleJoinTeam} className="space-y-12">
                              <div className="space-y-2">
                                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-8">{isCreating ? "Team Name" : "Team Code"}</label>
                                  <input 
                                    type="text" 
                                    value={isCreating ? teamName : teamCode}
                                    onChange={(e) => isCreating ? setTeamName(e.target.value) : setTeamCode(e.target.value.toUpperCase())}
                                    placeholder={isCreating ? "SQUAD_ALPHA_26" : "000000"}
                                    className="w-full h-24 px-12 rounded-[3rem] bg-gray-50 border-4 border-transparent focus:border-indigo-600 focus:bg-white outline-none font-black text-3xl tracking-tighter uppercase transition-all"
                                    required
                                  />
                              </div>
                              <button type="submit" className="w-full h-24 rounded-[3.5rem] bg-indigo-600 text-white font-black text-2xl tracking-tight shadow-3xl shadow-indigo-600/40 hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-6">
                                   {isCreating ? "Create Team" : "Join Team"} <Zap className="w-6 h-6 fill-white" />
                              </button>
                         </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

      </div>
    </ProtectedRoute>
  );
}

// Fixed Redundant Imports
import { X } from "lucide-react";
