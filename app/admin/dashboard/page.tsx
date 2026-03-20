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
      <div className="max-w-7xl mx-auto px-6 py-10 min-h-screen">
        
        {/* Admin Header */}
        <section className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex-1 space-y-4">
                 <motion.div 
                   initial={{ x: -20, opacity: 0 }}
                   animate={{ x: 0, opacity: 1 }}
                   className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest border border-indigo-100"
                 >
                      <Zap className="w-3.5 h-3.5 fill-indigo-600" />
                      Admin Control Center
                 </motion.div>
                 <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight tracking-tight italic">
                    Event Overview.
                 </h1>
                 <p className="text-sm text-gray-500 font-medium max-w-2xl leading-relaxed">
                    View team participation, update statuses, and manage the overall hackathon progress.
                 </p>
            </div>
            
            <div className="flex items-center gap-3">
                 <button 
                   onClick={fetchTeams}
                   disabled={refreshing}
                   className="h-10 px-4 rounded-xl bg-white border border-gray-200 text-gray-700 flex items-center gap-2 font-bold text-sm hover:border-indigo-600 hover:text-indigo-600 transition-all active:scale-95 shadow-sm"
                 >
                      <RefreshCcw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                      Sync Data
                 </button>
                 <button className="h-10 px-4 rounded-xl bg-indigo-600 text-white flex items-center gap-2 font-bold text-sm hover:bg-indigo-700 shadow-sm active:scale-95 transition-all">
                      <Download className="w-4 h-4" /> Export Assets
                 </button>
            </div>
        </section>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
             {[
                 { label: 'Total Teams', value: teams.length, icon: Users, color: 'indigo', desc: 'Active Formations' },
                 { label: 'Shortlisted', value: teams.filter(t => t.shortlisted).length, icon: ShieldCheck, color: 'emerald', desc: 'Elite Finalists' },
                 { label: 'Confirmed', value: teams.filter(t => t.rsvpStatus === 'confirmed').length, icon: Check, color: 'amber', desc: 'Event Ready' },
                 { label: 'Submissions', value: teams.filter(t => t.archived === false).length, icon: FileCheck, color: 'blue', desc: 'Proposal Archives' }
             ].map((stat, i) => (
                 <div key={i} className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
                          <stat.icon className="w-5 h-5 text-indigo-600" />
                      </div>
                      <p className="text-3xl font-black text-gray-900 tracking-tight mb-1">{stat.value}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">{stat.desc}</p>
                 </div>
             ))}
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
             <div className="relative flex-1 w-full group">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                 <input 
                    type="text" 
                    placeholder="Search teams by name or code..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-12 pl-12 pr-6 rounded-xl bg-white border border-gray-200 focus:border-indigo-600 outline-none font-medium text-sm transition-all shadow-sm"
                 />
             </div>
             <button className="h-12 px-6 rounded-xl bg-white border border-gray-200 flex items-center justify-center gap-2 font-bold text-sm text-gray-600 hover:border-indigo-600 hover:text-indigo-600 transition-all active:scale-95 shrink-0 shadow-sm">
                  <Filter className="w-4 h-4" /> Filter
             </button>
        </div>

        {/* Teams Table */}
        <div className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden mb-12">
             <div className="overflow-x-auto">
                 <table className="w-full text-left">
                     <thead>
                         <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-200">
                             <th className="px-6 py-4">Team Name</th>
                             <th className="px-6 py-4">Members</th>
                             <th className="px-6 py-4">Status</th>
                             <th className="px-6 py-4">Shortlisted</th>
                             <th className="px-6 py-4 text-right">Actions</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100">
                         {filteredTeams.map((team) => (
                            <tr key={team.id} className="group hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm border ${team.shortlisted ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-white text-indigo-600 border-gray-200'} transition-all group-hover:scale-105`}>
                                            {team.teamName.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm tracking-tight mb-0.5">{team.teamName}</p>
                                            <p className="text-[10px] font-mono font-medium text-gray-500 uppercase">{team.teamCode}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm font-medium text-gray-900 mb-0.5">{team.memberIds.length} Members</p>
                                </td>
                                <td className="px-6 py-4">
                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                                        team.rsvpStatus === 'confirmed' ? 'bg-green-50 text-green-700 border-green-200' : 
                                        'bg-gray-50 text-gray-500 border-gray-200'
                                    }`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${team.rsvpStatus === 'confirmed' ? 'bg-green-600' : 'bg-gray-400'}`} />
                                        {team.rsvpStatus === 'confirmed' ? 'Confirmed' : 'Pending'}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <button 
                                      onClick={() => handleShortlist(team.id, team.shortlisted)}
                                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${team.shortlisted ? 'bg-indigo-600' : 'bg-gray-200'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${team.shortlisted ? 'translate-x-[1.3rem]' : 'translate-x-1'}`} />
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-2 rounded-lg bg-white border border-gray-200 text-indigo-600 hover:border-indigo-600 transition-colors shadow-sm" title="View Submission">
                                            <FileCheck className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 rounded-lg border border-transparent text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                                            <MoreHorizontal className="w-4 h-4" />
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
