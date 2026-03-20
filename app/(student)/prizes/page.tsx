"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Award, Trophy, Medal, Star, Sparkles, ArrowLeft, Gift, Zap, Crown } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const prizes = [
  {
    title: "1st Prize",
    amount: "₹10,000",
    label: "Winner",
    icon: <Trophy className="w-20 h-20 text-yellow-500 fill-yellow-500/10 drop-shadow-[0_0_20px_rgba(234,179,8,0.3)]" />,
    color: "bg-yellow-50/50 text-yellow-900 border-yellow-200 shadow-yellow-200/20",
    description: "Highest score overall. Outstanding implementation, design, and presentation.",
    perks: ["Champion Trophy", "Internship Priority", "Winner Kit"]
  },
  {
    title: "2nd Prize",
    amount: "₹7,500",
    label: "Runner Up",
    icon: <Award className="w-16 h-16 text-indigo-400 fill-indigo-400/10 drop-shadow-[0_0_20px_rgba(79,70,229,0.3)]" />,
    color: "bg-indigo-50/50 text-indigo-900 border-indigo-100 shadow-indigo-200/20",
    description: "Exceptional creativity and solid technical execution of the project.",
    perks: ["Finalist Medal", "Advanced Evolution Kit", "Excellence Certificate"]
  },
  {
    title: "3rd Prize",
    amount: "₹5,000",
    label: "Second Runner Up",
    icon: <Medal className="w-16 h-16 text-orange-400 fill-orange-400/10 drop-shadow-[0_0_20px_rgba(251,146,60,0.3)]" />,
    color: "bg-orange-50/50 text-orange-900 border-orange-100 shadow-orange-200/20",
    description: "Great problem-solving and unique implementation strategy.",
    perks: ["Participation Medal", "Standard Entry Kit", "Merit Certificate"]
  }
];

export default function PrizesPage() {
  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-6 py-20 min-h-screen pb-40 relative">
        
        {/* Header Section */}
        <section className="mb-32 text-center">
             <Link href="/profile" className="inline-flex items-center gap-3 bg-indigo-50 text-indigo-700 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] mb-12 italic border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all group active:scale-95">
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Back to Dashboard
             </Link>
             
             <motion.div 
               animate={{ scale: [1, 1.05, 1] }}
               transition={{ duration: 4, repeat: Infinity }}
               className="inline-flex items-center gap-3 bg-yellow-400 text-yellow-950 px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] mb-10 italic shadow-2xl shadow-yellow-500/20"
             >
                 <Crown className="w-4 h-4 fill-yellow-950" />
                 Victory Prizes
             </motion.div>
             
             <h1 className="text-4xl md:text-7xl font-black text-gray-900 leading-tight tracking-tighter mb-10 italic">
                Win Big for <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-indigo-900 to-indigo-950 font-black italic">
                    Great Ideas.
                </span>
             </h1>
             <p className="text-xl text-gray-400 font-bold max-w-2xl mx-auto italic leading-relaxed">
                 Rewarding excellence in software development. Every participant receives recognition.
             </p>
        </section>

        <div className="grid lg:grid-cols-3 gap-12 mb-32 group/list">
            {prizes.map((prize, idx) => (
                <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.2, duration: 0.8 }}
                    className={`p-14 rounded-[5rem] ${prize.color} border-4 flex flex-col group hover:-translate-y-8 transition-all duration-700 hover:shadow-3xl relative overflow-hidden h-[700px] shadow-2xl`}
                >
                    <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 transition-transform duration-[2000ms] group-hover:rotate-45">
                        <Zap className="w-48 h-48" />
                    </div>

                    <div className="mb-14 flex justify-center group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 relative z-10 shrink-0">
                        {prize.icon}
                    </div>
                    
                    <div className="text-center mb-14 relative z-10">
                        <h2 className="text-sm font-black uppercase tracking-[0.4em] mb-4 opacity-50 italic">{prize.label}</h2>
                        <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase italic tracking-tighter">{prize.title}</h3>
                        <p className="text-5xl md:text-6xl font-black tracking-tighter italic leading-none">{prize.amount}</p>
                    </div>

                    <p className="text-base font-bold text-center mb-14 opacity-60 leading-relaxed italic border-t-2 border-black/5 pt-14 flex-1 relative z-10 px-4">
                        "{prize.description}"
                    </p>

                    <div className="space-y-6 mt-auto relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30 mb-8 italic">Prize Benefits</p>
                        {prize.perks.map((perk, i) => (
                            <div key={i} className="flex gap-6 text-base font-black items-center group/item hover:translate-x-3 transition-transform italic text-gray-900/80">
                                <div className="w-3 h-3 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.5)]" />
                                <p className="pt-0.5">{perk}</p>
                            </div>
                        ))}
                    </div>
                    
                    {/* Dynamic Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
            ))}
        </div>

        {/* Participation Rewards Section */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           className="p-16 md:p-24 rounded-[5.5rem] bg-gray-950 text-white relative overflow-hidden shadow-3xl border-4 border-gray-900 group"
        >
             <div className="relative z-20 flex flex-col lg:flex-row items-center justify-between gap-20">
                 <div className="max-w-2xl text-center lg:text-left">
                     <div className="inline-flex items-center gap-3 bg-white/10 text-indigo-300 px-6 py-2.5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.3em] mb-10 border-2 border-white/5 italic">
                        <Gift className="w-5 h-5 animate-bounce-subtle" />
                        All Participants
                     </div>
                     <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tighter italic uppercase leading-none">Participation <br /> Reward Kit.</h2>
                     <p className="text-gray-400 text-xl font-bold leading-relaxed italic pr-10">
                        Every innovator that reaches the final evaluation cycle will receive official validation, branded assets, and full coverage of innovation logistics.
                     </p>
                 </div>
                 
                 <div className="flex -space-x-12 shrink-0">
                     {[1,2,3,4].map(i => (
                         <div key={i} className="w-32 h-32 rounded-[2.5rem] bg-indigo-600/10 backdrop-blur-3xl border-2 border-white/10 flex items-center justify-center -rotate-12 hover:rotate-6 hover:translate-y-6 hover:bg-indigo-600 transition-all duration-700 cursor-pointer shadow-black shadow-2xl overflow-hidden relative group/icon group-hover:rotate-0">
                             <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover/icon:opacity-100 transition-opacity" />
                             <Medal className="w-12 h-12 text-white group-hover/icon:scale-125 transition-transform duration-500" />
                         </div>
                     ))}
                 </div>
             </div>
             
             {/* Background Art */}
             <div className="absolute top-0 left-0 w-full h-full opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '60px 60px' }} />
             <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[150px] -z-10 translate-x-1/3 translate-y-1/3" />
        </motion.div>

      </div>
    </ProtectedRoute>
  );
}
