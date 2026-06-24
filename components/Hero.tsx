'use client';

import { motion, Variants } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Hero() {
  // Framer Motion variants for staggered revealing
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.4 }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const router = useRouter();
  return (
    <section className="relative w-full h-screen bg-black overflow-hidden flex flex-col justify-center px-6 md:px-12">
      {/* Cyberpunk Grid Background */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)', backgroundSize: '4rem 4rem' }} 
      />
      
      {/* Subtle glowing orb for depth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neutral-800 rounded-full blur-[120px] opacity-30 pointer-events-none" />

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-7xl mx-auto w-full"
      >
        {/* Technical Data Readout (Cyberpunk Accent) */}
        <motion.div variants={item} className="flex gap-4 mb-6 font-mono text-[10px] md:text-xs text-neutral-500 uppercase tracking-widest">
          <span>V_1.0.0</span>
          <span>//</span>
          <span>LAT: 6.5244° N</span>
          <span>//</span>
          <span>STATUS: ONLINE</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1 variants={item} className="text-6xl md:text-[9rem] leading-[0.85] font-bold text-white tracking-tighter uppercase">
          Precision <br />
          <span className="text-transparent border-text-white" style={{ WebkitTextStroke: '2px white' }}>
            Engineered.
          </span>
        </motion.h1>

        {/* Subcopy & CTA */}
        <div className="mt-12 flex flex-col md:flex-row gap-8 justify-between items-start md:items-end w-full">
          <motion.p variants={item} className="text-neutral-400 max-w-md text-sm md:text-base font-light leading-relaxed">
            Redefining the boundary between hardware and digital architecture. 
            Built for those who demand absolute control and premium execution.
          </motion.p>
          
          <motion.div variants={item} className="flex gap-4 border border-neutral-800 p-2">
             <button className="bg-white text-black px-8 py-3 font-mono text-xs uppercase hover:bg-neutral-200 transition-colors" onClick={() => router.push('/catalog')}>
               Explore Core
             </button>
             <button className="bg-transparent text-white border border-neutral-700 px-8 py-3 font-mono text-xs uppercase hover:bg-neutral-800 transition-colors">
               Documentation
             </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-6 md:left-12 flex items-center gap-4 text-white font-mono text-[10px] uppercase tracking-widest"
      >
        <span className="w-12 h-[1px] bg-white block" />
        Scroll to initiate
      </motion.div>
    </section>
  );
}