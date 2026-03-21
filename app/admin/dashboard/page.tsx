
"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Team } from "@/types";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { 
  Users, 
  FileCheck, 
  ShieldCheck, 
  Search, 
  RefreshCcw, 
  MoreHorizontal, 
  Download, 
  Check, 
  Zap,
  Filter,
  AlertTriangle,
  ChevronRight,
  Database,
  ExternalLink,
  X,
  UserCheck,
  UserCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [teams, setTeams] = useState<(Team & { id: string, submissionUrl?: string | null })[]>([]);
  const [stats, setStats] = useState({ totalTeams: 0, shortlisted: 0, confirmed: 0, submissions: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const isMountedRef = useRef(true);

  const fetchData = async () => {
    if (!isMountedRef.current) return;
    setRefreshing(true);
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    try {
      const [statsRes, teamsRes] = await Promise.all([
          fetch('/api/admin/stats', { signal: controller.signal }),
          fetch('/api/admin/teams?limit=100', { signal: controller.signal })
      ]);
      
      clearTimeout(timeout);

      if (!isMountedRef.current) return;

      if (!statsRes.ok || !teamsRes.ok) throw new Error("Database link synchronization failed");
      
      const [statsData, teamsData] = await Promise.all([
          statsRes.json(),
          teamsRes.json()
      ]);

      if (isMountedRef.current) {
        setStats(statsData);
        setTeams(teamsData);
        setError("");
      }
    } catch (err: any) {
      if (isMountedRef.current) {
        if (err.name !== 'AbortError') {
          setError(err.message || "Failed to establish secure data link.");
        }
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    setLoading(true);
    fetchData();
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleShortlist = async (teamId: string, currentStatus: boolean) => {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch('/api/admin/teams/shortlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ teamId, status: !currentStatus }),
            signal: controller.signal
        });
        
        clearTimeout(timeout);
        
        if (!response.ok) throw new Error("Action denied");

        setTeams(prev => prev.map(t => t.id === teamId ? { ...t, shortlisted: !currentStatus } : t));
        setStats(prev => ({ ...prev, shortlisted: prev.shortlisted + (currentStatus ? -1 : 1) }));
    } catch (err: any) {
        console.error(err);
        if (err.name !== 'AbortError') {
          setError("Failed to update team status.");
        }
    }
  };

  const filteredTeams = teams.filter(t => 
    t.teamName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.teamCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
          <div className="relative">
              <div className="w-24 h-24 border-8 border-black border-t-yellow-400 rounded-full animate-spin shadow-[8px_8px_0_#000]" />
              <Database className="absolute inset-0 m-auto w-10 h-10 text-black fill-cyan-400 animate-pulse" />
          </div>
          <p className="font-comic text-2xl tracking-[0.2em] text-black uppercase animate-bounce">Syncing Database Stream...</p>
      </div>
    );
  }

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 min-h-screen">
        
        {/* Connection Status Log */}
        <AnimatePresence>
            {error && (
                <motion.div 
                   initial={{ height: 0, opacity: 0 }}
                   animate={{ height: 'auto', opacity: 1 }}
                   exit={{ height: 0, opacity: 0 }}
                   className="mb-8 bg-red-50 border-4 border-red-500 p-4 rounded-2xl flex items-center gap-4 text-red-700 overflow-hidden shadow-[4px_4px_0_#000]"
                >
                    <AlertTriangle className="w-6 h-6 shrink-0 stroke-[3]" />
                    <p className="font-comic text-lg font-black uppercase tracking-widest leading-none mt-1">{error}</p>
                    <button onClick={fetchData} className="ml-auto bg-black text-white px-4 py-2 rounded-xl text-xs font-black uppercase">REBOOT DATA STREAM</button>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Simplified Header */}
        <section className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
                 <div className="flex items-center gap-3">
                      <div className="bg-yellow-400 p-3 rounded-2xl border-4 border-black shadow-[4px_4px_0_#000]">
                           <Database className="w-6 h-6 text-black fill-black" />
                      </div>
                      <div>
                           <h1 className="text-5xl font-comic text-black tracking-tighter uppercase leading-none drop-shadow-[2px_2px_0_#00f0ff]">
                                Admin Portal?
                           </h1>
                           <p className="text-xs font-black text-gray-500 uppercase tracking-widest mt-1">Live Database Connection Established</p>
                      </div>
                 </div>
            </div>
            
            <div className="flex items-center gap-3">
                 <button 
                   onClick={fetchData}
                   disabled={refreshing}
                   className="h-16 px-8 rounded-2xl bg-white border-4 border-black text-black flex items-center gap-4 font-comic text-lg uppercase tracking-widest shadow-[6px_6px_0_#000] hover:bg-gray-50 active:translate-y-2 active:shadow-none transition-all"
                 >
                      <RefreshCcw className={`w-6 h-6 stroke-[3] ${refreshing ? 'animate-spin' : ''}`} />
                      Refresh Data
                 </button>
            </div>
        </section>

        {/* Improved Stats Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
             {[
                 { label: 'Registered Teams', value: stats.totalTeams, icon: Users, color: 'bg-cyan-400', desc: 'Active Units' },
                 { label: 'PDF Submissions', value: stats.submissions, icon: FileCheck, color: 'bg-pink-400', desc: 'Evaluations' },
                 { label: 'RSVP Checkins', value: stats.confirmed, icon: Check, color: 'bg-green-400', desc: 'Ready Status' },
                 { label: 'Shortlists', value: stats.shortlisted, icon: ShieldCheck, color: 'bg-yellow-400', desc: 'Finalists' }
             ].map((stat, i) => (
                 <div key={i} className="group relative bg-white border-4 border-black p-8 rounded-[2.5rem] shadow-[8px_8px_0_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                      <div className={`absolute -top-4 -right-4 w-16 h-16 ${stat.color} border-4 border-black rounded-2xl flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform shadow-[4px_4px_0_#000]`}>
                          <stat.icon className="w-8 h-8 text-black stroke-[2.5]" />
                      </div>
                      <p className="font-comic text-sm text-gray-400 uppercase tracking-widest mb-4">{stat.label}</p>
                      <div className="flex items-end gap-3">
                           <p className="text-6xl font-comic text-black tracking-tighter leading-none">{stat.value}</p>
                           <div className="text-[10px] font-black uppercase mb-1.5 opacity-40">{stat.desc}</div>
                      </div>
                 </div>
             ))}
        </div>

        {/* Team Activity Table */}
        <div className="bg-white border-4 border-black rounded-[2.5rem] shadow-[12px_12px_0_#000] overflow-hidden">
             <div className="p-8 border-b-4 border-black bg-white flex flex-col md:flex-row items-center gap-8">
                  <div className="relative flex-1 w-full group">
                       <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 text-black opacity-20 group-focus-within:opacity-100 transition-all" />
                       <input 
                          type="text" 
                          placeholder="SCAN TEAMS BY NAME OR CODE..." 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full h-20 pl-16 pr-8 rounded-2xl bg-[#f8f9fa] border-4 border-black font-comic text-2xl uppercase tracking-widest placeholder:text-gray-200 outline-none focus:bg-yellow-50 focus:shadow-[4px_4px_0_#000] transition-all"
                       />
                  </div>
             </div>

             <div className="overflow-x-auto min-h-[400px]">
                  <table className="w-full text-left">
                      <thead>
                          <tr className="bg-white text-[10px] font-black text-black opacity-40 uppercase tracking-[0.3em] border-b-4 border-black">
                              <th className="px-10 py-6">Team Unit</th>
                              <th className="px-10 py-6">Status</th>
                              <th className="px-10 py-6">Shortlisted</th>
                              <th className="px-10 py-6">Submission</th>
                              <th className="px-10 py-6 text-right">View Detail</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y-4 divide-black">
                          {filteredTeams.length > 0 ? (
                              filteredTeams.map((team) => (
                                <tr key={team.id} className="group hover:bg-cyan-50 transition-colors">
                                    <td className="px-10 py-8">
                                        <div 
                                          onClick={() => setSelectedTeam(team)}
                                          className="flex items-center gap-6 cursor-pointer"
                                        >
                                            <div className="w-16 h-16 rounded-2xl bg-black border-4 border-black flex items-center justify-center font-comic text-white text-3xl shadow-[4px_4px_0_#00f0ff] group-hover:scale-105 transition-transform">
                                                {team.teamName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-comic text-3xl text-black tracking-tighter uppercase mb-0.5">{team.teamName}</p>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[10px] font-black text-black bg-yellow-400 px-2 py-0.5 rounded-lg border-2 border-black drop-shadow-[2px_2px_0_#000]">{team.teamCode}</span>
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{team.memberIds.length} Members Registered</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className={`inline-flex h-12 items-center gap-3 px-6 rounded-2xl text-sm font-black uppercase tracking-widest border-4 border-black shadow-[4px_4px_0_#000] ${
                                            team.rsvpStatus === 'confirmed' ? 'bg-green-400' : 'bg-white'
                                        }`}>
                                            <div className={`w-3 h-3 rounded-full ${team.rsvpStatus === 'confirmed' ? 'bg-black animate-pulse' : 'bg-gray-200'}`} />
                                            {team.rsvpStatus}
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <button 
                                          onClick={() => handleShortlist(team.id, team.shortlisted)}
                                          className={`relative inline-flex h-10 w-20 items-center rounded-full border-4 border-black transition-all ${team.shortlisted ? 'bg-pink-500 shadow-[2px_2px_0_#000]' : 'bg-gray-100 shadow-none'}`}
                                        >
                                            <span className={`inline-block h-6 w-6 transform rounded-full bg-white border-2 border-black transition-transform ${team.shortlisted ? 'translate-x-12' : 'translate-x-2'}`} />
                                        </button>
                                    </td>
                                    <td className="px-10 py-8">
                                        {team.submissionUrl ? (
                                             <a 
                                               href={team.submissionUrl} 
                                               target="_blank" 
                                               rel="noreferrer"
                                               className="w-14 h-14 bg-cyan-400 border-4 border-black rounded-2xl flex items-center justify-center hover:-translate-y-1 hover:shadow-[4px_4px_0_#000] active:translate-y-0 transition-all"
                                             >
                                                  <FileCheck className="w-7 h-7 stroke-[2.5]" />
                                             </a>
                                        ) : (
                                            <div className="w-14 h-14 bg-gray-100 border-4 border-black rounded-2xl flex items-center justify-center opacity-20">
                                                 <X className="w-7 h-7" />
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <button 
                                          onClick={() => setSelectedTeam(team)}
                                          className="w-14 h-14 rounded-2xl bg-white border-4 border-black text-black flex items-center justify-center hover:bg-black hover:text-white hover:-translate-y-1 transition-all shadow-[6px_6px_0_#000] active:translate-y-2 active:shadow-none"
                                        >
                                            <ChevronRight className="w-8 h-8 stroke-[3]" />
                                        </button>
                                    </td>
                                </tr>
                              ))
                          ) : (
                              <tr>
                                  <td colSpan={5} className="px-8 py-32 text-center">
                                      <div className="flex flex-col items-center">
                                          <div className="w-24 h-24 bg-gray-50 border-4 border-black rounded-[3rem] flex items-center justify-center mb-6 opacity-20 grayscale">
                                              <Database className="w-12 h-12 text-black" />
                                          </div>
                                          <p className="text-4xl font-comic text-gray-200 uppercase tracking-widest drop-shadow-[2px_2px_0_#000]">Zero Nodes Found</p>
                                          <p className="text-xs font-black text-gray-400 uppercase tracking-[0.4em] mt-4">Database link is vacant</p>
                                      </div>
                                  </td>
                              </tr>
                          )}
                      </tbody>
                  </table>
             </div>
        </div>

        {/* Team Details Modal */}
        <AnimatePresence>
            {selectedTeam && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedTeam(null)}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 50 }}
                        className="bg-[#fffcf0] border-8 border-black w-full max-w-4xl relative z-10 rounded-[4rem] shadow-[20px_20px_0_#ff007f] overflow-hidden"
                    >
                         {/* Modal Header */}
                         <div className="bg-yellow-400 p-8 md:p-12 border-b-8 border-black flex items-center justify-between">
                              <div className="flex items-center gap-6">
                                   <div className="w-24 h-24 bg-white border-8 border-black rounded-[2.5rem] flex items-center justify-center text-4xl font-comic shadow-[8px_8px_0_#000]">
                                       {selectedTeam.teamName.charAt(0)}
                                   </div>
                                   <div>
                                       <h3 className="text-5xl font-comic uppercase tracking-tighter leading-none">{selectedTeam.teamName}</h3>
                                       <p className="text-sm font-black uppercase tracking-widest mt-2">{selectedTeam.teamCode} // ID_{selectedTeam.id.substring(0,8)}</p>
                                   </div>
                              </div>
                              <button 
                                 onClick={() => setSelectedTeam(null)}
                                 className="w-16 h-16 bg-white border-4 border-black rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors shadow-[4px_4px_0_#000] active:translate-y-1 active:shadow-none"
                              >
                                  <X className="w-8 h-8 stroke-[3]" />
                              </button>
                         </div>

                         <div className="p-8 md:p-12 grid md:grid-cols-2 gap-12">
                              {/* Left: Member List */}
                              <div className="space-y-6">
                                   <h4 className="font-comic text-2xl uppercase tracking-widest mb-6 bg-pink-400 border-4 border-black px-4 py-2 inline-block -rotate-1 shadow-[4px_4px_0_#000]">Member Roster</h4>
                                   <div className="space-y-4">
                                        {(selectedTeam.memberProfiles || [])
                                        .filter((p: any) => selectedTeam.memberIds.includes(p.userId))
                                        .map((member: any, i: number) => (
                                            <div key={i} className="bg-white border-4 border-black p-5 rounded-3xl flex items-center gap-4 shadow-[6px_6px_0_#000] group hover:-translate-y-1 transition-transform">
                                                <div className="w-12 h-12 bg-cyan-400 border-4 border-black rounded-xl flex items-center justify-center shrink-0">
                                                     <UserCircle className="w-6 h-6" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-comic text-xl uppercase leading-none truncate">{member.full_name}</p>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                                                        {member.usn} // {member.branch}
                                                    </p>
                                                    {member.phone && (
                                                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-1">
                                                            📞 {member.phone}
                                                        </p>
                                                    )}
                                                </div>
                                                {selectedTeam.leaderId === member.userId && (
                                                    <div className="px-3 py-1 bg-black text-yellow-400 rounded-lg text-[9px] font-black uppercase border-2 border-black transform -rotate-12">Leader</div>
                                                )}
                                            </div>
                                        ))}
                                   </div>
                              </div>

                              {/* Right: Submission & Meta */}
                              <div className="space-y-8">
                                   <div className="bg-white border-4 border-black p-8 rounded-[3rem] shadow-[8px_8px_0_#000] relative isolate overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-6 opacity-5 -z-10 group-hover:scale-110 transition-transform">
                                             <FileCheck className="w-40 h-40" />
                                        </div>
                                        <h4 className="font-comic text-2xl uppercase mb-6 tracking-widest">Team Proposal</h4>
                                        {selectedTeam.submissionUrl ? (
                                             <div className="space-y-4">
                                                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">A PDF documentation node has been detected.</p>
                                                  <a 
                                                    href={selectedTeam.submissionUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="w-full h-16 bg-cyan-400 border-4 border-black rounded-2xl flex items-center justify-center gap-3 font-comic text-xl uppercase tracking-widest shadow-[6px_6px_0_#000] hover:bg-cyan-300 active:translate-y-1 active:shadow-none transition-all"
                                                  >
                                                      <ExternalLink className="w-6 h-6 stroke-[3]" /> View Project Link
                                                  </a>
                                                  <div className="bg-green-50 border-2 border-green-200 p-3 rounded-xl flex items-center gap-2 text-green-700 text-[10px] font-bold uppercase">
                                                       <Check className="w-4 h-4" /> Submission Verified by Admin Protocol
                                                  </div>
                                             </div>
                                        ) : (
                                            <div className="space-y-4">
                                                 <div className="w-20 h-20 bg-gray-50 border-4 border-black rounded-2xl flex items-center justify-center opacity-20 mx-auto">
                                                      <AlertTriangle className="w-10 h-10" />
                                                 </div>
                                                 <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest">No proposal node uploaded yet.</p>
                                            </div>
                                        )}
                                   </div>

                                   <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white border-4 border-black p-4 rounded-2xl text-center shadow-[4px_4px_0_#000]">
                                             <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Check-in Status</p>
                                             <p className="font-comic text-lg uppercase">{selectedTeam.rsvpStatus}</p>
                                        </div>
                                        <div className="bg-white border-4 border-black p-4 rounded-2xl text-center shadow-[4px_4px_0_#000]">
                                             <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Shortlist Rank</p>
                                             <p className="font-comic text-lg uppercase">{selectedTeam.shortlisted ? "ELITE" : "CANDIDATE"}</p>
                                        </div>
                                   </div>
                              </div>
                         </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

        {/* Console Legend */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between text-gray-400 gap-4">
             <div className="flex items-center gap-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.5em]">HackVeda Admin Protocol v4.0</p>
             </div>
             <div className="flex items-center gap-2 bg-white border-4 border-black px-4 py-1.5 rounded-xl shadow-[4px_4px_0_#000] text-black">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <p className="text-[10px] font-black uppercase tracking-widest leading-none">Terminal: {localStorage.getItem('adminEmail')}</p>
             </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

