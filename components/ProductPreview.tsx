"use client";

import React from "react";
import Image from "next/image";

interface ProductPreviewProps {
  title?: string;
  category?: string;
  imageUrl?: string;
}

export default function ProductPreview({ 
  title = "Neon Genesis USDC Treasury", 
  category = "DIGITAL ASSET",
  imageUrl = "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop" 
}: ProductPreviewProps) {
  return (
    <div className="w-full max-w-md mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="group relative p-[1px] rounded-2xl overflow-hidden bg-gradient-to-b from-emerald-500/20 to-zinc-800/50 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
        
        {/* Inner Container */}
        <div className="relative bg-zinc-950 rounded-[15px] overflow-hidden">
          
          {/* Product Image Container */}
          <div className="relative aspect-video w-full p-3">
            <div className="relative w-full h-full rounded-lg overflow-hidden border border-white/5">
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
              />
              
              {/* The "Cyberpunk" Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              
              {/* Bottom Text Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] tracking-[0.2em] text-emerald-400 font-bold uppercase">
                    {category}
                  </span>
                  <h2 className="text-2xl font-semibold text-white tracking-tight">
                    {title}
                  </h2>
                </div>
              </div>

              {/* Decorative Corner Element */}
              <div className="absolute top-0 right-0 p-4">
                <div className="h-2 w-8 bg-emerald-500/50 blur-[1px] rotate-45 translate-x-4 -translate-y-2" />
              </div>
            </div>
          </div>

          {/* Subtle Bottom Glow Line */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
        </div>
      </div>
    </div>
  );
}