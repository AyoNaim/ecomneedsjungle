"use client";

import { motion, Variants } from "framer-motion";

// Animation Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0, filter: "blur(4px)" },
  visible: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function TermsAndPrivacy() {
  const lastUpdated = "2026-07-18";

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-300 font-mono p-6 md:p-12 selection:bg-cyan-500 selection:text-black">
      <motion.div
        className="max-w-4xl mx-auto border-l border-cyan-500/30 pl-6 md:pl-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="mb-16">
          <p className="text-cyan-400 text-sm mb-2 tracking-widest uppercase">
            [ System.Legal_Protocols ]
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            TERMS & PRIVACY
          </h1>
          <p className="text-neutral-500 text-sm">
            Last Commited: <span className="text-cyan-500/70">{lastUpdated}</span>
          </p>
        </motion.div>

        {/* Content Sections */}
        <div className="space-y-12">
          {/* Section 1 */}
          <motion.div variants={itemVariants} className="group">
            <h2 className="text-xl text-white mb-4 flex items-center gap-3">
              <span className="text-cyan-500">01.</span> Digital Asset Licensing
            </h2>
            <div className="text-neutral-400 leading-relaxed space-y-4">
              <p>
                By downloading or purchasing digital assets (including but not limited to WordPress themes, templates, and source code) from this platform, you are granted a non-exclusive, non-transferable license.
              </p>
              <p>
                You may not redistribute, resell, or lease the raw assets. Modification for personal or client projects is permitted under the standard commercial license tier.
              </p>
            </div>
          </motion.div>

          {/* Section 2 */}
          <motion.div variants={itemVariants} className="group">
            <h2 className="text-xl text-white mb-4 flex items-center gap-3">
              <span className="text-cyan-500">02.</span> Data Telemetry & Privacy
            </h2>
            <div className="text-neutral-400 leading-relaxed space-y-4">
              <p>
                We minimize data extraction. We collect only the exact data parameters required to authenticate your identity, process transactions, and deliver digital goods.
              </p>
              <p>
                Financial transactions are routed through encrypted, third-party payment gateways. We do not store native credit card data or raw private keys on our local servers.
              </p>
            </div>
          </motion.div>

          {/* Section 3 */}
          <motion.div variants={itemVariants} className="group">
            <h2 className="text-xl text-white mb-4 flex items-center gap-3">
              <span className="text-cyan-500">03.</span> Account Termination
            </h2>
            <div className="text-neutral-400 leading-relaxed space-y-4">
              <p>
                We reserve the right to sever system access and terminate accounts found engaging in reverse-engineering of our proprietary assets, chargeback fraud, or distribution of our licensed codebases on unauthorized public repositories.
              </p>
            </div>
          </motion.div>
        </div>
        
        {/* Decorative Footer Element */}
        <motion.div variants={itemVariants} className="mt-24 border-t border-neutral-800 pt-8 flex items-center gap-2 text-xs text-neutral-600">
          <div className="w-2 h-2 bg-cyan-500 animate-pulse rounded-full" />
          SYSTEM_STATUS: ONLINE_AND_ENFORCING
        </motion.div>
      </motion.div>
    </div>
  );
}