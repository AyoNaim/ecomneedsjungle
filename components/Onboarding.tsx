"use client";

import React, { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Fingerprint, UploadCloud, Store, UserCheck, CheckCircle2 } from "lucide-react";

// Constraints defined by user requirement
const MAX_FILE_SIZE_KB = 50;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_KB * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export default function OnboardingPage() {
  const { data: session, update } = useSession();
  const router = useRouter();

  // Form State
  const [name, setName] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(session?.user?.image || null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  
  // UI State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepComplete, setStepComplete] = useState(false);

  // --- Human Interaction Handler: File Processing & Validation ---
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError(null);

    if (!file) return;

    // 1. Custom Validation: MIME Type check (PNG/JPG only)
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError(`Format rejection. System accepts JPG/PNG only.`);
      fileInputRef.current!.value = ""; // Reset input
      return;
    }

    // 2. Custom Validation: Size check (<50KB)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(`Data terminal saturation. File exceeds ${MAX_FILE_SIZE_KB}KB limit.`);
      fileInputRef.current!.value = ""; // Reset input
      return;
    }

    // 3. Visual Feedback: Read file as Base64 for preview and upload
    const reader = new FileReader();
    reader.onloadstart = () => setIsUploading(true);
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      setBase64Image(result); // This raw data goes to API
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  // --- Finalization Handler: Sync with API & Mutate Session ---
  const finalizeOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!name) {
      setError("Merchant alias cannot be null.");
      setIsSubmitting(false);
      return;
    }

    try {
      // 1. Push data to our backend route
      const response = await fetch("/api/user/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, base64Image }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Core synchronization failed.");
      }

      const result = await response.json();

      // 2. Dynamic Session Mutation (The Auth.js v5 trick)
      // This tells the Edge middleware instantly that user is onboarded
      await update({
        user: {
          ...session?.user,
          name: result.user.name,
          image: result.user.image,
          isOnboarded: true, // 👈 Updates the JWT token in browser
        },
      });

      // 3. UI Success State
      setStepComplete(true);
      
      // 4. Smooth transition to Dashboard
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1800);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Unknown synchronization error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Asymmetric layout decorative variants
  const decorationDataStream = [
    "LOG::USER_INIT [AUTHENTICATED]",
    "SYSTEM::ONBOARDING_CORE v0.9",
    "LAGOS_NODE::DEPLOYED",
    "LOC::6.5244° N, 3.3792° E",
    `EMAIL::${session?.user?.email ? session.user.email.toUpperCase() : "CONNECTING..."}`,
    "PROTOCOL::MERCHANT_CORE",
    "PRISMA::SYNC_READY",
    "AUTHJS::SESSION_ACTIVE",
    "FINALIZING_PROFILE...",
  ];

  if (stepComplete) {
    return (
      <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center p-6 selection:bg-emerald-500/20 text-white">
        <motion.div initial={{scale: 0.8, opacity: 0}} animate={{scale: 1, opacity: 1}} transition={{type: "spring", damping: 15}}>
          <CheckCircle2 className="w-24 h-24 text-emerald-500 animate-pulse" strokeWidth={1}/>
        </motion.div>
        <motion.p initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} transition={{delay: 0.5}} className="mt-6 text-2xl font-bold tracking-tight">Initialization Complete.</motion.p>
        <motion.p initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 1}} className="text-zinc-600 font-mono text-xs uppercase tracking-widest mt-2">Redirecting to core...</motion.p>
      </div>
    )
  }

  return (
    <main className="min-h-screen w-full bg-[#030303] flex items-center justify-center p-4 md:p-6 text-white selection:bg-emerald-500/30 overflow-hidden font-sans">
      
      {/* Background Micro-Noise */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />

      {/* Asymmetric Split Layout */}
      <div className="relative w-full max-w-7xl grid grid-cols-1 md:grid-cols-[1fr,minmax(auto,450px)] gap-10 lg:gap-16 items-start">
        
        {/* Left Side: Dynamic Decorative Data Stream (Invisible on Mobile) */}
        <div className="hidden md:block space-y-3 pt-12 pl-6">
          <header className="mb-10">
            <h1 className="text-6xl font-extrabold tracking-tight leading-[0.95] text-zinc-800">
              Merchant <br />
              Registration <br />
              <span className="text-zinc-900">Sequence</span>
            </h1>
          </header>
          {decorationDataStream.map((log, index) => (
            <motion.div 
              key={index}
              initial={{opacity: 0, x: -10}}
              animate={{opacity: 1, x: 0}}
              transition={{delay: index * 0.1, duration: 0.5}}
              className="font-mono text-[9px] uppercase tracking-[0.3em] text-emerald-500/40"
            >
              {log}
            </motion.div>
          ))}
        </div>

        {/* Right Side: The Premium Console Form */}
        <motion.form 
          onSubmit={finalizeOnboarding}
          initial={{opacity: 0, y: 30}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 1, ease: [0.22, 1, 0.36, 1]}}
          className="relative bg-zinc-950 border border-white/5 p-10 md:p-14 rounded-[3rem] shadow-2xl space-y-12"
        >
          {/* Animated Green Corner Accent */}
          <div className="absolute -top-px -right-px h-16 w-16 bg-gradient-to-br from-emerald-500 to-transparent opacity-30 rounded-tr-[3rem] [mask-image:linear-gradient(to_bottom,black,transparent_50%),linear-gradient(to_right,transparent_50%,black)]" />

          {/* Form Header */}
          <header className="space-y-2">
            <div className="flex items-center gap-3 text-emerald-500/80 mb-2">
              <UserCheck className="w-4 h-4" />
              <span className="font-mono text-[10px] uppercase tracking-widest">Protocol 01</span>
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-white leading-tight">Define Your <span className="text-zinc-600">Merchant Avatar</span></h2>
            <p className="text-zinc-500 text-sm max-w-xs">Your public identity on the specialized network.</p>
          </header>

          <AnimatePresence mode="popLayout">
            {error && (
              <motion.div initial={{opacity: 0, height: 0}} animate={{opacity: 1, height: 'auto'}} exit={{opacity: 0, height: 0}} className="bg-red-950/50 border border-red-500/50 text-red-300 p-4 rounded-2xl text-xs font-mono">
                [SYSTEM_ALERT]:: {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Part A: The File Dropper */}
          <div className="space-y-4">
            <label className="block text-[10px] font-mono text-zinc-600 uppercase tracking-widest pl-2">Merchant Icon (JPG/PNG &lt;50KB)</label>
            <div className="relative group flex items-center gap-6 p-4 bg-black rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-colors duration-500">
              
              {/* Hidden Standard Input */}
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".jpg, .jpeg, .png" className="hidden"/>

              {/* Avatar Preview */}
              <div className="relative h-20 w-20 flex-shrink-0">
                <img 
                  src={imagePreview || "./default-avatar.svg"} 
                  alt="Preview" 
                  className={`h-full w-full rounded-xl object-cover border-2 transition-all ${isUploading ? 'border-dashed border-emerald-500/50' : 'border-white/10'}`}
                />
                {isUploading && <div className="absolute inset-0 bg-black/70 rounded-xl flex items-center justify-center font-mono text-[9px] text-emerald-500 animate-pulse">Reading...</div>}
              </div>

              {/* Custom Dropper Button */}
              <div className="flex-grow space-y-1">
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-zinc-900 text-white text-xs font-medium px-5 py-3 rounded-lg flex items-center gap-2.5 group-hover:bg-zinc-800 transition-all active:scale-95"
                >
                  <UploadCloud className="w-4 h-4 text-emerald-500"/>
                  Select Image Data
                </button>
                <p className="text-[10px] text-zinc-700 font-mono pl-1">Binary size limit: 50KB</p>
              </div>

              {/* E2E Active Decoration */}
              <div className="absolute -bottom-6 right-6">
                <motion.div animate={{rotate: [0, 360, 0]}} transition={{repeat: Infinity, duration: 10, ease: "linear"}} className="text-zinc-900">
                  <Fingerprint strokeWidth={0.5} className="h-10 h-10"/>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Part B: The Name Input */}
          <div className="relative space-y-4 group">
            
            {/* The "Asymmetric label" - only visible when something is typed */}
            <AnimatePresence>
              {name && (
                <motion.label 
                  initial={{opacity: 0, x: -5}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: -5}}
                  className="absolute -top-3 left-4 text-[10px] font-mono text-emerald-500 bg-zinc-950 px-2 uppercase tracking-widest z-10"
                >
                  Merchant Alias
                </motion.label>
              )}
            </AnimatePresence>

            <div className="relative">
              <Store className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-700 group-focus-within:text-emerald-500 transition-colors" />
              <input 
                type="text"
                required
                value={name}
                minLength={2}
                placeholder={name ? "" : "Define Merchant Alias"} // Acts as label until typed
                className="w-full bg-black border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-lg font-bold text-white placeholder:text-zinc-800 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all duration-300"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isSubmitting || stepComplete}
            className="w-full relative overflow-hidden bg-white text-black font-extrabold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 group hover:scale-[1.01] active:scale-[0.99] disabled:bg-zinc-800 disabled:text-zinc-600"
          >
            {isSubmitting ? (
              <>
                <motion.div animate={{rotate: 360}} transition={{repeat: Infinity, duration: 1}} className="w-4 h-4 rounded-full border-2 border-dashed border-zinc-600"/>
                Synchronizing core...
              </>
            ) : (
              <>
                <span className="relative z-10">Finalize Initialization</span>
                <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </>
            )}
            
            {/* White to Mint hover glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-white to-mint-100 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </motion.form>
      </div>
    </main>
  );
}