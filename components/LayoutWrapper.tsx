"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { useAuth } from "@/hooks/useAuth";
import { 
  Menu, 
  X, 
  Zap, 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Trophy, 
  ClipboardCheck, 
  ShieldCheck, 
  Mail, 
  Sparkles, 
  Cloud, 
  FileText,
  LogOut,
  Settings,
  Bell,
  Search,
  Award,
  BookOpen,
  MessageSquare,
  Loader2,
  Star,
  Circle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Toast, ToastType } from "./Toast";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const requestInProgressRef = useRef(false);

  // PWA Handler
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  // Minimum Loading Timer for visual impact
  useEffect(() => {
    const isAdminUser = typeof window !== 'undefined' && localStorage.getItem('adminSession') === 'active';
    const timer = setTimeout(() => setMinLoadingComplete(true), isAdminUser ? 1000 : 1500);
    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    setIsAdmin(typeof window !== 'undefined' && localStorage.getItem('adminSession') === 'active');
  }, [pathname, minLoadingComplete]);

  // Check if admin session is expired
  useEffect(() => {
    const checkSessionExpiry = () => {
      if (typeof window !== 'undefined') {
        const sessionStatus = localStorage.getItem('adminSession');
        const sessionTime = localStorage.getItem('adminSessionTime');
        
        if (sessionStatus === 'active' && sessionTime) {
          const sessionAgeMs = Date.now() - parseInt(sessionTime);
          const ADMIN_SESSION_TIMEOUT = 8 * 60 * 60 * 1000; // 8 hours
          
          if (sessionAgeMs > ADMIN_SESSION_TIMEOUT) {
            // Session expired - clear it
            localStorage.removeItem('adminSession');
            localStorage.removeItem('adminEmail');
            localStorage.removeItem('adminSessionTime');
            setIsAdmin(false);
          }
        }
      }
    };
    
    // Check every minute if admin session is still valid
    const interval = setInterval(checkSessionExpiry, 60000);
    return () => clearInterval(interval);
  }, []);

  // Real-time Announcement Listener
  useEffect(() => {
    if (!user && !isAdmin) return;

    const q = query(
      collection(db, "announcements"),
      orderBy("createdAt", "desc"),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newDoc = snapshot.docs[0];
      if (newDoc) {
        const id = newDoc.id;
        const data = newDoc.data();
        
        // Prevent showing on first load of the app or if already seen
        if (lastNotificationIdRef.current && id !== lastNotificationIdRef.current) {
            setToast({ 
                message: `ðŸ"¢ NEW UPDATE: ${data.title}`, 
                type: "info" 
            });
        }
        lastNotificationIdRef.current = id;
      }
    });

    return () => unsubscribe();
  }, [user, isAdmin]);

  const isAuthPage = pathname === "/login" || pathname === "/admin/login";
  const showSidebar = (!loading && minLoadingComplete) && (user || isAdmin) && !isAuthPage;
  const showNavbar = !showSidebar && !isAuthPage;

  // Close sidebar on navigation (for mobile)
  useEffect(() => {
    if (typeof window !== 'undefined') {
        window.scrollTo(0, 0);
    }
    setIsSidebarOpen(false);
  }, [pathname]);

  if (loading || !minLoadingComplete) {
    const letters = "HACKVEDA".split("");
    const colors = ["bg-pink-500", "bg-cyan-400", "bg-yellow-400", "bg-purple-500", "bg-green-400", "bg-orange-500", "bg-blue-500", "bg-red-500"];
    
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fffcf0] font-sans overflow-hidden relative selection:bg-pink-500 selection:text-white">
          {/* Subtle Halftone Overlay (Same as Dashboard) */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.05] z-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '12px 12px' }} />

          <div className="relative z-1 flex flex-col items-center">
              {/* Logo Entrance */}
              <div className="mb-12 relative flex flex-col items-center">
                  <motion.div
                    animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [-2, 2, -2]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mb-8 relative"
                  >
                      <div className="w-24 h-24 md:w-32 md:h-32 bg-yellow-400 border-8 border-black rounded-3xl flex items-center justify-center shadow-[10px_10px_0_#ff007f]">
                          <Zap className="w-16 h-16 md:w-20 md:h-20 text-black fill-black" />
                      </div>
                      <div className="absolute -top-4 -right-4 bg-white border-4 border-black px-4 py-1 rounded-lg font-comic text-xl shadow-[4px_4px_0_#000] rotate-12">
                          HERO!
                      </div>
                  </motion.div>

                  <div className="flex flex-wrap justify-center gap-4 px-4">
                      {letters.map((letter, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0, y: 50 }}
                          animate={{ scale: 1, y: 0 }}
                          transition={{ 
                            type: "spring", 
                            damping: 12, 
                            stiffness: 200, 
                            delay: i * 0.1 
                          }}
                          className={`w-12 h-16 md:w-16 md:h-20 flex items-center justify-center border-4 border-black rounded-xl ${colors[i % colors.length]} shadow-[8px_8px_0_#000]`}
                        >
                          <span className="text-3xl md:text-5xl font-comic text-black select-none leading-none drop-shadow-[2px_2px_0_#fff]">
                            {letter}
                          </span>
                        </motion.div>
                      ))}
                  </div>
              </div>

              {/* Progress Bar & Simple Text */}
              <div className="space-y-8 text-center mt-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="inline-block bg-white text-black px-8 py-3 border-4 border-black rounded-2xl font-comic text-2xl uppercase tracking-widest shadow-[8px_8px_0_#00f0ff] transform rotate-1"
                  >
                    WAKING UP THE SYSTEM...
                  </motion.div>
                  
                  <div className="flex flex-col items-center gap-4 justify-center">
                      <div className="w-48 h-10 bg-white border-4 border-black rounded-xl p-1 shadow-[4px_4px_0_#ff007f]">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: '100%' }}
                             transition={{ duration: 4.5, ease: "easeInOut" }}
                             className="h-full bg-cyan-400 border-2 border-black rounded-lg"
                           />
                      </div>
                      <p className="text-black font-comic text-lg uppercase tracking-[0.3em] font-black drop-shadow-[2px_2px_0_#fff]">
                         GET READY TO START
                      </p>
                  </div>
              </div>
          </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#fffcf0] font-sans ${showSidebar ? 'lg:pl-72' : ''}`}>
      
      {/* Desktop Sidebar */}
      {showSidebar && (
        <aside className="fixed left-0 top-0 bottom-0 w-72 bg-white border-r-4 border-black z-[100] hidden lg:block overflow-hidden shadow-[4px_0px_0_#000]">
           <Sidebar />
        </aside>
      )}

      {/* Mobile Top Bar */}
      {showSidebar && (
          <header className={`lg:hidden fixed top-0 left-0 right-0 h-20 border-b-4 border-black px-6 flex items-center justify-between shadow-[0px_4px_0_#000] transition-colors duration-200 ${isSidebarOpen ? 'z-[100] bg-pink-400 text-white' : 'z-[100] bg-white text-black'} pointer-events-auto`}>
               <div className="flex items-center gap-4">
                    <div className="bg-yellow-400 p-2.5 rounded-xl border-2 border-black shadow-[2px_2px_0_#000]">
                         <Zap className="w-5 h-5 text-black fill-black" />
                    </div>
                    <span className={`text-3xl font-comic tracking-widest uppercase drop-shadow-[2px_2px_0_#00f0ff] ${isSidebarOpen ? 'text-white' : 'text-black'}`}>
                         HACKVEDA
                    </span>
               </div>
                <button 
                  onClick={() => setIsSidebarOpen(prev => !prev)}
                  className={`p-3 border-2 border-black shadow-[2px_2px_0_#000] rounded-xl bg-pink-400 text-black pointer-events-auto active:translate-y-0.5 active:shadow-none transition-all`}
                >
                     {isSidebarOpen ? <X className="w-6 h-6 stroke-[3]" /> : <Menu className="w-6 h-6 stroke-[3]" />}
                </button>
          </header>
      )}

      {/* Mobile Sidebar Cleanup */}
      <AnimatePresence>
          {isSidebarOpen && (
              <>
                  <motion.div 
                     key="backdrop"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     onTap={() => setIsSidebarOpen(false)}
                     onClick={() => setIsSidebarOpen(false)}
                     className="fixed inset-0 z-[100] lg:hidden bg-black/60 cursor-pointer pointer-events-auto" 
                     style={{ WebkitTouchCallout: 'none' }}
                  />
                  <motion.aside 
                     key="sidebar-panel"
                     initial={{ x: "-100%" }}
                     animate={{ x: 0 }}
                     exit={{ x: "-100%" }}
                     transition={{ type: "spring", damping: 25, stiffness: 200 }}
                     className="fixed top-0 left-0 bottom-0 w-[280px] bg-white border-r-4 border-black z-[110] flex flex-col lg:hidden pointer-events-auto shadow-[10px_0_0_rgba(0,0,0,0.1)]"
                  >
                     <Sidebar onClose={() => setIsSidebarOpen(false)} />
                  </motion.aside>
              </>
          )}
      </AnimatePresence>

      {showNavbar && <Navbar />}

      <main className={`min-h-screen w-full relative z-1 overflow-x-hidden ${showSidebar && pathname !== "/login" ? 'pt-20 lg:pt-0 lg:border-l-8 lg:border-black' : ''}`}>
           {/* Page Transition removed for better performance on mobile/PWA */}

            {/* Premium Minimal Background System */}
            {/* Restored Comic Background System (100% Safe) */}
            <div className="fixed inset-0 pointer-events-none z-[-10] overflow-hidden bg-[#fffcf0]">
                {/* Moving Dot Grid (Cleaner than halftone) */}
                <motion.div 
                    className="absolute inset-0 opacity-[0.06]"
                    style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '32px 32px' }}
                    animate={{ x: ['0px', '-32px'], y: ['0px', '-32px'] }}
                    transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
                />

                {/* Floating Comic Icons (The "HackVeda" Look) */}
                <div className="absolute inset-0 opacity-[0.15]">
                    {/* Floating Zap */}
                    <motion.div
                      animate={{ y: [0, -30, 0], rotate: [0, 15, 0] }}
                      transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                      className="absolute top-[15%] left-[10%]"
                    >
                        <Zap className="w-32 h-32 text-pink-500 fill-pink-500 stroke-black stroke-[1.5]" />
                    </motion.div>
                    
                    {/* Floating Star */}
                    <motion.div
                      animate={{ y: [0, 40, 0], rotate: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 1 }}
                      className="absolute bottom-[25%] right-[15%]"
                    >
                        <Star className="w-48 h-48 text-yellow-400 fill-yellow-400 stroke-black stroke-[1.5]" />
                    </motion.div>

                    {/* Comic Text elements */}
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 12 }}
                      className="absolute top-[35%] right-[10%] text-8xl font-comic text-indigo-400 opacity-[0.4] -rotate-12 drop-shadow-[4px_4px_0_#000]"
                    >
                        POW!
                    </motion.div>
                </div>
            </div>
           <div className="w-full relative z-1 px-4 sm:px-6 lg:px-12 py-12 max-w-[90rem] mx-auto min-h-screen">
                <motion.div
                    key={pathname}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, ease: "backOut" }}
                >
                    {children}
                </motion.div>
           </div>
      </main>

       {/* Simplified Footer for Auth/Landing */}
       {!showSidebar && (
         <footer className="border-t border-gray-100 py-32 bg-gray-50/20 relative overflow-hidden">
             <div className="max-w-7xl mx-auto px-6 text-center relative z-1">
                 <div className="inline-flex items-center gap-2 mb-12 opacity-30 group hover:opacity-100 transition-opacity">
                     <div className="bg-gray-900 p-2 rounded-xl">
                         <Zap className="w-5 h-5 text-white fill-white" />
                     </div>
                     <span className="font-black tracking-[0.4em] text-[10px] uppercase italic text-gray-900">Official Student Portal</span>
                 </div>
                 <p className="text-gray-900 text-sm font-black italic uppercase tracking-[0.5em] leading-none mb-10">
                     &copy; 2026 HACKVEDA | SMVITM
                 </p>
                 <div className="h-10 w-[1px] bg-gradient-to-b from-transparent via-gray-200 to-transparent mx-auto mb-10" />
                 <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] leading-relaxed italic max-w-sm mx-auto">
                     Shri Madhwa Vadiraja Institute of Technology & Management <br />
                     Innovation Excellence Since 2011
                 </p>
             </div>
             {/* Footer Decoration */}
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-indigo-100 to-transparent" />
         </footer>
       )}

      {/* Persistent PWA Install Banner */}
      <AnimatePresence>
        {deferredPrompt && showPwaBanner && !isAdmin && (
           <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-0 left-0 right-0 z-[200] p-4 pointer-events-none"
           >
               <div className="max-w-md mx-auto bg-black text-white p-4 rounded-3xl border-4 border-yellow-400 shadow-[0_-8px_20px_rgba(0,0,0,0.5)] flex items-center gap-4 relative isolate overflow-hidden">
                   {/* Background rays */}
                   <div className="absolute inset-0 z-0 opacity-20 bg-[repeating-conic-gradient(#fff_0_15deg,#000_15deg_30deg)] animate-spin-slow" />
                   
                   <div className="w-14 h-14 bg-yellow-400 rounded-2xl border-2 border-white flex items-center justify-center shrink-0 relative z-1 shadow-[4px_4px_0_#fff]">
                       <Zap className="w-8 h-8 text-black fill-black" />
                   </div>
                   <div className="flex-1 relative z-1">
                       <h4 className="font-comic text-xl uppercase tracking-widest text-yellow-400 leading-none drop-shadow-[2px_2px_0_#000]">INSTALL APP!</h4>
                       <p className="text-[10px] font-bold tracking-widest uppercase mt-1">Faster access + notifications</p>
                   </div>
                   <div className="flex flex-col gap-2 relative z-1 shrink-0">
                       <button 
                         onClick={handleInstallClick}
                         className="px-4 py-2 bg-pink-500 border-2 border-white rounded-xl font-comic text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[2px_2px_0_#fff]"
                       >
                           INSTALL
                       </button>
                       <button 
                          onClick={(e) => {
                             e.stopPropagation();
                             setShowPwaBanner(false);
                          }}
                          className="text-[10px] uppercase font-black tracking-widest text-gray-400 hover:text-white"
                       >
                           NOT NOW
                       </button>
                   </div>
               </div>
           </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications */}
      <AnimatePresence>
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
            duration={8000}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
