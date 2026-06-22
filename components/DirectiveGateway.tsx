'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, Variants } from 'framer-motion';
import { Activity, Globe, Zap, ArrowUpRight } from 'lucide-react';

export default function DirectiveGateway() {
  const [scrambleText, setScrambleText] = useState('INITIATE_FINAL_SEQUENCE');
  const buttonRef = useRef<HTMLButtonElement>(null);

  // --- Magnetic Button Physics ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Springs for the magnetic pull (smooth return to center)
  const springX = useSpring(mouseX, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = buttonRef.current.getBoundingClientRect();
    
    // Calculate distance from center of the button
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    
    // Set the pull strength (0.3 = 30% pull toward mouse)
    mouseX.set(x * 0.3);
    mouseY.set(y * 0.3);
  };

  const handleMouseLeave = () => {
    // Snap back to center
    mouseX.set(0);
    mouseY.set(0);
  };

  // --- Scramble Text Effect on Hover ---
  const handleTextHover = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';
    let iterations = 0;
    const interval = setInterval(() => {
      setScrambleText((prev) => 
        prev.split('').map((letter, index) => {
          if (index < iterations) return 'INITIATE_FINAL_SEQUENCE'[index];
          return characters[Math.floor(Math.random() * characters.length)];
        }).join('')
      );
      if (iterations >= 'INITIATE_FINAL_SEQUENCE'.length) clearInterval(interval);
      iterations += 1;
    }, 30);
  };

  // --- Reveal Animations ---
  const containerVariants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.2 } }
  };

  const fadeUpVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section className="relative w-full bg-black text-white overflow-hidden border-t border-neutral-900 flex flex-col justify-between pt-24 pb-32">
      
      {/* 1. INFINITE TELEMETRY TICKER (Top Border) */}
      <div className="absolute top-0 left-0 w-full border-b border-neutral-900 bg-black py-2 overflow-hidden flex">
        <motion.div 
          className="flex whitespace-nowrap gap-12 font-mono text-[10px] text-neutral-600 uppercase tracking-widest"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 20, ease: 'linear', repeat: Infinity }}
        >
          {/* Duplicate content to create seamless loop */}
          {[...Array(4)].map((_, i) => (
            <React.Fragment key={i}>
              <span className="flex items-center gap-2"><Globe size={12} /> GLOBAL_NODES_ONLINE: 4,892</span>
              <span>//</span>
              <span className="flex items-center gap-2"><Activity size={12} className="text-emerald-500" /> AVG_LATENCY: 12MS</span>
              <span>//</span>
              <span className="flex items-center gap-2"><Zap size={12} className="text-amber-500" /> INFRASTRUCTURE: STABLE</span>
              <span>//</span>
            </React.Fragment>
          ))}
        </motion.div>
      </div>

      {/* 2. MAIN MANIFESTO CONTENT */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.4 }}
        className="max-w-7xl mx-auto px-6 md:px-12 w-full mt-12 text-center flex flex-col items-center"
      >
        <motion.div variants={fadeUpVariants} className="w-12 h-12 border border-neutral-800 flex items-center justify-center mb-12">
          <div className="w-2 h-2 bg-white animate-pulse" />
        </motion.div>

        <motion.h2 
          variants={fadeUpVariants} 
          className="text-5xl md:text-8xl font-bold tracking-tighter uppercase leading-[0.85] mb-8"
        >
          Do Not <br />
          <span className="text-transparent border-text-white" style={{ WebkitTextStroke: '1px white' }}>
            Compromise.
          </span>
        </motion.h2>

        <motion.p variants={fadeUpVariants} className="text-neutral-400 font-light max-w-lg text-sm md:text-base leading-relaxed mb-16">
          You are building the future of the web. Stop wasting cycles on boilerplate and generic UI libraries. Deploy our architecture, execute with precision, and dominate your market.
        </motion.p>

        {/* 3. MAGNETIC CALL-TO-ACTION BUTTON */}
        <motion.div variants={fadeUpVariants} className="relative p-8">
          {/* Outer radar ring */}
          <div className="absolute inset-0 border border-neutral-800 rounded-full animate-[spin_10s_linear_infinite] opacity-20 pointer-events-none" 
               style={{ borderTopColor: 'transparent', borderRightColor: 'transparent' }} 
          />
          
          <motion.button
            ref={buttonRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleTextHover}
            style={{ x: springX, y: springY }}
            className="group relative bg-white text-black w-48 h-48 rounded-full flex flex-col items-center justify-center gap-2 uppercase tracking-widest font-mono text-[10px] hover:bg-neutral-200 transition-colors z-10 shadow-[0_0_40px_rgba(255,255,255,0.1)]"
          >
            <ArrowUpRight size={24} strokeWidth={1} className="group-hover:rotate-45 transition-transform duration-500" />
            <span className="mt-2 text-center w-[120px] leading-tight font-semibold">
              {scrambleText}
            </span>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* 4. BOTTOM CORNER DECORATORS */}
      <div className="absolute bottom-6 left-6 font-mono text-[10px] text-neutral-600 tracking-widest uppercase">
        SEC_LVL_09
      </div>
      <div className="absolute bottom-6 right-6 flex gap-1">
        <span className="w-8 h-[1px] bg-neutral-600 block" />
        <span className="w-2 h-[1px] bg-neutral-600 block" />
        <span className="w-1 h-[1px] bg-neutral-600 block" />
      </div>

    </section>
  );
}