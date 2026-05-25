"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { 
  Trophy, 
  ArrowLeft, 
  Zap, 
  Sparkles, 
  Award, 
  Gift, 
  Star, 
  BadgeAlert,
  ThumbsUp
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const PRIZES = [
  {
    place: "1st Place",
    amount: "Rs. 10,000",
    description: "The ultimate champions. Awarded to the team with the most innovative, functional, and well-executed prototype.",
    color: "bg-yellow-400 border-black",
    icon: Trophy,
    iconColor: "text-black fill-yellow-200",
    badge: "GRAND CHAMPION",
    badgeColor: "bg-black text-white"
  },
  {
    place: "2nd Place",
    amount: "Rs. 6,000",
    description: "First runners-up. Awarded for exceptional engineering, clean architecture, and impressive problem-solving capabilities.",
    color: "bg-cyan-400 border-black",
    icon: Award,
    iconColor: "text-black fill-cyan-100",
    badge: "SILVER RUNNER",
    badgeColor: "bg-black text-white"
  },
  {
    place: "3rd Place",
    amount: "Rs. 4,000",
    description: "Second runners-up. Awarded for strong technical implementation, user experience design, and clear presentation.",
    color: "bg-pink-400 border-black",
    icon: Award,
    iconColor: "text-black fill-pink-200",
    badge: "BRONZE RUNNER",
    badgeColor: "bg-black text-white"
  },
  {
    place: "Consolation Prizes",
    amount: "Rs. 2,000 x 5",
    description: "Theme Winners. Rs. 2,000 each awarded to the best performing team in each of the 5 hackathon themes (Rs. 10,000 total pool).",
    color: "bg-purple-400 border-black",
    icon: Gift,
    iconColor: "text-black fill-purple-200",
    badge: "THEME CHAMPIONS",
    badgeColor: "bg-black text-white"
  }
];

export default function PrizesPage() {
  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 md:py-4 min-h-screen pb-16 relative font-sans overflow-hidden">
        
        {/* Background Decorative Elements */}
        <div className="absolute top-20 left-20 opacity-5 animate-pulse pointer-events-none">
          <Zap className="w-96 h-96 text-black rotate-12" />
        </div>
        <div className="absolute bottom-20 right-20 opacity-5 animate-bounce pointer-events-none">
          <Sparkles className="w-96 h-96 text-black -rotate-12" />
        </div>

        {/* Back Button */}
        <div className="mb-6 text-center relative z-10 w-full">
          <Link href="/profile" className="inline-flex items-center gap-3 bg-pink-400 text-black px-6 py-3 rounded-xl font-comic text-xl uppercase tracking-widest border-4 border-black hover:-translate-y-1 hover:shadow-[6px_6px_0_#000] shadow-[4px_4px_0_#000] transition-all active:translate-y-1 active:shadow-none mb-12">
            <ArrowLeft className="w-5 h-5 stroke-[3]" />
            BACK TO DASHBOARD
          </Link>
        </div>

        {/* Header Section */}
        <div className="text-center mb-6 md:mb-8 relative z-10">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 bg-pink-400 text-black px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-widest mb-6 border-4 border-black shadow-[4px_4px_0_#000] rotate-2"
          >
            <Trophy className="w-5 h-5 text-black fill-yellow-400" />
            HACKATHON REWARDS
          </motion.div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-comic text-black leading-none tracking-widest uppercase mb-4 drop-shadow-[4px_4px_0_#00f0ff]">
            PRIZE POOL: <br />
            <span className="text-white drop-shadow-[4px_4px_0_#000]">RS. 30,000!</span>
          </h1>
          <p className="bg-white p-3 inline-block border-4 border-black rounded-xl text-sm font-bold text-gray-800 shadow-[4px_4px_0_#ff007f] transform -rotate-1 mx-auto max-w-xl">
            Compete, excel, and win prizes for outstanding innovation and development.
          </p>
        </div>

        {/* Prize Pool Display Block */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-8 md:mb-10 bg-yellow-400 border-4 md:border-8 border-black p-8 md:p-16 rounded-[2.5rem] md:rounded-[3.5rem] shadow-[10px_10px_0_#000] md:shadow-[20px_20px_0_#000] relative z-10 max-w-4xl mx-auto overflow-hidden group hover:rotate-1 transition-all duration-300"
        >
          {/* Halftone pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '20px 20px' }} />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <span className="bg-white text-black font-black uppercase text-[10px] md:text-xs tracking-widest px-4 py-2 border-2 border-black rounded-full shadow-[2px_2px_0_#000] mb-4">
                SMVITM COLLABORATIVE HACKATHON
              </span>
              <h2 className="text-4xl md:text-6xl font-comic text-black uppercase leading-none tracking-wider mb-4 drop-shadow-[2px_2px_0_#fff]">
                TOTAL PRIZES
              </h2>
              <p className="text-2xl md:text-4xl font-comic text-white drop-shadow-[3px_3px_0_#000] uppercase tracking-widest">
                Rs. 30,000 Pool Cash!
              </p>
            </div>
            
            <div className="w-36 h-36 md:w-48 md:h-48 rounded-3xl bg-white border-4 border-black flex items-center justify-center shadow-[6px_6px_0_#000] group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500 relative">
              <Trophy className="w-20 h-20 md:w-28 md:h-28 text-black fill-yellow-400 stroke-[2.5]" />
              <div className="absolute -top-3 -right-3 bg-pink-500 text-white font-black text-[10px] px-3 py-1.5 rounded-lg border-2 border-black rotate-12 shadow-[2px_2px_0_#000] animate-bounce">
                WIN BIG!
              </div>
            </div>
          </div>
        </motion.div>

        {/* Individual Rewards Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-8 relative z-10">
          {PRIZES.map((prize, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`p-8 rounded-3xl border-4 ${prize.color} shadow-[8px_8px_0_#000] hover:shadow-[16px_16px_0_#000] transition-all flex flex-col justify-between min-h-[300px] relative overflow-hidden group`}
            >
              {/* Halftone */}
              <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '16px 16px' }} />
              
              <div className="flex justify-between items-start mb-6 relative z-10">
                <span className={`${prize.badgeColor} font-black text-[9px] md:text-[10px] tracking-widest px-3 py-1.5 border-2 border-black rounded-lg shadow-[2px_2px_0_#fff]`}>
                  {prize.badge}
                </span>
                <div className="w-14 h-14 bg-white border-3 border-black rounded-2xl flex items-center justify-center shadow-[3px_3px_0_#000] group-hover:rotate-12 transition-transform duration-300">
                  <prize.icon className={`w-8 h-8 ${prize.iconColor} stroke-[2.5]`} />
                </div>
              </div>

              <div className="relative z-10">
                <h3 className="text-lg md:text-xl font-bold uppercase text-gray-800 tracking-wider mb-1">
                  {prize.place}
                </h3>
                <h4 className="text-3xl md:text-5xl font-comic text-black uppercase tracking-widest mb-3 drop-shadow-[2px_2px_0_#fff] leading-none">
                  {prize.amount}
                </h4>
                <p className="text-xs md:text-sm font-bold text-gray-800 leading-relaxed bg-white/70 p-3 border-2 border-black rounded-xl">
                  {prize.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Perks Block */}
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-10">
            <Star className="w-6 h-6 text-black fill-yellow-400 animate-spin-slow" />
            <h2 className="text-2xl md:text-4xl font-comic text-black uppercase tracking-wider text-center drop-shadow-[2.5px_2.5px_0_#fff]">
              PARTICIPATION BENEFITS
            </h2>
            <Star className="w-6 h-6 text-black fill-cyan-400 animate-spin-slow" />
          </div>

          <div className="bg-white border-4 border-black p-6 md:p-10 rounded-[2rem] shadow-[8px_8px_0_#000] flex flex-wrap items-center justify-around gap-6">
            {[
              "Official Certificate",
              "Expert Mentorship",
              "Food & Snacks Provided",
              "High-Speed Wi-Fi Access"
            ].map((benefit, bIdx) => (
              <div key={bIdx} className="flex items-center gap-3 bg-cyan-100 p-3 px-5 border-2 border-black rounded-xl shadow-[3px_3px_0_#000] hover:scale-105 hover:bg-cyan-200 transition-all">
                <ThumbsUp className="w-5 h-5 text-black stroke-[3]" />
                <span className="text-xs md:text-sm font-black uppercase tracking-widest text-black">
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Link */}
        <div className="mt-8 text-center relative z-10">
          <Link href="/profile" className="inline-flex h-16 items-center justify-center gap-3 bg-cyan-400 text-black px-10 rounded-2xl border-4 border-black shadow-[8px_8px_0_#000] hover:-translate-y-1 hover:shadow-[12px_12px_0_#000] active:translate-y-2 active:shadow-none transition-all group">
            <ArrowLeft className="w-6 h-6 stroke-[3] group-hover:-translate-x-2 transition-transform" />
            <span className="text-xl font-comic tracking-widest uppercase">BACK TO DASHBOARD</span>
          </Link>
        </div>

      </div>
    </ProtectedRoute>
  );
}
