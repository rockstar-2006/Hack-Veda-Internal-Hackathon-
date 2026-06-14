"use client";

import { motion } from "framer-motion";
import { Trophy, Star, Zap } from "lucide-react";
import React from "react";

// Custom premium cricket ball SVG
const CricketBall = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="42" fill="rgb(220, 38, 38)" stroke="black" strokeWidth="4.5" />
    <path d="M 50 8 A 42 42 0 0 1 50 92" stroke="white" strokeWidth="4" strokeDasharray="3,3" />
    <path d="M 50 8 A 42 42 0 0 0 50 92" stroke="white" strokeWidth="4" strokeDasharray="3,3" />
  </svg>
);

// Custom premium cricket bat SVG
const CricketBat = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Handle */}
    <rect x="46" y="8" width="8" height="32" rx="4" fill="rgb(251, 191, 36)" stroke="black" strokeWidth="4" />
    <line x1="46" y1="18" x2="54" y2="18" stroke="black" strokeWidth="2.5" />
    <line x1="46" y1="26" x2="54" y2="26" stroke="black" strokeWidth="2.5" />
    {/* Bat blade */}
    <path d="M 41 40 L 59 40 L 61 88 C 61 91, 39 91, 39 88 Z" fill="rgb(217, 119, 6)" stroke="black" strokeWidth="4" />
  </svg>
);

const LiveBackground = React.memo(() => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-2] overflow-hidden bg-[#fffcf0] select-none">
       {/* 🌈 VIBRANT NEON BLOBS (The "Aura") */}
       <motion.div 
         initial={false}
         animate={{ 
            x: [0, 40, -40, 0], 
            y: [0, -40, 40, 0],
            scale: [1, 1.1, 0.95, 1] 
         }}
         transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
         className="absolute top-[-5%] left-[-5%] w-[80%] h-[60%] md:w-[70%] md:h-[70%] bg-emerald-400/20 md:bg-emerald-400/25 rounded-full blur-[40px] md:blur-[60px]"
       />
       <motion.div 
         initial={false}
         animate={{ 
            x: [0, -60, 60, 0], 
            y: [0, 60, -60, 0],
            scale: [1, 1.05, 0.9, 1] 
         }}
         transition={{ duration: 30, repeat: Infinity, ease: "linear", delay: 2 }}
         className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[50%] md:w-[60%] md:h-[60%] bg-cyan-400/20 md:bg-cyan-400/25 rounded-full blur-[35px] md:blur-[50px]"
       />
       <motion.div 
         initial={false}
         animate={{ 
            opacity: [0.1, 0.2, 0.1],
            scale: [0.8, 1.1, 0.8] 
         }}
         transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
         className="absolute top-[30%] left-[35%] w-[40%] h-[40%] bg-yellow-300/10 rounded-full blur-[50px] md:blur-[80px]"
       />

       {/* 🕸️ HIGH-DENSITY TECH GRID */}
       <div 
         className="absolute inset-0 opacity-[0.05] md:opacity-[0.08]" 
         style={{ 
            backgroundImage: 'radial-gradient(#000 1.2px, transparent 0)', 
            backgroundSize: '30px 30px',
            maskImage: 'radial-gradient(circle at center, black, transparent 85%)'
         }} 
       />

       {/* 📡 ANIMATED SCANNING BEAM */}
       <motion.div 
         animate={{ top: ['-20%', '120%'] }}
         transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
         className="absolute left-0 right-0 h-40 md:h-64 bg-gradient-to-b from-transparent via-cyan-400/5 md:via-cyan-400/10 to-transparent z-0 opacity-30 md:opacity-40"
       />

       {/* 🏆 DRIFTING BREATHING ICONS */}
       <motion.div 
          animate={{ y: [0, -30, 0], rotate: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
          className="absolute top-[10%] right-[5%] md:top-[15%] md:right-[15%] opacity-[0.1] md:opacity-[0.15]"
       >
          <Trophy className="w-32 h-32 md:w-64 md:h-64 text-yellow-400 fill-yellow-200 stroke-black stroke-[1.5]" />
       </motion.div>

       <motion.div 
          animate={{ y: [0, 40, 0], rotate: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 18, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[15%] left-[5%] md:bottom-[20%] md:left-[10%] opacity-[0.07] md:opacity-[0.1]"
       >
          <Star className="w-40 h-40 md:w-80 md:h-80 text-yellow-400 fill-yellow-400 stroke-black stroke-[1.5]" />
       </motion.div>

       {/* Drifting Cricket Ball */}
       <motion.div 
          animate={{ x: [0, 20, 0], y: [0, -40, 0], rotate: [0, 360] }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="absolute top-[45%] right-[10%] opacity-[0.08] md:opacity-[0.12] w-24 h-24 md:w-36 md:h-36 pointer-events-none"
       >
          <CricketBall className="w-full h-full" />
       </motion.div>

       {/* Drifting Cricket Bat */}
       <motion.div 
          animate={{ y: [0, 50, 0], rotate: [-20, 20, -20] }}
          transition={{ repeat: Infinity, duration: 22, ease: "easeInOut" }}
          className="absolute top-[25%] left-[5%] opacity-[0.06] md:opacity-[0.09] w-32 h-32 md:w-48 md:h-48 pointer-events-none"
       >
          <CricketBat className="w-full h-full animate-pulse" />
       </motion.div>

       {/* ⚡ NEON CIRCUITRY PATHS */}
       <svg className="absolute inset-0 w-full h-full opacity-[0.1] md:opacity-[0.15] pointer-events-none">
            <motion.path 
                className="hidden md:block"
                d="M -100 200 L 200 200 L 300 300 L 300 1000" 
                stroke="rgb(34,197,94)" 
                strokeWidth="4" 
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 8, repeat: Infinity }}
             />
             <motion.path 
                d="M 1200 100 L 1000 100 L 900 200 L 900 800" 
                stroke="rgb(34,211,238)" 
                strokeWidth="4" 
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 10, repeat: Infinity, delay: 2 }}
             />
       </svg>
    </div>
  );
});

LiveBackground.displayName = "LiveBackground";
export default LiveBackground;
