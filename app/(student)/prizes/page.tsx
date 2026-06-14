"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { 
  Trophy, 
  ArrowLeft, 
  Award, 
  Star, 
  ThumbsUp,
  User,
  TrendingUp
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const PRIZES = [
  {
    place: "HPL Champions",
    amount: "₹10,000",
    description: "Highest cumulative match points + final evaluation score.",
    color: "bg-yellow-400",
    icon: Trophy,
    badge: "CHAMPIONS CUP",
    badgeColor: "bg-black text-white",
    span: "md:col-span-1"
  },
  {
    place: "Runner-Up Squad",
    amount: "₹6,000",
    description: "Exceptional product engineering, sprint consistency, and strong finale demo.",
    color: "bg-cyan-400",
    icon: Award,
    badge: "RUNNERS TROPHY",
    badgeColor: "bg-black text-white",
    span: "md:col-span-1"
  },
  {
    place: "2nd Runner-Up",
    amount: "₹4,000",
    description: "Third place finish with high quality execution and clear pitch performance.",
    color: "bg-pink-400",
    icon: Award,
    badge: "2ND RUNNER CUP",
    badgeColor: "bg-black text-white",
    span: "md:col-span-1"
  },
  {
    place: "Player of the Match",
    amount: "₹2,000 / Match Day",
    description: "Outstanding individual leadership or execution in Match Days 1 & 2.",
    color: "bg-purple-400",
    icon: User,
    badge: "MVP ACCOLADE",
    badgeColor: "bg-black text-white",
    span: "md:col-span-1"
  },
  {
    place: "Best Debutant",
    amount: "₹2,000",
    description: "Special recognition for 2nd year students showing the most impressive growth.",
    color: "bg-emerald-400",
    icon: Star,
    badge: "ROOKIE OF THE YEAR",
    badgeColor: "bg-black text-white",
    span: "md:col-span-1"
  },
  {
    place: "Best Comeback Squad",
    amount: "₹2,000",
    description: "Highest positive variance in standings from Week 1 to Week 3.",
    color: "bg-indigo-400",
    icon: TrendingUp,
    badge: "MOST IMPROVED",
    badgeColor: "bg-white text-black",
    span: "md:col-span-1"
  }
];

const PERKS = [
  "Official Certificates",
  "1-on-1 Expert Mentorship",
  "Meals & Night Snacks",
  "SMVITM Wi-Fi Coverage"
];

export default function PrizesPage() {
  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 min-h-screen font-sans">

        {/* ─── Page Header Bar ─── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <Link href="/profile" className="flex items-center gap-2 bg-pink-400 text-black px-4 py-2.5 rounded-xl font-comic text-sm uppercase tracking-widest border-4 border-black shadow-[4px_4px_0_#000] hover:-translate-y-0.5 transition-all">
              <ArrowLeft className="w-4 h-4 stroke-[3]" /> BACK
            </Link>
            <div className="flex items-center gap-2 bg-pink-400 text-black px-3 py-2.5 rounded-xl border-4 border-black shadow-[3px_3px_0_#000]">
              <span>🏆</span>
              <span className="font-comic text-sm tracking-wider uppercase">CHAMPIONS REWARDS</span>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-comic text-black uppercase drop-shadow-[3px_3px_0_#00f0ff] leading-none">
            LEAGUE REWARDS: <span className="text-white drop-shadow-[3px_3px_0_#000]">₹30,000!</span>
          </h1>
        </div>

        {/* ─── Prize Pool Hero Banner ─── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-5 bg-yellow-400 border-4 border-black p-5 md:p-6 rounded-3xl shadow-[8px_8px_0_#000] relative overflow-hidden group hover:rotate-1 transition-all duration-300"
        >
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '20px 20px' }} />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
            <div>
              <span className="bg-white text-black font-black uppercase text-[10px] tracking-widest px-3 py-1.5 border-2 border-black rounded-full shadow-[2px_2px_0_#000]">
                HPL SEASON 1 PRIZE SHEET
              </span>
              <h2 className="text-3xl md:text-5xl font-comic text-black uppercase leading-none tracking-wider mt-2 drop-shadow-[2px_2px_0_#fff]">
                TOTAL PRIZE POOL
              </h2>
              <p className="text-xl md:text-2xl font-comic text-white drop-shadow-[2px_2px_0_#000] uppercase tracking-widest">
                Rs. 30,000 Cash
              </p>
            </div>
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-white border-4 border-black flex items-center justify-center shadow-[6px_6px_0_#000] group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500 relative shrink-0">
              <Trophy className="w-14 h-14 text-black fill-yellow-400 stroke-[2.5]" />
              <div className="absolute -top-2 -right-2 bg-pink-500 text-white font-black text-[9px] px-2 py-1 rounded-lg border-2 border-black rotate-12 shadow-[2px_2px_0_#000] animate-bounce">WIN BIG!</div>
            </div>
          </div>
        </motion.div>

        {/* ─── Prize Cards Grid (3-col) ─── */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5">
          {PRIZES.map((prize, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`p-5 rounded-2xl border-4 border-black ${prize.color} shadow-[6px_6px_0_#000] hover:shadow-[10px_10px_0_#000] transition-all flex flex-col justify-between min-h-[180px] relative overflow-hidden group`}
            >
              <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '16px 16px' }} />
              <div className="flex justify-between items-start mb-3 relative z-10">
                <span className={`${prize.badgeColor} font-black text-[8px] md:text-[9px] tracking-widest px-2 py-1 border-2 border-black rounded-lg shadow-[1px_1px_0_#fff]`}>
                  {prize.badge}
                </span>
                <div className="w-10 h-10 bg-white border-2 border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0_#000] group-hover:rotate-12 transition-transform duration-300">
                  <prize.icon className="w-5 h-5 text-black stroke-[2.5]" />
                </div>
              </div>
              <div className="relative z-10">
                <h3 className="text-sm font-bold uppercase tracking-wide mb-0.5">{prize.place}</h3>
                <h4 className="text-2xl md:text-3xl font-comic text-black uppercase tracking-widest mb-2 drop-shadow-[1.5px_1.5px_0_#fff] leading-none">
                  {prize.amount}
                </h4>
                <p className="text-[10px] md:text-xs font-bold text-gray-800 leading-relaxed bg-white/70 p-2 border-2 border-black rounded-xl">
                  {prize.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ─── Perks Strip ─── */}
        <div className="bg-white border-4 border-black p-4 rounded-2xl shadow-[6px_6px_0_#000] flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-2 mr-2">
            <Star className="w-5 h-5 text-black fill-yellow-400" />
            <span className="font-comic text-sm uppercase tracking-wider text-black">Squad Benefits</span>
            <Star className="w-5 h-5 text-black fill-cyan-400" />
          </div>
          {PERKS.map((benefit, bIdx) => (
            <div key={bIdx} className="flex items-center gap-2 bg-cyan-100 px-3 py-2 border-2 border-black rounded-xl shadow-[2px_2px_0_#000] hover:scale-105 hover:bg-cyan-200 transition-all">
              <ThumbsUp className="w-4 h-4 text-black stroke-[3]" />
              <span className="text-xs font-black uppercase tracking-widest text-black">{benefit}</span>
            </div>
          ))}
        </div>

      </div>
    </ProtectedRoute>
  );
}
