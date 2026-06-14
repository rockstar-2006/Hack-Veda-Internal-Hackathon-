"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function LoadingScreen() {
  // Start hidden — set visible in effect to avoid SSR/StrictMode issues
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Show the loading screen on every page load / refresh
    setVisible(true);
    const t1 = setTimeout(() => setShowContent(true), 100);

    // Fill progress bar over ~2 seconds
    let p = 0;
    const t2 = setTimeout(() => {
      const interval = setInterval(() => {
        p += 2;
        setProgress(Math.min(p, 100));
        if (p >= 100) {
          clearInterval(interval);
          // Dismiss after a short hold at 100%
          setTimeout(() => {
            setVisible(false);
          }, 500);
        }
      }, 35);
      return () => clearInterval(interval);
    }, 400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const loadingLabel =
    progress < 25
      ? "FETCHING SQUAD DATA..."
      : progress < 55
      ? "LOADING FIXTURES..."
      : progress < 80
      ? "PREPARING PITCH..."
      : progress < 100
      ? "ALMOST READY..."
      : "LET'S PLAY! 🏏";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="hpl-splash"
          initial={{ opacity: 1 }}
          exit={{ y: "-100%", transition: { duration: 0.55, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-[9999] overflow-hidden flex flex-col items-center justify-center"
          style={{ background: "#fffcf0" }}
        >
          {/* Site's halftone pattern */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, black 1px, transparent 0)",
              backgroundSize: "12px 12px",
            }}
          />

          {/* Decorative corner blocks — matches the site's neo-brutalist style */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-400 border-r-8 border-b-8 border-black opacity-60" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-400 border-l-8 border-b-8 border-black opacity-60" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-400 border-r-8 border-t-8 border-black opacity-60" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-400 border-l-8 border-t-8 border-black opacity-60" />

          {/* ── Content card (matches site's card style) ── */}
          <AnimatePresence>
            {showContent && (
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: "backOut" }}
                className="relative z-10 flex flex-col items-center px-8 py-10 md:px-16 md:py-14 bg-white border-8 border-black rounded-3xl shadow-[12px_12px_0_#000] max-w-lg w-[90%] mx-4"
              >
                {/* Top badge — exactly like the dashboard badge */}
                <div className="flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-xl border-4 border-black shadow-[4px_4px_0_#000] mb-6 -rotate-1">
                  <span className="text-base">🏏</span>
                  <span className="font-comic text-sm tracking-wider uppercase">
                    Season 1 · SMVITM · 2026
                  </span>
                </div>

                {/* Giant HPL — same drop-shadow style as headings */}
                <h1
                  className="font-comic text-[5rem] sm:text-[7rem] leading-none uppercase text-center mb-1"
                  style={{ textShadow: "5px 5px 0 #ff007f, 10px 10px 0 #000" }}
                >
                  <span className="text-yellow-400">H</span>
                  <span className="text-pink-400">P</span>
                  <span className="text-cyan-400">L</span>
                </h1>

                {/* Sub title */}
                <p className="font-comic text-lg sm:text-xl text-black uppercase tracking-widest text-center mb-1 drop-shadow-[2px_2px_0_#ff007f]">
                  Hackathon Premier League
                </p>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-gray-500 mb-7">
                  Where Tech Meets The Pitch
                </p>

                {/* Cricket decorations row */}
                <div className="flex items-center justify-center gap-6 mb-7">
                  {/* Bat */}
                  <motion.div
                    animate={{ rotate: [-15, 15, -15] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                    className="text-4xl select-none"
                  >
                    🏏
                  </motion.div>

                  {/* Cricket ball — SVG with seams */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12"
                  >
                    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="24" cy="24" r="22" fill="#dc2626" stroke="#000" strokeWidth="3"/>
                      <circle cx="24" cy="24" r="22" fill="url(#grad)" stroke="#000" strokeWidth="3"/>
                      <path d="M 7 24 Q 15 14 24 24 Q 33 34 41 24" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
                      <path d="M 7 24 Q 15 34 24 24 Q 33 14 41 24" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
                      <ellipse cx="18" cy="16" rx="4" ry="2.5" fill="white" opacity="0.2" transform="rotate(-30 18 16)"/>
                      <defs>
                        <radialGradient id="grad" cx="35%" cy="30%" r="65%">
                          <stop offset="0%" stopColor="#ef4444"/>
                          <stop offset="100%" stopColor="#7f1d1d"/>
                        </radialGradient>
                      </defs>
                    </svg>
                  </motion.div>

                  {/* Trophy */}
                  <motion.div
                    animate={{ y: [-4, 0, -4] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                    className="text-4xl select-none"
                  >
                    🏆
                  </motion.div>
                </div>

                {/* ── Progress bar — neo-brutalist style ── */}
                <div className="w-full">
                  {/* Label */}
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-comic text-xs uppercase tracking-wider text-black">
                      {loadingLabel}
                    </span>
                    <span className="font-comic text-xs text-pink-500 font-bold">
                      {Math.round(progress)}%
                    </span>
                  </div>

                  {/* Track */}
                  <div className="h-5 w-full bg-gray-100 border-4 border-black rounded-xl overflow-hidden shadow-[3px_3px_0_#000] relative">
                    {/* Striped background */}
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(45deg, #000 0, #000 2px, transparent 2px, transparent 12px)",
                      }}
                    />
                    <motion.div
                      className="h-full relative overflow-hidden rounded-lg"
                      style={{ width: `${progress}%` }}
                      transition={{ ease: "linear" }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400" />
                      {/* Shimmer sweep */}
                      <motion.div
                        className="absolute inset-y-0 w-8 bg-white/40 skew-x-12"
                        animate={{ x: ["-32px", "500px"] }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                      />
                    </motion.div>
                  </div>

                  {/* Wicket dots under bar */}
                  <div className="flex justify-between mt-2 px-0.5">
                    {[20, 40, 60, 80, 100].map((mark, i) => (
                      <div
                        key={i}
                        className={`flex flex-col items-center transition-all duration-300 ${
                          progress >= mark ? "opacity-100" : "opacity-20"
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full border-2 border-black ${
                            progress >= mark ? "bg-yellow-400" : "bg-gray-300"
                          }`}
                        />
                        <span className="font-comic text-[8px] text-black mt-0.5">
                          W{i + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Clubs footer */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
                  {["CodeTroopers", "IGNITE", "AIKYA", "SMVITM"].map((club, i) => (
                    <span
                      key={i}
                      className="bg-black text-white font-comic text-[9px] uppercase tracking-widest px-2 py-1 rounded-lg border-2 border-black"
                    >
                      {club}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
