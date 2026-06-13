import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  UserMinus, 
  MessageSquare, 
  TrendingDown, 
  Sparkles, 
  CheckCircle2, 
  Search, 
  Filter, 
  ArrowRight, 
  Zap,
  Volume2,
  AlertTriangle,
  Play,
  Award,
  Gift,
  Share2,
  Smartphone,
  Copy,
  Crown,
  Check
} from 'lucide-react';
import { Customer } from '../types';

interface RetentionHubProps {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  theme: 'light' | 'dark';
}

export default function RetentionHub({ customers, setCustomers, theme }: RetentionHubProps) {
  const [search, setSearch] = useState('');
  const [filterLevel, setFilterLevel] = useState<'ALL' | 'HIGH' | 'MEDIUM'>('ALL');
  
  // Tab within RetainFlow campaign center
  const [activeSubTab, setActiveSubTab] = useState<'loyalty' | 'referral' | 'sequences'>('loyalty');

  // Loyalty Program States
  const [pointsPerDollar, setPointsPerDollar] = useState(10);
  const [signupBonus, setSignupBonus] = useState(100);
  const [stampCount, setStampCount] = useState(6); // current configured stamp count for card
  const [vipThresholdBronze, setVipThresholdBronze] = useState(500);
  const [vipThresholdGold, setVipThresholdGold] = useState(2000);

  // Referral states
  const [inviterBonus, setInviterBonus] = useState(150); // invite bonus points
  const [friendDiscount, setFriendDiscount] = useState(20); // 20% friends discount
  const [referralCodeInput, setReferralCodeInput] = useState('LOCAL-GROWTH-26');
  const [referralLogs, setReferralLogs] = useState([
    { id: '1', broker: 'Sarah Jenkins', friend: 'Michael K.', status: 'Cleared (Rebate Sent)', date: '2 days ago', points: 150 },
    { id: '2', broker: 'James Chen', friend: 'Alice Chang', status: 'Cleared (Rebate Sent)', date: '5 days ago', points: 150 },
    { id: '3', broker: 'Emily Rose', friend: 'Bob Higgins', status: 'Pending Verification', date: '3 hours ago', points: 150 }
  ]);

  // SMS / Email Inactive sequence states
  const [inactiveDaysTrigger, setInactiveDaysTrigger] = useState(30);
  const [inactiveTemplate, setInactiveTemplate] = useState("Hey [Name]! We notice it has been [Days] days since your last checkout. Tap to grab a 20% off stamp rebate: vip.omni-ai.co/claim/[Code]");
  const [simulationStatusLog, setSimulationStatusLog] = useState<string | null>(null);
  
  // Custom tracking state parameters
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [referralCount, setReferralCount] = useState(18);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };
  
  // Simulation States
  const [priceHike, setPriceHike] = useState(10);
  const [simulationResult, setSimulationResult] = useState<{
    churnCount: number;
    revenueEffect: number;
    advice: string;
  } | null>(null);

  // Copilot Chat States
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'owner' | 'aria'; text: string }>>([
    { sender: 'aria', text: "Hi! I am RetainFlow's dynamic copilot. Let me know if you would like to run win-back automation campaigns or inspect customer sentiment trends." }
  ]);

  const handleSimulate = () => {
    const calculatedChurn = Math.round(priceHike * 0.8 + 2);
    const lostRev = calculatedChurn * 120;
    const gainedRev = (customers.length - calculatedChurn) * (150 * (priceHike / 100));
    const netImpact = Math.round(gainedRev - lostRev);

    setSimulationResult({
      churnCount: calculatedChurn,
      revenueEffect: netImpact,
      advice: netImpact > 0 
        ? `🟢 A ${priceHike}% price hike will increase monthly margins. Suggest implementing loyalty discounts for VIP targets first.` 
        : `🔴 A ${priceHike}% price hike will heavily impact low-engagement accounts. Suggest limiting hikes to new onboardings.`
    });
  };

  const executeAction = (id: string) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, status: 'executed' } : c));
    const target = customers.find(c => c.id === id);
    if (target) {
      setChatMessages(prev => [
        ...prev,
        { sender: 'aria', text: `🚀 Automatically sent customized win-back message to ${target.name} ("${target.nextBestAction}"). State changed to ENGAGED.` }
      ]);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { sender: 'owner', text: chatInput }]);
    const query = chatInput.toLowerCase();
    setChatInput('');

    setTimeout(() => {
      let answer = "";
      if (query.includes("who") || query.includes("focus")) {
        const silent = customers.filter(c => c.status === 'pending');
        answer = `You should focus on James Chen immediately. He has been silent for 14 days with negative sentiment. Offer a $15 product rebate.`;
      } else if (query.includes("campaign") || query.includes("win-back")) {
        answer = `Our automated 'Win-back Campaign #1' is primed. Click 'Launch Automated Campaign' below to send custom codes to all silent candidates.`;
      } else {
        answer = `I've audited customer files. Launching targeted discounts based on their preferred channels is recommended.`;
      }
      setChatMessages(prev => [...prev, { sender: 'aria', text: answer }]);
    }, 800);
  };

  const runGlobalCampaign = () => {
    setCustomers(prev => prev.map(c => ({ ...c, status: 'executed' })));
    setChatMessages(prev => [
      ...prev,
      { sender: 'aria', text: "🎉 Success! Dispatched re-engagement automations on all VIP channels (WhatsApp & Email Backup)." }
    ]);
  };

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterLevel === 'ALL' || c.riskLevel === filterLevel;
    return matchesSearch && matchesFilter;
  });

  const isDark = theme === 'dark';
  const cardBgCls = isDark 
    ? 'bg-stone-900 border-stone-800 text-white shadow-xl' 
    : 'bg-white border-stone-200 text-[#1C1917] shadow-sm';
  const textPrimaryCls = isDark ? 'text-white' : 'text-[#1C1917]';
  const textMutedCls = isDark ? 'text-stone-300' : 'text-neutral-500';
  const borderLightCls = isDark ? 'border-stone-800' : 'border-neutral-100';
  const inputBgCls = isDark ? 'bg-stone-950 border-stone-800 text-white focus:outline-none focus:ring-1 focus:ring-amber-500' : 'bg-stone-50 border-stone-200 text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-amber-500';
  const trHoverCls = isDark ? 'hover:bg-stone-850/40' : 'hover:bg-neutral-50/50';
  const trColorCls = isDark ? 'text-stone-200' : 'text-neutral-800';

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className={`p-6 rounded-3xl border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${cardBgCls}`}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-amber-500/10 text-amber-500"><Users size={16} /></span>
            <span className="text-xs font-bold uppercase text-neutral-400 tracking-wider">Engine 1</span>
          </div>
          <h2 className={`text-2xl font-black tracking-tight ${textPrimaryCls}`}>RetainFlow — Customer Retention AI</h2>
        </div>
        <button 
          onClick={runGlobalCampaign}
          className="bg-amber-500 hover:bg-amber-450 text-black text-xs font-bold tracking-wider uppercase px-5 py-3 rounded-2xl transition-all shadow-sm flex items-center gap-2 active:scale-95"
        >
          <Play size={14} fill="currentColor" /> Launch Automated Win-back
        </button>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`p-5 rounded-3xl border shadow-sm ${cardBgCls}`}>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Retention Rate</p>
          <p className="text-3xl font-mono font-black text-amber-500 mt-1">94.2%</p>
          <span className="text-xs text-emerald-550 dark:text-emerald-400 font-bold">↑ 2.1% this month</span>
        </div>
        <div className={`p-5 rounded-3xl border shadow-sm ${cardBgCls}`}>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">At-Risk Accounts</p>
          <p className="text-3xl font-mono font-black text-red-500 mt-1">
            {customers.filter(c => c.riskLevel === 'HIGH' && c.status === 'pending').length}
          </p>
          <span className="text-xs text-neutral-400 font-bold">Priority save queue</span>
        </div>
        <div className={`p-5 rounded-3xl border shadow-sm ${cardBgCls}`}>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">LTV Forecast (Avg)</p>
          <p className={`text-3xl font-mono font-black mt-1 ${textPrimaryCls}`}>$1,240</p>
          <span className="text-xs text-neutral-450 font-bold font-mono">12-month prediction</span>
        </div>
        <div className={`p-5 rounded-3xl border shadow-sm ${cardBgCls}`}>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Saved Revenue</p>
          <p className="text-3xl font-mono font-black text-emerald-600 dark:text-emerald-500 mt-1">
            ${(customers.filter(c => c.status === 'executed').reduce((acc, c) => acc + c.revenue, 0)).toLocaleString()}
          </p>
          <span className="text-xs text-emerald-550 dark:text-emerald-400 font-bold">Rescued capital</span>
        </div>
      </div>

      {/* Active Customer List Hub */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* At-risk Management Table */}
        <div className={`col-span-12 lg:col-span-8 border rounded-[28px] p-6 shadow-sm ${cardBgCls}`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h3 className={`font-bold text-base ${textPrimaryCls}`}>At-Risk VIP Matrix</h3>
            
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-2.5 text-neutral-400" size={14} />
                <input 
                  type="text" 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search VIPs..." 
                  className={`pl-9 pr-4 py-1.5 w-full rounded-xl text-xs ${
                    isDark ? 'bg-[#1C1917] border-[#37312C] text-white' : 'bg-neutral-50 border-neutral-200 text-[#1C1917]'
                  }`}
                />
              </div>

              <div className={`flex rounded-lg border overflow-hidden ${
                isDark ? 'border-[#37312C] bg-[#1C1917]' : 'border-neutral-200 bg-neutral-50'
              }`}>
                <button 
                  onClick={() => setFilterLevel('ALL')}
                  className={`px-3 py-1.5 text-[10px] font-bold transition-all ${
                    filterLevel === 'ALL' 
                      ? 'bg-[#1C1917] dark:bg-amber-500 dark:text-black text-white' 
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  ALL
                </button>
                <button 
                  onClick={() => setFilterLevel('HIGH')}
                  className={`px-3 py-1.5 text-[10px] font-bold transition-all ${
                    filterLevel === 'HIGH' 
                      ? 'bg-[#1C1917] dark:bg-amber-500 dark:text-black text-white' 
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  HIGH RISK
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={`border-b ${borderLightCls} text-neutral-400 font-bold uppercase tracking-wider text-[10px]`}>
                  <th className="py-3 px-2">Account Name</th>
                  <th className="py-3 px-2">Health Index</th>
                  <th className="py-3 px-2">Silent Days</th>
                  <th className="py-3 px-2">Sentiment</th>
                  <th className="py-3 px-2">Value Risk</th>
                  <th className="py-3 px-2">Next best action</th>
                  <th className="py-3 px-2 text-right">Execute</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-[#37312C]' : 'divide-neutral-100'}`}>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map(c => (
                    <tr key={c.id} className={`transition-all font-medium ${trHoverCls} ${trColorCls}`}>
                      <td className={`py-4 px-2 font-bold ${textPrimaryCls}`}>{c.name}</td>
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${c.healthScore > 70 ? 'bg-emerald-500' : c.healthScore > 40 ? 'bg-amber-500' : 'bg-red-500'}`}></span>
                          <span className="font-mono font-bold">{c.healthScore}/100</span>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-neutral-400 font-mono">{c.daysSilent} days</td>
                      <td className="py-4 px-2">
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          c.sentiment === 'positive' ? 'bg-emerald-500/10 text-emerald-500' :
                          c.sentiment === 'negative' ? 'bg-red-500/10 text-red-500' : 
                          isDark ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-100 text-neutral-600'
                        }`}>
                          {c.sentiment}
                        </span>
                      </td>
                      <td className={`py-4 px-2 font-mono font-bold ${textPrimaryCls}`}>${c.revenue}</td>
                      <td className="py-4 px-2 text-neutral-400 text-[11px] font-sans italic">{c.nextBestAction}</td>
                      <td className="py-4 px-2 text-right">
                        {c.status === 'executed' ? (
                          <div className="inline-flex items-center gap-1 text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-2.5 py-1 font-bold text-[10px]">
                            <CheckCircle2 size={12} /> Dispatched
                          </div>
                        ) : (
                          <button 
                            onClick={() => executeAction(c.id)}
                            className="bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider transition-all"
                          >
                            Engage
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-neutral-400 font-medium font-sans">
                      No matching records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Churn Price Impact Simulator */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className={`border rounded-[28px] p-6 shadow-sm ${cardBgCls}`}>
            <h3 className={`font-bold text-base mb-2 ${textPrimaryCls}`}>Churn Price Simulator</h3>
            <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
              Estimate potential churn probabilities and customer flight rate when introducing pricing shifts.
            </p>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-neutral-450">Planned Price Hike</span>
                  <span className="font-mono text-amber-500 font-bold">+{priceHike}%</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="40" 
                  value={priceHike} 
                  onChange={e => setPriceHike(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <button 
                onClick={handleSimulate}
                className="w-full py-3 bg-amber-500 hover:bg-amber-450 text-black text-xs font-black uppercase rounded-2xl tracking-wider transition-all"
              >
                Estimate Churn Shock
              </button>

              <AnimatePresence>
                {simulationResult && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-4 rounded-2xl border ${
                      isDark ? 'bg-[#1C1917]/50 border-[#37312C]' : 'bg-neutral-50 border-neutral-200'
                    }`}
                  >
                    <div className="grid grid-cols-2 gap-2 text-center mb-3">
                      <div className={`p-2 border rounded-lg ${
                        isDark ? 'border-[#37312C] bg-[#211F1D]' : 'border-neutral-100 bg-white'
                      }`}>
                        <span className="text-[10px] text-neutral-450 block uppercase font-bold">Estimated Churn</span>
                        <span className="text-xl font-mono font-black text-red-500">+{simulationResult.churnCount} accounts</span>
                      </div>
                      <div className={`p-2 border rounded-lg ${
                        isDark ? 'border-[#37312C] bg-[#211F1D]' : 'border-neutral-100 bg-white'
                      }`}>
                        <span className="text-[10px] text-neutral-450 block uppercase font-bold">Net Revenue Delta</span>
                        <span className={`text-xl font-mono font-black ${simulationResult.revenueEffect >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                          {simulationResult.revenueEffect >= 0 ? '+' : ''}${simulationResult.revenueEffect}/mo
                        </span>
                      </div>
                    </div>
                    <p className={`text-xs font-sans leading-relaxed ${isDark ? 'text-stone-300' : 'text-neutral-600'}`}>{simulationResult.advice}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Retention Chat Copilot */}
          <div className={`border rounded-[28px] p-6 shadow-sm flex flex-col h-[300px] ${cardBgCls}`}>
            <h3 className="font-bold text-sm mb-1 uppercase tracking-wider text-neutral-400">Retention Copilot</h3>
            
            <div className="flex-1 overflow-y-auto space-y-3 my-4 pr-1 scrollbar-thin">
              {chatMessages.map((m, i) => (
                <div key={i} className={`flex ${m.sender === 'owner' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] text-xs rounded-2xl p-3 border ${
                    m.sender === 'owner' 
                      ? 'bg-neutral-900 border-neutral-800 text-white rounded-tr-none' 
                      : isDark
                      ? 'bg-[#1C1917] border-[#37312C] text-[#FEF9EF] rounded-tl-none'
                      : 'bg-[#FFFBF5] border-amber-100 text-neutral-800 rounded-tl-none'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className={`flex gap-2 border-t pt-3 ${borderLightCls}`}>
              <input 
                type="text" 
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Ask e.g. Who to focus on?" 
                className={`flex-1 px-3 py-2 rounded-xl text-xs outline-none ${
                  isDark ? 'bg-[#1C1917] border-[#37312C] text-white focus:ring-1 focus:ring-amber-500' : 'bg-neutral-50 border-neutral-200 text-[#1C1917] focus:ring-1 focus:ring-amber-500'
                }`}
              />
              <button className="p-2.5 bg-amber-500 hover:bg-amber-450 text-black rounded-xl transition-all">
                <ArrowRight size={14} />
              </button>
            </form>
          </div>

        </div>

      </div>

      {/* RetainFlow Master Promo & Loyalty Action Center (Features #11 to #22) */}
      <div className={`border rounded-[28px] p-6 shadow-sm mt-6 ${cardBgCls}`}>
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-6 pb-4 border-b border-stone-200 dark:border-stone-850">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded bg-amber-500/10 text-amber-500"><Award size={14} /></span>
              <span className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider">Campaign Center</span>
            </div>
            <h3 className={`font-black text-lg ${textPrimaryCls}`}>RetainFlow Marketing & Incentives</h3>
            <p className="text-xs text-neutral-400">Configure points-based loyalty rewards, digital stamp cards, customer referral codes, and win-back engagement triggers.</p>
          </div>

          <div className={`flex rounded-xl border p-1 shrink-0 ${
            isDark ? 'border-stone-850 bg-stone-950/60' : 'border-stone-200 bg-stone-50'
          }`}>
            {[
              { id: 'loyalty', label: 'Loyalty & Stamp Card' },
              { id: 'referral', label: 'Referral Engine' },
              { id: 'sequences', label: 'Auto Sequences' }
            ].map(subTab => (
              <button
                key={subTab.id}
                onClick={() => {
                  setActiveSubTab(subTab.id as any);
                  setSimulationStatusLog(null);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeSubTab === subTab.id
                    ? 'bg-amber-500 text-black shadow-xs font-black'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {subTab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab contents */}
        <div className="min-h-[220px]">
          {activeSubTab === 'loyalty' && (
            <div className="grid md:grid-cols-12 gap-6 items-stretch">
              {/* Config controls */}
              <div className="md:col-span-7 flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                  <div>
                    <span className="p-1 px-2.5 rounded-full text-[8.5px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20 font-mono">
                      Loyalty Perks Configurations (Features #11, #12, #15)
                    </span>
                    <h4 className={`text-base font-bold mt-2 ${textPrimaryCls}`}>Loyalty Points Multiplier Rules</h4>
                    <p className="text-xs text-neutral-400 mt-1 font-sans">Configure automated points ratios per purchase dollar. Points are converted to stamp offsets or digital cashbacks instantly.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-neutral-450 block mb-1">Standard Points Multiplier</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={pointsPerDollar}
                          onChange={(e) => setPointsPerDollar(Math.max(1, Number(e.target.value)))}
                          className={`w-full p-2 text-xs rounded-xl border focus:outline-none ${
                            isDark ? 'bg-stone-900/60 border-stone-850 text-stone-100' : 'bg-white border-stone-250 text-black'
                          }`}
                        />
                        <span className="text-xs font-bold text-neutral-400 whitespace-nowrap">pts/$</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-neutral-450 block mb-1">Welcome Signup Bonus</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={signupBonus}
                          onChange={(e) => setSignupBonus(Math.max(0, Number(e.target.value)))}
                          className={`w-full p-2 text-xs rounded-xl border focus:outline-none ${
                            isDark ? 'bg-stone-900/60 border-stone-850 text-stone-100' : 'bg-white border-stone-250 text-black'
                          }`}
                        />
                        <span className="text-xs font-bold text-neutral-400 whitespace-nowrap">points</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-neutral-450 block mb-1">VIP Tier Bronze Threshold</label>
                      <input
                        type="number"
                        value={vipThresholdBronze}
                        onChange={(e) => setVipThresholdBronze(Number(e.target.value))}
                        className={`w-full p-2 text-xs rounded-xl border focus:outline-none ${
                          isDark ? 'bg-stone-900/60 border-stone-850 text-stone-100' : 'bg-white border-stone-250 text-black'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-neutral-450 block mb-1">VIP Tier Gold Threshold</label>
                      <input
                        type="number"
                        value={vipThresholdGold}
                        onChange={(e) => setVipThresholdGold(Number(e.target.value))}
                        className={`w-full p-2 text-xs rounded-xl border focus:outline-none ${
                          isDark ? 'bg-stone-900/60 border-stone-850 text-stone-100' : 'bg-white border-stone-250 text-black'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      triggerToast("✨ Loyalty configuration synchronized with your master billing API & checkout flows!");
                    }}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-450 text-black text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    Deploy Program Rules
                  </button>
                </div>
              </div>

              {/* Smartphone mockup */}
              <div className="md:col-span-5 flex flex-col items-center justify-center pt-2">
                <div className={`w-[260px] h-[350px] rounded-[32px] border-4 border-stone-850 p-4 shadow-xl relative overflow-hidden flex flex-col justify-between ${
                  isDark ? 'bg-stone-950 text-white' : 'bg-stone-50 border-stone-300 text-black'
                }`}>
                  {/* Top notch */}
                  <div className="absolute top-2 w-28 h-3.5 bg-stone-850 rounded-full left-1/2 -translate-x-1/2" />
                  
                  {/* Digital Wallet Header */}
                  <div className="pt-4 flex justify-between items-center text-[10px] font-bold">
                    <span className="flex items-center gap-1"><Smartphone size={10} /> Apple Wallet</span>
                    <span className="text-amber-500 font-mono">STAMPS</span>
                  </div>

                  {/* Stamp Pass layout */}
                  <div className="text-center my-1.5">
                    <div className="flex justify-center mb-1"><Crown size={24} className="text-amber-500 animate-bounce" /></div>
                    <h4 className="text-xs font-black uppercase tracking-wider">OMNI VIP CLUB</h4>
                    <p className="text-[9px] text-stone-400">Scan at Checkout</p>
                  </div>

                  {/* Stamp Grid */}
                  <div className="grid grid-cols-3 gap-2.5 my-2.5 px-2">
                    {Array.from({ length: 6 }).map((_, idx) => {
                      const isStamped = idx < stampCount;
                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            setStampCount(idx + 1);
                            triggerToast(`Updated stamp card count to ${idx + 1}!`);
                          }}
                          className={`aspect-square rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all ${
                            isStamped
                              ? 'bg-gradient-to-br from-amber-400 to-amber-500 border-amber-400 text-black scale-102 font-black'
                              : 'border-dashed border-stone-700 bg-stone-900/40 text-stone-600 font-bold'
                          }`}
                        >
                          {isStamped ? <Check size={14} className="stroke-[3]" /> : <span className="text-[10px] font-mono">{idx + 1}</span>}
                        </div>
                      );
                    })}
                  </div>

                  {/* Reward status */}
                  <div className="text-center pb-1">
                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest font-mono">
                      {stampCount >= 6 ? "🏆 Reward Unlocked!" : `Stamps: ${stampCount}/6`}
                    </p>
                    <p className="text-[8px] text-neutral-400">Tap stamp slots directly to adjust</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'referral' && (
            <div className="grid md:grid-cols-12 gap-6 items-stretch">
              {/* Creator */}
              <div className="md:col-span-5 space-y-4 border-r border-stone-200 dark:border-stone-850 pr-6">
                <div>
                  <span className="p-1 px-2.5 rounded-full text-[8.5px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-mono">
                    Referral Creator Logs & Links (Feature #13)
                  </span>
                  <h4 className={`text-base font-bold mt-2 ${textPrimaryCls}`}>Generate Growth Campaign</h4>
                  <p className="text-xs text-neutral-400 mt-1 font-sans">Offer bilateral rebates. Track who referred whom and allocate dynamic points automatically.</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-neutral-450 block mb-1">Advocate Invitation Reward</label>
                    <input
                      type="text"
                      className={`w-full p-2 text-xs rounded-xl border focus:outline-none ${
                        isDark ? 'bg-stone-900/60 border-stone-850 text-stone-100' : 'bg-white border-stone-250 text-black'
                      }`}
                      value={`${inviterBonus} Points`}
                      onChange={(e) => setInviterBonus(Number(e.target.value.replace(/\D/g, '')))}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-450 block mb-1">In-Bound Friend Benefit</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        className={`w-full p-2 text-xs rounded-xl border focus:outline-none ${
                          isDark ? 'bg-stone-900/60 border-stone-850 text-stone-100' : 'bg-white border-stone-250 text-black'
                        }`}
                        value={friendDiscount}
                        onChange={(e) => setFriendDiscount(Number(e.target.value))}
                      />
                      <span className="text-xs font-bold text-neutral-400">% Off</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-450 block mb-1">Active Promo URL Slug</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className={`flex-1 p-2 text-[11px] font-mono rounded-xl border focus:outline-none ${
                          isDark ? 'bg-stone-900/60 border-stone-850 text-stone-100' : 'bg-white border-stone-250 text-black'
                        }`}
                        value={referralCodeInput}
                        onChange={(e) => setReferralCodeInput(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          triggerToast("📋 Copied referral link to clipboard!");
                        }}
                        className={`p-2 rounded-xl border cursor-pointer ${
                          isDark ? 'border-stone-800 bg-stone-900 text-white' : 'border-stone-300 bg-white text-black'
                        }`}
                      >
                        <Copy size={13} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      triggerToast(`🚀 referral campaign '${referralCodeInput}' initialized successfully!`);
                    }}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-450 text-black text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    Activate Campaign Link
                  </button>
                </div>
              </div>

              {/* Conversion log table */}
              <div className="md:col-span-7 flex flex-col justify-between gap-4">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h5 className={`text-xs font-black uppercase tracking-wider text-neutral-400`}>Real-Time Conversion Tracker ({referralLogs.length})</h5>
                    <span className="text-[10px] font-bold text-emerald-500 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Total Growth: +{referralCount} Clients</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-stone-200 dark:border-stone-850 text-[10px] font-bold uppercase text-neutral-400 pb-2">
                          <th className="pb-2">Advocate</th>
                          <th className="pb-2">Invited Friend</th>
                          <th className="pb-2">Audit Status</th>
                          <th className="pb-2 text-right">Points Paid</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 dark:divide-stone-850/40 font-medium">
                        {referralLogs.map(log => (
                          <tr key={log.id} className="text-stone-300">
                            <td className={`py-2 px-1 text-xs font-bold ${textPrimaryCls}`}>{log.broker}</td>
                            <td className="py-2 px-1 text-neutral-400">{log.friend}</td>
                            <td className="py-2 px-1">
                              <span className={`text-[8.5px] font-black px-1.5 py-0.5 rounded-md ${
                                log.status.includes("Cleared")
                                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/10'
                                  : 'bg-amber-500/10 text-amber-500 border border-amber-500/10'
                              }`}>{log.status}</span>
                            </td>
                            <td className="py-2 px-1 text-right font-mono font-bold text-amber-500">+{log.points}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="pt-4 flex justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const newId = String(referralLogs.length + 1);
                      setReferralLogs([
                        { id: newId, broker: "James Chen", friend: "Laura Stone", status: "Cleared (Rebate Sent)", date: "Just now", points: inviterBonus },
                        ...referralLogs
                      ]);
                      setReferralCount(prev => prev + 1);
                      triggerToast("Simulated a new referral sign-up completed!");
                    }}
                    className={`px-3 py-1.5 text-[10px] font-black uppercase rounded-lg border flex items-center gap-1 transition-all cursor-pointer ${
                      isDark ? 'bg-stone-900 border-stone-820 hover:bg-stone-800 text-stone-300' : 'bg-white border-stone-250 hover:bg-stone-100 text-stone-700'
                    }`}
                  >
                    <span>Simulate Referral Signup</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setReferralLogs([
                        { id: '1', broker: 'Sarah Jenkins', friend: 'Michael K.', status: 'Cleared (Rebate Sent)', date: '2 days ago', points: 150 },
                        { id: '2', broker: 'James Chen', friend: 'Alice Chang', status: 'Cleared (Rebate Sent)', date: '5 days ago', points: 150 },
                        { id: '3', broker: 'Emily Rose', friend: 'Bob Higgins', status: 'Pending Verification', date: '3 hours ago', points: 150 }
                      ]);
                      setReferralCount(18);
                      triggerToast("Referrals logs database reset!");
                    }}
                    className="text-neutral-400 hover:text-neutral-200 text-[10px] font-black uppercase font-mono cursor-pointer"
                  >
                    Reset Logs
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'sequences' && (
            <div className="space-y-4">
              <div>
                <span className="p-1 px-2.5 rounded-full text-[8.5px] font-black uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-mono">
                  "We Miss You" Messaging Sequences (Features #14, #21, #22)
                </span>
                <h4 className={`text-base font-bold mt-2 ${textPrimaryCls}`}>Configuring Automated Retention Sequences</h4>
                <p className="text-xs text-neutral-400 mt-1 font-sans">Establish behavioral triggers. When customers become silent beyond a threshold, dispatch target coupon stamp incentives.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 items-end">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-neutral-450 block mb-2">Automated Trigger Threshold ({inactiveDaysTrigger} Days Silent)</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="14"
                        max="90"
                        className="flex-1 accent-amber-500 cursor-pointer"
                        value={inactiveDaysTrigger}
                        onChange={(e) => setInactiveDaysTrigger(Number(e.target.value))}
                      />
                      <span className="text-xs font-semibold whitespace-nowrap text-amber-500">{inactiveDaysTrigger} Days</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-450 block mb-1">Win-back Coupon SMS Script</label>
                    <textarea
                      rows={3}
                      className={`w-full p-2.5 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono ${
                        isDark ? 'bg-stone-900/60 border-stone-850 text-stone-100' : 'bg-white border-stone-250 text-black font-semibold'
                      }`}
                      value={inactiveTemplate}
                      onChange={(e) => setInactiveTemplate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className={`p-4 rounded-xl border ${
                    isDark ? 'bg-stone-900/30 border-stone-850' : 'bg-stone-100 border-neutral-200'
                  }`}>
                    <h5 className="text-[10px] uppercase font-black tracking-wider text-neutral-400 mb-1 font-sans">Real-time Rule Output Log</h5>
                    <p className={`text-xs font-mono font-bold ${textPrimaryCls}`}>
                      IF Days Silent == {inactiveDaysTrigger} THEN Dispatch SMS text log:
                    </p>
                    <div className="p-2.5 border border-dashed rounded-lg mt-2 border-amber-500/20 bg-amber-500/5">
                      <p className="text-[11px] font-sans italic text-stone-400 dark:text-stone-300 font-medium">
                        "{inactiveTemplate.replace("[Days]", String(inactiveDaysTrigger)).replace("[Name]", "Michael Richardson").replace("[Code]", "WINBACK25")}"
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSimulationStatusLog("🔄 Sync sequence dispatch initiated... Successfully mapped 4 static accounts who have crossed threshold of 30 days!");
                        triggerToast("Executed win-back campaign batch!");
                      }}
                      className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-450 text-black text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      Fire Retention Batch
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setInactiveDaysTrigger(30);
                        setInactiveTemplate("Hey [Name]! We notice it has been [Days] days since your last checkout. Tap to grab a 20% off stamp rebate: vip.omni-ai.co/claim/[Code]");
                        setSimulationStatusLog(null);
                        triggerToast("Template rules reset.");
                      }}
                      className="px-3 py-2.5 border border-stone-800 text-stone-300 text-xs font-black uppercase rounded-xl hover:bg-stone-900 transition-all cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              {simulationStatusLog && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 text-[11px] font-mono animate-pulse flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                  {simulationStatusLog}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Local Toast Alert notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-[6000] p-3 rounded-2xl bg-amber-500 border border-amber-600 text-black text-xs font-black uppercase shadow-lg flex items-center gap-2 font-sans"
          >
            <Sparkles size={14} className="animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
