"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { 
  ShieldAlert, 
  ArrowLeft, 
  Zap, 
  Sparkles, 
  ShieldCheck, 
  BookOpen, 
  Info, 
  FileText, 
  CheckCircle,
  HelpCircle,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const THEMES = [
  {
    id: 1,
    num: "01",
    title: "College Development",
    description: "Build applications or tools that improve campus life, automate administrative systems, or enhance resource booking and academic collaboration at SMVITM.",
    color: "bg-cyan-400 border-black",
    textColor: "text-black"
  },
  {
    id: 2,
    num: "02",
    title: "Health Care",
    description: "Develop software solutions for patient care, mental health support, fitness tracking, diagnostics assistance, or community health management.",
    color: "bg-pink-400 border-black",
    textColor: "text-black"
  },
  {
    id: 3,
    num: "03",
    title: "Smart Mobility & Automation",
    description: "Design systems focusing on smart transport, navigation utilities, automated IoT solutions, smart energy management, or home/campus automation.",
    color: "bg-yellow-400 border-black",
    textColor: "text-black"
  },
  {
    id: 4,
    num: "04",
    title: "Sustainable Livelihood",
    description: "Create prototypes addressing clean energy, waste management, sustainable farming, carbon footprint reduction, or water conservation practices.",
    color: "bg-purple-400 border-black",
    textColor: "text-black"
  },
  {
    id: 5,
    num: "05",
    title: "To Be Announced",
    description: "A surprise theme will be unveiled just before the hacking period begins. Keep your creative gears ready for this wild-card challenge!",
    color: "bg-white border-dashed border-4 border-black",
    textColor: "text-black"
  }
];

const RULES = [
  {
    category: "Participation & Registration",
    items: [
      "Open to all students across all branches and years of Shri Madhwa Vadiraja Institute of Technology and Management (SMVITM).",
      "Registration fee is Rs. 200 per team, which must be cleared prior to the hacking phase.",
      "A team must consist of 2 to 4 members from SMVITM. Inter-disciplinary teams are highly encouraged."
    ]
  },
  {
    category: "Coding & Building",
    items: [
      "This is a continuous 24-hour hackathon. Hacking begins at 11:00 AM on Day 1 and ends at 11:00 AM on Day 2.",
      "All projects must be built from scratch. Pre-made templates or copy-pasting existing repositories is strictly prohibited and will lead to immediate disqualification.",
      "Usage of open-source libraries, APIs, and frameworks is permitted, provided they are declared in the project description during submission."
    ]
  },
  {
    category: "Evaluations & Pitching",
    items: [
      "Round 1 Evaluation: Day 1 at 06:00 PM. Judges will assess project design, concept viability, and initial coding progress.",
      "Round 2 Evaluation: Day 2 at 09:00 AM. A review of the functional prototypes and completion state.",
      "Round 3 Evaluation: Day 2 at 11:00 AM. Only shortlisted teams will pitch live before the final expert jury panel."
    ]
  },
  {
    category: "Submissions & Decorum",
    items: [
      "A complete submission includes uploading the project source code link and a presentation/demo PDF through this portal before the deadline.",
      "All participants must behave professionally and respectfully. Harassment, academic dishonesty, or violation of rules will lead to expulsion."
    ]
  }
];

export default function RulesPage() {
  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 md:py-4 min-h-screen pb-16 relative font-sans overflow-hidden">
        
        {/* Background Decorative Elements */}
        <div className="absolute top-20 left-20 opacity-5 animate-pulse pointer-events-none">
          <BookOpen className="w-96 h-96 text-black rotate-12" />
        </div>
        <div className="absolute bottom-20 right-20 opacity-5 animate-bounce pointer-events-none">
          <ShieldAlert className="w-96 h-96 text-black -rotate-12" />
        </div>

        {/* Back Button */}
        <div className="mb-6 text-center relative z-10 w-full">
          <Link href="/profile" className="inline-flex items-center gap-3 bg-pink-400 text-black px-6 py-3 rounded-xl font-comic text-xl uppercase tracking-widest border-4 border-black hover:-translate-y-1 hover:shadow-[6px_6px_0_#000] shadow-[4px_4px_0_#000] transition-all active:translate-y-1 active:shadow-none mb-6">
            <ArrowLeft className="w-5 h-5 stroke-[3]" />
            BACK TO DASHBOARD
          </Link>
        </div>

        {/* Header Section */}
        <div className="text-center mb-6 md:mb-8 relative z-10">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-widest mb-6 border-4 border-black shadow-[4px_4px_0_#000] rotate-2"
          >
            <ShieldCheck className="w-5 h-5 text-black stroke-[3]" />
            HACKATHON PROTOCOLS
          </motion.div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-comic text-black leading-none tracking-widest uppercase mb-4 drop-shadow-[4px_4px_0_#00f0ff]">
            THEMES & <br />
            <span className="text-white drop-shadow-[4px_4px_0_#000]">RULES!</span>
          </h1>
          <p className="bg-white p-3 inline-block border-4 border-black rounded-xl text-sm font-bold text-gray-800 shadow-[4px_4px_0_#ff007f] transform -rotate-1 mx-auto max-w-xl">
            Understand the themes, follow the rules, and code your way to victory.
          </p>
        </div>

        {/* Problem Statement Banner Alert */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-16 bg-white border-4 border-black p-6 md:p-8 rounded-3xl shadow-[8px_8px_0_#000] relative z-10 max-w-4xl mx-auto overflow-hidden"
        >
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '12px 12px' }} />
          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-cyan-400 border-4 border-black flex items-center justify-center shrink-0 shadow-[3px_3px_0_#000] animate-pulse">
              <Info className="w-8 h-8 text-black stroke-[3]" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-comic text-2xl md:text-3xl text-black uppercase tracking-widest mb-2">Problem Statement Release</h3>
              <p className="font-bold text-gray-700 text-sm md:text-base leading-relaxed">
                Problem statements under each theme will be released to participants prior to the event. Detailed problem sets are currently being finalized and will be officially communicated upon approval of this proposal.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Themes Grid */}
        <div className="mb-12 relative z-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="w-8 h-8 text-black fill-yellow-400 animate-spin-slow" />
            <h2 className="text-3xl md:text-5xl font-comic text-black uppercase tracking-wider text-center drop-shadow-[2px_2px_0_#fff]">5 Core Themes</h2>
            <Sparkles className="w-8 h-8 text-black fill-cyan-400 animate-spin-slow" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {THEMES.map((theme) => (
              <motion.div
                key={theme.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`p-8 rounded-3xl border-4 ${theme.color} shadow-[8px_8px_0_#000] hover:shadow-[16px_16px_0_#000] transition-all flex flex-col justify-between min-h-[280px] relative overflow-hidden group`}
              >
                {/* Halftone background */}
                <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '16px 16px' }} />

                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="bg-white text-black px-4 py-2 border-3 border-black rounded-xl text-xl font-black font-comic shadow-[2px_2px_0_#000]">
                    {theme.num}
                  </div>
                  <Zap className="w-8 h-8 text-black fill-black opacity-30 group-hover:opacity-100 group-hover:scale-125 transition-all" />
                </div>

                <div className="relative z-10">
                  <h3 className="text-2xl md:text-3xl font-comic text-black uppercase tracking-wider mb-3 leading-none drop-shadow-[1.5px_1.5px_0_#fff]">
                    {theme.title}
                  </h3>
                  <p className="text-xs md:text-sm font-bold text-gray-800 leading-relaxed bg-white/70 p-3 border-2 border-black rounded-xl">
                    {theme.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Rules & Regulations Section */}
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-12">
            <ShieldCheck className="w-8 h-8 text-black fill-pink-500 animate-bounce" />
            <h2 className="text-3xl md:text-5xl font-comic text-black uppercase tracking-wider text-center drop-shadow-[2px_2px_0_#fff]">Rulebook & Regulations</h2>
            <ShieldCheck className="w-8 h-8 text-black fill-cyan-400 animate-bounce" />
          </div>

          <div className="space-y-8 bg-white border-4 border-black p-6 md:p-12 rounded-[2.5rem] shadow-[12px_12px_0_#000] relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '16px 16px' }} />

            {RULES.map((section, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="border-b-4 border-black last:border-b-0 pb-8 last:pb-0 mb-8 last:mb-0"
              >
                <h3 className="text-xl md:text-2xl font-comic text-black uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-4 h-4 bg-yellow-400 border-2 border-black rounded-full shadow-[1.5px_1.5px_0_#000]" />
                  {section.category}
                </h3>
                <ul className="space-y-4">
                  {section.items.map((rule, ruleIdx) => (
                    <li key={ruleIdx} className="flex items-start gap-4">
                      <div className="mt-1 bg-pink-400 border-2 border-black rounded-md p-0.5 shrink-0 shadow-[1.5px_1.5px_0_#000]">
                        <CheckCircle className="w-4 h-4 text-black stroke-[3.5]" />
                      </div>
                      <span className="text-sm md:text-base font-bold text-gray-800 leading-relaxed">
                        {rule}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
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
