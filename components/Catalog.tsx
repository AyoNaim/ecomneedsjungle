"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Search, ChevronRight, Loader2, Cpu, Shield, Terminal } from "lucide-react";

// Define the exact shape of our incoming data
type Product = {
  id: string;
  title: string;
  description: string;
  priceUSD: number;
  previewUrl: string;
};

export default function CatalogPage() {
  const router = useRouter();
  const { data: session } = useSession();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 1. The Database Fetch
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Failed to fetch catalog:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  // 2. Real-time Search Engine
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 3. Cinematic Page Transition Handler
  const handleProductClick = (productId: string) => {
    setIsTransitioning(true);
    setTimeout(() => {
      router.push(`/checkout?product_id=${productId}`);
    }, 600);
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 relative flex flex-col">
      
      {/* BACKGROUND ELEMENTS: Grid & Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-500/5 blur-[150px]" />
      </div>

      {/* OVERLAY: Triggered on checkout click for dramatic exit */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-zinc-950 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* STICKY NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-zinc-950/70 backdrop-blur-2xl border-b border-white/5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xl font-bold tracking-tighter uppercase">
            <Terminal className="w-5 h-5 text-emerald-500" />
            System<span className="text-zinc-500">_Core</span>
          </div>
          
          {/* USER AVATAR WITH CYBERPUNK TOOLTIP */}
          {session?.user && (
            <div className="relative group cursor-pointer">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 group-hover:border-emerald-500/50 transition-colors duration-500 relative z-10">
                <img 
                  src={session.user.image || "./avatar.svg"} 
                  alt="User Avatar" 
                  width={40} 
                  height={40} 
                  className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
              
              {/* Stylish Name Reveal on Hover */}
              <div className="absolute right-0 top-14 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none z-20">
                <div className="bg-zinc-900/90 backdrop-blur-md border border-white/10 text-[10px] px-4 py-2 rounded-md tracking-widest uppercase whitespace-nowrap shadow-[0_0_20px_rgba(16,185,129,0.15)] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {session.user.name || "Authorized User"}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* HERO & SEARCH ENGINE */}
      <section className="pt-40 pb-12 px-6 max-w-7xl mx-auto w-full relative z-10 flex-grow-0">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="h-px w-8 bg-emerald-500" />
            <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-500">Database Connection Active</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 text-white drop-shadow-2xl">
            Digital <span className="text-zinc-700">Arsenal.</span>
          </h1>
          
          <div className="relative group mt-8">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-emerald-400 transition-colors z-10" />
            <input
              type="text"
              placeholder="Search components, blueprints, themes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900/40 backdrop-blur-sm border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-lg focus:outline-none focus:border-emerald-500/50 focus:bg-zinc-900/80 transition-all duration-500 placeholder:text-zinc-600 shadow-inner focus:shadow-[0_0_30px_rgba(16,185,129,0.1)] relative z-0"
            />
          </div>
        </motion.div>
      </section>

      {/* PRODUCT GRID */}
      <section className="px-6 pb-24 max-w-7xl mx-auto w-full relative z-10 flex-grow">
        {isLoading ? (
          <div className="w-full h-40 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="flex flex-col items-start mt-10 p-8 border border-white/5 rounded-2xl bg-zinc-900/20"
          >
            <span className="text-zinc-500 tracking-widest uppercase text-xs font-mono">
              ERR: No assets found matching protocol.
            </span>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
          >
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 20 } }
                }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                onClick={() => handleProductClick(product.id)}
                className="group relative bg-zinc-900/40 backdrop-blur-sm border border-white/5 hover:border-emerald-500/30 rounded-2xl overflow-hidden cursor-pointer flex flex-col transition-all duration-500 hover:shadow-[0_10px_40px_-10px_rgba(16,185,129,0.15)]"
              >
                {/* Image Container with Hover Scale */}
                <div className="h-48 overflow-hidden relative bg-zinc-950 p-2">
                  <div className="w-full h-full relative rounded-xl overflow-hidden border border-white/5 group-hover:border-white/10 transition-colors">
                    <img 
                      src={product.previewUrl || "https://placehold.co/600x400/18181b/e4e4e7?text=NO+IMAGE"}
                      alt={product.title}
                      className="object-cover w-full h-full grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-in-out"
                    />
                    {/* Subtle Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent opacity-90" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between relative z-10 -mt-10">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-emerald-100 transition-colors">
                        {product.title}
                      </h3>
                    </div>
                    <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed font-light">
                      {product.description}
                    </p>
                  </div>
                  
                  <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4 group-hover:border-emerald-500/20 transition-colors">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-mono mb-1">Value</span>
                      <span className="text-lg font-mono font-bold tracking-tighter text-zinc-300 group-hover:text-white transition-colors">
                        ${Number(product.priceUSD).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-zinc-500 group-hover:text-emerald-400 transition-colors">
                      Acquire <ChevronRight className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* MINIMALIST PREMIUM FOOTER */}
      <footer className="w-full border-t border-white/5 bg-zinc-950/80 backdrop-blur-xl relative z-20 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-widest font-mono text-zinc-600">
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Cpu className="w-3 h-3 text-emerald-500/70" /> 
              <span>System_Core v2.4.1</span>
            </div>
            <div className="hidden md:block w-px h-3 bg-white/10" />
            <div className="flex items-center gap-2">
              <Shield className="w-3 h-3 text-zinc-500" /> 
              <span>SSL Encrypted</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <span>Lat: 6.5244° N | Lon: 3.3792° E</span>
            <div className="hidden md:block w-px h-3 bg-white/10" />
            <span>© {new Date().getFullYear()} Digital Arsenal</span>
          </div>

        </div>
      </footer>

    </main>
  );
}