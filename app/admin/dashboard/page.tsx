"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getAllTeamsForAdmin, shortlistTeam } from "@/lib/db";
import { Team } from "@/types";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { 
  LayoutDashboard, 
  Users, 
  FileCheck, 
  ShieldCheck, 
  Mail, 
  ArrowRight, 
  Table, 
  Search, 
  RefreshCcw, 
  MoreHorizontal, 
  Download, 
  ToggleLeft, 
  ToggleRight, 
  Check, 
  X,
  Zap,
  Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [teams, setTeams] = useState<(Team & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchTeams = async () => {
    setLoading(true);
    setRefreshing(true);
    try {
      const data = await getAllTeamsForAdmin();
      setTeams(data);
    } catch (err: any) {
      setError(err.message || "Failed to load teams.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleShortlist = async (teamId: string, currentStatus: boolean) => {
    try {
      await shortlistTeam(teamId, !currentStatus);
      setTeams(prev => prev.map(t => t.id === teamId ? { ...t, shortlisted: !currentStatus } : t));
    } catch (err: any) {
      console.error(err);
    }
  };

  const filteredTeams = teams.filter(t => 
    t.teamName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.teamCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return null;

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="max-w-7xl mx-auto px-6 py-20 min-h-screen pb-40">
        
        {/* Admin Header */}
        <section className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12 text-center md:text-left">
            <div className="flex-1 space-y-10">
                 <motion.div 
                   initial={{ x: -20, opacity: 0 }}
                   animate={{ x: 0, opacity: 1 }}
                   className="inline-flex items-center gap-3 bg-indigo-50 text-indigo-700 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] italic border border-indigo-100"
                 >
                      <Zap className="w-4 h-4 fill-indigo-600" />
                      Admin Control Center
                 </motion.div>
                 <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight tracking-tighter italic">
                    Event <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-950">
                        Overview.
                    </span>
                 </h1>
                 <p className="text-lg text-gray-400 font-bold max-w-2xl italic leading-relaxed">
                    View team participation, update statuses, and manage the overall hackathon progress.
                 </p>
            </div>
            
            <div className="flex items-center gap-4">
                 <button 
                   onClick={fetchTeams}
                   disabled={refreshing}
                   className="h-16 px-8 rounded-3xl bg-white border-2 border-indigo-50 text-indigo-600 flex items-center gap-4 font-black uppercase text-xs tracking-widest hover:border-indigo-600 transition-all active:scale-95 shadow-xl shadow-indigo-600/5"
                 >
                      <RefreshCcw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                      Sync Data
                 </button>
                 <button className="h-16 px-8 rounded-3xl bg-indigo-600 text-white flex items-center gap-4 font-black uppercase text-xs tracking-widest hover:bg-indigo-700 shadow-2xl shadow-indigo-600/20 active:scale-95 transition-all">
                      <Download className="w-4 h-4" /> Export Assets
                 </button>
            </div>
        </section>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
             {[
                 { label: 'Total squads', value: teams.length, icon: Users, color: 'indigo', desc: 'Active Formations' },
                 { label: 'Shortlisted', value: teams.filter(t => t.shortlisted).length, icon: ShieldCheck, color: 'emerald', desc: 'Elite Finalists' },
                 { label: 'Confirmed', value: teams.filter(t => t.rsvpStatus === 'confirmed').length, icon: Check, color: 'amber', desc: 'Ready for Deployment' },
                 { label: 'Submissions', value: teams.filter(t => t.archived === false).length, icon: FileCheck, color: 'blue', desc: 'Proposal Archives' }
             ].map((stat, i) => (
                 <div key={i} className="p-10 rounded-[3rem] bg-white border-4 border-indigo-50 shadow-2xl shadow-indigo-600/5 group relative overflow-hidden">
                      <div className="flex items-center justify-between mb-8 relative z-10">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">{stat.label}</p>
                          <stat.icon className="w-5 h-5 text-indigo-600" />
                      </div>
                      <p className="text-5xl font-black text-gray-900 tracking-tighter mb-2 italic relative z-10">{stat.value}</p>
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none relative z-10">{stat.desc}</p>
                      
                      <div className="absolute top-0 right-0 p-10 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-1000 -z-0 bg-indigo-600 rounded-full scale-150 blur-3xl" />
                 </div>
             ))}
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-12 p-8 rounded-[3rem] bg-gray-50 border-4 border-gray-100">
             <div className="relative flex-1 w-full group">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                 <input 
                    type="text" 
                    placeholder="Locate Squad Identity or Invite Key..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-16 pl-16 pr-8 rounded-[2rem] bg-white border-2 border-transparent focus:border-indigo-600 outline-none font-bold text-lg tracking-tight transition-all"
                 />
             </div>
             <button className="h-16 px-10 rounded-[2rem] bg-white border-2 border-gray-100 flex items-center justify-center gap-4 font-black uppercase text-xs tracking-[0.2em] text-gray-400 hover:border-indigo-600 hover:text-indigo-600 transition-all active:scale-95 shrink-0">
                  <Filter className="w-4 h-4" /> Filter Protocols
             </button>
        </div>

        {/* Teams Table */}
        <div className="rounded-[4rem] bg-white border-4 border-indigo-50 shadow-2xl overflow-hidden">
             <div className="overflow-x-auto">
                 <table className="w-full text-left">
                     <thead>
                         <tr className="bg-indigo-50/30 text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] border-b border-indigo-50">
                             <th className="px-12 py-10 italic">Squad Identity</th>
                             <th className="px-12 py-10 italic">Personnel</th>
                             <th className="px-12 py-10 italic">Protocol Status</th>
                             <th className="px-12 py-10 italic">Elite Rank</th>
                             <th className="px-12 py-10 text-right italic">Actions</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-indigo-50">
                         {filteredTeams.map((team) => (
                            <tr key={team.id} className="group hover:bg-indigo-50/10 transition-all duration-500">
                                <td className="px-12 py-10">
                                    <div className="flex items-center gap-6">
                                        <div className={`w-16 h-16 rounded-3xl flex items-center justify-center font-black text-2xl shadow-xl border-4 ${team.shortlisted ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-white text-indigo-400 border-indigo-50'} transition-all duration-700 group-hover:rotate-12`}>
                                            {team.teamName.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-900 text-xl tracking-tighter uppercase italic leading-none mb-2">{team.teamName}</p>
                                            <p className="text-[10px] font-mono font-black text-indigo-400 tracking-[0.3em] uppercase">{team.teamCode}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-12 py-10">
                                    <p className="text-base font-black text-gray-900 italic tracking-tighter leading-none mb-2">{team.memberIds.length} Members</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Squad Integrated</p>
                                </td>
                                <td className="px-12 py-10">
                                    <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all duration-500 ${
                                        team.rsvpStatus === 'confirmed' ? 'bg-green-600 text-white border-green-500 shadow-xl shadow-green-600/20' : 
                                        'bg-white text-gray-400 border-gray-100'
                                    }`}>
                                        <div className={`w-2 h-2 rounded-full ${team.rsvpStatus === 'confirmed' ? 'bg-white' : 'bg-gray-300'} ${team.rsvpStatus === 'confirmed' ? 'animate-pulse' : ''}`} />
                                        {team.rsvpStatus === 'confirmed' ? 'Validated' : 'Queued'}
                                    </div>
                                </td>
                                <td className="px-12 py-10">
                                    <button 
                                      onClick={() => handleShortlist(team.id, team.shortlisted)}
                                      className={`relative inline-flex h-9 w-16 items-center rounded-full transition-all duration-700 focus:outline-none ${team.shortlisted ? 'bg-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.5)]' : 'bg-gray-200'}`}
                                    >
                                        <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-all duration-700 shadow-xl ${team.shortlisted ? 'translate-x-[2.2rem]' : 'translate-x-1.5'}`} />
                                    </button>
                                </td>
                                <td className="px-12 py-10 text-right">
                                    <div className="flex items-center justify-end gap-4">
                                        <button className="p-4 rounded-2xl bg-white border-2 border-indigo-50 text-indigo-600 hover:border-indigo-600 transition-all active:scale-95" title="Proposal Intel">
                                            <FileCheck className="w-6 h-6" />
                                        </button>
                                        <button className="p-4 rounded-2xl bg-white border-2 border-indigo-50 text-gray-400 hover:text-gray-900 transition-all">
                                            <MoreHorizontal className="w-6 h-6" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                         ))}
                     </tbody>
                 </table>
             </div>
        </div>

      </div>
    </ProtectedRoute>
  );
}
