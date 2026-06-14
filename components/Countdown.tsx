"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CountdownProps {
  targetDate: string;
  label: string;
  compact?: boolean;
}

export const Countdown = ({ targetDate, label, compact = false }: CountdownProps) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const distance = target - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return null;

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex items-center justify-center mb-3">
        <div className="bg-pink-400 p-1 px-3 rounded-full border-2 border-black shadow-[2px_2px_0_#000]">
          <p className={`font-bold text-black uppercase tracking-widest ${compact ? 'text-[9px]' : 'text-xs'}`}>{label}</p>
        </div>
      </div>
      
      <div className={`flex items-center justify-center ${compact ? 'gap-1.5' : 'gap-3 sm:gap-4'} w-full`}>
        <TimeUnit value={timeLeft.days} label="DAYS" color="bg-yellow-400" compact={compact} />
        <Separator compact={compact} />
        <TimeUnit value={timeLeft.hours} label="HRS" color="bg-cyan-400" compact={compact} />
        <Separator compact={compact} />
        <TimeUnit value={timeLeft.minutes} label="MINS" color="bg-purple-400" compact={compact} />
        <Separator compact={compact} />
        <TimeUnit value={timeLeft.seconds} label="SECS" color="bg-pink-400" compact={compact} />
      </div>
    </div>
  );
};

const Separator = ({ compact }: { compact: boolean }) => (
  <div className={`text-black font-comic drop-shadow-[2px_2px_0_#000] mt-[-0.75rem] ${compact ? 'text-lg' : 'text-2xl md:text-4xl'}`}>:</div>
);

const TimeUnit = ({ value, label, color, compact }: { value: number; label: string; color: string; compact: boolean }) => (
  <div className="flex flex-col items-center gap-1.5">
    <div className={`relative ${color} border-4 border-black rounded-xl flex items-center justify-center shadow-[3px_3px_0_#000] ${compact ? 'h-12 w-12' : 'h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20'}`}>
      <span className={`font-comic text-black shadow-[1px_1px_0_#fff] ${compact ? 'text-2xl' : 'text-3xl sm:text-4xl'}`}>
        {value.toString().padStart(2, '0')}
      </span>
    </div>
    <p className={`w-max font-bold text-black bg-white border-2 border-black rounded-full shadow-[2px_2px_0_#000] uppercase tracking-widest ${compact ? 'text-[8px] px-1.5 py-0.5' : 'text-[10px] sm:text-xs px-3 py-1'}`}>{label}</p>
  </div>
);
