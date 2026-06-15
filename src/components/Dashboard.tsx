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
  Instagram,
  Mail,
  MessageCircle,
  Coins,
  CreditCard,
  Plus,
  Sliders
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
  isSimulatingLive: boolean;
  setIsSimulatingLive: (val: boolean) => void;
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
  seedStarterData,
  isSimulatingLive,
  setIsSimulatingLive
}: DashboardProps) {
  const [tokens, setTokens] = useState<number>(() => {
    const saved = localStorage.getItem('cognitive_tokens');
    return saved ? parseInt(saved, 10) : 3420;
  });
  const maxTokens = 5000;
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [refillTier, setRefillTier] = useState<'micro' | 'mega' | 'infinite'>('mega');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [customQuestion, setCustomQuestion] = useState("");
  const [ariaMode, setAriaMode] = useState<'idle' | 'speaking' | 'thinking'>('speaking');

  const [liveHealth, setLiveHealth] = useState(isSimulatingLive ? 74 : 0);
  const [liveMargin, setLiveMargin] = useState(isSimulatingLive ? 34 : 0);
  const [liveOpportunities, setLiveOpportunities] = useState(isSimulatingLive ? 3200 : 0);
  const [liveConversations, setLiveConversations] = useState(isSimulatingLive ? 47 : 0);
  const [liveResolved, setLiveResolved] = useState(isSimulatingLive ? 41 : 0);
  const [liveEscalated, setLiveEscalated] = useState(isSimulatingLive ? 6 : 0);

  const [ariaSpeech, setAriaSpeech] = useState<string>(
    isSimulatingLive
      ? `Good morning, ${profile.ownerName || 'Operator'}. Your overall Business Health Score stands at 74/100, up five points. I have highlighted three critical actions in your Daily Brief that can protect $420 in margin today.`
      : `Hello, ${profile.ownerName || 'Operator'}. Unified business telemetry trackers are currently unlinked. Connect your active channels below to align real-time metrics instantly.`
  );

  // Activity feed is fully localized in plain human English
  const [activityLogs, setActivityLogs] = useState<Array<{ id: string; msg: string; time: string; type: 'reply' | 'stock' | 'cost' }>>(() => {
    if (isSimulatingLive) {
      return [
        { id: 'log-1', msg: 'Aria auto-replied to James on WhatsApp: "Order confirmation received, dispatching in 4 hours."', time: '2:15 PM', type: 'reply' },
        { id: 'log-2', msg: 'Stock alert sent: "iPhone accessories" are running low. Tap Restock to draft supplier order.', time: '1:12 PM', type: 'stock' },
        { id: 'log-3', msg: 'Cost spike flagged: Adobe creative subscription price climbed by +34%. Consider canceling.', time: '11:05 AM', type: 'cost' },
        { id: 'log-4', msg: 'Core Win-back sequence approved for Maria Santos (@wanderlust_shop).', time: '9:40 AM', type: 'reply' }
      ];
    }
    return [];
  });

  const startLiveSimulation = () => {
    setIsSimulatingLive(true);
    localStorage.setItem('omni_dashboard_simulating', 'true');
    showToast("📡 Connecting real-time telemetry adapters...");

    let currentH = 0;
    let currentM = 0;
    let currentO = 0;
    let currentC = 0;
    let currentR = 0;
    let currentE = 0;

    const timer = setInterval(() => {
      let done = true;
      if (currentH < 74) { currentH += 2; if (currentH > 74) currentH = 74; setLiveHealth(currentH); done = false; }
      if (currentM < 34) { currentM += 1; if (currentM > 34) currentM = 34; setLiveMargin(currentM); done = false; }
      if (currentO < 3200) { currentO += 160; if (currentO > 3200) currentO = 3200; setLiveOpportunities(currentO); done = false; }
      if (currentC < 47) { currentC += 2; if (currentC > 47) currentC = 47; setLiveConversations(currentC); done = false; }
      if (currentR < 41) { currentR += 2; if (currentR > 41) currentR = 41; setLiveResolved(currentR); done = false; }
      if (currentE < 6) { currentE += 1; if (currentE > 6) currentE = 6; setLiveEscalated(currentE); done = false; }

      if (done) {
        clearInterval(timer);
        setAriaSpeech(`Good morning, ${profile.ownerName || 'Operator'}. Your overall Business Health Score stands at 74/100, up five points. I have highlighted three critical actions in your Daily Brief that can protect $420 in margin today.`);
        setActivityLogs([
          { id: 'log-1', msg: 'Aria auto-replied to James on WhatsApp: "Order confirmation received, dispatching in 4 hours."', time: '2:15 PM', type: 'reply' },
          { id: 'log-2', msg: 'Stock alert sent: "iPhone accessories" are running low. Tap Restock to draft supplier order.', time: '1:12 PM', type: 'stock' },
          { id: 'log-3', msg: 'Cost spike flagged: Adobe creative subscription price climbed by +34%. Consider canceling.', time: '11:05 AM', type: 'cost' },
          { id: 'log-4', msg: 'Core Win-back sequence approved for Maria Santos (@wanderlust_shop).', time: '9:40 AM', type: 'reply' }
        ]);
        showToast("🚀 All telemetry nodes synced live successfully!");
      }
    }, 40);
  };

  // Derived values from states
  const highRiskCustomers = customers.filter(c => c.riskLevel === 'HIGH' && c.status === 'pending');
  const currentRiskSum = isSimulatingLive 
    ? (highRiskCustomers.length > 0 ? highRiskCustomers.reduce((sum, c) => sum + c.revenue, 0) : 2340)
    : 0;

  const activeLeaksCount = isSimulatingLive ? leaks.filter(l => !l.resolved).length : 0;
  // Let's compute profit health
  const profitMarginPercent = isSimulatingLive ? liveMargin : 0;

  const opportunitiesCount = isSimulatingLive ? (customers.filter(c => c.status === 'pending').length || 8) : 0;
  const currentOpportunitiesSum = isSimulatingLive ? liveOpportunities : 0;

  // Background active simulator
  useEffect(() => {
    const interval = setInterval(() => {
      // Small background simulation
      setTokens(prev => {
        if (prev > 10) {
          const nextVal = prev - 1;
          localStorage.setItem('cognitive_tokens', nextVal.toString());
          return nextVal;
        }
        return prev;
      });

      if (isSimulatingLive && Math.random() < 0.2) {
        const events = [
          { msg: `Aria solved custom inquiry for Sarah Vance instantly on WhatsApp.`, type: 'reply' as const },
          { msg: `Stock level checked for B2B accounts. Restock draft primed for verification.`, type: 'stock' as const },
          { msg: `CostGuard identified silent duplicate SaaS invoice. Auto-disputed.`, type: 'cost' as const }
        ];
        const randomEvt = events[Math.floor(Math.random() * events.length)];
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        setActivityLogs(prev => [
          { id: `sim-log-${Date.now()}`, msg: randomEvt.msg, time: timeStr, type: randomEvt.type },
          ...prev.slice(0, 5)
        ]);

        // increment counts slightly to show live changes
        setLiveConversations(c => c + 1);
        setLiveResolved(r => r + 1);
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [isSimulatingLive]);

  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleQueryAria = (q: string) => {
    if (!q.trim()) return;
    if (tokens < 45) {
      showToast("⚠️ Out of Cognitive Tokens! Please refill your Token Tank first.");
      setShowTokenModal(true);
      return;
    }
    setTokens(prev => Math.max(0, prev - 45));
    setAriaMode('thinking');
    setTimeout(() => {
      let speech = "";
      const cleaned = q.toLowerCase();
      if (cleaned.includes("risk") || cleaned.includes("loyalty") || cleaned.includes("customer")) {
        speech = `I evaluated high-risk VIP logs. We have ${highRiskCustomers.length || 3} silent customers with a total value of $${currentRiskSum}. Deploying the personalized automatic coupon campaign immediately blocks this leak.`;
      } else if (cleaned.includes("profit") || cleaned.includes("leak") || cleaned.includes("negotiat")) {
        speech = `CostGuard report: Detected silent duplicate software charging. Canceling idle team subscriptions immediately recovers our Net Margin to 35.2%.`;
      } else if (cleaned.includes("stock") || cleaned.includes("restock") || cleaned.includes("supply")) {
        speech = `StockSense warning: iPhone accessory stocks have reached critical threshold. Lead time is 14 days, reordering 300 units next Tuesday keeps our supply chain uninterrupted.`;
      } else {
        speech = `I have run a holistic audit regarding your integrations, stock profiles, and communication queues. Everything is in order. Let me know which exact priority I should execute first.`;
      }
      setAriaSpeech(speech);
      setAriaMode('speaking');
      if (speechEnabled) {
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(speech));
      }
      setActivityLogs(prev => [
        { id: `log-${Date.now()}`, msg: `Aria processed direct command: "${q}"`, time: 'Just now', type: 'reply' },
        ...prev
      ]);
    }, 1000);
  };

  const handleBulkWinback = () => {
    if (tokens < 120) {
      showToast("⚠️ Launching bulk Winback campaign requires 120 system tokens.");
      setShowTokenModal(true);
      return;
    }
    setTokens(prev => Math.max(0, prev - 120));
    setCustomers(prev => prev.map(c => c.riskLevel === 'HIGH' ? { ...c, status: 'executed' } : c));
    showToast("🚀 Automated Winback Dispatched to silent VIP customers!");
    setAriaSpeech("Campaign launched. Dispatched personalized invitations and vouchers across 3 silent accounts. Churn risk reduced.");
    setActivityLogs(prev => [
      { id: `win-${Date.now()}`, msg: 'Automated Win-back campaigns dispatched to 3 silent customers', time: 'Just now', type: 'reply' },
      ...prev
    ]);
  };

  const isDark = theme === 'dark';
  const cardBgStyle = isDark ? 'bg-[#181614] border-stone-800/80 text-white' : 'bg-white border-stone-200 text-stone-900';

  return (
    <div className="space-y-4 max-h-[calc(100vh-140px)] flex flex-col overflow-y-auto pr-1 pb-6 scrollbar-thin">
      
      {/* Toast Alert Popup */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed top-24 right-6 z-50 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-mono text-xs font-black uppercase tracking-wider border bg-[#141210] border-amber-500/50 text-amber-400 select-none"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Real-time Telemetry WebSocket & Server-Sent Events Header Control */}
      <div className={`p-4 px-5 rounded-[22px] border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
        isSimulatingLive 
          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-sans' 
          : 'bg-amber-500/10 border-amber-500/20 text-amber-500 font-sans'
      }`}>
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isSimulatingLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-bounce'}`} />
            <h3 className="font-extrabold text-xs uppercase tracking-widest font-mono">
              {isSimulatingLive ? '📡 Real-Time Telemetry: Connected via WebSockets & SSE' : '⚠️ Telemetry Offline: Boards Empty'}
            </h3>
          </div>
          <p className="text-[11px] text-stone-300 leading-normal max-w-2xl font-sans font-medium">
            {isSimulatingLive 
              ? 'Active WebSockets & Server-Sent Events are streaming raw store queues, live client transactions, and cost-saving opportunities live.' 
              : 'Bento cards start completely empty to simulate fresh setup. Initialize our real-time simulated client-side WebSocket/SSE pump to begin raw ingestion of channel telemetry.'}
          </p>
        </div>

        {!isSimulatingLive ? (
          <button
            onClick={startLiveSimulation}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-450 text-black text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer transition-all duration-150 active:scale-95 shadow-lg shadow-amber-500/10 self-stretch md:self-auto text-center"
          >
            🔌 Connect live SSE
          </button>
        ) : (
          <button
            onClick={() => {
              setIsSimulatingLive(false);
              localStorage.setItem('omni_dashboard_simulating', 'false');
              setLiveHealth(0);
              setLiveMargin(0);
              setLiveOpportunities(0);
              setLiveConversations(0);
              setLiveResolved(0);
              setLiveEscalated(0);
              setActivityLogs([]);
              setAriaSpeech(`Hello, ${profile.ownerName || 'Operator'}. Unified business telemetry trackers are currently unlinked. Connect your active channels below to align real-time metrics instantly.`);
              showToast("🔌 Telemetry stream paused.");
            }}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-850/80 border border-stone-800 text-stone-300 hover:text-red-400 text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer transition-all self-stretch md:self-auto text-center font-mono"
          >
            Disconnect Stream
          </button>
        )}
      </div>

      {/* Trial Notice Banner */}
      <div className="py-2.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-stone-200">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <p className="text-xs font-bold uppercase tracking-wider text-amber-500">Premium Operations Trial ACTIVE</p>
          <span className="text-[10px] text-stone-300">• 12 days left for payment</span>
        </div>
        <button 
          onClick={() => onTabChange('pricing')}
          className="text-[10px] bg-amber-500 text-black px-3 py-1 font-black uppercase tracking-wider rounded-lg hover:bg-amber-400 transition-all cursor-pointer"
        >
          View Plans & Save 20%
        </button>
      </div>

      {/* Hero Header Area: Business Health Score + Daily Brief */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Business Health Score */}
        <div className={`lg:col-span-4 p-5 rounded-[24px] border flex flex-col justify-between items-center text-center ${cardBgStyle}`}>
          <div className="w-full text-left">
            <span className="text-[9px] font-mono font-black text-amber-500 uppercase tracking-widest block mb-1">AGGREGATE HEALTH METRIC</span>
            <h3 className="text-sm font-black uppercase tracking-wide">Business Health</h3>
          </div>

          <div className="my-4 relative flex items-center justify-center">
            {/* Health Score Circular ring visual */}
            <div className={`w-32 h-32 rounded-full border-[10px] flex flex-col items-center justify-center relative ${
              isSimulatingLive ? 'border-emerald-500/20' : 'border-stone-850/20'
            }`}>
              {isSimulatingLive && (
                <div className="absolute inset-0 rounded-full border-[10px] border-emerald-500 border-t-transparent border-r-transparent animate-spin animate-duration-10000 opacity-20"></div>
              )}
              <span className={`text-4xl font-mono font-black ${isSimulatingLive ? 'text-emerald-500 animate-pulse' : 'text-stone-500'}`}>
                {isSimulatingLive ? liveHealth : '--'}
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#A3A3A3]">Score / 100</span>
            </div>
          </div>

          <div className="w-full flex justify-between items-center border-t border-stone-800/60 pt-3 select-none">
            <span className="text-[11px] font-bold text-stone-300 flex items-center gap-1">
              {isSimulatingLive ? (
                <>
                  <span className="text-emerald-500">↑</span> +5 from yesterday
                </>
              ) : (
                <span className="text-stone-550">Telemetry disconnected</span>
              )}
            </span>
            <span className={`text-[8.5px] font-black font-mono uppercase px-2 py-0.5 rounded-lg ${
              isSimulatingLive 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'bg-stone-900 border border-stone-850 text-stone-400'
            }`}>
              {isSimulatingLive ? 'OPTIMAL CONDITION' : 'STANDBY'}
            </span>
          </div>
        </div>

        {/* Daily Brief from Aria */}
        <div className={`lg:col-span-8 p-5 rounded-[24px] border flex flex-col justify-between ${cardBgStyle}`}>
          <div>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-amber-500 animate-pulse" />
                <span className="text-[9px] font-mono font-black text-amber-500 uppercase tracking-widest block">DAILY EXECUTIVE INTELLIGENCE SUMMARY</span>
              </div>
              <span className="text-[10px] font-bold text-stone-300">Generated 2h ago</span>
            </div>
            <h3 className="text-md font-black uppercase tracking-wide text-white mb-2">Aria's Selected Directives</h3>
            <p className="text-xs text-stone-300 leading-relaxed font-medium mb-4">
              "Good morning, operator. Our real-time background sweeps completed successfully. I have isolated 3 primary leak sectors to secure today:"
            </p>

            {/* List of 3 actionable items */}
            <div className="space-y-2 select-text">
              <div className="p-2.5 rounded-xl bg-black/40 border border-stone-800/80 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-stone-200">
                  <span className="text-red-400 font-black">1.</span>
                  <p className="font-semibold"><strong className="text-white">Revenue Exposure:</strong> 3 VIP accounts have gone silent this week.</p>
                </div>
                <button 
                  onClick={handleBulkWinback}
                  className="px-2.5 py-1 text-[9px] bg-red-500 hover:bg-red-400 text-white font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow-md"
                >
                  Win-Back
                </button>
              </div>

              <div className="p-2.5 rounded-xl bg-black/40 border border-stone-800/80 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-stone-200">
                  <span className="text-amber-400 font-black">2.</span>
                  <p className="font-semibold"><strong className="text-white">Supply Lag:</strong> iPhone accessories reached reorder triggers.</p>
                </div>
                <button 
                  onClick={() => { onTabChange('stocksense'); showToast("📦 Routed to Restock advisor"); }}
                  className="px-2.5 py-1 text-[9px] bg-amber-500 hover:bg-amber-450 text-black font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow-md"
                >
                  Restock
                </button>
              </div>

              <div className="p-2.5 rounded-xl bg-black/40 border border-stone-800/80 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-stone-200">
                  <span className="text-emerald-400 font-black">3.</span>
                  <p className="font-semibold"><strong className="text-white">Margin Leak:</strong> Unused team subscriptions auto-highlighted.</p>
                </div>
                <button 
                  onClick={() => { onTabChange('costguard'); showToast("💼 Routed to cost leakage inspector"); }}
                  className="px-2.5 py-1 text-[9px] bg-emerald-500 hover:bg-emerald-450 text-white font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow-md"
                >
                  Plug Leaks
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-stone-800/50 pt-3 flex justify-between items-center text-[10px] text-stone-400 font-mono mt-3 select-none">
            <span className="flex items-center gap-1.5 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Aria Sync Node Checked & Online
            </span>
            <span className="text-stone-300">Reserves: {tokens} tokens remaining</span>
          </div>
        </div>

      </div>

      {/* ROW 1 BENTOS: Revenue at Risk, Profit Health, Open Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        
        {/* Bento 1: Revenue at Risk */}
        <div className={`p-5 rounded-[24px] border relative overflow-hidden flex flex-col justify-between hover:scale-[1.01] transition-transform duration-200 ${cardBgStyle} border-red-500/40 shadow-stone-900/40 shadow-lg`}>
          <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500"></div>
          <div>
            <div className="flex justify-between items-center mb-1 bg-transparent select-none">
              <span className="text-[9px] font-mono font-black uppercase text-red-400 tracking-wider">REVENUE AT RISK</span>
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            </div>
            
            <div className="flex items-baseline gap-1 bg-transparent mb-1">
              <h3 className="text-2xl font-mono font-black text-white">${currentRiskSum.toLocaleString()}</h3>
              <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider">churn high risk</span>
            </div>

            <p className="text-[10.5px] text-stone-300 font-mono mb-4 border-b border-stone-800/60 pb-2 bg-transparent select-text">
              Active exposures:
              {isSimulatingLive ? (
                <>
                  <span className="text-red-400 block mt-1">• Carlos Santos (VIP) - Silent 9 days: <strong className="text-white">$1,200</strong></span>
                  <span className="text-red-400 block">• James K. - Silent 14 days: <strong className="text-white">$840</strong></span>
                  <span className="text-red-400 block">• B2B Outlet - Pending SLA invoice: <strong className="text-white">$300</strong></span>
                </>
              ) : (
                <span className="text-stone-500 italic block mt-1">⚠️ SSE Stream Disconnected. Tap "Connect live SSE" button to start receiving inputs.</span>
              )}
            </p>
          </div>

          <button
            onClick={handleBulkWinback}
            className="w-full py-1.5 px-3 bg-red-500 hover:bg-red-650 text-white font-black text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5 text-center mt-2 shrink-0"
          >
            <ShieldAlert size={11} className="animate-bounce" />
            <span>Recover Silent VIPs</span>
          </button>
        </div>

        {/* Bento 2: Profit Health */}
        <div className={`p-5 rounded-[24px] border relative overflow-hidden flex flex-col justify-between hover:scale-[1.01] transition-transform duration-200 ${cardBgStyle} border-emerald-500/40 shadow-stone-900/40 shadow-lg`}>
          <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
          <div>
            <div className="flex justify-between items-center mb-1 bg-transparent select-none">
              <span className="text-[9px] font-mono font-black uppercase text-emerald-400 tracking-wider">PROFIT HEALTH</span>
              <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full select-none">
                {isSimulatingLive ? '+12.4% Trend ↑' : 'STANDBY'}
              </span>
            </div>

            <div className="flex items-baseline gap-1.5 bg-transparent mb-1">
              <h3 className="text-2xl font-mono font-black text-white">{isSimulatingLive ? `${profitMarginPercent}%` : '--%'}</h3>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider font-mono">NET OPERATIONAL MARGIN</span>
            </div>

            <p className="text-[10.5px] text-stone-300 font-mono mb-4 border-b border-stone-800/60 pb-2 bg-transparent">
              Shield factors:
              {isSimulatingLive ? (
                <>
                  <span className="text-emerald-400 block mt-1">• Cash Runway: <strong className="text-white">150 days</strong></span>
                  <span className="text-emerald-400 block">• Cost creep: <strong className="text-white">Optimized</strong></span>
                  <span className="text-emerald-400 block">• Leakage protection: <strong className="text-white">98% safe</strong></span>
                </>
              ) : (
                <span className="text-stone-500 italic block mt-1">⚠️ Real-time fiscal analysis paused. Link stream to begin.</span>
              )}
            </p>
          </div>

          <button
            onClick={() => { onTabChange('costguard'); showToast("💼 Switched to CostGuard CFO Studio"); }}
            className="w-full py-1.5 px-3 bg-[#131211] hover:bg-stone-950 border border-emerald-500/30 text-emerald-400 font-black text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer text-center mt-2 shrink-0"
          >
            <span>Optimize Net Margins →</span>
          </button>
        </div>

        {/* Bento 3: Open Opportunities */}
        <div className={`p-5 rounded-[24px] border relative overflow-hidden flex flex-col justify-between hover:scale-[1.01] transition-transform duration-200 ${cardBgStyle} border-amber-500/40 shadow-stone-900/40 shadow-lg`}>
          <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500"></div>
          <div>
            <div className="flex justify-between items-center mb-1 bg-transparent select-none">
              <span className="text-[9px] font-mono font-black uppercase text-amber-500 tracking-wider">OPEN OPPORTUNITIES</span>
              <span className="text-[9px] font-mono font-black bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-md">
                PIPELINE SCANNING
              </span>
            </div>

            <div className="flex items-baseline gap-1 bg-transparent mb-1">
              <h3 className="text-2xl font-mono font-black text-white">{isSimulatingLive ? `$${currentOpportunitiesSum.toLocaleString()}` : '$0'}</h3>
              <span className="text-[10px] text-stone-300 font-medium font-sans">across {opportunitiesCount} active deals</span>
            </div>

            <p className="text-[10.5px] text-stone-300 font-mono mb-4 border-b border-stone-800/60 pb-2 bg-transparent select-text">
              Wholesale opportunity logs:
              {isSimulatingLive ? (
                <>
                  <span className="text-amber-500 block mt-1">• 5 B2B wholesale proposals: <strong className="text-white">$1,800</strong></span>
                  <span className="text-amber-500 block">• 3 Loyalty stamp re-shares: <strong className="text-white">$900</strong></span>
                  <span className="text-amber-500 block">• 2 WhatsApp organic prompts: <strong className="text-white">$500</strong></span>
                </>
              ) : (
                <span className="text-stone-500 italic block mt-1">⚠️ Opportunity tracker offline. No active telemetry.</span>
              )}
            </p>
          </div>

          <button
            onClick={() => { onTabChange('retainflow'); showToast("📊 Switched to RetainFlow Analytics"); }}
            className="w-full py-1.5 px-3 bg-[#131211] hover:bg-stone-950 border border-amber-500/30 text-amber-500 font-black text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer text-center mt-2 shrink-0"
          >
            <span>Scan Open Pipelines →</span>
          </button>
        </div>

      </div>

      {/* CENTER: ARIA STATUS AND VERBAL INTERACTION */}
      <section className={`p-5 rounded-[24px] border flex flex-col justify-between relative ${cardBgStyle}`}>
        {/* Top colorful gradient highlight bar */}
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 rounded-t-[24px]"></div>

        <div className="space-y-4">
          <div className="flex justify-between items-center bg-transparent shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-500 flex items-center justify-center border border-amber-500/20">
                <Bot size={16} className="animate-pulse" />
              </div>
              <div>
                <h3 className="font-extrabold text-[12px] uppercase text-white tracking-widest font-mono">
                  {ariaName} Core Status
                </h3>
                <p className="text-[9px] text-stone-300 uppercase font-mono tracking-wider font-semibold">Active Cognitive Employee</p>
              </div>
            </div>

            {/* Speaking Toggle voice button */}
            <button
              onClick={() => {
                setSpeechEnabled(!speechEnabled);
                showToast(speechEnabled ? "🔇 voice speech muted" : "🔊 Vocal assistance active!");
              }}
              className={`p-1.5 rounded-lg transition-all flex items-center gap-1.5 text-[9.5px] font-mono font-black uppercase ${
                speechEnabled ? 'bg-amber-500 text-black shadow-md' : 'bg-[#1e1a17] hover:bg-stone-800 text-white border border-stone-800'
              }`}
            >
              {speechEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
              <span>{speechEnabled ? "Voice Speak ON" : "Muted"}</span>
            </button>
          </div>

          {/* Interactive Bubble and Voice representation */}
          <div className="p-4 bg-black/60 border border-stone-800/80 rounded-2xl flex flex-col sm:flex-row items-center gap-4 text-left relative">
            <div className="relative shrink-0 flex items-center justify-center p-1 cursor-pointer" onClick={() => handleQueryAria("overall audit summary")}>
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 shadow-[0_0_20px_rgba(245,158,11,0.25)] flex items-center justify-center text-2xl border border-white/20 select-none">
                {ariaAvatar}
              </div>
              <div className="absolute -bottom-1 bg-black border border-stone-800 px-2 rounded-full text-[7.5px] font-mono font-black text-amber-500 uppercase tracking-widest select-none shadow">
                {ariaMode}
              </div>
            </div>

            <div className="flex-grow space-y-1 text-stone-200">
              <span className="text-[8px] font-mono font-black text-amber-500 uppercase tracking-widest block">Active Vocal Directive</span>
              <p className="text-xs leading-relaxed italic font-semibold text-white select-text">
                "{ariaSpeech}"
              </p>
            </div>
          </div>

          {/* Business-Owner friendly, direct Human Metrics instead of tech token telemetry */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 border-t border-b border-stone-800/60 py-4 select-none">
            <div className="text-center md:text-left bg-transparent">
              <p className="text-[8px] font-mono font-black text-stone-400 uppercase tracking-wider">CONVERSATIONS HANDLED TODAY</p>
              <h4 className="text-xl font-mono font-black text-amber-500 mt-1">{isSimulatingLive ? liveConversations : '0'}</h4>
              <p className="text-[9px] text-[#22c55e] font-semibold">{isSimulatingLive ? '100% active coverage' : 'Standby'}</p>
            </div>

            <div className="text-center md:text-left bg-transparent">
              <p className="text-[8px] font-mono font-black text-stone-400 uppercase tracking-wider">RESOLVED WITHOUT ESCALATION</p>
              <h4 className="text-xl font-mono font-black text-emerald-400 mt-1">{isSimulatingLive ? liveResolved : '0'}</h4>
              <p className="text-[9px] text-stone-300 font-semibold font-mono">{isSimulatingLive ? '87.2% auto-resolution rate' : '--'}</p>
            </div>

            <div className="text-center md:text-left bg-transparent">
              <p className="text-[8px] font-mono font-black text-stone-400 uppercase tracking-wider">ESCALATED TO OPERATOR</p>
              <h4 className="text-xl font-mono font-black text-red-400 mt-1">{isSimulatingLive ? liveEscalated : '0'}</h4>
              <p className="text-[9px] text-stone-300 font-semibold">{isSimulatingLive ? 'Immediate routing assigned' : '--'}</p>
            </div>

            <div className="text-center md:text-left bg-transparent">
              <p className="text-[8px] font-mono font-black text-stone-400 uppercase tracking-wider">ARIA RESPONSE TIME</p>
              <h4 className="text-xl font-mono font-black text-cyan-400 mt-1">{isSimulatingLive ? '1.2s' : '--'}</h4>
              <p className="text-[9px] text-stone-300 font-semibold">{isSimulatingLive ? 'Global average latency' : 'Offline'}</p>
            </div>
          </div>
        </div>

        {/* Console Input Footer */}
        <div className="mt-4 flex flex-col md:flex-row gap-3 items-center select-none shrink-0 border-t border-stone-800 pt-3">
          <div className="flex flex-wrap gap-2 flex-1 w-full md:w-auto">
            {['Audit margins', 'Loyalty status', 'Restock schedule'].map(tag => (
              <button
                key={tag}
                onClick={() => handleQueryAria(tag)}
                className="px-3 py-1 bg-[#100e0d] hover:bg-stone-800 text-[10px] font-bold uppercase tracking-wider border border-stone-800/80 rounded-lg text-stone-300 transition-all cursor-pointer"
              >
                🔮 {tag}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); if (customQuestion.trim()) { handleQueryAria(customQuestion); setCustomQuestion(""); } }}
            className="flex w-full md:w-[320px] bg-black rounded-xl border border-stone-800 p-0.5"
          >
            <input 
              type="text"
              placeholder="Query Aria about business operations..."
              value={customQuestion}
              onChange={e => setCustomQuestion(e.target.value)}
              className="flex-grow px-3 py-1 text-xs bg-transparent text-white focus:outline-none placeholder-stone-600"
            />
            <button 
              type="submit" 
              className="px-4 py-1.5 bg-amber-500 text-black text-[10px] font-black uppercase rounded-lg hover:bg-amber-450 transition-all cursor-pointer"
            >
              Send
            </button>
          </form>
        </div>
      </section>

      {/* BOTTOM AREA: Activity Feed Real-time Horizontal layout + Live Message Strip Horizontal ticket ticker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 shrink-0">
        
        {/* Activity Feed Container (taking col-span-5) */}
        <div className={`lg:col-span-5 p-5 rounded-[24px] border flex flex-col justify-between overflow-hidden relative ${cardBgStyle}`}>
          <div>
            <span className="text-[8px] font-mono font-black text-amber-500 uppercase tracking-widest block mb-1">ACTIVITY FEED (PLAIN ENGLISH)</span>
            <h3 className="font-extrabold text-[12px] uppercase text-white tracking-widest font-mono mb-2">Real-Time Channel Activity</h3>
            
            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 scrollbar-none select-text">
              {activityLogs.length > 0 ? (
                activityLogs.map((log) => (
                  <div key={log.id} className="p-2.5 rounded-xl bg-black/40 border border-stone-800/60 flex flex-col gap-1">
                    <div className="flex justify-between items-center w-full">
                      <span className={`text-[8px] font-mono font-black uppercase px-2 py-0.5 rounded-md ${
                        log.type === 'stock' ? 'bg-amber-500/10 text-amber-500' : log.type === 'cost' ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'
                      }`}>
                        {log.type}
                      </span>
                      <span className="text-[8px] text-stone-400 font-mono">{log.time}</span>
                    </div>
                    <p className="text-[10px] font-sans font-bold leading-normal text-stone-100 leading-snug">
                      {log.msg}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-stone-500 text-[10.5px] font-semibold italic border border-dashed border-stone-800 rounded-xl bg-black/20">
                  ⚠️ Direct channel telemetry offline. Please active live WS/SSE stream above to pipe background channel events.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Messaging Strip (taking col-span-7) */}
        <div className={`lg:col-span-7 p-5 rounded-[24px] border flex flex-col justify-between relative ${cardBgStyle} bg-black/60 border-amber-500/10`}>
          <div className="flex justify-between items-center bg-transparent select-none shrink-0 mb-3">
            <div className="flex flex-col">
              <span className="text-[8px] font-mono font-black text-amber-500 uppercase tracking-widest block">SOCIAL MULTI-STREAM</span>
              <h4 className="font-extrabold text-xs text-white uppercase tracking-wider font-mono">Live Messaging Strip (click routing tag)</h4>
            </div>

            <button
              onClick={() => { onTabChange("social_omni"); showToast("📥 Routed to conversations!"); }}
              className="text-[9px] text-amber-400 hover:text-amber-300 font-black uppercase flex items-center gap-1 transition-all cursor-pointer font-mono"
            >
              <span>Verify Inbox</span>
              <ArrowRight size={10} />
            </button>
          </div>

          {/* Scrollable multi stream horizontal picker list */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none flex-nowrap w-full select-none justify-start">
            
            {/* WhatsApp */}
            <div 
              onClick={() => { onTabChange("social_omni"); showToast("Inbox scoped to WhatsApp Filters!"); }}
              className="min-w-[135px] shrink-0 p-3 bg-[#1e1a17] hover:bg-stone-900 border border-stone-800 rounded-xl cursor-pointer transition-all flex flex-col gap-1 active:scale-95 text-xs font-mono"
            >
              <div className="flex justify-between items-center bg-transparent">
                <span className="text-[8.5px] text-emerald-400 font-black uppercase flex items-center gap-1"><MessageCircle size={10} /> WhatsApp</span>
                <span className="px-1.5 py-0.2 bg-red-500 text-white text-[7.5px] font-black rounded-full animate-pulse">3</span>
              </div>
              <p className="text-[9.5px] font-extrabold text-white truncate truncate-ellipsis mt-1">James Santos</p>
              <p className="text-[8.5px] text-stone-300 font-sans truncate">"Can I get a bulk coupon..."</p>
            </div>

            {/* Instagram */}
            <div 
              onClick={() => { onTabChange("social_omni"); showToast("Inbox scoped to Instagram Filters!"); }}
              className="min-w-[135px] shrink-0 p-3 bg-[#1e1a17] hover:bg-stone-900 border border-stone-800 rounded-xl cursor-pointer transition-all flex flex-col gap-1 active:scale-95 text-xs font-mono"
            >
              <div className="flex justify-between items-center bg-transparent">
                <span className="text-[8.5px] text-pink-400 font-black uppercase flex items-center gap-1"><Instagram size={10} /> Instagram</span>
                <span className="px-1.5 py-0.2 bg-red-500 text-white text-[7.5px] font-black rounded-full animate-pulse">1</span>
              </div>
              <p className="text-[9.5px] font-extrabold text-white truncate truncate-ellipsis mt-1">@wander_boutique</p>
              <p className="text-[8.5px] text-stone-300 font-sans truncate font-semibold">"Awesome custom kit!"</p>
            </div>

            {/* Email */}
            <div 
              onClick={() => { onTabChange("social_omni"); showToast("Inbox scoped to Email Filters!"); }}
              className="min-w-[135px] shrink-0 p-3 bg-[#1e1a17] hover:bg-stone-900 border border-stone-800 rounded-xl cursor-pointer transition-all flex flex-col gap-1 active:scale-95 text-xs font-mono"
            >
              <div className="flex justify-between items-center bg-transparent">
                <span className="text-[8.5px] text-purple-400 font-black uppercase flex items-center gap-1"><Mail size={10} /> Gmail</span>
                <span className="px-1.5 py-0.2 bg-red-500 text-white text-[7.5px] font-black rounded-full animate-pulse">5</span>
              </div>
              <p className="text-[9.5px] font-extrabold text-white truncate truncate-ellipsis mt-1">Carlos Dispatcher</p>
              <p className="text-[8.5px] text-stone-300 font-sans truncate">"Confirming invoice restock..."</p>
            </div>

            {/* Facebook */}
            <div 
              onClick={() => { onTabChange("social_omni"); showToast("Inbox scoped to Facebook Filters!"); }}
              className="min-w-[135px] shrink-0 p-3 bg-[#1e1a17] hover:bg-stone-900 border border-stone-800 rounded-xl cursor-pointer transition-all flex flex-col gap-1 active:scale-95 text-xs font-mono"
            >
              <div className="flex justify-between items-center bg-transparent">
                <span className="text-[8.5px] text-blue-400 font-black uppercase flex items-center gap-1">Facebook</span>
                <span className="px-1.5 py-0.2 bg-stone-800 text-stone-400 text-[7.5px] font-black rounded-full">0</span>
              </div>
              <p className="text-[9.5px] font-extrabold text-white truncate truncate-ellipsis mt-1">David Warner</p>
              <p className="text-[8.5px] text-stone-300 font-sans truncate">"Are the accounts linked?"</p>
            </div>

          </div>
        </div>

      </div>

      {/* COGNITIVE TOKENS REFILL MODAL */}
      <AnimatePresence>
        {showTokenModal && (
          <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#1C1917] border border-stone-800 rounded-[28px] p-6 max-w-md w-full text-white space-y-4 shadow-2xl relative font-sans"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-t-[28px]"></div>
              
              <div className="flex justify-between items-start bg-transparent">
                <div>
                  <span className="text-[8.5px] font-black uppercase text-amber-500 font-mono tracking-widest block mb-0.5">Secure Transaction Panel</span>
                  <h3 className="text-md font-black text-white flex items-center gap-1 font-sans">
                    <Zap className="fill-amber-500 text-amber-500 animate-pulse animate-duration-1000" size={16} />
                    Refill Cognitive Token Tank
                  </h3>
                </div>
                <button onClick={() => setShowTokenModal(false)} className="text-stone-300 hover:text-white px-2 cursor-pointer text-sm">✕</button>
              </div>

              <p className="text-[11px] text-stone-300 leading-relaxed font-semibold">
                Aria runs deep telemetry audits, drafts customer auto-replies, and triggers re-engagements. Select a refill package to continue:
              </p>

              <div className="space-y-2 select-none">
                <button type="button" onClick={() => setRefillTier('micro')} className={`w-full text-left p-3 rounded-2xl border transition-all flex justify-between items-center ${refillTier === 'micro' ? 'bg-amber-500/10 border-amber-500 text-amber-500' : 'bg-stone-900/60 border-stone-850 text-stone-200'}`}>
                  <div>
                    <span className="text-xs font-black block">Basic Token Refill</span>
                    <span className="text-[10px] text-stone-400 block">Adds 1,000 Sandbox tokens</span>
                  </div>
                  <span className="text-sm font-mono font-black">$9.00</span>
                </button>

                <button type="button" onClick={() => setRefillTier('mega')} className={`w-full text-left p-3 rounded-2xl border transition-all flex justify-between items-center relative overflow-hidden ${refillTier === 'mega' ? 'bg-amber-500/10 border-amber-500 text-amber-500' : 'bg-stone-900/60 border-stone-850 text-stone-200'}`}>
                  <span className="absolute top-0 right-3 bg-amber-500 text-black text-[7px] font-black uppercase px-2 py-0.5 rounded-b font-mono">POPULAR</span>
                  <div>
                    <span className="text-xs font-black block">Standard Charging Tank</span>
                    <span className="text-[10px] text-stone-400 block">Adds 2,500 Sandbox tokens</span>
                  </div>
                  <span className="text-sm font-mono font-black">$19.00</span>
                </button>

                <button type="button" onClick={() => setRefillTier('infinite')} className={`w-full text-left p-3 rounded-2xl border transition-all flex justify-between items-center ${refillTier === 'infinite' ? 'bg-amber-500/10 border-amber-500 text-amber-500' : 'bg-stone-900/60 border-stone-850 text-stone-200'}`}>
                  <div>
                    <span className="text-xs font-black block">Mega Professional</span>
                    <span className="text-[10px] text-stone-400 block">Adds 5,000 Sandbox tokens</span>
                  </div>
                  <span className="text-sm font-mono font-black">$29.00</span>
                </button>
              </div>

              <div className="p-3 bg-stone-950 rounded-xl border border-stone-900 text-stone-200 flex items-center gap-2 font-mono text-[9.5px]">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span>Compliant Checkout via Sandbox Gateway (Card ending 4242)</span>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowTokenModal(false)} className="flex-1 py-1.5 rounded-xl bg-stone-900 text-stone-200 border border-stone-800 text-[10.5px] font-bold uppercase cursor-pointer">Cancel</button>
                <button
                  type="button"
                  onClick={() => {
                    setIsProcessingPayment(true);
                    setTimeout(() => {
                      const amount = refillTier === 'micro' ? 1000 : refillTier === 'mega' ? 2500 : 5000;
                      setTokens(prev => Math.min(maxTokens, prev + amount));
                      setIsProcessingPayment(false);
                      setShowTokenModal(false);
                      showToast(`⚡ payment Successful! Credited ${amount} Cognitive Tokens.`);
                    }, 1200);
                  }}
                  disabled={isProcessingPayment}
                  className="flex-grow py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black text-[10.5px] font-black uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isProcessingPayment ? "Crediting..." : "Authorize Refill"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
