"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  ArrowRight, 
  Fingerprint, 
  ShieldCheck, 
  Globe2 
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await signIn("resend", { email, callbackUrl: "/" });
  };

  return (
    <main className="relative min-h-screen w-full bg-[#030303] flex items-center justify-center p-6 overflow-hidden selection:bg-emerald-500/30">
      
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#065f4630,transparent)]" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none" />
      
      {/* Subtle Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md"
      >
        {/* The Glass Console */}
        <div className="group relative bg-zinc-950/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden">
          
          {/* Animated Border Glow */}
          <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

          {/* Header Section */}
          <header className="mb-10 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono text-emerald-500/70 tracking-[0.4em] uppercase">
                Secure Entry Protocol
              </span>
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight leading-tight">
              Access the <br />
              <span className="text-zinc-500">Merchant Core.</span>
            </h1>
          </header>

          <div className="space-y-6">
            {/* Email OTP/Magic Link Section */}
            <form onSubmit={handleMagicLink} className="space-y-3">
              <div className="relative group/input">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within/input:text-emerald-500 transition-colors" />
                <input
                  type="email"
                  required
                  placeholder="name@store.com"
                  className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all duration-300"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                disabled={isLoading}
                className="w-full relative overflow-hidden bg-white text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 group/btn transition-transform active:scale-[0.98]"
              >
                <span className="relative z-10">{isLoading ? "Requesting..." : "Initialize Session"}</span>
                <ArrowRight className="relative z-10 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-mint-200 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
              </button>
            </form>

            {/* Separator */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5" /></div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-[#0b0b0b] px-4 text-zinc-600 font-mono">Authentication Tier</span></div>
            </div>

            {/* Google Auth Button */}
            <button
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="w-full bg-transparent border border-white/5 text-zinc-300 py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/5 hover:text-white transition-all duration-300 font-medium"
            >
            <svg 
                viewBox="0 0 24 24" 
                className="h-5 w-5 opacity-70 group-hover/google:opacity-100 transition-opacity"
                fill="currentColor" 
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M12.48 10.92V14.51H19.56C19.26 16.14 17.84 19.34 14.52 19.34C11.64 19.34 9.3 16.94 9.3 14C9.3 11.06 11.64 8.66 14.52 8.66C16.16 8.66 17.26 9.36 17.89 9.97L20.73 7.23C18.91 5.53 16.51 4.5 14.52 4.5C9.28 4.5 5 8.78 5 14C5 19.22 9.28 23.5 14.52 23.5C19.99 23.5 23.63 19.64 23.63 14.17C23.63 13.51 23.56 12.85 23.42 12.21L12.48 10.92Z" />
            </svg>
              Continue with Google
            </button>
          </div>

          {/* Footer Metadata */}
          <footer className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-[9px] text-zinc-600 font-mono uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <Fingerprint className="h-3 w-3" />
              E2E Encryption Active
            </div>
            <div className="flex items-center gap-2">
              <Globe2 className="h-3 w-3" />
              Lagos Node: 6.5244° N
            </div>
          </footer>
        </div>

        {/* Decorative Floating Label */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 md:-right-10 md:left-auto md:translate-x-0 rotate-0 md:rotate-90">
          <span className="text-[10px] text-zinc-800 font-mono uppercase tracking-[1em] whitespace-nowrap">
            Premium Digital Assets
          </span>
        </div>
      </motion.div>
    </main>
  );
}