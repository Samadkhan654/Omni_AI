import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  TrendingUp, 
  ShieldAlert, 
  PackageSearch, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  BarChart2, 
  Users, 
  MessageSquare, 
  Zap, 
  Check, 
  ArrowUpRight, 
  AlertTriangle,
  Send,
  Volume2,
  VolumeX,
  Clock,
  ShieldCheck,
  ZapOff,
  Instagram,
  Twitter,
  Facebook,
  Mail,
  MessageCircle,
  Coins,
  CreditCard,
  Database,
  ArrowRightLeft
} from 'lucide-react';
import { Customer, ProfitLeak, Product } from '../types';

interface DashboardProps {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  leaks: ProfitLeak[];
  setLeaks: React.Dispatch<React.SetStateAction<ProfitLeak[]>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  onTabChange: (tab: any) => void;
  theme: 'light' | 'dark';
  profile: {
    storeName: string;
    ownerName: string;
    email: string;
    phone: string;
    tier: string;
  };
  ariaName?: string;
  ariaTone?: string;
  ariaAvatar?: string;
  seedStarterData?: () => void;
}

export default function Dashboard({
  customers,
  setCustomers,
  leaks,
  setLeaks,
  products,
  setProducts,
  onTabChange,
  theme,
  profile,
  ariaName = "Aria AI",
  ariaTone = "Helpful & Professional",
  ariaAvatar = "🤖",
  seedStarterData
}: DashboardProps) {
  
  // TOKENS STATE - Platform takes tokens per duration, requires payment when drained
  const [tokens, setTokens] = useState<number>(() => {
    const saved = localStorage.getItem('cognitive_tokens');
    return saved ? parseInt(saved, 10) : 3420;
  });
  const maxTokens = 5000;
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [refillTier, setRefillTier] = useState<'micro' | 'mega' | 'infinite'>('mega');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    localStorage.setItem('cognitive_tokens', tokens.toString());
  }, [tokens]);

  // Real-time automatic data ticking simulator (Active Command Center Simulation)
  useEffect(() => {
    const backgroundSimInterval = setInterval(() => {
      // 1. Tick down tokens slightly representing automatic ongoing ARIA background scans (-1 token every 12 seconds)
      setTokens(prev => {
        if (prev > 10) {
          const nextVal = prev - 1;
          localStorage.setItem('cognitive_tokens', nextVal.toString());
          return nextVal;
        }
        return prev;
      });

      // 2. Chance of generating a live system telemetry notification alert
      if (Math.random() < 0.28) {
        const simActivities = [
          { msg: 'Aria scanned checkout reserves: All supply thresholds safe.', type: 'reply' as const },
          { msg: 'Automatic sync triggered inside CostGuard CFO index ledger.', type: 'cost' as const },
          { msg: 'Incoming WhatsApp query queued from Sarah Miller regarding reorders.', type: 'reply' as const },
          { msg: 'Live diagnostic audit completed on B2B wholesale coffee logs.', type: 'stock' as const },
          { msg: 'Aria prevented low reserve stockout on Silicone cases.', type: 'stock' as const },
          { msg: 'Security firewall verified: Encrypted SSL SIP lines stable.', type: 'cost' as const }
        ];
        
        const randomFeed = simActivities[Math.floor(Math.random() * simActivities.length)];
        const curTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        setActivityLogs(prev => [
          {
            id: `sim_log_${Date.now()}`,
            msg: randomFeed.msg,
            time: curTime,
            type: randomFeed.type
          },
          ...prev.slice(0, 7) // keep it tidy
        ]);

        showToast(`⚡ Telemetry: ${randomFeed.msg}`);
      }
    }, 15000); // Check every 15 seconds to simulate an active, humming enterprise cloud engine!

    return () => clearInterval(backgroundSimInterval);
  }, []);

  // Toast / Notifications State
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Aria Speaking State
  const [ariaSpeech, setAriaSpeech] = useState<string>(
    `Operational alert, ${profile.ownerName || 'Operator'}. Our real-time audits suggest $2,340 is currently at risk across VIP channels, but we have identified $3,100 in high-probability opportunities.`
  );
  const [ariaMode, setAriaMode] = useState<'idle' | 'speaking' | 'thinking'>('speaking');
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [customQuestion, setCustomQuestion] = useState("");

  // Activity Feed Logging State
  const [activityLogs, setActivityLogs] = useState<Array<{ id: string; msg: string; time: string; type: 'reply' | 'stock' | 'cost' }>>([
    { id: 'log-1', msg: 'Aria replied to James on WhatsApp: "Want 5 kits..."', time: '2:15 PM', type: 'reply' },
    { id: 'log-2', msg: 'Stock warning threshold triggered: "iPhone cases" low', time: '1:12 PM', type: 'stock' },
    { id: 'log-3', msg: 'Cost expansion flag: Electricity invoice variance +34%', time: '11:05 AM', type: 'cost' },
    { id: 'log-4', msg: 'Core Win-back sequence approved for @wanderlust_shop', time: '9:40 AM', type: 'reply' }
  ]);

  // Derived core variables
  const highRiskCustomersCount = customers.filter(c => c.riskLevel === 'HIGH' && c.status === 'pending').length;
  const currentRiskSum = customers.filter(c => c.riskLevel === 'HIGH' && c.status === 'pending').reduce((sum, c) => sum + c.revenue, 0) || 2340;
  const resolvedCount = customers.filter(c => c.status === 'executed').length;

  const activeLeaksCount = leaks.filter(l => !l.resolved).length;
  const currentProfitValue = 4820 + (leaks.filter(l => l.resolved).length * 150);
  
  const opportunitiesCount = customers.filter(c => c.status === 'pending').length || 10;
  const currentOpportunitiesSum = 3100 - (resolvedCount * 250);

  // Audio Reading
  const speakText = (text: string) => {
    if (!speechEnabled) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setAriaMode('speaking');
      utterance.onend = () => setAriaMode('idle');
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech API is blocked or unavailable.", e);
    }
  };

  // Interact with custom query
  const handleAriaInteraction = (val: string) => {
    if (!val.trim()) return;
    
    // Deduct tokens
    if (tokens < 45) {
      showToast("⚠️ Out of Cognitive Tokens! Please refill your Token Tank first.");
      setShowTokenModal(true);
      return;
    }
    
    setTokens(prev => Math.max(0, prev - 45));
    setAriaMode('thinking');
    
    setTimeout(() => {
      let resolvedSpeech = "";
      const query = val.toLowerCase();
      
      if (query.includes("leak") || query.includes("profit") || query.includes("cost")) {
        resolvedSpeech = `Inspect costguard logs! We detected ${activeLeaksCount} leaks costed out. Plucking third-party software subscriptions immediately safeguards $${activeLeaksCount * 140}/month.`;
      } else if (query.includes("retention") || query.includes("risk") || query.includes("unpaid")) {
        resolvedSpeech = `Aria RetainFlow update: ${highRiskCustomersCount} high risk VIP accounts were located. Distributing our loyalty auto-coupons locks in the $${currentRiskSum} annual run rate.`;
      } else if (query.includes("stock") || query.includes("supply") || query.includes("reorder")) {
        resolvedSpeech = `Our critical stocking lines are currently monitored. iPhone accessories require a standard restock sequence of 200 units to bypass high shipping overheads.`;
      } else {
        resolvedSpeech = `I have completed a holistic analysis on your operations database. Our aggregate health score sits solid. Leverage active token reserves to audit downstream streams.`;
      }

      setAriaSpeech(resolvedSpeech);
      setAriaMode('speaking');
      speakText(resolvedSpeech);
      
      // Append activity log
      const newLog = {
        id: `log-${Date.now()}`,
        msg: `Aria processed telemetry query: "${val}"`,
        time: 'Just now',
        type: 'reply' as const
      };
      setActivityLogs(prev => [newLog, ...prev]);
    }, 1100);
  };

  // Launch automatic win back recovery on at risk customers
  const handleRecoverAtRisk = () => {
    if (tokens < 120) {
      showToast("⚠️ Critical Refill Required: Launching win-back engine requires 120 tokens.");
      setShowTokenModal(true);
      return;
    }

    setTokens(prev => Math.max(0, prev - 120));
    setCustomers(prev => prev.map(c => c.riskLevel === 'HIGH' ? { ...c, status: 'executed' } : c));
    showToast("🚀 Win-Back Sequence Authorized! Aria distributed bulk auto-discounts across 3 high-risk channels!");
    
    setAriaSpeech("Dispatched personalized re-engagements successfully. Silent customer counts saved. Risk exposure cleared.");
    speakText("Dispatched personalized re-engagements successfully.");

    setActivityLogs(prev => [
      { id: `log-act-${Date.now()}`, msg: 'Win-back campaigns mass-broadcasted successfully', time: 'Just now', type: 'reply' },
      ...prev
    ]);
  };

  const handleRefillPremiumTokens = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      let added = 2000;
      if (refillTier === 'micro') added = 1000;
      if (refillTier === 'mega') added = 2500;
      if (refillTier === 'infinite') added = 5000;

      setTokens(prev => Math.min(maxTokens, prev + added));
      setIsProcessingPayment(false);
      setShowTokenModal(false);
      showToast(`⚡ payment Successful! Charged card. Refilled ${added} Cognitive Tokens into your active tank!`);
    }, 1800);
  };

  const isDark = theme === 'dark';
  const cardBgCls = isDark ? 'bg-stone-900 border-stone-800 text-white shadow-xl' : 'bg-white border-stone-200 text-[#1C1917] shadow-sm';
  const textTitleCls = isDark ? 'text-white' : 'text-stone-900';
  const textBodyCls = isDark ? 'text-stone-200' : 'text-stone-700';
  const textMutedCls = isDark ? 'text-[#E7E5E4] font-medium' : 'text-neutral-500';
  const borderLineCls = isDark ? 'border-stone-800' : 'border-stone-100';

  return (
    <div className="space-y-4 max-h-[calc(100vh-140px)] flex flex-col overflow-hidden">
      
      {/* Toast Alert Banner */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed top-24 right-6 z-50 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-mono text-[10.5px] font-black uppercase tracking-wider border bg-black border-amber-500/50 text-amber-400 select-none"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#32CD32] animate-ping" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Greet Header & Charging Token Indicator */}
      <div className={`p-4 px-5 rounded-[24px] border flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 shrink-0 ${cardBgCls}`}>
        <div>
          <div className="flex items-center gap-1.5 mb-1 bg-transparent">
            <span className="text-[9.5px] font-black uppercase bg-amber-500/10 text-amber-500 px-2.5 py-0.5 rounded-md border border-amber-500/20 tracking-wider font-mono">
              {ariaName} Workspace Active Model
            </span>
          </div>
          <h2 className="text-lg font-black tracking-tight leading-none text-white select-none">
            Welcome Back, <span className="text-amber-500 font-extrabold">{profile.ownerName || 'Operator'}</span>
          </h2>
          <p className="text-[10.5px] text-stone-200 mt-0.5">
            Holistic Command Center analysis on <span className="font-semibold text-amber-500">{profile.storeName || 'Wholesale Group'}</span>. Actionable directives synchronized.
          </p>
        </div>

        {/* COGNITIVE TOKEN ACTIVE METER AND CHARGING TANK */}
        <div className="flex items-center gap-3 bg-[#171513] border border-stone-800 p-2.5 rounded-2xl select-none max-w-full">
          <div className="text-left">
            <span className="text-[8px] font-extrabold uppercase text-stone-200 tracking-widest font-mono block">Cognitive Token Reserves</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[12px] font-mono font-black text-amber-500">{tokens.toLocaleString()}</span>
              <span className="text-[8.5px] text-stone-400 font-semibold">/ {maxTokens} tokens remaining</span>
            </div>
            
            {/* Battery Charging Tank Progress wrapper */}
            <div className="w-[140px] bg-stone-800 h-1.5 rounded-full overflow-hidden mt-1 bg-neutral-800 border border-stone-900">
              <div 
                className={`h-full transition-all duration-500 rounded-full ${
                  tokens < 1000 ? 'bg-red-500' : tokens < 2500 ? 'bg-amber-500' : 'bg-emerald-400'
                }`}
                style={{ width: `${(tokens / maxTokens) * 100}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => setShowTokenModal(true)}
            className="px-3 py-1.5 bg-gradient-to-tr from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black text-[9px] font-black tracking-wider uppercase rounded-xl transition-all shadow-md shrink-0 flex items-center gap-1 cursor-pointer"
          >
            <Zap size={10} className="fill-black animate-pulse" />
            <span>Refill Tank</span>
          </button>
        </div>
      </div>

      {/* THREE BENTO CARDS TOP ROW (Fluid high contrast bento) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 shrink-0">
        
        {/* BENTO 1: REVENUE AT RISK (Red pulsing border) */}
        <div className={`p-4 rounded-[22px] border relative overflow-hidden transition-all flex flex-col justify-between hover:scale-[1.01] ${cardBgCls} border-red-500/40 shadow-lg`}>
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[9px] font-black uppercase text-red-400 tracking-wider font-mono">Revenue At Risk</span>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            </div>
            <div className="flex items-baseline gap-1 bg-transparent">
              <h3 className="text-xl font-mono font-black text-white">${currentRiskSum.toLocaleString()}</h3>
              <span className="text-[9px] text-red-400 font-semibold tracking-wide">at risk right now</span>
            </div>

            <div className="space-y-1.5 mt-3 pt-3 border-t border-stone-800/80">
              <p className="text-[10px] text-stone-200 select-text font-medium flex items-center gap-1">
                <span className="text-red-500">→</span> <strong>3</strong> VIP customers silent: <span className="font-mono text-red-400 font-black">$1,200</span>
              </p>
              <p className="text-[10px] text-stone-200 select-text font-medium flex items-center gap-1">
                <span className="text-red-500">→</span> <strong>2</strong> stockouts this cycle: <span className="font-mono text-red-400 font-black">$840</span>
              </p>
              <p className="text-[10px] text-stone-200 select-text font-medium flex items-center gap-1">
                <span className="text-red-500">→</span> <strong>1</strong> unpaid SLA invoice: <span className="font-mono text-red-400 font-black">$300</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRecoverAtRisk}
            className="w-full mt-4 py-1.5 px-3 bg-red-500 hover:bg-red-600 text-white font-extrabold text-[9.5px] uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md text-center shrink-0 flex items-center justify-center gap-1.5"
          >
            <ShieldAlert size={11} className="animate-bounce" />
            <span>Recover Risk Now</span>
          </button>
        </div>

        {/* BENTO 2: ACTIVE PROFIT (Green border) */}
        <div className={`p-4 rounded-[22px] border relative overflow-hidden transition-all flex flex-col justify-between hover:scale-[1.01] ${cardBgCls} border-emerald-500/40 shadow-lg`}>
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
          <div>
            <div className="flex justify-between items-center mb-1 bg-transparent">
              <span className="text-[9px] font-black uppercase text-emerald-400 tracking-wider font-mono">Active Profit Safeguard</span>
              <span className="text-[8.5px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded-full font-bold">+12.4% vs last month ↑</span>
            </div>
            <div className="flex items-baseline gap-1.5 bg-transparent">
              <h3 className="text-xl font-mono font-black text-white">${currentProfitValue.toLocaleString()}</h3>
              <span className="text-[9.5px] text-emerald-400 font-bold uppercase tracking-wider font-mono">34% NET MARGIN</span>
            </div>

            <div className="space-y-1.5 mt-3 pt-3 border-t border-stone-800/80">
              <p className="text-[10px] text-stone-200 select-text font-medium flex items-center gap-1">
                <span className="text-emerald-500">✓</span> Burn category optimized: <span className="font-mono text-emerald-400 font-black">98% safe</span>
              </p>
              <p className="text-[10px] text-stone-200 select-text font-medium flex items-center gap-1">
                <span className="text-emerald-500">✓</span> Cash Runway count: <span className="font-mono text-emerald-400 font-black">150 days runway</span>
              </p>
              <p className="text-[10px] text-stone-200 select-text font-medium flex items-center gap-1">
                <span className="text-emerald-500">✓</span> Profit Leaks monitored: <span className="font-mono text-red-400 font-black">-${activeLeaksCount*140}/mo</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onTabChange('costguard');
              showToast("💼 Navigated to CostGuard AI CFO ledger!");
            }}
            className="w-full mt-4 py-1.5 px-3 bg-[#111] hover:bg-stone-950 text-emerald-400 border border-emerald-500/30 font-black text-[9.5px] uppercase tracking-wider rounded-xl transition-all cursor-pointer text-center"
          >
            <span>View Cost Breakdown →</span>
          </button>
        </div>

        {/* BENTO 3: ACTIVE OPPORTUNITIES (Amber border) */}
        <div className={`p-4 rounded-[22px] border relative overflow-hidden transition-all flex flex-col justify-between hover:scale-[1.01] ${cardBgCls} border-amber-500/40 shadow-lg`}>
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
          <div>
            <div className="flex justify-between items-center mb-1 bg-transparent">
              <span className="text-[9px] font-black uppercase text-amber-500 tracking-wider font-mono">Active Opportunities</span>
              <span className="text-[8.5px] font-black bg-amber-500/10 text-amber-500 px-1.5 py-0.2 rounded font-mono uppercase">pipeline scanning</span>
            </div>
            <div className="flex items-baseline gap-1 bg-transparent">
              <h3 className="text-xl font-mono font-black text-white">${currentOpportunitiesSum.toLocaleString()}</h3>
              <span className="text-[9px] text-stone-200 font-medium italic">in open value channels</span>
            </div>

            <div className="space-y-1.5 mt-3 pt-3 border-t border-stone-800/80">
              <p className="text-[10px] text-stone-200 select-text font-medium flex items-center gap-1">
                <span className="text-amber-500">→</span> <strong>5</strong> wholesale leads: <span className="font-mono text-amber-500 font-black">$1,800 pipe</span>
              </p>
              <p className="text-[10px] text-stone-200 select-text font-medium flex items-center gap-1">
                <span className="text-amber-500">→</span> <strong>3</strong> win-back prospects: <span className="font-mono text-amber-500 font-black">$900 potential</span>
              </p>
              <p className="text-[10px] text-stone-200 select-text font-medium flex items-center gap-1">
                <span className="text-amber-500">→</span> <strong>2</strong> upsell signals logged: <span className="font-mono text-amber-500 font-black">$400 value</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onTabChange('retainflow');
              showToast("📈 Navigated to RetainFlow VIP Loyalty metrics!");
            }}
            className="w-full mt-4 py-1.5 px-3 bg-[#111] hover:bg-stone-950 text-amber-500 border border-amber-500/30 font-black text-[9.5px] uppercase tracking-wider rounded-xl transition-all cursor-pointer text-center"
          >
            <span>Target VIP Pipeline →</span>
          </button>
        </div>

      </div>

      {/* CENTERPIECE: ARIA CORE INDEX (The main command panel block) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch min-h-0 flex-grow overflow-hidden select-none">
        
        {/* Main large card taking col-span-8 */}
        <section className={`col-span-12 lg:col-span-8 p-4.5 rounded-[24px] border flex flex-col justify-between overflow-y-auto scrollbar-none relative ${cardBgCls}`}>
          {/* Top border glowing strip */}
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600"></div>

          <div className="space-y-4">
            
            {/* Interactive Header bar inside Centerpiece */}
            <div className="flex justify-between items-center bg-transparent shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-500 flex items-center justify-center border border-amber-500/20">
                  <Bot size={15} className="animate-spin animate-duration-3000" />
                </div>
                <div>
                  <h3 className="font-extrabold text-[12px] uppercase text-white tracking-widest font-mono">
                    {ariaName} Core Cognitive Index
                  </h3>
                  <p className="text-[9.5px] text-stone-200 uppercase font-mono tracking-wider font-semibold">Cognitive Agent Active</p>
                </div>
              </div>

              {/* Sound speaking volume switch */}
              <button
                type="button"
                onClick={() => {
                  setSpeechEnabled(!speechEnabled);
                  showToast(speechEnabled ? "🔇 voice feedback muted" : "🔊 Realtime speech reading activated!");
                }}
                className={`p-1.5 rounded-lg transition-all ${
                  speechEnabled ? 'bg-amber-500 text-black shadow-md' : 'bg-stone-850 hover:bg-stone-800 text-white border border-stone-800'
                }`}
                title={speechEnabled ? "Mute Aria vocal answers" : "Speak results out loud"}
              >
                {speechEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
              </button>
            </div>

            {/* Vocal Audio Subtitles Box & Speech output */}
            <div className="p-3.5 bg-black/55 border border-stone-800/80 rounded-2xl flex flex-col sm:flex-row items-center gap-4 text-left">
              {/* Spinning circular visualizer */}
              <div className="relative shrink-0 flex items-center justify-center p-1 cursor-pointer" onClick={() => handleAriaInteraction("audit state")}>
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center justify-center text-xl border border-white/20">
                  {ariaAvatar}
                </div>
                <div className="absolute -bottom-1 text-[7px] font-black uppercase text-amber-500 bg-[#141210] border border-stone-800 px-1.5 rounded-full select-none tracking-wider py-0.5 shadow-md">
                  {ariaMode.toUpperCase()}
                </div>
              </div>
              
              <div className="flex-grow space-y-1 text-stone-200">
                <span className="text-[8.5px] font-mono font-black text-amber-500 uppercase tracking-widest block">Verbal Directives Summary</span>
                <p className="text-[11px] leading-relaxed italic font-semibold text-white">
                  "{ariaSpeech}"
                </p>
              </div>
            </div>

            {/* ACTIVE PRIORITY LIST SECURED */}
            <div>
              <span className="text-[8.5px] font-mono font-black text-stone-200 uppercase tracking-widest block mb-2">Priority Immediate Directives ({highRiskCustomersCount + activeLeaksCount ? highRiskCustomersCount + 1 : 3} alerts detected)</span>
              
              <div className="space-y-2 select-text">
                
                {/* 1. Silent VIP alert */}
                <div className="p-2.5 rounded-xl bg-[#171513] border border-stone-800/60 flex items-center justify-between gap-3 font-mono text-[10px]">
                  <div className="flex items-center gap-2 text-stone-100 font-bold">
                    <span className="p-1 rounded bg-red-500/10 text-red-500"><AlertTriangle size={11} /></span>
                    <span>⚠️ {highRiskCustomersCount > 0 ? highRiskCustomersCount : 3} VIP customer accounts are marked high-risk (risk: ${currentRiskSum})</span>
                  </div>
                  <button 
                    onClick={handleRecoverAtRisk} 
                    className="px-2 py-0.5 bg-amber-500 hover:bg-amber-450 text-black font-extrabold text-[8.5px] uppercase tracking-wider rounded-lg transition-all"
                  >
                    Re-engage
                  </button>
                </div>

                {/* 2. Stock Alert */}
                <div className="p-2.5 rounded-xl bg-[#171513] border border-stone-800/60 flex items-center justify-between gap-3 font-mono text-[10px]">
                  <div className="flex items-center gap-2 text-stone-100 font-bold">
                    <span className="p-1 rounded bg-amber-500/10 text-amber-500"><PackageSearch size={11} /></span>
                    <span>📦 Supply trigger: accessories inventory threshold has breached baseline values</span>
                  </div>
                  <button 
                    onClick={() => { onTabChange("stocksense"); showToast("📦 Routed to Inventory reorder module."); }} 
                    className="px-2 py-0.5 bg-amber-500 hover:bg-amber-450 text-black font-extrabold text-[8.5px] uppercase tracking-wider rounded-lg transition-all"
                  >
                    Reorder Unit
                  </button>
                </div>

                {/* 3. Margin Leaks alerts */}
                <div className="p-2.5 rounded-xl bg-[#171513] border border-stone-800/60 flex items-center justify-between gap-3 font-mono text-[10px]">
                  <div className="flex items-center gap-2 text-stone-100 font-bold">
                    <span className="p-1 rounded bg-red-500/10 text-red-400"><Clock size={11} /></span>
                    <span>💸 Tax reserve & invoice payment discrepancy found (-${activeLeaksCount * 140}/mo leakage)</span>
                  </div>
                  <button 
                    onClick={() => { onTabChange("costguard"); showToast("💼 Routed to Profit optimization module."); }} 
                    className="px-2 py-0.5 bg-amber-500 hover:bg-amber-450 text-black font-extrabold text-[8.5px] uppercase tracking-wider rounded-lg transition-all"
                  >
                    Verify Rule
                  </button>
                </div>

              </div>
            </div>

          </div>

          {/* Prompt compilation console footer (Fixed bottom area inside layout) */}
          <div className="mt-4 pt-3 border-t border-stone-800 flex flex-col md:flex-row gap-2.5 items-center select-none bg-transparent shrink-0">
            <div className="flex flex-wrap gap-1.5 flex-1 w-full md:w-auto">
              {['Scan for Leaks', 'Check VIP Loyalty', 'Review Restock Items'].map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleAriaInteraction(tag)}
                  className="px-2.5 py-1 rounded bg-stone-950 hover:bg-stone-800 text-[10px] font-bold uppercase tracking-wider border border-stone-800 text-stone-100 transition-all cursor-pointer"
                >
                  🚀 {tag}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); if (customQuestion.trim()) { handleAriaInteraction(customQuestion); setCustomQuestion(""); } }}
              className="flex w-full md:w-[320px] bg-black rounded-lg border border-stone-800/80 p-0.5"
            >
              <input 
                type="text"
                placeholder="Ask Aria custom operations questions..."
                value={customQuestion}
                onChange={e => setCustomQuestion(e.target.value)}
                className="flex-grow px-2 py-1 text-[9.5px] bg-transparent text-white focus:outline-none placeholder-stone-500"
              />
              <button 
                type="submit" 
                className="px-3 py-1 bg-amber-500 text-black text-[9px] font-black uppercase rounded"
              >
                Query
              </button>
            </form>
          </div>
        </section>

        {/* Live dynamic telemetry feed (taking col-span-4) */}
        <section className={`col-span-12 lg:col-span-4 p-4.5 rounded-[24px] border flex flex-col justify-between overflow-hidden relative ${cardBgCls}`}>
          <div className="flex flex-col h-full overflow-hidden justify-between">
            
            <div className="shrink-0 mb-3 select-none">
              <span className="text-[8px] font-mono font-black text-amber-500 uppercase tracking-widest block mb-1">Aria Live Audit Stream</span>
              <h3 className="font-extrabold text-[12px] uppercase text-white tracking-widest font-mono">Cognitive Activity Log</h3>
            </div>

            {/* Dynamic Activity Feed list scrolls internally logs */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-none my-1 select-text">
              {activityLogs.map((log) => (
                <div key={log.id} className="p-2.5 rounded-xl bg-stone-950 border border-stone-850 flex flex-col gap-1 transition-all">
                  <div className="flex justify-between items-center w-full bg-transparent">
                    <span className={`text-[8px] font-mono uppercase font-black tracking-wider px-1.5 py-0.5 rounded-md ${
                      log.type === 'stock' ? 'bg-amber-500/10 text-amber-500' : log.type === 'cost' ? 'bg-red-500/15 text-red-400' : 'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      {log.type}
                    </span>
                    <span className="text-[8px] text-stone-200 font-mono">{log.time}</span>
                  </div>
                  <p className="text-[10px] leading-relaxed font-bold text-stone-100 font-sans leading-normal">
                    {log.msg}
                  </p>
                </div>
              ))}
            </div>

            {/* Simulated Live Connection indicators as credit nodes */}
            <div className="pt-2.5 border-t border-stone-850 shrink-0 text-center select-none bg-transparent">
              <div className="flex items-center justify-between text-[8.5px] text-stone-200 font-mono">
                <span className="flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active Connections: 5
                </span>
                <span className="font-bold flex items-center gap-1 text-emerald-400">
                  ⚡ 0.04ms telemetry
                </span>
              </div>
            </div>

          </div>
        </section>

      </div>

      {/* BOTTOM ROW: LIVE INBOX STRIP (Horizontal scrolling inbox strip) */}
      <section className={`p-4 rounded-[24px] border flex flex-col gap-3 shrink-0 ${cardBgCls} bg-black border-amber-500/10`}>
        <div className="flex justify-between items-center select-none shrink-0 bg-transparent">
          <div className="flex items-baseline gap-2 bg-transparent">
            <h4 className="font-extrabold text-[11px] text-white uppercase tracking-wider font-mono">Live Messaging Strip (click routing tag)</h4>
            <span className="text-[8.5px] text-stone-200">Across central social streams directly</span>
          </div>

          <button
            onClick={() => {
              onTabChange("social_omni");
              showToast("📥 Switched tab to Unified Social Inbox!");
            }}
            className="text-[9.5px] text-amber-500 hover:text-amber-400 font-black uppercase flex items-center gap-1 transition-all cursor-pointer font-mono"
          >
            <span>Omni Inbox</span>
            <ArrowRight size={10} />
          </button>
        </div>

        {/* Horizontal container */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none flex-nowrap w-full">
          
          {/* WhatsApp */}
          <div 
            onClick={() => { onTabChange("social_omni"); showToast("Routed via WhatsApp Stream FILTER"); }}
            className="min-w-[190px] max-w-[210px] shrink-0 p-3 bg-stone-900 hover:bg-stone-850 border border-stone-800 rounded-xl cursor-pointer transition-all flex flex-col gap-1 shadow-sm font-mono active:scale-95"
          >
            <div className="flex justify-between items-center w-full bg-transparent">
              <span className="text-[9px] text-emerald-400 font-black uppercase flex items-center gap-1"><MessageCircle size={10} /> WhatsApp</span>
              <span className="px-1.5 py-0.2 bg-red-500 text-white text-[7.5px] font-black rounded-full animate-pulse">3</span>
            </div>
            <p className="text-[10px] font-extrabold text-white truncate truncate-ellipsis mt-0.5">James (B2B wholesale)</p>
            <p className="text-[9px] text-stone-300 truncate font-sans">"Can I get a 10% discount if..."</p>
          </div>

          {/* Instagram */}
          <div 
            onClick={() => { onTabChange("social_omni"); showToast("Routed via Instagram Stream FILTER"); }}
            className="min-w-[190px] max-w-[210px] shrink-0 p-3 bg-stone-900 hover:bg-stone-850 border border-stone-800 rounded-xl cursor-pointer transition-all flex flex-col gap-1 shadow-sm font-mono active:scale-95"
          >
            <div className="flex justify-between items-center w-full bg-transparent">
              <span className="text-[9px] text-pink-400 font-black uppercase flex items-center gap-1"><Instagram size={10} /> Instagram</span>
              <span className="px-1.5 py-0.2 bg-red-500 text-white text-[7.5px] font-black rounded-full animate-pulse">1</span>
            </div>
            <p className="text-[10px] font-extrabold text-white truncate truncate-ellipsis mt-0.5">@wanderlust_shop</p>
            <p className="text-[9px] text-stone-300 truncate font-sans">"Smart accessory kits are awesome!"</p>
          </div>

          {/* Email */}
          <div 
            onClick={() => { onTabChange("social_omni"); showToast("Routed via Email Stream FILTER"); }}
            className="min-w-[190px] max-w-[210px] shrink-0 p-3 bg-stone-900 hover:bg-stone-850 border border-stone-800 rounded-xl cursor-pointer transition-all flex flex-col gap-1 shadow-sm font-mono active:scale-95"
          >
            <div className="flex justify-between items-center w-full bg-transparent">
              <span className="text-[9px] text-purple-400 font-black uppercase flex items-center gap-1"><Mail size={10} /> Email (Gmail)</span>
              <span className="px-1.5 py-0.2 bg-red-500 text-white text-[7.5px] font-black rounded-full animate-pulse">5</span>
            </div>
            <p className="text-[10px] font-extrabold text-white truncate truncate-ellipsis mt-0.5">SLA Dispatcher (Carlos)</p>
            <p className="text-[9px] text-stone-300 truncate font-sans">"Check winter schedules for Madrid..."</p>
          </div>

          {/* FaceBook */}
          <div 
            onClick={() => { onTabChange("social_omni"); showToast("Routed via Messenger Stream FILTER"); }}
            className="min-w-[190px] max-w-[210px] shrink-0 p-3 bg-stone-900 hover:bg-stone-850 border border-stone-800 rounded-xl cursor-pointer transition-all flex flex-col gap-1 shadow-sm font-mono active:scale-95"
          >
            <div className="flex justify-between items-center w-full bg-transparent">
              <span className="text-[9px] text-blue-400 font-black uppercase flex items-center gap-1"><Facebook size={10} /> Facebook</span>
              <span className="px-1.5 py-0.2 bg-red-500 text-white text-[7.5px] font-black rounded-full animate-pulse">2</span>
            </div>
            <p className="text-[10px] font-extrabold text-white truncate truncate-ellipsis mt-0.5">David Warner</p>
            <p className="text-[9px] text-stone-300 truncate font-sans">"My premium kit orders states pending..."</p>
          </div>

          {/* Telegram */}
          <div 
            onClick={() => { onTabChange("social_omni"); showToast("Routed via Telegram Stream FILTER"); }}
            className="min-w-[190px] max-w-[210px] shrink-0 p-3 bg-stone-900 hover:bg-stone-850 border border-stone-800 rounded-xl cursor-pointer transition-all flex flex-col gap-1 shadow-sm font-mono active:scale-95"
          >
            <div className="flex justify-between items-center w-full bg-transparent">
              <span className="text-[9px] text-sky-400 font-black uppercase flex items-center gap-1"><Send size={10} /> Telegram</span>
              <span className="px-1.5 py-0.2 bg-stone-800 text-stone-350 text-[7.5px] font-black rounded-full">0</span>
            </div>
            <p className="text-[10px] font-extrabold text-white truncate truncate-ellipsis mt-0.5">Elena Petrova</p>
            <p className="text-[9px] text-stone-300 truncate font-sans">"API endpoint custom rate query..."</p>
          </div>

        </div>
      </section>

      {/* COGNITIVE TOKENS REFILL TANK IN-APP CHECKOUT DIALOG */}
      <AnimatePresence>
        {showTokenModal && (
          <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#1C1917] border border-stone-800 rounded-[28px] p-6 max-w-md w-full text-white space-y-4 shadow-2xl relative font-sans"
            >
              {/* Glowing header line */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-t-[28px]"></div>

              <div className="flex justify-between items-start bg-transparent">
                <div>
                  <span className="text-[8.5px] font-black uppercase text-amber-500 font-mono tracking-widest block mb-0.5">Secure Transaction Panel</span>
                  <h3 className="text-md font-black text-white flex items-center gap-1">
                    <Zap className="fill-amber-500 text-amber-500 animate-pulse" size={16} />
                    Refill Cognitive Token Tank
                  </h3>
                </div>
                <button 
                  onClick={() => setShowTokenModal(false)}
                  className="p-1 px-2.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-200 hover:text-white transition-all text-xs"
                >
                  ✕
                </button>
              </div>

              <p className="text-[11px] text-stone-200 leading-relaxed font-semibold">
                Aria runs deep telemetry audits, drafts customer auto-replies, and triggers re-engagements. These actions consume real Sandbox cognitive computing tokens. Select a refill package to continue:
              </p>

              {/* Tiers choosing list */}
              <div className="space-y-2 bg-transparent select-none">
                
                {/* 1. Micro */}
                <button
                  type="button"
                  onClick={() => setRefillTier('micro')}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex justify-between items-center ${
                    refillTier === 'micro' 
                      ? 'bg-amber-500/10 border-amber-500/60 text-amber-500' 
                      : 'bg-stone-900/60 border-stone-850 text-stone-200 hover:bg-stone-900'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-black block">Basic Token Refill</span>
                    <span className="text-[10px] text-stone-300 font-medium block">Adds 1,000 Sandbox tokens to active reserve</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-mono font-black block">$9.00</span>
                    <span className="text-[8px] text-stone-400 block font-mono">one-time charge</span>
                  </div>
                </button>

                {/* 2. Mega (Recommended) */}
                <button
                  type="button"
                  onClick={() => setRefillTier('mega')}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex justify-between items-center relative overflow-hidden ${
                    refillTier === 'mega' 
                      ? 'bg-amber-500/10 border-amber-500/60 text-amber-500' 
                      : 'bg-stone-900/60 border-stone-850 text-stone-200 hover:bg-stone-900'
                  }`}
                >
                  <span className="absolute top-0 right-3 bg-amber-500 text-black text-[7px] font-black uppercase px-2 py-0.5 rounded-b font-mono tracking-wider">RECOMMENDED</span>
                  <div className="space-y-0.5">
                    <span className="text-xs font-black block">Standard Charging Tank</span>
                    <span className="text-[10px] text-stone-300 font-medium block">Adds 2,500 Sandbox tokens to active reserve</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-mono font-black block">$19.00</span>
                    <span className="text-[8px] text-stone-400 block font-mono">one-time charge</span>
                  </div>
                </button>

                {/* 3. Infinite */}
                <button
                  type="button"
                  onClick={() => setRefillTier('infinite')}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex justify-between items-center ${
                    refillTier === 'infinite' 
                      ? 'bg-amber-500/10 border-amber-500/60 text-amber-500' 
                      : 'bg-stone-900/60 border-stone-850 text-stone-200 hover:bg-stone-900'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-black block">Mega Professional reserves</span>
                    <span className="text-[10px] text-stone-300 font-medium block">Adds 5,000 Sandbox tokens to active reserve</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-mono font-black block">$29.00</span>
                    <span className="text-[8px] text-stone-400 block font-mono">one-time charge</span>
                  </div>
                </button>

              </div>

              {/* Secure strip details */}
              <div className="p-3 bg-stone-950 rounded-xl border border-stone-900 text-stone-200 flex items-center gap-2 font-mono text-[9.5px]">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span>Compliant Checkout via Sandbox Gateway (Card ending 4242)</span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowTokenModal(false)}
                  className="flex-1 py-2 rounded-xl bg-stone-900 hover:bg-stone-850 text-stone-200 border border-stone-800 text-[10.5px] font-bold uppercase transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRefillPremiumTokens}
                  disabled={isProcessingPayment}
                  className="flex-grow py-2 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 text-black text-[10.5px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-75 focus:outline-none"
                >
                  {isProcessingPayment ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                      <span>Processing Payment...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard size={12} />
                      <span>Authorize Refill & Credit</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
