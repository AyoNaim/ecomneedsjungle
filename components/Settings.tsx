"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, User, LogOut, UploadCloud, X, 
  Check, ChevronRight, Loader2, CreditCard, Shield 
} from "lucide-react";

// Mock Data representing premium digital assets in the user's cart
const INITIAL_CART_ITEMS = [
  { id: "prod_1", name: "Aura — Minimalist Commerce Architecture", category: "Shopify Theme", price: "$180" },
  { id: "prod_2", name: "Mono Engine — Next.js Boilerplate Token", category: "Developer Tool", price: "$85" },
];

export default function SettingsPage() {
  const { data: session, update } = useSession();
  
  // App States
  const [cartItems, setCartItems] = useState(INITIAL_CART_ITEMS);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  
  // Profile Mutation States
  const [name, setName] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync profile details with current session
  useEffect(() => {
    if (session?.user) {
      if (session.user.name && !name) setName(session.user.name);
      if (session.user.image && !imagePreview) setImagePreview(session.user.image);
    }
  }, [session, name, imagePreview]);

  // Handle local profile image parsing
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImagePreview(result);
      setBase64Image(result);
    };
    reader.readAsDataURL(file);
  };

  // Submit configuration updates to API core
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/user/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, base64Image }),
      });

      if (res.ok) {
        const result = await res.json();
        await update({
          user: {
            ...session?.user,
            name: result.user.name,
            image: result.user.image,
          }
        });
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Profile sync failure:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // Trigger Auth.js clean logout flow
  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  const removeItemFromCart = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  // Framer Motion Spring Presets for Premium Responsiveness
  const premiumSpring = { type: "spring", stiffness: 350, damping: 35 } as const;

  // next time, i can also do it like this:
  // import { Transition } from "framer-motion";
  // const premiumSpring: Transition = {}

  return (
    <div className="min-h-screen bg-[#08080a] text-zinc-100 font-sans selection:bg-white selection:text-black antialiased overflow-x-hidden">
      {/* Background Micro-Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.15] pointer-events-none" />

      {/* Main Structural Navbar */}
      <nav className="relative border-b border-zinc-900/80 bg-[#08080a]/80 backdrop-blur-md z-40 max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-500">Workspace /</span>
          <span className="text-sm font-semibold tracking-tight text-white">System Settings</span>
        </div>
        
        {/* Elite Minimalist Cart Launcher Button */}
        <motion.button 
          onClick={() => setIsCartOpen(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative flex items-center gap-3 px-4 py-2 rounded-full bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors"
        >
          <ShoppingBag className="w-4 h-4 text-zinc-400" />
          <span className="text-xs font-medium tracking-tight">Active Vault</span>
          {cartItems.length > 0 && (
            <motion.span 
              layoutId="cartCount"
              className="px-1.5 py-0.5 rounded-full bg-white text-black text-[9px] font-mono font-bold"
            >
              {cartItems.length}
            </motion.span>
          )}
        </motion.button>
      </nav>

      {/* Hero Header Block */}
      <header className="max-w-7xl mx-auto px-6 pt-16 pb-12 border-b border-zinc-900/60">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Account Config</h1>
        <p className="mt-2 text-sm text-zinc-500 font-mono">Control your global profile metadata and license access.</p>
      </header>

      {/* Main Content Layout Block */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-[240px,1fr] gap-12 items-start">
        
        {/* Left Side: Modular Navigation Tabs */}
        <aside className="space-y-1.5">
          {[
            { id: "profile", label: "Identity Profile", icon: User },
            { id: "billing", label: "License & Bills", icon: CreditCard },
            { id: "security", label: "Security Keys", icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 relative ${
                  isActive ? "text-white font-medium" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <div className="flex items-center gap-3 relative z-10">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-zinc-500"}`} />
                  <span className="text-xs tracking-tight">{tab.label}</span>
                </div>
                {isActive && (
                  <motion.div 
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-zinc-900/60 border border-zinc-800/80 rounded-xl"
                    transition={premiumSpring}
                  />
                )}
                <ChevronRight className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? "text-zinc-400" : ""}`} />
              </button>
            );
          })}

          <div className="pt-6 mt-6 border-t border-zinc-900/80">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:text-red-400 transition-colors group"
            >
              <LogOut className="w-4 h-4 text-zinc-500 group-hover:text-red-400 transition-colors" />
              <span className="text-xs tracking-tight">Disconnect Session</span>
            </button>
          </div>
        </aside>

        {/* Right Side: The Tab Panel Content Canvas */}
        <main className="bg-zinc-950/40 border border-zinc-900 p-8 sm:p-12 rounded-[2rem] relative overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === "profile" && (
              <motion.form 
                key="profile-form"
                onSubmit={handleSaveProfile}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-10"
              >
                {/* Visual Image Modifier Interface */}
                <div className="space-y-4">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500">Avatar Allocation</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                    <div className="relative h-24 w-24 rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 flex-shrink-0 group">
                      {imagePreview ? (
                        <img src={imagePreview} alt="User Avatar" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center font-mono text-[10px] text-zinc-600">NULL</div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept=".png,.jpg,.jpeg" className="hidden" />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white text-xs font-medium px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all active:scale-[0.98]"
                      >
                        <UploadCloud className="w-3.5 h-3.5 text-zinc-400" />
                        Upload Custom Binary
                      </button>
                      <p className="text-[10px] font-mono text-zinc-600">System accepts optimized PNG / JPG data schemes underneath 50KB.</p>
                    </div>
                  </div>
                </div>

                {/* Input Text Form Modifiers */}
                <div className="space-y-4">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500 font-medium">Identity Parameters</h3>
                  <div className="space-y-2">
                    <label className="block text-[11px] font-mono text-zinc-400">Account Alias Name</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-700 rounded-xl py-4 px-5 text-sm font-medium text-white placeholder:text-zinc-700 focus:outline-none transition-all duration-300"
                      placeholder="Input client design identity"
                    />
                  </div>
                </div>

                {/* Highly Customized Specialized Premium Animated Save Button */}
                <div className="pt-4 flex items-center gap-4">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="relative px-6 py-3 rounded-xl overflow-hidden bg-white text-black font-semibold text-xs tracking-tight transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] active:scale-[0.98] disabled:bg-zinc-800 disabled:text-zinc-500"
                  >
                    <div className="flex items-center gap-2 relative z-10">
                      {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Commit System Adjustments"}
                    </div>
                  </button>

                  <AnimatePresence>
                    {saveSuccess && (
                      <motion.span 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        exit={{ opacity: 0, x: 10 }}
                        className="flex items-center gap-1.5 text-xs font-mono text-emerald-500"
                      >
                        <Check className="w-4 h-4" /> Runtime state mutations mapped.
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </motion.form>
            )}

            {activeTab !== "profile" && (
              <motion.div 
                key="fallback-tabs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 flex flex-col items-center justify-center border border-dashed border-zinc-900 rounded-2xl"
              >
                <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-[0.2em]">Deployment Segment Pending</span>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Elegant Canvas Drawer Slide-Out Cart Overlay */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop Dimmer */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black z-50 backdrop-blur-sm"
            />

            {/* Cart Panel Sheet */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#0a0a0d] border-l border-zinc-900 shadow-2xl z-50 p-8 flex flex-col justify-between"
            >
              <div>
                {/* Header inside Panel */}
                <header className="flex items-center justify-between pb-6 border-b border-zinc-900">
                  <div className="flex items-center gap-2.5">
                    <ShoppingBag className="w-4 h-4 text-zinc-400" />
                    <h2 className="text-sm font-semibold uppercase tracking-wider font-mono text-white">Your Selections</h2>
                  </div>
                  <motion.button 
                    whileHover={{ rotate: 90 }}
                    onClick={() => setIsCartOpen(false)}
                    className="p-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </header>

                {/* Staggered Dynamic Items List */}
                <div className="mt-8 space-y-4 overflow-y-auto max-h-[60vh] pr-1">
                  <AnimatePresence mode="popLayout">
                    {cartItems.length > 0 ? (
                      cartItems.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: index * 0.05 }}
                          layout
                          className="p-4 bg-zinc-950 border border-zinc-900/80 rounded-2xl flex items-center justify-between group hover:border-zinc-800/80 transition-colors"
                        >
                          <div className="space-y-1 pr-4">
                            <span className="text-[10px] font-mono font-medium text-zinc-600 uppercase tracking-widest block">{item.category}</span>
                            <span className="text-xs font-medium text-zinc-200 block truncate max-w-[220px]">{item.name}</span>
                            <span className="text-xs font-mono font-bold text-zinc-400 block pt-1">{item.price}</span>
                          </div>
                          
                          <button 
                            onClick={() => removeItemFromCart(item.id)}
                            className="p-2 opacity-0 group-hover:opacity-100 bg-zinc-900/60 border border-zinc-800 hover:border-red-950 text-zinc-500 hover:text-red-400 rounded-xl transition-all"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </motion.div>
                      ))
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="py-12 text-center border border-dashed border-zinc-900 rounded-2xl"
                      >
                        <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-wider">Storage Module Vacant</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Checkout Footer Call To Action Box */}
              <footer className="border-t border-zinc-900 pt-6 space-y-4 bg-[#0a0a0d]">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-500 uppercase tracking-wide">Aggregate Total:</span>
                  <span className="text-white font-bold text-sm">
                    ${cartItems.reduce((acc, item) => acc + parseInt(item.price.replace("$", "")), 0)}
                  </span>
                </div>

                {/* Fully Designed Elite Button with Hover Line Shimmer */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  disabled={cartItems.length === 0}
                  className="w-full relative overflow-hidden bg-white text-black font-bold text-xs uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:bg-zinc-900 disabled:text-zinc-600"
                >
                  <span>Initialize License Checkout</span>
                </motion.button>
              </footer>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}