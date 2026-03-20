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

  useEffect(() => {
    setIsAdmin(localStorage.getItem('adminSession') === 'active');
  }, [pathname]);

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
    <div className="flex flex-col h-full bg-white p-8">
      
      {/* Brand & Mobile Close */}
      <div className="mb-12 px-2 flex items-center justify-between">
           <Link href={isAdmin ? "/dashboard" : "/profile"} className="flex items-center gap-4 group" onClick={onClose}>
                <div className="bg-indigo-600 p-3 rounded-2xl shadow-xl shadow-indigo-600/30 group-hover:scale-110 transition-all duration-500 group-hover:rotate-12">
                    <Zap className="w-6 h-6 text-white fill-white" />
                </div>
                <div className="flex flex-col">
                    <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-br from-indigo-600 to-indigo-950 tracking-tighter leading-none italic">
                        HackVeda.
                    </span>
                    <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest leading-none mt-2 opacity-80 italic">Innovation Cycle 2026</span>
                </div>
           </Link>
           
           {onClose && (
               <button onClick={onClose} className="lg:hidden p-3 text-indigo-600 bg-indigo-50 rounded-[1.2rem] hover:rotate-90 transition-transform duration-500 active:scale-95">
                   <X className="w-5 h-5" />
               </button>
           )}
      </div>

      {/* Main Nav */}
      <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2 mb-8">
           <p className="px-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-10 italic">Core Systems</p>
           
           {!isAdmin ? (
               NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link 
                            key={item.href} 
                            href={item.href}
                            onClick={onClose}
                            className={`group flex items-center gap-5 px-6 py-5 rounded-[2rem] transition-all duration-500 relative border-2 ${
                                isActive 
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xl shadow-indigo-600/20 active:scale-95' 
                                : 'text-gray-400 border-transparent hover:border-indigo-100 hover:bg-indigo-50 hover:text-indigo-600'
                            }`}
                        >
                            <item.icon className={`w-6 h-6 transition-all duration-700 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-12'}`} />
                            <span className="font-black tracking-tighter text-[11px] uppercase italic">{item.label}</span>
                            {isActive && (
                                <motion.div 
                                    layoutId="sidebar-active"
                                    className="absolute right-6 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_15px_white]"
                                />
                            )}
                        </Link>
                    );
               })
           ) : (
                <>
                    {[
                        { label: "Overview", icon: LayoutDashboard, href: "/admin/dashboard" },
                        { label: "Submissions", icon: FileCheck, href: "/admin/submissions" },
                        { label: "Announcements", icon: Bell, href: "/admin/announcements", badge: true },
                    ].map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link 
                                key={item.href} 
                                href={item.href}
                                onClick={onClose}
                                className={`group flex items-center gap-5 px-6 py-5 rounded-[2rem] transition-all duration-500 relative border-2 ${
                                    isActive 
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xl shadow-indigo-600/20' 
                                    : 'text-gray-400 border-transparent hover:border-indigo-100 hover:bg-indigo-50 hover:text-indigo-600'
                                }`}
                            >
                                <item.icon className={`w-6 h-6 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                                <span className="font-black text-[11px] uppercase tracking-tighter italic">{item.label}</span>
                                {item.badge && (
                                    <div className="absolute right-6 flex items-center justify-center">
                                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)] animate-pulse" />
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </>
           )}

           <div className="pt-16 border-t border-gray-50 mt-16">
               <div className="flex items-center justify-between px-6 mb-10 italic">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Administrative</p>
               </div>
               <Link 
                    href={isAdmin ? "/dashboard" : "/admin/login"}
                    onClick={onClose}
                    className={`group flex items-center gap-5 px-6 py-5 rounded-[2rem] transition-all duration-500 ${isAdmin ? 'text-indigo-600 bg-indigo-50 border-2 border-indigo-100' : 'text-gray-400 border-2 border-transparent hover:border-indigo-100 hover:bg-indigo-50 hover:text-indigo-600'}`}
                >
                    <div className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-500 ${isAdmin ? 'bg-indigo-600 text-white' : 'bg-gray-100 group-hover:bg-indigo-600 group-hover:text-white'}`}>
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    <span className="font-black tracking-widest text-[10px] uppercase italic">{isAdmin ? "Secure Terminal" : "Admin Portal"}</span>
                </Link>
           </div>
      </div>

      {/* User Footer */}
      <div className="pt-10 border-t border-gray-50 mt-auto">
           <div className="bg-gray-50 p-6 rounded-[3rem] flex items-center justify-between group overflow-hidden border-4 border-transparent hover:border-indigo-50 transition-all shadow-sm">
                <div className="flex items-center gap-4 truncate relative z-10">
                    <div className="w-14 h-14 rounded-3xl bg-indigo-600 border-4 border-white flex items-center justify-center text-white shadow-xl relative overflow-hidden group-hover:rotate-12 transition-all shrink-0">
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-7 h-7" />
                        )}
                        {isAdmin && <ShieldCheck className="absolute w-full h-full bg-indigo-900/80 p-4 opacity-0 group-hover:opacity-100 transition-opacity" />}
                    </div>
                    <div className="flex flex-col truncate">
                        <span className="text-[12px] font-black text-gray-950 truncate uppercase tracking-tighter italic leading-none mb-2">{isAdmin ? "HACKVEDA ADMIN" : (user?.displayName?.split(" ")[0] || "STUDENT")}</span>
                        <div className="flex items-center gap-2">
                             <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_green]" />
                             <span className="text-[10px] font-black text-gray-400 truncate uppercase tracking-widest leading-none">Connection Active</span>
                        </div>
                    </div>
                </div>
                
                <button 
                  onClick={handleSignOut}
                  className="p-4 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all relative z-10 active:scale-90"
                  title="Secure Logout"
                >
                    <LogOut className="w-5 h-5" />
                </button>
           </div>
      </div>
    </div>
  );
};
