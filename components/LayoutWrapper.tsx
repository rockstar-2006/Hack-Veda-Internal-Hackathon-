"use client";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, Suspense } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { useAuth } from "@/hooks/useAuth";
import {
  Menu, X, Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Toast, ToastType } from "./Toast";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import LiveBackground from "./LiveBackground";

export const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: ToastType } | null>(null);
  const lastNotificationIdRef = useRef<string | null>(null);
  const [minLoadingComplete, setMinLoadingComplete] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPwaBanner, setShowPwaBanner] = useState(true);

  // NAVIGATION & SCROLL MANAGEMENT
  useEffect(() => {
    setIsSidebarOpen(false);
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
      document.body.style.overflow = '';
    }
  }, [pathname]);

  // PWA Prompt Manager
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Body Scroll Lock (Robust)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isSidebarOpen]);

  // 🔐 Secure Session & Loading Orchestration
  useEffect(() => {
    // 1. Initial State Sync
    const checkAdmin = () => typeof window !== 'undefined' && localStorage.getItem('adminSession') === 'active';
    const isAdminActive = checkAdmin();
    setIsAdmin(isAdminActive);

    // 2. Loading State Delay (Visual Impact)
    const timer = setTimeout(() => {
      setMinLoadingComplete(true);
      // Double check admin state in case it changed during loading
      setIsAdmin(checkAdmin());
    }, isAdminActive ? 300 : 800);

    return () => clearTimeout(timer);
  }, [pathname]); // Stable size array [pathname]

  // Real-time Announcement Listener
  useEffect(() => {
    if (!user && !isAdmin) return;
    const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"), limit(1));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newDoc = snapshot.docs[0];
      if (newDoc) {
        const id = newDoc.id;
        const data = newDoc.data();
        if (lastNotificationIdRef.current && id !== lastNotificationIdRef.current) {
          setToast({ message: `📢 NEW UPDATE: ${data.title}`, type: "info" });
        }
        lastNotificationIdRef.current = id;
      }
    });
    return () => unsubscribe();
  }, [user, isAdmin]);

  const isAuthPage = pathname === "/login" || pathname === "/admin/login";
  const showSidebar = (!loading && minLoadingComplete) && (user || isAdmin) && !isAuthPage;
  const showNavbar = !showSidebar && !isAuthPage;

  const handleInstallClick = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setDeferredPrompt(null);
  };

  // 🧪 LOADING SCREEN
  if (loading || !minLoadingComplete) {
    return (
      <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#fffcf0] font-sans">
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [2, -2, 2] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="w-20 h-20 bg-yellow-400 border-4 border-black rounded-2xl flex items-center justify-center shadow-[6px_6px_0_#ff007f] relative"
        >
          <Zap className="w-10 h-10 text-black fill-black" />
        </motion.div>
        <div className="mt-8 text-black font-comic text-xl uppercase tracking-widest animate-pulse">Initializing...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#fffcf0] font-sans ${showSidebar ? 'lg:pl-72' : ''} selection:bg-pink-500 selection:text-white relative isolate`}>

      {/* 🚀 THE VIBRANT LIVE BACKGROUND (MEMOIZED FOR MAX PERFORMANCE) */}
      <LiveBackground />

      {/* MOBILE HEADER */}
      {showSidebar && (
        <header className={`lg:hidden fixed top-0 left-0 right-0 h-20 border-b-4 border-black px-6 flex items-center justify-between shadow-[0px_4px_0_#000] z-[150] transition-all bg-white text-black`}>
          <div className="flex items-center gap-3">
            <div className="bg-yellow-400 p-2 rounded-xl border-2 border-black">
              <Zap className="w-5 h-5 text-black fill-black font-black" />
            </div>
            <span className="text-xl font-comic tracking-tighter uppercase font-black">HACKVEDA</span>
          </div>
          <button
            onClick={(e: React.MouseEvent) => { e.preventDefault(); setIsSidebarOpen(prev => !prev); }}
            className={`p-3 border-2 border-black rounded-xl bg-pink-400 text-black active:translate-y-0.5 shadow-[2px_2px_0_#000] ${isSidebarOpen ? 'bg-white' : ''} transition-colors`}
          >
            {isSidebarOpen ? <X className="w-6 h-6 stroke-[3]" /> : <Menu className="w-6 h-6 stroke-[3]" />}
          </button>
        </header>
      )}

      {/* DESKTOP SIDEBAR */}
      {showSidebar && (
        <aside className="fixed left-0 top-0 bottom-0 w-72 bg-white border-r-4 border-black z-[50] hidden lg:block shadow-[4px_0_0_#000]">
          <Sidebar />
        </aside>
      )}

      {/* MOBILE SIDEBAR PANEL */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 z-[200] lg:hidden backdrop-blur-sm pointer-events-auto"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 w-[300px] bg-white border-r-4 border-black z-[210] flex flex-col shadow-[20px_0_60px_rgba(0,0,0,0.4)] lg:hidden pointer-events-auto"
            >
              <Sidebar onClose={() => setIsSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {showNavbar && <Navbar />}

      {/* MAIN VIEWPORT (Relative z-[1]) */}
      <main className={`relative z-[1] w-full min-h-screen ${showSidebar && pathname !== "/login" ? 'pt-20 lg:pt-0 lg:border-l-8 lg:border-black' : ''}`}>
        <div id="click-recovery-layer" className="w-full relative px-4 sm:px-6 lg:px-12 py-12 max-w-[90rem] mx-auto min-h-screen pointer-events-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* PWA BANNER (Z-INDEX: 300) */}
      <AnimatePresence>
        {deferredPrompt && showPwaBanner && !isAdmin && (
          <motion.div
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 200, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-[300] p-4 pointer-events-none select-none lg:p-8"
          >
            <div className="max-w-md mx-auto bg-black text-white p-4 rounded-3xl border-4 border-yellow-400 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] flex items-center gap-4 pointer-events-auto relative isolate overflow-hidden">
              <div className="absolute inset-0 z-0 opacity-20 bg-[repeating-conic-gradient(#fff_0_15deg,#000_15deg_30deg)] animate-spin-slow" />
              <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center shrink-0 relative z-1">
                <Zap className="w-6 h-6 text-black fill-black" />
              </div>
              <div className="flex-1 relative z-1">
                <h4 className="font-comic text-lg uppercase tracking-widest text-yellow-400">GET APP!</h4>
              </div>
              <div className="flex items-center gap-2 relative z-1">
                <button
                  onClick={handleInstallClick}
                  className="px-5 py-2.5 bg-pink-500 border-2 border-white rounded-xl font-comic text-xs uppercase tracking-widest active:scale-95 transition-all shadow-[2px_2px_0_rgba(255,255,255,0.2)]"
                >
                  INSTALL
                </button>
                <X
                  className="w-6 h-6 text-gray-500 cursor-pointer p-1"
                  onClick={(e: React.MouseEvent) => { e.stopPropagation(); setShowPwaBanner(false); }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOAST SYSTEM (Z-INDEX: 999) */}
      <div className="fixed top-4 right-4 z-[999] pointer-events-none">
        <AnimatePresence>
          {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </AnimatePresence>
      </div>

    </div>
  );
};

export default LayoutWrapper;
