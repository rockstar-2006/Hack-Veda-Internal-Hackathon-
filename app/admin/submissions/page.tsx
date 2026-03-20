"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, orderBy } from "firebase/firestore";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { FileCheck, ExternalLink, Download, Search, LayoutDashboard, ArrowLeft, RefreshCcw, MoreHorizontal, FileText, Users, Calendar } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminSubmissions() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchSubmissions = async () => {
    setLoading(true);
    setRefreshing(true);
    try {
      const q = query(collection(db, "submissions"), orderBy("submittedAt", "desc"));
      const snapshot = await getDocs(q);
      setSubmissions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const filtered = submissions.filter(s => 
    s.teamId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 animate-fade-in group">
        
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="inline-flex items-center gap-3 bg-primary-50 text-primary-700 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] mb-10 italic border border-primary-100"
          >
               <FileCheck className="w-4 h-4 fill-primary-600" />
               Submission Logs
          </motion.div>
        
        <section className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex-1 space-y-10 mt-12">
                 <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight tracking-tighter italic">
                    Team <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-950">
                        Submissions.
                    </span>
                 </h1>
                 <p className="text-lg text-gray-400 font-bold max-w-2xl italic leading-relaxed">
                    Review candidate projects, check submission files, and prepare for the final evaluation.
                 </p>
            </div>
            
            <div className="flex items-center gap-3">
                 <button 
                   onClick={fetchSubmissions}
                   disabled={refreshing}
                   className={`btn-secondary h-12 flex items-center justify-center gap-2 border-gray-100 ${refreshing ? 'animate-pulse' : ''}`}
                 >
                     <RefreshCcw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                     Refresh
                 </button>
            </div>
        </section>

        {/* Search Bar */}
        <div className="flex items-center gap-4 mb-8 bg-gray-50 p-6 rounded-3xl border border-gray-100">
             <div className="relative flex-1 group">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                 <input 
                    type="text" 
                    placeholder="Search by Team ID..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-gray-100 focus:outline-none focus:ring-4 focus:ring-primary-50 transition-all text-sm font-semibold tracking-tight shadow-sm shadow-gray-200/50"
                 />
             </div>
        </div>

        {/* Submissions Table */}
        <div className="card overflow-hidden p-0 border-gray-100 shadow-2xl shadow-primary-900/5">
             <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                     <thead>
                         <tr className="bg-gray-50/50 text-xs font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100/50">
                             <th className="px-8 py-6">Submission Details</th>
                             <th className="px-8 py-6">Team Reference</th>
                             <th className="px-8 py-6">Submitted At</th>
                             <th className="px-8 py-6 text-right">Actions</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100/30">
                         {loading ? (
                             [...Array(5)].map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan={4} className="px-8 py-10">
                                        <div className="h-4 bg-gray-100 rounded w-1/2" />
                                    </td>
                                </tr>
                             ))
                         ) : filtered.length > 0 ? (
                             filtered.map((sub) => (
                                <tr key={sub.id} className="group hover:bg-primary-50/10 transition-colors">
                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                                                <FileText className="w-6 h-6 text-gray-400 group-hover:text-primary-600 transition-colors" />
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900 leading-none mb-1">Proposal.pdf</p>
                                                <p className="text-xs font-mono font-bold text-primary-600 uppercase tracking-widest">{sub.id.substring(0,8)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-gray-300" />
                                            <p className="text-sm font-bold text-gray-700">{sub.teamId}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-300" />
                                            <p className="text-sm font-bold text-gray-700">
                                                {sub.submittedAt?.seconds ? format(new Date(sub.submittedAt.seconds * 1000), "MMM d, hh:mm a") : "Realtime"}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <a 
                                                href={sub.fileUrl} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="btn-primary h-10 px-5 flex items-center gap-2 text-xs font-black tracking-widest uppercase transition-all"
                                            >
                                                <ExternalLink className="w-3.5 h-3.5" />
                                                View PDF
                                            </a>
                                            <button className="p-2.5 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all">
                                                <Download className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                             ))
                         ) : (
                             <tr>
                                 <td colSpan={4} className="px-8 py-20 text-center">
                                     <div className="max-w-xs mx-auto text-gray-400 font-bold italic">
                                         No submissions found.
                                     </div>
                                 </td>
                             </tr>
                         )}
                     </tbody>
                 </table>
             </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
