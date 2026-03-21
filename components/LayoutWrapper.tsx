"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
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
  const [lastNotificationId, setLastNotificationId] = useState<string | null>(null);
  const [minLoadingComplete, setMinLoadingComplete] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPwaBanner, setShowPwaBanner] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // PWA Handler
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

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
    const timer = setTimeout(() => setMinLoadingComplete(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setIsAdmin(typeof window !== 'undefined' && localStorage.getItem('adminSession') === 'active');
  }, [pathname]);

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
        if (lastNotificationId && id !== lastNotificationId) {
            setToast({ 
                message: `ðŸ“¢ NEW UPDATE: ${data.title}`, 
                type: "info" 
            });
        }
        setLastNotificationId(id);
      }
    });

    return () => unsubscribe();
  }, [user, isAdmin, lastNotificationId]);

  const isAuthPage = pathname === "/login" || pathname === "/admin/login";
  const showSidebar = (!loading && minLoadingComplete) && (user || isAdmin) && !isAuthPage;
  const showNavbar = !showSidebar && !isAuthPage;

  // Close sidebar on navigation (for mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  if (loading || !minLoadingComplete) {
    const letters = "HACKVEDA".split("");
    const colors = ["bg-pink-500", "bg-cyan-400", "bg-yellow-400", "bg-purple-500", "bg-green-400", "bg-orange-500", "bg-blue-500", "bg-red-500"];
    
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fffcf0] font-sans overflow-hidden relative selection:bg-pink-500 selection:text-white">
          {/* Subtle Halftone Overlay (Same as Dashboard) */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.05] z-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '12px 12px' }} />

          <div className="relative z-10 flex flex-col items-center">
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
          <header className={`lg:hidden fixed top-0 left-0 right-0 h-20 border-b-4 border-black px-6 flex items-center justify-between shadow-[0px_4px_0_#000] transition-all duration-300 ${isSidebarOpen ? 'z-[20005] bg-pink-400' : 'z-[10002] bg-white'} pointer-events-auto`}>
               <div className="flex items-center gap-4">
                    <div className="bg-yellow-400 p-2.5 rounded-xl border-2 border-black shadow-[2px_2px_0_#000]">
                         <Zap className="w-5 h-5 text-black fill-black" />
                    </div>
                    <span className={`text-3xl font-comic tracking-widest uppercase drop-shadow-[2px_2px_0_#00f0ff] ${isSidebarOpen ? 'text-white' : 'text-black'}`}>
                         HACKVEDA
                    </span>
               </div>
               <motion.button 
                 whileTap={{ scale: 0.9, y: 2, boxShadow: "0 0 0 #000" }}
                 onClick={() => setIsSidebarOpen(prev => !prev)}
                 className={`p-3 border-2 border-black shadow-[2px_2px_0_#000] rounded-xl transition-all bg-pink-400 text-black pointer-events-auto ${isSidebarOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
               >
                    <Menu className="w-6 h-6 stroke-[3]" />
               </motion.button>
          </header>
      )}

      {/* Mobile Sidebar Backdrop */}
      <AnimatePresence>
          {isSidebarOpen && (
              <motion.div 
                 key="backdrop"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 onClick={() => setIsSidebarOpen(false)}
                 className="fixed inset-0 z-[20000] lg:hidden bg-black/80 backdrop-blur-md cursor-pointer pointer-events-auto"
              />
          )}
      </AnimatePresence>

      {/* Mobile Sidebar Panel */}
      <AnimatePresence>
          {isSidebarOpen && (
              <motion.aside 
                 key="sidebar-panel"
                 initial={{ x: "-100%" }}
                 animate={{ x: 0 }}
                 exit={{ x: "-100%" }}
                 transition={{ type: "spring", damping: 25, stiffness: 200 }}
                 className="fixed top-0 left-0 bottom-0 w-[300px] bg-white border-r-4 border-black z-[20005] shadow-[20px_0px_0_#000] flex flex-col lg:hidden pointer-events-auto"
              >
                 <Sidebar onClose={() => setIsSidebarOpen(false)} />
              </motion.aside>
          )}
      </AnimatePresence>

      {showNavbar && <Navbar />}

      <main className={`min-h-screen w-full relative overflow-hidden bg-[#fdfdfd] border-black ${showSidebar ? (pathname !== "/login" ? 'pt-20 lg:pt-0 lg:border-l-8' : '') : ''}`}>
           {/* Navigation Transition Effect (ZAP!) */}
           <motion.div
              key={pathname + "-transition"}
              initial={{ opacity: 1, scale: 2 }}
              animate={{ opacity: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed inset-0 z-[150] pointer-events-none flex items-center justify-center"
           >
               <div className="absolute inset-0 bg-yellow-400 opacity-20" />
               {/* Speed lines on transition */}
               {[...Array(12)].map((_, i) => (
                    <div 
                        key={i} 
                        className="absolute bg-black w-[200%] h-4" 
                        style={{ 
                            top: '50%', 
                            left: '50%', 
                            transform: `translate(-50%, -50%) rotate(${i * 30}deg)` 
                        }} 
                    />
               ))}
           </motion.div>

           {/* Global Animated Live Background Pattern */}
           <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-white">
               {/* Animated moving halftone grid */}
               <motion.div 
                   className="absolute inset-[0%] opacity-20 w-[120%] h-[120%]"
                   style={{ 
                       backgroundImage: 'radial-gradient(circle at 2px 2px, #000 1.5px, transparent 0)', 
                       backgroundSize: '28px 28px' 
                   }}
                   animate={{ 
                       x: ['0px', '-28px'], 
                       y: ['0px', '-28px'] 
                   }}
                   transition={{ 
                       repeat: Infinity, 
                       duration: 3, 
                       ease: "linear" 
                   }}
               />

               {/* Live Floating Comic Elements */}
               {showSidebar && (
                  <div className="absolute inset-0 pointer-events-none select-none">
                   <motion.div
                     animate={{ y: [0, -40, 0], rotate: [0, 15, 0], scale: [1, 1.1, 1] }}
                     transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
                     className="absolute top-[15%] left-[8%] opacity-[0.25]"
                   >
                       <Zap className="w-28 h-28 text-pink-500 fill-pink-500 stroke-black stroke-[1.5]" />
                   </motion.div>
                   
                   <motion.div
                     animate={{ y: [0, 50, 0], rotate: [0, -20, 0], scale: [1, 1.2, 1] }}
                     transition={{ repeat: Infinity, duration: 9, ease: "easeInOut", delay: 1 }}
                     className="absolute top-[55%] right-[10%] opacity-[0.2]"
                   >
                       <Star className="w-40 h-40 text-yellow-400 fill-yellow-400 stroke-black stroke-[1.5]" />
                   </motion.div>

                   <motion.div
                     animate={{ y: [0, -30, 0], rotate: [0, 8, 0] }}
                     transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 2 }}
                     className="absolute top-[75%] left-[15%] opacity-[0.25]"
                   >
                       <Circle className="w-24 h-24 text-cyan-400 border-[10px] border-cyan-400 rounded-full bg-transparent" />
                   </motion.div>
                   
                   <motion.div
                     animate={{ y: [0, 30, 0], rotate: [0, -25, 0], scale: [1, 1.15, 1] }}
                     transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut", delay: 0.5 }}
                     className="absolute top-[25%] right-[20%] opacity-[0.3]"
                   >
                       <div className="text-7xl font-comic text-indigo-400 transform -rotate-12 select-none drop-shadow-[4px_4px_0_#000]">POW!</div>
                   </motion.div>

                   <motion.div
                     animate={{ x: [200, -200, 200], rotate: [0, 90, 0] }}
                     transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                     className="absolute top-[40%] left-[30%] opacity-[0.1]"
                   >
                       <Zap className="w-32 h-32 text-yellow-400 fill-yellow-400 stroke-black stroke-[1]" />
                   </motion.div>

                   <motion.div
                     animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
                     transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
                     className="absolute bottom-[20%] right-[30%] opacity-[0.2]"
                   >
                       <div className="text-9xl font-comic text-pink-400 transform rotate-12 select-none drop-shadow-[4px_4px_0_#000]">ZAP!</div>
                   </motion.div>
                  </div>
               )}
           </div>
           
           <div className="w-full relative z-10 px-4 sm:px-6 lg:px-12 py-12 max-w-[90rem] mx-auto min-h-screen">
                <motion.div
                    key={pathname}
                    initial={{ opacity: 0, y: 10, rotate: -0.5 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    transition={{ duration: 0.4, ease: "backOut" }}
                >
                    {children}
                </motion.div>
           </div>
      </main>

       {/* Simplified Footer for Auth/Landing */}
       {!showSidebar && (
         <footer className="border-t border-gray-100 py-32 bg-gray-50/20 relative overflow-hidden">
             <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
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
              className="fixed bottom-0 left-0 right-0 z-[50000] p-4 pointer-events-auto"
           >
               <div className="max-w-md mx-auto bg-black text-white p-4 rounded-3xl border-4 border-yellow-400 shadow-[0_-8px_20px_rgba(0,0,0,0.5)] flex items-center gap-4 relative isolate overflow-hidden">
                   {/* Background rays */}
                   <div className="absolute inset-0 z-0 opacity-20 bg-[repeating-conic-gradient(#fff_0_15deg,#000_15deg_30deg)] animate-spin-slow" />
                   
                   <div className="w-14 h-14 bg-yellow-400 rounded-2xl border-2 border-white flex items-center justify-center shrink-0 relative z-10 shadow-[4px_4px_0_#fff]">
                       <Zap className="w-8 h-8 text-black fill-black" />
                   </div>
                   <div className="flex-1 relative z-10">
                       <h4 className="font-comic text-xl uppercase tracking-widest text-yellow-400 leading-none drop-shadow-[2px_2px_0_#000]">INSTALL APP!</h4>
                       <p className="text-[10px] font-bold tracking-widest uppercase mt-1">Faster access + notifications</p>
                   </div>
                   <div className="flex flex-col gap-2 relative z-10 shrink-0">
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
