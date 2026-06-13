import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  Settings, 
  Bell, 
  Bot, 
  Trash2, 
  BarChart2, 
  Globe, 
  Share2, 
  Cpu, 
  UserPlus, 
  Plus, 
  VolumeX, 
  Volume2,
  User,
  ShieldCheck,
  Check,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'customer' | 'owner' | 'aria';
  text: string;
  time: string;
}

interface SocialChannel {
  id: string;
  platform: 'whatsapp' | 'instagram' | 'telegram' | 'messenger' | 'x' | 'email';
  sender: string;
  avatar: string;
  message: string;
  time: string;
  unread: boolean;
  sentiment: 'positive' | 'neutral' | 'urgent' | 'negative';
  autoResponded: boolean;
  responseDraft: string;
  messages: Message[];
}

interface MonthlyReport {
  month: string;
  conversations: number;
  revenueGenerated: number;
  botAccuracy: number;
}

interface SocialHubProps {
  theme: 'light' | 'dark';
  showToast: (msg: string) => void;
}

export default function SocialHub({ theme, showToast }: SocialHubProps) {
  const isDark = theme === 'dark';

  // Omnichannel Social Live Inbox Data with conversational history transcript
  const [threads, setThreads] = useState<SocialChannel[]>([
    {
      id: 's_1',
      platform: 'whatsapp',
      sender: '+44 7946 095112',
      avatar: '💬',
      message: 'Hey, I wanted to buy bulk smart LED strips from Sameer enterprises. Is there any active supplier discount?',
      time: 'Just now',
      unread: true,
      sentiment: 'positive',
      autoResponded: true,
      responseDraft: 'Hello! Yes, Sameer Enterprises offers up to 25% discount for bulk package orders exceeding $500/month. Let me connect you directly to the owner!',
      messages: [
        {
          id: 'm1_1',
          sender: 'customer',
          text: 'Hey, I wanted to buy bulk smart LED strips from Sameer enterprises. Is there any active supplier discount?',
          time: '2m ago'
        },
        {
          id: 'm1_2',
          sender: 'aria',
          text: 'Hello! Yes, Sameer Enterprises offers up to 25% discount for bulk package orders exceeding $500/month. Let me connect you directly to the owner!',
          time: 'Just now'
        }
      ]
    },
    {
      id: 's_2',
      platform: 'instagram',
      sender: 'sameer_ventures_co',
      avatar: '📸',
      message: 'Hello, your professional dashboard layout looks so beautiful! Do you have contact details for the main director?',
      time: '6m ago',
      unread: true,
      sentiment: 'neutral',
      autoResponded: false,
      responseDraft: '',
      messages: [
        {
          id: 'm2_1',
          sender: 'customer',
          text: 'Hello, your professional dashboard layout looks so beautiful! Do you have contact details for the main director?',
          time: '6m ago'
        }
      ]
    },
    {
      id: 's_3',
      platform: 'x',
      sender: 'samad_khan_sameer',
      avatar: '🐦',
      message: 'Urgent: The supplier shipping line to Central London Sunday express delivery failed. How can we reroute logistics?',
      time: '1h ago',
      unread: false,
      sentiment: 'urgent',
      autoResponded: true,
      responseDraft: 'Logistics Alert received. Rerouting via secondary London courier nodes immediately. Standby for updated tracking index.',
      messages: [
        {
          id: 'm3_1',
          sender: 'customer',
          text: 'Urgent: The supplier shipping line to Central London Sunday express delivery failed. How can we reroute logistics?',
          time: '1h ago'
        },
        {
          id: 'm3_2',
          sender: 'aria',
          text: 'Logistics Alert received. Rerouting via secondary London courier nodes immediately. Standby for updated tracking index.',
          time: '1h ago'
        }
      ]
    }
  ]);

  // Selected thread view
  const [selectedThreadId, setSelectedThreadId] = useState<string>('s_1');
  const [typedReply, setTypedReply] = useState('');
  
  // Interactive Active Sender switcher (Owner response vs Customer simulation response)
  const [activeRespondentRole, setActiveRespondentRole] = useState<'owner' | 'customer'>('owner');

  // Active Interactive Bot AI Trainer State
  const [botRules, setBotRules] = useState<Array<{ trigger: string; response: string }>>([
    { trigger: 'bulk discount', response: 'Apply 20% discount package for orders over $500, else default retail pricing.' },
    { trigger: 'sunday delivery', response: 'London Central express channels are online. Deliveries run 09:00 - 18:00.' }
  ]);
  const [newTrigger, setNewTrigger] = useState('');
  const [newResponse, setNewResponse] = useState('');

  // Active Interactive Reports State
  const reports: MonthlyReport[] = [
    { month: 'April', conversations: 440, revenueGenerated: 3400, botAccuracy: 92 },
    { month: 'May', conversations: 610, revenueGenerated: 6200, botAccuracy: 95 },
    { month: 'June', conversations: 890, revenueGenerated: 8500, botAccuracy: 98 }
  ];

  const handleCreateTrigger = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrigger.trim() || !newResponse.trim()) return;
    setBotRules(prev => [...prev, { trigger: newTrigger.toLowerCase().trim(), response: newResponse.trim() }]);
    setNewTrigger('');
    setNewResponse('');
    showToast("🤖 Added Automatic Auto-Reply constraint to Aria Co-Pilot!");
  };

  const handleSendReply = () => {
    if (!typedReply.trim()) return;
    
    const formattedTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      sender: activeRespondentRole,
      text: typedReply,
      time: formattedTime
    };

    setThreads(prev => prev.map(t => {
      if (t.id === selectedThreadId) {
        const updatedMsgs = [...t.messages, newMessage];
        return { 
          ...t, 
          messages: updatedMsgs,
          message: typedReply, // Update latest message
          unread: activeRespondentRole === 'customer', // Mark unread if customer sends
          autoResponded: activeRespondentRole === 'owner'
        };
      }
      return t;
    }));

    setTypedReply('');
    showToast(`✉️ Transmitted reply directly as ${activeRespondentRole === 'owner' ? 'Owner Overrider' : 'Inbound Customer'}!`);
  };

  const handleApproveAriaDraft = (draftText: string) => {
    if (!draftText) return;
    const formattedTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const newMessage: Message = {
      id: `aria_${Date.now()}`,
      sender: 'owner', // Transmitted as owner approval
      text: draftText,
      time: formattedTime
    };

    setThreads(prev => prev.map(t => {
      if (t.id === selectedThreadId) {
        // Find existing 'aria' draft message and optionally remove or transition it
        // To keep it clean, we just append an owner-approved message
        return {
          ...t,
          messages: [...t.messages, newMessage],
          message: draftText,
          responseDraft: '', // Clear original draft once approved
          autoResponded: true
        };
      }
      return t;
    }));

    showToast("✅ Approved Aria auto-reply! Message broadcasted to thread.");
  };

  const selectedThread = threads.find(t => t.id === selectedThreadId) || threads[0];
  
  // Simulated Interactive Video Demo state
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoTimestamp, setVideoTimestamp] = useState(0);
  const [videoSubtitle, setVideoSubtitle] = useState("Click play to learn how to override automated Aria messages.");

  React.useEffect(() => {
    let timer: any;
    if (isVideoPlaying) {
      timer = setInterval(() => {
        setVideoTimestamp(prev => {
          const next = (prev + 1) % 30;
          // Dynamically change subtitles
          if (next === 0) setVideoSubtitle("⚡ Welcome to the Omni Unified Social Inbox demo...");
          else if (next === 5) setVideoSubtitle("🤖 Aria AI detects incoming questions about 'bulk discounts' automatically...");
          else if (next === 12) setVideoSubtitle("💡 Aria drafts and stashes an auto-response instantly inside the thread...");
          else if (next === 18) setVideoSubtitle("👑 As an Operator, you can accept, refine, or override with a single tap!");
          else if (next === 25) setVideoSubtitle("🎉 Your manual edits keep replies highly personalized. Zero script friction.");
          return next;
        });
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isVideoPlaying]);

  const cardBgCls = isDark ? 'bg-stone-900 border-stone-800 text-white' : 'bg-white border-stone-200 text-[#1C1917]';
  const textMutedCls = isDark ? 'text-stone-200 font-medium' : 'text-[#4A4A4A]';
  const bgGreyCls = isDark ? 'bg-[#141210]' : 'bg-neutral-50';

  return (
    <div className="space-y-4 max-h-[calc(100vh-140px)] flex flex-col overflow-hidden">

      {/* Main Page Header */}
      <div className={`p-4 px-5 rounded-[24px] border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-3 shrink-0 ${cardBgCls}`}>
        <div>
          <div className="flex items-center gap-2 mb-0.5 animate-pulse">
            <span className="p-1 rounded bg-amber-500/10 text-amber-500"><Globe size={14} /></span>
            <span className="text-[10px] font-black uppercase text-amber-500 tracking-wider font-mono">Unified DM Hub</span>
          </div>
          <h2 className="text-xl font-black tracking-tight text-white select-none">Omnichannel Inbox & Response Console</h2>
          <p className="text-xs text-stone-200 mt-0.5">Simulate live customer streams from WhatsApp, Instagram, Telegram, Messenger and Email in real-time.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Simulated Video Demo Button */}
          <button
            type="button"
            onClick={() => {
              setIsVideoPlaying(!isVideoPlaying);
              if (!isVideoPlaying) {
                setVideoTimestamp(0);
                setVideoSubtitle("⚡ Video Demo Started: Learn how to chain workflows and approve DM drafts.");
                showToast("🎥 Booted Simulated Feature Interactive Walkthrough!");
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-tr from-amber-500 to-amber-600 text-black text-[10px] font-black uppercase tracking-wider rounded-lg transition-all hover:scale-102 active:scale-95 cursor-pointer shadow-md shrink-0"
          >
            <span>{isVideoPlaying ? '⏸ Pause Playback' : '🎥 How-To Video Guide'}</span>
          </button>

          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[10px] font-bold text-white uppercase font-mono">Live Simulation Active</span>
          </div>
        </div>
      </div>

      {/* Simulated Video Player Banner (if active) */}
      {isVideoPlaying && (
        <div className="p-3 bg-black border border-amber-500/30 rounded-2xl flex flex-col md:flex-row items-center gap-4 shrink-0 transition-all font-mono select-none">
          <div className="w-28 h-16 bg-neutral-900 border border-stone-800 rounded-lg flex flex-col justify-between p-1.5 shrink-0 relative overflow-hidden">
            <span className="text-[7px] font-bold text-amber-500">VIDEO GUIDE</span>
            <div className="flex justify-center gap-0.5 h-6 items-end bg-transparent">
              <span className="w-1 bg-amber-500 rounded-t" style={{ height: `${Math.random() * 100}%` }}></span>
              <span className="w-1 bg-amber-500 rounded-t animate-pulse" style={{ height: `${Math.random() * 100}%` }}></span>
              <span className="w-1 bg-amber-500 rounded-t" style={{ height: `${Math.random() * 100}%` }}></span>
              <span className="w-1 bg-amber-500 rounded-t animate-pulse" style={{ height: `${Math.random() * 100}%` }}></span>
            </div>
            <div className="w-full bg-stone-800 h-1 rounded-sm overflow-hidden">
              <div className="bg-amber-500 h-full" style={{ width: `${(videoTimestamp / 30) * 100}%` }} />
            </div>
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex justify-between text-[10px]">
              <span className="text-white font-extrabold flex items-center gap-1">🎥 Omnichannel Response System (00:{videoTimestamp < 10 ? '0' + videoTimestamp : videoTimestamp} / 00:30)</span>
              <span className="text-[#32CD32] font-black uppercase tracking-wider">Playing simulation</span>
            </div>
            <p className="text-[11px] text-[#A8A29E] leading-relaxed italic bg-neutral-950 p-2 rounded-lg border border-stone-850/60 font-sans text-stone-200">
              "{videoSubtitle}"
            </p>
          </div>
        </div>
      )}

      {/* COMPACT VIEWPORT LIMITING GRID (Non scrollable page, internal scrolls) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-stretch h-[540px] min-h-0">
        
        {/* Left Section: Live Active Threads (col-span-4) - Fixed with internal scroll */}
        <section className={`col-span-12 xl:col-span-4 rounded-[24px] p-4 border flex flex-col justify-between min-h-0 ${cardBgCls}`}>
          <div className="flex flex-col h-full min-h-0">
            <div className="shrink-0 mb-3 select-none">
              <h3 className="font-extrabold text-xs uppercase tracking-wider mb-2 text-white">Live Active Threads</h3>
              <p className="text-[10.5px] text-stone-200 leading-relaxed">Click any thread channel to inspect transcripts and override response templates.</p>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-2 pr-1.5 scrollbar-none select-none">
              {threads.map(t => {
                const latestText = t.messages.length > 0 ? t.messages[t.messages.length - 1].text : t.message;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedThreadId(t.id)}
                    className={`w-full text-left p-3 border rounded-2xl relative transition-all block cursor-pointer ${
                      selectedThreadId === t.id 
                        ? 'bg-amber-500/10 border-amber-500/50 text-white font-semibold scale-101 shadow-sm'
                        : isDark ? 'bg-neutral-950/65 border-stone-850 text-stone-200 hover:bg-stone-850/60' : 'bg-stone-50 hover:bg-stone-100 border-stone-150 text-stone-900'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1.5 w-full bg-transparent">
                      <span className="font-extrabold text-xs block">{t.sender}</span>
                      <span className="text-[8.5px] uppercase font-mono text-amber-500 font-extrabold">{t.platform}</span>
                    </div>
                    <p className="text-[11px] text-zinc-200 truncate leading-relaxed">
                      {latestText}
                    </p>
                    
                    <div className="flex items-center gap-1.5 mt-2.5 pt-1.5 border-t border-stone-850/45 justify-between bg-transparent">
                      <div className="flex gap-1.5 items-center">
                        <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                          t.sentiment === 'urgent' ? 'bg-red-500/15 text-red-500' : 'bg-amber-500/10 text-amber-500'
                        }`}>
                          {t.sentiment}
                        </span>
                        {t.unread && (
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        )}
                      </div>
                      <span className="text-[8.5px] text-stone-300 block">{t.time}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Center Section: Chat Transcripts & Central Respondent Console (col-span-5) */}
        <section className={`col-span-12 xl:col-span-5 rounded-[24px] p-4 border flex flex-col justify-between min-h-0 ${cardBgCls}`}>
          <div className="flex flex-col h-full min-h-0 justify-between">
            
            {/* Header with active meta */}
            <div className="pb-3 border-b border-dashed border-stone-800 flex justify-between items-center mb-3 shrink-0 select-none">
              <div>
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-white">Aria Response Suite</h3>
                <p className="text-[11.5px] text-stone-200 mt-0.5">Stream Channel: <span className="font-bold text-amber-500 uppercase">{selectedThread.platform}</span> with {selectedThread.sender}</p>
              </div>
              <span className="text-[9px] font-mono font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full flex items-center gap-1 select-none animate-pulse">
                <Cpu size={9} /> Cognitive Live Stack
              </span>
            </div>

            {/* Bubble logs transcript scroll area */}
            <div className="flex-1 space-y-3.5 overflow-y-auto pr-1 scrollbar-none min-h-0 py-1 select-text">
              {selectedThread.messages.map((m) => {
                const isOwner = m.sender === 'owner';
                const isAria = m.sender === 'aria';
                
                return (
                  <div key={m.id} className={`flex ${isOwner || isAria ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 max-w-[85%] rounded-2xl border transition-all ${
                      isOwner 
                        ? 'bg-stone-900 border-amber-500/30 text-white rounded-tr-none shadow-sm' 
                        : isAria
                        ? 'bg-amber-500/5 text-amber-400 border-amber-500/20 rounded-tr-none'
                        : isDark
                        ? 'bg-stone-950 border-stone-850 text-stone-100 rounded-tl-none'
                        : 'bg-neutral-50 border-neutral-250 text-stone-900 rounded-tl-none'
                    }`}>
                      <div className="flex justify-between items-center gap-4 mb-1">
                        <span className={`text-[8.5px] font-mono font-black uppercase ${
                          isOwner ? 'text-[#87EFAC]' : isAria ? 'text-amber-500 font-extrabold' : 'text-stone-300'
                        }`}>
                          {isOwner ? '👑 Operator / Owner' : isAria ? '🤖 @Aria Draft' : '👤 Client Inbound'}
                        </span>
                        <span className="text-[8px] text-zinc-300">{m.time}</span>
                      </div>
                      
                      <p className="text-[11px] leading-relaxed font-semibold">{m.text}</p>
                      
                      {/* Highlight interactive Action button if it is an unapproved Aria Draft */}
                      {isAria && selectedThread.responseDraft && (
                        <div className="mt-2.5 pt-2 border-t border-amber-500/20 flex justify-end gap-1.5 bg-transparent">
                          <button
                            onClick={() => handleApproveAriaDraft(m.text)}
                            className="bg-amber-500 hover:bg-amber-400 text-black px-2 py-1 rounded text-[8px] font-black uppercase transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Check size={9} /> Approve & Draft Refill
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CENTRAL DASHBOARD / CONSOLE: CHOICE OF SENDER ROLE */}
            <div className={`mt-3 p-2.5 rounded-2xl border shrink-0 select-none ${isDark ? 'bg-stone-950/60 border-stone-850 text-white' : 'bg-stone-100 border-stone-250 text-stone-900'}`}>
              <div className="flex items-center justify-between mb-1.5 bg-transparent">
                <span className="text-[10px] font-black uppercase text-amber-500 font-mono">Central Responder Persona Mode:</span>
                <span className="text-[8.5px] text-stone-300 italic">Toggle interactive simulation:</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 bg-transparent">
                <button
                  type="button"
                  onClick={() => {
                    setActiveRespondentRole('owner');
                    showToast("👩‍💼 Switch Operator: Writing message as BUSINESS OWNER override.");
                  }}
                  className={`py-1.5 rounded-xl border text-[10px] font-black uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeRespondentRole === 'owner'
                      ? 'bg-stone-900 border-amber-500/55 text-amber-500 shadow-md'
                      : 'bg-stone-950/40 border-stone-900 text-stone-300 hover:text-white'
                  }`}
                >
                  <ShieldCheck size={11} />
                  Owner Override
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveRespondentRole('customer');
                    showToast("👤 Switch Operator: Simulating inbound messages as END CUSTOMER.");
                  }}
                  className={`py-1.5 rounded-xl border text-[10px] font-black uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeRespondentRole === 'customer'
                      ? 'bg-stone-900 border-amber-500/55 text-amber-500 shadow-md'
                      : 'bg-stone-950/40 border-stone-900 text-stone-300 hover:text-white'
                  }`}
                >
                  <User size={11} />
                  Simulate Customer DMs
                </button>
              </div>
            </div>

            {/* Input message form override */}
            <div className="pt-3 border-t border-stone-850/60 mt-3 flex gap-2 w-full shrink-0 select-none">
              <input 
                type="text"
                value={typedReply}
                onChange={e => setTypedReply(e.target.value)}
                placeholder={activeRespondentRole === 'owner' ? "Type Owner override message response..." : "Simulate customer typing message..."}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSendReply();
                }}
                className={`flex-1 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 rounded-xl ${
                  isDark ? 'bg-neutral-950 border-stone-850 text-white' : 'bg-neutral-50 border-neutral-150'
                }`}
              />
              <button 
                onClick={handleSendReply}
                className="p-2 px-3.5 bg-amber-500 hover:bg-amber-400 rounded-xl text-black transition-all cursor-pointer shadow-md flex items-center gap-1"
                title="Send messages"
              >
                <Send size={12} />
              </button>
            </div>

          </div>
        </section>

        {/* Right Section: AI Rules trainer & Performance metrics (col-span-3) */}
        <section className="col-span-12 xl:col-span-3 flex flex-col gap-4 justify-between min-h-0 select-none">
          
          {/* Trainer Card */}
          <div className={`p-4 rounded-[24px] border flex flex-col justify-between min-h-0 ${cardBgCls}`}>
            <div>
              <div className="flex items-center gap-1.5 text-amber-500 font-extrabold text-xs uppercase tracking-wider mb-1">
                <Bot size={14} className="animate-pulse animate-duration-1000" />
                <span>Auto-Reply AI Trainer</span>
              </div>
              <p className="text-[10px] text-stone-200 leading-normal mb-3">Establish conversational triggers for active messaging systems instantly.</p>
              
              <form onSubmit={handleCreateTrigger} className="space-y-2 bg-transparent">
                <input 
                  type="text"
                  required
                  placeholder="Keyword trigger (e.g. coupon)"
                  value={newTrigger}
                  onChange={e => setNewTrigger(e.target.value)}
                  className={`w-full p-2 text-xs rounded-xl focus:outline-none ${isDark ? 'bg-[#141210] border-stone-850 text-white' : 'bg-neutral-50 border-neutral-250 text-stone-900'}`}
                />
                <textarea 
                  required
                  rows={2}
                  placeholder="Aria auto dispatch explanation response..."
                  value={newResponse}
                  onChange={e => setNewResponse(e.target.value)}
                  className={`w-full p-2 text-xs rounded-xl focus:outline-none resize-none ${isDark ? 'bg-[#141210] border-stone-850 text-white' : 'bg-neutral-50 border-neutral-250 text-stone-900'}`}
                />
                <button 
                  type="submit"
                  className="w-full py-1.5 bg-stone-950 border border-stone-850 hover:bg-stone-850 text-amber-500 font-black uppercase text-[9px] rounded-xl tracking-wider select-none cursor-pointer transition-all"
                >
                  Save Training Node
                </button>
              </form>
            </div>
          </div>

          {/* Social Monthly Performance reporting ledger bar count */}
          <div className={`p-4 rounded-[24px] border min-h-0 flex flex-col justify-between ${cardBgCls}`}>
            <div>
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-amber-500 mb-2 block">Monthly Performance</h4>
              <div className="space-y-2.5 overflow-y-auto max-h-[165px] pr-1 scrollbar-none bg-transparent">
                {reports.map((r, i) => (
                  <div key={i} className="flex justify-between items-center text-xs border-b border-[#2c2724] dark:border-stone-800 pb-2 bg-transparent">
                    <div>
                      <p className="font-black text-white">{r.month}</p>
                      <p className="text-[9.5px] text-stone-200">Total DMs: {r.conversations}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-amber-500 font-mono font-black">+${r.revenueGenerated}</p>
                      <p className="text-[9.5px] text-emerald-400 font-mono font-bold">Accuracy: {r.botAccuracy}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
