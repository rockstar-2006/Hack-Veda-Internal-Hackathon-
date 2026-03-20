"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CountdownProps {
  targetDate: string; // ISO string
  label: string;
}

export const Countdown = ({ targetDate, label }: CountdownProps) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const distance = target - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return null;

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center justify-center gap-4 mb-6">
         <div className="bg-pink-400 p-1.5 px-4 rounded-full border-2 border-black shadow-[2px_2px_0_#000]">
            <p className="text-xs font-bold text-black uppercase tracking-widest">{label}</p>
         </div>
      </div>
      
      <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
        <TimeUnit value={timeLeft.days} label="DAYS" color="bg-yellow-400" />
        <Separator />
        <TimeUnit value={timeLeft.hours} label="HRS" color="bg-cyan-400" />
        <Separator />
        <TimeUnit value={timeLeft.minutes} label="MINS" color="bg-purple-400" />
        <Separator />
        <TimeUnit value={timeLeft.seconds} label="SECS" color="bg-pink-400" />
      </div>
    </div>
  );
};

const Separator = () => (
    <div className="hidden sm:block text-2xl md:text-4xl font-comic text-black mt-[-1rem] drop-shadow-[2px_2px_0_#000]">:</div>
);

const TimeUnit = ({ value, label, color }: { value: number; label: string; color: string }) => (
  <div className="flex flex-col items-center gap-2">
    <div className={`relative h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 ${color} border-4 border-black rounded-2xl flex items-center justify-center shadow-[4px_4px_0_#000]`}>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ scale: 0.5, y: -20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 1.5, y: 20, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="text-4xl sm:text-5xl md:text-6xl font-comic text-black drop-shadow-[2px_2px_0_#fff] absolute"
        >
          {value.toString().padStart(2, '0')}
        </motion.span>
      </AnimatePresence>
    </div>
    <p className="text-[10px] sm:text-xs font-bold text-black bg-white px-3 py-1 border-2 border-black rounded-full shadow-[2px_2px_0_#000] uppercase tracking-widest">{label}</p>
  </div>
);
