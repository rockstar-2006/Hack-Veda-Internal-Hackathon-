"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { format, parseISO } from "date-fns";
import { 
  Calendar, 
  Clock, 
  Trophy, 
  Flag, 
  Rocket, 
  Sparkles, 
  Users, 
  Award,
  Zap,
  ArrowLeft,
  Coffee,
  Mic2,
  ChevronRight,
  Target,
  CircleDot
} from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Link from "next/link";
import { useRef } from "react";

const timelineEvents = [
  { 
    id: 1,
    date: "2026-07-31", 
    time: "10:00 AM",
    title: "Inauguration & Opening", 
    description: "Grand Inauguration and opening ceremony at MBA Block, SMVITM.",
    icon: Mic2,
    color: "from-blue-500 to-indigo-600"
  },
  { 
    id: 2,
    date: "2026-07-31", 
    time: "11:00 AM",
    title: "Hacking Begins!", 
    description: "Release of the problem statements. The 24-hour hacking timer starts now!",
    icon: Zap,
    color: "from-yellow-400 to-amber-600"
  },
  { 
    id: 3,
    date: "2026-07-31", 
    time: "01:00 PM - 02:00 PM",
    title: "Lunch Break", 
    description: "Fuel up for the marathon coding session ahead.",
    icon: Coffee,
    color: "from-rose-500 to-red-600"
  },
  { 
    id: 4,
    date: "2026-07-31", 
    time: "02:00 PM - 05:00 PM",
    title: "Coding Session I", 
    description: "Bring your ideas to life. Design, architect, and begin coding your prototype.",
    icon: Rocket,
    color: "from-sky-500 to-blue-600"
  },
  { 
    id: 5,
    date: "2026-07-31", 
    time: "05:00 PM - 05:45 PM",
    title: "Tea Break", 
    description: "Enjoy some refreshments and discuss progress with mentors.",
    icon: Coffee,
    color: "from-amber-400 to-orange-600"
  },
  { 
    id: 6,
    date: "2026-07-31", 
    time: "06:00 PM",
    title: "Round 1 Evaluation", 
    description: "Rigorous evaluation round by expert judges to check concept, design, and plan.",
    icon: Target,
    color: "from-indigo-500 to-purple-600"
  },
  { 
    id: 7,
    date: "2026-07-31", 
    time: "08:00 PM - 09:00 PM",
    title: "Dinner Break", 
    description: "Recharge your energy with a delicious dinner.",
    icon: Coffee,
    color: "from-emerald-400 to-teal-600"
  },
  { 
    id: 8,
    date: "2026-07-31", 
    time: "09:00 PM - 12:00 AM",
    title: "Coding Session II", 
    description: "Deep hacking into the night. Connect databases and build APIs.",
    icon: Rocket,
    color: "from-purple-500 to-indigo-600"
  },
  { 
    id: 9,
    date: "2026-07-31", 
    time: "12:00 AM",
    title: "Midnight Snacks", 
    description: "A quick boost of energy with snacks for the night owls.",
    icon: Sparkles,
    color: "from-pink-500 to-rose-600"
  },
  { 
    id: 10,
    date: "2026-08-01", 
    time: "01:00 AM - 08:00 AM",
    title: "Coding Session III", 
    description: "The home stretch. Clean up code, fix bugs, and prepare presentation slide decks.",
    icon: Rocket,
    color: "from-cyan-500 to-blue-600"
  },
  { 
    id: 11,
    date: "2026-08-01", 
    time: "08:00 AM - 09:00 AM",
    title: "Tea Break", 
    description: "Morning hot tea to refresh before the final review rounds.",
    icon: Coffee,
    color: "from-yellow-400 to-orange-500"
  },
  { 
    id: 12,
    date: "2026-08-01", 
    time: "09:00 AM",
    title: "Round 2 Evaluation", 
    description: "Demonstrate your working prototype and address judges' questions.",
    icon: Target,
    color: "from-orange-500 to-red-600"
  },
  { 
    id: 13,
    date: "2026-08-01", 
    time: "11:00 AM",
    title: "Round 3 Evaluation", 
    description: "Final evaluation of shortlisted teams pitching live to the jury.",
    icon: Award,
    color: "from-teal-400 to-emerald-600"
  },
  { 
    id: 14,
    date: "2026-08-01", 
    time: "12:00 PM",
    title: "Valedictory Ceremony", 
    description: "Awards presentation, certificate distribution, and closing remarks.",
    icon: Trophy,
    color: "from-yellow-500 to-orange-500"
  }
];

function TiltCard({ children, isEven, isToday }: { children: React.ReactNode, isEven: boolean, isToday: boolean }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), { stiffness: 100, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), { stiffness: 100, damping: 20 });

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative p-8 md:p-12 rounded-[3.5rem] bg-white border-4 transition-all duration-300 shadow-2xl ${isToday ? 'border-indigo-600' : 'border-slate-50'}`}
    >
      <div style={{ transform: "translateZ(50px)" }}>
        {children}
      </div>
      
      {/* 3D Reflection Effect */}
      <div className="absolute inset-0 rounded-[3.5rem] bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
      
      {isToday && (
         <div className="absolute top-0 right-0 p-8">
            <div className="w-3 h-3 rounded-full bg-indigo-600 animate-ping shadow-[0_0_15px_rgba(79,70,229,1)]" />
         </div>
      )}
    </motion.div>
  );
}

export default function SchedulePage() {
  const now = new Date();
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 md:py-4 min-h-screen pb-16 relative overflow-hidden font-sans">
        
        {/* Header Section */}
        <div className="text-center mb-6 md:mb-8 relative z-10">
             <motion.div 
               initial={{ y: -20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               className="inline-flex items-center gap-2 bg-pink-400 text-black px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-widest mb-6 border-4 border-black shadow-[4px_4px_0_#000] rotate-2"
             >
                  <Calendar className="w-5 h-5 fill-black" />
                  HACKVEDA TIMELINE 2026
             </motion.div>
             <h1 className="text-5xl md:text-7xl lg:text-8xl font-comic text-black leading-none tracking-widest uppercase mb-4 drop-shadow-[4px_4px_0_#00f0ff]">
                EVENT <br />
                <span className="text-white drop-shadow-[4px_4px_0_#000]">SCHEDULE!</span>
             </h1>
             <p className="bg-white p-3 inline-block border-4 border-black rounded-xl text-sm font-bold text-gray-800 shadow-[4px_4px_0_#ff007f] transform -rotate-1 mx-auto max-w-lg">
                Stay updated with the official Hackveda event schedule. Every second counts.
             </p>
        </div>

        {/* Vertical Timeline */}
        <div ref={containerRef} className="relative z-10">
             
             {/* Center Line (Simplified for performance) */}
             <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-2 md:w-4 bg-white border-2 md:border-4 border-black md:-translate-x-1/2 shadow-[4px_4px_0_#000]">
                <div className="absolute inset-0 bg-cyan-400" />
             </div>

             <div className="space-y-8 md:space-y-10">
                  {timelineEvents.map((event, index) => {
                      const isEven = index % 2 === 0;
                      const eventDate = parseISO(event.date);
                      const isToday = format(now, "yyyy-MM-dd") === event.date;

                      // Comic theme alternating colors
                      const colors = ['bg-yellow-400', 'bg-pink-400', 'bg-cyan-400', 'bg-white'];
                      const cardColor = colors[index % colors.length];

                      return (
                          <div key={event.id} className={`relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-12 w-full ${isEven ? 'md:flex-row-reverse' : ''}`}>
                               
                               {/* Timeline Node Icon */}
                               <div className="absolute left-3 md:left-1/2 top-4 md:top-auto z-40 md:-translate-x-1/2">
                                   <div className={`w-14 h-14 md:w-16 md:h-16 rounded-xl ${isToday ? 'bg-pink-500 animate-pulse' : 'bg-white'} border-4 border-black shadow-[4px_4px_0_#000] flex items-center justify-center transform rotate-6 hover:rotate-12 transition-transform`}>
                                       <event.icon className="w-6 h-6 md:w-8 md:h-8 text-black stroke-[3]" />
                                   </div>
                               </div>

                               {/* Content Area */}
                               <div className="w-full md:w-[45%] pl-20 md:pl-0">
                                    <motion.div 
                                      initial={{ opacity: 0, y: 20 }}
                                      whileInView={{ opacity: 1, y: 0 }}
                                      viewport={{ once: true, margin: "-50px" }}
                                      whileHover={{ y: -8, x: isEven ? -8 : 8 }}
                                      className={`p-6 md:p-8 rounded-3xl ${cardColor} border-4 border-black shadow-[8px_8px_0_#000] hover:shadow-[16px_16px_0_#000] transition-all relative overflow-hidden group`}
                                    >
                                        {/* Halftone BG */}
                                        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '16px 16px' }} />

                                        <div className={`flex flex-wrap items-center gap-3 mb-4 md:mb-6 relative z-10 ${isEven ? 'md:justify-start' : 'md:justify-end'}`}>
                                            <div className="flex items-center gap-2 bg-black text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest shadow-[2px_2px_0_#fff]">
                                                <Clock className="w-4 h-4" />
                                                {event.time}
                                            </div>
                                            <div className="flex items-center gap-2 bg-white text-black px-3 py-1.5 rounded-lg border-2 border-black text-xs font-bold uppercase tracking-widest shadow-[2px_2px_0_#000]">
                                                <Calendar className="w-4 h-4" />
                                                {format(eventDate, "MMM dd")}
                                            </div>
                                        </div>

                                        <div className={`relative z-10 ${isEven ? 'md:text-left' : 'md:text-right'}`}>
                                            <h3 className="text-3xl md:text-4xl font-comic text-black mb-2 tracking-widest uppercase leading-none drop-shadow-[2px_2px_0_#fff]">
                                                {event.title}
                                            </h3>
                                            <p className="text-sm font-bold text-gray-800 leading-relaxed bg-white/80 inline-block p-2 border-2 border-black rounded-xl">
                                                {event.description}
                                            </p>
                                        </div>
                                    </motion.div>
                               </div>

                               {/* Spacer for layout */}
                               <div className="hidden md:block md:w-[45%]" />
                          </div>
                      );
                  })}
             </div>
        </div>

        {/* Footer Action */}
        <div className="mt-24 md:mt-32 text-center relative z-10">
             <Link href="/profile" className="inline-flex h-16 items-center justify-center gap-3 bg-cyan-400 text-black px-10 rounded-2xl border-4 border-black shadow-[8px_8px_0_#000] hover:-translate-y-1 hover:shadow-[12px_12px_0_#000] active:translate-y-2 active:shadow-none transition-all group">
                 <ArrowLeft className="w-6 h-6 stroke-[3] group-hover:-translate-x-2 transition-transform" />
                 <span className="text-xl font-comic tracking-widest uppercase">BACK TO DASHBOARD</span>
             </Link>
        </div>

      </div>
    </ProtectedRoute>
  );
}
