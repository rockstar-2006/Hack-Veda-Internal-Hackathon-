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
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-24 min-h-screen pb-32 md:pb-40 relative overflow-hidden">
        
        {/* Animated Background Elements */}
        <div className="fixed inset-0 -z-10 bg-white">
            <motion.div 
               animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
               transition={{ duration: 15, repeat: Infinity }}
               className="absolute -top-10 -right-10 w-64 h-64 md:w-96 md:h-96 bg-indigo-50 rounded-full blur-[80px] opacity-60"
            />
            <motion.div 
               animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
               transition={{ duration: 18, repeat: Infinity }}
               className="absolute bottom-20 -left-10 w-48 h-48 md:w-80 md:h-80 bg-sky-50 rounded-full blur-[60px] opacity-50"
            />
        </div>

        {/* Header Section */}
        <div className="text-center mb-20 md:mb-32">
             <motion.div 
               initial={{ y: -20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 border border-indigo-100 shadow-sm"
             >
                  <Calendar className="w-3.5 h-3.5 fill-indigo-600" />
                  Hackveda Timeline 2026
             </motion.div>
             <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight tracking-tight mb-4 uppercase">
                Plan Your <br />
                <span className="text-indigo-600">Success.</span>
             </h1>
             <p className="text-sm md:text-base text-gray-500 font-medium max-w-lg mx-auto">
                Stay updated with the official Hackveda event schedule. Every second counts.
             </p>
        </div>

        {/* Vertical Timeline */}
        <div ref={containerRef} className="relative">
             
             {/* Dynamic Center Line */}
             <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1.5 md:w-2 bg-gray-100 md:-translate-x-1/2 rounded-full overflow-hidden">
                <motion.div 
                   style={{ scaleY: scrollYProgress }}
                   className="absolute top-0 left-0 right-0 bg-indigo-600 origin-top shadow-sm"
                />
             </div>

             <div className="space-y-16 md:space-y-24">
                  {timelineEvents.map((event, index) => {
                      const isEven = index % 2 === 0;
                      const eventDate = parseISO(event.date);
                      const isToday = format(now, "yyyy-MM-dd") === event.date;

                      return (
                          <motion.div 
                             key={event.id}
                             initial={{ opacity: 0, x: isEven ? 20 : -20 }}
                             whileInView={{ opacity: 1, x: 0 }}
                             viewport={{ once: true, margin: "-50px" }}
                             transition={{ duration: 0.6 }}
                             className={`relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-12 ${isEven ? 'md:flex-row-reverse' : ''}`}
                          >
                               {/* 3D Pop Icon */}
                               <div className="absolute left-4 md:left-1/2 top-4 md:top-auto z-40 md:-translate-x-1/2">
                                   <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl bg-indigo-600 border-2 border-white shadow-md flex items-center justify-center transition-transform hover:rotate-6 hover:scale-105`}>
                                       <event.icon className="w-4 h-4 md:w-6 md:h-6 text-white" />
                                   </div>
                               </div>

                               {/* Content Area */}
                               <div className="w-full md:w-[45%] pl-16 md:pl-0">
                                    <TiltCard isEven={isEven} isToday={isToday}>
                                        <div className={`flex flex-wrap items-center gap-3 mb-4 md:mb-6 ${isEven ? 'md:justify-end' : ''}`}>
                                            <div className="flex items-center gap-1.5 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-sm">
                                                <Clock className="w-3 h-3" />
                                                {event.time}
                                            </div>
                                            <div className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg border border-indigo-100 text-[10px] font-bold uppercase tracking-widest">
                                                <Calendar className="w-3 h-3" />
                                                {format(eventDate, "MMM dd")}
                                            </div>
                                        </div>

                                        <div className={`${isEven ? 'md:text-right' : 'md:text-left'}`}>
                                            <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-2 tracking-tight uppercase leading-none">
                                                {event.title}
                                            </h3>
                                            <p className="text-sm font-medium text-gray-500 leading-relaxed pr-2 md:pr-4">
                                                {event.description}
                                            </p>
                                        </div>
                                        
                                        {/* Progressive Visual */}
                                        <div className={`mt-6 h-1 w-16 md:w-20 bg-gray-100 rounded-full overflow-hidden ${isEven ? 'ml-auto' : ''}`}>
                                            <motion.div 
                                               initial={{ width: 0 }}
                                               whileInView={{ width: '100%' }}
                                               transition={{ duration: 0.8, delay: 0.3 }}
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
                                        className="relative w-24 h-24 border-2 border-dashed border-indigo-100 rounded-full opacity-50 flex items-center justify-center"
                                    >
                                        <CircleDot className="w-6 h-6 text-indigo-200" />
                                    </motion.div>
                               </div>
                          </motion.div>
                      );
                  })}
             </div>
        </div>

        {/* Footer Action */}
        <div className="mt-24 md:mt-32 text-center">
             <Link href="/profile" className="inline-flex h-12 md:h-14 items-center justify-center gap-3 bg-gray-900 text-white px-8 md:px-10 rounded-xl shadow-md hover:bg-black transition-all hover:scale-105 active:scale-95 group relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                 <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1.5 transition-transform" />
                 <span className="text-xs md:text-sm font-bold tracking-widest uppercase relative z-10">Back to Dashboard</span>
             </Link>
        </div>

      </div>
    </ProtectedRoute>
);
}
