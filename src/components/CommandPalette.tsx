import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Users, Layers, Layout, HelpCircle, ArrowRight, CornerDownLeft, 
  Settings, Key, Sparkles, MessageSquare, ShieldAlert, Plus, Zap 
} from 'lucide-react';

interface PaletteItem {
  id: string;
  category: 'contacts' | 'features' | 'actions' | 'help' | 'settings';
  label: string;
  desc: string;
  icon: string;
  colorClass: string;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onTabChange: (tab: string) => void;
  onTriggerToast: (msg: string) => void;
  theme: 'light' | 'dark';
}

export default function CommandPalette({ isOpen, onClose, onTabChange, onTriggerToast, theme }: CommandPaletteProps) {
  const isDark = theme === 'dark';
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input automatically on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Global hotkey: Cmd+K / Ctrl+K & Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : onClose(); // handled by parent, but safe
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const items: PaletteItem[] = [
    // Contacts Group
    { 
      id: 'c1', category: 'contacts', label: 'Jessica Vance', desc: 'Active VIP Client • CRM Profile', icon: 'JV', colorClass: 'bg-emerald-500/10 text-emerald-500', 
      action: () => { onTabChange('retainflow'); onTriggerToast("Targeted Jessica Vance inside Retention Directory."); onClose(); } 
    },
    { 
      id: 'c2', category: 'contacts', label: 'James Chen', desc: 'High Risk Churn • Win-back suggested', icon: 'JC', colorClass: 'bg-red-500/10 text-red-500', 
      action: () => { onTabChange('retainflow'); onTriggerToast("Managing Sarah Vance priority alert."); onClose(); } 
    },
    { 
      id: 'c3', category: 'contacts', label: 'Local Grind Coffee Cafe', desc: 'Corporate Wholesale Client', icon: 'LG', colorClass: 'bg-amber-500/10 text-amber-500', 
      action: () => { onTabChange('retainflow'); onTriggerToast("Inspecting Local Grind Cafe trade records."); onClose(); } 
    },

    // Features Navigation Group
    { 
      id: 'f1', category: 'features', label: 'Dashboard & Operations Hub', desc: 'Key store retention metrics & WhatsApp feeds', icon: '🏠', colorClass: 'bg-blue-500/10 text-blue-500', 
      action: () => { onTabChange('dashboard'); onClose(); } 
    },
    { 
      id: 'f2', category: 'features', label: 'Customer Retention CRM Hub', desc: 'Predict churn, draft broadcasts, list contacts', icon: '👥', colorClass: 'bg-teal-500/10 text-teal-500', 
      action: () => { onTabChange('retainflow'); onClose(); } 
    },
    { 
      id: 'f3', category: 'features', label: 'CFO Profit Cost Monitor', desc: 'Identify software invoice leaks and cost spikes', icon: '💰', colorClass: 'bg-amber-500/10 text-amber-500', 
      action: () => { onTabChange('costguard'); onClose(); } 
    },
    { 
      id: 'f4', category: 'features', label: 'Stock Sense Inventory Hub', desc: 'Automate stock shortages & supplier order lists', icon: '📦', colorClass: 'bg-purple-500/10 text-purple-500', 
      action: () => { onTabChange('stocksense'); onClose(); } 
    },
    { 
      id: 'f5', category: 'features', label: 'ARIA Cognitive Assistant', desc: 'Fine-tune prompts & autopilot replies', icon: '🤖', colorClass: 'bg-pink-500/10 text-pink-500', 
      action: () => { onTabChange('aria'); onClose(); } 
    },
    { 
      id: 'f6', category: 'features', label: 'Visual Workflow Builder', desc: 'If-This-Then-That node automated trigger editor', icon: '⚡', colorClass: 'bg-yellow-500/10 text-yellow-500', 
      action: () => { onTabChange('workflows'); onClose(); } 
    },

    // Settings Navigation Group
    { 
      id: 's1', category: 'settings', label: 'Account Profile Preferences', desc: 'Modify operators name, website metadata & store billing', icon: '⚙️', colorClass: 'bg-stone-500/10 text-stone-300', 
      action: () => { onTabChange('settings'); onClose(); } 
    },
    { 
      id: 's2', category: 'settings', label: 'GDPR Cookie Consent Guard', desc: 'Reconfigure marketing preferences & audit policies', icon: '🛡️', colorClass: 'bg-purple-500/10 text-purple-400', 
      action: () => { onTabChange('settings'); onClose(); onTriggerToast("Deploying Cookie Consent preferences panel."); } 
    },

    // Help Center Articles
    { 
      id: 'h1', category: 'help', label: 'Link Custom Web Domains', desc: 'Help Article • Configure DNS and custom favicon cache', icon: '🌐', colorClass: 'bg-stone-100 text-stone-800', 
      action: () => { onTriggerToast("💡 Help Center: To connect DNS, map CNAME records of 'retroapparel.co.uk' to 'ingress.omni.ai' inside your domain operator."); onClose(); } 
    },
    { 
      id: 'h2', category: 'help', label: 'Aria Context Prompts Template', desc: 'Help Article • Optimize Gemini variables for SMS', icon: '📝', colorClass: 'bg-stone-100 text-stone-800', 
      action: () => { onTabChange('aria'); onTriggerToast("Loaded official Gemini prompt formatting guidelines."); onClose(); } 
    },

    // Quick direct actions
    { 
      id: 'a1', category: 'actions', label: 'Bulk Reorder Safety Stock units', desc: 'Direct Action • Draft low stock order list instantly', icon: '📦', colorClass: 'bg-amber-500/10 text-amber-500', 
      action: () => { onTabChange('stocksense'); onTriggerToast("📋 Direct Action: Prepared restock order template for low-stock mobile adapters."); onClose(); } 
    },
    { 
      id: 'a2', category: 'actions', label: 'Draft Silent WhatsApp Win-Back SMS', desc: 'Direct Action • Let Aria write template', icon: '💬', colorClass: 'bg-amber-500/10 text-amber-500', 
      action: () => { onTabChange('retainflow'); onTriggerToast("🤖 Direct Action: Aria has generated a high-converting WhatsApp draft."); onClose(); } 
    },
    { 
      id: 'a3', category: 'actions', label: 'Link Corporate Email Hub', desc: 'Direct Action • Connect Gmail / Microsoft Outlook', icon: '📧', colorClass: 'bg-amber-500/10 text-amber-500', 
      action: () => { onTabChange('settings'); onTriggerToast("Launch OAuth connections panel on global configurations."); onClose(); } 
    }
  ];

  // Filtering search queries
  const filtered = items.filter(item => {
    const raw = `${item.label} ${item.desc} ${item.category}`.toLowerCase();
    return raw.includes(query.toLowerCase());
  });

  // Keyboard controls over matches
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(filtered.length, 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filtered.length) % Math.max(filtered.length, 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-200 flex items-start justify-center p-4 sm:p-12">
          
          {/* Backblur backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Search container */}
          <motion.div
            initial={{ scale: 0.96, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 15, opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={`relative w-full max-w-2xl rounded-3xl border shadow-2xl flex flex-col overflow-hidden max-h-[500px] z-10 ${
              isDark ? 'bg-[#1C1917] border-stone-800 text-stone-200' : 'bg-white border-stone-200 text-stone-900'
            }`}
          >
            {/* Input row */}
            <div className="relative border-b border-stone-200 dark:border-stone-850 p-4 flex items-center">
              <Search className="text-stone-400 mr-3 shrink-0" size={18} />
              <input
                ref={inputRef}
                type="text"
                autoComplete="off"
                placeholder="Press ⌘K to search features, operators, contacts, settings, and help articles..."
                value={query}
                onChange={e => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent border-none text-xs font-semibold focus:outline-none placeholder-stone-500"
              />
              <button 
                onClick={onClose}
                className="text-[10px] font-mono font-black border border-stone-300 dark:border-stone-800 px-2 py-1 rounded bg-[#2D2A28]/2 p-1 relative text-stone-400"
              >
                ESC
              </button>
            </div>

            {/* Results stack scroll */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
              {filtered.length === 0 ? (
                <div className="text-center py-12 text-xs font-semibold text-stone-500 flex flex-col items-center gap-2">
                  <ShieldAlert size={24} className="text-stone-400" />
                  <span>No security matched registers. Search 'retention' or 'reorder'.</span>
                </div>
              ) : (
                // Group by Category
                <div>
                  <div className="space-y-1">
                    {filtered.map((item, index) => {
                      const isSelected = index === selectedIndex;
                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            setSelectedIndex(index);
                            item.action();
                          }}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className={`p-3 rounded-2xl cursor-pointer transition-all flex items-center justify-between ${
                            isSelected 
                              ? 'bg-amber-500 text-black shadow-md' 
                              : isDark ? 'hover:bg-stone-900 bg-stone-900/10' : 'hover:bg-stone-100 bg-stone-50/20'
                          }`}
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            {/* Visual tag icon */}
                            <span className={`w-8 h-8 rounded-xl font-black text-xs uppercase flex items-center justify-center shrink-0 border border-dashed border-stone-500/20 ${
                              isSelected ? 'bg-black/10 text-black border-black/30' : item.colorClass
                            }`}>
                              {item.icon}
                            </span>
                            <div className="min-w-0">
                              <span className={`text-[9px] font-black uppercase tracking-widest block font-mono ${isSelected ? 'text-black/75' : 'text-stone-450 dark:text-stone-400'}`}>
                                {item.category}
                              </span>
                              <h5 className="text-[12px] font-black truncate block tracking-wide leading-tight mt-0.5 uppercase">
                                {item.label}
                              </h5>
                              <p className={`text-[10px] truncate block leading-none mt-0.5 ${isSelected ? 'text-black/70' : 'text-stone-450 dark:text-stone-400'}`}>
                                {item.desc}
                              </p>
                            </div>
                          </div>

                          {/* Quick selection arrow */}
                          {isSelected && (
                            <span className="text-[10px] uppercase font-mono font-black tracking-widest text-black flex items-center gap-1 bg-black/15 py-1 px-2.5 rounded-lg">
                              <span>Action</span>
                              <CornerDownLeft size={10} />
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Sticky instructions footer */}
            <div className="bg-stone-100 dark:bg-stone-900/60 p-3 px-4.5 border-t border-stone-200 dark:border-stone-850 flex items-center justify-between text-[10px] font-mono font-bold text-stone-500 select-none">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="bg-stone-200 dark:bg-stone-800 p-1 py-0.5 rounded border border-stone-300 dark:border-stone-750 font-black">↑↓</span> Move
                </span>
                <span className="flex items-center gap-1">
                  <span className="bg-stone-200 dark:bg-stone-800 p-1 py-0.5 rounded border border-stone-300 dark:border-stone-750 font-black font-sans">↩</span> Select
                </span>
              </div>
              <span className="text-amber-500 font-black select-none">Global Command Center Indexed</span>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
