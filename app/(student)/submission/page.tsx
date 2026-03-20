"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getMyTeam, submitIdea } from "@/lib/db";
import { uploadPDF } from "@/lib/storage";
import { Team, Submission } from "@/types";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { 
  FileUp, 
  FileCheck, 
  AlertCircle, 
  Loader2, 
  ArrowLeft, 
  Trash2, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  Cloud,
  FileText,
  UploadCloud,
  Zap,
  Info,
  Users
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function SubmissionPage() {
  const { user } = useAuth();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0); 
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchTeam = async () => {
      if (user) {
        try {
          const teamData = await getMyTeam(user.uid);
          setTeam(teamData);
        } catch (err: any) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchTeam();
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.type !== "application/pdf") {
        setError("Invalid File Format: Only PDF documents are accepted for evaluation.");
        setFile(null);
        return;
      }
      if (selected.size > 10 * 1024 * 1024) { // 10MB limit
        setError("File Overflow: Maximum allowed file size is 10MB.");
        setFile(null);
        return;
      }
      setError("");
      setFile(selected);
    }
  };

  const handleSubmit = async () => {
    if (!file || !team) return;
    
    // Team Size Validation
    if (team.memberIds.length < 2 || team.memberIds.length > 4) {
        setError(`Team Composition Invalid: Your team must have between 2 and 4 members to submit. Currently you have ${team.memberIds.length}.`);
        return;
    }

    setUploading(true);
    setError("");
    setProgress(20);

    try {
      const url = await uploadPDF(file, team.id!);
      setProgress(70);
      await submitIdea(team.id!, url);
      setProgress(100);
      setSuccess(true);
      setFile(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Upload Failure: Check your connection or storage permissions.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return null;

  if (!team && !error) return (
    <ProtectedRoute>
       <div className="max-w-3xl mx-auto px-6 py-40 text-center min-h-screen">
            <motion.div 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               className="p-16 rounded-[4rem] bg-white border-4 border-indigo-50 shadow-2xl"
            >
                <div className="bg-amber-100 w-24 h-24 rounded-[3rem] flex items-center justify-center mx-auto mb-10 shadow-xl shadow-amber-500/10">
                    <AlertCircle className="w-12 h-12 text-amber-600" />
                </div>
                <h2 className="text-4xl font-black text-gray-900 mb-4 italic tracking-tighter uppercase">Team Required.</h2>
                <p className="text-gray-400 font-bold mb-12 max-w-sm mx-auto italic">You need to be part of a team to submit your idea.</p>
                <Link href="/profile" className="w-full md:w-auto inline-flex items-center justify-center gap-4 bg-gray-900 text-white px-12 h-20 rounded-3xl font-black uppercase text-sm tracking-widest hover:bg-black transition-all active:scale-95">
                    <ArrowLeft className="w-5 h-5" /> Back to Profile
                </Link>
            </motion.div>
       </div>
    </ProtectedRoute>
  );

  const isTeamSizeInvalid = !!(team && (team.memberIds.length < 2 || team.memberIds.length > 4));

  if (success) {
      return (
          <ProtectedRoute>
              <div className="max-w-3xl mx-auto px-6 py-40 text-center min-h-screen">
                   <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="p-16 rounded-[4rem] bg-white border-4 border-green-200 shadow-2xl relative overflow-hidden"
                   >
                       <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl -mr-10 -mt-10" />
                       <div className="w-32 h-32 bg-green-500 rounded-[3rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-green-500/30">
                           <ShieldCheck className="w-16 h-16 text-white" />
                       </div>
                       <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 tracking-tighter italic uppercase text-balance">Submission Received.</h2>
                       <p className="text-green-800 text-base md:text-lg font-bold mb-16 italic">Your idea has been successfully submitted to Hackveda.</p>
                       
                       <div className="flex flex-col sm:flex-row gap-6 justify-center">
                           <Link href="/profile" className="flex-1 max-w-[240px] h-20 bg-gray-900 text-white rounded-3xl flex items-center justify-center font-black uppercase text-sm tracking-widest hover:bg-black transition-all active:scale-95">
                               Dashboard
                           </Link>
                           <button onClick={() => setSuccess(false)} className="flex-1 max-w-[240px] h-20 bg-white border-4 border-green-100 text-green-700 rounded-3xl flex items-center justify-center font-black uppercase text-sm tracking-widest hover:border-green-600 transition-all active:scale-95">
                               Revise PDF
                           </button>
                       </div>
                   </motion.div>
              </div>
          </ProtectedRoute>
      );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto px-6 py-20 min-h-screen pb-40">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-24 text-center md:text-left">
            <div>
                 <motion.div 
                   initial={{ x: -20, opacity: 0 }}
                   animate={{ x: 0, opacity: 1 }}
                   className="inline-flex items-center gap-3 bg-indigo-50 text-indigo-700 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] mb-10 italic border border-indigo-100"
                 >
                      <Zap className="w-4 h-4 fill-indigo-600" />
                      Hackveda Submission
                 </motion.div>
                 <h1 className="text-4xl lg:text-7xl font-black text-gray-900 leading-tight tracking-tighter italic uppercase">
                    Submit Your <br/><span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-950 font-black">Project Idea.</span>
                 </h1>
            </div>
            {team && (
                <div className="bg-white border-4 border-indigo-50 p-10 rounded-[3rem] text-right shadow-2xl shadow-indigo-600/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                        <Users className="w-20 h-20" />
                    </div>
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3 italic">Your Team</p>
                    <p className="text-3xl font-black text-gray-900 leading-none uppercase italic tracking-tighter">{team.teamName}</p>
                    <div className="flex items-center justify-end gap-2 mt-4">
                         <div className={`w-2 h-2 rounded-full ${isTeamSizeInvalid ? 'bg-red-500' : 'bg-green-500'} shadow-[0_0_8px_current]`} />
                         <span className={`text-[11px] font-black uppercase tracking-widest ${isTeamSizeInvalid ? 'text-red-500' : 'text-indigo-600'}`}>{team.memberIds.length} Members Active</span>
                    </div>
                </div>
            )}
        </div>

        {/* Upload Container */}
        <div className="space-y-12">
            {isTeamSizeInvalid && (
                 <motion.div 
                   initial={{ y: 20, opacity: 0 }}
                   animate={{ y: 0, opacity: 1 }}
                   className="bg-orange-50 border-4 border-orange-100 p-10 rounded-[3.5rem] flex flex-col md:flex-row items-center gap-10 text-orange-700 shadow-2xl shadow-orange-500/5"
                 >
                    <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-orange-500/10 shrink-0">
                        <AlertCircle className="w-10 h-10 text-orange-500" />
                    </div>
                    <div className="text-center md:text-left">
                        <h4 className="font-black text-2xl mb-2 italic tracking-tighter leading-none uppercase">Team Size Not Allowed</h4>
                        <p className="font-bold text-base tracking-tight opacity-70 italic">Hackveda requires teams to have 2 to 4 members. You currently have {team?.memberIds.length}.</p>
                    </div>
                    <Link href="/team" className="h-16 px-10 bg-orange-600 text-white rounded-2xl flex items-center justify-center font-black uppercase text-xs tracking-widest hover:bg-orange-700 transition-all ml-auto shrink-0">
                        Update Team
                    </Link>
                 </motion.div>
             )}

            {error && (
                <motion.div 
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="bg-red-50 border-4 border-red-100 p-8 rounded-[3rem] flex items-start gap-6 text-red-700 shadow-2xl shadow-red-500/5"
                >
                    <div className="bg-white p-3 rounded-xl shrink-0">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <p className="font-black text-sm tracking-tight uppercase leading-relaxed pt-1 italic">{error}</p>
                </motion.div>
            )}

            <div className={`p-12 md:p-24 rounded-[4rem] bg-white transition-all duration-700 border-4 shadow-2xl ${file ? 'border-indigo-600 bg-indigo-50/5' : 'border-dashed border-gray-100'} ${isTeamSizeInvalid ? 'opacity-30 cursor-not-allowed' : ''} relative group overflow-hidden`}>
                <input 
                    type="file" 
                    id="pdf-upload" 
                    className="hidden" 
                    onChange={handleFileChange}
                    accept=".pdf"
                    disabled={isTeamSizeInvalid}
                />
                
                {!file ? (
                    <label htmlFor="pdf-upload" className={`cursor-pointer group/label block text-center ${isTeamSizeInvalid ? 'pointer-events-none' : ''}`}>
                        <div className="w-40 h-40 bg-gray-50 rounded-[4rem] flex items-center justify-center mx-auto mb-10 border-2 border-indigo-50 shadow-2xl group-hover/label:bg-indigo-600 group-hover/label:shadow-indigo-600/30 transition-all duration-700 group-hover/label:scale-110 relative">
                            <Cloud className="w-16 h-16 text-gray-200 group-hover/label:text-white" />
                            <div className="absolute inset-0 border-4 border-indigo-600 opacity-0 rounded-[4rem] rotate-12" />
                        </div>
                        <h3 className="text-2xl md:text-4xl font-black text-gray-900 mb-4 italic tracking-tighter uppercase leading-none">Choose Your PDF.</h3>
                        <p className="text-gray-400 font-bold mb-12 italic text-base md:text-lg leading-relaxed">Select your project proposal for evaluation. <br/><span className="text-[10px] uppercase tracking-[0.5em] text-indigo-400 font-black">Supported: PDF Only (Max 10MB)</span></p>
                        
                        <div className="inline-flex h-20 items-center justify-center gap-6 px-16 rounded-[2.5rem] bg-gray-900 text-white font-black uppercase text-xs tracking-[0.3em] italic hover:bg-black transition-all active:scale-95 shadow-2xl shadow-black/20">
                             Browse File System <ArrowRight className="w-5 h-5" />
                        </div>
                    </label>
                ) : (
                    <div className="animate-fade-in text-center relative z-10">
                        <div className="w-40 h-40 bg-indigo-600 rounded-[4rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-indigo-600/40 relative">
                            <FileText className="w-16 h-16 text-white" />
                        </div>
                        <h3 className="text-4xl font-black text-gray-900 mb-2 truncate px-10 italic uppercase tracking-tighter">{file.name}</h3>
                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.5em] mb-16 italic">Ready to Submit ({(file.size / (1024 * 1024)).toFixed(2)} MB)</p>
                        
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <button 
                                onClick={handleSubmit}
                                disabled={uploading || isTeamSizeInvalid}
                                className="h-24 px-20 bg-indigo-600 text-white rounded-[2.5rem] flex items-center justify-center gap-6 active:scale-95 disabled:opacity-50 font-black uppercase text-lg tracking-tighter shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all"
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="w-8 h-8 animate-spin" />
                                        ARCHIVING {progress}% 
                                    </>
                                ) : (
                                    <>
                                        Submit Proposal <ArrowRight className="w-6 h-6" />
                                    </>
                                )}
                            </button>
                            <button 
                               onClick={() => setFile(null)}
                               disabled={uploading}
                               className="w-24 h-24 bg-red-50 text-red-500 rounded-[2.5rem] flex items-center justify-center hover:bg-red-600 hover:text-white transition-all disabled:opacity-50 shadow-xl shadow-red-500/5"
                            >
                                <Trash2 className="w-10 h-10" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Background Decoration */}
                <div className="absolute bottom-0 right-0 p-20 opacity-5 -z-10 group-hover:scale-150 transition-transform duration-[2000ms]">
                    <Zap className="w-96 h-96 fill-indigo-600" />
                </div>
            </div>
            
            <div className="p-12 md:p-16 rounded-[4rem] bg-gray-50 border-4 border-gray-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:rotate-12 transition-transform duration-700">
                    <Info className="w-48 h-48" />
                </div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-10 italic">Evaluation Rules</h4>
                <div className="grid md:grid-cols-3 gap-12 text-center md:text-left">
                    <div className="space-y-3">
                        <div className="text-indigo-600 font-black text-4xl italic tracking-tighter">01.</div>
                        <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest italic leading-relaxed">PDF DOCUMENTATION <br/><span className="text-gray-400">Technical reports must be well-formatted for judge review.</span></p>
                    </div>
                    <div className="space-y-3">
                        <div className="text-indigo-600 font-black text-4xl italic tracking-tighter">02.</div>
                        <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest italic leading-relaxed">DEADLINE COMPLIANCE <br/><span className="text-gray-400">Submissions close exactly at 12:00 PM on April 11.</span></p>
                    </div>
                    <div className="space-y-3">
                        <div className="text-indigo-600 font-black text-4xl italic tracking-tighter">03.</div>
                        <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest italic leading-relaxed">VERSION CONTROL <br/><span className="text-gray-400">The most recently uploaded PDF will be considered final.</span></p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
