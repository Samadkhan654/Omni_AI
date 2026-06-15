import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  User, 
  Store, 
  Crown, 
  MessageSquare, 
  Check, 
  Trash2,
  Minimize2,
  Maximize2,
  RefreshCw,
  Clock
} from 'lucide-react';

interface FloatingChatbotProps {
  isDark: boolean;
  currentTab: string;
  setCurrentTab: (tab: 'landing' | 'dashboard' | 'retainflow' | 'costguard' | 'stocksense' | 'aria' | 'pricing' | 'settings') => void;
  setOnboarded: (onboarded: boolean) => void;
  setOnboardingStep: (step: 1 | 2 | 3) => void;
  showToast: (message: string) => void;
  profile: {
    storeName: string;
    ownerName: string;
    email: string;
    phone: string;
    tier: string;
  };
  handleToggleTheme: () => void;
  ariaName?: string;
  ariaTone?: string;
  ariaAvatar?: string;
}

interface Message {
  id: string;
  sender: 'aria' | 'user';
  text: string;
  timestamp: string;
  isActionable?: {
    label: string;
    action: () => void;
  };
}

type Persona = 'visitor' | 'customer' | 'owner';

export default function FloatingChatbot({
  isDark,
  currentTab,
  setCurrentTab,
  setOnboarded,
  setOnboardingStep,
  showToast,
  profile,
  handleToggleTheme,
  ariaName = "Aria AI",
  ariaTone = "Helpful & Professional",
  ariaAvatar = "🤖"
}: FloatingChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [chattyMode, setChattyMode] = useState(true);
  const [persona, setPersona] = useState<Persona>('visitor');
  const [messages, setMessages] = useState<Record<Persona, Message[]>>(() => {
    const saved = localStorage.getItem('omni_floating_messages');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.visitor && parsed.customer && parsed.owner) {
          return parsed;
        }
      } catch (e) {}
    }
    return {
      visitor: [
        {
          id: 'v1',
          sender: 'aria',
          text: `Hello! Welcome to Forge AI. I am Aria, your operational co-pilot. I am here to help you explore how Forge AI empowers small businesses to scale. Are you looking to understand our features, check pricing, or start a live preview?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ],
      customer: [
        {
          id: 'c1',
          sender: 'aria',
          text: `Welcome valued customer! Seeking support for one of your transactions, shipping inquiries, or return policies for "${profile.storeName}"? Select a helpful command or let me know what you need.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ],
      owner: [
        {
          id: 'o1',
          sender: 'aria',
          text: `Good day, Commander ${profile.ownerName.split(' ')[0]}. Operations dashboard indices are functioning optimally. I am ready to run micro-tasks. You can toggle terminal themes, reset setup procedures, or ask for tactical insight.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };
  });

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync back to local storage
  useEffect(() => {
    localStorage.setItem('omni_floating_messages', JSON.stringify(messages));
  }, [messages]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, persona, isOpen]);

  // Listen for global open command from settings
  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener('open-aria-chat', handleOpenChat);
    return () => window.removeEventListener('open-aria-chat', handleOpenChat);
  }, []);

  // Persona questions helper
  const getQuickQuestions = (role: Persona) => {
    switch (role) {
      case 'visitor':
        return [
          { q: 'What is Forge AI?', id: 'v_what' },
          { q: 'How much does it cost?', id: 'v_cost' },
          { q: 'Take Onboarding Tour', id: 'v_tour' },
          { q: 'Tell me a funny joke! 🤖', id: 'v_joke' },
          { q: 'Inspiring Tech Quote 💡', id: 'v_quote' }
        ];
      case 'customer':
        return [
          { q: 'What is the return policy?', id: 'c_return' },
          { q: 'Is customer support online?', id: 'c_support' },
          { q: 'Praise my store! ❤️', id: 'c_praise' },
          { q: 'What is the business location?', id: 'c_loc' }
        ];
      case 'owner':
        return [
          { q: 'Adjust Theme Mode', id: 'o_theme' },
          { q: 'How do I resolve profit leaks?', id: 'o_leaks' },
          { q: 'Robotic Business Tip 💡', id: 'o_tactical' },
          { q: 'Aria, tell me a joke 🎭', id: 'o_joke' },
          { q: 'Relaunch Setup Wizard', id: 'o_setup' }
        ];
    }
  };

  const handlePersonaChange = (type: Persona) => {
    setPersona(type);
    showToast(`🤖 Switch assist mode: Tailored for ${type.toUpperCase()} needs`);
  };

  // Simulates artificial response typing delay
  const handleBotResponse = (userText: string, questionId?: string) => {
    setIsTyping(true);

    setTimeout(() => {
      let botReply = "Aria is processing your system queue data...";
      let actionable: { label: string; action: () => void } | undefined = undefined;

      const normalized = userText.toLowerCase().trim();

      // Check predefined triggers or fuzzy match
      if (persona === 'visitor') {
        if (questionId === 'v_joke' || normalized.includes('joke')) {
          botReply = "Beep-boop-beep! 🤖 Why did the programmer quit his business? Because he didn't get arrays! 😄 Or wait, here is an operational one for you: Why did the database blush? Because it saw the table's joins! 😭 Operations can be funny!";
        } else if (questionId === 'v_quote' || normalized.includes('quote')) {
          botReply = "Gazing at the telemetry solar winds... 🌌 Here is an inspiring quote from Steve Jobs: 'Design is not just what it looks like and feels like. Design is how it works.' Let's make your system work like perfect clockwork today!";
        } else if (questionId === 'v_what' || normalized.includes('what is') || normalized.includes('how does')) {
          botReply = "Forge AI is a consolidated business intelligence suite. Inside, you will find RetainFlow (to save lost clients), CostGuard (to isolate profit leaks), and StockSense (to prevent inventory stockouts). It aggregates every process into a unified workspace.";
        } else if (questionId === 'v_cost' || normalized.includes('pricing') || normalized.includes('cost') || normalized.includes('plan')) {
          botReply = "Forge AI offers three straightforward plans starting at $29/mo (Starter), $79/mo (Growth Suite), and $249/mo for large corporate clients. I can instantly direct you to our Premium pricing matrix!";
          actionable = {
            label: 'View Pricing Matrix',
            action: () => setCurrentTab('pricing')
          };
        } else if (questionId === 'v_tour' || normalized.includes('tour') || normalized.includes('start') || normalized.includes('onboard')) {
          botReply = "Excellent! Let us launch the 3-step Operational Onboarding Wizard directly. You will be able to customize your store name, admin profile, and alert channels.";
          actionable = {
            label: 'Relaunch Onboarding Now',
            action: () => {
              setOnboarded(false);
              setCurrentTab('dashboard');
              setOnboardingStep(1);
            }
          };
        } else {
          botReply = `Forge AI is configured for custom business rules of "${profile.storeName}". Feel free to start a free demo tour of the features using the button above, or navigate tabs via our sidebar panel!`;
        }
      } else if (persona === 'customer') {
        if (questionId === 'c_praise' || normalized.includes('praise') || normalized.includes('love') || normalized.includes('great')) {
          botReply = `Oh, thank you so much! ❤️ Your support for "${profile.storeName}" is what keeps us going. We push extreme code updates hourly to ensure your customer journeys are completely frictionless!`;
        } else if (questionId === 'c_return' || normalized.includes('return') || normalized.includes('refund') || normalized.includes('policy')) {
          botReply = `According to our system handbook for "${profile.storeName}", items can be returned in original conditions within 30 days of acquisition. For personal queries, email us at: ${profile.email}.`;
        } else if (questionId === 'c_support' || normalized.includes('support') || normalized.includes('operator')) {
          botReply = `Live customer support for "${profile.storeName}" is monitored dynamically with Aria AI. Over 89.4% of customer threads are resolved instantly. Feel free to leave a backup inquiry or dial our notification backup line: ${profile.phone}.`;
        } else if (questionId === 'c_loc' || normalized.includes('location') || normalized.includes('address') || normalized.includes('where is')) {
          botReply = `"${profile.storeName}" operates client accounts throughout Global channels with server-side support. For hardware or brick-and-mortar storefront details, please message Liam or Liam's management directly!`;
        } else {
          botReply = `Your message has been processed inside our local database memory for "${profile.storeName}". Our executive agent will align recommendations soon!`;
        }
      } else if (persona === 'owner') {
        if (questionId === 'o_joke' || normalized.includes('joke')) {
          botReply = "Beep boop! 🤖 Did you know? There are 10 types of people in the world: those who understand binary, and those who don't! 😂 Also: why do programmers prefer dark mode? Because light attracts bugs! 🦟 Keep up the high spirits, Captain!";
        } else if (questionId === 'o_tactical' || normalized.includes('tip') || normalized.includes('tactical') || normalized.includes('advice')) {
          botReply = `Scanning core parameters... 🛰️ Active recommendation: Your customer cart recovery triggers are currently outstanding. I advocate deploying dynamic coupon triggers in RetainFlow. This typically decreases abandoned transactions by 24.5%!`;
          actionable = {
            label: 'Open RetainFlow Automation',
            action: () => setCurrentTab('retainflow')
          };
        } else if (questionId === 'o_theme' || normalized.includes('theme') || normalized.includes('color') || normalized.includes('light') || normalized.includes('dark')) {
          botReply = `Processing interactive theme toggling. Adjusting user palette...`;
          actionable = {
            label: 'Force Theme Toggle',
            action: () => handleToggleTheme()
          };
        } else if (questionId === 'o_leaks' || normalized.includes('leak') || normalized.includes('cost') || normalized.includes('save')) {
          botReply = `Analyzing financial channels... We extracted five systematic profit leakage zones inside your active dashboard. Let's inspect them immediately via CostGuard.`;
          actionable = {
            label: 'Go to CostGuard Console',
            action: () => setCurrentTab('costguard')
          };
        } else if (questionId === 'o_setup' || normalized.includes('setup') || normalized.includes('wizard') || normalized.includes('reset')) {
          botReply = `Understood, manager. I can relaunch the onboarding protocol, allowing you to configure backup numbers, target emails, or select operational sectors.`;
          actionable = {
            label: 'Relaunch Setup Wizard',
            action: () => {
              setOnboarded(false);
              setCurrentTab('dashboard');
              setOnboardingStep(1);
            }
          };
        } else {
          botReply = `Acknowledged. Directing prompt to Aria cognitive system weights. Let's navigate to your Smart Assistant tab to perform more complex queries!`;
          actionable = {
            label: 'Go to Aria Assistant',
            action: () => setCurrentTab('aria')
          };
        }
      }

      // Prepend chatty prefix if chattyMode is active
      if (chattyMode) {
        const chattyPrefixes = [
          "Beep boop! 📡 Scanning operational feeds... Oh, that is a fantastic inquiry! ",
          "Greetings, human partner! 🚀 Analyzing system parameters... Here is what I resolved: ",
          "Affirmative! 🌐 Relaying cognitive feedback: ",
          "Telemetry checks are perfect! 🛰️ Let me fetch that for you: ",
          "Processing thoughts instantly... ⚡ "
        ];
        const randomPrefix = chattyPrefixes[Math.floor(Math.random() * chattyPrefixes.length)];
        botReply = `${randomPrefix}${botReply}`;
      }

      let toneSuffix = "";
      if (ariaTone.toLowerCase().includes('humour') || ariaTone.toLowerCase().includes('humor') || ariaTone.toLowerCase().includes('witty')) {
        const jokes = [
          " (P.S. Why do programmers wear glasses? Because they can't C#! 🤓 Haha!)",
          " (By the way: why was the cell phone wearing glasses? Because it lost its contacts! 📞 Keep smiling!)",
          " (Remember: code is like humor. When you have to explain it, it’s bad! 😄)"
        ];
        toneSuffix = jokes[Math.floor(Math.random() * jokes.length)];
      } else if (ariaTone.toLowerCase().includes('critical') || ariaTone.toLowerCase().includes('analytical')) {
        toneSuffix = " [ANALYSIS WARNING: Local overhead thresholds require continuous tracking. Immediate action improves efficacy by up to 14.5%] ⚠️";
      } else if (ariaTone.toLowerCase().includes('empath') || ariaTone.toLowerCase().includes('warm') || ariaTone.toLowerCase().includes('support')) {
        toneSuffix = " ❤️ I am here for you during every operational transition. You are doing a phenomenal job steering your venture forward! Keep up the brilliant effort.";
      }

      botReply = `${botReply}${toneSuffix}`;

      const botMessage: Message = {
        id: `bot_${Date.now()}`,
        sender: 'aria',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isActionable: actionable
      };

      setMessages(prev => ({
        ...prev,
        [persona]: [...prev[persona], botMessage]
      }));
      setIsTyping(false);
    }, 1200);
  };

  const submitText = (textToSend: string, questionId?: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => ({
      ...prev,
      [persona]: [...prev[persona], userMsg]
    }));

    setInput('');
    handleBotResponse(textToSend, questionId);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitText(input);
  };

  const clearChat = () => {
    const defaultMsg: Record<Persona, Message[]> = {
      visitor: [
        {
          id: 'v1',
          sender: 'aria',
          text: `Hello! Welcome to Forge AI. I am Aria, your operational co-pilot. I am here to help you explore how Forge AI empowers small businesses to scale. Are you looking to understand our features, check pricing, or start a live preview?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ],
      customer: [
        {
          id: 'c1',
          sender: 'aria',
          text: `Welcome valued customer! Seeking support for one of your transactions, shipping inquiries, or return policies for "${profile.storeName}"? Select a helpful command or let me know what you need.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ],
      owner: [
        {
          id: 'o1',
          sender: 'aria',
          text: `Good day, Commander ${profile.ownerName.split(' ')[0]}. Operations dashboard indices are functioning optimally. I am ready to run micro-tasks. You can toggle terminal themes, reset setup procedures, or ask for tactical insight.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };
    setMessages(prev => ({
      ...prev,
      [persona]: [defaultMsg[persona][0]]
    }));
    showToast("🧹 Chat history purged locally.");
  };

  return (
    <>
      {/* Floating Action Trigger Button */}
      <div className="hidden md:flex fixed bottom-6 right-6 z-50 flex-col items-end gap-3 pointer-events-none">
        
        <motion.button
          id="aria-chatbot-trigger"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl relative select-none pointer-events-auto cursor-pointer transition-all ${
            isOpen 
              ? 'bg-amber-500 text-black hover:scale-105' 
              : 'bg-[#1C1917] text-[#F59E0B] border-2 border-amber-500/30 hover:border-amber-500 hover:shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:scale-110 active:scale-95'
          }`}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          title="Toggle Aria Live Support Center"
        >
          {isOpen ? (
            <X size={22} className="animate-none" />
          ) : (
            <div className="relative flex items-center justify-center">
              <span className="text-2xl leading-none">{ariaAvatar}</span>
              <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border border-[#1C1917] flex items-center justify-center text-[7px] text-white font-black">1</span>
              </span>
            </div>
          )}
        </motion.button>
      </div>

      {/* Floating Chat Center Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="aria-support-chatbot-panel"
            initial={{ opacity: 0, scale: 0.9, y: 50, x: 0 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50, x: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 220 }}
            className={`fixed bottom-24 right-6 w-96 max-w-[calc(100vw-32px)] h-[540px] max-h-[80vh] rounded-[32px] border shadow-2xl z-50 overflow-hidden flex flex-col justify-between ${
              isDark ? 'bg-[#211F1D] border-stone-850 text-white' : 'bg-white border-stone-200 text-[#1C1917]'
            }`}
          >
            {/* Header section with glowing brand log */}
            <div className="p-4 border-b border-stone-200 dark:border-stone-850 flex items-center justify-between bg-stone-950 text-white select-none">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-550 flex items-center justify-center border border-amber-500/20 shadow-inner text-lg leading-none">
                  {ariaAvatar}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-xs tracking-tight">{ariaName} Support</span>
                    <span className="flex h-2 w-2">
                       <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
                       <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  </div>
                  <span className="text-[9px] font-medium text-stone-400 tracking-wide block">Active Tone: {ariaTone}</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button 
                  onClick={clearChat}
                  className="p-1.5 hover:bg-white/10 rounded-lg text-stone-400 hover:text-white transition-all cursor-pointer"
                  title="Purge active chat track"
                >
                  <Trash2 size={13} />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-lg text-stone-400 hover:text-white transition-all cursor-pointer"
                  title="Minimize chat drawer"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Interactive Alert banner */}
            <div className="bg-amber-500/10 border-b border-amber-500/10 px-3.5 py-1.5 flex items-center justify-between text-[10px] font-mono select-none">
              <div className="flex items-center gap-1.5 text-amber-500">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span className="font-bold uppercase tracking-wider text-[9px]">Aria Cognitive Chatty Mode</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setChattyMode(!chattyMode);
                  showToast(chattyMode ? "🤐 Quiet mode enabled. Aria is now concise." : "🗣️ Talkative mode enabled! Aria is highly verbal & witty.");
                }}
                className={`px-2 py-0.5 rounded text-[8.5px] font-black uppercase border cursor-pointer transition-all ${
                  chattyMode 
                    ? 'bg-amber-500 text-black border-amber-500 font-extrabold' 
                    : 'bg-stone-900 text-stone-400 border-stone-800'
                }`}
              >
                {chattyMode ? '🗣️ Talkative On' : '🤐 Quiet On'}
              </button>
            </div>

            {/* Persona Segment Tabs Control */}
            <div className={`p-2 border-b flex items-center gap-1 text-[10px] font-black uppercase tracking-wider select-none ${
              isDark ? 'bg-[#1C1917] border-stone-850' : 'bg-stone-50 border-stone-250'
            }`}>
              <button
                onClick={() => handlePersonaChange('visitor')}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  persona === 'visitor' 
                    ? 'bg-amber-500 text-black font-extrabold shadow-sm'
                    : isDark ? 'text-stone-400 hover:text-white hover:bg-stone-900' : 'text-stone-500 hover:text-stone-800 hover:bg-stone-100'
                }`}
              >
                <Store size={10} />
                <span>Visitor</span>
              </button>
              <button
                onClick={() => handlePersonaChange('customer')}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  persona === 'customer' 
                    ? 'bg-amber-500 text-black font-extrabold shadow-sm'
                    : isDark ? 'text-stone-400 hover:text-white hover:bg-stone-900' : 'text-stone-500 hover:text-stone-800 hover:bg-stone-100'
                }`}
              >
                <User size={10} />
                <span>Customer</span>
              </button>
              <button
                onClick={() => handlePersonaChange('owner')}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  persona === 'owner' 
                    ? 'bg-amber-500 text-black font-extrabold shadow-sm'
                    : isDark ? 'text-stone-400 hover:text-white hover:bg-stone-900' : 'text-stone-500 hover:text-stone-800 hover:bg-stone-100'
                }`}
              >
                <Crown size={10} />
                <span>Owner</span>
              </button>
            </div>

            {/* Scrolling speech logs bubble container */}
            <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${
              isDark ? 'bg-[#211F1D]' : 'bg-stone-50/50'
            }`}>
              {messages[persona].map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1 mb-1 select-none">
                    <span className="text-[8px] uppercase font-black text-stone-400 tracking-wider">
                      {msg.sender === 'aria' ? `${ariaName} (${ariaTone})` : 'You'}
                    </span>
                    <span className="text-[7.5px] font-mono text-stone-500">• {msg.timestamp}</span>
                  </div>

                  <div className={`text-xs px-3.5 py-2.5 rounded-2xl max-w-[85%] leading-relaxed border shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-[#1C1917] text-white border-neutral-800 rounded-tr-none ml-6'
                      : isDark
                        ? 'bg-stone-900/60 text-stone-100 border-stone-800 rounded-tl-none mr-6'
                        : 'bg-white text-stone-850 border-stone-200 rounded-tl-none mr-6'
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    {/* Handle actionable workflow redirect buttons within the bubble! */}
                    {msg.isActionable && (
                      <div className="mt-3 pt-2.5 border-t border-dashed border-stone-200/20 dark:border-stone-800/60">
                        <button
                          onClick={() => {
                            if (msg.isActionable && typeof msg.isActionable.action === 'function') {
                              msg.isActionable.action();
                            } else if (msg.isActionable) {
                              const label = msg.isActionable.label;
                              if (label.includes('Pricing')) {
                                setCurrentTab('pricing');
                              } else if (label.includes('Onboarding') || label.includes('Setup')) {
                                setOnboarded(false);
                                setCurrentTab('dashboard');
                                setOnboardingStep(1);
                              } else if (label.includes('Theme')) {
                                handleToggleTheme();
                              } else if (label.includes('CostGuard')) {
                                setCurrentTab('costguard');
                              } else if (label.includes('Aria')) {
                                setCurrentTab('aria');
                              }
                            }
                            setIsOpen(false);
                            showToast(`🚀 Executed action shortcut: ${msg.isActionable?.label}`);
                          }}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase text-[10px] rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer w-full tracking-wider"
                        >
                          <Sparkles size={11} />
                          <span>{msg.isActionable.label}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Bot speech typing dots indicator */}
              {isTyping && (
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-[8px] uppercase font-black text-stone-400 tracking-wider font-mono">{ariaName} is formulating response</span>
                    <span className="text-[7.5px] font-mono text-stone-500">...</span>
                  </div>
                  <div className={`p-3 rounded-2xl rounded-tl-none flex items-center gap-1.5 ${
                    isDark ? 'bg-stone-900/60 border-stone-800' : 'bg-white border-stone-200'
                  } border`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions Shelf */}
            <div className={`p-3 border-t select-none ${
              isDark ? 'bg-[#1C1917] border-stone-850' : 'bg-stone-50 border-stone-200'
            }`}>
              <span className="text-[8px] font-black uppercase text-stone-400 tracking-normal block mb-1">Preset Core Inquiries</span>
              <div className="flex flex-wrap gap-1.5">
                {getQuickQuestions(persona).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => submitText(item.q, item.id)}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-bold text-left transition-all border cursor-pointer ${
                      isDark 
                        ? 'bg-[#211F1D] hover:bg-stone-800 dark:border-stone-800 hover:border-stone-500 text-stone-200 hover:text-white'
                        : 'bg-white hover:bg-stone-100 border-stone-200 hover:border-stone-400 text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {item.q}
                  </button>
                ))}
              </div>
            </div>

            {/* Form submit input text container */}
            <form 
              onSubmit={handleFormSubmit}
              className={`p-3 border-t flex gap-2 items-center ${
                isDark ? 'bg-stone-950 border-stone-850' : 'bg-white border-stone-250'
              }`}
            >
              <input 
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={`Ask ${ariaName} anything as ${persona.toUpperCase()}...`}
                className={`flex-1 text-xs px-3.5 py-2.5 rounded-xl border focus:outline-none transition-all ${
                  isDark
                    ? 'bg-stone-900 border-stone-850 text-white focus:border-amber-500/50'
                    : 'bg-stone-50 border-stone-200 text-stone-900 focus:border-amber-500/50'
                }`}
                maxLength={400}
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className={`p-2.5 rounded-xl transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                  input.trim() && !isTyping
                    ? 'bg-amber-500 text-black hover:scale-105 active:scale-95'
                    : 'bg-stone-200 dark:bg-stone-800 text-stone-400 pointer-events-none'
                }`}
                title="Transmit prompt"
              >
                <Send size={15} />
              </button>
            </form>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
