'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { TerminalSquare, ShieldAlert, Network, Code2 } from 'lucide-react';

export default function SystemFooter() {
  const footerRef = useRef<HTMLElement>(null);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  
  // --- Massive Parallax Text Physics ---
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"]
  });

  // The text moves UP and scales DOWN slightly as you scroll down to it
  const textY = useTransform(scrollYProgress, [0, 1], [150, 0]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.2, 1]);

  // --- Terminal Typewriter Effect ---
  const fullLog = [
    "INITIATING SYSTEM SHUTDOWN...",
    "FLUSHING CACHE DIRECTORIES [OK]",
    "TERMINATING SECURE SOCKETS [OK]",
    "DISCONNECTING FROM NODE: W_AFRICA_01 [LAT: 7.2507° N, LON: 5.2069° E]",
    "AWAITING MANUAL REBOOT."
  ];

  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < fullLog.length) {
        setTerminalLines(prev => [...prev, fullLog[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
      }
    }, 800); // Types a new line every 800ms

    return () => clearInterval(interval);
  }, []);

  // --- Fade-in Variants for UI Elements ---
  const containerVariants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <footer 
      ref={footerRef} 
      className="relative w-full h-[80vh] min-h-[600px] bg-black text-white overflow-hidden flex flex-col justify-between border-t border-neutral-900"
    >
      {/* 1. TOP SECTION: Grid & Minimal Links */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.2 }}
        className="w-full max-w-7xl mx-auto px-6 md:px-12 pt-24 grid grid-cols-1 md:grid-cols-12 gap-12 z-10"
      >
        {/* Left Col: Brand & Security */}
        <motion.div variants={itemVariants} className="md:col-span-4 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center gap-2 font-bold text-xl tracking-tighter uppercase mb-6">
              <span className="w-3 h-3 bg-white block" />
              SYSTEM.CORE
            </div>
            <p className="text-neutral-500 font-light text-sm leading-relaxed max-w-xs">
              Elite digital infrastructure. Built for architects who demand absolute control over their codebase.
            </p>
          </div>
          
          <div className="mt-12 flex items-center gap-3 text-[10px] font-mono text-neutral-600 uppercase tracking-widest">
            <ShieldAlert size={14} className="text-emerald-500" />
            End-to-End Encrypted
          </div>
        </motion.div>

        {/* Center Col: Essential Links Only */}
        <motion.div variants={itemVariants} className="md:col-span-4 flex flex-col gap-4 font-mono text-xs uppercase tracking-widest text-neutral-500">
          <span className="text-neutral-700 mb-2 block">Directory</span>
          <a href="#inventory" className="hover:text-white transition-colors flex items-center gap-2 group">
            <span className="w-1 h-1 bg-transparent group-hover:bg-white transition-colors" /> Components
          </a>
          <a href="#docs" className="hover:text-white transition-colors flex items-center gap-2 group">
            <span className="w-1 h-1 bg-transparent group-hover:bg-white transition-colors" /> Documentation
          </a>
          <a href="#license" className="hover:text-white transition-colors flex items-center gap-2 group">
            <span className="w-1 h-1 bg-transparent group-hover:bg-white transition-colors" /> Licensing
          </a>
          <a href="#terms" className="hover:text-white transition-colors flex items-center gap-2 group">
            <span className="w-1 h-1 bg-transparent group-hover:bg-white transition-colors" /> Terms of Protocol
          </a>
        </motion.div>

        {/* Right Col: The Server Terminal Log */}
        <motion.div variants={itemVariants} className="md:col-span-4 border border-neutral-900 bg-neutral-950 p-6 flex flex-col relative group">
          <div className="flex items-center gap-2 border-b border-neutral-900 pb-4 mb-4 text-neutral-600 font-mono text-[10px] uppercase">
            <TerminalSquare size={12} />
            Sys_Log // {new Date().getFullYear()}
          </div>
          
          <div className="font-mono text-[10px] text-neutral-500 space-y-2 flex-grow">
            {terminalLines.map((line, i) => (
              <p key={i} className={`${i === terminalLines.length - 1 ? 'text-white' : 'text-neutral-600'}`}>
                <span className="text-emerald-500 pr-2">{'>'}</span>{line}
              </p>
            ))}
            {/* Blinking Cursor */}
            <motion.span 
              animate={{ opacity: [1, 0] }} 
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              className="inline-block w-2 h-3 bg-white ml-1 align-middle"
            />
          </div>

          {/* Decorative Corner Accents */}
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-neutral-700 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-neutral-700 opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.div>
      </motion.div>

      {/* 2. BOTTOM SECTION: The Parallax Brand Stamp */}
      <div className="w-full flex-grow flex items-end justify-center overflow-hidden pointer-events-none z-0">
        <motion.h1 
        //   style={{ y: textY, opacity: textOpacity }}
          className="text-[15vw] leading-[0.75] font-bold tracking-tighter text-transparent uppercase whitespace-nowrap select-none"
          // Using CSS stroke for that hollow, ultra-modern look
          style={{ WebkitTextStroke: '1px rgba(255, 255, 255, 0.1)', ...{ y: textY, opacity: textOpacity } }}
        >
          SYSTEM.CORE
        </motion.h1>
      </div>

      {/* Absolute Bottom Strip */}
      <div className="absolute bottom-0 left-0 w-full px-6 md:px-12 py-4 flex justify-between items-center border-t border-neutral-900/50 text-[9px] font-mono text-neutral-600 uppercase tracking-widest z-10 bg-black/80 backdrop-blur">
        <span>© {new Date().getFullYear()} CORE ARCHITECTURE</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white transition-colors"><Code2 size={12} /></a>
          <a href="#" className="hover:text-white transition-colors"><Network size={12} /></a>
        </div>
      </div>
    </footer>
  );
}