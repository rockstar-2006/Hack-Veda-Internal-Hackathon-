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
    <div className="flex flex-col items-center md:items-start">
      <div className="flex items-center gap-4 mb-4">
         <div className="h-0.5 w-6 bg-indigo-600 rounded-full" />
         <p className="text-[10px] font-black text-gray-900 uppercase tracking-[0.4em] italic leading-none">{label}</p>
      </div>
      
      <div className="flex items-center gap-6 md:gap-10">
        <TimeUnit value={timeLeft.days} label="Days" />
        <Separator />
        <TimeUnit value={timeLeft.hours} label="Hours" />
        <Separator />
        <TimeUnit value={timeLeft.minutes} label="Mins" />
        <Separator />
        <TimeUnit value={timeLeft.seconds} label="Secs" />
      </div>
    </div>
  );
};

const Separator = () => (
    <div className="text-xl md:text-3xl font-black text-gray-300 xl:mt-[-0.5rem] mt-[-0.25rem]">:</div>
);

const TimeUnit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center md:items-start gap-1">
    <div className="relative h-12 md:h-20 flex items-center justify-center min-w-[3rem] md:min-w-[4.5rem]">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="text-3xl sm:text-4xl md:text-6xl font-black text-gray-950 tracking-tighter italic absolute"
        >
          {value.toString().padStart(2, '0')}
        </motion.span>
      </AnimatePresence>
    </div>
    <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest italic opacity-80">{label}</p>
  </div>
);
