"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/lib/auth";
import { LayoutDashboard, LogOut, User, Trophy, Calendar, FileCheck, Info, MessageSquare, Zap, ArrowRight } from "lucide-react";

export const Navbar = () => {
  const { user, loading } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 md:h-20 bg-white border-b-4 border-black z-[100] transition-all duration-500 font-sans shadow-[0px_4px_0px_#000]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex items-center justify-between">
          
          <div className="flex items-center gap-6 md:gap-12">
            <Link href="/" className="flex items-center gap-2 md:gap-4 group transition-all transform hover:scale-105 active:scale-95">
              <div className="bg-yellow-400 p-2 md:p-2.5 rounded-xl border-2 border-black shadow-[2px_2px_0_#000] group-hover:rotate-12 transition-transform duration-500">
                <Zap className="w-4 h-4 md:w-5 md:h-5 text-black fill-black" />
              </div>
              <span className="text-2xl md:text-3xl font-comic text-black tracking-widest drop-shadow-[2px_2px_0_#00f0ff] uppercase">
                Hack-o-Veda
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
                 {[
                     { label: 'Timeline', href: '/schedule' },
                     { label: 'Protocols', href: '/rules' },
                     { label: 'Rewards', href: '/prizes' }
                 ].map((link, i) => (
                    <Link 
                        key={i} 
                        href={link.href} 
                        className="text-xs font-bold uppercase tracking-widest text-black hover:text-pink-500 hover:-translate-y-1 transition-all"
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
                  className="bg-cyan-400 text-black px-4 md:px-6 py-2 border-2 border-black rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-yellow-400 hover:-translate-y-1 transition-all shadow-[4px_4px_0_#000] active:shadow-[0_0_0_#000] active:translate-y-1"
                >
                  <span className="hidden sm:inline">TERMINAL</span>
                  <span className="sm:hidden">TERM</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="p-2 md:p-2.5 bg-pink-400 border-2 border-black text-black hover:bg-black hover:text-white rounded-xl shadow-[3px_3px_0_#000] transition-all active:shadow-[0_0_0_#000] active:translate-y-0.5"
                  title="Disconnect Session"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              !loading && (
                <Link
                  href="/login"
                  className="bg-purple-400 text-black border-2 border-black px-4 md:px-6 py-2 rounded-xl hover:bg-pink-400 hover:-translate-y-1 transition-all shadow-[4px_4px_0_#000] active:shadow-[0_0_0_#000] active:translate-y-1 font-bold text-[10px] md:text-xs uppercase tracking-widest flex items-center gap-2 group"
                >
                  LOGIN <ArrowRight className="w-3 h-3 group-hover:translate-x-1.5 transition-transform" />
                </Link>
              )
            )}
            
            {loading && (
                <div className="w-24 h-8 md:w-32 md:h-10 bg-gray-200 border-2 border-black rounded-xl" />
            )}
          </div>

      </div>
    </nav>
  );
};
