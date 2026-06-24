'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, ShieldAlert, Users, Box, ListOrdered, Plus, 
  Trash2, AlertCircle, CheckCircle2, Cpu, Activity, LogOut, Loader2, AlertTriangle
} from 'lucide-react';

// --- Types ---
type ActionType = 'DELETE_PRODUCT' | 'TOGGLE_USER' | null;

interface ModalState {
  isOpen: boolean;
  action: ActionType;
  targetId: string;
  targetDisplayInfo: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'products' | 'users' | 'ledger'>('products');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Dynamic State
  const [products, setProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [ledger, setLedger] = useState<any[]>([]);
  
  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPrice, setNewPrice] = useState('');

  // Modal State
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    action: null,
    targetId: '',
    targetDisplayInfo: ''
  });

  // --- Fetch Backend Data ---
  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const res = await fetch('/api/admin/dashboard');
        const data = await res.json();
        if (data && !data.error) {
          setProducts(data.products || []);
          setUsers(data.users || []);
          setLedger(data.ledger || []);
        }
      } catch (err) {
        console.error("System Failure:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTelemetry();
  }, []);

  // --- Real Database Actions ---
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice || !newDescription) return;
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          priceUSD: parseFloat(newPrice),
          previewUrl: 'pending', // Placeholder for your future R2 upload logic
          r2Key: 'pending',
          isAvailable: true
        })
      });

      if (!res.ok) throw new Error('Failed to commit product to database');
      const createdProduct = await res.json();
      
      setProducts([createdProduct, ...products]);
      
      // Reset form
      setNewTitle('');
      setNewDescription('');
      setNewPrice('');
    } catch (err) {
      console.error(err);
      alert('DATABASE COMMIT FAILED');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Modal Trigger Handlers ---
  const requestDeleteProduct = (id: string, title: string) => {
    setModal({ isOpen: true, action: 'DELETE_PRODUCT', targetId: id, targetDisplayInfo: title });
  };

  const requestToggleUser = (id: string, email: string) => {
    setModal({ isOpen: true, action: 'TOGGLE_USER', targetId: id, targetDisplayInfo: email });
  };

  const closeModal = () => {
    setModal({ isOpen: false, action: null, targetId: '', targetDisplayInfo: '' });
  };

  // --- Modal Execution Logic ---
  const executeModalAction = async () => {
    const { action, targetId } = modal;
    if (!action || !targetId) return;

    try {
      if (action === 'DELETE_PRODUCT') {
        const res = await fetch(`/api/admin/products?id=${targetId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to terminate asset');
        
        setProducts(products.filter(p => p.id !== targetId));
      } 
      
      else if (action === 'TOGGLE_USER') {
        const res = await fetch(`/api/admin/users?id=${targetId}`, { method: 'PATCH' });
        if (!res.ok) throw new Error('Failed to mutate user clearance');
        
        // Optimistically update the UI to avoid requiring a full refetch
        setUsers(users.map(u => {
          if (u.id === targetId) {
            return { ...u, status: u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' };
          }
          return u;
        }));
      }
    } catch (err) {
      console.error("Action Execution Failed:", err);
      alert('SYSTEM OVERRIDE FAILED');
    } finally {
      closeModal();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-emerald-500 flex items-center justify-center font-mono text-sm uppercase tracking-widest">
        <Loader2 className="animate-spin mr-3" /> Establishing Secure Connection...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono flex flex-col selection:bg-white selection:text-black relative overflow-hidden">
      
      {/* Background Grid Accent */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)', backgroundSize: '4rem 4rem' }} 
      />

      {/* 1. TOP NAVBAR / TERMINAL HEADER */}
      <header className="relative z-10 border-b border-neutral-900 bg-neutral-950/40 backdrop-blur-md px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Terminal size={18} className="text-white animate-pulse" />
          <h1 className="text-xs tracking-widest uppercase font-bold">Admin_Core // Superuser Panel</h1>
        </div>
        <div className="flex items-center gap-6 text-[10px] text-neutral-500 uppercase">
          <span className="flex items-center gap-2"><Cpu size={12} /> Node: Secure</span>
          <span className="flex items-center gap-2"><Activity size={12} className="text-emerald-500" /> System: Online</span>
          <button className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
            <LogOut size={12} /> Force Terminate
          </button>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <div className="flex-grow max-w-7xl w-full mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 items-start">
        
        {/* 2. SUB-ROUTING NAVIGATION */}
        <aside className="lg:col-span-3 flex flex-col gap-2 border border-neutral-900 bg-neutral-950 p-2">
          <button onClick={() => setActiveTab('products')} className={`w-full text-left p-4 text-xs uppercase tracking-wider flex items-center justify-between transition-all border ${activeTab === 'products' ? 'bg-white text-black border-white font-bold' : 'bg-transparent text-neutral-500 border-transparent hover:border-neutral-900'}`}>
            <span className="flex items-center gap-3"><Box size={14} /> Catalog Control</span>
            {activeTab === 'products' && <span className="w-1.5 h-1.5 bg-black rounded-full" />}
          </button>

          <button onClick={() => setActiveTab('users')} className={`w-full text-left p-4 text-xs uppercase tracking-wider flex items-center justify-between transition-all border ${activeTab === 'users' ? 'bg-white text-black border-white font-bold' : 'bg-transparent text-neutral-500 border-transparent hover:border-neutral-900'}`}>
            <span className="flex items-center gap-3"><Users size={14} /> Security Ledger</span>
            {activeTab === 'users' && <span className="w-1.5 h-1.5 bg-black rounded-full" />}
          </button>

          <button onClick={() => setActiveTab('ledger')} className={`w-full text-left p-4 text-xs uppercase tracking-wider flex items-center justify-between transition-all border ${activeTab === 'ledger' ? 'bg-white text-black border-white font-bold' : 'bg-transparent text-neutral-500 border-transparent hover:border-neutral-900'}`}>
            <span className="flex items-center gap-3"><ListOrdered size={14} /> Tx Stream</span>
            {activeTab === 'ledger' && <span className="w-1.5 h-1.5 bg-black rounded-full" />}
          </button>
        </aside>

        {/* 3. DYNAMIC CONTENT WORKSPACE PANELS */}
        <main className="lg:col-span-9 min-h-[500px]">
          <AnimatePresence mode="wait">
            
            {/* --- TAB 1: PRODUCT CATALOG CONTROL --- */}
            {activeTab === 'products' && (
              <motion.div key="products" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Form Component */}
                <div className="md:col-span-1 border border-neutral-900 bg-neutral-950 p-6 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-500 block mb-6 uppercase tracking-widest">// NEW_DEPLOYMENT</span>
                    <form onSubmit={handleAddProduct} className="space-y-4">
                      <div>
                        <label className="block text-[9px] text-neutral-600 uppercase tracking-widest mb-1">Asset Title</label>
                        <input required type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="w-full bg-black border border-neutral-900 p-2 text-xs text-white focus:outline-none focus:border-neutral-600" />
                      </div>
                      <div>
                        <label className="block text-[9px] text-neutral-600 uppercase tracking-widest mb-1">Description</label>
                        <textarea required value={newDescription} onChange={(e) => setNewDescription(e.target.value)} rows={3} className="w-full bg-black border border-neutral-900 p-2 text-xs text-white focus:outline-none focus:border-neutral-600 resize-none" />
                      </div>
                      <div>
                        <label className="block text-[9px] text-neutral-600 uppercase tracking-widest mb-1">Cost (USD)</label>
                        <input required type="number" step="0.01" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} className="w-full bg-black border border-neutral-900 p-2 text-xs text-white focus:outline-none focus:border-neutral-600" />
                      </div>
                      <button disabled={isSubmitting} type="submit" className="w-full bg-white text-black p-3 text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors disabled:opacity-50">
                        {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} 
                        {isSubmitting ? 'COMMITTING...' : 'COMMIT ENTRY'}
                      </button>
                    </form>
                  </div>
                  <div className="text-[9px] text-neutral-600 border-t border-neutral-900 pt-4 mt-8">
                    FILE_UPLOAD_SUPPORT: strictly .pdf, .jpg, .png, .zip
                  </div>
                </div>

                {/* Registry List */}
                <div className="md:col-span-2 border border-neutral-900 bg-neutral-950 p-6 flex flex-col gap-4 min-h-[360px] overflow-y-auto max-h-[600px]">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-widest mb-2">// ACTIVE_REGISTRY</span>
                  
                  {products.map((prod) => (
                    <div key={prod.id} className="flex justify-between items-center border border-neutral-900 p-4 bg-black group hover:border-neutral-700 transition-colors">
                      <div>
                        <div className="text-[9px] text-neutral-600 font-mono mb-1">ID: [{prod.id.slice(0,8)}]</div>
                        <h3 className="text-xs font-bold tracking-tight uppercase">{prod.title}</h3>
                        <span className="text-[10px] font-mono text-neutral-400 mt-1 block">${Number(prod.priceUSD).toFixed(2)}</span>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <span className={`text-[9px] px-2 py-0.5 font-mono uppercase tracking-widest border ${prod.isAvailable ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-neutral-800 text-neutral-400 border-neutral-700'}`}>
                          {prod.isAvailable ? 'LIVE' : 'OFFLINE'}
                        </span>
                        <button onClick={() => requestDeleteProduct(prod.id, prod.title)} className="text-neutral-600 hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* --- TAB 2: USER MODERATION --- */}
            {activeTab === 'users' && (
              <motion.div key="users" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="border border-neutral-900 bg-neutral-950 p-6 flex flex-col gap-4 max-h-[700px] overflow-y-auto">
                <span className="text-[10px] text-neutral-500 uppercase tracking-widest mb-4">// REGISTERED_CLIENTS</span>
                
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-900 text-[9px] text-neutral-600 uppercase tracking-widest">
                      <th className="py-3 px-4">User Signature</th>
                      <th className="py-3 px-4">Acquisitions</th>
                      <th className="py-3 px-4">Cart Status</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-neutral-900/40 text-[11px]">
                        <td className="py-4 px-4 font-mono text-neutral-400 truncate max-w-[150px]" title={u.email}>{u.email}</td>
                        <td className="py-4 px-4 font-mono text-neutral-400">{u.purchases}</td>
                        <td className="py-4 px-4 font-mono text-neutral-400">{u.cartItems} Items</td>
                        <td className="py-4 px-4 font-mono">
                          <span className={`inline-block px-2 py-0.5 text-[8px] uppercase tracking-widest border ${u.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button onClick={() => requestToggleUser(u.id, u.email)} className={`text-[9px] font-mono px-3 py-2 border uppercase tracking-widest transition-colors ${u.status === 'ACTIVE' ? 'border-red-900 bg-red-950/20 text-red-400 hover:bg-red-950' : 'border-emerald-900 bg-emerald-950/20 text-emerald-400 hover:bg-emerald-950'}`}>
                            {u.status === 'ACTIVE' ? 'Suspend Node' : 'Approve'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}

            {/* --- TAB 3: TRANSACTION LEDGER --- */}
            {activeTab === 'ledger' && (
              <motion.div key="ledger" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="border border-neutral-900 bg-neutral-950 p-6 flex flex-col gap-4 max-h-[700px] overflow-y-auto">
                <span className="text-[10px] text-neutral-500 uppercase tracking-widest mb-4">// ACQUISITIONS_LEDGER</span>
                
                <div className="flex flex-col gap-2">
                  {ledger.map((tx, idx) => (
                    <div key={idx} className="flex justify-between items-center border border-neutral-900 p-4 bg-black text-xs font-mono group hover:border-neutral-700 transition-colors">
                      <div>
                        <span className="text-[8px] text-neutral-600 tracking-wider block mb-1">{tx.tx}</span>
                        <span className="text-white font-bold">{tx.asset}</span>
                        <span className="text-neutral-500 block mt-1">Acquired by: {tx.user}</span>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`text-[9px] px-2 py-0.5 uppercase tracking-widest border ${tx.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : tx.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                          {tx.status}
                        </span>
                        <span className="text-[9px] text-neutral-500">{new Date(tx.time).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>
      
      <footer className="relative z-10 border-t border-neutral-900 py-4 px-6 text-[9px] font-mono text-neutral-600 flex justify-between items-center bg-neutral-950/20">
         <span>STATUS: SECURE LEDGER</span>
         <span>SECURE SERVER // v4.0x</span>
      </footer>

      {/* --- CYBERPUNK CONFIRMATION MODAL --- */}
      <AnimatePresence>
        {modal.isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }}
              className="bg-neutral-950 border border-red-900/50 max-w-md w-full p-6 shadow-2xl relative overflow-hidden"
            >
              {/* Modal Grid Accent */}
              <div className="absolute inset-0 z-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #ff0000 1px, transparent 1px), linear-gradient(to bottom, #ff0000 1px, transparent 1px)', backgroundSize: '1rem 1rem' }} />
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-red-950/30 flex items-center justify-center mb-4 border border-red-900">
                  <AlertTriangle className="text-red-500" size={24} />
                </div>
                
                <h2 className="text-sm uppercase tracking-widest font-bold text-white mb-2">
                  AUTHORIZATION REQUIRED
                </h2>
                
                <p className="text-xs text-neutral-400 mb-6">
                  {modal.action === 'DELETE_PRODUCT' ? 'You are about to permanently purge the following asset from the global registry:' : 'You are about to modify the security clearance for the following client node:'}
                  <br /><br />
                  <span className="text-red-400 font-bold bg-red-950/20 px-2 py-1 border border-red-900/30 inline-block">
                    {modal.targetDisplayInfo}
                  </span>
                </p>

                <div className="w-full grid grid-cols-2 gap-4">
                  <button onClick={closeModal} className="p-3 text-xs uppercase tracking-widest font-bold text-neutral-400 border border-neutral-800 hover:bg-neutral-900 transition-colors">
                    Cancel Process
                  </button>
                  <button onClick={executeModalAction} className="p-3 text-xs uppercase tracking-widest font-bold text-red-500 border border-red-900 bg-red-950/20 hover:bg-red-950 transition-colors">
                    Confirm Override
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}