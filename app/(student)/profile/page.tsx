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
              <div className="max-w-2xl mx-auto px-6 py-10 lg:py-20 min-h-screen">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 md:p-10 rounded-[2rem] bg-white border border-indigo-50 shadow-sm relative overflow-hidden"
                  >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-[50px] -mr-16 -mt-16" />
                        
                        <div className="flex items-center gap-4 mb-8 relative z-10">
                             <div className="bg-indigo-600 p-3 rounded-xl shadow-md shadow-indigo-600/20">
                                 <Settings className="w-6 h-6 text-white animate-spin-slow" />
                             </div>
                             <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-none">Settings & Profile</h2>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100">
                                {error}
                            </div>
                        )}
                        
                        <form onSubmit={handleProfileUpdate} className="space-y-6">
                             {team && team.leaderId === user?.uid && (
                                <div className="space-y-2 p-4 bg-indigo-50/50 rounded-2xl border border-dashed border-indigo-100">
                                    <label className="text-xs font-bold text-indigo-400 uppercase tracking-widest pl-2 block">Team Designation</label>
                                    <input 
                                        type="text" 
                                        value={currentTeamName}
                                        onChange={(e) => setCurrentTeamName(e.target.value)}
                                        placeholder="Team Name"
                                        className="w-full h-12 px-4 rounded-xl bg-white border border-transparent focus:border-indigo-600 outline-none transition-all font-bold text-sm"
                                        required
                                    />
                                </div>
                             )}
                             <div className="space-y-2">
                                 <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2 block">Full Name</label>
                                 <input 
                                   type="text" 
                                   value={fullName}
                                   onChange={(e) => setFullName(e.target.value)}
                                   placeholder="Your Full Name"
                                   className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-indigo-600 focus:bg-white outline-none transition-all font-bold text-sm"
                                   required
                                 />
                             </div>
                             
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2 block">USN</label>
                                    <input 
                                      type="text" 
                                      value={usn}
                                      onChange={(e) => setUsn(e.target.value)}
                                      placeholder="Ex: 4SO23CS..."
                                      className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-indigo-600 focus:bg-white outline-none transition-all font-bold text-sm"
                                      required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2 block">Branch</label>
                                    <select 
                                      value={branch}
                                      onChange={(e) => setBranch(e.target.value)}
                                      className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-indigo-600 focus:bg-white outline-none transition-all font-bold text-sm appearance-none cursor-pointer"
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
                                 <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2 block">Year of Study</label>
                                 <select 
                                      value={year}
                                      onChange={(e) => setYear(e.target.value)}
                                      className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-indigo-600 focus:bg-white outline-none transition-all font-bold text-sm appearance-none cursor-pointer"
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
                               className="w-full h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center gap-2 text-sm font-bold mt-6 shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
                             >
                                 {profileSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
                             </button>
                             <button 
                               type="button"
                               onClick={() => setShowSetup(false)}
                               className="w-full h-10 rounded-lg text-gray-500 font-bold uppercase text-[10px] tracking-widest hover:text-gray-900 transition-colors"
                             >
                                 Discard
                             </button>
                        </form>
                  </motion.div>
              </div>
          </ProtectedRoute>
      );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-6 py-10 min-h-screen">
        
        {/* Profile Settings Toggle */}
        <div className="absolute top-6 right-6 z-[50]">
             <button 
               onClick={() => setShowSetup(true)}
               className="p-3 bg-white border border-gray-200 text-gray-600 rounded-xl shadow-sm hover:border-indigo-600 hover:text-indigo-600 transition-all active:scale-95 group"
               title="Update Profile"
             >
                 <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
             </button>
        </div>

        {/* Header Section */}
        <section className="mb-12 flex flex-col lg:flex-row items-center lg:items-end justify-between gap-8 lg:gap-12 text-center lg:text-left">
            <div className="flex-1 space-y-4">
                 <motion.div 
                   initial={{ x: -20, opacity: 0 }}
                   animate={{ x: 0, opacity: 1 }}
                   className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest border border-indigo-100"
                 >
                      <Zap className="w-3.5 h-3.5 fill-indigo-600" />
                      Hackveda Dashboard
                 </motion.div>
                 
                  <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight tracking-tight">
                    Welcome, <br />
                    <span className="text-indigo-600">
                        {profile?.full_name?.split(" ")[0] || "Innovator"}.
                    </span>
                  </h1>
                 
                 <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 uppercase font-bold text-[10px] tracking-widest">
                      <div className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-sm flex items-center gap-2">
                           <Users className="w-4 h-4 text-white" />
                           {team?.teamName || "NO TEAM"}
                      </div>
                      <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 flex items-center gap-2 text-gray-600">
                           <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_green]" />
                           {profile?.usn || "NOT INITIALIZED"}
                      </div>
                 </div>
            </div>

            {/* Countdown Component on the Right */}
            <motion.div 
               initial={{ scale: 0.95, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="p-6 md:p-8 rounded-2xl bg-white border border-indigo-100 shadow-sm relative group hover:border-indigo-600 transition-all duration-300 w-full lg:w-auto"
            >
                 <Countdown targetDate="2026-04-10T10:00:00" label="Countdown to Hackveda Start" />
            </motion.div>
        </section>



        {/* Global Action Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
            {[
                { label: 'TEAM', desc: 'Team Registration', href: '/team', icon: Users },
                { label: 'SUBMIT', desc: 'Upload Your Proposal', href: '/submission', icon: FileCheck },
                { label: 'SCHEDULE', desc: 'Event Timeline', href: '/schedule', icon: Calendar },
                { label: 'PRIZES', desc: 'Winner Rewards', href: '/prizes', icon: Trophy }
            ].map((box, i) => (
                <Link 
                    key={i} 
                    href={box.href}
                    className="p-6 rounded-2xl bg-white border border-gray-200 hover:border-indigo-600 hover:shadow-lg hover:shadow-indigo-600/5 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between min-h-[160px]"
                >
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center group-hover:scale-105 group-hover:bg-indigo-600 transition-all duration-500 mb-4">
                        <box.icon className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                        <h4 className="text-lg font-black tracking-tight uppercase leading-none mb-1 group-hover:text-indigo-600 transition-colors">{box.label}</h4>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{box.desc}</p>
                    </div>
                    <div className="absolute right-6 bottom-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                         <ArrowRight className="w-5 h-5 text-indigo-600" />
                    </div>
                </Link>
            ))}
        </section>

        {/* Notifications Bar */}
        <section className="p-6 md:p-8 rounded-2xl bg-gray-900 text-white relative overflow-hidden shadow-lg border border-gray-800">
             <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10 w-full">
                 <div className="bg-indigo-600 p-4 rounded-xl shadow-lg shadow-indigo-600/30 shrink-0 relative">
                     <Bell className="w-6 h-6 text-white" />
                     {announcements.length > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-gray-900 animate-pulse" />}
                 </div>
                 <div className="flex-1">
                     <div className="inline-flex items-center gap-2 text-indigo-400 font-bold text-[10px] uppercase tracking-widest mb-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_red] animate-pulse" />
                          Official Updates
                     </div>
                     {announcements.length > 0 ? (
                         <>
                             <h3 className="text-lg md:text-xl font-black tracking-tight mb-1">{announcements[0].title}</h3>
                             <p className="text-gray-300 font-medium text-sm line-clamp-2 md:max-w-xl">{announcements[0].message}</p>
                         </>
                     ) : (
                         <>
                             <h3 className="text-lg md:text-xl font-black tracking-tight mb-1">System Synchronized.</h3>
                             <p className="text-gray-400 font-medium text-sm">Awaiting official directives from the Hackveda central hub.</p>
                         </>
                     )}
                 </div>
                 <Link href="/schedule" className="h-10 px-6 rounded-lg bg-white text-gray-900 flex items-center justify-center font-bold uppercase text-xs tracking-widest hover:bg-gray-100 transition-all shrink-0 active:scale-95 group w-full md:w-auto mt-4 md:mt-0">
                    Schedule <ChevronRight className="w-4 h-4 inline group-hover:translate-x-1 transition-transform ml-1" />
                 </Link>
             </div>
             
             {/* Dynamic Background Pattern */}
             <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/40 via-transparent to-transparent opacity-50 pointer-events-none" />
        </section>

        {/* Team Modals */}
        <AnimatePresence>
            {(isCreating || isJoining) && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative bg-white p-6 md:p-10 rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100"
                    >
                         <button onClick={() => { setIsCreating(false); setIsJoining(false); }} className="absolute top-6 right-6 p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                             <X className="w-5 h-5" />
                         </button>
                          <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">
                            {isCreating ? "Create Team." : "Join Team."}
                         </h3>
                         <p className="text-sm font-bold text-gray-500 mb-8">{isCreating ? "Choose your team name" : "Enter the team code"}</p>
                         
                         <form onSubmit={isCreating ? handleCreateTeam : handleJoinTeam} className="space-y-6">
                              <div className="space-y-2">
                                  <label className="text-xs font-bold text-gray-600 uppercase tracking-widest block">{isCreating ? "Team Name" : "Team Code"}</label>
                                  <input 
                                    type="text" 
                                    value={isCreating ? teamName : teamCode}
                                    onChange={(e) => isCreating ? setTeamName(e.target.value) : setTeamCode(e.target.value.toUpperCase())}
                                    placeholder={isCreating ? "e.g. SQUAD_ALPHA" : "e.g. 000000"}
                                    className="w-full h-14 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-indigo-600 focus:bg-white outline-none font-bold text-lg uppercase transition-all focus:ring-4 focus:ring-indigo-600/10"
                                    required
                                  />
                              </div>
                              <button type="submit" className="w-full h-14 rounded-xl bg-indigo-600 text-white font-bold tracking-tight shadow-md hover:bg-indigo-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                                   {isCreating ? "Create Team" : "Join Team"} <Zap className="w-4 h-4 fill-white" />
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
