import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, MessageSquare, Zap, Plus, DollarSign, HelpCircle, 
  Settings, RefreshCw, X, ShieldAlert, Key 
} from 'lucide-react';

interface QuickAction {
  label: string;
  desc: string;
  icon: React.ReactNode;
  colorClass: string;
  onClick: () => void;
}

interface QuickActionButtonProps {
  onTriggerToast: (msg: string) => void;
  onOpenShortcuts: () => void;
  onOpenAria: () => void;
  onSimulateSale: () => void;
  theme: 'light' | 'dark';
}

export default function QuickActionButton({ onTriggerToast, onOpenShortcuts, onOpenAria, onSimulateSale, theme }: QuickActionButtonProps) {
  const isDark = theme === 'dark';
  const [isOpen, setIsOpen] = useState(false);

  const actions: QuickAction[] = [
    {
      label: 'Send follow-up SMS',
      desc: 'Let ARIA co-pilot formulate client template',
      icon: <MessageSquare size={14} />,
      colorClass: 'bg-teal-500 text-white',
      onClick: () => {
        onOpenAria();
        onTriggerToast("🤖 Loading CRM Follow-up guidelines with ARIA.");
        setIsOpen(false);
      }
    },
    {
      label: 'Simulate Sale/Lead',
      desc: 'Instantly add £180 transaction metric',
      icon: <DollarSign size={14} />,
      colorClass: 'bg-emerald-500 text-white',
      onClick: () => {
        onSimulateSale();
        setIsOpen(false);
      }
    },
    {
      label: 'Ask AI Advisor',
      desc: 'Ask custom advisor prompts',
      icon: <Sparkles size={14} />,
      colorClass: 'bg-yellow-500 text-black',
      onClick: () => {
        onOpenAria();
        onTriggerToast("💬 Opening ARIA AI chatbot portal.");
        setIsOpen(false);
      }
    },
    {
      label: 'Keyboard Shortcuts',
      desc: 'View (?) shortcut key mapping rules',
      icon: <Key size={14} />,
      colorClass: 'bg-purple-500 text-white',
      onClick: () => {
        onOpenShortcuts();
        setIsOpen(false);
      }
    }
  ];

  return (
    <div className="hidden md:flex fixed bottom-6 right-24 z-160 select-none flex-col items-end">
      
      {/* Floating Staggered Action Menu */}
      <AnimatePresence>
        {isOpen && (
          <div className="flex flex-col gap-2.5 mb-3.5 items-end">
            {actions.map((act, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.9 }}
                transition={{ delay: idx * 0.05, type: 'spring', damping: 15 }}
                className="flex items-center gap-3"
              >
                {/* Secondary tooltip text description bubble */}
                <span className={`py-1.5 px-3 rounded-xl border pointer-events-none text-[10px] text-right shadow-md ${
                  isDark 
                    ? 'bg-[#1C1917] border-stone-850 text-stone-200' 
                    : 'bg-white border-stone-200 text-stone-900 shadow-stone-100'
                }`}>
                  <span className="font-extrabold uppercase block leading-none">{act.label}</span>
                  <span className="text-[9px] text-stone-400 block mt-0.5 font-sans leading-none">{act.desc}</span>
                </span>

                {/* Circular action button */}
                <button
                  type="button"
                  onClick={act.onClick}
                  className={`w-9 h-9 rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all shrink-0 cursor-pointer ${act.colorClass}`}
                >
                  {act.icon}
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Main trigger circular button */}
      <motion.button
        type="button"
        animate={{ 
          rotate: isOpen ? 135 : 0,
          scale: [1, 1.05, 1],
          boxShadow: isOpen ? '0 10px 15px -3px rgba(0,0,0,0.3)' : '0 10px 15px -3px rgba(245,158,11,0.2)'
        }}
        transition={{ repeat: isOpen ? 0 : Infinity, repeatDelay: 6 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 flex items-center justify-center cursor-pointer hover:shadow-xl hover:shadow-amber-500/25 transition-all select-none"
        id="quick-actions-floating-trigger"
      >
        <Plus size={24} className="font-extrabold" />
      </motion.button>
    </div>
  );
}
