"use client";

import { motion } from "framer-motion";

export default function RefundPolicy() {
  const clauses = [
    {
      id: "REF-01",
      title: "The Digital Irrevocability Protocol",
      text: "Due to the non-returnable nature of digital assets, all sales of source code, themes, and templates are considered final once the download link has been triggered or the repository access has been granted.",
    },
    {
      id: "REF-02",
      title: "Defective Asset Exceptions",
      text: "If an asset is catastrophically corrupted, fails to install as documented, or fundamentally breaks upon immediate deployment, you have 14 days to submit a bug report. If our engineering team cannot resolve the fatal error within 72 hours, a full refund will be authorized.",
    },
    {
      id: "REF-03",
      title: "Subscription Cancellations",
      text: "For recurring access tiers, you may terminate your subscription protocol at any time via your user dashboard. Access will remain active until the end of your current billing cycle. Prorated refunds are not issued for mid-cycle terminations.",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-300 font-mono p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 border-b border-rose-500/30 pb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px w-12 bg-rose-500" />
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tighter">
              REFUND_POLICY
            </h1>
          </div>
          <p className="text-neutral-500 text-sm ml-16">
            Execution Parameters for Financial Reversals
          </p>
        </motion.div>

        <div className="space-y-6 ml-4 md:ml-16">
          {clauses.map((clause, index) => (
            <motion.div
              key={clause.id}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.15 }}
              whileHover={{ x: 10, transition: { duration: 0.2 } }}
              className="bg-neutral-900/50 border border-neutral-800 hover:border-rose-500/50 p-6 relative overflow-hidden group transition-colors"
            >
              {/* Animated background scanline on hover */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 group-hover:-translate-y-full group-hover:animate-[scan_2s_linear_infinite]" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-semibold">{clause.title}</h3>
                  <span className="text-xs text-rose-500/70 bg-rose-500/10 px-2 py-1 rounded">
                    {clause.id}
                  </span>
                </div>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  {clause.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 ml-4 md:ml-16 p-4 border-l-2 border-neutral-700 text-sm text-neutral-500"
        >
          > To initiate a support ticket regarding a defective asset, transmit logs and purchase ID to support@yourdomain.com.
        </motion.div>
      </div>
    </div>
  );
}