"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { useAuth } from "@/hooks/useAuth";
import { Menu, X, Trophy, Loader2, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Toast, ToastType } from "./Toast";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { Bell } from "lucide-react";

export const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: ToastType } | null>(null);
  const [lastNotificationId, setLastNotificationId] = useState<string | null>(null);

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
                message: `📢 NEW UPDATE: ${data.title}`, 
                type: "info" 
            });
        }
        setLastNotificationId(id);
      }
    });

    return () => unsubscribe();
  }, [user, isAdmin, lastNotificationId]);

  const isAuthPage = pathname === "/login" || pathname === "/admin/login";
  const showSidebar = !loading && (user || isAdmin) && !isAuthPage;
  const showNavbar = !showSidebar && !isAuthPage;

  // Close sidebar on navigation (for mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden relative">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [1, 1.1, 1], opacity: 1 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="relative z-10 flex flex-col items-center"
          >
              <div className="bg-indigo-600 p-8 rounded-[3rem] shadow-2xl shadow-indigo-600/30 mb-12 relative overflow-hidden group">
                  <motion.div 
                    animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Zap className="w-16 h-16 text-white fill-white" />
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
              </div>
              
              <div className="text-center">
                  <h1 className="text-4xl font-black text-gray-900 tracking-tighter italic mb-4 uppercase">HackVeda.</h1>
                  <div className="flex items-center gap-3 justify-center mb-8">
                      <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '0s' }} />
                      <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] italic">Building Future Classics</p>
              </div>
          </motion.div>
          
          {/* Background Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-50 rounded-full blur-[140px] -z-0" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-white transition-all duration-700 ${showSidebar ? 'lg:pl-72' : ''}`}>
      
      {/* Desktop Sidebar */}
      {showSidebar && (
        <aside className="fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-gray-100 z-[100] hidden lg:block overflow-hidden shadow-sm">
           <Sidebar />
        </aside>
      )}

      {/* Mobile Top Bar */}
      {showSidebar && (
          <header className="lg:hidden fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 z-[90] px-6 flex items-center justify-between">
               <div className="flex items-center gap-4">
                    <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-xl shadow-indigo-500/20">
                         <Zap className="w-5 h-5 text-white fill-white" />
                    </div>
                    <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-950 tracking-tighter italic">
                         HackVeda.
                    </span>
               </div>
               <button 
                 onClick={() => setIsSidebarOpen(true)}
                 className="p-3 bg-indigo-50 text-indigo-600 rounded-[1.2rem] transition-all active:scale-95"
               >
                    <Menu className="w-6 h-6" />
               </button>
          </header>
      )}

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
          {isSidebarOpen && (
              <>
                <motion.div 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   onClick={() => setIsSidebarOpen(false)}
                   className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] lg:hidden"
                />
                <motion.aside 
                   initial={{ x: "-100%" }}
                   animate={{ x: 0 }}
                   exit={{ x: "-100%" }}
                   transition={{ type: "spring", damping: 25, stiffness: 200 }}
                   className="fixed top-0 left-0 bottom-0 w-[300px] bg-white z-[120] lg:hidden shadow-2xl"
                >
                   <Sidebar onClose={() => setIsSidebarOpen(false)} />
                </motion.aside>
              </>
          )}
      </AnimatePresence>

      {showNavbar && <Navbar />}

      <main className={`min-h-screen w-full relative ${showSidebar ? (pathname !== "/login" ? 'pt-20 lg:pt-0' : '') : ''}`}>
           {/* Global Background Glow */}
           <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-indigo-50/50 rounded-full blur-[160px] -z-[1] translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-40 select-none" />
           <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-blue-50/30 rounded-full blur-[140px] -z-[1] -translate-x-1/2 translate-y-1/2 pointer-events-none opacity-40 select-none" />
           
           <div className="w-full relative px-6 sm:px-10 lg:px-16 py-12 max-w-[90rem] mx-auto min-h-screen">
                {children}
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
