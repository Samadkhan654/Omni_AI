import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, HelpCircle, Laptop, Key, ArrowRight } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
}

export default function ShortcutsModal({ isOpen, onClose, theme }: ShortcutsModalProps) {
  const isDark = theme === 'dark';

  const shortcutMapping = [
    { key: 'D', desc: 'Direct Route to Dashboard & Communications' },
    { key: 'R', desc: 'Direct Route to Customer Retention (CRM)' },
    { key: 'I', desc: 'Direct Route to Stock Sense (Inventory)' },
    { key: 'C', desc: 'Direct Route to CFO Cost Guard (Margins)' },
    { key: 'A', desc: 'Direct Route to ARIA Cognitive AI Assistant' },
    { key: 'W', desc: 'Direct Route to Automated Workflows Canvas' },
    { key: 'S', desc: 'Direct Route to Settings & Domain Profiles' },
    { key: '⌘ K', desc: 'Browse Command palette Search Engine' },
    { key: 'P', desc: 'Toggle Platform Interface Theme' },
    { key: 'L', desc: 'Cycle Platform Translation (Multi-language)' },
    { key: '?', desc: 'Toggle Keyboard Bindings Legend Guide' },
    { key: 'ESC', desc: 'Close active modal modules blocks' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-210 flex items-center justify-center p-4">
          
          {/* Backblur backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ scale: 0.95, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 15, opacity: 0 }}
            className={`relative w-full max-w-md rounded-3xl border p-5 shadow-2xl z-10 flex flex-col ${
              isDark ? 'bg-[#1C1917] border-stone-850 text-white' : 'bg-white border-stone-250 text-stone-950'
            }`}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4 pb-3.5 border-b border-stone-250 dark:border-stone-850">
              <h4 className="font-syne text-xs font-black uppercase tracking-wider flex items-center gap-2">
                <HelpCircle size={15} className="text-amber-500" />
                Active Keyboard bindings legend
              </h4>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-850/50 cursor-pointer transition-all"
              >
                <X size={15} />
              </button>
            </div>

            {/* Keys Legend Stack Grid */}
            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {shortcutMapping.map((item, idx) => (
                <div 
                  key={idx} 
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-sans ${
                    isDark ? 'bg-stone-900/40 border-stone-850/60' : 'bg-stone-50 border-stone-200'
                  }`}
                >
                  <span className="font-bold text-stone-605 text-stone-600 dark:text-stone-300">
                    {item.desc}
                  </span>
                  {/* Styled keycap */}
                  <kbd className="min-w-[28px] h-7 bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-stone-105 border-b-2 border-stone-400 dark:border-stone-700 rounded-md font-mono text-[10px] font-black uppercase flex items-center justify-center shadow-inner tracking-tight px-1.5 shrink-0">
                    {item.key}
                  </kbd>
                </div>
              ))}
            </div>

            <p className="text-[10px] uppercase font-mono font-bold text-stone-500 text-center mt-4.5 pt-3.5 border-t border-stone-205 dark:border-stone-850 leading-none">
              ⌨️ TYPE KEYSTROKES REGISTERED GLOBALLY
            </p>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
