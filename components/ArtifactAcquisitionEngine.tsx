'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring, Variants, AnimatePresence } from 'framer-motion';
import { Fingerprint, Crosshair, Cpu, Box, Database, Code2, Lock } from 'lucide-react';

export default function ArtifactAcquisitionEngine() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [scrambleText, setScrambleText] = useState('AWAITING_INPUT');

  // --- 3D Parallax Mouse Tracking Engine ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for high-end feel (bypassing stiff 1:1 tracking)
  const springConfig = { damping: 30, stiffness: 100, mass: 2 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Map mouse position to rotation axes
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-10, 10]);

  // Handle mouse movement across the section
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    // Normalize coordinates between -0.5 and 0.5
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
    setScrambleText('SYSTEM_STANDBY');
  };

  // --- Cyberpunk Micro-Animations ---
  const scanlineVariants: Variants = {
    animate: {
      y: ['0%', '100%', '0%'],
      opacity: [0, 0.5, 0],
      transition: { duration: 3, ease: 'linear', repeat: Infinity }
    }
  };

  // Exploded view variants for the digital asset layers
  const layerVariants: Variants = {
    hidden: (custom: number) => ({ opacity: 0, y: 0, scale: 0.9, rotateX: 0 }),
    show: (custom: number) => ({
      opacity: 1,
      y: custom * -40, // Stagger upwards
      scale: 1 - custom * 0.05, // Slight perspective scaling
      rotateX: 45, // Isometric tilt
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: custom * 0.1 }
    }),
    hover: (custom: number) => ({
      y: custom * -70, // Spread further on hover
      rotateX: 55,
      transition: { duration: 0.4, ease: 'easeOut' }
    })
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative py-40 px-6 md:px-12 w-full min-h-screen bg-black text-white flex items-center justify-center overflow-hidden border-t border-neutral-900 perspective-[2000px]"
    >
      {/* Background Dynamic Grid & Noise */}
      <div className="absolute inset-0 z-0 opacity-10" 
           style={{ backgroundImage: 'linear-gradient(to right, #222 1px, transparent 1px), linear-gradient(to bottom, #222 1px, transparent 1px)', backgroundSize: '2rem 2rem' }} 
      />
      
      {/* Crosshair that loosely follows mouse */}
      <motion.div 
        style={{ x: useTransform(smoothX, [-0.5, 0.5], [-100, 100]), y: useTransform(smoothY, [-0.5, 0.5], [-100, 100]) }}
        className="absolute z-0 opacity-20 pointer-events-none flex items-center justify-center w-[800px] h-[800px] border border-neutral-800 rounded-full"
      >
        <div className="w-[400px] h-[400px] border border-neutral-700 rounded-full flex items-center justify-center">
          <Crosshair size={400} strokeWidth={0.2} className="animate-[spin_60s_linear_infinite]" />
        </div>
      </motion.div>

      {/* Main 3D Container */}
      <motion.div 
        style={{ rotateX, rotateY }}
        className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center transform-gpu"
      >
        
        {/* LEFT COLUMN: HUD & Telemetry */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="border-l-2 border-emerald-500 pl-4 relative">
            <motion.div className="absolute top-0 left-0 w-2 h-2 bg-emerald-500 -translate-x-[5px]" animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }} />
            <h2 className="text-3xl font-bold uppercase tracking-tighter mb-2">Artifact <br/>Inspection</h2>
            <div className="font-mono text-xs text-emerald-500 bg-emerald-500/10 inline-block px-2 py-1 mb-4">
              STATUS: {isHovered ? 'ANALYZING_LAYERS' : 'SECURE'}
            </div>
            <p className="text-neutral-400 text-sm font-light leading-relaxed">
              Deconstruct premium architectures before deployment. Hover over the core node to initiate a deep-scan layer separation sequence.
            </p>
          </div>

          {/* Dynamic Data Readouts */}
          <div className="grid grid-cols-2 gap-4 font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
            <div className="border border-neutral-900 p-3 bg-neutral-950/50 backdrop-blur">
              <span className="block text-neutral-600 mb-1">Total Weight</span>
              <span className="text-white text-xs">2.4 MB</span>
            </div>
            <div className="border border-neutral-900 p-3 bg-neutral-950/50 backdrop-blur">
              <span className="block text-neutral-600 mb-1">Architecture</span>
              <span className="text-white text-xs">Next.js + Prisma</span>
            </div>
            <div className="border border-neutral-900 p-3 bg-neutral-950/50 backdrop-blur col-span-2 flex justify-between items-center">
              <span>Security Hash</span>
              <span className="text-white animate-pulse">{scrambleText}</span>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: The Exploded 3D Asset */}
        <div 
          className="lg:col-span-4 h-[500px] relative flex justify-center items-end pb-12 cursor-crosshair group"
          onMouseEnter={() => { setIsHovered(true); setScrambleText('0x8F9B...4A2C'); }}
          onMouseLeave={() => { setIsHovered(false); setScrambleText('SYSTEM_STANDBY'); }}
        >
          {/* Scanning Laser Effect */}
          <motion.div variants={scanlineVariants} animate="animate" className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-1 bg-emerald-500 shadow-[0_0_20px_2px_rgba(16,185,129,0.5)] z-50 pointer-events-none mix-blend-screen" />

          {/* Layer 3: Database / Logic */}
          <motion.div 
            custom={3} variants={layerVariants} initial="hidden" animate={isHovered ? "hover" : "show"}
            className="absolute bottom-12 w-64 h-64 border border-neutral-800 bg-black/80 backdrop-blur-md flex items-center justify-center transform-gpu shadow-2xl"
          >
            <Database size={48} className="text-neutral-700 opacity-50" strokeWidth={1} />
            <div className="absolute bottom-2 left-2 font-mono text-[9px] text-neutral-600">LAYER_03 // SCHEMA</div>
          </motion.div>

          {/* Layer 2: API / Middleware */}
          <motion.div 
            custom={2} variants={layerVariants} initial="hidden" animate={isHovered ? "hover" : "show"}
            className="absolute bottom-12 w-64 h-64 border border-neutral-700 bg-neutral-950/80 backdrop-blur-md flex items-center justify-center transform-gpu shadow-2xl"
          >
            <Code2 size={48} className="text-neutral-500 opacity-70" strokeWidth={1} />
            <div className="absolute bottom-2 left-2 font-mono text-[9px] text-neutral-500">LAYER_02 // LOGIC</div>
          </motion.div>

          {/* Layer 1: Front-End UI (Top Layer) */}
          <motion.div 
            custom={1} variants={layerVariants} initial="hidden" animate={isHovered ? "hover" : "show"}
            className="absolute bottom-12 w-64 h-64 border border-white bg-neutral-900 flex flex-col justify-between p-4 transform-gpu shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-colors group-hover:border-emerald-500 group-hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]"
          >
            <div className="flex justify-between items-center w-full">
              <Box size={16} className={isHovered ? 'text-emerald-500' : 'text-white'} />
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white block" />
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-600 block" />
              </div>
            </div>
            <div className="space-y-2 mt-4 w-full">
              <div className="h-2 w-3/4 bg-neutral-800 rounded-sm" />
              <div className="h-2 w-1/2 bg-neutral-800 rounded-sm" />
              <div className="h-16 w-full border border-neutral-800 mt-4 flex items-center justify-center">
                <Cpu size={24} className="text-neutral-600 animate-pulse" />
              </div>
            </div>
            <div className="absolute bottom-2 left-2 font-mono text-[9px] text-white">LAYER_01 // INTERFACE</div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: Action & Verification */}
        <div className="lg:col-span-4 flex flex-col items-end text-right gap-8">
          
          <div className="w-full max-w-xs border border-neutral-900 p-6 bg-black relative overflow-hidden group">
            {/* Subtle hover gradient inside the box */}
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <Lock size={16} className="text-neutral-600 mb-6" />
            <h3 className="text-xl font-mono uppercase tracking-tight mb-2">Acquisition Protocol</h3>
            <p className="text-neutral-500 text-xs font-light mb-8">
              Verify biometric intent to unlock the repository token and deploy this asset to your local environment.
            </p>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-white text-black py-4 flex items-center justify-center gap-3 font-mono text-xs uppercase tracking-widest hover:bg-neutral-200 transition-colors relative overflow-hidden"
            >
              <Fingerprint size={16} />
              Initiate Transfer
              {/* Button shine effect */}
              <motion.div 
                className="absolute top-0 left-0 w-full h-full bg-white/50"
                initial={{ x: '-100%', skewX: -20 }}
                whileHover={{ x: '200%' }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />
            </motion.button>
          </div>

          {/* Corner Bracket Accents */}
          <div className="relative w-full max-w-xs h-24 border border-neutral-900/50 flex items-center justify-center">
             <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-neutral-500" />
             <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-neutral-500" />
             <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-neutral-500" />
             <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-neutral-500" />
             
             <div className="font-mono text-[10px] text-neutral-600 uppercase tracking-[0.3em] flex flex-col items-center gap-1">
               <span>P R O C E S S I N G</span>
               <div className="flex gap-1">
                 <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1, delay: 0, repeat: Infinity }} className="w-1 h-1 bg-neutral-600 block" />
                 <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1, delay: 0.2, repeat: Infinity }} className="w-1 h-1 bg-neutral-600 block" />
                 <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1, delay: 0.4, repeat: Infinity }} className="w-1 h-1 bg-neutral-600 block" />
               </div>
             </div>
          </div>

        </div>

      </motion.div>
    </section>
  );
}