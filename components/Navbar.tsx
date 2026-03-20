"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/lib/auth";
import { LayoutDashboard, LogOut, User, Trophy, Calendar, FileCheck, Info, MessageSquare, Zap, ArrowRight } from "lucide-react";

export const Navbar = () => {
  const { user, loading } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 md:h-20 bg-white/80 backdrop-blur-xl border-b border-gray-100 z-[100] transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex items-center justify-between">
          
          <div className="flex items-center gap-6 md:gap-12">
            <Link href="/" className="flex items-center gap-2 md:gap-4 group transition-all transform hover:scale-105 active:scale-95">
              <div className="bg-indigo-600 p-2 md:p-2.5 rounded-xl shadow-lg shadow-indigo-600/30 group-hover:rotate-12 transition-transform duration-500">
                <Zap className="w-4 h-4 md:w-5 md:h-5 text-white fill-white" />
              </div>
              <span className="text-xl md:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-950 tracking-tight italic">
                HackVeda.
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
                 {[
                     { label: 'Timeline', href: '/schedule' },
                     { label: 'Protocols', href: '/rules' },
                     { label: 'Rewards', href: '/prizes' },
                     { label: 'Contact', href: '/contact' }
                 ].map((link, i) => (
                    <Link 
                        key={i} 
                        href={link.href} 
                        className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-indigo-600 hover:translate-x-1 transition-all italic"
                    >
                        {link.label}
                    </Link>
                 ))}
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            {!loading && user ? (
              <div className="flex items-center gap-3 md:gap-6">
                <Link 
                  href="/profile" 
                  className="bg-indigo-50 text-indigo-600 px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-md active:scale-[0.98] italic"
                >
                  <span className="hidden sm:inline">Terminal Access</span>
                  <span className="sm:hidden">Terminal</span>
                </Link>
                <div className="hidden sm:block h-6 w-[1px] bg-gray-200" />
                <button
                  onClick={() => signOut()}
                  className="p-2 md:p-2.5 bg-white border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 rounded-xl transition-all active:scale-[0.98]"
                  title="Disconnect Session"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              !loading && (
                <Link
                  href="/login"
                  className="bg-indigo-600 text-white px-4 md:px-6 py-2 md:py-2.5 rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 group italic active:scale-[0.98]"
                >
                  Login <ArrowRight className="w-3 h-3 group-hover:translate-x-1.5 transition-transform" />
                </Link>
              )
            )}
            
            {loading && (
                <div className="w-24 h-8 md:w-32 md:h-10 bg-gray-100 animate-pulse rounded-xl" />
            )}
          </div>

      </div>
    </nav>
  );
};
