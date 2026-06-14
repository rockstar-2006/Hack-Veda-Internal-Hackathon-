"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { 
  ArrowLeft, 
  Zap, 
  ShieldCheck, 
  CheckCircle,
  Info,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const TRACKS = [
  {
    id: 1,
    num: "TRACK A",
    title: "AI & Machine Learning",
    description: "Develop smart automation systems, prediction engines, agentic applications, or intelligent algorithms targeting local real-world problems.",
    color: "bg-cyan-400",
  },
  {
    id: 2,
    num: "TRACK B",
    title: "Web & App Development",
    description: "Build robust full-stack web platforms, mobile apps, booking tools, or campus management dashboards to streamline operations.",
    color: "bg-pink-400",
  },
  {
    id: 3,
    num: "TRACK C",
    title: "Sustainability & Social Impact",
    description: "Design solutions for clean energy, waste management, carbon reduction, water conservation, and community health services.",
    color: "bg-yellow-400",
  }
];

const RULES = [
  {
    category: "Squad Configuration",
    icon: "🧑‍🤝‍🧑",
    items: [
      "Each Squad must consist of exactly 5 members: 4 Core Members + 1 Impact Player.",
      "The Impact Player can be rotated in/out for different phases.",
      "Only the Squad Leader registers the squad and adds teammates.",
    ]
  },
  {
    category: "League Progression (3 Weeks)",
    icon: "📅",
    items: [
      "HPL runs as a continuous season over three weeks with three progressive phases.",
      "Squads build on their work incrementally — mimicking agile sprints.",
      "Match Days 1 & 2 are online. The Grand Finale (Week 3) is offline.",
    ]
  },
  {
    category: "Match Days & Scoring",
    icon: "🏏",
    items: [
      "Squads are paired into weekly head-to-head fixtures within their track.",
      "Win = 3 PTS · Tie = 1 PT · Loss = 0 PTS. Bonus +1 at judges' discretion.",
      "Net Evaluation Score (NES) is the tiebreaker — same as NRR in the IPL.",
    ]
  },
  {
    category: "Playoffs & Grand Finale",
    icon: "🏆",
    items: [
      "A live Points Table is maintained throughout the season.",
      "Top 10 squads after Week 2 qualify for the offline Grand Finale.",
      "Finalists present their integrated Phase 3 build live before a jury panel.",
    ]
  }
];

export default function RulesPage() {
  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 min-h-screen font-sans">

        {/* ─── Page Header Bar ─── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <Link href="/profile" className="flex items-center gap-2 bg-pink-400 text-black px-4 py-2.5 rounded-xl font-comic text-sm uppercase tracking-widest border-4 border-black shadow-[4px_4px_0_#000] hover:-translate-y-0.5 transition-all">
              <ArrowLeft className="w-4 h-4 stroke-[3]" /> BACK
            </Link>
            <div className="flex items-center gap-2 bg-yellow-400 text-black px-3 py-2.5 rounded-xl border-4 border-black shadow-[3px_3px_0_#000]">
              <span>🏏</span>
              <span className="font-comic text-sm tracking-wider uppercase">LEAGUE PLAYBOOK</span>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-comic text-black uppercase drop-shadow-[3px_3px_0_#00f0ff] leading-none">
            TRACKS & <span className="text-white drop-shadow-[3px_3px_0_#000]">PLAYBOOK!</span>
          </h1>
        </div>

        {/* ─── Phase Release Notice ─── */}
        <div className="mb-5 bg-white border-4 border-black p-4 rounded-2xl shadow-[6px_6px_0_#000] flex items-center gap-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '12px 12px' }} />
          <div className="w-12 h-12 rounded-xl bg-cyan-400 border-4 border-black flex items-center justify-center shrink-0 shadow-[3px_3px_0_#000] animate-pulse relative z-10">
            <Info className="w-6 h-6 text-black stroke-[3]" />
          </div>
          <div className="relative z-10">
            <h3 className="font-comic text-lg text-black uppercase tracking-widest">Phase Release Calendar</h3>
            <p className="font-bold text-gray-700 text-xs leading-relaxed mt-0.5">
              Problem statements split into 3 phases. Phase 1 releases on Match Day 1; subsequent phases release after each scoring round.
            </p>
          </div>
        </div>

        {/* ─── Tracks Grid (3 col) ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          {TRACKS.map((track) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className={`p-5 rounded-2xl border-4 border-black ${track.color} shadow-[6px_6px_0_#000] hover:shadow-[10px_10px_0_#000] transition-all relative overflow-hidden`}
            >
              <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '16px 16px' }} />
              <div className="flex justify-between items-center mb-3 relative z-10">
                <div className="bg-white text-black px-3 py-1 border-2 border-black rounded-lg text-xs font-black font-comic shadow-[2px_2px_0_#000]">
                  {track.num}
                </div>
                <Zap className="w-5 h-5 text-black fill-black opacity-30" />
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-comic text-black uppercase tracking-wide mb-2 leading-tight">
                  {track.title}
                </h3>
                <p className="text-xs font-bold text-gray-800 leading-relaxed bg-white/70 p-2.5 border-2 border-black rounded-xl">
                  {track.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ─── Rules Grid (2x2) ─── */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-6 h-6 text-black fill-pink-500" />
            <h2 className="text-xl font-comic text-black uppercase tracking-wider">Rules & Scoring Playbook</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {RULES.map((section, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white border-4 border-black p-5 rounded-2xl shadow-[6px_6px_0_#000] relative overflow-hidden"
              >
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '16px 16px' }} />
                <h3 className="text-base font-comic text-black uppercase tracking-wide mb-3 flex items-center gap-2 relative z-10">
                  <span>{section.icon}</span> {section.category}
                </h3>
                <ul className="space-y-2.5 relative z-10">
                  {section.items.map((rule, ruleIdx) => (
                    <li key={ruleIdx} className="flex items-start gap-3">
                      <div className="mt-0.5 bg-pink-400 border-2 border-black rounded-md p-0.5 shrink-0 shadow-[1.5px_1.5px_0_#000]">
                        <CheckCircle className="w-3.5 h-3.5 text-black stroke-[3.5]" />
                      </div>
                      <span className="text-xs font-bold text-gray-800 leading-relaxed">{rule}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </ProtectedRoute>
  );
}
