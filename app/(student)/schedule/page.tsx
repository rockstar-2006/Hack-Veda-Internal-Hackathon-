"use client";

import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
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
    date: "2026-04-01", 
    time: "09:00 AM",
    title: "Registration Opens", 
    description: "Start creating your teams and preparing your idea proposals.",
    icon: Users,
    color: "from-blue-500 to-indigo-600"
  },
  { 
    id: 2,
    date: "2026-04-06", 
    time: "11:59 PM",
    title: "Registration Closes", 
    description: "Final deadline for team formation and PDF submissions.",
    icon: Flag,
    color: "from-rose-500 to-red-600"
  },
  { 
    id: 3,
    date: "2026-04-08", 
    time: "10:00 AM",
    title: "Shortlist Announcement", 
    description: "The top teams selected for the final hackathon are revealed.",
    icon: Sparkles,
    color: "from-amber-400 to-orange-600"
  },
  { 
    id: 4,
    date: "2026-04-10", 
    time: "10:00 AM",
    title: "Grand Inauguration", 
    description: "Official opening ceremony of Hackveda 2026 at the Auditorium.",
    icon: Mic2,
    color: "from-indigo-500 to-purple-600"
  },
  { 
    id: 5,
    date: "2026-04-10", 
    time: "12:00 PM",
    title: "Hackathon Start", 
    description: "The 24-hour non-stop building phase begins. Good luck!",
    icon: Zap,
    color: "from-yellow-400 to-amber-600"
  },
  { 
    id: 6,
    date: "2026-04-10", 
    time: "06:00 PM",
    title: "Checkpoint 1", 
    description: "Mentors will visit your table to review progress and guide you.",
    icon: Coffee,
    color: "from-sky-500 to-blue-600"
  },
  { 
    id: 7,
    date: "2026-04-11", 
    time: "10:00 AM",
    title: "Checkpoint 2", 
    description: "Final review of your projects before the ultimate submission.",
    icon: Target,
    color: "from-emerald-400 to-teal-600"
  },
  { 
    id: 8,
    date: "2026-04-11", 
    time: "12:00 PM",
    title: "Final Submission", 
    description: "All coding stops. Submit your final projects for evaluation.",
    icon: Rocket,
    color: "from-red-500 to-rose-600"
  },
  { 
    id: 9,
    date: "2026-04-11", 
    time: "12 PM - 2 PM",
    title: "Judge Presentation", 
    description: "Present your hard work to our panel of expert judges.",
    icon: Award,
    color: "from-indigo-600 to-violet-700"
  },
  { 
    id: 10,
    date: "2026-04-11", 
    time: "03:00 PM",
    title: "Awards Ceremony", 
    description: "The moment of truth. Prizes and certificates are distributed.",
    icon: Trophy,
    color: "from-yellow-500 to-orange-500"
  },
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
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-6 py-24 min-h-screen pb-60 relative overflow-hidden">
        
        {/* Animated Background Elements */}
        <div className="fixed inset-0 -z-10 bg-white">
            <motion.div 
               animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
               transition={{ duration: 15, repeat: Infinity }}
               className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-indigo-50 rounded-full blur-[120px] opacity-60"
            />
            <motion.div 
               animate={{ x: [0, -40, 0], y: [0, 60, 0] }}
               transition={{ duration: 18, repeat: Infinity }}
               className="absolute bottom-40 -left-20 w-[500px] h-[500px] bg-sky-50 rounded-full blur-[100px] opacity-50"
            />
        </div>

        {/* Header Section */}
        <div className="text-center mb-40">
             <motion.div 
               initial={{ y: -20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               className="inline-flex items-center gap-3 bg-indigo-50 text-indigo-700 px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.3em] mb-12 italic border border-indigo-100 shadow-sm"
             >
                  <Calendar className="w-4 h-4 fill-indigo-600" />
                  Hackveda Timeline 2026
             </motion.div>
             <h1 className="text-4xl md:text-7xl font-black text-gray-900 leading-tight tracking-tighter mb-10 italic uppercase">
                Plan Your <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-950 font-black">Success.</span>
             </h1>
             <p className="text-base md:text-lg text-gray-400 font-bold max-w-2xl mx-auto italic leading-relaxed">
                Stay updated with the official Hackveda event schedule. Every second counts.
             </p>
        </div>

        {/* Vertical Timeline */}
        <div ref={containerRef} className="relative">
             
             {/* Dynamic Center Line */}
             <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-3 bg-slate-100 md:-translate-x-1/2 rounded-full overflow-hidden">
                <motion.div 
                   style={{ scaleY: scrollYProgress }}
                   className="absolute top-0 left-0 right-0 bg-indigo-600 origin-top shadow-[0_0_20px_rgba(79,70,229,0.5)]"
                />
             </div>

             <div className="space-y-32">
                  {timelineEvents.map((event, index) => {
                      const isEven = index % 2 === 0;
                      const eventDate = parseISO(event.date);
                      const isToday = format(now, "yyyy-MM-dd") === event.date;

                      return (
                          <motion.div 
                             key={event.id}
                             initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                             whileInView={{ opacity: 1, x: 0 }}
                             viewport={{ once: true, margin: "-100px" }}
                             transition={{ duration: 0.8 }}
                             className={`relative flex flex-col md:flex-row items-start md:items-center justify-between gap-12 ${isEven ? 'md:flex-row-reverse' : ''}`}
                          >
                               {/* 3D Pop Icon */}
                               <div className="absolute left-6 md:left-1/2 top-4 md:top-auto z-40 md:-translate-x-1/2">
                                   <div className={`w-14 h-14 md:w-20 md:h-20 rounded-[2rem] bg-indigo-600 border-4 border-white shadow-2xl flex items-center justify-center transition-transform hover:rotate-12 hover:scale-110`}>
                                       <event.icon className="w-6 h-6 md:w-10 md:h-10 text-white" />
                                   </div>
                               </div>

                               {/* Content Area */}
                               <div className="w-full md:w-[45%] pl-24 md:pl-0">
                                    <TiltCard isEven={isEven} isToday={isToday}>
                                        <div className={`flex flex-wrap items-center gap-4 mb-8 ${isEven ? 'md:justify-end' : ''}`}>
                                            <div className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest italic shadow-xl">
                                                <Clock className="w-3.5 h-3.5" />
                                                {event.time}
                                            </div>
                                            <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-5 py-2.5 rounded-2xl border border-indigo-100 text-[10px] font-black uppercase tracking-widest italic">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {format(eventDate, "MMM dd")}
                                            </div>
                                        </div>

                                        <div className={`${isEven ? 'md:text-right' : 'md:text-left'}`}>
                                            <h3 className="text-2xl md:text-4xl font-black text-gray-900 mb-4 tracking-tighter italic uppercase leading-none">
                                                {event.title}
                                            </h3>
                                            <p className="text-base font-bold text-gray-400 leading-relaxed italic pr-4 opacity-70 group-hover:opacity-100 transition-opacity">
                                                {event.description}
                                            </p>
                                        </div>
                                        
                                        {/* Progressive Visual */}
                                        <div className={`mt-10 h-1.5 w-24 bg-indigo-50 rounded-full overflow-hidden ${isEven ? 'ml-auto' : ''}`}>
                                            <motion.div 
                                                                                               initial={{ width: 0 }}
                                               whileInView={{ width: '100%' }}
                                               transition={{ duration: 1, delay: 0.5 }}
                                               className={`h-full bg-gradient-to-r ${event.color}`}
                                            />
                                        </div>
                                    </TiltCard>
                               </div>

                               {/* Hidden spacer on mobile, side display on desktop */}
                               <div className="hidden md:flex md:w-[45%] items-center justify-center">
                                    <motion.div 
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                        className="relative w-48 h-48 border-4 border-dashed border-indigo-50 rounded-full opacity-30 flex items-center justify-center p-8"
                                    >
                                        <CircleDot className="w-12 h-12 text-indigo-100" />
                                    </motion.div>
                               </div>
                          </motion.div>
                      );
                  })}
             </div>
        </div>

        {/* Footer Action */}
        <div className="mt-56 text-center">
             <Link href="/profile" className="inline-flex h-24 items-center justify-center gap-8 bg-gray-950 text-white px-20 rounded-[3rem] shadow-3xl hover:bg-black transition-all hover:scale-105 active:scale-95 group relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                 <ArrowLeft className="w-6 h-6 group-hover:-translate-x-3 transition-transform" />
                 <span className="text-xl font-black tracking-tight uppercase italic relative z-10">Back to Dashboard</span>
             </Link>
        </div>

      </div>
    </ProtectedRoute>
);
}
