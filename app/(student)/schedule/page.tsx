"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  Trophy, 
  Rocket, 
  Sparkles, 
  Award,
  ArrowLeft,
  Target,
  Megaphone,
  UserCheck,
  Globe,
  MapPin
} from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Link from "next/link";
import { useRef } from "react";

// Native date formatter — no date-fns needed
const fmtDate = (isoStr: string) =>
  new Date(isoStr).toLocaleDateString("en-US", { month: "short", day: "2-digit" });


const timelineEvents = [
  { 
    id: 1,
    date: "2026-07-15", 
    time: "10:00 AM",
    title: "Registrations Open", 
    description: "Launch of HPL portal and registrations open for all SMVITM squads.",
    icon: Megaphone,
    color: "bg-blue-400",
    badge: "SEASON OPENER",
    cricket: "🏏",
  },
  { 
    id: 2,
    date: "2026-07-30", 
    time: "5:00 PM",
    title: "Roster Lockdown", 
    description: "Deadline for registrations. Squad rosters and franchise names locked.",
    icon: UserCheck,
    color: "bg-red-400",
    badge: "SQUAD DEADLINE",
    cricket: "📋",
  },
  { 
    id: 3,
    date: "2026-07-31", 
    time: "11:00 AM",
    title: "Track Allocation", 
    description: "Tracks allocated to confirmed squads. Phase 1 problem descriptions unlocked.",
    icon: Target,
    color: "bg-purple-400",
    badge: "TOSS TIME",
    cricket: "🎯",
  },
  { 
    id: 4,
    date: "2026-08-08", 
    time: "10:00 AM – 5:00 PM",
    title: "Match Day 1", 
    description: "First online head-to-head fixtures. Deliverables submitted and points table updated.",
    icon: Globe,
    color: "bg-yellow-400",
    badge: "MATCH DAY 1",
    cricket: "🟡",
    isMatchDay: true,
  },
  { 
    id: 5,
    date: "2026-08-15", 
    time: "10:00 AM – 5:00 PM",
    title: "Match Day 2", 
    description: "Second online fixtures. Progress builds evaluated. Top 10 consolidated.",
    icon: Trophy,
    color: "bg-orange-400",
    badge: "MATCH DAY 2",
    cricket: "🟠",
    isMatchDay: true,
  },
  { 
    id: 6,
    date: "2026-08-21", 
    time: "9:00 AM – 8:00 PM",
    title: "Grand Finale – Day 1", 
    description: "Top 10 squads assemble on-campus at MBA Block for final phase sprints.",
    icon: Rocket,
    color: "bg-sky-400",
    badge: "GRAND FINALE",
    cricket: "🏟️",
    isMatchDay: true,
  },
  { 
    id: 7,
    date: "2026-08-22", 
    time: "9:00 AM – 12:00 PM",
    title: "Live Demos & Pitches", 
    description: "Top squads pitch complete solutions to expert industry jury and campus audience.",
    icon: Sparkles,
    color: "bg-pink-400",
    badge: "LIVE DEMOS",
    cricket: "⚡",
    isMatchDay: true,
  },
  { 
    id: 8,
    date: "2026-08-22", 
    time: "2:00 PM",
    title: "HPL Awards & Valedictory", 
    description: "Crowning of HPL Champions, Championship Trophy, and Cash Reward distribution.",
    icon: Award,
    color: "bg-emerald-400",
    badge: "CHAMPIONS CROWNED",
    cricket: "🏆",
    isMatchDay: true,
  }
];

// Floating cricket ball that travels down the timeline
const CricketBall = ({ style }: { style?: React.CSSProperties }) => (
  <div
    className="w-8 h-8 rounded-full bg-red-600 border-3 border-black flex items-center justify-center shadow-[3px_3px_0_#000] relative shrink-0"
    style={style}
  >
    {/* Cricket ball seam lines */}
    <svg viewBox="0 0 32 32" className="absolute inset-0 w-full h-full" fill="none">
      <circle cx="16" cy="16" r="14" fill="#dc2626" stroke="#000" strokeWidth="2.5"/>
      {/* Horizontal seam */}
      <path d="M4 16 Q10 10 16 16 Q22 22 28 16" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M4 16 Q10 22 16 16 Q22 10 28 16" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Vertical seam */}
      <path d="M16 4 Q10 10 16 16 Q22 22 16 28" stroke="#fff" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.5"/>
    </svg>
  </div>
);

function TimelineEvent({ event, index }: { event: typeof timelineEvents[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.3, 1]);
  const x = useTransform(scrollYProgress, [0, 0.5], [index % 2 === 0 ? -30 : 30, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);

  const isLeft = index % 2 === 0;

  return (
    <div ref={ref} className={`flex items-start gap-0 ${isLeft ? 'flex-row' : 'flex-row-reverse'} mb-4 md:mb-2`}>
      
      {/* Card Side */}
      <motion.div
        style={{ opacity, x, scale }}
        className={`w-[calc(50%-2.5rem)] md:w-[calc(50%-3rem)] ${isLeft ? 'pr-4 md:pr-6' : 'pl-4 md:pl-6'}`}
      >
        <div
          className={`${event.color} border-4 border-black rounded-2xl shadow-[6px_6px_0_#000] hover:shadow-[10px_10px_0_#000] transition-all hover:-translate-y-1 p-4 relative overflow-hidden group`}
        >
          {/* Dot pattern */}
          <div className="absolute inset-0 opacity-[0.07] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '14px 14px' }} />
          
          {/* Match day indicator */}
          {event.isMatchDay && (
            <div className="absolute top-2 right-2 bg-black text-yellow-400 font-comic text-[8px] px-2 py-1 rounded-lg border-2 border-yellow-400 shadow-[2px_2px_0_#fbbf24] animate-pulse z-10">
              ⚡ FIXTURE
            </div>
          )}

          {/* Header row */}
          <div className="flex items-start gap-2 mb-2 relative z-10">
            <div className="w-9 h-9 rounded-xl bg-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0_#000] shrink-0 group-hover:rotate-12 transition-transform duration-300">
              <event.icon className="w-4 h-4 text-black stroke-[2.5]" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="bg-black text-white font-comic text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-md border border-white/20">
                {event.badge}
              </span>
              <h3 className="font-comic text-base md:text-lg text-black uppercase tracking-wide leading-tight mt-0.5 drop-shadow-[1px_1px_0_#fff]">
                {event.title}
              </h3>
            </div>
          </div>

          {/* Date & time chips */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2 relative z-10">
            <div className="flex items-center gap-1 bg-white border-2 border-black px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-[1.5px_1.5px_0_#000]">
              <Calendar className="w-2.5 h-2.5" />
              {fmtDate(event.date)}
            </div>
            <div className="flex items-center gap-1 bg-black text-white px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-[1.5px_1.5px_0_#fff]">
              <Clock className="w-2.5 h-2.5" />
              {event.time}
            </div>
          </div>

          {/* Description */}
          <p className="text-[10px] md:text-xs font-bold text-gray-800 leading-relaxed bg-white/75 p-2 border-2 border-black rounded-xl relative z-10">
            {event.description}
          </p>
        </div>
      </motion.div>

      {/* Centre axis — cricket ball + line connector */}
      <div className="flex flex-col items-center w-20 md:w-24 shrink-0 relative">
        {/* Number badge */}
        <motion.div
          style={{ scale }}
          className="z-10"
        >
          <CricketBall />
        </motion.div>
        {/* Event number */}
        <div className="absolute top-0 right-0 -mr-1 -mt-1 w-5 h-5 bg-white border-2 border-black rounded-full flex items-center justify-center font-black text-[9px] z-20">
          {String(index + 1).padStart(2, '0')}
        </div>
        {/* Vertical dashed line down to next event */}
        {index < timelineEvents.length - 1 && (
          <div className="w-0.5 flex-1 mt-1 border-l-4 border-dashed border-black/30 min-h-[40px]" />
        )}
      </div>

      {/* Empty opposite side */}
      <div className="w-[calc(50%-2.5rem)] md:w-[calc(50%-3rem)]" />
    </div>
  );
}

export default function SchedulePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  // Ball travels down the full-height progress line  
  const ballY = useTransform(scrollYProgress, [0, 1], ["0%", "95%"]);

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 min-h-screen font-sans">

        {/* ─── Page Header Bar ─── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <Link href="/profile" className="flex items-center gap-2 bg-pink-400 text-black px-4 py-2.5 rounded-xl font-comic text-sm uppercase tracking-widest border-4 border-black shadow-[4px_4px_0_#000] hover:-translate-y-0.5 transition-all">
              <ArrowLeft className="w-4 h-4 stroke-[3]" /> BACK
            </Link>
            <div className="flex items-center gap-2 bg-pink-400 text-black px-3 py-2.5 rounded-xl border-4 border-black shadow-[3px_3px_0_#000]">
              <Calendar className="w-4 h-4 fill-black" />
              <span className="font-comic text-sm tracking-wider uppercase">HPL CALENDAR 2026</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border-4 border-black px-3 py-2 rounded-xl shadow-[3px_3px_0_#000]">
              <MapPin className="w-4 h-4 text-black" />
              <span className="text-xs font-black uppercase tracking-wider">MBA Block, SMVITM</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-comic text-black uppercase drop-shadow-[3px_3px_0_#00f0ff] leading-none">
              LEAGUE <span className="text-white drop-shadow-[3px_3px_0_#000]">SCHEDULE!</span>
            </h1>
          </div>
        </div>

        {/* ─── Cricket pitch stat strip ─── */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          {[
            { emoji: "🏏", label: "3 Match Phases", color: "bg-yellow-400" },
            { emoji: "🟡", label: "2 Online Match Days", color: "bg-orange-400" },
            { emoji: "🏟️", label: "1 Offline Grand Finale", color: "bg-pink-400" },
            { emoji: "🏆", label: "Aug 22 · Awards Day", color: "bg-emerald-400" },
          ].map((s, i) => (
            <div key={i} className={`${s.color} border-4 border-black px-4 py-2 rounded-2xl shadow-[4px_4px_0_#000] flex items-center gap-2`}>
              <span>{s.emoji}</span>
              <span className="font-comic text-sm uppercase tracking-wider">{s.label}</span>
            </div>
          ))}
        </div>

        {/* ─── Vertical Cricket Timeline ─── */}
        <div ref={containerRef} className="relative">
          {/* Scrolling cricket ball progress indicator */}
          <motion.div
            className="fixed left-1/2 -translate-x-1/2 z-50 pointer-events-none hidden lg:block"
            style={{ top: "50%", opacity: scrollYProgress }}
          >
            {/* This is purely decorative - a cricket emoji that fades in on scroll */}
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="text-3xl select-none"
              style={{ filter: "drop-shadow(2px 2px 0 rgba(0,0,0,0.3))" }}
            >
              🏏
            </motion.span>
          </motion.div>

          {/* Timeline events */}
          {timelineEvents.map((event, index) => (
            <TimelineEvent key={event.id} event={event} index={index} />
          ))}

          {/* End cap */}
          <div className="flex flex-col items-center mt-2">
            <div className="w-12 h-12 rounded-full bg-black border-4 border-black flex items-center justify-center shadow-[4px_4px_0_#ff007f]">
              <Trophy className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            </div>
            <div className="font-comic text-base text-black uppercase tracking-widest mt-2 bg-yellow-400 px-4 py-2 border-4 border-black rounded-2xl shadow-[4px_4px_0_#000]">
              🏆 HPL SEASON 1 COMPLETE!
            </div>
          </div>
        </div>

      </div>
    </ProtectedRoute>
  );
}
