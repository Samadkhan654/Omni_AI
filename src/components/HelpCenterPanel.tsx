import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, HelpCircle, BookOpen, Send, Loader2, Compass, Key, Sliders, CheckCircle2 
} from 'lucide-react';

interface HelpDoc {
  title: string;
  desc: string;
  category: string;
}

interface HelpCenterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
  onStartTour?: () => void;
}

export default function HelpCenterPanel({ isOpen, onClose, theme, onStartTour }: HelpCenterPanelProps) {
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketAnswer, setTicketAnswer] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);

  const articles: HelpDoc[] = [
    { title: 'Connecting Custom Store Email Domains', desc: 'Configure Namecheap/GoDaddy CNAME parameters securely targeting ingress.omni.ai rules.', category: 'Operations' },
    { title: 'Defining Stock Shortage Alerts Thresholds', desc: 'Modify automated SMS safety thresholds to dispatch distributor notifications early.', category: 'Inventory' },
    { title: 'ARIA Autopilot conversation boundaries', desc: 'Provide system guidelines telling Aria which clients fetch cold win-back VIP tags.', category: 'Aria AI' },
    { title: 'EU GDPR cookie policy updates', desc: 'Manage Banner settings, multi-preference modals, and cookie audit configurations.', category: 'Compliance' },
    { title: 'OAuth Google Gmail integrations guidelines', desc: 'Securely link workspace scopes using our certified administrative OAuth pipeline.', category: 'OAuth' }
  ];

  const filteredArticles = articles.filter(art => 
    art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    art.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAskAriaDIY = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim()) return;

    setIsAnswering(true);
    setTicketAnswer('');

    setTimeout(() => {
      setIsAnswering(false);
      // Simulate clever semantic answer matching key phrases
      const lower = ticketSubject.toLowerCase();
      if (lower.includes('cookie') || lower.includes('gdpr')) {
        setTicketAnswer("🤖 ARIA Advisor: 'EU GDPR rules require explicit cookie approvals. You can configure which cookies load inside under settings preferences, and users can toggle choices inside the modal successfully.'");
      } else if (lower.includes('stock') || lower.includes('alert') || lower.includes('reorder')) {
        setTicketAnswer("🤖 ARIA Advisor: 'You can build an automated low-stock loop inside the Workflows Canvas tab: select Stock drops trigger, link high-priority alert action, and ARIA will execute restocks instantly.'");
      } else if (lower.includes('email') || lower.includes('domain')) {
        setTicketAnswer("🤖 ARIA Advisor: 'Our Growth Suite includes authenticated visual domains. To register your website, enter the name in Company profile settings and map CNAME entries matching system IPs.'");
      } else {
        setTicketAnswer("🤖 ARIA Advisor: 'I have researched your question inside our system index. To configure this, launch the Global Command palette via ⌘K, type your resource target name, and click to activate direct automated rules!'");
      }
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-y-0 right-0 z-180 h-screen w-85 shadow-2xl flex select-none">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-0 animate-fade-in"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className={`w-full h-full relative z-10 flex flex-col justify-between border-l ${
              isDark ? 'bg-[#1C1917] border-stone-850 text-stone-105-0 text-white' : 'bg-white border-stone-200 text-stone-950'
            }`}
          >
            {/* Header */}
            <div className="p-4 border-b border-stone-200 dark:border-stone-850 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="text-amber-500 animate-pulse" size={16} />
                <span className="font-syne text-xs font-black uppercase tracking-wider">Help & DIY Advisor Hub</span>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-100 cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Knowledge search body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              
              {/* SYSTEM GUIDE QUICKACTION */}
              {onStartTour && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-550/35 relative overflow-hidden">
                  <span className="text-[8px] font-mono font-black text-amber-500 uppercase tracking-widest block mb-1">SYSTEM GUIDE AVAILABLE</span>
                  <h5 className="text-[10px] font-black uppercase text-white tracking-wide mb-1.5">Launch platform walkthrough</h5>
                  <p className="text-[10px] text-stone-400 leading-normal mb-3 font-medium">Click below to activate our step-by-step Guided Tour demonstrating charts, margins, and co-pilot actions live.</p>
                  <button
                    onClick={() => {
                      onStartTour();
                      onClose();
                    }}
                    className="w-full py-2 bg-amber-500 hover:bg-amber-450 text-black font-black uppercase text-[9.5px] rounded-xl tracking-wider transition-all cursor-pointer shadow-md shadow-amber-500/10 text-center"
                  >
                    🎯 Run Platform Walkthrough
                  </button>
                </div>
              )}
              
              {/* Search KB bar */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-stone-450 block">Search Knowledge Directory</label>
                <input
                  type="text"
                  placeholder="Type words like 'email', 'cookie'..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-stone-109 bg-stone-100 dark:bg-stone-950 border border-stone-220 dark:border-stone-850 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-amber-500 font-sans"
                />
              </div>

              {/* Articles stack */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-500 font-mono block">📚 Related Help manuals ({filteredArticles.length})</span>
                <div className="space-y-1.5 max-h-[160px] overflow-y-auto">
                  {filteredArticles.map((art, idx) => (
                    <div 
                      key={idx} 
                      className={`p-2.5 rounded-xl border text-[10px] ${
                        isDark ? 'bg-stone-900/40 border-stone-850' : 'bg-stone-50 border-stone-200'
                      }`}
                    >
                      <span className="text-[9px] font-mono text-[#a8a29e] uppercase font-black tracking-widest">{art.category}</span>
                      <h5 className="font-black mt-0.5 leading-snug text-stone-800 dark:text-stone-200 uppercase">{art.title}</h5>
                      <p className="text-stone-450 dark:text-[#a8a29e] leading-snug mt-1 font-sans">{art.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* DIY ARIA EXPERT FORM */}
              <div className={`p-4 rounded-3xl border ${isDark ? 'bg-stone-950/60 border-stone-850' : 'bg-stone-50 border-stone-200'}`}>
                <span className="text-[9px] font-black uppercase font-mono text-amber-500 tracking-widest block mb-2">⚡ Ask ARIA DIY Expert</span>
                <form onSubmit={handleAskAriaDIY} className="space-y-3">
                  <p className="text-[10px] text-stone-450 leading-normal">
                    Type a business setup doubt. ARIA uses integrated Gemini models to parse logs and formulated guides instantly.
                  </p>
                  <textarea
                    rows={2}
                    value={ticketSubject}
                    onChange={e => setTicketSubject(e.target.value)}
                    placeholder="How do I connect my Gmail account? or How do I update cookies?"
                    required
                    className="w-full bg-stone-100 dark:bg-[#1C1917] border border-stone-250 dark:border-stone-850 rounded-xl py-2 px-3 text-[11px] font-medium text-[#FEF9EF] focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    disabled={isAnswering}
                    className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase text-[10px] rounded-lg tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {isAnswering ? (
                      <>
                        <Loader2 className="animate-spin" size={12} />
                        Consulting IA nodes...
                      </>
                    ) : (
                      <>
                        <Send size={11} />
                        Get AI Answer
                      </>
                    )}
                  </button>
                </form>

                {/* Simulated visual AI box response */}
                <AnimatePresence>
                  {ticketAnswer && (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="mt-3.5 p-3 rounded-xl bg-orange-500/5 border border-amber-500/10 text-[10px] text-[#FEF9EF] leading-relaxed font-semibold font-sans animate-fade-in"
                    >
                      {ticketAnswer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

            {/* Ingestion bottom */}
            <div className="p-3.5 bg-stone-105-0 bg-stone-100 dark:bg-stone-900/60 border-t border-stone-200 dark:border-stone-850 text-center text-[10px] font-mono font-bold text-stone-550 select-none">
              ⚙️ OPERATIONAL AUTOPILOT PROTOCOL
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
