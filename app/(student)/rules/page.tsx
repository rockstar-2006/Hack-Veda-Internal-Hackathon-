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
      <div className="max-w-6xl mx-auto px-6 py-20 min-h-screen pb-40 relative">
        
        {/* Header Section */}
        <section className="mb-24 text-center md:text-left">
             <Link href="/profile" className="inline-flex items-center gap-3 bg-indigo-50 text-indigo-700 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] mb-10 italic border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all group active:scale-95">
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Back to Terminal
             </Link>
             
             <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="mb-12"
             >
                <h1 className="text-6xl md:text-8xl font-black text-gray-900 leading-[0.8] tracking-tighter mb-10 italic">
                   Ground <br />
                   <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-950 font-black">Regulations.</span>
                </h1>
                <p className="text-xl text-gray-400 font-bold max-w-2xl italic leading-relaxed">
                   Read our official protocols carefully. Failure to comply with these guidelines may lead to immediate disqualification.
                </p>
             </motion.div>
        </section>

        <div className="grid md:grid-cols-2 gap-12">
            {ruleCategories.map((category, idx) => (
                <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-12 rounded-[4.5rem] bg-white border-4 border-indigo-50 hover:border-indigo-600 hover:shadow-2xl hover:shadow-indigo-600/5 transition-all duration-700 group flex flex-col items-start relative overflow-hidden"
                >
                    <div className="bg-indigo-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mb-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-xl border border-indigo-100/50">
                        {category.icon}
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-10 uppercase tracking-tighter italic leading-none">{category.title}</h2>
                    <ul className="space-y-8 flex-1">
                        {category.items.map((item, i) => (
                            <li key={i} className="flex gap-6 text-gray-500 font-bold text-base leading-relaxed italic group-hover:text-gray-900 transition-colors">
                                <div className="w-3 h-3 rounded-full bg-indigo-600 mt-2 shrink-0 group-hover:scale-150 transition-transform shadow-[0_0_10px_rgba(79,70,229,0.4)]" />
                                <p className="pt-0.5">{item}</p>
                            </li>
                        ))}
                    </ul>
                    
                    {/* Decor */}
                    <div className="absolute top-0 right-0 p-10 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-1000 -z-0 bg-indigo-600 rounded-full scale-150 blur-3xl" />
                </motion.div>
            ))}
        </div>

        {/* Warning Callout */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           className="mt-24 p-12 md:p-16 rounded-[4.5rem] bg-orange-50 border-4 border-orange-100 flex flex-col lg:flex-row items-center gap-12 relative overflow-hidden shadow-2xl shadow-orange-500/5"
        >
            <div className="absolute top-0 left-0 w-48 h-48 bg-orange-500/5 rounded-full blur-[80px] -ml-24 -mt-24" />
            
            <div className="bg-white p-8 rounded-[2.5rem] flex items-center justify-center shrink-0 shadow-2xl shadow-orange-500/10 border-2 border-orange-50 group group-hover:rotate-12 transition-transform duration-700">
                <ShieldAlert className="w-12 h-12 text-orange-500" />
            </div>
            
            <div className="flex-1 text-center lg:text-left">
                 <h3 className="text-3xl font-black text-orange-950 mb-4 tracking-tighter italic uppercase leading-none">Zero Tolerance Policy</h3>
                 <p className="text-orange-900/70 text-lg font-bold leading-relaxed italic pr-4">
                    Any form of misconduct, academic dishonesty, or policy violation will lead to permanent expulsion from the 2026 Innovation Cycle.
                 </p>
            </div>
            
            <div className="shrink-0 flex items-center gap-4 bg-white/50 px-8 py-4 rounded-3xl border border-orange-100">
                 <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse shadow-[0_0_12px_orange]" />
                 <span className="text-[11px] font-black text-orange-900 uppercase tracking-widest italic">Strict Compliance</span>
            </div>
        </motion.div>

      </div>
    </ProtectedRoute>
  );
}
