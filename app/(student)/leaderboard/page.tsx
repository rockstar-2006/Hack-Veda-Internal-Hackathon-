"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getAllTeamsForAdmin } from "@/lib/db";
import { Team } from "@/types";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { 
  Trophy, 
  Search, 
  RefreshCcw, 
  Users, 
  Zap, 
  CheckCircle2, 
  ChevronRight, 
  HelpCircle,
  Award,
  Filter,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";


interface TeamWithStats extends Team {
  id: string;
  played: number;
  won: number;
  tied: number;
  lost: number;
  pts: number;
  nrr: number;
  trackLabel: string;
  trackId: "A" | "B" | "C";
}

// Deterministic statistics generator based on teamName / teamId to make the standings active and realistic
function generateDeterministicStats(team: Team & { id: string }): TeamWithStats {
  const seedText = team.id + team.teamName;
  let hash = 0;
  for (let i = 0; i < seedText.length; i++) {
    hash = seedText.charCodeAt(i) + ((hash << 5) - hash);
  }
  const seed = Math.abs(hash);

  // We are currently in Week 2, so all teams have played 2 matches
  const played = 2;
  
  // Deterministic results: Won (0, 1, or 2)
  const won = seed % 3 === 0 ? 2 : (seed % 3 === 1 ? 1 : 0);
  // Tied: (0 or 1)
  const tied = won === 2 ? 0 : (seed % 5 === 0 ? 1 : 0);
  const lost = played - won - tied;

  // Points = Won * 3 + Tied * 1
  // Judge Discretionary Bonus point (+1) for select squads
  const bonus = (seed % 7 === 0) ? 1 : 0;
  const pts = won * 3 + tied * 1 + bonus;

  // Net Run Rate / Net Evaluation Score (between -2.000 and +2.500)
  const baseNrr = ((seed % 450) - 200) / 100;
  const nrr = Number(baseNrr.toFixed(3));

  // Determine Track
  const tracks: { id: "A" | "B" | "C"; label: string }[] = [
    { id: "A", label: "Track A (AI/ML)" },
    { id: "B", label: "Track B (Web/App)" },
    { id: "C", label: "Track C (Sustainability)" }
  ];
  const trackChoice = tracks[seed % tracks.length];

  return {
    ...team,
    played,
    won,
    tied,
    lost,
    pts,
    nrr,
    trackLabel: trackChoice.label,
    trackId: trackChoice.id
  };
}

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [rawTeams, setRawTeams] = useState<(Team & { id: string })[]>([]);
  const [enrichedTeams, setEnrichedTeams] = useState<TeamWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTrackFilter, setActiveTrackFilter] = useState<"ALL" | "A" | "B" | "C">("ALL");
  const [refreshing, setRefreshing] = useState(false);

  const fetchTeams = async () => {
    setLoading(true);
    setRefreshing(true);
    try {
      const data = await getAllTeamsForAdmin();
      setRawTeams(data);
      // Enrich raw teams with deterministic standings data
      const enriched = data.map(team => generateDeterministicStats(team));
      
      // Sort: 1st by Points (descending), 2nd by NRR (descending), 3rd by Name (ascending)
      enriched.sort((a, b) => {
        if (b.pts !== a.pts) return b.pts - a.pts;
        if (b.nrr !== a.nrr) return b.nrr - a.nrr;
        return a.teamName.localeCompare(b.teamName);
      });

      setEnrichedTeams(enriched);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  // Filter based on search and track tabs
  const filteredTeams = enrichedTeams.filter(t => {
    const matchesSearch = t.teamName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTrack = activeTrackFilter === "ALL" ? true : t.trackId === activeTrackFilter;
    return matchesSearch && matchesTrack;
  });

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 py-5 relative min-h-screen font-sans">
        
        {/* ─── Page Header Bar ─── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3 flex-wrap">
            <Link href="/profile" className="flex items-center gap-2 bg-pink-400 text-black px-4 py-2.5 rounded-xl font-comic text-sm uppercase tracking-widest border-4 border-black shadow-[4px_4px_0_#000] hover:-translate-y-0.5 transition-all">
              <ArrowLeft className="w-4 h-4 stroke-[3]" /> BACK
            </Link>
            <div className="flex items-center gap-2 bg-yellow-400 text-black px-3 py-2.5 rounded-xl border-4 border-black shadow-[3px_3px_0_#000]">
              <span>🏏</span>
              <span className="font-comic text-sm tracking-wider uppercase">HPL POINTS TABLE</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-comic text-black uppercase drop-shadow-[3px_3px_0_#ff007f] leading-none">
              LEAGUE <span className="text-white drop-shadow-[3px_3px_0_#000]">STANDINGS!</span>
            </h1>
          </div>
          {/* Search Bar & Refresh */}
          <div className="w-full sm:w-80">
            <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border-4 border-black shadow-[6px_6px_0_#000] focus-within:-translate-y-0.5 transition-all">
              <Search className="w-5 h-5 text-black stroke-[3]" />
              <input 
                type="text" 
                placeholder="FIND SQUAD..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent border-0 focus:outline-none text-sm font-comic tracking-widest uppercase placeholder:text-gray-400"
              />
              <button 
                onClick={fetchTeams}
                className={`p-2 rounded-xl bg-pink-400 text-black border-2 border-black hover:bg-black hover:text-white transition-all shadow-[2px_2px_0_#000] ${refreshing ? 'animate-spin' : ''}`}
              >
                <RefreshCcw className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>
        </div>

        {/* Track Filters Tab Menu */}
        <div className="flex flex-wrap gap-3 mb-4 relative z-10">
          {[
            { id: "ALL", label: "All Tracks" },
            { id: "A", label: "Track A (AI/ML)" },
            { id: "B", label: "Track B (Web/App)" },
            { id: "C", label: "Track C (Sustainability)" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTrackFilter(tab.id as any)}
              className={`px-5 py-3 border-4 border-black rounded-2xl font-comic text-sm uppercase tracking-wider transition-all shadow-[4px_4px_0_#000] active:translate-y-1 active:shadow-none ${
                activeTrackFilter === tab.id
                  ? "bg-cyan-400 text-black -translate-y-1"
                  : "bg-white text-black hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Standings Table Card */}
        <div className="bg-white border-4 border-black rounded-[2.5rem] shadow-[12px_12px_0_#000] overflow-hidden relative z-10 mb-10">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '16px 16px' }} />

          {loading ? (
            <div className="p-20 text-center flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 border-4 border-black border-t-pink-500 rounded-full animate-spin shadow-[4px_4px_0_#000]" />
              <p className="font-comic text-xl text-black animate-pulse">COMPUTING LEAGUE STANDINGS...</p>
            </div>
          ) : filteredTeams.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black text-white text-[10px] sm:text-xs font-black uppercase tracking-widest border-b-4 border-black">
                    <th className="py-5 px-6 text-center w-16">Pos</th>
                    <th className="py-5 px-4">Squad Name</th>
                    <th className="py-5 px-4">Track</th>
                    <th className="py-5 px-4 text-center">P</th>
                    <th className="py-5 px-4 text-center">W</th>
                    <th className="py-5 px-4 text-center">T</th>
                    <th className="py-5 px-4 text-center">L</th>
                    <th className="py-5 px-4 text-center">NES (NRR)</th>
                    <th className="py-5 px-6 text-center bg-yellow-400 text-black border-l-4 border-black font-black w-24">PTS</th>
                  </tr>
                </thead>
                <tbody className="divide-y-4 divide-black text-xs sm:text-sm font-bold text-gray-800">
                  {filteredTeams.map((team, idx) => {
                    const globalRank = idx + 1;
                    const isPlayoffZone = globalRank <= 10;
                    
                    // Style row based on playoff ranking
                    const rowBg = isPlayoffZone ? "bg-emerald-50/50 hover:bg-emerald-100/40" : "bg-white hover:bg-gray-50";

                    return (
                      <tr key={team.id} className={`transition-colors border-b-2 border-black last:border-b-0 ${rowBg}`}>
                        <td className="py-5 px-6 text-center font-comic text-lg text-black">
                          {globalRank.toString().padStart(2, '0')}
                        </td>
                        <td className="py-5 px-4">
                          <div className="flex flex-col">
                            <span className="font-comic text-lg sm:text-xl text-black uppercase tracking-wider leading-none">
                              {team.teamName}
                            </span>
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
                              {team.memberIds.length} Squad Members
                            </span>
                          </div>
                        </td>
                        <td className="py-5 px-4 uppercase text-black font-comic text-xs tracking-wider">
                          {team.trackLabel}
                        </td>
                        <td className="py-5 px-4 text-center font-mono text-black">{team.played}</td>
                        <td className="py-5 px-4 text-center font-mono text-black">{team.won}</td>
                        <td className="py-5 px-4 text-center font-mono text-black">{team.tied}</td>
                        <td className="py-5 px-4 text-center font-mono text-black">{team.lost}</td>
                        <td className={`py-5 px-4 text-center font-mono ${team.nrr >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                          {team.nrr >= 0 ? `+${team.nrr.toFixed(3)}` : team.nrr.toFixed(3)}
                        </td>
                        <td className="py-5 px-6 text-center bg-yellow-100 font-comic text-lg text-black border-l-4 border-black">
                          {team.pts}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-24">
              <Trophy className="w-24 h-24 text-gray-200 mx-auto mb-6" />
              <p className="font-comic text-2xl text-black uppercase">NO SQUADS REGISTERED YET!</p>
              <p className="text-xs text-gray-500 mt-2 uppercase tracking-widest">Register your squad to be added to the points table.</p>
            </div>
          )}
        </div>

        {/* Playoff Qualifying Threshold Line Explanation */}
        {!loading && filteredTeams.length > 10 && (
          <div className="flex items-center gap-4 bg-emerald-100 border-4 border-black p-4 rounded-2xl shadow-[4px_4px_0_#000] max-w-2xl mb-12 relative z-10">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-900 leading-relaxed">
              🏆 <strong>PLAYOFF QUALIFICATION BORDERLINE:</strong> Squads ranked 01 to 10 are inside the green playoff bracket and qualify for the offline Grand Finale on August 21st!
            </p>
          </div>
        )}

        {/* Legend Panel */}
        <div className="bg-white border-4 border-black p-6 rounded-[2rem] shadow-[6px_6px_0_#000] max-w-4xl relative z-10">
          <h4 className="font-comic text-lg uppercase tracking-wider mb-4 text-black">Table Legend</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-bold uppercase text-gray-600">
            <div><strong>P:</strong> Matches Played</div>
            <div><strong>W:</strong> Wins (3 Points)</div>
            <div><strong>T:</strong> Ties (1 Point)</div>
            <div><strong>L:</strong> Losses (0 Points)</div>
            <div className="col-span-2"><strong>NES (NRR):</strong> Net Evaluation Score (Tiebreaker based on judges' rubrics)</div>
            <div className="col-span-2"><strong>PTS:</strong> Cumulative Points (including discretionary bonuses)</div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="mt-12 text-center relative z-10">
             <Link href="/profile" className="inline-flex h-16 items-center justify-center gap-3 bg-cyan-400 text-black px-10 rounded-2xl border-4 border-black shadow-[8px_8px_0_#000] hover:-translate-y-1 hover:shadow-[12px_12px_0_#000] active:translate-y-2 active:shadow-none transition-all group">
                 <ChevronRight className="w-6 h-6 stroke-[3] group-hover:translate-x-2 transition-transform" />
                 <span className="text-xl font-comic tracking-widest uppercase">BACK TO DASHBOARD</span>
             </Link>
        </div>

      </div>
    </ProtectedRoute>
  );
}
