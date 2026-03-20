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
       <div className="max-w-3xl mx-auto px-6 py-20 md:py-32 text-center min-h-screen">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="p-8 md:p-12 rounded-3xl bg-white border border-indigo-50 shadow-sm"
            >
                <div className="bg-amber-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <AlertCircle className="w-8 h-8 text-amber-600" />
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 tracking-tight uppercase">Team Required.</h2>
                <p className="text-gray-500 font-medium mb-8 max-w-sm mx-auto">You need to be part of a team to submit your idea.</p>
                <Link href="/profile" className="w-full md:w-auto inline-flex items-center justify-center gap-3 bg-gray-900 text-white px-8 h-12 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-black transition-all active:scale-95 shadow-md">
                    <ArrowLeft className="w-4 h-4" /> Back to Profile
                </Link>
            </motion.div>
       </div>
    </ProtectedRoute>
  );

  const isTeamSizeInvalid = !!(team && (team.memberIds.length < 2 || team.memberIds.length > 4));

  if (success) {
      return (
          <ProtectedRoute>
              <div className="max-w-3xl mx-auto px-6 py-20 md:py-32 text-center min-h-screen">
                   <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="p-8 md:p-12 rounded-3xl bg-white border border-green-100 shadow-sm relative overflow-hidden"
                   >
                       <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                       <div className="w-20 h-20 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-md shadow-green-500/20">
                           <ShieldCheck className="w-10 h-10 text-white" />
                       </div>
                       <h2 className="text-2xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight uppercase">Submission Received.</h2>
                       <p className="text-green-700 text-sm md:text-base font-bold mb-10">Your idea has been successfully submitted to Hackveda.</p>
                       
                       <div className="flex flex-col sm:flex-row gap-4 justify-center">
                           <Link href="/profile" className="flex-1 max-w-[200px] h-12 bg-gray-900 text-white rounded-xl flex items-center justify-center font-bold uppercase text-xs tracking-widest hover:bg-black transition-all active:scale-95 shadow-md">
                               Dashboard
                           </Link>
                           <button onClick={() => setSuccess(false)} className="flex-1 max-w-[200px] h-12 bg-white border border-green-200 text-green-700 rounded-xl flex items-center justify-center font-bold uppercase text-xs tracking-widest hover:border-green-600 transition-all active:scale-[0.98]">
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
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 min-h-screen pb-32">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 text-center md:text-left">
            <div>
                 <motion.div 
                   initial={{ x: -20, opacity: 0 }}
                   animate={{ x: 0, opacity: 1 }}
                   className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest mb-4 border border-indigo-100"
                 >
                      <Zap className="w-3.5 h-3.5 fill-indigo-600" />
                      Hackveda Submission
                 </motion.div>
                 <h1 className="text-3xl lg:text-5xl font-black text-gray-900 leading-tight tracking-tight uppercase">
                    Submit Your <br/><span className="text-indigo-600">Project Idea.</span>
                 </h1>
            </div>
            {team && (
                <div className="bg-white border border-indigo-50 p-6 rounded-2xl text-right shadow-sm relative overflow-hidden group w-full md:w-auto mt-6 md:mt-0">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform pointer-events-none">
                        <Users className="w-12 h-12" />
                    </div>
                    <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Your Team</p>
                    <p className="text-xl font-black text-gray-900 leading-none uppercase tracking-tight">{team.teamName}</p>
                    <div className="flex items-center justify-end gap-2 mt-3">
                         <div className={`w-1.5 h-1.5 rounded-full ${isTeamSizeInvalid ? 'bg-red-500' : 'bg-green-500'} shadow-[0_0_8px_current]`} />
                         <span className={`text-[10px] font-bold uppercase tracking-widest ${isTeamSizeInvalid ? 'text-red-500' : 'text-indigo-600'}`}>{team.memberIds.length} Members Active</span>
                    </div>
                </div>
            )}
        </div>

        {/* Upload Container */}
        <div className="space-y-8">
            {isTeamSizeInvalid && (
                 <motion.div 
                   initial={{ y: 10, opacity: 0 }}
                   animate={{ y: 0, opacity: 1 }}
                   className="bg-orange-50 border border-orange-100 p-6 rounded-2xl flex flex-col md:flex-row items-center gap-4 md:gap-6 text-orange-700 shadow-sm"
                 >
                    <div className="bg-white p-3 rounded-xl shadow-sm shrink-0">
                        <AlertCircle className="w-6 h-6 text-orange-500" />
                    </div>
                    <div className="text-center md:text-left">
                        <h4 className="font-black text-lg mb-1 tracking-tight uppercase">Team Size Not Allowed</h4>
                        <p className="font-medium text-sm">Hackveda requires teams to have 2 to 4 members. You currently have {team?.memberIds.length}.</p>
                    </div>
                    <Link href="/team" className="h-10 px-6 bg-orange-600 text-white rounded-lg flex items-center justify-center font-bold uppercase text-xs tracking-widest hover:bg-orange-700 transition-all md:ml-auto shrink-0 w-full md:w-auto mt-2 md:mt-0">
                        Update Team
                    </Link>
                 </motion.div>
             )}

            {error && (
                <motion.div 
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="bg-red-50 border border-red-100 p-4 sm:p-6 rounded-xl flex items-start gap-4 text-red-700 shadow-sm"
                >
                    <div className="bg-white p-2 rounded-lg shrink-0 shadow-sm">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                    </div>
                    <p className="font-bold text-sm leading-relaxed pt-0.5">{error}</p>
                </motion.div>
            )}

            <div className={`p-8 md:p-16 rounded-3xl bg-white transition-all duration-500 border-2 shadow-sm ${file ? 'border-indigo-600 bg-indigo-50/50' : 'border-dashed border-gray-200'} ${isTeamSizeInvalid ? 'opacity-50 cursor-not-allowed' : ''} relative group overflow-hidden`}>
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
                        <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-indigo-50 shadow-sm group-hover/label:bg-indigo-600 transition-all duration-300 group-hover/label:scale-105 relative">
                            <Cloud className="w-8 h-8 text-gray-300 group-hover/label:text-white transition-colors" />
                            <div className="absolute inset-0 border-2 border-indigo-600 opacity-0 rounded-2xl rotate-6 group-hover/label:opacity-100 transition-opacity" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-2 tracking-tight uppercase">Choose Your PDF.</h3>
                        <p className="text-gray-500 font-medium mb-8 text-sm leading-relaxed">Select your project proposal for evaluation. <br/><span className="text-[10px] uppercase tracking-widest text-indigo-500 font-bold">Supported: PDF Only (Max 10MB)</span></p>
                        
                        <div className="inline-flex h-12 items-center justify-center gap-3 px-8 rounded-xl bg-gray-900 text-white font-bold uppercase text-xs tracking-widest hover:bg-black transition-all active:scale-[0.98] shadow-md">
                             Browse File System <ArrowRight className="w-4 h-4" />
                        </div>
                    </label>
                ) : (
                    <div className="animate-fade-in text-center relative z-10 w-full overflow-hidden">
                        <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md shadow-indigo-600/30">
                            <FileText className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-2 truncate px-4 tracking-tight uppercase max-w-full">{file.name}</h3>
                        <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-10">Ready to Submit ({(file.size / (1024 * 1024)).toFixed(2)} MB)</p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button 
                                onClick={handleSubmit}
                                disabled={uploading || isTeamSizeInvalid}
                                className="h-14 px-8 bg-indigo-600 text-white rounded-xl flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 font-bold uppercase text-sm tracking-widest shadow-md hover:bg-indigo-700 transition-all w-full sm:w-auto"
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        UPLOADING {progress}% 
                                    </>
                                ) : (
                                    <>
                                        Submit Proposal <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                            <button 
                               onClick={() => setFile(null)}
                               disabled={uploading}
                               className="h-14 w-full sm:w-14 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50 shadow-sm shrink-0"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Background Decoration */}
                <div className="absolute bottom-0 right-0 p-8 opacity-5 -z-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                    <Zap className="w-64 h-64 fill-indigo-600" />
                </div>
            </div>
            
            <div className="p-8 md:p-10 rounded-3xl bg-gray-50 border border-gray-200 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-6 transition-transform pointer-events-none">
                    <Info className="w-32 h-32" />
                </div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Evaluation Rules</h4>
                <div className="grid md:grid-cols-3 gap-8 text-center md:text-left relative z-10">
                    <div className="space-y-2">
                        <div className="text-indigo-600 font-black text-2xl tracking-tight">01.</div>
                        <p className="text-[10px] font-bold text-gray-900 uppercase tracking-widest leading-relaxed">PDF DOCUMENTATION <br/><span className="text-gray-500 font-medium">Technical reports must be formatted for judge review.</span></p>
                    </div>
                    <div className="space-y-2">
                        <div className="text-indigo-600 font-black text-2xl tracking-tight">02.</div>
                        <p className="text-[10px] font-bold text-gray-900 uppercase tracking-widest leading-relaxed">DEADLINE COMPLIANCE <br/><span className="text-gray-500 font-medium">Submissions close exactly at 12:00 PM on April 11.</span></p>
                    </div>
                    <div className="space-y-2">
                        <div className="text-indigo-600 font-black text-2xl tracking-tight">03.</div>
                        <p className="text-[10px] font-bold text-gray-900 uppercase tracking-widest leading-relaxed">VERSION CONTROL <br/><span className="text-gray-500 font-medium">The most recently uploaded PDF will be evaluated.</span></p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
