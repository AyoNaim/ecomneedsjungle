'use client';

import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { 
  Terminal, Cpu, Users, Layers, ShieldCheck, 
  Infinity as InfinityIcon, Zap, GitBranch, Command, CheckCircle2 
} from 'lucide-react';

// Animation configurations for bidirectional viewport entry
const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 }
  }
};

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  }
};

const lineDrawVariants: Variants = {
  hidden: { scaleX: 0 },
  show: { 
    scaleX: 1, 
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } 
  }
};

export default function EcosystemMatrix() {
  const [activeNode, setActiveNode] = useState<'cli' | 'types' | 'registry'>('cli');

  return (
    <div className="bg-black text-white relative border-t border-neutral-900 overflow-hidden">
      
      {/* GLOBAL BACKGROUND ACCENT GRID */}
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
      />

      {/* PHASE 1: THE TARGET CLIENT MATRIX */}
      <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.1 }}
          className="mb-20"
        >
          <motion.span variants={fadeUpVariants} className="font-mono text-xs text-neutral-500 uppercase tracking-widest block mb-3">
            // PROTOCOL.02 / COHORT SEGMENTATION
          </motion.span>
          <motion.h2 variants={fadeUpVariants} className="text-4xl md:text-7xl font-bold tracking-tighter uppercase max-w-4xl">
            Engineered For The <br />
            <span className="text-transparent border-text-white" style={{ WebkitTextStroke: '1px white' }}>
              Architects of Web Space.
            </span>
          </motion.h2>
        </motion.div>

        {/* Asymmetric Client Columns */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.15 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
        >
          {/* Clientele 1: Independent Developers */}
          <motion.div variants={fadeUpVariants} className="border border-neutral-900 bg-neutral-950/40 backdrop-blur-sm p-8 h-[400px] flex flex-col justify-between group hover:border-neutral-700 transition-colors">
            <div>
              <div className="w-10 h-10 border border-neutral-800 flex items-center justify-center mb-8 text-neutral-400 group-hover:text-white transition-colors">
                <Terminal size={18} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-mono tracking-tight text-neutral-300 group-hover:text-white mb-4">// SOLO OPERATORS</h3>
              <p className="text-neutral-500 text-sm font-light leading-relaxed group-hover:text-neutral-400 transition-colors">
                Independent developers aiming to scale production speed. Skip boilerplate construction entirely and deploy clean, optimized source architectures instantly.
              </p>
            </div>
            <div className="font-mono text-[10px] text-neutral-600 tracking-widest">
              [ ACCESS_LEVEL: LEVEL_01 ]
            </div>
          </motion.div>

          {/* Clientele 2: Elite Design Agencies (Shifted downwards slightly on desktop for premium asymmetry) */}
          <motion.div variants={fadeUpVariants} className="border border-neutral-900 bg-neutral-950/40 backdrop-blur-sm p-8 h-[400px] flex flex-col justify-between lg:mt-12 group hover:border-neutral-700 transition-colors">
            <div>
              <div className="w-10 h-10 border border-neutral-800 flex items-center justify-center mb-8 text-neutral-400 group-hover:text-white transition-colors">
                <Layers size={18} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-mono tracking-tight text-neutral-300 group-hover:text-white mb-4">// AVANT-GARDE AGENCIES</h3>
              <p className="text-neutral-500 text-sm font-light leading-relaxed group-hover:text-neutral-400 transition-colors">
                Design-driven development studios requiring highly animated layouts, pixel-perfect layout compliance, and zero structural compromises.
              </p>
            </div>
            <div className="font-mono text-[10px] text-neutral-600 tracking-widest">
              [ ACCESS_LEVEL: LEVEL_02 ]
            </div>
          </motion.div>

          {/* Clientele 3: Enterprise Teams */}
          <motion.div variants={fadeUpVariants} className="border border-neutral-900 bg-neutral-950/40 backdrop-blur-sm p-8 h-[400px] flex flex-col justify-between group hover:border-neutral-700 transition-colors">
            <div>
              <div className="w-10 h-10 border border-neutral-800 flex items-center justify-center mb-8 text-neutral-400 group-hover:text-white transition-colors">
                <Users size={18} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-mono tracking-tight text-neutral-300 group-hover:text-white mb-4">// ENTERPRISE SQUADS</h3>
              <p className="text-neutral-500 text-sm font-light leading-relaxed group-hover:text-neutral-400 transition-colors">
                Corporate engineering divisions looking for strict compliance, clean monorepo integrations, rigorous security signatures, and comprehensive asset scalability.
              </p>
            </div>
            <div className="font-mono text-[10px] text-neutral-600 tracking-widest">
              [ ACCESS_LEVEL: LEVEL_03 ]
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* HORIZONTAL STRUCTURAL DIVIDER LINE ANIMATION */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div 
          variants={lineDrawVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false }}
          className="h-[1px] bg-neutral-900 w-full origin-left"
        />
      </div>

      {/* PHASE 2: EXTENDED CAPABILITIES (ADDITIONAL SERVICES) */}
      <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Sticky Header Node */}
          <div className="lg:sticky lg:top-32">
            <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest block mb-3">// MATRIX PROTOCOLS</span>
            <h3 className="text-4xl font-bold tracking-tighter uppercase mb-6">
              Beyond Isolated <br />Asset Acquisition.
            </h3>
            <p className="text-neutral-400 font-light text-sm leading-relaxed max-w-md mb-8">
              We do not just hand over a zipped folder and disappear. We act as an auxiliary infrastructure engine for elite engineering ecosystems, offering customized integration structures.
            </p>
            
            <div className="border border-neutral-900 p-4 font-mono text-[11px] text-neutral-500 inline-flex items-center gap-3">
              <ShieldCheck size={14} className="text-emerald-500" /> All assets feature dedicated origin signatures
            </div>
          </div>

          {/* Core Service Verticals List */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.1 }}
            className="space-y-12"
          >
            {/* Service Step 1 */}
            <motion.div variants={fadeUpVariants} className="flex gap-6 items-start pb-8 border-b border-neutral-900 group">
              <span className="font-mono text-sm text-neutral-700 group-hover:text-white transition-colors pt-1">01//</span>
              <div>
                <h4 className="text-lg font-semibold uppercase tracking-tight mb-2 group-hover:text-neutral-200 transition-colors">
                  Custom Platform Refactoring
                </h4>
                <p className="text-neutral-500 text-xs leading-relaxed font-light">
                  Need a premium theme or UI kit adapted into a specialized headless architecture? Our elite internal engineering squad refactors any purchased asset to map explicitly onto your proprietary technical stack.
                </p>
              </div>
            </motion.div>

            {/* Service Step 2 */}
            <motion.div variants={fadeUpVariants} className="flex gap-6 items-start pb-8 border-b border-neutral-900 group">
              <span className="font-mono text-sm text-neutral-700 group-hover:text-white transition-colors pt-1">02//</span>
              <div>
                <h4 className="text-lg font-semibold uppercase tracking-tight mb-2 group-hover:text-neutral-200 transition-colors">
                  Private Registry & Monorepo Synchronization
                </h4>
                <p className="text-neutral-500 text-xs leading-relaxed font-light">
                  Avoid copy-pasting code files entirely. Enterprise license holders gain direct token configurations to our private NPM/GitHub package registry for clean dependency updates tracking directly inside your monorepo workspace.
                </p>
              </div>
            </motion.div>

            {/* Service Step 3 */}
            <motion.div variants={fadeUpVariants} className="flex gap-6 items-start group">
              <span className="font-mono text-sm text-neutral-700 group-hover:text-white transition-colors pt-1">03//</span>
              <div>
                <h4 className="text-lg font-semibold uppercase tracking-tight mb-2 group-hover:text-neutral-200 transition-colors">
                  Automated Security Verification & Escrow
                </h4>
                <p className="text-neutral-500 text-xs leading-relaxed font-light">
                  Every asset file line is cryptographically audited. We support strict codebase escrow compliance and verify dependency integrity pipelines to ensure zero production supply chain attack surfaces.
                </p>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* HORIZONTAL STRUCTURAL DIVIDER LINE ANIMATION */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div 
          variants={lineDrawVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false }}
          className="h-[1px] bg-neutral-900 w-full origin-left"
        />
      </div>

      {/* PHASE 3: INTERACTIVE DEV CONTROL HUB */}
      <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest block mb-3">// OPERATIONAL EFFICIENCY</span>
          <h3 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase">
            Dev-Centric Code Hygiene
          </h3>
        </div>

        {/* Interactive Workspace Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Controls - Left Side (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col justify-center gap-3">
            <button 
              onClick={() => setActiveNode('cli')}
              className={`w-full text-left p-4 font-mono text-xs uppercase tracking-wider flex items-center justify-between border transition-all ${activeNode === 'cli' ? 'bg-white text-black border-white' : 'bg-neutral-950 text-neutral-500 border-neutral-900 hover:border-neutral-800'}`}
            >
              <span className="flex items-center gap-3"><Command size={14} /> 1. Dedicated System CLI</span>
              {activeNode === 'cli' && <span className="w-1.5 h-1.5 bg-black rounded-full" />}
            </button>

            <button 
              onClick={() => setActiveNode('types')}
              className={`w-full text-left p-4 font-mono text-xs uppercase tracking-wider flex items-center justify-between border transition-all ${activeNode === 'types' ? 'bg-white text-black border-white' : 'bg-neutral-950 text-neutral-500 border-neutral-900 hover:border-neutral-800'}`}
            >
              <span className="flex items-center gap-3"><Cpu size={14} /> 2. Complete TS Typings</span>
              {activeNode === 'types' && <span className="w-1.5 h-1.5 bg-black rounded-full" />}
            </button>

            <button 
              onClick={() => setActiveNode('registry')}
              className={`w-full text-left p-4 font-mono text-xs uppercase tracking-wider flex items-center justify-between border transition-all ${activeNode === 'registry' ? 'bg-white text-black border-white' : 'bg-neutral-950 text-neutral-500 border-neutral-900 hover:border-neutral-800'}`}
            >
              <span className="flex items-center gap-3"><GitBranch size={14} /> 3. Ecosystem Syncing</span>
              {activeNode === 'registry' && <span className="w-1.5 h-1.5 bg-black rounded-full" />}
            </button>
          </div>

          {/* Screen Readout - Right Side (8 Cols) */}
          <div className="lg:col-span-8 bg-neutral-950 border border-neutral-900 p-6 min-h-[340px] flex flex-col justify-between relative">
            
            {/* Top Bar Decorator */}
            <div className="flex justify-between items-center border-b border-neutral-900 pb-4 mb-6 font-mono text-[10px] text-neutral-600">
              <span>NODE_VIEWER // ENV_PRODUCTION</span>
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-neutral-800 block" />
                <span className="w-2 h-2 rounded-full bg-neutral-800 block" />
                <span className="w-2 h-2 rounded-full bg-neutral-800 block" />
              </div>
            </div>

            {/* Dynamic Content Mapping */}
            <div className="flex-grow font-mono text-xs text-neutral-400 space-y-4">
              {activeNode === 'cli' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                  <p className="text-neutral-600">// Initialize components effortlessly via our custom interface terminal</p>
                  <p className="text-white"><span className="text-neutral-600">$</span> npx core-asset-sync@latest init</p>
                  <p className="text-neutral-500">▶ Authenticating production license hash...</p>
                  <p className="text-emerald-500">✔ Connection verified successfully.</p>
                  <p className="text-white"><span className="text-neutral-600">$</span> npx core-asset-sync add template-matrix</p>
                  <p className="text-neutral-500">📥 Downloading structural components into /app/components/matrix...</p>
                </motion.div>
              )}

              {activeNode === 'types' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                  <p className="text-neutral-600">// 100% strict type assertions across every layout block</p>
                  <p><span className="text-purple-400">export interface</span> <span className="text-blue-400">CoreLayoutProps</span> &#123;</p>
                  <p className="pl-4">themeSignature: <span className="text-amber-400">'cyber' | 'minimal' | 'stark'</span>;</p>
                  <p className="pl-4">biometricAuthRequired: <span className="text-green-400">boolean</span>;</p>
                  <p className="pl-4">databaseOrchestrator: <span className="text-blue-400">PrismaClient</span>;</p>
                  <p>&#125;</p>
                  <p className="text-emerald-500/80 mt-4">// Zero runtime typings exceptions. Pure intellisense security.</p>
                </motion.div>
              )}

              {activeNode === 'registry' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                  <p className="text-neutral-600">// Real-time architectural hooks linked with modern infrastructure</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="border border-neutral-900 p-3 bg-black">
                      <span className="text-[10px] text-neutral-500 block mb-1">DATA LAYER</span>
                      <p className="text-white text-xs font-semibold flex items-center gap-2"><CheckCircle2 size={12} className="text-emerald-400" /> Prisma Native Schema</p>
                    </div>
                    <div className="border border-neutral-900 p-3 bg-black">
                      <span className="text-[10px] text-neutral-500 block mb-1">INFRASTRUCTURE</span>
                      <p className="text-white text-xs font-semibold flex items-center gap-2"><CheckCircle2 size={12} className="text-emerald-400" /> Supabase Integrations</p>
                    </div>
                    <div className="border border-neutral-900 p-3 bg-black">
                      <span className="text-[10px] text-neutral-500 block mb-1">AUTHENTICATION</span>
                      <p className="text-white text-xs font-semibold flex items-center gap-2"><CheckCircle2 size={12} className="text-emerald-400" /> Auth.js Core Ready</p>
                    </div>
                    <div className="border border-neutral-900 p-3 bg-black">
                      <span className="text-[10px] text-neutral-500 block mb-1">MONOREPOS</span>
                      <p className="text-white text-xs font-semibold flex items-center gap-2"><CheckCircle2 size={12} className="text-emerald-400" /> Turborepo Workspace Compliant</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Bottom Panel Status Footer */}
            <div className="pt-4 border-t border-neutral-900 flex justify-between items-center text-[10px] text-neutral-600 font-mono">
              <span className="flex items-center gap-1.5"><Zap size={10} className="text-amber-500" /> core_engine_active</span>
              <span>COMPILATION: 0ms MISMATCH</span>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}