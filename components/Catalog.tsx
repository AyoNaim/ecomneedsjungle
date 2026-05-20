"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Search, ChevronRight, Loader2 } from "lucide-react";
import Image from "next/image";

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
    setIsTransitioning(true); // Triggers the exit animation layer
    setTimeout(() => {
      router.push(`/checkout?product_id=${productId}`);
    }, 600); // Wait for animation to finish before routing
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-zinc-800">
      
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
      <header className="fixed top-0 left-0 right-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tighter uppercase">
            System<span className="text-zinc-500">_Core</span>
          </div>
          
          {/* USER AVATAR WITH CYBERPUNK TOOLTIP */}
          {session?.user && (
            <div className="relative group cursor-pointer">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 group-hover:border-white/40 transition-colors duration-500">
                <img
                  src={session.user.image || "./avatar.svg"} 
                  alt="User Avatar" 
                  width={40} 
                  height={40} 
                  className="object-cover"
                />
              </div>
              
              {/* Stylish Name Reveal on Hover */}
              <div className="absolute right-0 top-14 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
                <div className="bg-zinc-900 border border-white/10 text-xs px-4 py-2 rounded-md tracking-widest uppercase whitespace-nowrap shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                  {session.user.name || "Authorized User"}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* HERO & SEARCH ENGINE */}
      <section className="pt-40 pb-12 px-6 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
            Digital <span className="text-zinc-600">Arsenal.</span>
          </h1>
          
          <div className="relative group mt-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-white transition-colors" />
            <input
              type="text"
              placeholder="Search components, blueprints, themes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-4 pl-12 pr-6 text-lg focus:outline-none focus:border-white/30 focus:bg-zinc-900 transition-all duration-500 placeholder:text-zinc-600 shadow-[0_0_0_rgba(255,255,255,0)] focus:shadow-[0_0_30px_rgba(255,255,255,0.03)]"
            />
          </div>
        </motion.div>
      </section>

      {/* PRODUCT GRID */}
      <section className="px-6 pb-32 max-w-7xl mx-auto min-h-[50vh]">
        {isLoading ? (
          <div className="w-full h-40 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-zinc-600 animate-spin" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-zinc-500 tracking-widest uppercase text-sm mt-10"
          >
            No assets found matching your criteria.
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
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
                }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                onClick={() => handleProductClick(product.id)}
                className="group relative bg-zinc-900/30 border border-white/5 hover:border-white/20 rounded-2xl overflow-hidden cursor-pointer flex flex-col transition-colors duration-500"
              >
                {/* Image Container with Hover Scale */}
                <div className="h-48 overflow-hidden relative bg-zinc-900">
                  <img
                    src={product.previewUrl || "https://placehold.co/600x400/18181b/e4e4e7?text=NO+IMAGE"}
                    alt={product.title}
                    
                    className="object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-in-out"
                  />
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent opacity-80" />
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between relative z-10 -mt-10">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-medium tracking-tight text-white group-hover:text-zinc-300 transition-colors">
                        {product.title}
                      </h3>
                    </div>
                    <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                  
                  <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4 group-hover:border-white/10 transition-colors">
                    <span className="text-lg font-mono tracking-tighter">
                      ${Number(product.priceUSD).toFixed(2)}
                    </span>
                    <motion.div 
                      className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-zinc-400 group-hover:text-white transition-colors"
                    >
                      Acquire <ChevronRight className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </main>
  );
}