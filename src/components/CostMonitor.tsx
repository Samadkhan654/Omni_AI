import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  Slash, 
  DollarSign, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertTriangle,
  Play,
  Check,
  Send,
  HelpCircle,
  HelpCircle as HelpIcon,
  Bot,
  Plus
} from 'lucide-react';
import { ProfitLeak } from '../types';

interface CostMonitorProps {
  leaks: ProfitLeak[];
  setLeaks: React.Dispatch<React.SetStateAction<ProfitLeak[]>>;
  theme: 'light' | 'dark';
  onTriggerToast?: (msg: string) => void;
  isSimulatingLive: boolean;
  setIsSimulatingLive: (val: boolean) => void;
}

export interface ExpenseAlert {
  id: string;
  category: string;
  percent: number;
  impact: string;
  amount: number;
  resolved: boolean;
}

export default function CostMonitor({ 
  leaks, 
  setLeaks, 
  theme, 
  onTriggerToast,
  isSimulatingLive,
  setIsSimulatingLive
}: CostMonitorProps) {
  // Alert logs
  const [alerts, setAlerts] = useState<ExpenseAlert[]>([
    { id: '1', category: 'Software creep', percent: 18, amount: 340, impact: 'Duplicate service licensing detected under sub-accounts', resolved: false },
    { id: '2', category: 'Overtime', percent: 8, amount: 620, impact: 'Weekend staff shifts scaling past budget constraints', resolved: false },
    { id: '3', category: 'Packaging', percent: 24, amount: 480, impact: 'Supplier A transition pricing update without bulk contracts', resolved: false }
  ]);

  // Advisor chat State
  const [cfoMessages, setCfoMessages] = useState<Array<{ sender: 'owner' | 'aria'; text: string; data?: any }>>([
    { sender: 'aria', text: "Hello! In my capacity as your AI CFO, I monitor vendor subscriptions, marketing yields, and potential profit leaks. Ask me anything about our expense structures, utility pricing, or if you can afford any planned hiring operations!" }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Interactive leak registrations inputs
  const [showAddLeak, setShowAddLeak] = useState(false);
  const [newLeakCategory, setNewLeakCategory] = useState('');
  const [newLeakDescription, setNewLeakDescription] = useState('');
  const [newLeakAmount, setNewLeakAmount] = useState('');

  // Fixed calculated metrics
  const totalSpend = 14820;
  const savingsUnlocked = leaks.filter(l => l.resolved).reduce((acc, curr) => acc + curr.amount, 0);

  const fixLeakDirectly = (leakId: string) => {
    setLeaks(prev => prev.map(l => l.id === leakId ? { ...l, resolved: true } : l));
    const target = leaks.find(l => l.id === leakId);
    if (target) {
      setCfoMessages(prev => [
        ...prev,
        { sender: 'aria', text: `✅ Resolved leak: "${target.category}" successfully fixed. Added $${target.amount}/month back to operational profit margins!` }
      ]);
    }
  };

  const handleAddLeakSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeakCategory.trim() || !newLeakDescription.trim() || !newLeakAmount) return;

    const newLeak: ProfitLeak = {
      id: `leak_${Date.now()}`,
      category: newLeakCategory,
      amount: Number(newLeakAmount),
      description: newLeakDescription,
      resolved: false
    };

    setLeaks(prev => [...prev, newLeak]);
    setNewLeakCategory('');
    setNewLeakDescription('');
    setNewLeakAmount('');
    setShowAddLeak(false);

    setCfoMessages(prev => [
      ...prev,
      { sender: 'aria', text: `⚠️ New Profit Leak Isolate Added: registered "${newLeakCategory}" at loss of $${newLeak.amount}/mo. Let's resolve it to boost operational runway!` }
    ]);
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, resolved: true } : a));
    const target = alerts.find(a => a.id === alertId);
    if (target) {
      setCfoMessages(prev => [
        ...prev,
        { sender: 'aria', text: `👍 Cost Guard resolved alert: ${target.category} audit has been optimized in the ledger!` }
      ]);
    }
  };

  const handleCfoChat = (query: string) => {
    setCfoMessages(prev => [...prev, { sender: 'owner', text: query }]);
    const cleanQuery = query.toLowerCase();

    setTimeout(() => {
      let answer = "";
      if (cleanQuery.includes("hire") || cleanQuery.includes("employee")) {
        answer = `📊 **Hiring Analysis:**
- Expected baseline cost: $2,000/mo (plus ~$340 in taxes and equipment).
- Requisite productivity gain to break even: +14% delivery yield.
- **My CFO Verdict:** Yes, we can safely afford this because your monthly saved capital from fixed profit leaks stands at $${savingsUnlocked}/mo. Suggested trial buffer: 3?`;
      } else if (cleanQuery.includes("software") || cleanQuery.includes("subscription") || cleanQuery.includes("leak") || cleanQuery.includes("save")) {
        const unresolved = leaks.filter(l => !l.resolved);
        if (unresolved.length > 0) {
          answer = `The Subscription Audit identifies immediate wasteful spend. You can instantly save $${unresolved[0].amount} by cancelling: ${unresolved[0].category}.`;
        } else {
          answer = `Great job! Your subscription profile is fully optimized. There is no software budget waste detected. All current leaks are plugged.`;
        }
      } else if (cleanQuery.includes("negotiat") || cleanQuery.includes("supplier")) {
        answer = `**Aria Negotiation Copilot script:**
"Based on market benchmark indices, the proposed 12% price adjustment is above the standard consumer index (4.2%). We can commit to a 6-month extension if fixed at a 5% limit."   
👉 *Copy negotiation advice & send to Supplier A*`;
      } else {
        answer = `Expense structures are stabilized but overtime rates have peaked by 8%. Standardizing weekly shifts should reduce leak projections immediately.`;
      }
      setCfoMessages(prev => [...prev, { sender: 'aria', text: answer }]);
    }, 1000);
  };

  const isDark = theme === 'dark';
  const cardBgCls = isDark 
    ? 'bg-stone-900 border-stone-800 text-white shadow-xl' 
    : 'bg-white border-stone-200 text-[#1C1917] shadow-sm';
  const textPrimaryCls = isDark ? 'text-white' : 'text-[#1C1917]';
  const textMutedCls = isDark ? 'text-stone-300' : 'text-neutral-500';
  const borderLightCls = isDark ? 'border-stone-800' : 'border-neutral-100';

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className={`p-6 rounded-3xl border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${cardBgCls}`}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-amber-500/10 text-amber-500"><TrendingUp size={16} /></span>
            <span className="text-xs font-bold uppercase text-neutral-400 tracking-wider">Engine 2</span>
          </div>
          <h2 className={`text-2xl font-black tracking-tight ${textPrimaryCls}`}>CostGuard — AI CFO & Profit Guardian</h2>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => handleCfoChat("Can I afford to hire someone?")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isDark ? 'bg-neutral-800 hover:bg-neutral-700 text-white' : 'bg-neutral-100 hover:bg-neutral-200 text-[#1C1917]'
            }`}
          >
            Hiring Assessment
          </button>
          <button 
            onClick={() => handleCfoChat("Draft negotiation email for Courier services")}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-450 text-black font-black rounded-xl text-xs transition-all cursor-pointer"
          >
            Draft Negotiation Script
          </button>
        </div>
      </div>

      {!isSimulatingLive ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center rounded-[28px] border border-dashed border-amber-500/25 bg-stone-900/10 font-sans select-none max-w-xl mx-auto my-12 w-full">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-5 shadow-inner">
            <DollarSign size={30} className="animate-pulse" />
          </div>
          <h3 className="text-base font-black uppercase text-stone-100 tracking-wider">CostGuard Offline</h3>
          <p className="text-xs text-stone-400 mt-2 leading-relaxed max-w-sm">
            AI profit metrics, duplicate transaction alerts, and supplier cost auditing are currently standing by. Hook up your live telemetry feed stream to start monitoring leaks instantly.
          </p>
          <button
            onClick={() => {
              setIsSimulatingLive(true);
              localStorage.setItem('omni_dashboard_simulating', 'true');
            }}
            className="mt-6 px-6 py-3 bg-amber-500 hover:bg-amber-450 text-black text-[10.5px] font-black uppercase tracking-widest rounded-xl cursor-pointer transition-all shadow-lg active:scale-97 animate-pulse"
          >
            🔌 Link Live Accounts
          </button>
        </div>
      ) : (
        <>

      {/* CFO Brief Banner */}
      <div className="bg-gradient-to-br from-[#1C1917] to-[#292524] rounded-[32px] p-6 text-white relative overflow-hidden shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.15)_0%,transparent_60%)] pointer-events-none"></div>
        <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/10 text-amber-500 text-[10px] font-black uppercase tracking-widest border border-white/5 mb-3">Daily Briefing</div>
            <h3 className="text-xl font-bold mb-1">"Good morning, here is today's cost defense briefing."</h3>
            <p className="text-xs text-neutral-400 max-w-xl leading-relaxed">
              Total monthly expenditure is stabilized at ${totalSpend.toLocaleString()}, but gross margins are facing pressure from custom supply fees. 
              Plugging detected subscription waste should shift runway projections from 7 months to 9 months.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl md:min-w-[200px] flex flex-col justify-center">
            <span className="text-[9px] text-neutral-400 uppercase font-bold">Projected Profit Boost</span>
            <span className="text-3xl font-mono font-black text-amber-500 mt-1">+${savingsUnlocked}/mo</span>
            <span className="text-[10px] text-green-400 font-bold mt-1">If all active leaks are plugged</span>
          </div>
        </div>
      </div>

      {/* PROFIT LEAK OF THE WEEK WIDGET */}
      <div className={`p-5 rounded-[24px] border border-red-500/25 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-red-500/[0.02] shadow-sm`}>
        <div className="absolute top-0 right-0 p-1.5 px-3 bg-red-500/15 text-red-400 font-mono text-[7px] font-black uppercase rounded-bl-2xl tracking-widest select-none animate-pulse">
          ⚠️ ACTIVE WEEKLY FLIGHT OUTFLOW
        </div>
        
        <div className="space-y-1 text-left max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-500 border border-red-500/20 text-[8px] font-black font-mono tracking-widest uppercase">PROFIT LEAK OF THE WEEK</span>
            <span className="text-stone-400 text-[9px] font-mono font-bold select-none">[Aria CFO Audited]</span>
          </div>
          <h4 className="text-sm font-black text-white uppercase font-sans">Packaging Logistics Base-Rate Overcharge with Supplier B</h4>
          <p className="text-xs text-stone-300 leading-relaxed font-sans">
            Supplier B raised baseline packaging box rates by <strong className="text-red-400 font-mono">24% without contract caps</strong>. This leaks <strong className="text-amber-500 font-mono">$480 / month</strong> in excess capital. Aria suggests locking a 5% max contract cap using our negotiation playbook.
          </p>
        </div>

        <div className="flex md:flex-col gap-2 w-full md:w-auto shrink-0 select-none">
          <button 
            type="button"
            onClick={() => handleCfoChat("Draft negotiation email for Supplier B")}
            className="px-4 py-2 bg-[#12100f] border border-stone-850 hover:bg-stone-900 transition-colors text-stone-300 text-[9.5px] font-black uppercase tracking-wider rounded-xl cursor-pointer text-center w-full"
          >
            Draft Reprisal Script
          </button>
          <button 
            type="button"
            onClick={() => {
              resolveAlert('3');
              if (onTriggerToast) {
                onTriggerToast("🔒 Resolved! Enacted 5% package ceiling. Saved $480/mo leak successfully!");
              }
            }}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-450 hover:scale-101 text-black text-[9.5px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer text-center w-full"
          >
            Resolve with 5% Ceiling
          </button>
        </div>
      </div>

      {/* Main Seperated Bento Grid (3-columns: equal structural weight) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* BENTO C1: PROFIT LEAK DETECTOR (SEPARATE INTERACTIVE CARD) */}
        <section id="bento-profit-leaks" className={`border rounded-[28px] p-4.5 shadow-sm flex flex-col justify-between h-[440px] transition-all duration-300 ${cardBgCls}`}>
          <div>
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className={`font-extrabold text-base ${textPrimaryCls}`}>Profit Leak Detector</h3>
                <p className="text-xs text-neutral-400">Reclaim wasted overheads</p>
              </div>
              <button 
                onClick={() => setShowAddLeak(!showAddLeak)}
                className="p-1 px-2.5 text-[9.5px] font-black uppercase tracking-wider bg-amber-500 text-black rounded-xl flex items-center gap-1 cursor-pointer transition-transform hover:scale-105"
              >
                <Plus size={10} />
                <span>Add Leak</span>
              </button>
            </div>

            {/* Togglable add profit leak form block */}
            {showAddLeak && (
              <motion.form 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                onSubmit={handleAddLeakSubmit}
                className="p-3 mb-3 border border-dashed rounded-xl border-stone-300 dark:border-stone-850 bg-stone-500/5 space-y-2"
              >
                <p className="text-[8px] font-black uppercase text-amber-500 tracking-widest">Register Profit Leak</p>
                <input 
                  type="text"
                  required
                  placeholder="Category (e.g. Server Over-Allocation)"
                  value={newLeakCategory}
                  onChange={e => setNewLeakCategory(e.target.value)}
                  className={`w-full p-2 text-[10px] rounded-lg border focus:outline-none ${isDark ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-white border-stone-200 text-stone-900'}`}
                />
                <input 
                  type="text"
                  required
                  placeholder="Description (e.g. Unbalanced CPU instances)"
                  value={newLeakDescription}
                  onChange={e => setNewLeakDescription(e.target.value)}
                  className={`w-full p-2 text-[10px] rounded-lg border focus:outline-none ${isDark ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-white border-stone-200 text-stone-900'}`}
                />
                <input 
                  type="number"
                  required
                  placeholder="Leakage Cost per Month ($)"
                  value={newLeakAmount}
                  onChange={e => setNewLeakAmount(e.target.value)}
                  className={`w-full p-2 text-[10px] rounded-lg border focus:outline-none ${isDark ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-white border-stone-200 text-stone-900'}`}
                />
                <div className="flex gap-2 justify-end pt-1">
                  <button 
                    type="button" 
                    onClick={() => setShowAddLeak(false)}
                    className="px-2.5 py-1 text-[9px] font-bold bg-neutral-800 rounded text-neutral-400"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-3.5 py-1 text-[9px] font-black bg-amber-500 text-black rounded uppercase"
                  >
                    Deploy
                  </button>
                </div>
              </motion.form>
            )}

            {/* List scroll container */}
            <div className="space-y-2 max-h-[235px] overflow-y-auto pr-1 scrollbar-none">
              {leaks.length === 0 ? (
                <div className="text-center py-12 border border-dashed rounded-2xl border-stone-300 dark:border-stone-850">
                  <p className="text-[11px] text-neutral-400">Inventory clean. No leaks diagnosed.</p>
                  <button onClick={() => setShowAddLeak(true)} className="text-[10px] font-black text-amber-500 mt-1 uppercase tracking-wider block mx-auto hover:underline">Register fresh instance</button>
                </div>
              ) : (
                leaks.map(l => (
                  <div key={l.id} className={`p-3 border rounded-2xl transition-all flex justify-between items-center gap-4 ${
                    isDark ? 'border-[#37312C] bg-[#1C1917]/20 hover:bg-[#1C1917]/40' : 'border-neutral-100 bg-neutral-50/50 hover:bg-[#1C1917]/5'
                  }`}>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`font-bold text-xs truncate ${textPrimaryCls}`}>{l.category}</span>
                        <span className="text-[10px] font-bold text-red-500 font-mono shrink-0">-${l.amount}/mo</span>
                      </div>
                      <p className="text-[10.5px] text-neutral-450 leading-relaxed font-sans truncate">{l.description}</p>
                    </div>

                    {l.resolved ? (
                      <div className="flex items-center gap-1 text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg font-bold text-[9px] shrink-0">
                        <Check size={10} /> Plugged
                      </div>
                    ) : (
                      <button 
                        onClick={() => fixLeakDirectly(l.id)}
                        className="px-2 py-1 bg-amber-500 hover:bg-amber-450 text-black text-[9.5px] font-black uppercase rounded-lg tracking-wider transition-all shadow-sm shrink-0"
                      >
                        Plug
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-2 border-t border-dashed border-stone-200 dark:border-stone-850 text-center text-[9px] font-medium text-neutral-400">
            Active Leakage Monitored: {leaks.filter(l => !l.resolved).length} Channels
          </div>
        </section>

        {/* BENTO C2: URGENT COST ANOMALIES (SEPARATE INTERACTIVE CARD) */}
        <section id="bento-cost-anomalies" className={`border rounded-[28px] p-4.5 shadow-sm flex flex-col justify-between h-[440px] transition-all duration-300 ${cardBgCls}`}>
          <div>
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className={`font-extrabold text-base ${textPrimaryCls}`}>Urgent Cost Anomalies</h3>
                <p className="text-xs text-neutral-400">Automatic budget spikes detected</p>
              </div>
              <span className="text-xs font-black px-2.5 py-1 rounded-full bg-red-500/10 text-red-500 uppercase">ANOMALY INDEX</span>
            </div>

            <div className="space-y-2 max-h-[235px] overflow-y-auto pr-1 scrollbar-none">
              {alerts.map(a => (
                <div key={a.id} className={`p-3 border rounded-2xl flex items-center justify-between gap-4 transition-all ${
                  isDark ? 'bg-[#1C1917]/35 border-[#37312C] hover:bg-[#1C1917]/45' : 'bg-neutral-50/50 border-neutral-200 hover:bg-[#1C1917]/5'
                }`}>
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="p-1.5 bg-red-500/10 text-red-500 rounded-lg mt-0.5 shrink-0"><AlertTriangle size={13} /></div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-bold text-xs truncate ${isDark ? 'text-white' : 'text-neutral-800'}`}>{a.category} spike</span>
                        <span className="text-[9.5px] font-mono font-bold text-red-500 shrink-0">+{a.percent}%</span>
                      </div>
                      <p className="text-[10px] text-neutral-400 leading-tight block mt-0.5">{a.impact}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`text-[10.5px] font-mono font-bold ${textPrimaryCls}`}>-${a.amount}</span>
                    {a.resolved ? (
                      <span className="text-[9px] bg-emerald-500/5 text-emerald-500 border border-emerald-500/10 px-1.5 py-0.5 rounded-md font-bold">Safe</span>
                    ) : (
                      <button 
                        onClick={() => resolveAlert(a.id)}
                        className={`px-2 py-0.5 text-[9px] rounded-lg font-bold transition-all ${
                          isDark ? 'bg-neutral-800 text-white hover:bg-[#37312C]' : 'bg-neutral-900 text-white hover:bg-neutral-850'
                        }`}
                      >
                        Audit
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-2 border-t border-dashed border-stone-200 dark:border-stone-850 text-center text-[9px] font-mono font-bold text-neutral-400">
            Open Anomalies: {alerts.filter(a => !a.resolved).length} instances flagged
          </div>
        </section>

        {/* BENTO C3: CFO INTELLIGENT COPILOT DIALOGUE (THIRD CARD) */}
        <section id="bento-cfo-copilot" className={`border rounded-[28px] p-4.5 shadow-sm flex flex-col h-[440px] transition-all duration-300 ${cardBgCls}`}>
          <div className={`flex items-center justify-between border-b pb-3 ${borderLightCls}`}>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping"></span>
              <h3 className="font-bold text-sm uppercase tracking-widest text-neutral-400">AI CFO Dialogue</h3>
            </div>
            <span className="text-[10px] font-bold text-neutral-400 uppercase">CFO Core</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 my-3 pr-1 scrollbar-none">
            {cfoMessages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === 'owner' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] text-[11px] rounded-2xl p-2.5 border leading-relaxed ${
                  m.sender === 'owner' 
                    ? 'bg-[#1C1917] dark:bg-neutral-900 border-neutral-850 dark:border-[#37312C] text-white rounded-tr-none' 
                    : isDark
                    ? 'bg-[#1C1917]/65 border-[#37312C] text-[#FEF9EF] rounded-tl-none whitespace-pre-line font-medium'
                    : 'bg-[#FFFBF5] border-amber-100 text-neutral-800 rounded-tl-none whitespace-pre-line font-medium'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (chatInput.trim()) {
                handleCfoChat(chatInput);
                setChatInput('');
              }
            }} 
            className={`flex gap-2 border-t pt-3 ${borderLightCls}`}
          >
            <input 
              type="text" 
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              placeholder="Ask: 'Should I cut software waste?'" 
              className={`flex-1 px-3 py-2 rounded-xl text-xs outline-none ${
                isDark ? 'bg-[#1C1917] border-[#37312C] text-white focus:ring-1 focus:ring-amber-500' : 'bg-neutral-50 border-neutral-200 text-[#1C1917] focus:ring-1 focus:ring-amber-500'
              }`}
            />
            <button className="p-2 bg-amber-500 hover:bg-amber-450 text-black font-black rounded-xl transition-all cursor-pointer">
              <Send size={13} />
            </button>
          </form>

          {/* Quick reference advice queries */}
          <div className={`flex flex-wrap gap-1.5 mt-3 pt-2.5 border-t ${borderLightCls}`}>
            <button 
              onClick={() => handleCfoChat("Should I cut software waste?")}
              className={`px-2 py-1 text-[9.5px] border rounded-lg transition-all text-left truncate max-w-full cursor-pointer ${
                isDark ? 'bg-[#1C1917] border-[#37312C] text-stone-300 hover:bg-stone-900' : 'bg-[#FEF9EF]/15 border-neutral-200 text-neutral-500 hover:bg-neutral-100'
              }`}
            >
              🔍 Audit software waste
            </button>
            <button 
              onClick={() => handleCfoChat("Can we draft some supplier renegotiations?")}
              className={`px-2 py-1 text-[9.5px] border rounded-lg transition-all text-left cursor-pointer ${
                isDark ? 'bg-[#1C1917] border-[#37312C] text-stone-300 hover:bg-stone-900' : 'bg-[#FEF9EF]/15 border-neutral-200 text-neutral-500 hover:bg-neutral-100'
              }`}
            >
              💬 Supplier negotiation script
            </button>
          </div>
        </section>

      </div>
      </>
      )}

    </div>
  );
}
