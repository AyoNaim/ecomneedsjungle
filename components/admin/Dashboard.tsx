'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, ShieldAlert, Users, Box, ListOrdered, Plus, 
  Trash2, AlertCircle, CheckCircle2, Cpu, Activity, LogOut 
} from 'lucide-react';

// --- Mock Data ---
const INITIAL_PRODUCTS = [
  { id: '01', title: 'Figma to React UI Kit', category: 'REACT', price: '$99.00', status: 'LIVE' },
  { id: '02', title: 'Matrix WordPress Theme', category: 'WP', price: '$149.00', status: 'LIVE' },
  { id: '03', title: 'Velocity Next.js Boilerplate', category: 'NEXT.JS', price: '$79.00', status: 'LIVE' },
];

const INITIAL_USERS = [
  { id: 'usr_9812x', email: 'dev_alpha@system.io', purchases: 3, status: 'ACTIVE' },
  { id: 'usr_3455y', email: 'agency_x@design.co', purchases: 5, status: 'ACTIVE' },
  { id: 'usr_7721z', email: 'fraud_node@evil.net', purchases: 0, status: 'SUSPENDED' },
];

const INITIAL_LEDGER = [
  { tx: 'tx_f83k1m99', user: 'dev_alpha@system.io', asset: 'Figma to React UI Kit', time: '12:42:01' },
  { tx: 'tx_a29b0c81', user: 'agency_x@design.co', asset: 'Matrix WordPress Theme', time: '09:15:22' },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'products' | 'users' | 'ledger'>('products');
  
  // State management for mock tables
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [users, setUsers] = useState(INITIAL_USERS);
  
  // Form state for creating a product
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('REACT');
  const [newPrice, setNewPrice] = useState('');

  // --- Handlers ---
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice) return;
    
    const createdId = String(products.length + 1).padStart(2, '0');
    setProducts([...products, { 
      id: createdId, 
      title: newTitle, 
      category: newCategory, 
      price: `$${newPrice}`, 
      status: 'LIVE' 
    }]);
    setNewTitle('');
    setNewPrice('');
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleToggleUserStatus = (id: string) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' };
      }
      return u;
    }));
  };

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
        
        {/* 2. SUB-ROUTING NAVIGATION (Sidebar Node) */}
        <aside className="lg:col-span-3 flex flex-col gap-2 border border-neutral-900 bg-neutral-950 p-2">
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full text-left p-4 text-xs uppercase tracking-wider flex items-center justify-between transition-all border ${activeTab === 'products' ? 'bg-white text-black border-white font-bold' : 'bg-transparent text-neutral-500 border-transparent hover:border-neutral-900'}`}
          >
            <span className="flex items-center gap-3"><Box size={14} /> Catalog Control</span>
            {activeTab === 'products' && <span className="w-1.5 h-1.5 bg-black rounded-full" />}
          </button>

          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full text-left p-4 text-xs uppercase tracking-wider flex items-center justify-between transition-all border ${activeTab === 'users' ? 'bg-white text-black border-white font-bold' : 'bg-transparent text-neutral-500 border-transparent hover:border-neutral-900'}`}
          >
            <span className="flex items-center gap-3"><Users size={14} /> Security Ledger</span>
            {activeTab === 'users' && <span className="w-1.5 h-1.5 bg-black rounded-full" />}
          </button>

          <button 
            onClick={() => setActiveTab('ledger')}
            className={`w-full text-left p-4 text-xs uppercase tracking-wider flex items-center justify-between transition-all border ${activeTab === 'ledger' ? 'bg-white text-black border-white font-bold' : 'bg-transparent text-neutral-500 border-transparent hover:border-neutral-900'}`}
          >
            <span className="flex items-center gap-3"><ListOrdered size={14} /> Tx Stream</span>
            {activeTab === 'ledger' && <span className="w-1.5 h-1.5 bg-black rounded-full" />}
          </button>
        </aside>

        {/* 3. DYNAMIC CONTENT WORKSPACE PANELS */}
        <main className="lg:col-span-9 min-h-[500px]">
          <AnimatePresence mode="wait">
            
            {/* --- TAB 1: PRODUCT CATALOG CONTROL --- */}
            {activeTab === 'products' && (
              <motion.div 
                key="products"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                {/* Add New Asset Form */}
                <div className="md:col-span-1 border border-neutral-900 bg-neutral-950 p-6 flex flex-col justify-between h-[360px]">
                  <div>
                    <span className="text-[10px] text-neutral-500 block mb-6 uppercase tracking-widest">// NEW_DEPLOYMENT</span>
                    <form onSubmit={handleAddProduct} className="space-y-4">
                      <div>
                        <label className="block text-[9px] text-neutral-600 uppercase tracking-widest mb-1">Asset Title</label>
                        <input 
                          type="text" 
                          value={newTitle} 
                          onChange={(e) => setNewTitle(e.target.value)}
                          placeholder="Next.js Boilerplate"
                          className="w-full bg-black border border-neutral-900 p-2 text-xs text-white focus:outline-none focus:border-neutral-600"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[9px] text-neutral-600 uppercase tracking-widest mb-1">Category</label>
                          <select 
                            value={newCategory} 
                            onChange={(e) => setNewCategory(e.target.value)}
                            className="w-full bg-black border border-neutral-900 p-2 text-xs text-white focus:outline-none focus:border-neutral-600 uppercase"
                          >
                            <option value="REACT">React</option>
                            <option value="WP">WP Theme</option>
                            <option value="NEXT.JS">Next.js</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[9px] text-neutral-600 uppercase tracking-widest mb-1">Cost (USD)</label>
                          <input 
                            type="number" 
                            value={newPrice} 
                            onChange={(e) => setNewPrice(e.target.value)}
                            placeholder="99.00"
                            className="w-full bg-black border border-neutral-900 p-2 text-xs text-white focus:outline-none focus:border-neutral-600"
                          />
                        </div>
                      </div>
                      <button 
                        type="submit"
                        className="w-full bg-white text-black p-3 text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors cursor-pointer"
                      >
                        <Plus size={14} /> Commit Entry
                      </button>
                    </form>
                  </div>
                  <div className="text-[9px] text-neutral-600 border-t border-neutral-900 pt-4">
                    FILE_UPLOAD_SUPPORT: .zip, .tar
                  </div>
                </div>

                {/* Live Products List */}
                <div className="md:col-span-2 border border-neutral-900 bg-neutral-950 p-6 flex flex-col gap-4 min-h-[360px]">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-widest mb-2">// ACTIVE_REGISTRY</span>
                  
                  {products.map((prod) => (
                    <div key={prod.id} className="flex justify-between items-center border border-neutral-900 p-4 bg-black group hover:border-neutral-700 transition-colors">
                      <div>
                        <div className="text-[9px] text-neutral-600 font-mono mb-1">ID: [{prod.id}] // {prod.category}</div>
                        <h3 className="text-xs font-bold tracking-tight uppercase">{prod.title}</h3>
                        <span className="text-[10px] font-mono text-neutral-400 mt-1 block">{prod.price}</span>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <span className="text-[9px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono uppercase tracking-widest">
                          {prod.status}
                        </span>
                        <button 
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="text-neutral-600 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {products.length === 0 && (
                    <div className="flex-grow flex flex-col items-center justify-center text-[10px] text-neutral-600 font-mono border border-dashed border-neutral-800">
                      <AlertCircle size={16} className="mb-2" />
                      Zero items deployed in registry
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* --- TAB 2: USER MODERATION (Security Ledger) --- */}
            {activeTab === 'users' && (
              <motion.div 
                key="users"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="border border-neutral-900 bg-neutral-950 p-6 flex flex-col gap-4"
              >
                <span className="text-[10px] text-neutral-500 uppercase tracking-widest mb-4">// REGISTERED_CLIENTS</span>
                
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-900 text-[9px] text-neutral-600 uppercase tracking-widest">
                        <th className="py-3 px-4">User Signature / Email</th>
                        <th className="py-3 px-4">Acquisitions</th>
                        <th className="py-3 px-4">Account Status</th>
                        <th className="py-3 px-4 text-right">Moderation Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id} className="border-b border-neutral-900/40 text-[11px]">
                          <td className="py-4 px-4 font-mono text-neutral-400">{u.email}</td>
                          <td className="py-4 px-4 font-mono text-neutral-400">{u.purchases} Assets</td>
                          <td className="py-4 px-4 font-mono">
                            <span className={`inline-block px-2 py-0.5 text-[8px] uppercase tracking-widest border ${u.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                              {u.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button 
                              onClick={() => handleToggleUserStatus(u.id)}
                              className={`text-[9px] font-mono px-3 py-2 border uppercase tracking-widest transition-colors cursor-pointer ${u.status === 'ACTIVE' ? 'border-red-900 bg-red-950/20 text-red-400 hover:bg-red-950' : 'border-emerald-900 bg-emerald-950/20 text-emerald-400 hover:bg-emerald-950'}`}
                            >
                              {u.status === 'ACTIVE' ? 'Suspend Node' : 'Approve Access'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* --- TAB 3: TRANSACTION LEDGER (Tx Stream) --- */}
            {activeTab === 'ledger' && (
              <motion.div 
                key="ledger"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="border border-neutral-900 bg-neutral-950 p-6 flex flex-col gap-4"
              >
                <span className="text-[10px] text-neutral-500 uppercase tracking-widest mb-4">// ACQUISITIONS_LEDGER</span>
                
                <div className="flex flex-col gap-2">
                  {INITIAL_LEDGER.map((tx, idx) => (
                    <div key={idx} className="flex justify-between items-center border border-neutral-900 p-4 bg-black text-xs font-mono">
                      <div>
                        <span className="text-[8px] text-neutral-600 tracking-wider block mb-1">{tx.tx}</span>
                        <span className="text-white font-bold">{tx.asset}</span>
                        <span className="text-neutral-500 block mt-1">Acquired by: {tx.user}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[9px] text-neutral-500">{tx.time}</span>
                        <CheckCircle2 size={14} className="text-emerald-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>

      {/* Footer System Output */}
      <footer className="relative z-10 border-t border-neutral-900 py-4 px-6 text-[9px] font-mono text-neutral-600 flex justify-between items-center bg-neutral-950/20">
         <span>STATUS: SECURE LEDGER</span>
         <span>SECURE SERVER // v4.0x</span>
      </footer>
    </div>
  );

  // Helper toggle function for state update
  function ToggleStatus(id: string) {
    handleToggleUserStatus(id);
  }
}