"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Mail, MessageSquare, MapPin, ExternalLink, ArrowLeft, Phone, UserRound } from "lucide-react";
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
      <div className="max-w-5xl mx-auto px-4 py-12 md:py-20 animate-fade-in pb-40">
        <Link href="/profile" className="inline-flex items-center gap-2 text-primary-600 font-bold mb-8 hover:opacity-70 transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        
        <div className="mb-16">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-4 tracking-tight">
                Get <span className="text-primary-600 font-black">Help.</span>
            </h1>
            <p className="text-lg text-gray-500 font-medium max-w-2xl">
                Need clarification or technical assistance? Our team is here to support you 24/7 during the event.
            </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-12">
                 <div>
                     <h2 className="text-2xl font-black text-gray-900 mb-8 border-l-4 border-primary-600 pl-4 uppercase tracking-[0.2em] text-xs">Organizing Committee</h2>
                     <div className="space-y-4">
                        {organizers.map((org, i) => (
                             <div key={i} className="card p-6 border-gray-100 hover:border-primary-100 transition-all shadow-xl shadow-gray-500/5 group">
                                 <div className="flex items-center gap-4 mb-4">
                                     <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                                         <UserRound className="w-5 h-5 text-primary-600 group-hover:text-white" />
                                     </div>
                                     <div>
                                         <h3 className="font-bold text-gray-900 leading-none mb-1">{org.name}</h3>
                                         <p className="text-xs font-bold text-gray-400 uppercase tracking-widest italic">{org.role}</p>
                                     </div>
                                 </div>
                                 <div className="grid grid-cols-2 gap-3 mt-4">
                                     <a href={`mailto:${org.email}`} className="flex items-center gap-2 bg-gray-50 text-gray-700 px-4 py-2.5 rounded-xl hover:bg-primary-50 hover:text-primary-600 transition-all text-xs font-bold border border-gray-100">
                                         <Mail className="w-3.5 h-3.5" />
                                         Email
                                     </a>
                                     <a href={`tel:${org.phone}`} className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-all text-xs font-bold border border-gray-200">
                                         <Phone className="w-3.5 h-3.5 opacity-40" />
                                         Call
                                     </a>
                                 </div>
                             </div>
                        ))}
                     </div>
                 </div>

                 <div className="card bg-gray-900 text-white border-0 shadow-2xl p-8 overflow-hidden relative group">
                     <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                         <MapPin className="w-5 h-5 text-primary-400" />
                         Event Venue
                     </h3>
                     <p className="text-gray-400 font-medium mb-8">
                         SODE Main Campus auditorium & Labs. <br />
                         Reporting starts at 9:00 AM on April 10.
                     </p>
                     
                     <div className="h-40 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors cursor-pointer relative overflow-hidden">
                         <MapPin className="w-12 h-12 text-white/10 group-hover:scale-150 transition-transform duration-700" />
                         <span className="absolute inset-0 flex items-center justify-center font-black text-xs uppercase tracking-widest opacity-40">View Google Map</span>
                     </div>
                 </div>
            </div>

            <div className="space-y-12">
                <h2 className="text-2xl font-black text-gray-900 mb-8 border-l-4 border-amber-500 pl-4 uppercase tracking-[0.2em] text-xs">Common Questions</h2>
                <div className="space-y-6">
                    {faqs.map((faq, i) => (
                        <div key={i} className="card p-8 border-gray-100 bg-gray-50/30 hover:bg-white transition-all shadow-xl shadow-gray-500/5 group">
                             <div className="flex items-start gap-4 mb-4">
                                 <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                                     <MessageSquare className="w-4 h-4 text-amber-600" />
                                 </div>
                                 <h3 className="font-bold text-gray-900 leading-snug">{faq.q}</h3>
                             </div>
                             <p className="text-sm font-medium text-gray-500 leading-relaxed pl-12">
                                 {faq.a}
                             </p>
                        </div>
                    ))}
                </div>
                
                <div className="card bg-blue-50 border-blue-100 p-8">
                     <div className="flex items-center gap-4 mb-4">
                         <div className="bg-blue-100 p-3 rounded-2xl">
                             <ExternalLink className="w-5 h-5 text-blue-600" />
                         </div>
                         <h3 className="text-xl font-bold text-blue-900">Resource Hub</h3>
                     </div>
                     <p className="text-blue-800 text-sm font-medium mb-6">Access official hackathon kits, design assets, and previous years' winning projects.</p>
                     <button className="w-full btn-primary bg-blue-600 text-white border-0 h-14 rounded-2xl shadow-xl shadow-blue-500/20 active:scale-[0.98]">
                         Open Resource Drive
                     </button>
                </div>
            </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
