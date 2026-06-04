"use client";

import React from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { CheckCircle2, Mail, ArrowRight, ShoppingBag } from "lucide-react";

interface SuccessUIProps {
  customerEmail?: string | null;
}

export default function SuccessUI({ customerEmail }: SuccessUIProps) {
  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
  };

  return (
    <div className="flex justify-center bg-zinc-950 min-h-screen text-white selection:bg-[#f47521] selection:text-black">
      {/* Background Cyberpunk Grid/Glow Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-[100vw] sm:max-w-[430px] bg-zinc-950/80 backdrop-blur-md min-h-screen border-x border-white/5 flex flex-col items-center px-6 pt-24 text-center relative z-10"
      >
        {/* SUCCESS HEADER */}
        <motion.div variants={itemVariants} className="mb-12 w-full">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
            className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center mb-8 mx-auto border border-[#f47521]/30 shadow-[0_0_30px_rgba(244,117,33,0.15)] relative"
          >
            {/* Animated Checkmark */}
            <CheckCircle2 className="w-12 h-12 text-[#f47521] drop-shadow-[0_0_10px_rgba(244,117,33,0.8)]" />
            
            {/* Radar Sweep Effect */}
            <div className="absolute inset-0 rounded-full border border-[#f47521]/20 animate-[spin_4s_linear_infinite]" />
          </motion.div>
          
          <h1 className="text-3xl font-black uppercase tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500">
            Payment <br />
            Successful
          </h1>
          <p className="font-mono text-[10px] text-[#f47521] mt-3 tracking-[0.3em] uppercase">
            // System_Authorized
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-6 w-full">
          {/* RECEIPT BOX */}
          <div className="bg-zinc-900/50 p-6 rounded-xl border border-white/10 relative overflow-hidden group hover:border-white/20 transition-colors duration-500">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#f47521] opacity-50" />
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em] mb-2 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Confirmation Sent To
            </p>
            <p className="text-sm font-bold text-zinc-200 break-all">
              {customerEmail || "your email address"}
            </p>
          </div>

          <p className="text-zinc-400 text-sm leading-relaxed px-4">
            Thank you for shopping with{" "}
            <span className="text-white font-bold uppercase tracking-widest text-xs">
              Ecomneedsjungle
            </span>
            . Your order is locked into the system and you will receive a tracking beacon shortly.
          </p>

          {/* ACTION BUTTONS */}
          <div className="pt-8 space-y-4">
            <Link href="/" className="block w-full">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#f47521] text-black font-black py-4 rounded-full uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-[#ff8a3d] transition-colors hover:shadow-[0_0_20px_rgba(244,117,33,0.4)]"
              >
                Continue Shopping <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>

            <Link href="/" className="block w-full">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-transparent border border-white/10 text-white font-bold py-4 rounded-full uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-white/5 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" /> View My Orders
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* SUPPORT FOOTER */}
        <motion.div variants={itemVariants} className="mt-auto pb-10 w-full pt-12">
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />
          <div className="flex flex-col items-center gap-2 text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <Mail className="w-3 h-3 text-zinc-400" />
              <span>Need help?</span>
              <a
                href="mailto:support@minilagstore.com"
                className="text-zinc-300 hover:text-[#f47521] transition-colors underline decoration-white/20 underline-offset-4"
              >
                support@ecomneedsjungle.com
              </a>
            </div>
            <span className="mt-4 text-[9px] tracking-[0.4em]">
              © 2026 ECOMNEEDSJUNGLE, LLC
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}