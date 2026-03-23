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
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPwaBanner, setShowPwaBanner] = useState(true);

  // 🔐 STABILITY-FIRST NAVIGATION ORCHESTRATOR
  useEffect(() => {
    // One effect to rule them all on pathname change
    if (typeof window === 'undefined') return;

    // 1. Definitively clear all sidebar and overflow states
    setIsSidebarOpen(false);
    document.body.style.overflow = '';
    document.body.style.touchAction = 'auto';
    
    // 2. Ensure we are at the top (instant, no smooth scroll which can hang)
    window.scrollTo({ top: 0, behavior: 'instant' });

    // 3. Manage the initializing overlay (only for real loading or initial mount)
    // We don't reset minLoadingComplete here anymore to avoid the 800ms "hang" on every page
    
    // 4. Sync admin state (instant)
    const isAdminActive = localStorage.getItem('adminSession') === 'active';
    setIsAdmin(isAdminActive);

  }, [pathname]);

  // 🚀 INTERACTION AUDITOR & EMERGENCY CLEAR
  useEffect(() => {
    let clickCount = 0;
    const handleGlobalClick = (e: MouseEvent) => {
      clickCount++;
      const target = e.target as HTMLElement;
      
      // Robust logging that handles non-string classNames (like SVGs)
      const className = (target && typeof target.className === 'string') ? target.className : '[non-string]';
      console.log(`[DEBUG] Interaction #${clickCount} | Path: ${pathname} | Target: ${target ? target.tagName : 'null'}${target?.id ? '#' + target.id : ''}${className !== '[non-string]' && className ? '.' + className.split(' ')[0] : ''} | Coords: ${e.clientX},${e.clientY}`);
      
      // Automatic state recovery: If user is clicking around, ensure sidebar doesn't block
      if (isSidebarOpen && target && !target.closest('.Sidebar') && !target.closest('header')) {
        console.log("[DEBUG] Sidebar detected as potential blocker, clearing...");
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('click', handleGlobalClick, true);
    return () => window.removeEventListener('click', handleGlobalClick, true);
  }, [pathname, isSidebarOpen]);


  // Real-time Announcement Listener
  useEffect(() => {
    if (!user && !isAdmin) return;
    try {
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
      }, (error) => {
        console.warn("Announcement Listener Error:", error);
      });
      return () => unsubscribe();
    } catch (err) {
      console.warn("Could not setup announcement listener:", err);
    }
  }, [user, isAdmin]);

  const isAuthPage = pathname === "/login" || pathname === "/admin/login";
  
  // 🔥 HYDRATION-SAFE VISIBILITY LOGIC
  const [navMode, setNavMode] = useState<'sidebar' | 'navbar' | 'none'>('none');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('hackveda_last_nav_mode') as any;
    if (isAuthPage) {
      setNavMode('none');
    } else {
      const isAuthed = (user || isAdmin);
      const initialMode = isAuthed ? 'sidebar' : (saved || 'navbar');
      setNavMode(initialMode);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (isAuthPage) {
      setNavMode('none');
      return;
    }
    const isAuthed = (user || isAdmin);
    const mode = isAuthed ? 'sidebar' : 'navbar';
    setNavMode(mode);
    localStorage.setItem('hackveda_last_nav_mode', mode);
  }, [user, isAdmin, isAuthPage, mounted]);

  const showSidebar = mounted && navMode === 'sidebar';
  const showNavbar = mounted && navMode === 'navbar';

  const handleInstallClick = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!deferredPrompt) return;
    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setDeferredPrompt(null);
    } catch (err) {
      console.error("Install Prompt Failed:", err);
    }
  };

  // 🏰 THE LAYOUT STABILIZER
  // To avoid the "Up and Down" glitch on loading screens, we pre-allocate the nav space 
  // based on the route, which is available even before hydration (Server-Safe).
  const portalMode = mounted ? (navMode === 'sidebar') : (typeof window !== 'undefined' ? (localStorage.getItem('hackveda_last_nav_mode') === 'sidebar') : true);
  
  // These classes are applied instantly without waiting for hydration state flicker
  const layoutClasses = !isAuthPage ? 'pt-20 lg:pt-0 lg:pl-0' : '';
  const innerLayoutClasses = !isAuthPage ? 'lg:border-l-8 lg:border-black' : '';

  return (
    <div className={`min-h-screen bg-[#fffcf0] font-sans ${!isAuthPage ? 'lg:pl-72' : ''} selection:bg-pink-500 selection:text-white relative isolate`}>

      {/* 🚀 THE VIBRANT LIVE BACKGROUND (Z-INDEX: -2) */}
      <div id="live-background-container" className="fixed inset-0 z-[-2] pointer-events-none">
         <LiveBackground />
      </div>

      {/* MAIN VIEWPORT (Z-INDEX: 1 + Relative boost) */}

      {/* MOBILE HEADER (Z-INDEX: 150) */}
      {showSidebar && (
        <header className="lg:hidden fixed top-0 left-0 right-0 h-20 border-b-4 border-black px-6 flex items-center justify-between shadow-[0px_4px_0_#000] z-[150] bg-white text-black">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-400 p-2 rounded-xl border-2 border-black">
              <Zap className="w-5 h-5 text-black fill-black font-black" />
            </div>
            <span className="text-xl font-comic tracking-tighter uppercase font-black">HACK-O-VEDA</span>
          </div>
          <button
            onClick={(e: React.MouseEvent) => { e.preventDefault(); setIsSidebarOpen(prev => !prev); }}
            className={`p-3 border-2 border-black rounded-xl bg-pink-400 text-black active:translate-y-0.5 shadow-[2px_2px_0_#000] ${isSidebarOpen ? 'bg-white' : ''} transition-colors`}
          >
            {isSidebarOpen ? <X className="w-6 h-6 stroke-[3]" /> : <Menu className="w-6 h-6 stroke-[3]" />}
          </button>
        </header>
      )}

      {/* DESKTOP SIDEBAR (Z-INDEX: 50) */}
      {showSidebar && (
        <aside className="fixed left-0 top-0 bottom-0 w-72 bg-white border-r-4 border-black z-[50] hidden lg:block shadow-[4px_0_0_#000]">
          <Sidebar />
        </aside>
      )}

      {/* MOBILE SIDEBAR PANEL (Z-INDEX: 210) */}
      {(isSidebarOpen) && (
        <>
          <div
            key="overlay"
            onClick={() => {
              console.log("Overlay clicked, closing sidebar...");
              setIsSidebarOpen(false);
            }}
            className="fixed inset-0 bg-black/60 z-[200] lg:hidden backdrop-blur-sm pointer-events-auto cursor-pointer"
          />
          <motion.aside
            key="panel"
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

      {showNavbar && <Navbar />}

      {/* MAIN VIEWPORT (Z-INDEX: 1 + Relative boost) */}
      <main className={`relative z-[1] w-full min-h-screen ${!isAuthPage ? 'pt-20 lg:pt-0 lg:border-l-8 lg:border-black' : ''}`}>
        <div 
          id="click-recovery-layer" 
          onClick={(e) => {
             // For debugging user's "clicking too many times"
             console.log(`User clicked at: ${e.clientX}, ${e.clientY} | Path: ${pathname}`);
          }}
          className="w-full relative px-4 sm:px-6 lg:px-12 py-12 max-w-[90rem] mx-auto min-h-screen pointer-events-auto z-[30]"
        >
          {/* Simple, reliable direct rendering to prevent Framer Motion exit-hangs */}
          <div key={pathname} className="w-full">
            {children}
          </div>
        </div>
      </main>

      {/* PWA BANNER (Z-INDEX: 300) */}
      <AnimatePresence>
        {deferredPrompt && showPwaBanner && !isAdmin && (
          <motion.div
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 200, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-[300] p-4 pointer-events-none select-none lg:p-4"
          >
            <div className="max-w-md mx-auto bg-black text-white p-4 rounded-3xl border-4 border-yellow-400 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] flex items-center gap-4 pointer-events-auto relative isolate overflow-hidden">
               <div className="absolute inset-0 z-0 opacity-20 bg-yellow-400/10" />
               <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center shrink-0 relative z-1">
                 <Zap className="w-6 h-6 text-black fill-black" />
               </div>
               <div className="flex-1 relative z-1">
                 <h4 className="font-comic text-md uppercase tracking-widest text-yellow-400 leading-none">GET APP!</h4>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">Faster access on mobile</p>
               </div>
               <div className="flex items-center gap-2 relative z-1">
                 <button
                   onClick={handleInstallClick}
                   className="px-4 py-2 bg-pink-500 border-2 border-white rounded-xl font-comic text-xs uppercase tracking-widest active:scale-95 transition-all shadow-[2px_2px_0_rgba(255,255,255,0.2)]"
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
      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-8 sm:bottom-8 z-[999] pointer-events-none flex flex-col items-end gap-3">
        <AnimatePresence>
          {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </AnimatePresence>
      </div>

    </div>
  );
};

export default LayoutWrapper;
