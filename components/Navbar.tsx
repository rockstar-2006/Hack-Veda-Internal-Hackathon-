"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/lib/auth";
import { LayoutDashboard, LogOut, User, Trophy, Calendar, FileCheck, Info, MessageSquare, Zap, ArrowRight } from "lucide-react";

export const Navbar = () => {
  const { user, loading } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 h-24 bg-white/80 backdrop-blur-xl border-b border-gray-100 z-[100] transition-all duration-500">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center gap-4 group transition-all transform hover:scale-105 active:scale-95">
              <div className="bg-indigo-600 p-3 rounded-2xl shadow-2xl shadow-indigo-600/30 group-hover:rotate-12 transition-transform duration-500">
                <Zap className="w-6 h-6 text-white fill-white" />
              </div>
              <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-950 tracking-tighter italic">
                HackVeda.
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-10">
                 {[
                     { label: 'Timeline', href: '/schedule' },
                     { label: 'Protocols', href: '/rules' },
                     { label: 'Rewards', href: '/prizes' },
                     { label: 'Contact', href: '/contact' }
                 ].map((link, i) => (
                    <Link 
                        key={i} 
                        href={link.href} 
                        className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 hover:text-indigo-600 hover:translate-x-1 transition-all italic"
                    >
                        {link.label}
                    </Link>
                 ))}
            </div>
          </div>

          <div className="flex items-center gap-6">
            {!loading && user ? (
              <div className="flex items-center gap-6">
                <Link 
                  href="/profile" 
                  className="bg-indigo-50 text-indigo-600 px-8 py-4 rounded-[1.2rem] font-black uppercase text-[10px] tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-xl shadow-indigo-600/5 active:scale-95 italic"
                >
                  Terminal Access
                </Link>
                <div className="h-10 w-[1px] bg-gray-100" />
                <button
                  onClick={() => signOut()}
                  className="p-4 bg-white border-2 border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-100 rounded-[1.2rem] transition-all active:scale-95"
                  title="Disconnect Session"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              !loading && (
                <Link
                  href="/login"
                  className="bg-indigo-600 text-white px-10 py-4 rounded-[1.2rem] hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-600/30 font-black text-xs uppercase tracking-[0.2em] flex items-center gap-4 group italic active:scale-95"
                >
                  Authorize Login <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </Link>
              )
            )}
            
            {loading && (
                <div className="w-40 h-14 bg-gray-50 animate-pulse rounded-[1.2rem] border border-gray-100" />
            )}
          </div>

      </div>
    </nav>
  );
};
