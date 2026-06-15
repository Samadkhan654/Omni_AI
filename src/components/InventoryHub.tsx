import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PackageSearch, 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  CheckCircle2, 
  TrendingDown, 
  Coins, 
  HelpCircle,
  Clock,
  ArrowRight,
  Shield,
  Layers,
  Send
} from 'lucide-react';
import { Product } from '../types';

interface InventoryHubProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  theme: 'light' | 'dark';
  isSimulatingLive: boolean;
  setIsSimulatingLive: (val: boolean) => void;
}

export default function InventoryHub({ 
  products, 
  setProducts, 
  theme,
  isSimulatingLive,
  setIsSimulatingLive
}: InventoryHubProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [delayDays, setDelayDays] = useState(14);
  const [showStressTest, setShowStressTest] = useState(false);
  const [restockAmount, setRestockAmount] = useState(300);
  const [isCashAwareActive, setIsCashAwareActive] = useState(true);
  const [freeCashReserves, setFreeCashReserves] = useState(4200);

  // Copilot messages
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'owner' | 'aria'; text: string }>>([
    { sender: 'aria', text: "Welcome to StockSense! Let me help you handle reordering sequences while guarding our cash flow. Tap any product to trigger the Business Impact Engine." }
  ]);
  const [chatInput, setChatInput] = useState('');

  const triggerImpactEngine = (product: Product) => {
    setSelectedProduct(product);
  };

  const executeRestock = () => {
    if (!selectedProduct) return;
    setProducts(prev => prev.map(p => p.id === selectedProduct.id ? { ...p, stock: p.stock + restockAmount, stockoutDays: p.stockoutDays + 45 } : p));
    
    setChatMessages(prev => [
      ...prev,
      { sender: 'aria', text: `📦 restocked: Approved restock order of ${restockAmount} units of "${selectedProduct.name}". Financial capital allocated. Stockout risks averted.` }
    ]);
    setSelectedProduct(null);
  };

  const handleCopilotChat = (text: string) => {
    setChatMessages(prev => [...prev, { sender: 'owner', text }]);
    const clean = text.toLowerCase();

    setTimeout(() => {
      let answer = "";
      if (clean.includes("reorder") || clean.includes("buy")) {
        const critical = products.filter(p => p.stockoutDays <= 15);
        if (critical.length > 0) {
          answer = `We have critical inventory risks. ${critical[0].name} has only ${critical[0].stock} units left, with a high LTV impact. Suggest click to open 'Business Impact Engine'.`;
        } else {
          answer = `All stock levels are comfortably healthy. No immediate restock cycles are required.`;
        }
      } else if (clean.includes("dead") || clean.includes("slow")) {
        answer = `Dead Stock Rescue AI identifies $8,500 locked in slow moving wired headphones. 
👉 Recommendation: Bundle headphones with cases at a 20% discount package.`;
      } else {
        answer = `Stock levels are verified. Leverage Cash-Aware parameters to optimize the upcoming seasonal procurement loop.`;
      }
      setChatMessages(prev => [...prev, { sender: 'aria', text: answer }]);
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
            <span className="p-1 rounded bg-amber-500/10 text-amber-500"><PackageSearch size={16} /></span>
            <span className="text-xs font-bold uppercase text-neutral-400 tracking-wider">Engine 3</span>
          </div>
          <h2 className={`text-2xl font-black tracking-tight ${textPrimaryCls}`}>StockSense — Inventory Intelligence Hub</h2>
        </div>
        <button 
          onClick={() => setShowStressTest(!showStressTest)}
          className="bg-[#1C1917] dark:bg-amber-500 hover:bg-black dark:hover:bg-amber-450 text-white dark:text-black text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-2xl transition-all shadow-sm active:scale-95 flex items-center gap-2"
        >
          <Layers size={14} /> {showStressTest ? "Hide Supply Stress Test" : "Run Supply Delay Stress Test"}
        </button>
      </div>

      {!isSimulatingLive ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center rounded-[28px] border border-dashed border-amber-500/25 bg-stone-900/10 font-sans select-none max-w-xl mx-auto my-12 w-full">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-5 shadow-inner">
            <PackageSearch size={30} className="animate-pulse" />
          </div>
          <h3 className="text-base font-black uppercase text-stone-100 tracking-wider">StockSense Offline</h3>
          <p className="text-xs text-stone-400 mt-2 leading-relaxed max-w-sm">
            Cash-aware inventory optimization, supplier risk calculators, and real-time stocking thresholds are currently offline. Establish your active stream connection to populate product records reactively.
          </p>
          <button
            onClick={() => {
              setIsSimulatingLive(true);
              localStorage.setItem('omni_dashboard_simulating', 'true');
            }}
            className="mt-6 px-6 py-3 bg-amber-500 hover:bg-amber-450 text-black text-[10.5px] font-black uppercase tracking-widest rounded-xl cursor-pointer transition-all shadow-lg active:scale-97 animate-pulse"
          >
            🔌 Link Live Channels
          </button>
        </div>
      ) : (
        <>

      {/* Stress Test Dashboard Panel */}
      <AnimatePresence>
        {showStressTest && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`overflow-hidden border rounded-[28px] p-6 shadow-sm ${cardBgCls}`}
          >
            <h3 className={`font-bold text-sm mb-2 flex items-center gap-2 ${textPrimaryCls}`}>
              <AlertTriangle className="text-amber-500" size={18} /> Supply Delay Stress Calculator
            </h3>
            <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
              Assesses the multi-layered financial fallout if suppliers delay shipments.
            </p>

            <div className="grid md:grid-cols-2 gap-6 items-end">
              <div>
                <label className="text-xs text-neutral-400 font-bold block mb-2">Simulated Supply Lag Duration</label>
                <div className={`flex justify-between items-center px-4 py-2 border rounded-xl mb-2 ${
                  isDark ? 'bg-[#141210] border-stone-800' : 'bg-neutral-50 border-neutral-200'
                }`}>
                  <span className={`text-xs font-semibold ${textPrimaryCls}`}>{delayDays} Days Delay</span>
                  <input 
                    type="range" 
                    min="7" 
                    max="45" 
                    value={delayDays}
                    onChange={e => setDelayDays(Number(e.target.value))}
                    className="accent-amber-500 w-1/2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className={`p-3 rounded-xl border text-center ${
                  isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-100'
                }`}>
                  <span className="text-[9px] text-[#DC2626] font-bold block uppercase tracking-wider">Lost Revenue</span>
                  <span className="text-base font-mono font-black text-red-500">${Math.round(delayDays * 320)}</span>
                </div>
                <div className={`p-3 rounded-xl border text-center ${
                  isDark ? 'bg-amber-500/10 border-amber-500/25' : 'bg-amber-50 border-amber-100'
                }`}>
                  <span className="text-[9px] text-[#B45309] font-bold block uppercase tracking-wider font-sans">LTV High Risk</span>
                  <span className="text-base font-mono font-black text-amber-505">{Math.round(delayDays / 3)} Clients</span>
                </div>
                <div className={`p-3 rounded-xl border text-center ${
                  isDark ? 'bg-stone-850 border-stone-800' : 'bg-neutral-50 border-neutral-200'
                }`}>
                  <span className="text-[9px] text-neutral-400 font-bold block uppercase tracking-wider">Buffer Needs</span>
                  <span className={`text-base font-mono font-black ${textPrimaryCls}`}>+{Math.round(delayDays * 12)} units</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-5 rounded-3xl border shadow-sm flex items-center justify-between ${
          isDark ? 'bg-red-500/5 border-[#3E2525]' : 'bg-[#FEF2F2] border-red-101'
        }`}>
          <div>
            <span className="text-[9px] text-red-650 font-black tracking-widest uppercase block text-red-500">Stockout Risk Value</span>
            <span className="text-3xl font-mono font-black text-red-500 mt-1 block">$12,000</span>
          </div>
          <AlertTriangle className="text-red-505" size={32} />
        </div>
        <div className={`p-5 rounded-3xl border shadow-sm flex items-center justify-between ${
          isDark ? 'bg-amber-500/5 border-[#3E3525]' : 'bg-[#FFFBEB] border-amber-201'
        }`}>
          <div>
            <span className="text-[9px] text-amber-700 font-black tracking-widest uppercase block text-amber-500">Dead Inventory</span>
            <span className="text-3xl font-mono font-black text-amber-500 mt-1 block">$8,500</span>
          </div>
          <PackageSearch className="text-amber-505" size={32} />
        </div>
        <div className={`p-5 rounded-3xl border shadow-sm flex items-center justify-between ${
          isDark ? 'bg-emerald-500/5 border-[#203D2E]' : 'bg-[#ECFDF5] border-emerald-101'
        }`}>
          <div>
            <span className="text-[9px] text-emerald-700 font-black tracking-widest uppercase block text-emerald-552">Exploitable Opportunity</span>
            <span className="text-3xl font-mono font-black text-emerald-600 dark:text-emerald-500 mt-1 block">$5,300</span>
          </div>
          <TrendingUp className="text-emerald-505" size={32} />
        </div>
      </div>

      {/* Master Inventory Controls */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Product Table */}
        <div className={`col-span-12 lg:col-span-8 border rounded-[28px] p-6 shadow-sm flex flex-col justify-between h-[400px] ${cardBgCls}`}>
          <div>
            <h3 className={`font-bold text-sm mb-0.5 ${textPrimaryCls}`}>Algorithmic Restock Engine</h3>
            <p className="text-[11px] text-neutral-400 mb-4 animate-fade-in">Cash-aware modeling combined with VIP client risk mappings</p>

            <div className="overflow-auto max-h-[250px] pr-1 scrollbar-thin">
              <table className="w-full text-[11px] text-left border-collapse">
                <thead>
                  <tr className={`border-b ${borderLightCls} text-neutral-400 font-bold uppercase tracking-wider text-[9px]`}>
                    <th className="py-2.5 px-1.5">Product Line</th>
                    <th className="py-2.5 px-1.5 text-center">In Stock</th>
                    <th className="py-2.5 px-1.5 text-center">Safeguard Limit</th>
                    <th className="py-2.5 px-1.5 text-center">Runtime Timeline</th>
                    <th className="py-2.5 px-1.5 text-center">LTV Risk Anchor</th>
                    <th className="py-2.5 px-1.5 text-center">Cash Safeguard</th>
                    <th className="py-2.5 px-1.5 text-right">Action Engine</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-stone-800' : 'divide-neutral-100'}`}>
                  {products.map(p => (
                    <tr key={p.id} className={`transition-all font-medium ${isDark ? 'hover:bg-stone-800/40 text-stone-250' : 'hover:bg-neutral-50/50 text-neutral-800'}`}>
                      <td className={`py-3 px-1.5 font-bold ${textPrimaryCls}`}>
                        <div>
                          <span className="block">{p.name}</span>
                          <span className="text-[9px] text-neutral-400">Lifecycle: {p.lifecycle}</span>
                        </div>
                      </td>
                      <td className="py-3 px-1.5 text-center font-mono font-bold">{p.stock} units</td>
                      <td className="py-3 px-1.5 text-center font-mono text-neutral-450">{p.threshold} units</td>
                      <td className="py-3 px-1.5 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          p.stockoutDays <= 12 ? 'bg-red-500/10 text-red-500' :
                          p.stockoutDays <= 25 ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
                        }`}>
                          {p.stockoutDays} Days Left
                        </span>
                      </td>
                      <td className="py-3 px-1.5 text-center font-mono font-black text-red-500">${p.ltvImpact.toLocaleString()}</td>
                      <td className="py-3 px-1.5 text-center uppercase text-[9px] font-bold">
                        <span className={`px-1.5 py-0.5 rounded-md ${
                          p.cashImpact === 'safe' ? 'bg-emerald-500/10 text-emerald-500' :
                          p.cashImpact === 'warning' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'
                        }`}>
                          {p.cashImpact}
                        </span>
                      </td>
                      <td className="py-3 px-1.5 text-right">
                        <button 
                          onClick={() => triggerImpactEngine(p)}
                          className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-450 text-black text-[9px] font-black uppercase rounded-lg tracking-wider transition-all cursor-pointer"
                        >
                          Model
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Business Impact Dialogue / Copilot Chat */}
        <div className={`col-span-12 lg:col-span-4 border rounded-[28px] p-6 shadow-sm flex flex-col h-[400px] ${cardBgCls}`}>
          <h3 className="font-bold text-neutral-450 text-xs uppercase tracking-wider mb-2">Inventory Advisor Chat</h3>
          
          <div className="flex-1 overflow-y-auto space-y-3 my-2 pr-1 scrollbar-thin">
            {chatMessages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === 'owner' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] text-xs rounded-2xl p-3 border ${
                  m.sender === 'owner' 
                    ? 'bg-neutral-900 border-neutral-800 text-white rounded-tr-none' 
                    : isDark
                    ? 'bg-neutral-950 border-stone-800 text-stone-100 rounded-tl-none'
                    : 'bg-[#FFFBF5] border-amber-100 text-neutral-800 rounded-tl-none'
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
                handleCopilotChat(chatInput);
                setChatInput('');
              }
            }} 
            className={`flex gap-2 border-t pt-3 ${borderLightCls}`}
          >
            <input 
              type="text" 
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              placeholder="Ask e.g. What is my dead stock?" 
              className={`flex-1 px-3 py-2 rounded-xl text-xs outline-none ${
                isDark ? 'bg-[#141210] border-stone-800 text-stone-100 focus:ring-1 focus:ring-amber-500' : 'bg-neutral-50 border-neutral-200 text-[#1C1917] focus:ring-1 focus:ring-amber-500'
              }`}
            />
            <button className="p-2.5 bg-amber-500 hover:bg-amber-450 text-black font-black rounded-xl transition-all">
              <Send size={14} />
            </button>
          </form>

          <button 
            onClick={() => handleCopilotChat("What is slow selling inventory currently?")}
            className="mt-3 text-[10px] text-amber-500 hover:text-amber-400 font-bold text-left block"
          >
            🚨 Analyze Dead Stock Rescue opportunities
          </button>
        </div>

      </div>

      {/* Business Wide Impact Engine Modal Dialog overlay */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`max-w-lg w-full rounded-[40px] border p-8 shadow-2xl relative overflow-hidden ${
                isDark ? 'bg-stone-900 border-stone-800 text-stone-100' : 'bg-white border-neutral-200 text-neutral-800'
              }`}
            >
              {/* Top gradient border accent */}
              <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-amber-500 to-amber-700"></div>
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xs font-black text-amber-500 uppercase tracking-widest flex items-center gap-1">
                    <Shield size={12} /> StockSense Impact Engine
                  </h3>
                  <h2 className={`text-xl font-bold mt-1 ${textPrimaryCls}`}>Reorder Sequence: {selectedProduct.name}</h2>
                </div>
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="p-1 text-neutral-400 hover:text-stone-300 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 mb-6">
                
                {/* Cash-Aware Guardrail controls */}
                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-stone-950 border-stone-850' : 'bg-stone-50 border-stone-200'} space-y-3`}>
                  <div className="flex justify-between items-center">
                    <div className="text-left">
                      <span className="text-[9px] font-mono font-black uppercase text-amber-500 block">Cash-Aware Guardrails</span>
                      <h4 className="text-xs font-bold text-white uppercase font-sans">Enforce Cash Ceiling</h4>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input 
                        type="checkbox"
                        checked={isCashAwareActive}
                        onChange={(e) => setIsCashAwareActive(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-stone-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-black peer-checked:after:bg-black after:border-stone-600 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                    </label>
                  </div>

                  <div className="flex justify-between items-center text-xs pt-2 border-t border-dashed border-stone-850">
                    <span className="text-stone-400">Available Safe Cash Bankroll:</span>
                    <span className="font-mono font-extrabold text-emerald-400">${freeCashReserves.toLocaleString()} USD</span>
                  </div>
                </div>

                <div className={`p-4 rounded-2xl border ${
                  isDark ? 'bg-stone-950 border-stone-850' : 'bg-neutral-50 border-neutral-200'
                }`}>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs text-neutral-450 font-bold uppercase">Configure Order Size</span>
                    <span className="text-sm font-mono font-black text-amber-500">{restockAmount} units</span>
                  </div>
                  <input 
                    type="range" 
                    min="100" 
                    max="1000" 
                    step="50" 
                    value={restockAmount} 
                    onChange={e => setRestockAmount(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                  <p className="text-[10px] text-neutral-400 mt-2">Modeling shows {restockAmount} units provides approximately 60-day operational coverage.</p>
                </div>

                {/* Cash Threshold Warning Block */}
                {isCashAwareActive && (restockAmount * 6 > freeCashReserves) && (
                  <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-left space-y-1 animate-pulse">
                    <div className="flex items-center gap-1.5 text-red-400 font-extrabold text-[10.5px] uppercase tracking-wider font-mono">
                      <AlertTriangle size={12} /> Guardrail: Capital Overflow Alert
                    </div>
                    <p className="text-[10px] text-stone-200">
                      Proposed purchase of <span className="font-bold">${(restockAmount * 6).toLocaleString()}</span> exceeded available safe reserves of <span className="font-bold text-red-300">${freeCashReserves.toLocaleString()}</span> by <span className="font-black font-mono text-red-300">${((restockAmount * 6) - freeCashReserves).toLocaleString()}</span>. Reorder lock engaged.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className={`p-4 rounded-2xl border ${
                    isDark ? 'bg-amber-500/5 border-amber-500/10' : 'bg-[#FEF9EF] border-amber-100'
                  }`}>
                    <div className="flex items-center gap-1.5 text-amber-550 dark:text-amber-400 font-bold text-xs uppercase mb-1">
                      <Coins size={14} /> Cash Impact
                    </div>
                    <p className="text-[11px] text-neutral-450 font-medium">Order costs total <span className={`font-bold ${textPrimaryCls}`}>${restockAmount * 6}</span>. Leaving safe cash reserves intact.</p>
                  </div>
                  <div className={`p-4 rounded-2xl border ${
                    isDark ? 'bg-blue-500/5 border-blue-500/10' : 'bg-[#EFF6FF] border-blue-100'
                  }`}>
                    <div className="flex items-center gap-1.5 text-blue-550 dark:text-blue-400 font-bold text-xs uppercase mb-1">
                      <Users size={14} /> Customer Impact
                    </div>
                    <p className="text-[11px] text-neutral-450 font-medium">Prevents <span className="font-bold text-blue-700 dark:text-blue-400">18 VIP stockouts</span>. Retains estimated ${selectedProduct.ltvImpact} LTV.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className={`flex-1 py-3.5 border rounded-2xl text-xs font-bold transition-all ${
                    isDark ? 'border-[#37312C] text-stone-300 hover:bg-stone-900' : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  Cancel Order
                </button>
                <button 
                  disabled={isCashAwareActive && (restockAmount * 6 > freeCashReserves)}
                  onClick={executeRestock}
                  className={`flex-1 py-3.5 text-black font-black uppercase tracking-wider rounded-2xl transition-all ${
                    isCashAwareActive && (restockAmount * 6 > freeCashReserves)
                      ? 'bg-stone-800 text-stone-500 border border-stone-850 cursor-not-allowed'
                      : 'bg-amber-500 hover:bg-amber-450 hover:scale-101 cursor-pointer'
                  }`}
                >
                  Approve Restock Plan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </>
      )}

    </div>
  );
}
