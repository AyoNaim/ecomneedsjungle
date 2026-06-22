'use client';

import { motion } from 'framer-motion';
import { AlignRight } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 w-full z-50 mix-blend-difference"
    >
      <div className="flex items-center justify-between px-6 py-6 md:px-12">
        {/* Brand / Logo */}
        <Link href="/" className="text-white font-bold text-xl tracking-tighter uppercase flex gap-2 items-center">
          <span className="w-3 h-3 bg-white block animate-pulse" />
          SYSTEM.CORE
        </Link>

        {/* Center Links - Hidden on Mobile */}
        <div className="hidden md:flex gap-8 text-neutral-400 font-mono text-xs uppercase tracking-widest">
          <Link href="#features" className="hover:text-white transition-colors">Architecture</Link>
          <Link href="#specs" className="hover:text-white transition-colors">Specs</Link>
          <Link href="#access" className="hover:text-white transition-colors">Access</Link>
        </div>

        {/* Action / Menu */}
        <div className="flex items-center gap-6">
          <button className="hidden md:block text-xs font-mono text-black bg-white px-5 py-2 uppercase tracking-widest hover:bg-neutral-300 transition-colors">
            Initialize
          </button>
          <button className="text-white hover:text-neutral-400 transition-colors">
            <AlignRight size={24} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </motion.nav>
  );
}