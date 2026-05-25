"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { 
  Users, 
  MapPin, 
  Calendar, 
  Clock, 
  Award, 
  DollarSign, 
  Sparkles, 
  ArrowLeft,
  Mail,
  Phone,
  ShieldCheck,
  User,
  Zap
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Countdown } from "@/components/Countdown";

const FACULTY_COORDINATORS = [
  { name: "Mr. Sadanand", dept: "Head of Department of Computer Science" },
  { name: "Mr. Rajesh Nayak", dept: "Head of Department of Machine Learning" },
  { name: "Mr. Raghvendra G.S", dept: "Associate Professor (Sr) , Computer Science" },
  { name: "Ms. Srivathsa", dept: "To Be Confirmed" }
];

const STUDENT_ORGANIZERS = [
  { name: "Abhishek Kini", role: "Club Head, CodeTroopers" },
  { name: "Tejas Nayak", role: "Workbench Head, CodeTroopers" },
  { name: "Pradumna", role: "President, IGNITE" },
  { name: "Yashvanth", role: "President, AIKYA" },
  { name: "Bhudhan Poojari", role: "Organizing Committee Member" }
];

export default function AboutPage() {
  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 md:py-4 min-h-screen pb-16 relative font-sans overflow-hidden">
        
        {/* Background Decorative Elements */}
        <div className="absolute top-20 right-20 opacity-5 animate-pulse pointer-events-none">
          <Zap className="w-96 h-96 text-black rotate-45" />
        </div>
        <div className="absolute bottom-20 left-20 opacity-5 animate-bounce pointer-events-none">
          <Sparkles className="w-96 h-96 text-black -rotate-12" />
        </div>

        {/* Back Button */}
        <div className="mb-6 text-center relative z-10 w-full">
          <Link href="/profile" className="inline-flex items-center gap-3 bg-pink-400 text-black px-6 py-3 rounded-xl font-comic text-xl uppercase tracking-widest border-4 border-black hover:-translate-y-1 hover:shadow-[6px_6px_0_#000] shadow-[4px_4px_0_#000] transition-all active:translate-y-1 active:shadow-none mb-4">
            <ArrowLeft className="w-5 h-5 stroke-[3]" />
            BACK TO DASHBOARD
          </Link>
        </div>

        {/* Header Section */}
        <div className="text-center mb-6 md:mb-8 relative z-10">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 bg-cyan-400 text-black px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-widest mb-6 border-4 border-black shadow-[4px_4px_0_#000] rotate-2"
          >
            <Users className="w-5 h-5 text-black" />
            ABOUT THE EVENT
          </motion.div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-comic text-black leading-none tracking-widest uppercase mb-4 drop-shadow-[4px_4px_0_#ff007f]">
            MEET THE <br />
            <span className="text-white drop-shadow-[4px_4px_0_#000]">CREW!</span>
          </h1>
          <p className="bg-white p-3 inline-block border-4 border-black rounded-xl text-sm font-bold text-gray-800 shadow-[4px_4px_0_#00f0ff] transform -rotate-1 mx-auto max-w-xl">
            An intra-college 24-hour Hackathon at Shri Madhwa Vadiraja Institute of Technology and Management.
          </p>
        </div>

        {/* Live Countdown Timer Section */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-6 md:mb-8 p-6 md:p-10 rounded-3xl bg-black shadow-[8px_8px_0_#00f0ff] max-w-4xl mx-auto text-center relative z-10"
        >
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }} />
          <h3 className="font-comic text-xl md:text-2xl text-yellow-400 uppercase tracking-widest mb-4">LAUNCH TIMELINE COUNTDOWN</h3>
          <Countdown targetDate="2026-07-31T10:00:00" label="HACK-O-VEDA STARTS IN" />
        </motion.div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
          
          {/* Left Column: Event details (8 cols on large screens) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* About Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white border-4 border-black p-6 md:p-8 rounded-[2.5rem] shadow-[8px_8px_0_#000] relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '16px 16px' }} />
              <h2 className="text-3xl font-comic text-black uppercase tracking-wider mb-6 border-b-4 border-black pb-3">The Hackathon</h2>
              
              <div className="space-y-6">
                <p className="text-sm md:text-base font-bold text-gray-800 leading-relaxed">
                  The <strong className="text-black">CodeTroopers Club</strong>, in collaboration with <strong className="text-black">IGNITE, AIKYA, IEEE, and ISTE</strong>, proposes to organize an intra-college 24-hour Hackathon at Shri Madhwa Vadiraja Institute of Technology and Management (SMVITM).
                </p>
                <p className="text-sm md:text-base font-bold text-gray-700 leading-relaxed">
                  This event aims to foster a culture of innovation, problem-solving, and collaborative technical development among students across all departments and years. The hackathon challenge will push participants to build functional prototypes addressing real-world problems within a continuous 24-hour coding window, assessed by expert judges.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t-2 border-dashed border-black">
                  <div className="flex items-center gap-3 bg-yellow-100 p-4 border-2 border-black rounded-2xl shadow-[3px_3px_0_#000]">
                    <MapPin className="w-8 h-8 text-black shrink-0" />
                    <div>
                      <p className="text-[10px] font-black text-gray-500 uppercase leading-none">VENUE</p>
                      <p className="text-sm font-black text-black leading-tight mt-1">MBA Block, 1st Floor Rooms, SMVITM Campus</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-cyan-100 p-4 border-2 border-black rounded-2xl shadow-[3px_3px_0_#000]">
                    <Calendar className="w-8 h-8 text-black shrink-0" />
                    <div>
                      <p className="text-[10px] font-black text-gray-500 uppercase leading-none">PROPOSED DATES</p>
                      <p className="text-sm font-black text-black leading-tight mt-1">31/07/26 - 01/08/26 OR 01/08/26 - 02/08/26</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-pink-100 p-4 border-2 border-black rounded-2xl shadow-[3px_3px_0_#000]">
                    <Clock className="w-8 h-8 text-black shrink-0" />
                    <div>
                      <p className="text-[10px] font-black text-gray-500 uppercase leading-none">DURATION</p>
                      <p className="text-sm font-black text-black leading-tight mt-1">24 Hours (Continuous Hacking)</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-purple-100 p-4 border-2 border-black rounded-2xl shadow-[3px_3px_0_#000]">
                    <DollarSign className="w-8 h-8 text-black shrink-0" />
                    <div>
                      <p className="text-[10px] font-black text-gray-500 uppercase leading-none">REGISTRATION FEE</p>
                      <p className="text-sm font-black text-black leading-tight mt-1">Rs. 200 Per Team</p>
                    </div>
                  </div>
                </div>

                <div className="bg-black/5 p-4 rounded-2xl border-2 border-dashed border-black/20 text-center mt-6">
                  <span className="font-comic text-xs uppercase tracking-widest text-black">ELIGIBILITY: </span>
                  <span className="text-xs font-black uppercase text-pink-600 tracking-wider">ALL BRANCHES & YEARS OF SMVITM</span>
                </div>
              </div>
            </motion.div>

            {/* Prizes Card inside About */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-yellow-400 border-4 border-black p-6 md:p-8 rounded-[2.5rem] shadow-[8px_8px_0_#000] relative overflow-hidden group hover:rotate-1 transition-transform"
            >
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '16px 16px' }} />
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-comic text-black uppercase tracking-wider">Prizes & Rewards</h2>
                <Award className="w-8 h-8 text-black fill-yellow-200" />
              </div>
              <p className="text-sm font-bold text-gray-800 mb-6 bg-white p-3 border-2 border-black rounded-xl">
                A massive cash prize pool awaits the winners of the hackathon! Details of distribution:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { title: "1st Place", amt: "Rs. 10,000", bg: "bg-white" },
                  { title: "2nd Place", amt: "Rs. 6,000", bg: "bg-white" },
                  { title: "3rd Place", amt: "Rs. 4,000", bg: "bg-white" },
                  { title: "Consolation", amt: "Rs. 2,000 x 5", bg: "bg-white" }
                ].map((p, pIdx) => (
                  <div key={pIdx} className={`${p.bg} p-3 border-2 border-black rounded-2xl text-center shadow-[3px_3px_0_#000]`}>
                    <p className="text-[9px] font-black text-gray-500 uppercase">{p.title}</p>
                    <p className="font-comic text-md text-black mt-1">{p.amt}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between border-t-2 border-black pt-4">
                <span className="font-comic text-xl text-black">TOTAL POOL: RS. 30,000</span>
                <Link href="/prizes" className="text-xs font-black uppercase bg-black text-white px-3 py-1.5 rounded-lg border-2 border-black hover:bg-white hover:text-black transition-colors shadow-[2px_2px_0_#000]">
                  VIEW DETAILS
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Coordinators (5 cols on large screens) */}
          <div className="lg:col-span-5 space-y-6\">
            
            {/* Faculty Coordinators Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-cyan-400 border-4 border-black p-6 md:p-8 rounded-[2.5rem] shadow-[8px_8px_0_#000] relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '16px 16px' }} />
              <h2 className="text-3xl font-comic text-black uppercase tracking-wider mb-6 border-b-4 border-black pb-3">Faculty Coordinators</h2>
              
              <div className="space-y-4">
                {FACULTY_COORDINATORS.map((coordinator, idx) => (
                  <div key={idx} className="bg-white p-4 border-2 border-black rounded-2xl shadow-[3px_3px_0_#000] flex items-start gap-4">
                    <div className="bg-pink-400 p-2.5 rounded-xl border-2 border-black shadow-[2px_2px_0_#000] text-black shrink-0">
                      <User className="w-5 h-5 stroke-[3]" />
                    </div>
                    <div>
                      <h4 className="font-comic text-lg text-black leading-none">{coordinator.name}</h4>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1 leading-tight">{coordinator.dept}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Student Organizers Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-pink-400 border-4 border-black p-6 md:p-8 rounded-[2.5rem] shadow-[8px_8px_0_#000] relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '16px 16px' }} />
              <h2 className="text-3xl font-comic text-black uppercase tracking-wider mb-6 border-b-4 border-black pb-3">Student Organizers</h2>
              
              <div className="space-y-4">
                {STUDENT_ORGANIZERS.map((organizer, idx) => (
                  <div key={idx} className="bg-white p-4 border-2 border-black rounded-2xl shadow-[3px_3px_0_#000] flex items-start gap-4">
                    <div className="bg-yellow-300 p-2.5 rounded-xl border-2 border-black shadow-[2px_2px_0_#000] text-black shrink-0">
                      <User className="w-5 h-5 stroke-[3]" />
                    </div>
                    <div>
                      <h4 className="font-comic text-lg text-black leading-none">{organizer.name}</h4>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1 leading-tight">{organizer.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>

        </div>

        {/* Footer Link */}
        <div className="mt-8 text-center relative z-10">
          <Link href="/profile" className="inline-flex h-16 items-center justify-center gap-3 bg-cyan-400 text-black px-10 rounded-2xl border-4 border-black shadow-[8px_8px_0_#000] hover:-translate-y-1 hover:shadow-[12px_12px_0_#000] active:translate-y-2 active:shadow-none transition-all group">
            <ArrowLeft className="w-6 h-6 stroke-[3] group-hover:-translate-x-2 transition-transform" />
            <span className="text-xl font-comic tracking-widest uppercase">BACK TO DASHBOARD</span>
          </Link>
        </div>

      </div>
    </ProtectedRoute>
  );
}
