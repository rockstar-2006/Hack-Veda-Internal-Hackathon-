"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Mail, MessageSquare, MapPin, ExternalLink, ArrowLeft, Phone, UserRound, Zap } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const organizers = [
  { name: "Prof. S. Sharma", role: "Event Coordinator", email: "ssh@sode-edu.in", phone: "+91 99XXXXXXX1" },
  { name: "John Doe", role: "Student Lead", email: "johndoe@sode-edu.in", phone: "+91 88XXXXXXX2" },
  { name: "Jane Doe", role: "Tech Support", email: "janedoe@sode-edu.in", phone: "+91 77XXXXXXX3" },
];

const faqs = [
  { q: "Whom do I contact for website bugs?", a: "Email the Tech Support leads or open an issue on the portal's GitHub if available." },
  { q: "Can I change my team members?", a: "Only before the registration deadline. Contact Prof. S. Sharma for manual changes." },
  { q: "Where's the physical venue?", a: "SODE Campus, Main Auditorium & Computer Lab 3." },
];

export default function ContactPage() {
  return (
    <ProtectedRoute>
      <div className="max-w-5xl mx-auto px-4 py-12 md:py-24 relative min-h-screen pb-40 font-sans">
        <Link href="/profile" className="inline-flex items-center gap-2 bg-white text-black px-4 py-2 border-4 border-black rounded-xl font-comic text-lg uppercase tracking-widest shadow-[4px_4px_0_#000] hover:-translate-y-1 transition-all mb-12">
            <ArrowLeft className="w-5 h-5 stroke-[3]" /> BACK TO TERMINAL
        </Link>
        
        <div className="mb-20 text-center md:text-left relative">
            <motion.div 
               initial={{ x: -20, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               className="inline-flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-xl border-4 border-black shadow-[4px_4px_0_#000] mb-6 transform rotate-2 font-comic text-xl uppercase tracking-widest"
            >
                <Zap className="w-6 h-6 fill-black" /> MISSION SUPPORT
            </motion.div>
            <h1 className="text-6xl md:text-8xl font-comic text-black leading-none uppercase mb-6 drop-shadow-[4px_4px_0_#ff007f]">
                NEED <br />
                <span className="text-white drop-shadow-[4px_4px_0_#000]">ASSISTANCE?</span>
            </h1>
            <p className="text-xl text-black font-bold max-w-2xl bg-white p-4 border-4 border-black shadow-[6px_6px_0_#00f0ff] rounded-xl transform -rotate-1">
                Synchronize with the HackVeda High Command. Our units are standing by to ensure your mission's success!
            </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
            <div className="space-y-16">
                 <div>
                     <h2 className="text-3xl font-comic text-black mb-10 uppercase tracking-widest bg-cyan-400 inline-block px-4 py-2 border-4 border-black shadow-[6px_6px_0_#000] transform -rotate-2">
                        THE COMMANDERS
                     </h2>
                     <div className="space-y-8">
                        {organizers.map((org, i) => (
                             <motion.div 
                                key={i} 
                                whileHover={{ scale: 1.02, rotate: i % 2 === 0 ? 1 : -1 }}
                                className="bg-white p-6 border-4 border-black shadow-[8px_8px_0_#000] relative overflow-hidden group rounded-3xl"
                             >
                                 <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '16px 16px' }} />
                                 <div className="flex items-center gap-6 mb-6 relative z-10">
                                     <div className="w-16 h-16 bg-pink-400 border-4 border-black rounded-2xl flex items-center justify-center shadow-[4px_4px_0_#000] transform -rotate-6 group-hover:rotate-0 transition-transform">
                                         <UserRound className="w-8 h-8 text-black stroke-[3]" />
                                     </div>
                                     <div>
                                         <h3 className="font-comic text-2xl text-black uppercase tracking-widest leading-none mb-1">{org.name}</h3>
                                         <p className="text-xs font-bold text-gray-500 uppercase tracking-widest bg-gray-100 inline-block px-2 py-0.5 rounded border border-black">{org.role}</p>
                                     </div>
                                 </div>
                                 <div className="grid grid-cols-2 gap-4 relative z-10">
                                     <a href={`mailto:${org.email}`} className="flex items-center justify-center gap-2 bg-cyan-400 text-black px-4 py-3 border-2 border-black rounded-xl font-bold uppercase text-[10px] tracking-widest shadow-[3px_3px_0_#000] hover:translate-y-0.5 hover:shadow-none transition-all">
                                         <Mail className="w-4 h-4" /> EMAIL
                                     </a>
                                     <a href={`tel:${org.phone}`} className="flex items-center justify-center gap-2 bg-yellow-400 text-black px-4 py-3 border-2 border-black rounded-xl font-bold uppercase text-[10px] tracking-widest shadow-[3px_3px_0_#000] hover:translate-y-0.5 hover:shadow-none transition-all">
                                         <Phone className="w-4 h-4" /> CALL
                                     </a>
                                 </div>
                             </motion.div>
                        ))}
                     </div>
                 </div>

                 <div className="bg-black text-white border-4 border-black p-8 rounded-[2.5rem] shadow-[12px_12px_0_#00f0ff] relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-4 -translate-y-4">
                        <MapPin className="w-32 h-32 text-white stroke-[2]" />
                     </div>
                     <h3 className="text-3xl font-comic mb-4 flex items-center gap-4 uppercase tracking-widest relative z-10">
                         <MapPin className="w-8 h-8 text-pink-500 stroke-[3]" />
                         MISSION HQ
                     </h3>
                     <p className="text-gray-300 font-bold mb-8 relative z-10 uppercase tracking-widest text-sm">
                         SODE Main Campus auditorium & Labs. <br />
                         Reporting starts at 9:00 AM on April 10.
                     </p>
                     
                     <div className="h-48 bg-white/10 rounded-3xl border-4 border-white/20 flex flex-col items-center justify-center group-hover:bg-white/20 transition-all cursor-pointer relative overflow-hidden">
                         <div className="text-6xl font-comic text-white opacity-20 group-hover:scale-125 transition-transform duration-700">MAP</div>
                         <span className="absolute bottom-4 font-bold text-[10px] uppercase tracking-[0.3em] text-white">INTERACT TO REVEAL</span>
                     </div>
                 </div>
            </div>

            <div className="space-y-16">
                <div>
                    <h2 className="text-3xl font-comic text-black mb-10 uppercase tracking-widest bg-yellow-400 inline-block px-4 py-2 border-4 border-black shadow-[6px_6px_0_#000] transform rotate-1">
                        INTEL BRIEFING
                    </h2>
                    <div className="space-y-8">
                        {faqs.map((faq, i) => (
                            <motion.div 
                                key={i} 
                                whileHover={{ x: 10 }}
                                className="bg-white p-8 border-4 border-black shadow-[8px_8px_0_#00f0ff] rounded-3xl group transform"
                            >
                                 <div className="flex items-start gap-4 mb-4">
                                     <div className="w-10 h-10 bg-black text-yellow-400 rounded-full flex items-center justify-center shrink-0 border-2 border-black shadow-[2px_2px_0_#000]">
                                         <MessageSquare className="w-5 h-5 fill-yellow-400" />
                                     </div>
                                     <h3 className="font-comic text-2xl text-black uppercase tracking-widest leading-tight">{faq.q}</h3>
                                 </div>
                                 <p className="text-base font-bold text-gray-700 leading-relaxed pl-14">
                                     {faq.a}
                                 </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
                
                <div className="bg-indigo-400 border-4 border-black p-10 rounded-[2.5rem] shadow-[12px_12px_0_#000] relative overflow-hidden">
                     {/* Halftone BG */}
                     <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '16px 16px' }} />
                     
                     <div className="flex items-center gap-6 mb-8 relative z-10">
                         <div className="bg-white p-4 border-4 border-black rounded-2xl shadow-[4px_4px_0_#000] transform -rotate-12">
                             <ExternalLink className="w-8 h-8 text-black stroke-[3]" />
                         </div>
                         <h3 className="text-4xl font-comic text-white drop-shadow-[2px_2px_0_#000] uppercase tracking-widest">KIT ROOM</h3>
                     </div>
                     <p className="text-white font-bold text-base mb-8 relative z-10 uppercase tracking-widest drop-shadow-[1px_1px_0_#000]">Access official hackathon kits, design assets, and previous years' winning projects.</p>
                     <button className="w-full bg-yellow-400 text-black border-4 border-black h-16 rounded-2xl shadow-[6px_6px_0_#000] font-comic text-2xl uppercase tracking-widest hover:translate-y-1 hover:shadow-none transition-all relative z-10">
                         OPEN RESOURCE DRIVE!
                     </button>
                </div>
            </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
