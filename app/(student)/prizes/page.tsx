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
      <div className="max-w-7xl mx-auto px-6 py-20 min-h-screen pb-40 relative font-sans">
        
        {/* Header Section */}
        <section className="mb-24 text-center relative z-10">
             <Link href="/profile" className="inline-flex items-center gap-3 bg-pink-400 text-black px-6 py-3 rounded-xl font-comic text-xl uppercase tracking-widest border-4 border-black hover:-translate-y-1 hover:shadow-[6px_6px_0_#000] shadow-[4px_4px_0_#000] transition-all active:translate-y-1 active:shadow-none mb-12">
                  <ArrowLeft className="w-5 h-5 stroke-[3]" />
                  BACK TO DASHBOARD
             </Link>
             
             <motion.div 
               animate={{ y: [0, -10, 0] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="inline-flex items-center gap-3 bg-cyan-400 text-black px-6 py-2 rounded-xl text-lg font-bold uppercase tracking-widest mb-10 border-4 border-black shadow-[4px_4px_0_#000] rotate-2"
             >
                 <Crown className="w-6 h-6 fill-yellow-400 stroke-black stroke-[2]" />
                 VICTORY PRIZES!
             </motion.div>
             
             <h1 className="text-5xl md:text-7xl lg:text-8xl font-comic text-black leading-none tracking-widest uppercase mb-10 drop-shadow-[4px_4px_0_#ff007f] transform -rotate-1">
                PRIZES & <br />
                <span className="text-white drop-shadow-[4px_4px_0_#000]">REWARDS!</span>
             </h1>
             <p className="text-lg md:text-xl text-black bg-yellow-300 font-bold max-w-2xl mx-auto p-4 border-4 border-black rounded-xl shadow-[6px_6px_0_#000] rotate-1">
                 Rewarding excellence in software development. EVERY PARTICIPANT RECEIVES RECOGNITION!
             </p>
        </section>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 mb-24 relative z-10">
            {prizes.map((prize, idx) => {
                const colors = ['bg-yellow-400', 'bg-cyan-400', 'bg-pink-400'];
                const cardColor = colors[idx % colors.length];

                return (
                <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.2, duration: 0.4 }}
                    whileHover={{ y: -8, x: -4 }}
                    className={`p-8 rounded-3xl ${cardColor} border-4 border-black flex flex-col group transition-all relative overflow-hidden h-auto shadow-[12px_12px_0_#000] hover:shadow-[16px_16px_0_#000]`}
                >
                    {/* Halftone BG */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '16px 16px' }} />

                    <div className="absolute top-0 right-0 p-6 opacity-20 scale-150 rotate-12 transition-transform duration-500 group-hover:rotate-45 pointer-events-none">
                        <Zap className="w-32 h-32 fill-black stroke-black stroke-[2]" />
                    </div>

                    <div className="mb-8 flex justify-center group-hover:scale-110 transition-transform relative z-10 shrink-0">
                        <div className="bg-white p-4 rounded-2xl border-4 border-black shadow-[6px_6px_0_#000] transform rotate-3 group-hover:-rotate-3 transition-transform">
                             <div className="[&>svg]:w-16 [&>svg]:h-16 [&>svg]:text-black [&>svg]:stroke-[2]">{prize.icon}</div>
                        </div>
                    </div>
                    
                    <div className="text-center mb-6 relative z-10 bg-white p-4 border-4 border-black rounded-xl shadow-[4px_4px_0_#000] transform -rotate-1">
                        <h2 className="text-sm font-bold uppercase tracking-widest mb-1 text-gray-800 bg-gray-200 inline-block px-2 rounded">{prize.label}</h2>
                        <h3 className="text-3xl font-comic text-black mb-1 uppercase tracking-widest">{prize.title}</h3>
                        <p className="text-4xl md:text-5xl font-comic tracking-widest text-black drop-shadow-[2px_2px_0_#fff]">{prize.amount}</p>
                    </div>

                    <p className="text-base font-bold text-center mb-8 text-black bg-white/60 p-4 border-2 border-black rounded-lg flex-1 relative z-10">
                        "{prize.description}"
                    </p>

                    <div className="space-y-4 mt-auto relative z-10 bg-white p-6 border-4 border-black rounded-2xl shadow-[4px_4px_0_#000] transform rotate-1">
                        <p className="text-sm font-comic uppercase tracking-widest text-black mb-4 mx-auto w-fit bg-yellow-300 px-2 rounded border-2 border-black">PRIZE BENEFITS</p>
                        {prize.perks.map((perk, i) => (
                            <div key={i} className="flex gap-3 text-sm font-bold items-center group/item text-black">
                                <div className="w-3 h-3 rounded-full bg-black border-2 border-white shadow-[2px_2px_0_#00f0ff] shrink-0" />
                                <span>{perk}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
                );
            })}
        </div>

        {/* Participation Rewards Section */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           className="p-8 md:p-16 rounded-3xl bg-black text-white relative overflow-hidden border-4 border-black shadow-[16px_16px_0_#00f0ff] group z-10 transform -rotate-1 hover:rotate-0 transition-transform"
        >
             {/* Halftone Pattern Light */}
             <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }} />
             
             <div className="relative z-20 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
                 <div className="max-w-xl text-center lg:text-left">
                     <div className="inline-flex items-center gap-3 bg-pink-500 text-black px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-widest mb-6 border-4 border-black shadow-[4px_4px_0_#fff] transform rotate-2">
                        <Gift className="w-5 h-5 stroke-[3]" />
                        ALL PARTICIPANTS!
                     </div>
                     <h2 className="text-4xl md:text-6xl font-comic mb-4 tracking-widest uppercase leading-none drop-shadow-[2px_2px_0_#ff007f]">PARTICIPATION <br /> REWARD KIT!</h2>
                     <p className="bg-white text-black text-base md:text-lg font-bold p-4 border-4 border-black rounded-xl shadow-[4px_4px_0_#00f0ff] transform -rotate-1">
                        Every innovator that reaches the final evaluation cycle will receive official validation, branded assets, and full coverage of innovation logistics.
                     </p>
                 </div>
                 
                 <div className="flex flex-wrap sm:flex-nowrap gap-4 sm:-space-x-8 shrink-0 justify-center mt-8 lg:mt-0">
                     {[1,2,3,4].map(i => (
                         <div key={i} className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-yellow-400 border-4 border-black flex items-center justify-center transform hover:-translate-y-4 hover:scale-110 transition-all cursor-pointer shadow-[6px_6px_0_#fff] relative group/icon ${i % 2 === 0 ? 'rotate-6' : '-rotate-6 hover:rotate-0'}`}>
                             <Medal className="w-10 h-10 sm:w-12 sm:h-12 text-black stroke-[2] group-hover/icon:animate-bounce" />
                         </div>
                     ))}
                 </div>
             </div>
        </motion.div>

      </div>
    </ProtectedRoute>
  );
}
