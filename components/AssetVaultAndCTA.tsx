'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Terminal, Cpu, Layers, ExternalLink, ArrowRight } from 'lucide-react';

// Mock data reflecting premium assets
const ASSETS = [
  {
    id: '01',
    title: 'Figma to React UI Kit',
    category: 'REACT / TAILWIND',
    price: '$99.00',
    description: 'A collection of 150+ premium, accessible React components matched with a system-level Figma file.',
    metric: 'BNDL // 4.8MB'
  },
  {
    id: '02',
    title: 'Matrix WordPress Theme',
    category: 'WP / HEADLESS',
    price: '$149.00',
    description: 'An ultra-minimalist, decoupled WordPress theme built natively for high-performance content delivery.',
    metric: 'CMS // v4.2.1'
  },
  {
    id: '03',
    title: 'Velocity Next.js Boilerplate',
    category: 'NEXT.JS / TS',
    price: '$79.00',
    description: 'Production-ready architecture integrated with Supabase, Prisma, Auth.js, and Stripe optimization.',
    metric: 'REPOS // 0.8MS'
  }
];

// Scroll reveal variants for progressive cascading entry
const sectionVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const cardVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 60,
    skewY: 2
  },
  show: { 
    opacity: 1, 
    y: 0, 
    skewY: 0,
    transition: { 
      duration: 0.8, 
      ease: [0.16, 1, 0.3, 1] 
    } 
  }
};

export default function AssetVaultAndCTA() {
  return (
    <div className="bg-black text-white selection:bg-white selection:text-black">
      
      {/* SECTION 1: THE PRODUCT VAULT */}
      <section id="inventory" className="py-32 px-6 md:px-12 max-w-7xl mx-auto border-t border-neutral-900">
        
        {/* Dynamic Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-6">
          <div>
            <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest block mb-3">// ARCHIVE.01</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase">
              Premium <br />Deployments
            </h2>
          </div>
          <p className="text-neutral-400 font-light max-w-sm text-sm leading-relaxed">
            Fully typed, ultra-optimized blocks and frameworks engineered to bypass days of configuration overhead.
          </p>
        </div>

        {/* Staggered Grid Interface */}
        <motion.div 
          variants={sectionVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {ASSETS.map((asset) => (
            <motion.div 
              key={asset.id}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group relative border border-neutral-800 bg-neutral-950 p-6 flex flex-col justify-between h-[420px] transition-colors hover:border-neutral-500"
            >
              <div>
                {/* Structural Top-line Info */}
                <div className="flex justify-between items-center font-mono text-[11px] text-neutral-500 mb-8">
                  <span>[{asset.id}] {asset.category}</span>
                  <span>{asset.metric}</span>
                </div>

                {/* Title & Cost */}
                <h3 className="text-2xl font-semibold tracking-tight uppercase group-hover:text-neutral-300 transition-colors">
                  {asset.title}
                </h3>
                <div className="text-xl font-mono mt-2 text-neutral-400">
                  {asset.price}
                </div>

                <p className="mt-6 text-neutral-500 text-xs leading-relaxed font-light">
                  {asset.description}
                </p>
              </div>

              {/* Card Functional Footer Accent */}
              <div className="pt-6 border-t border-neutral-900 flex justify-between items-center">
                <span className="font-mono text-[10px] text-neutral-600 uppercase tracking-wider group-hover:text-white transition-colors">
                  View Specifications
                </span>
                <div className="w-8 h-8 rounded-full border border-neutral-800 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                  <ExternalLink size={14} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* SECTION 2: THE TERMINAL MATRIX CTA */}
      <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto border-t border-neutral-900 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-neutral-950 border border-neutral-800 p-8 md:p-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          {/* Subtle decorative background noise line */}
          <div className="absolute right-0 top-0 w-1/2 h-full border-l border-neutral-900/50 pointer-events-none hidden md:block" />

          {/* Left Block: Value Proposition */}
          <div>
            <div className="inline-flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-6">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
              Direct Access Protocol
            </div>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase mb-6">
              Elevate Your <br />Development Standard
            </h3>
            <p className="text-neutral-400 font-light text-sm leading-relaxed mb-8 max-w-md">
              Gain unrestricted entry to the absolute highest-tier production ecosystems. Download instantly, build dynamically, and ship with extreme velocity.
            </p>
            
            <motion.button 
              whileHover={{ x: 4 }}
              className="flex items-center gap-3 bg-white text-black px-8 py-4 font-mono text-xs uppercase tracking-widest hover:bg-neutral-200 transition-colors"
            >
              Acquire Membership License <ArrowRight size={14} />
            </motion.button>
          </div>

          {/* Right Block: Simulated Compiling System Terminal */}
          <div className="bg-black border border-neutral-900 p-6 font-mono text-[11px] text-neutral-500 h-[280px] flex flex-col justify-between rounded shadow-2xl relative">
            <div className="space-y-2 select-none overflow-hidden">
              <div className="flex justify-between text-neutral-600 border-b border-neutral-900 pb-2 mb-3">
                <span>TERMINAL v2.0x6</span>
                <span>STATUS: SECURE</span>
              </div>
              <p className="text-neutral-400 flex gap-2"><span className="text-neutral-600">&gt;</span> npm i @system-core/components</p>
              <p className="text-neutral-600 animate-pulse">Fetching packages from secure serverless ledger...</p>
              <p className="text-emerald-500/80 flex gap-2"><span>✔</span> verified: sha256-f83k1m99_core_react.tar</p>
              <p className="text-neutral-400 flex gap-2"><span className="text-neutral-600">&gt;</span> processing build parameters...</p>
              <p className="text-neutral-600">Optimizing styles with Tailwind Engine v4...</p>
            </div>

            {/* Bottom System Metrics Row */}
            <div className="pt-4 border-t border-neutral-900 flex justify-between text-[10px] text-neutral-600">
              <span className="flex items-center gap-1"><Terminal size={10} /> core_node_active</span>
              <span className="flex items-center gap-1"><Cpu size={10} /> latency: 0.04ms</span>
              <span className="flex items-center gap-1"><Layers size={10} /> dynamic_ui</span>
            </div>
          </div>

        </motion.div>
      </section>

    </div>
  );
}