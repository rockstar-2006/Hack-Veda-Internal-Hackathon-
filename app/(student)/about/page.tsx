"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign, 
  ArrowLeft,
  User,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Countdown } from "@/components/Countdown";

const FACULTY_COORDINATORS = [
  { name: "Dr. Sadanand L", dept: "Associate Professor & HOD, Computer Science" },
  { name: "Dr. Rajesh Nayak", dept: "Associate Professor & HOD, Machine Learning" },
  { name: "Mr. Chandrashekhar Kuthyar", dept: "Assistant Professor (SG), Computer Science" },
  { name: "Mr. Sarvesh S Rao", dept: "Assistant Professor, Data Science" },
  { name: "Dr. Rashmi Samanth", dept: "Assistant Professor (SG), Machine Learning" }
];

const STUDENT_ORGANIZERS = [
  { name: "Abhishek Kini", role: "Club Head, CodeTroopers" },
  { name: "Tejas Nayak", role: "Workbench Head, CodeTroopers" },
  { name: "Pradyumna U", role: "President, IGNITE" },
  { name: "Yashwanth V", role: "President, AIKYA" },
  { name: "Bhushan Poojary", role: "Organizing Committee Member" }
];

const HPL_ANALOGIES = [
  { ipl: "Franchise / Team", hpl: "Squad of 5 under a chosen Team Name & Logo" },
  { ipl: "IPL Season", hpl: "3-week HPL season of continuous building" },
  { ipl: "Match Day", hpl: "Weekly online evaluation rounds on Saturdays" },
  { ipl: "Innings / Overs", hpl: "3 progressive phases of the problem build" },
  { ipl: "Head-to-Head", hpl: "Two squads evaluated directly in their track" },
  { ipl: "Points Table", hpl: "Live leaderboard (Win=3, Tie=1, Loss=0)" },
  { ipl: "Playoffs", hpl: "Top 10 squads qualify for the Finale" },
  { ipl: "Impact Player", hpl: "5th member rotated based on specialized skills" }
];

export default function AboutPage() {
  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 min-h-screen font-sans">

        {/* ─── Page Header Bar ─── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <Link href="/profile" className="flex items-center gap-2 bg-pink-400 text-black px-4 py-2.5 rounded-xl font-comic text-sm uppercase tracking-widest border-4 border-black shadow-[4px_4px_0_#000] hover:-translate-y-0.5 transition-all">
              <ArrowLeft className="w-4 h-4 stroke-[3]" /> BACK
            </Link>
            <div className="flex items-center gap-2 bg-emerald-400 text-black px-3 py-2.5 rounded-xl border-4 border-black shadow-[3px_3px_0_#000]">
              <span>🏏</span>
              <span className="font-comic text-sm tracking-wider uppercase">LEAGUE OVERVIEW</span>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-comic text-black uppercase drop-shadow-[3px_3px_0_#ff007f] leading-none">
            HACKATHON <span className="text-white drop-shadow-[3px_3px_0_#000]">PREMIER LEAGUE</span>
          </h1>
        </div>

        {/* ─── ROW 1: Concept + Countdown ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

          {/* Concept Card (2/3) */}
          <div className="lg:col-span-2 bg-white border-4 border-black p-5 rounded-2xl shadow-[8px_8px_0_#000] relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '16px 16px' }} />
            <h2 className="text-xl font-comic text-black uppercase tracking-wider mb-3 border-b-4 border-black pb-2 relative z-10">The Concept</h2>
            <div className="space-y-3 relative z-10">
              <p className="text-xs font-bold text-gray-800 leading-relaxed">
                Traditional hackathons are fast but cause burnout and rushed solutions. The <strong>Hackathon Premier League (HPL)</strong> combines the structure, drama, and sustained excitement of a sports league with the technical depth of an agile product build.
              </p>
              <p className="text-xs font-bold text-gray-700 leading-relaxed">
                Organized by the <strong>CodeTroopers Club</strong> in collaboration with <strong>IGNITE, AIKYA, IEEE, and ISTE</strong>, HPL unfolds over 3 weeks. Squads build iteratively, climbing a live points table after weekly online head-to-head match days.
              </p>

              {/* Info chips */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                {[
                  { icon: MapPin, label: "VENUE", value: "MBA Block, SMVITM, Udupi", color: "bg-yellow-100" },
                  { icon: Calendar, label: "TIMELINE", value: "Jul 15 – Aug 22, 2026", color: "bg-cyan-100" },
                  { icon: Clock, label: "STRUCTURE", value: "3 Weeks · 2 Online + 1 Offline", color: "bg-pink-100" },
                  { icon: DollarSign, label: "ENTRY", value: "Free Registration via Portal", color: "bg-purple-100" },
                ].map((item, i) => (
                  <div key={i} className={`flex items-center gap-2 ${item.color} p-3 border-2 border-black rounded-xl shadow-[2px_2px_0_#000]`}>
                    <item.icon className="w-5 h-5 text-black shrink-0" />
                    <div>
                      <p className="text-[9px] font-black text-gray-500 uppercase leading-none">{item.label}</p>
                      <p className="text-xs font-black text-black leading-tight mt-0.5">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-black/5 p-3 rounded-xl border-2 border-dashed border-black/20 text-center">
                <span className="font-comic text-[10px] uppercase tracking-widest text-black">ELIGIBILITY: </span>
                <span className="text-[10px] font-black uppercase text-pink-600 tracking-wider">ALL ENGINEERING BRANCHES & YEARS OF SMVITM</span>
              </div>
            </div>
          </div>

          {/* Countdown (1/3) */}
          <div className="flex flex-col gap-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-1 rounded-2xl bg-black shadow-[6px_6px_0_#00f0ff] flex-1"
            >
              <div className="bg-white p-3 rounded-[18px] h-full flex flex-col items-center justify-center text-center gap-2">
                <Countdown targetDate="2026-08-08T10:00:00" label="HPL MATCH DAY 1 STARTS IN" compact={true} />
              </div>
            </motion.div>
          </div>

        </div>

        {/* ─── ROW 2: Analogy + Organizers ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

          {/* IPL Analogy Table (3/5) */}
          <div className="lg:col-span-3 bg-yellow-300 border-4 border-black p-5 rounded-2xl shadow-[8px_8px_0_#000] relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '16px 16px' }} />
            <h2 className="text-xl font-comic text-black uppercase tracking-wider mb-3 border-b-4 border-black pb-2 relative z-10">🏏 The HPL Play Analogy</h2>
            <p className="text-[10px] font-bold text-gray-800 mb-3 bg-white p-2 border-2 border-black rounded-xl relative z-10">
              How we map the IPL's thrilling environment into software creation:
            </p>
            <div className="space-y-1.5 relative z-10">
              {HPL_ANALOGIES.map((a, idx) => (
                <div key={idx} className="grid grid-cols-5 gap-2 bg-white p-2 border-2 border-black rounded-xl shadow-[2px_2px_0_#000] items-center text-[10px] font-bold">
                  <div className="col-span-2 text-pink-600 uppercase tracking-wider border-r border-gray-200 pr-2">{a.ipl}</div>
                  <div className="col-span-3 text-black pl-1">{a.hpl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Organizers (2/5) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Faculty */}
            <div className="bg-cyan-400 border-4 border-black p-4 rounded-2xl shadow-[6px_6px_0_#000] relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '16px 16px' }} />
              <h2 className="text-base font-comic text-black uppercase tracking-wider mb-3 border-b-4 border-black pb-2 relative z-10">Faculty Coordinators</h2>
              <div className="space-y-2 relative z-10">
                {FACULTY_COORDINATORS.map((c, idx) => (
                  <div key={idx} className="bg-white p-2.5 border-2 border-black rounded-xl shadow-[2px_2px_0_#000] flex items-center gap-2.5">
                    <div className="bg-pink-400 p-1.5 rounded-lg border-2 border-black shadow-[1.5px_1.5px_0_#000] shrink-0">
                      <User className="w-3.5 h-3.5 text-black stroke-[3]" />
                    </div>
                    <div>
                      <h4 className="font-comic text-sm text-black leading-none">{c.name}</h4>
                      <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mt-0.5 leading-tight">{c.dept}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Students */}
            <div className="bg-pink-400 border-4 border-black p-4 rounded-2xl shadow-[6px_6px_0_#000] relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '16px 16px' }} />
              <h2 className="text-base font-comic text-black uppercase tracking-wider mb-3 border-b-4 border-black pb-2 relative z-10">Student Organizers</h2>
              <div className="space-y-2 relative z-10">
                {STUDENT_ORGANIZERS.map((o, idx) => (
                  <div key={idx} className="bg-white p-2.5 border-2 border-black rounded-xl shadow-[2px_2px_0_#000] flex items-center gap-2.5">
                    <div className="bg-yellow-300 p-1.5 rounded-lg border-2 border-black shadow-[1.5px_1.5px_0_#000] shrink-0">
                      <User className="w-3.5 h-3.5 text-black stroke-[3]" />
                    </div>
                    <div>
                      <h4 className="font-comic text-sm text-black leading-none">{o.name}</h4>
                      <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mt-0.5 leading-tight">{o.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </ProtectedRoute>
  );
}
