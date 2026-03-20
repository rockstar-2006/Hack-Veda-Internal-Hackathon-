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
      <div className="max-w-5xl mx-auto px-6 py-12 md:py-20 min-h-screen pb-32 relative">
        
        {/* Header Section */}
        <section className="mb-16 md:mb-24 text-center md:text-left">
             <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-8">
                 <Link href="/profile" className="inline-flex items-center justify-center md:justify-start gap-2 bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all group active:scale-[0.98] w-fit mx-auto md:mx-0 shadow-sm">
                      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" />
                      Back to Dashboard
                 </Link>
             </div>
             
             <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="mb-8"
             >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight tracking-tight mb-6 uppercase">
                   Ground <br />
                   <span className="text-indigo-600">Regulations.</span>
                </h1>
                <p className="text-base md:text-lg text-gray-500 font-medium max-w-xl mx-auto md:mx-0 leading-relaxed">
                   Read our official protocols carefully. Failure to comply with these guidelines may lead to immediate disqualification.
                </p>
             </motion.div>
        </section>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {ruleCategories.map((category, idx) => (
                <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-8 md:p-10 rounded-3xl bg-white border-2 border-indigo-50 hover:border-indigo-600 hover:shadow-lg transition-all duration-500 group flex flex-col items-start relative overflow-hidden"
                >
                    <div className="bg-indigo-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300 shadow-sm border border-indigo-100">
                        <div className="transform scale-75 group-hover:scale-100 transition-transform">
                             {category.icon}
                        </div>
                    </div>
                    <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">{category.title}</h2>
                    <ul className="space-y-4 flex-1">
                        {category.items.map((item, i) => (
                            <li key={i} className="flex gap-4 text-gray-500 font-medium text-sm leading-relaxed group-hover:text-gray-800 transition-colors">
                                <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 shrink-0 group-hover:scale-125 transition-transform shadow-[0_0_8px_rgba(79,70,229,0.3)]" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                    
                    {/* Decor */}
                    <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-[0.02] transition-opacity duration-700 -z-0 bg-indigo-600 rounded-full scale-150 blur-2xl pointer-events-none" />
                </motion.div>
            ))}
        </div>

        {/* Warning Callout */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           className="mt-16 md:mt-24 p-8 md:p-12 rounded-3xl bg-orange-50 border border-orange-100 flex flex-col lg:flex-row items-center gap-8 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
            <div className="absolute top-0 left-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -ml-16 -mt-16 pointer-events-none" />
            
            <div className="bg-white w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-orange-50 group hover:rotate-12 transition-transform duration-500">
                <ShieldAlert className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
            </div>
            
            <div className="flex-1 text-center lg:text-left">
                 <h3 className="text-xl md:text-3xl font-black text-orange-900 mb-2 tracking-tight uppercase leading-tight">Zero Tolerance Policy</h3>
                 <p className="text-orange-800/80 text-sm md:text-base font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
                    Any form of misconduct, academic dishonesty, or policy violation will lead to permanent expulsion from the 2026 Innovation Cycle.
                 </p>
            </div>
            
            <div className="shrink-0 flex items-center gap-3 bg-white/60 px-6 py-3 rounded-xl border border-orange-100">
                 <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_orange]" />
                 <span className="text-xs font-bold text-orange-900 uppercase tracking-widest">Strict Compliance</span>
            </div>
        </motion.div>

      </div>
    </ProtectedRoute>
  );
}
