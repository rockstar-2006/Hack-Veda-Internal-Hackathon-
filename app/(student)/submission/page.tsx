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
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 min-h-screen pb-32 font-sans relative">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 text-center md:text-left">
            <div>
                 <motion.div 
                   initial={{ x: -20, opacity: 0 }}
                   animate={{ x: 0, opacity: 1 }}
                   className="inline-flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-widest mb-4 border-4 border-black shadow-[4px_4px_0_#000]"
                 >
                      <Zap className="w-5 h-5 fill-black" />
                      HACKVEDA SUBMISSION
                 </motion.div>
                 <h1 className="text-4xl lg:text-6xl font-comic text-black leading-none tracking-widest uppercase mb-2 drop-shadow-[4px_4px_0_#00f0ff]">
                    UPLOAD OUR <br/><span className="text-white drop-shadow-[4px_4px_0_#000]">PROJECT!</span>
                 </h1>
                 <p className="bg-white p-3 inline-block border-4 border-black rounded-xl text-sm font-bold text-gray-800 shadow-[4px_4px_0_#ff007f] transform -rotate-1 mt-4">
                     Upload your documentation. Only the best survive.
                 </p>
            </div>
            {team && (
                <div className="bg-cyan-400 border-4 border-black p-6 rounded-2xl text-right shadow-[8px_8px_0_#000] relative overflow-hidden group w-full md:w-auto mt-6 md:mt-0 transform rotate-1 hover:rotate-0 transition-transform">
                    <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform pointer-events-none">
                        <Users className="w-16 h-16 text-black" />
                    </div>
                    <p className="text-xs font-bold text-black bg-white inline-block px-2 py-1 border-2 border-black rounded-lg uppercase tracking-widest mb-1 relative z-10">Your Squad</p>
                    <p className="text-3xl font-comic text-white drop-shadow-[2px_2px_0_#000] leading-none uppercase tracking-widest mt-2 relative z-10">{team.teamName}</p>
                    <div className="flex items-center justify-end gap-2 mt-4 relative z-10">
                         <div className={`w-3 h-3 rounded-full border-2 border-black ${isTeamSizeInvalid ? 'bg-red-500 animate-pulse' : 'bg-green-500'} shadow-[2px_2px_0_#000]`} />
                         <span className={`text-xs font-bold uppercase tracking-widest ${isTeamSizeInvalid ? 'text-red-900 bg-red-200 px-2 rounded border-2 border-black' : 'text-black'}`}>{team.memberIds.length} Members Active</span>
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
                   className="bg-red-400 border-4 border-black p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6 text-black shadow-[8px_8px_0_#000]"
                 >
                    <div className="bg-white p-4 rounded-xl border-4 border-black shadow-[4px_4px_0_#000] shrink-0 animate-bounce">
                        <AlertCircle className="w-8 h-8 text-black stroke-[3]" />
                    </div>
                    <div className="text-center md:text-left bg-white p-4 border-4 border-black rounded-xl w-full">
                        <h4 className="font-comic text-2xl mb-1 tracking-widest uppercase">TEAM SIZE NOT ALLOWED!</h4>
                        <p className="font-bold text-sm text-gray-800">HackVeda requires teams to have 2 to 4 members. You currently have {team?.memberIds.length}.</p>
                    </div>
                    <Link href="/team" className="h-14 px-8 bg-yellow-400 text-black border-4 border-black rounded-xl flex items-center justify-center font-comic text-lg uppercase tracking-widest shadow-[4px_4px_0_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0_#000] active:translate-y-1 active:shadow-none transition-all md:ml-auto shrink-0 w-full md:w-auto mt-2 md:mt-0">
                        UPDATE TEAM
                    </Link>
                 </motion.div>
             )}

            {error && (
                <motion.div 
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="bg-red-400 border-4 border-black p-6 rounded-2xl flex items-start gap-4 text-black shadow-[6px_6px_0_#000] transform -rotate-[0.5deg]"
                >
                    <div className="bg-white p-3 rounded-xl border-4 border-black shadow-[4px_4px_0_#000] shrink-0">
                        <AlertCircle className="w-6 h-6 text-black stroke-[3]" />
                    </div>
                    <p className="font-comic text-xl tracking-wider leading-none bg-white p-3 border-4 border-black rounded-xl">{error}</p>
                </motion.div>
            )}

            <div className={`p-8 md:p-16 rounded-3xl bg-white transition-all duration-300 border-4 shadow-[12px_12px_0_#000] ${file ? 'border-black bg-yellow-100' : 'border-dashed border-black'} ${isTeamSizeInvalid ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-1 hover:shadow-[16px_16px_0_#000]'} relative group overflow-hidden`}>
                <input 
                    type="file" 
                    id="pdf-upload" 
                    className="hidden" 
                    onChange={handleFileChange}
                    accept=".pdf"
                    disabled={isTeamSizeInvalid}
                />
                
                {/* Halftone Pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '16px 16px' }} />

                {!file ? (
                    <label htmlFor="pdf-upload" className={`cursor-pointer group/label block text-center relative z-10 ${isTeamSizeInvalid ? 'pointer-events-none' : ''}`}>
                        <div className="w-24 h-24 bg-pink-400 border-4 border-black rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-[8px_8px_0_#000] group-hover/label:-translate-y-2 group-hover/label:shadow-[12px_12px_0_#000] transition-all duration-300 relative transform rotate-2 group-hover/label:rotate-0">
                            <Cloud className="w-12 h-12 text-black stroke-[3]" />
                        </div>
                        <h3 className="text-3xl md:text-5xl font-comic text-black mb-4 tracking-widest uppercase drop-shadow-[2px_2px_0_#00f0ff] bg-white inline-block px-4 py-2 border-4 border-black rounded-xl">CHOOSE YOUR PDF!</h3>
                        <p className="text-gray-900 font-bold mb-8 text-sm leading-relaxed bg-yellow-300 inline-block px-4 py-2 border-2 border-black rounded-lg transform -rotate-1">Select your project proposal for evaluation. <br/><span className="text-xs uppercase tracking-widest text-black font-black mt-1 block px-2 py-1 bg-white border-2 border-black rounded">SUPPORTED: PDF ONLY (MAX 10MB)</span></p>
                        
                        <div className="flex h-16 items-center justify-center gap-3 px-8 rounded-2xl bg-cyan-400 text-black border-4 border-black font-comic text-xl uppercase tracking-widest shadow-[8px_8px_0_#000] hover:bg-cyan-300 active:-translate-y-0 active:shadow-none transition-all w-full max-w-sm mx-auto">
                             BROWSE FILE SYSTEM <ArrowRight className="w-6 h-6 stroke-[3]" />
                        </div>
                    </label>
                ) : (
                    <div className="animate-fade-in text-center relative z-10 w-full overflow-hidden bg-white p-8 border-4 border-black rounded-3xl shadow-[8px_8px_0_#000]">
                        <div className="w-24 h-24 bg-pink-400 border-4 border-black rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[6px_6px_0_#00f0ff] transform -rotate-3">
                            <FileText className="w-10 h-10 text-black stroke-[3]" />
                        </div>
                        <h3 className="text-2xl md:text-3xl font-comic text-black mb-2 truncate px-4 tracking-widest uppercase max-w-full drop-shadow-[2px_2px_0_#ff007f]">{file.name}</h3>
                        <p className="text-sm font-bold text-black uppercase tracking-widest mb-8 bg-yellow-300 inline-block px-3 py-1 border-2 border-black rounded-lg">READY TO SUBMIT ({(file.size / (1024 * 1024)).toFixed(2)} MB)</p>
                        
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <button 
                                onClick={handleSubmit}
                                disabled={uploading || isTeamSizeInvalid}
                                className="h-16 px-10 bg-cyan-400 text-black border-4 border-black rounded-2xl flex items-center justify-center gap-3 active:translate-y-2 active:shadow-none disabled:opacity-50 font-comic text-xl uppercase tracking-widest shadow-[8px_8px_0_#000] hover:-translate-y-1 hover:shadow-[12px_12px_0_#000] transition-all w-full sm:w-auto"
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin stroke-[3]" />
                                        UPLOADING {progress}% 
                                    </>
                                ) : (
                                    <>
                                        SUBMIT PROPOSAL <ArrowRight className="w-6 h-6 stroke-[3]" />
                                    </>
                                )}
                            </button>
                            <button 
                               onClick={() => setFile(null)}
                               disabled={uploading}
                               className="h-16 w-full sm:w-16 bg-red-400 text-black border-4 border-black rounded-2xl flex items-center justify-center hover:bg-red-500 hover:-translate-y-1 transition-all disabled:opacity-50 shadow-[8px_8px_0_#000] hover:shadow-[12px_12px_0_#000] active:translate-y-2 active:shadow-none shrink-0"
                            >
                                <Trash2 className="w-6 h-6 stroke-[3]" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Background Decoration */}
                <div className="absolute bottom-0 right-0 p-8 opacity-10 -z-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 pointer-events-none">
                    <Zap className="w-80 h-80 fill-black stroke-black stroke-[2]" />
                </div>
            </div>
            
            <div className="p-8 md:p-12 rounded-3xl bg-pink-400 border-4 border-black shadow-[12px_12px_0_#000] relative overflow-hidden group transform rotate-1 hover:rotate-0 transition-transform">
                {/* Halftone Pattern */}
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '16px 16px' }} />

                <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:rotate-12 transition-transform pointer-events-none">
                    <Info className="w-40 h-40 text-black stroke-[2]" />
                </div>
                <h4 className="text-sm font-bold text-black uppercase tracking-widest mb-8 bg-white inline-block px-4 py-2 border-4 border-black rounded-xl shadow-[4px_4px_0_#000] -rotate-2 relative z-10">SUBMISSION RULES</h4>
                
                <div className="grid md:grid-cols-3 gap-8 text-center md:text-left relative z-10">
                    <div className="bg-white p-6 border-4 border-black rounded-2xl shadow-[6px_6px_0_#000] transform hover:-translate-y-2 transition-transform">
                        <div className="text-pink-500 font-comic text-5xl tracking-widest drop-shadow-[2px_2px_0_#000]">01.</div>
                        <p className="text-[10px] font-bold text-black uppercase tracking-widest leading-relaxed mt-2 bg-yellow-300 p-2 border-2 border-black rounded">PDF DOCUMENTATION</p>
                        <p className="text-gray-800 font-medium text-xs mt-3">Technical reports must be formatted exactly for judge review.</p>
                    </div>
                    <div className="bg-white p-6 border-4 border-black rounded-2xl shadow-[6px_6px_0_#000] transform hover:-translate-y-2 transition-transform mt-4 md:mt-0">
                        <div className="text-yellow-400 font-comic text-5xl tracking-widest drop-shadow-[2px_2px_0_#000]">02.</div>
                        <p className="text-[10px] font-bold text-black uppercase tracking-widest leading-relaxed mt-2 bg-cyan-300 p-2 border-2 border-black rounded">DEADLINE COMPLIANCE</p>
                        <p className="text-gray-800 font-medium text-xs mt-3">Submissions close securely at 12:00 PM on April 11.</p>
                    </div>
                    <div className="bg-white p-6 border-4 border-black rounded-2xl shadow-[6px_6px_0_#000] transform hover:-translate-y-2 transition-transform mt-8 md:mt-0">
                        <div className="text-cyan-400 font-comic text-5xl tracking-widest drop-shadow-[2px_2px_0_#000]">03.</div>
                        <p className="text-[10px] font-bold text-black uppercase tracking-widest leading-relaxed mt-2 bg-pink-300 p-2 border-2 border-black rounded">VERSION CONTROL</p>
                        <p className="text-gray-800 font-medium text-xs mt-3">Only the final uploaded PDF protocol will be evaluated.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
