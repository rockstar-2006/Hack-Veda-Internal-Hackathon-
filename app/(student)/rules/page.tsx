"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ShieldCheck, Scale, AlertTriangle, CheckCircle2, Info, ArrowLeft, Users, Zap, Code, Rocket, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const ruleCategories = [
  {
    title: "Participation",
    icon: <Users className="w-10 h-10 text-indigo-600" />,
    items: [
      "Open only to current students & staff @SMVITM with @sode-edu.in domain.",
      "Strict Team Size: Minimum 2 and Maximum 4 members only.",
      "Inter-departmental collaboration is highly encouraged."
    ]
  },
  {
    title: "Innovation Ethics",
    icon: <Scale className="w-10 h-10 text-indigo-600" />,
    items: [
      "Plagiarism or using existing full-scale projects is strictly prohibited.",
      "Professional conduct is required at all times during the event.",
      "Healthy competition: respect all fellow innovators and mentors."
    ]
  },
  {
    title: "Project Milestones",
    icon: <CheckCircle2 className="w-10 h-10 text-indigo-600" />,
    items: [
      "Initial proposals must be submitted in PDF format (Max 10MB).",
      "Shortlisted teams must report to the venue by 9:00 AM on April 10.",
      "Coding phase ends exactly at 12:00 PM on April 11."
    ]
  },
  {
    title: "Tech Standards",
    icon: <Code className="w-10 h-10 text-indigo-600" />,
    items: [
      "Projects should be developed fresh during the 24-hour cycle.",
      "Use of open-source libraries and APIs is permitted (State dependencies).",
      "Evaluation will focus on Implementation, UI/UX, and Social Impact."
    ]
  }
];

export default function RulesPage() {
  return (
    <ProtectedRoute>
      <div className="max-w-5xl mx-auto px-6 py-12 md:py-20 min-h-screen pb-32 relative font-sans">
        
        {/* Header Section */}
        <section className="mb-16 md:mb-24 text-center md:text-left relative z-10">
             <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-8">
                 <Link href="/profile" className="inline-flex items-center justify-center md:justify-start gap-3 bg-cyan-400 text-black px-6 py-3 rounded-xl font-comic text-xl uppercase tracking-widest border-4 border-black hover:-translate-y-1 hover:shadow-[6px_6px_0_#000] shadow-[4px_4px_0_#000] transition-all active:translate-y-1 active:shadow-none mx-auto md:mx-0">
                      <ArrowLeft className="w-5 h-5 stroke-[3]" />
                      BACK TO DASHBOARD
                 </Link>
             </div>
             
             <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="mb-8"
             >
                <div className="inline-block relative">
                   <h1 className="text-5xl md:text-7xl lg:text-8xl font-comic text-black leading-none tracking-widest uppercase mb-6 drop-shadow-[4px_4px_0_#ff007f] transform -rotate-2">
                       HACKATHON <br />
                       <span className="text-white drop-shadow-[4px_4px_0_#000]">RULES!</span>
                   </h1>
                   <div className="absolute -top-10 -right-10 hidden md:block animate-bounce text-pink-500">
                      <Zap className="w-20 h-20 fill-pink-500 stroke-black stroke-[2]" />
                   </div>
                </div>
                <p className="text-sm md:text-lg text-black bg-yellow-300 font-bold max-w-xl mx-auto md:mx-0 leading-relaxed p-4 border-4 border-black rounded-xl shadow-[4px_4px_0_#000] rotate-1">
                   Read our official protocols carefully. Failure to comply with these guidelines may lead to immediate disqualification. NO EXCUSES!
                </p>
             </motion.div>
        </section>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 relative z-10">
            {ruleCategories.map((category, idx) => {
                const colors = ['bg-pink-400', 'bg-cyan-400', 'bg-yellow-400', 'bg-white'];
                const cardColor = colors[idx % colors.length];

                return (
                <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ y: -5, x: -5 }}
                    className={`p-8 md:p-10 rounded-3xl ${cardColor} border-4 border-black shadow-[8px_8px_0_#000] hover:shadow-[12px_12px_0_#000] transition-all group flex flex-col items-start relative overflow-hidden`}
                >
                    {/* Halftone BG */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '16px 16px' }} />

                    <div className="bg-white w-20 h-20 rounded-2xl flex items-center justify-center mb-6 border-4 border-black shadow-[4px_4px_0_#000] transform group-hover:rotate-12 group-hover:scale-110 transition-all z-10">
                        <div className="[&>svg]:w-10 [&>svg]:h-10 [&>svg]:text-black [&>svg]:stroke-[2]">
                             {category.icon}
                        </div>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-comic text-black mb-6 uppercase tracking-widest drop-shadow-[2px_2px_0_#fff] relative z-10">{category.title}</h2>
                    <ul className="space-y-4 flex-1 relative z-10">
                        {category.items.map((item, i) => (
                            <li key={i} className="flex gap-4 text-black font-bold text-sm leading-relaxed bg-white/60 p-3 border-2 border-black rounded-xl">
                                <div className="w-3 h-3 rounded-full bg-black mt-1 shrink-0 border-2 border-white shadow-[2px_2px_0_#000]" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </motion.div>
                );
            })}
        </div>

        {/* Warning Callout */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           className="mt-16 md:mt-24 p-8 md:p-12 rounded-3xl bg-red-500 border-4 border-black flex flex-col lg:flex-row items-center gap-8 relative overflow-hidden shadow-[12px_12px_0_#000] hover:-translate-y-2 hover:shadow-[16px_16px_0_#000] transition-all z-10"
        >
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(45deg, black 25%, transparent 25%, transparent 50%, black 50%, black 75%, transparent 75%, transparent 100%)', backgroundSize: '40px 40px' }} />

            <div className="bg-yellow-400 w-24 h-24 rounded-2xl flex items-center justify-center shrink-0 border-4 border-black shadow-[6px_6px_0_#000] transform rotate-3 relative z-10 group-hover:rotate-12 transition-transform">
                <ShieldAlert className="w-12 h-12 text-black stroke-[3]" />
            </div>
            
            <div className="flex-1 text-center lg:text-left relative z-10 bg-white p-6 border-4 border-black rounded-2xl shadow-[6px_6px_0_#000] transform -rotate-1">
                 <h3 className="text-3xl md:text-4xl font-comic text-black mb-2 tracking-widest uppercase leading-tight drop-shadow-[2px_2px_0_#ff007f]">ZERO TOLERANCE POLICY!</h3>
                 <p className="text-gray-900 text-sm md:text-base font-bold leading-relaxed max-w-2xl mx-auto lg:mx-0">
                    Any form of misconduct, academic dishonesty, or policy violation will lead to permanent expulsion from the 2026 Innovation Cycle.
                 </p>
            </div>
            
            <div className="shrink-0 flex items-center gap-3 bg-black text-white px-6 py-4 rounded-xl border-4 border-white shadow-[4px_4px_0_#000] relative z-10 transform rotate-2">
                 <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse border-2 border-white shadow-[0_0_8px_#ff0000]" />
                 <span className="text-sm font-comic uppercase tracking-widest">STRICT COMPLIANCE</span>
            </div>
        </motion.div>

      </div>
    </ProtectedRoute>
  );
}
