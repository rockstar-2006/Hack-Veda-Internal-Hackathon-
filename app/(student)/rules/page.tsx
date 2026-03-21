"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ShieldAlert, ArrowLeft, Zap, Sparkles, Clock, ShieldCheck, Scale } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RulesComingSoon() {
  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-6 py-20 min-h-screen pb-40 relative font-sans flex flex-col items-center justify-center overflow-hidden">
        
        {/* Background Decorative Elements */}
        <div className="absolute top-40 left-10 opacity-10 animate-pulse pointer-events-none">
          <Scale className="w-64 h-64 text-black rotate-12" />
        </div>
        <div className="absolute top-20 right-20 opacity-10 animate-bounce pointer-events-none">
          <ShieldAlert className="w-64 h-64 text-black -rotate-12" />
        </div>

        {/* Header Link */}
        <section className="mb-12 text-center relative z-10 w-full">
             <Link href="/profile" className="inline-flex items-center gap-3 bg-cyan-400 text-black px-6 py-3 rounded-xl font-comic text-xl uppercase tracking-widest border-4 border-black hover:-translate-y-1 hover:shadow-[6px_6px_0_#000] shadow-[4px_4px_0_#000] transition-all active:translate-y-1 active:shadow-none mb-12">
                  <ArrowLeft className="w-5 h-5 stroke-[3]" />
                  BACK TO DASHBOARD
             </Link>
        </section>

        {/* Main Coming Soon Content */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0, rotate: 5 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="relative z-10 text-center bg-white border-4 md:border-8 border-black p-8 md:p-20 rounded-[2rem] md:rounded-[3rem] shadow-[12px_12px_0_#000] md:shadow-[24px_24px_0_#000] max-w-4xl w-full overflow-hidden group"
        >
             {/* Halftone BG Pattern */}
             <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '16px 16px' }} />
             
             <motion.div 
               animate={{ y: [0, -10, 0] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="inline-flex items-center gap-3 bg-pink-400 text-black px-4 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl text-base md:text-xl font-black uppercase tracking-widest mb-6 md:mb-10 border-4 border-black shadow-[4px_4px_0_#000] md:shadow-[6px_6px_0_#000] relative z-20"
             >
                 <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 animate-bounce" />
                 POLICY SYNCING
             </motion.div>

             <h1 className="text-4xl sm:text-6xl md:text-8xl font-comic text-black leading-none tracking-tighter uppercase mb-6 md:mb-8 drop-shadow-[4px_4px_0_#00f0ff] md:drop-shadow-[6px_6px_0_#00f0ff] relative z-20">
                COMING <br />
                <span className="text-white drop-shadow-[4px_4px_0_#000] md:drop-shadow-[6px_6px_0_#000]">SOON!</span>
             </h1>

             <div className="bg-yellow-400 p-6 md:p-8 border-4 border-black rounded-2xl md:rounded-3xl shadow-[6px_6px_0_#000] md:shadow-[10px_10px_0_#000] transform -rotate-1 hover:rotate-0 transition-transform relative z-20 group-hover:bg-yellow-300">
                  <p className="text-lg md:text-3xl font-comic text-black uppercase tracking-widest leading-relaxed">
                     The official rulebook is being <br />
                     <span className="bg-white px-3 py-1 border-2 md:border-4 border-black rounded-lg md:rounded-xl inline-block mt-2 shadow-[2px_2px_0_#000] md:shadow-[4px_4px_0_#000]">NORMALIZED!</span>
                  </p>
                  <p className="mt-6 md:mt-8 text-black font-black uppercase tracking-[0.1em] md:tracking-[0.3em] flex items-center justify-center gap-2 md:gap-4 text-[10px] md:text-base">
                      <Zap className="w-4 h-4 md:w-6 md:h-6 animate-pulse" /> 
                      GOVERNANCE PROTOCOL ACTIVE 
                      <Zap className="w-4 h-4 md:w-6 md:h-6 animate-pulse" />
                  </p>
             </div>

             {/* Bottom Decoration */}
             <div className="absolute -bottom-10 -left-10 opacity-20 transform rotate-12 group-hover:-rotate-45 transition-transform duration-700">
                  <ShieldCheck className="w-64 h-64 text-black stroke-[4]" />
             </div>
        </motion.div>

      </div>
    </ProtectedRoute>
  );
}
