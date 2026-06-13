import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Bell, AlertTriangle, Cpu, TrendingUp, UserCheck, Trash2, 
  RefreshCw, CheckCircle2, ShieldAlert, Sparkles, Filter 
} from 'lucide-react';

interface AuditEvent {
  id: string;
  time: string;
  category: 'aria' | 'stock' | 'cost' | 'customer';
  categoryLabel: string;
  message: string;
  dotColor: string;
  icon: string;
}

interface ActivityFeedSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
}

export default function ActivityFeedSidebar({ isOpen, onClose, theme }: ActivityFeedSidebarProps) {
  const isDark = theme === 'dark';
  const [filter, setFilter] = useState<'all' | 'aria' | 'stock' | 'cost' | 'customer'>('all');

  // Simulated Audit logs feeds
  const [events, setEvents] = useState<AuditEvent[]>([
    { id: '1', time: '2:15 PM', category: 'aria', categoryLabel: 'ARIA Autopilot', message: 'Cognitive agent responded autonomously to Maria Santos support query.', dotColor: 'bg-amber-500', icon: '🤖' },
    { id: '2', time: '1:45 PM', category: 'stock', categoryLabel: 'Stock Sense Alert', message: 'Auto safety reorder triggered: Premium wireless adapters count dipped behind 5 units.', dotColor: 'bg-yellow-500', icon: '📦' },
    { id: '3', time: '12:30 PM', category: 'cost', categoryLabel: 'Expense Audit Detected', message: 'CFO leak detected: Identified duplicate ERP user licence seat expenditure.', dotColor: 'bg-red-500', icon: '💰' },
    { id: '4', time: '11:10 AM', category: 'customer', categoryLabel: 'Client CRM Profile', message: 'Jessica Vance synced. Verified 94.2% healthy retention rating.', dotColor: 'bg-emerald-500', icon: '✨' },
    { id: '5', time: '10:05 AM', category: 'customer', categoryLabel: 'WhatsApp Win-Back Campaign', message: 'Delivered broadcast campaign invitation to 42 cold customer coordinates.', dotColor: 'bg-emerald-500', icon: '💬' },
    { id: '6', time: 'Yesterday', category: 'aria', categoryLabel: 'System Train Completed', message: 'Successfully updated conversational prompt context matching Sandstone themes.', dotColor: 'bg-amber-500', icon: '🤖' },
    { id: '7', time: 'Yesterday', category: 'cost', categoryLabel: 'Margin optimization update', message: 'Resolved supplier cost-creep margin protecting courier fuel pricing spikes.', dotColor: 'bg-[#10B981]', icon: '💼' }
  ]);

  const addSimulatedRandomEvent = () => {
    const randomMsgs = [
      { category: 'aria' as const, categoryLabel: 'ARIA Agent', message: 'Aria formulated optimized WhatsApp answer draft template.', dotColor: 'bg-amber-500', icon: '🤖' },
      { category: 'stock' as const, categoryLabel: 'Stock Sense Warning', message: 'Bulk re-order pipeline confirmation dispatched to distributor.', dotColor: 'bg-yellow-500', icon: '📦' },
      { category: 'cost' as const, categoryLabel: 'Cost Guard Watchdog', message: 'Audited monthly subscriptions: Cloud backup capacity optimized.', dotColor: 'bg-emerald-500', icon: '💰' },
      { category: 'customer' as const, categoryLabel: 'Retention CRM', message: 'Assigned Priority Customer tag to Local Grind Cafe Coffee Corp.', dotColor: 'bg-indigo-400', icon: '🏷️' }
    ];
    const picked = randomMsgs[Math.floor(Math.random() * randomMsgs.length)];
    const newEvent: AuditEvent = {
      id: Math.random().toString(36).substr(2, 9),
      time: 'Just Now',
      ...picked
    };
    setEvents(prev => [newEvent, ...prev]);
  };

  const filteredEvents = events.filter(e => filter === 'all' || e.category === filter);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-y-0 right-0 z-170 h-screen w-80 shadow-2xl flex select-none">
          
          {/* Backblur backdrop layer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-0"
          />

          {/* Audit Feed Drawer Body */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className={`w-full h-full relative z-10 flex flex-col justify-between border-l ${
              isDark ? 'bg-[#1C1917] border-stone-850 text-stone-100' : 'bg-white border-stone-200 text-stone-900'
            }`}
          >
            {/* Header Area */}
            <div className="p-4 border-b border-stone-200 dark:border-stone-850 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="font-syne text-xs font-black uppercase tracking-wider">Business Audit Pulse</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={addSimulatedRandomEvent}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-amber-500 cursor-pointer"
                  title="Simulate Event Log"
                >
                  <RefreshCw size={13} />
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Selector filter bar */}
            <div className="p-3 bg-stone-100 dark:bg-stone-900/60 border-b border-stone-200 dark:border-stone-850">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[9px] uppercase font-black font-mono">
                <Filter size={10} className="text-stone-450 text-stone-500 shrink-0" />
                {[
                  { id: 'all', label: 'All' },
                  { id: 'aria', label: '🤖 Aria' },
                  { id: 'stock', label: '📦 Stock' },
                  { id: 'cost', label: '💰 Costs' },
                  { id: 'customer', label: '👤 CRM' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setFilter(item.id as any)}
                    className={`py-1 px-2.5 rounded-md transition-all shrink-0 cursor-pointer ${
                      filter === item.id 
                        ? 'bg-amber-500 text-black font-black' 
                        : 'bg-stone-200 dark:bg-stone-800 text-stone-500 dark:text-stone-400 hover:text-stone-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* List item scroll */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence initial={false}>
                {filteredEvents.map(e => (
                  <motion.div
                    key={e.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`p-3.5 rounded-2xl border flex gap-3 text-xs leading-relaxed relative ${
                      isDark ? 'bg-stone-900/40 border-stone-850/80 hover:border-stone-750' : 'bg-stone-50 border-stone-200'
                    }`}
                  >
                    <span className="text-base bg-stone-100 dark:bg-stone-800/80 p-1.5 rounded-xl h-fit border border-dashed border-stone-800/30">
                      {e.icon}
                    </span>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1 text-[10px] font-bold text-stone-400">
                        <span className="uppercase text-amber-500 font-black tracking-wider">{e.categoryLabel}</span>
                        <span>{e.time}</span>
                      </div>
                      <p className="text-[11px] text-stone-700 dark:text-stone-300 font-sans tracking-wide">
                        {e.message}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Sticky footer telemetry details */}
            <div className="p-3.5 bg-stone-100 dark:bg-stone-900/40 border-t border-stone-200 dark:border-stone-850 text-center text-[10px] uppercase font-mono font-bold text-stone-550 select-none">
              🌐 INGESTION: VERIFIED WEB-AUTOPILOT
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
