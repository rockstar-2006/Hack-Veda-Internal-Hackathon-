"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, orderBy, limit } from "firebase/firestore";
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
  const isMountedRef = useRef(true);

  const fetchSubmissions = async () => {
    if (!isMountedRef.current) return;
    
    setLoading(true);
    setRefreshing(true);
    try {
      // Add limit to prevent loading too many documents
      const q = query(collection(db, "submissions"), orderBy("submittedAt", "desc"), limit(100));
      const snapshot = await getDocs(q);
      
      if (isMountedRef.current) {
        setSubmissions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    } catch (err) {
      if (isMountedRef.current) {
        console.error(err);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    fetchSubmissions();
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const filtered = submissions.filter(s => 
    s.teamId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 min-h-screen">
        
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest mb-4 md:mb-6 border border-indigo-100"
          >
               <FileCheck className="w-3.5 h-3.5 fill-indigo-600" />
               Submission Logs
          </motion.div>
        
        <section className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
            <div className="flex-1 space-y-2 md:space-y-4">
                 <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 leading-tight tracking-tight italic">
                    Team Submissions.
                 </h1>
                 <p className="text-xs md:text-sm text-gray-500 font-medium max-w-2xl leading-relaxed">
                    Review candidate projects, check submission files, and prepare for the final evaluation.
                 </p>
            </div>
            
            <div className="flex items-center gap-2 md:gap-3">
                 <button 
                   onClick={fetchSubmissions}
                   disabled={refreshing}
                   className="h-10 px-4 rounded-xl bg-white border border-gray-200 text-gray-700 flex items-center justify-center w-full md:w-auto gap-2 font-bold text-xs md:text-sm hover:border-indigo-600 hover:text-indigo-600 transition-all active:scale-95 shadow-sm"
                 >
                     <RefreshCcw className={`w-3.5 h-3.5 md:w-4 md:h-4 ${refreshing ? 'animate-spin' : ''}`} />
                     Refresh
                 </button>
            </div>
        </section>

        {/* Search Bar */}
        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 mb-6 md:mb-8">
             <div className="relative flex-1 w-full group">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                 <input 
                    type="text" 
                    placeholder="Search by Team ID..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-10 md:h-12 pl-10 md:pl-12 pr-4 md:pr-6 rounded-xl bg-white border border-gray-200 focus:border-indigo-600 outline-none font-medium text-xs md:text-sm transition-all shadow-sm"
                 />
             </div>
        </div>

        {/* Submissions Table */}
        <div className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden mb-8 md:mb-12">
             <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse min-w-[600px]">
                     <thead>
                         <tr className="bg-gray-50 text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-200">
                             <th className="px-4 md:px-6 py-3 md:py-4">Submission Details</th>
                             <th className="px-4 md:px-6 py-3 md:py-4">Team Reference</th>
                             <th className="px-4 md:px-6 py-3 md:py-4">Submitted At</th>
                             <th className="px-4 md:px-6 py-3 md:py-4 text-right">Actions</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100">
                         {loading ? (
                             [...Array(5)].map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan={4} className="px-4 md:px-6 py-4 md:py-6">
                                        <div className="h-4 bg-gray-100 rounded w-1/3" />
                                    </td>
                                </tr>
                             ))
                         ) : filtered.length > 0 ? (
                             filtered.map((sub) => (
                                <tr key={sub.id} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-4 md:px-6 py-3 md:py-4">
                                        <div className="flex items-center gap-3 md:gap-4">
                                            <div className="bg-white p-2 md:p-2.5 rounded-lg md:rounded-xl border border-gray-200 shadow-sm shrink-0">
                                                <FileText className="w-4 h-4 md:w-5 md:h-5 text-indigo-600 group-hover:scale-110 transition-transform" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 text-xs md:text-sm tracking-tight mb-0.5">Proposal.pdf</p>
                                                <p className="text-[9px] md:text-[10px] font-mono font-medium text-gray-500 uppercase">{sub.id.substring(0,8)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 md:px-6 py-3 md:py-4">
                                        <div className="flex items-center gap-1.5 md:gap-2 text-gray-600">
                                            <Users className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400 shrink-0" />
                                            <p className="text-xs md:text-sm font-medium truncate max-w-[120px] md:max-w-xs">{sub.teamId}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 md:px-6 py-3 md:py-4">
                                        <div className="flex items-center gap-1.5 md:gap-2 text-gray-600">
                                            <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400 shrink-0" />
                                            <p className="text-xs md:text-sm font-medium">
                                                {sub.submittedAt?.seconds ? format(new Date(sub.submittedAt.seconds * 1000), "MMM d, hh:mm a") : "Realtime"}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-4 md:px-6 py-3 md:py-4 text-right">
                                        <div className="flex items-center justify-end gap-1.5 md:gap-2">
                                            <a 
                                                href={sub.fileUrl} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="h-8 md:h-9 px-3 md:px-4 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center gap-1.5 md:gap-2 hover:bg-indigo-600 hover:text-white transition-colors text-[10px] md:text-xs font-bold shadow-sm"
                                            >
                                                <ExternalLink className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                                View PDF
                                            </a>
                                            <button className="h-8 w-8 md:h-9 md:w-9 flex items-center justify-center rounded-lg border border-transparent text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                                                <Download className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                             ))
                         ) : (
                             <tr>
                                 <td colSpan={4} className="px-4 md:px-6 py-8 md:py-12 text-center text-xs md:text-sm font-medium text-gray-500">
                                     No submissions found.
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
