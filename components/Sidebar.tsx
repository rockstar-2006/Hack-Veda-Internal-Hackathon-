"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Trophy, 
  User, 
  Users, 
  FileCheck, 
  Calendar, 
  ShieldQuestion, 
  Award, 
  Settings, 
  LogOut,
  LayoutDashboard,
  Bell,
  Search,
  X,
  Zap,
  ShieldCheck
} from "lucide-react";
import { signOut as firebaseSignOut } from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/profile" },
  { label: "My Team", icon: Users, href: "/team" },
  { label: "Submission", icon: FileCheck, href: "/submission" },
  { label: "Schedule", icon: Calendar, href: "/schedule" },
  { label: "Rules", icon: ShieldQuestion, href: "/rules" },
  { label: "Prizes", icon: Award, href: "/prizes" },
];

export const Sidebar = ({ onClose, announcementCount = 1 }: { onClose?: () => void, announcementCount?: number }) => {
  const pathname = usePathname();
  const { user } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    setIsAdmin(typeof window !== 'undefined' && localStorage.getItem('adminSession') === 'active');
    
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    });
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') setInstallPrompt(null);
  };

  const isViewingAdmin = pathname.startsWith('/admin');

  const handleSignOut = () => {
    if (isAdmin) {
        localStorage.removeItem('adminSession');
        localStorage.removeItem('adminEmail');
        router.push("/admin/login");
    } else {
        firebaseSignOut();
    }
  };

  if (!user && !isAdmin) return null;
  return (
    <div className="flex flex-col h-full bg-white p-6 font-sans relative overflow-hidden">
      
      {/* Background decoration in Sidebar */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '16px 16px' }} />

      {/* Brand & Mobile Close */}
      <div className="mb-10 flex items-center justify-between relative z-10">
           <Link href={isViewingAdmin ? "/admin/dashboard" : "/profile"} className="flex gap-4 group items-center" onClick={onClose}>
                <div className="bg-yellow-400 p-3 rounded-xl border-4 border-black shadow-[4px_4px_0_#000] group-hover:-translate-y-1 transition-transform">
                    <Zap className="w-6 h-6 text-black fill-black" />
                </div>
                <div className="flex flex-col">
                    <span className="text-4xl font-comic text-black uppercase tracking-widest leading-none drop-shadow-[2px_2px_0_#00f0ff]">
                        HACKVEDA
                    </span>
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-widest leading-none mt-1">Innovation 2026</span>
                </div>
           </Link>
           
           {onClose && (
               <button onClick={onClose} className="lg:hidden p-2 text-black bg-pink-400 border-4 border-black shadow-[2px_2px_0_#000] rounded-xl active:translate-y-1 active:shadow-none transition-all">
                   <X className="w-5 h-5 stroke-[3]" />
               </button>
           )}
      </div>

      {/* Main Nav */}
      <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2 mb-4 relative z-10">
           <p className="px-2 text-xs font-bold text-black uppercase tracking-widest mb-6">{isViewingAdmin ? 'COMMAND CONSOLE' : 'CORE SYSTEMS'}</p>
           
           {(!isAdmin || !isViewingAdmin) ? (
               <>
                {NAV_ITEMS.map((item, idx) => {
                        const isActive = pathname === item.href;
                        // Assign a unique color based on index
                        const colors = ['bg-pink-400', 'bg-cyan-400', 'bg-yellow-400', 'bg-purple-400', 'bg-red-400', 'bg-green-400'];
                        const color = colors[idx % colors.length];

                        return (
                            <Link 
                                key={item.href} 
                                href={item.href}
                                onClick={onClose}
                                className={`group flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 relative border-4 border-black ${
                                    isActive 
                                    ? `${color} text-black shadow-[4px_4px_0_#000] -translate-y-1` 
                                    : 'bg-white text-black hover:-translate-y-1 hover:shadow-[4px_4px_0_#000] hover:bg-gray-50'
                                }`}
                            >
                                <item.icon className={`w-6 h-6 stroke-[2.5] ${isActive ? '' : 'group-hover:scale-110'}`} />
                                <span className="font-comic text-xl uppercase tracking-widest">{item.label}</span>
                                
                                {/* "CLICK!" hint on hover (Desktop only for cleanliness) */}
                                {!isActive && (
                                    <div className="absolute -right-2 -top-2 bg-cyan-400 text-black text-[10px] font-black px-2 py-0.5 rounded border-2 border-black rotate-12 opacity-0 group-hover:opacity-100 transition-all scale-0 group-hover:scale-100 hidden sm:block">
                                        GO!
                                    </div>
                                )}

                                {isActive && (
                                    <motion.div 
                                        layoutId="sidebar-active"
                                        className="absolute right-4 w-3 h-3 rounded-full bg-white border-2 border-black"
                                    />
                                )}
                            </Link>
                        );
                })}
                
                {/* PWA Install Button */}
                {installPrompt && (
                   <motion.button 
                     initial={{ scale: 0.8, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     onClick={handleInstall}
                     className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl bg-black text-white border-4 border-black shadow-[4px_4px_0_#00f0ff] -translate-y-1 font-comic text-xl uppercase tracking-widest mt-8 sticky bottom-0"
                   >
                       <Zap className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                       INSTALL APP
                   </motion.button>
                )}
               </>
           ) : (
                 <>
                    {[
                        { label: "Overview", icon: LayoutDashboard, href: "/admin/dashboard", color: "bg-pink-400" },
                        { label: "Submissions", icon: FileCheck, href: "/admin/submissions", color: "bg-cyan-400" },
                        { label: "Alerts", icon: Bell, href: "/admin/announcements", badge: true, color: "bg-yellow-400" },
                    ].map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link 
                                key={item.href} 
                                href={item.href}
                                onClick={onClose}
                                className={`group flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 relative border-4 border-black ${
                                    isActive 
                                    ? `${item.color} text-black shadow-[4px_4px_0_#000] -translate-y-1` 
                                    : 'bg-white text-black hover:-translate-y-1 hover:shadow-[4px_4px_0_#000] hover:bg-gray-50'
                                }`}
                            >
                                <item.icon className={`w-6 h-6 stroke-[2.5] ${isActive ? '' : 'group-hover:scale-110'}`} />
                                <span className="font-comic text-xl uppercase tracking-widest">{item.label}</span>
                                {item.badge && (
                                    <div className="absolute right-4 flex items-center justify-center">
                                        <span className="w-4 h-4 rounded-full bg-red-500 border-2 border-black animate-bounce" />
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                 </>
           )}
      </div>

      {/* User Footer */}
      <div className="pt-6 border-t-4 border-black mt-auto relative z-10">
           <div className="bg-white p-4 rounded-2xl flex items-center justify-between border-4 border-black shadow-[4px_4px_0_#000] transition-all">
                <div className="flex items-center gap-3 truncate">
                    <div className="w-12 h-12 rounded-xl bg-purple-400 border-4 border-black flex items-center justify-center text-black shrink-0 overflow-hidden">
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-6 h-6 stroke-[3]" />
                        )}
                    </div>
                    <div className="flex flex-col truncate">
                        <span className="text-sm font-comic text-black truncate uppercase tracking-widest leading-none mb-1">{isAdmin ? "HACKVEDA ADMIN" : (user?.displayName?.split(" ")[0] || "HERO")}</span>
                        <div className="flex items-center gap-2">
                             <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-black animate-pulse" />
                             <span className="text-[10px] font-bold text-gray-600 truncate uppercase tracking-widest leading-none">ONLINE</span>
                        </div>
                    </div>
                </div>
                
                <button 
                  onClick={handleSignOut}
                  className="p-3 bg-red-500 text-white border-4 border-black rounded-xl hover:-translate-y-1 hover:shadow-[4px_4px_0_#000] active:translate-y-0 active:shadow-none transition-all ml-2"
                  title="Secure Logout"
                >
                    <LogOut className="w-5 h-5 stroke-[3]" />
                </button>
           </div>
      </div>
    </div>
  );
};
