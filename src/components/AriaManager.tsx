import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  MessageSquare, 
  Settings, 
  Shield, 
  CheckCircle2, 
  Play, 
  BookOpen, 
  Upload, 
  Plus, 
  ArrowRight, 
  Star,
  Sparkles,
  Search,
  Volume2,
  VolumeX,
  User,
  Activity,
  Check,
  Send,
  MessageCircle,
  Trash2,
  Filter,
  Mic,
  MicOff
} from 'lucide-react';

interface CustomerConvo {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  status: 'handling' | 'escalated' | 'resolved';
  messages: Array<{ sender: 'customer' | 'aria' | 'owner'; text: string; time: string }>;
}

interface AriaManagerProps {
  theme: 'light' | 'dark';
  ariaName: string;
  setAriaName: (name: string) => void;
  ariaTone: string;
  setAriaTone: (tone: string) => void;
  ariaAvatar: string;
  setAriaAvatar: (avatar: string) => void;
}

export default function AriaManager({ 
  theme, 
  ariaName, 
  setAriaName, 
  ariaTone, 
  setAriaTone, 
  ariaAvatar, 
  setAriaAvatar 
}: AriaManagerProps) {
  const [convos, setConvos] = useState<CustomerConvo[]>([
    {
      id: 'c1',
      name: 'Sarah Miller',
      avatar: 'SM',
      lastMessage: 'Is there a warranty included with my premium accessory?',
      time: '2m ago',
      status: 'handling',
      messages: [
        { sender: 'customer', text: 'Hi, I purchased the smart accessory kit yesterday but do not see warranty terms.', time: '11:42 AM' },
        { sender: 'aria', text: 'All our premium kits include a 12-month standard replacement warranty protecting against any manufacturing defects.', time: '11:43 AM' },
        { sender: 'customer', text: 'Is there a warranty included with my premium accessory?', time: '11:44 AM' }
      ]
    },
    {
      id: 'c2',
      name: 'Liam Neeson',
      avatar: 'LN',
      lastMessage: 'Do you deliver on Sundays in central London?',
      time: '15m ago',
      status: 'handling',
      messages: [
        { sender: 'customer', text: 'Hello, looking forward to ordering. Do you deliver on Sundays in central London?', time: '11:20 AM' },
        { sender: 'aria', text: 'I am fetching location schedules. Yes! London central courier services are active on Sundays for prime express lines.', time: '11:21 AM' }
      ]
    },
    {
      id: 'c3',
      name: 'Amanda Croft',
      avatar: 'AC',
      lastMessage: 'I need to reschedule my consultation session to next Tuesday.',
      time: '1h ago',
      status: 'escalated',
      messages: [
        { sender: 'customer', text: 'Hey Aria! I need to reschedule my consultation session to next Tuesday.', time: '10:30 AM' },
        { sender: 'aria', text: 'Rescheduling guidelines retrieved. Escalating to shop owner for final confirmation, hold tight!', time: '10:31 AM' }
      ]
    }
  ]);

  const [activeId, setActiveId] = useState('c1');
  const [overrideInput, setOverrideInput] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [handsFreeMode, setHandsFreeMode] = useState(false);
  const [speechLog, setSpeechLog] = useState<string[]>([]);
  const [activeBentoC3Tab, setActiveBentoC3Tab] = useState<'voice' | 'profile'>('voice');

  // New Stream custom parameters
  const [newConvoName, setNewConvoName] = useState('');
  const [newConvoMsg, setNewConvoMsg] = useState('');
  const [showAddConvo, setShowAddConvo] = useState(false);

  // Training FAQs
  const [knowledge, setKnowledge] = useState<Array<{ q: string; a: string }>>([
    { q: "What is our return delivery framework?", a: "We accept fully protected returns within 14 business days of standard tracking dispatch." },
    { q: "Do we offer commercial subscription deals?", a: "Yes, bulk pricing discounts apply dynamically for commercial orders over $500/mo." }
  ]);
  const [newQ, setNewQ] = useState('');
  const [newA, setNewA] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isAriaSpeaking, setIsAriaSpeaking] = useState(false);

  // States for personalisation modal popup creator
  const [showCreatorPopup, setShowCreatorPopup] = useState(false);
  const [tempName, setTempName] = useState(ariaName || 'Aria');
  const [tempTone, setTempTone] = useState(ariaTone || 'Helpful & Professional');
  const [tempAvatar, setTempAvatar] = useState(ariaAvatar || '🤖');
  const [tempEngine, setTempEngine] = useState('Gemini 2.5 Pro (Precision)');
  const [tempTemperature, setTempTemperature] = useState(0.7);
  const [tempGoal, setTempGoal] = useState('Customer Support & Churn Prevention');

  const activeConvo = convos.find(c => c.id === activeId) || convos[0] || {
    id: 'empty',
    name: 'No Channels Active',
    avatar: '??',
    lastMessage: 'Add an operations channel block to operate',
    time: '--',
    status: 'resolved',
    messages: []
  };

  const speakText = (text: string) => {
    if (!voiceEnabled) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => {
        setIsAriaSpeaking(true);
      };
      utterance.onend = () => {
        setIsAriaSpeaking(false);
      };
      utterance.onerror = () => {
        setIsAriaSpeaking(false);
      };
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech Synthesis failed to run:", e);
      setIsAriaSpeaking(false);
    }
  };

  const triggerOwnerMessageAndAutoResponse = (messageText: string) => {
    if (!messageText.trim()) return;

    // 1. Append the owner message to currently active conversation
    setConvos(prev => prev.map(c => {
      if (c.id === activeConvo.id) {
        return {
          ...c,
          lastMessage: messageText,
          time: 'Just now',
          messages: [
            ...c.messages,
            { sender: 'owner', text: messageText, time: 'Just now' }
          ]
        };
      }
      return c;
    }));

    showToast(`📝 Message registered: "${messageText}"`);

    // 2. Set thinking wave animation active
    setIsAriaSpeaking(true);

    // 3. Queue automatic smart reply from Aria with 1.5s delay
    setTimeout(() => {
      let ariaResponse = "";
      const query = messageText.toLowerCase();

      // Check if matches any Cognitive Database question
      const foundFAQ = knowledge.find(k => 
        query.includes(k.q.toLowerCase()) || 
        k.q.toLowerCase().split(' ').some(word => word.length > 4 && query.includes(word))
      );

      if (foundFAQ) {
        ariaResponse = `Based on stored regulations: ${foundFAQ.a}`;
      } else if (query.includes("return") || query.includes("refund")) {
        ariaResponse = "Under our compliance guidelines, return requests are accepted within 14 standard tracking days.";
      } else if (query.includes("warranty") || query.includes("guarantee")) {
        ariaResponse = "All premium accessories include a 12-month replacement warranty against manufacture faults.";
      } else if (query.includes("sunday") || query.includes("delivery")) {
        ariaResponse = "Sunday operations are verified and fully scheduled for Central London dispatch.";
      } else {
        // Dynamic Tone mapping
        if (ariaTone.includes("Humor") || ariaTone.includes("Witty")) {
          ariaResponse = `Aha! That's interesting. Adjusting my gears to priority answer: "${messageText}". Everything is fully configured here. What else can I guide you with?`;
        } else if (ariaTone.includes("Critical") || ariaTone.includes("Analytical")) {
          ariaResponse = `Synthesized criteria: "${messageText}". Evaluating support parameters and logging decision matrices. Decision indices hold fully stable.`;
        } else if (ariaTone.includes("Empathetic") || ariaTone.includes("Support")) {
          ariaResponse = `I completely understand. Regarding "${messageText}", let me handle this directly to ensure you get a stress-free outcome.`;
        } else {
          ariaResponse = `Understood. I have locked info regarding "${messageText}" and synchronized this into our active customer pipelines.`;
        }
      }

      setConvos(prev => prev.map(c => {
        if (c.id === activeConvo.id) {
          return {
            ...c,
            lastMessage: ariaResponse,
            time: 'Just now',
            messages: [
              ...c.messages,
              { sender: 'aria', text: ariaResponse, time: 'Just now' }
            ]
          };
        }
        return c;
      }));

      // Read aloud if voiceEnabled is true
      speakText(ariaResponse);

    }, 1500);
  };

  const handleSendOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideInput.trim()) return;
    triggerOwnerMessageAndAutoResponse(overrideInput);
    setOverrideInput('');
  };

  const handleCreateConvo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConvoName.trim() || !newConvoMsg.trim()) return;

    const newId = `c_${Date.now()}`;
    const initials = newConvoName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    
    // Simulate initial response tone
    let simulatedBotReply = `Understood, ${newConvoName}. I have registered your message.`;
    if (ariaTone.includes('Humor') || ariaTone.includes('Witty')) {
      simulatedBotReply += " 😄 Let's get down to business, no funny business expected!";
    } else if (ariaTone.includes('Critical') || ariaTone.includes('Analytic')) {
      simulatedBotReply += " [Operational Diagnostic Protocol Active] ⚠️ Checking compliance indices.";
    } else if (ariaTone.includes('Empathetic') || ariaTone.includes('Support')) {
      simulatedBotReply += " ❤️ I'm here to provide premium care and resolve any friction!";
    }

    const newStream: CustomerConvo = {
      id: newId,
      name: newConvoName,
      avatar: initials || 'VIP',
      lastMessage: newConvoMsg,
      time: 'Just now',
      status: 'handling',
      messages: [
        { sender: 'customer', text: newConvoMsg, time: 'Just now' },
        { sender: 'aria', text: simulatedBotReply, time: 'Just now' }
      ]
    };

    setConvos(prev => [newStream, ...prev]);
    setActiveId(newId);
    setNewConvoName('');
    setNewConvoMsg('');
    setShowAddConvo(false);
    
    // Auto speak the initial deployed response!
    speakText(simulatedBotReply);
    
    setSuccessMsg(`💬 New Client Stream "${newConvoName}" deployed!`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const trainAriaBase = () => {
    if (!newQ.trim() || !newA.trim()) return;
    setKnowledge(prev => [...prev, { q: newQ, a: newA }]);
    setNewQ('');
    setNewA('');
    setSuccessMsg(`🧠 ${ariaName} has synchronized new policy specifications!`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  // Continuous vocal processor logic
  useEffect(() => {
    const SpeechLib = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechLib) {
      return;
    }

    let rec: any = null;

    if (handsFreeMode) {
      try {
        rec = new SpeechLib();
        rec.continuous = true;
        rec.interimResults = false;
        rec.lang = 'en-US';

        rec.onstart = () => {
          showToast("🎙️ Hands-Free Mic LIVE: Speak commands or converse normally!");
        };

        rec.onresult = (event: any) => {
          const lastIndex = event.results.length - 1;
          const transcript = event.results[lastIndex][0].transcript.trim();
          if (!transcript) return;

          setSpeechLog(prev => [transcript, ...prev].slice(0, 10));
          
          // Command process logic
          const text = transcript.toLowerCase();
          
          if (text.includes("set tone to") || text.includes("set tone")) {
            let selectedTone = ariaTone;
            if (text.includes("professional") || text.includes("helpful")) {
              selectedTone = "Helpful & Professional";
            } else if (text.includes("humor") || text.includes("witty")) {
              selectedTone = "Witty & Humorous";
            } else if (text.includes("critical") || text.includes("analytic")) {
              selectedTone = "Analytical & Critical";
            } else if (text.includes("support") || text.includes("empathetic")) {
              selectedTone = "Empathetic & Supportive";
            }
            setAriaTone(selectedTone);
            speakText(`Calibrating tone profile to ${selectedTone}`);
            showToast(`🎙️ Spoken Tone Sync: ${selectedTone}`);
          } 
          else if (text.includes("set name to") || text.includes("rename to") || text.includes("change name to")) {
            const spl = transcript.split(/to/i);
            const chosenName = spl[spl.length - 1]?.trim();
            if (chosenName) {
              setAriaName(chosenName);
              speakText(`Recalibrating identifier to ${chosenName}`);
              showToast(`🎙️ Spoken Name Shift: ${chosenName}`);
            }
          }
          else if (text.includes("mute speech") || text.includes("mute sound") || text.includes("shut up") || text.includes("stop talking")) {
            setVoiceEnabled(false);
            showToast("🎙️ Voice command: Muted speech synthesis");
          }
          else if (text.includes("unmute speech") || text.includes("unmute sound") || text.includes("speak out loud") || text.includes("start talking")) {
            setVoiceEnabled(true);
            showToast("🎙️ Voice command: Unmuted speech");
            setTimeout(() => {
              speakText("Speech synthesis activated successfully.");
            }, 100);
          }
          else if (text.includes("add stream") || text.includes("deploy stream") || text.includes("add client") || text.includes("register client")) {
            const streamName = transcript.replace(/add stream/i, "")
                                        .replace(/deploy stream/i, "")
                                        .replace(/add client/i, "")
                                        .replace(/register client/i, "")
                                        .trim() || "Jessica Vance";
            const newId = `c_${Date.now()}`;
            const initials = streamName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
            
            const simulatedBotReply = `Welcome to our communication streamline, ${streamName}. Real-time transcript tracking is active.`;
            const newStream: CustomerConvo = {
              id: newId,
              name: streamName,
              avatar: initials || 'VIP',
              lastMessage: 'Vocal streamline deployed',
              time: 'Just now',
              status: 'handling',
              messages: [
                { sender: 'customer', text: 'Initiated customer voice link node', time: 'Just now' },
                { sender: 'aria', text: simulatedBotReply, time: 'Just now' }
              ]
            };
            setConvos(prev => [newStream, ...prev]);
            setActiveId(newId);
            speakText(`Spawning new voice stream for ${streamName}`);
            showToast(`🎙️ Built custom stream: ${streamName}`);
          }
          else if (text.includes("resolve current") || text.includes("resolve conversation") || text.includes("complete conversation")) {
            setConvos(prev => prev.map(c => {
              if (c.id === activeConvo.id) {
                return { ...c, status: 'resolved' };
              }
              return c;
            }));
            speakText("Conversation resolved");
            showToast("🎙️ Decoded command: Resolve");
          }
          else {
            // Treat as Direct Spoken Message override reply to active convo!
            triggerOwnerMessageAndAutoResponse(transcript);
          }
        };

        rec.onerror = (e: any) => {
          console.warn("Speech API error detected:", e);
        };

        rec.onend = () => {
          if (handsFreeMode) {
            try {
              rec.start();
            } catch (err) {}
          }
        };

        rec.start();
      } catch (err) {
        console.error("Speech Recognition initialization failed:", err);
      }
    }

    return () => {
      if (rec) {
        rec.onend = null;
        try {
          rec.stop();
        } catch (e) {}
      }
    };
  }, [handsFreeMode, activeConvo.id, ariaTone, ariaName, knowledge]);

  // Theme support classes
  const cardBgCls = theme === 'dark' 
    ? 'bg-neutral-900 border-neutral-800 text-white shadow-xl' 
    : 'bg-white border-stone-200 text-[#1C1917] shadow-sm';
  const textMutedCls = theme === 'dark' ? 'text-stone-100 font-semibold' : 'text-stone-600 font-medium';
  const inputBgCls = theme === 'dark' ? 'bg-neutral-950 border-neutral-800 text-white rounded-2xl' : 'bg-white border-stone-300 text-stone-900 rounded-xl';
  const lightCardBgCls = theme === 'dark' ? 'bg-neutral-950 hover:bg-neutral-850 border-neutral-850' : 'bg-stone-50 hover:bg-stone-100 border-stone-150';

  const showToast = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 2500);
  };

  return (
    <div className="space-y-4">
      
      {/* Alert Banner / Notification */}
      <AnimatePresence>
        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`fixed top-20 right-6 z-50 px-5 py-3 rounded-xl border shadow-2xl flex items-center gap-2 font-bold text-[11px] uppercase ${
              theme === 'dark' ? 'bg-amber-500 text-black border-amber-600' : 'bg-[#1C1917] text-white border-neutral-805'
            }`}
          >
            <Sparkles size={13} className="animate-pulse" />
            <span>{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* THE SEPARATED BENTO GRID PATTERN */}
      <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12 gap-5 items-stretch">
        
        {/* BENTO C3: HOLOGRAM & PERSONALISATION SUITE (NEW SEPARATED SUITE) */}
        <section id="bento-personalization" className={`rounded-[24px] border p-4 flex flex-col justify-between shadow-xl relative overflow-hidden transition-all h-[510px] col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-6 ${
          theme === 'dark' ? 'bg-[#211F1D] border-[#3D3732] text-white' : 'bg-[#1C1917] text-white border-neutral-800'
        }`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.06)_0%,transparent_75%)] pointer-events-none"></div>

          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] bg-amber-500/10 text-amber-400 font-extrabold uppercase px-2 py-0.5 rounded-full border border-amber-500/20 tracking-wider">Configure Co-Pilot Core</span>
              <div className="flex gap-1 items-center">
                <button
                  type="button"
                  onClick={() => {
                    setTempName(ariaName);
                    setTempTone(ariaTone);
                    setTempAvatar(ariaAvatar);
                    setShowCreatorPopup(true);
                  }}
                  className="p-1 bg-amber-500 text-black hover:bg-amber-400 rounded-lg transition-all cursor-pointer flex items-center justify-center shrink-0"
                  title="Open full co-pilot builder popup wizard"
                >
                  <Plus size={11} />
                </button>
                <button 
                  onClick={() => {
                    setVoiceEnabled(!voiceEnabled);
                    showToast(voiceEnabled ? "🔇 Audio outputs muted." : "🔊 Audio outputs unmuted.");
                  }}
                  className={`p-1 rounded-lg transition-all cursor-pointer ${
                    voiceEnabled ? 'bg-amber-500 text-black' : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                  title={voiceEnabled ? "Mute speech synthesis" : "Enable speech synthesis"}
                >
                  {voiceEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
                </button>
              </div>
            </div>

            {/* Space-Efficient Spinning Cognitive Ring inside black block */}
            <div className="h-24 rounded-2xl bg-black/45 border border-white/5 shadow-inner relative flex flex-col items-center justify-center overflow-hidden">
              <div className="absolute w-20 h-20 rounded-full border border-amber-500/5 animate-spin" style={{ animationDuration: '30s' }}></div>
              <div className="absolute w-14 h-14 rounded-full border border-dashed border-amber-500/10 animate-spin" style={{ animationDuration: '12s' }}></div>

              {/* Status badge in corner */}
              <div className="absolute top-1 right-2 flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${isAriaSpeaking ? 'bg-amber-500 animate-ping' : 'bg-stone-500'}`}></span>
                <span className="text-[7px] font-mono text-stone-400 uppercase tracking-widest">{isAriaSpeaking ? 'Speaking' : 'Idle'}</span>
              </div>

              <div className="flex items-center gap-3 relative z-10 w-full px-4 justify-center">
                <motion.div 
                  animate={{ 
                    y: isAriaSpeaking ? [0, -4, 0] : [0, -1, 0],
                    scale: isAriaSpeaking ? [1, 1.1, 1] : [1, 1.02, 1]
                  }}
                  transition={{ duration: isAriaSpeaking ? 1.5 : 4.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 shadow-[0_0_15px_rgba(245,158,11,0.35)] flex items-center justify-center border-2 border-white/10 overflow-hidden shrink-0"
                >
                  {ariaAvatar.startsWith('data:video') ? (
                    <video src={ariaAvatar} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                  ) : ariaAvatar.startsWith('data:image') || ariaAvatar.startsWith('http') || ariaAvatar.startsWith('/') ? (
                    <img src={ariaAvatar} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="text-xl">{ariaAvatar}</span>
                  )}
                </motion.div>

                {/* Looped Mouth waveform simulation */}
                <div className="flex gap-0.5 items-end h-7 shrink-0 bg-black/40 px-2 py-1 rounded-lg border border-white/5">
                  {[...Array(5)].map((_, i) => (
                    <motion.div 
                      key={i}
                      animate={{ 
                        height: isAriaSpeaking 
                          ? [6, Math.max(8, Math.random() * 18), 6] 
                          : [3, Math.max(4, Math.random() * 7), 3] 
                      }}
                      transition={{ 
                        duration: 0.25 + (i * 0.05), 
                        repeat: Infinity, 
                        ease: 'easeInOut' 
                      }}
                      className="w-1 rounded-full bg-amber-500"
                    />
                  ))}
                </div>
              </div>

              {/* Speech Test trigger button */}
              <button 
                type="button"
                onClick={() => {
                  speakText(`Hello! System diagnostic clear. Continuous hands free integration active.`);
                }}
                className="absolute bottom-1 text-[7.5px] font-bold font-mono text-[#F59E0B] hover:underline cursor-pointer"
              >
                [Audible Speech Connection Check]
              </button>
            </div>

            {/* TAB SELECTOR: VOCAL HARMONY vs PROFILE SPECS */}
            <div className="flex bg-black/30 p-1 rounded-xl border border-white/5">
              <button
                type="button"
                onClick={() => setActiveBentoC3Tab('voice')}
                className={`flex-1 py-1.5 rounded-lg text-center text-[9px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  activeBentoC3Tab === 'voice' 
                    ? 'bg-amber-500 text-black font-extrabold shadow' 
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <Mic size={10} />
                <span>Hands-Free Mic</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveBentoC3Tab('profile')}
                className={`flex-1 py-1.5 rounded-lg text-center text-[9px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  activeBentoC3Tab === 'profile' 
                    ? 'bg-amber-500 text-black font-extrabold shadow' 
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <Settings size={10} />
                <span>Profile Config</span>
              </button>
            </div>

            {/* TAB CONTENT: HANDS FREE VOICE PORTAL */}
            {activeBentoC3Tab === 'voice' && (
              <div className="space-y-2 p-2 rounded-xl bg-black/20 border border-white/5 text-stone-300 min-h-[195px] flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center pb-1 border-b border-white/5 mb-1.5">
                    <span className="text-[7.5px] font-black text-amber-500 uppercase tracking-wider">🎙️ Voice Recognition Engine</span>
                    
                    {/* Continuous toggle controller */}
                    <button
                      type="button"
                      onClick={() => {
                        setHandsFreeMode(!handsFreeMode);
                        if (!handsFreeMode) {
                          setTimeout(() => {
                            speakText("Microphone loop engaged. Speak commands or converse normally.");
                          }, 100);
                        }
                      }}
                      className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1 cursor-pointer border ${
                        handsFreeMode 
                          ? 'bg-red-500/10 text-red-400 border-red-500/30' 
                          : 'bg-stone-800 text-stone-300 border-stone-700'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${handsFreeMode ? 'bg-red-500 animate-pulse' : 'bg-stone-500'}`} />
                      <span>{handsFreeMode ? "LIVE MIC ACTIVE" : "ARM VOICE LOOP"}</span>
                    </button>
                  </div>

                  <p className="text-[9px] text-[#A8A29E] leading-relaxed mb-2">
                    {handsFreeMode 
                      ? "🔥 Live loop runs continuously. Say your message out loud or use direct spoken keys—system triggers responses automatically without clicking!" 
                      : "Microphone currently disarmed. Toggle 'ARM VOICE LOOP' to converse directly using continuous hands-free speech or use simulations below."
                    }
                  </p>

                  {/* Vocal Simulator Shortcut Triggers */}
                  <div className="space-y-1">
                    <span className="text-[7.5px] font-black uppercase tracking-wider text-stone-400 block">Simulate Spoken Commands (Click to Trigger)</span>
                    <div className="flex flex-wrap gap-1">
                      <button 
                        type="button"
                        onClick={() => {
                          showToast("🎙️ Simulated Spoken: 'add stream Mark Davis'");
                          setSpeechLog(prev => ["simulate: add stream Mark Davis", ...prev]);
                          
                          const newId = `c_${Date.now()}`;
                          const initials = "MD";
                          const simulatedBotReply = `Greetings Mark Davis, how can I calibrate operations for you today?`;
                          const newStream: CustomerConvo = {
                            id: newId,
                            name: "Mark Davis",
                            avatar: initials,
                            lastMessage: 'Vocal stream launched',
                            time: 'Just now',
                            status: 'handling',
                            messages: [
                              { sender: 'customer', text: 'Where is my delivery?', time: 'Just now' },
                              { sender: 'aria', text: simulatedBotReply, time: 'Just now' }
                            ]
                          };
                          setConvos(prev => [newStream, ...prev]);
                          setActiveId(newId);
                          speakText(simulatedBotReply);
                        }}
                        className="px-1.5 py-0.5 bg-stone-900 border border-white/10 hover:border-amber-500 rounded text-[8px] font-bold text-stone-200 transition-all cursor-pointer"
                      >
                        🗣️ Add stream Mark
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          showToast("🎙️ Simulated Spoken: 'set tone response helpful'");
                          setSpeechLog(prev => ["set tone helpful", ...prev]);
                          setAriaTone("Helpful & Professional");
                          speakText("Tone configured to Professional");
                        }}
                        className="px-1.5 py-0.5 bg-stone-900 border border-white/10 hover:border-amber-500 rounded text-[8px] font-bold text-stone-200 transition-all cursor-pointer"
                      >
                        🗣️ Set Professional Tone
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          showToast("🎙️ Simulated Spoken: 'set tone response witty'");
                          setSpeechLog(prev => ["set tone witty", ...prev]);
                          setAriaTone("Witty & Humorous");
                          speakText("Tone configured to Witty");
                        }}
                        className="px-1.5 py-0.5 bg-stone-900 border border-white/10 hover:border-amber-500 rounded text-[8px] font-bold text-stone-200 transition-all cursor-pointer"
                      >
                        🗣️ Set Witty Tone
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (activeConvo.id === 'empty') return;
                          
                          // Simulate customer question
                          showToast("🎙️ User triggers simulated customer query");
                          setConvos(prev => prev.map(c => {
                            if (c.id === activeConvo.id) {
                              const newMsg = "Is there a custom warranty with this smart package?";
                              return {
                                ...c,
                                lastMessage: newMsg,
                                time: 'Just now',
                                messages: [
                                  ...c.messages,
                                  { sender: 'customer', text: newMsg, time: 'Just now' }
                                ]
                              };
                            }
                            return c;
                          }));

                          // Auto reply triggers automatically
                          setTimeout(() => {
                            const replayText = `Yes, all our luxury smart packages come with a standard 12-month full replacement warranty protecting against any manufacturing faults.`;
                            setConvos(prev => prev.map(c => {
                              if (c.id === activeConvo.id) {
                                return {
                                  ...c,
                                  lastMessage: replayText,
                                  time: 'Just now',
                                  messages: [
                                    ...c.messages,
                                    { sender: 'aria', text: replayText, time: 'Just now' }
                                  ]
                                };
                              }
                              return c;
                            }));
                            speakText(replayText);
                          }, 1500);
                        }}
                        className="px-1.5 py-0.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded text-[8.5px] font-black text-amber-400 transition-all cursor-pointer"
                      >
                        🔥 Simulate Customer Query (Auto-Response Test)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Real-time transcribed spoken log array */}
                <div className="bg-black/35 rounded-lg p-2 border border-white/5 h-16 overflow-y-auto scrollbar-none flex flex-col justify-end font-sans">
                  <span className="text-[7px] text-zinc-500 uppercase font-mono block mb-1">Live Wave Transcription:</span>
                  {speechLog.length === 0 ? (
                    <p className="text-[8.5px] italic text-zinc-500 font-mono">No voice stream captured yet. Arm mic and speak out loud...</p>
                  ) : (
                    speechLog.slice(0, 3).map((log, i) => (
                      <div key={i} className="text-[9.2px] font-mono text-[#D97706] truncate leading-normal">
                        ⚡ Heard: "{log}"
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: PROFILE SPECS CONFIG */}
            {activeBentoC3Tab === 'profile' && (
              <div className="space-y-2 p-2.5 rounded-xl bg-black/20 border border-white/5 text-stone-300 min-h-[195px] flex flex-col justify-between">
                <div className="space-y-2">
                  {/* Custom Input Name */}
                  <div className="space-y-0.5">
                    <label className="text-[7.5px] font-bold text-stone-400 uppercase tracking-widest block">Agent name</label>
                    <input 
                      type="text" 
                      value={ariaName}
                      onChange={e => setAriaName(e.target.value)}
                      className="w-full bg-stone-900/60 border border-white/10 rounded-lg p-1.5 text-[11px] text-white focus:outline-none focus:border-amber-500 font-extrabold"
                      placeholder="Assistant custom name"
                    />
                  </div>

                  {/* Custom Dropdown selects */}
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="space-y-0.5">
                      <label className="text-[7.5px] font-bold text-stone-400 uppercase tracking-widest block">Tone Profile</label>
                      <select 
                         value={ariaTone}
                         onChange={e => {
                           setAriaTone(e.target.value);
                           showToast(`Tone Calibrated: ${e.target.value}`);
                         }}
                         className="w-full bg-stone-900/60 border border-white/10 rounded-lg p-1 text-[10px] text-white focus:outline-none focus:border-amber-500 font-bold"
                      >
                        <option value="Helpful & Professional">Professional</option>
                        <option value="Witty & Humorous">Humorous</option>
                        <option value="Analytical & Critical">Critical</option>
                        <option value="Empathetic & Supportive">Supportive</option>
                      </select>
                    </div>

                    <div className="space-y-0.5">
                      <label className="text-[7.5px] font-bold text-stone-400 uppercase tracking-widest block">Avatar Core</label>
                      <select 
                        value={ariaAvatar}
                        onChange={e => {
                          setAriaAvatar(e.target.value);
                          showToast(`Core avatar set to ${e.target.value}`);
                        }}
                        className="w-full bg-stone-900/60 border border-white/10 rounded-lg p-1 text-[10px] text-white focus:outline-none focus:border-amber-500 font-bold"
                      >
                        <option value="🤖">🤖 Bot</option>
                        <option value="🌟">🌟 Spark</option>
                        <option value="🧠">🧠 Brain</option>
                        <option value="👑">👑 Crown</option>
                        <option value="🧚">🧚 Pixie</option>
                        <option value="🦁">🦁 Lion</option>
                      </select>
                    </div>
                  </div>
                </div>

                <p className="text-[8px] text-stone-500 text-center leading-relaxed">
                  Tip: Changes here calibrate {ariaName}'s primary response models immediately. Create complex behaviors inside standard creator.
                </p>
              </div>
            )}
          </div>

          <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[8px] font-bold text-neutral-400 tracking-wider">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Learning API sync active ({ariaTone})</span>
            </div>
            <span>Vocal Protocol v2.5</span>
          </div>
        </section>

        {/* BENTO C4: COGNITIVE TRAINING DATABASE (RULES & REGULATIONS) */}
        <section id="bento-training-database" className={`rounded-[24px] border p-4 shadow-sm flex flex-col justify-between transition-all h-[510px] col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-6 ${cardBgCls}`}>
          <div>
            <div className="pb-2 border-b border-stone-200 dark:border-stone-850 mb-2.5 flex items-center gap-2">
              <span className="p-1 rounded bg-amber-500/10 text-amber-500"><BookOpen size={14} /></span>
              <div>
                <h3 className="font-extrabold text-xs sm:text-[13px] text-[#1C1917] dark:text-stone-100 pb-0.5 uppercase tracking-wider">Cognitive Database</h3>
                <p className="text-[10px] text-neutral-455">Expand system return specs & FAQs</p>
              </div>
            </div>

            {/* Current FAQ structures */}
            <div className="space-y-1.5 mb-2 overflow-y-auto max-h-[160px] pr-1 scrollbar-none">
              {knowledge.map((k, i) => (
                <div key={i} className={`p-2 rounded-xl border ${
                  theme === 'dark' ? 'border-neutral-800 bg-neutral-950' : 'border-stone-200 bg-stone-50'
                }`}>
                  <p className="text-[9.5px] font-black text-amber-600 dark:text-amber-500 mb-0.5">💡 Q: {k.q}</p>
                  <p className="text-[9.5px] font-semibold text-stone-700 dark:text-stone-300 leading-snug">A: {k.a}</p>
                </div>
              ))}
            </div>

            {/* FAQ Entry Inputs */}
            <div className="space-y-2 pt-2.5 border-t border-dashed border-stone-200 dark:border-stone-850">
              <span className="text-[8px] text-neutral-455 font-black uppercase tracking-widest block mb-0.5">Add Regulation Rule</span>
              
              <input 
                type="text" 
                value={newQ}
                onChange={e => setNewQ(e.target.value)}
                placeholder="User trigger question..."
                className={`w-full px-2.5 py-1.5 border rounded-lg text-[10px] focus:outline-none ${
                  theme === 'dark' 
                    ? 'bg-neutral-950 border-neutral-850 text-white'
                    : 'bg-stone-50 border-stone-300 text-stone-900'
                }`}
              />
              
              <textarea 
                rows={2}
                value={newA}
                onChange={e => setNewA(e.target.value)}
                placeholder="Aria's resolved policy reply..."
                className={`w-full px-2.5 py-1.5 border rounded-lg text-[10px] font-sans focus:outline-none ${
                   theme === 'dark' 
                    ? 'bg-neutral-950 border-neutral-850 text-white'
                    : 'bg-stone-50 border-stone-300 text-stone-900'
                }`}
              />
              
              <button 
                onClick={trainAriaBase}
                className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-black text-[10.5px] font-black uppercase rounded-xl tracking-wider transition-all cursor-pointer"
              >
                Sync with {ariaName} Knowledge API
              </button>
            </div>
          </div>

          <div className={`mt-3 p-2 rounded-xl border text-center justify-center flex items-center gap-1.5 text-[9.5px] font-bold font-mono tracking-wide ${
            theme === 'dark' ? 'bg-neutral-950 border-neutral-800 text-amber-500' : 'bg-[#FEF9EF] border-amber-200 text-amber-800'
          }`}>
            <Upload size={12} className="text-amber-500 shrink-0" />
            <span>Upload store product catalog CSV</span>
          </div>
        </section>

        {/* BENTO C1: CUSTOMER CHANNELS (STREAM SELECTOR ONLY) */}
        <section id="bento-client-channels" className={`rounded-[24px] border p-4 shadow-sm flex flex-col justify-between transition-all h-[460px] col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-4 ${cardBgCls}`}>
          <div>
            <div className="flex justify-between items-center pb-2 border-b border-stone-200 dark:border-stone-850 mb-2.5 bg-transparent">
              <div>
                <h3 className="font-extrabold text-[#1c1917] dark:text-stone-100 text-xs sm:text-[13px] uppercase tracking-wider">Customer Channels</h3>
                <p className="text-[10px] text-neutral-400">Live communication streams</p>
              </div>
              <button 
                onClick={() => setShowAddConvo(!showAddConvo)}
                className="p-1 px-2 bg-amber-500 hover:bg-amber-400 text-black rounded-xl text-[9px] font-black uppercase flex items-center gap-1 cursor-pointer transition-all hover:scale-105"
              >
                <Plus size={10} />
                <span>Add Stream</span>
              </button>
            </div>

            {/* Dynamic New Stream Creator Form */}
            {showAddConvo && (
              <motion.form 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-3 mb-2.5 rounded-xl border border-dashed border-stone-300 dark:border-stone-850 bg-stone-50/50 dark:bg-stone-950/40 space-y-2"
                onSubmit={handleCreateConvo}
              >
                <p className="text-[8px] font-black uppercase tracking-widest text-[#D97706]">Register Virtual Client</p>
                <input 
                  type="text"
                  required
                  placeholder="Customer Name (e.g. Jessica Vance)"
                  value={newConvoName}
                  onChange={e => setNewConvoName(e.target.value)}
                  className={`w-full p-2 text-[10px] rounded-lg border focus:outline-none ${inputBgCls}`}
                />
                <input 
                  type="text"
                  required
                  placeholder="Initial Message (e.g. Where is my product?)"
                  value={newConvoMsg}
                  onChange={e => setNewConvoMsg(e.target.value)}
                  className={`w-full p-2 text-[10px] rounded-lg border focus:outline-none ${inputBgCls}`}
                />
                <div className="flex gap-1.5 justify-end pt-1">
                  <button 
                    type="button" 
                    onClick={() => setShowAddConvo(false)}
                    className="px-2 py-1 bg-stone-200 dark:bg-stone-850 text-stone-500 rounded text-[9px] font-bold"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black rounded text-[9px] font-black uppercase"
                  >
                    Deploy
                  </button>
                </div>
              </motion.form>
            )}

            {/* Chat Choice selection items */}
            <div className="space-y-1.5 scrollbar-none overflow-y-auto max-h-[320px] pr-1 font-sans">
              {convos.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-[10px] text-neutral-400">No active streams.</p>
                  <button onClick={() => setShowAddConvo(true)} className="text-[9px] font-bold text-amber-550 underline mt-1 block w-full text-center">Deploy custom stream</button>
                </div>
              ) : (
                convos.map(c => (
                  <button 
                    key={c.id}
                    onClick={() => setActiveId(c.id)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center gap-2.5 cursor-pointer relative ${
                      activeId === c.id 
                        ? 'bg-amber-500/10 border-amber-500/30' 
                        : lightCardBgCls
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-neutral-950 border border-neutral-855 text-[#F59E0B] font-black flex items-center justify-center text-[10px] shrink-0">
                      {c.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-[10.5px] truncate">{c.name}</span>
                        <span className="text-[7px] text-neutral-455 font-mono">{c.time}</span>
                      </div>
                      <p className="text-[9px] text-neutral-455 truncate leading-tight">{c.lastMessage}</p>
                    </div>
                    {c.status === 'escalated' && (
                      <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
          
          <div className="p-2 border-t border-dashed border-stone-200 dark:border-stone-850 text-center text-[8.5px] font-bold text-neutral-400">
            Total Channels Managed: {convos.length}
          </div>
        </section>

        {/* BENTO C2: ARIA HANDLER LOGS (CONVERSATION VIEW & INTERVENTION PANEL) */}
        <section id="bento-conversation-logs" className={`rounded-[24px] border p-4 shadow-sm flex flex-col justify-between transition-all h-[460px] col-span-12 md:col-span-6 lg:col-span-8 xl:col-span-8 ${cardBgCls}`}>
          <div className="flex flex-col h-full justify-between space-y-2">
            <div className="flex justify-between items-center pb-2 border-b border-stone-200 dark:border-stone-850">
              <div>
                <h3 className="font-extrabold text-[#1c1917] dark:text-stone-100 text-xs sm:text-[13px] uppercase tracking-wider">Aria Handler Logs</h3>
                <p className="text-[10px] text-neutral-400">Cognitive resolution logs</p>
              </div>
              <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                activeConvo.status === 'escalated' ? 'bg-red-500/15 text-red-500 border border-red-500/10' : 'bg-amber-500/15 text-amber-500'
              }`}>
                {activeConvo.status}
              </span>
            </div>

            {/* Message loop bubbles */}
            <div className={`flex-grow border rounded-2xl p-2.5 flex flex-col justify-between overflow-hidden h-[280px] ${
              theme === 'dark' ? 'bg-neutral-950 border-neutral-850' : 'bg-stone-50 border-stone-200'
            }`}>
              <div className="flex-1 overflow-y-auto space-y-2 mb-3 pr-1 scrollbar-none">
                {activeConvo.messages && activeConvo.messages.length > 0 ? (
                  activeConvo.messages.map((m, idx) => (
                    <div key={idx} className={`flex ${m.sender === 'customer' ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-[88%] text-[10px] rounded-xl p-2 leading-normal border ${
                        m.sender === 'customer'
                          ? 'bg-stone-200/50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-neutral-700 rounded-tl-none'
                          : m.sender === 'owner'
                          ? 'bg-[#1C1917] dark:bg-neutral-900 text-white border-neutral-855 rounded-tr-none'
                          : 'bg-amber-500/10 border-amber-500/20 text-[#D97706] rounded-tr-none'
                      }`}>
                        <span className="text-[7px] font-black block mb-0.5 opacity-60 uppercase">
                          {m.sender === 'customer' ? activeConvo.name : m.sender === 'owner' ? 'Owner Override' : ariaName}
                        </span>
                        {m.text}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <p className="text-[9.5px] text-stone-400">Select an active customer stream channel to review transcripts</p>
                  </div>
                )}
              </div>

              {/* Send controls */}
              <form onSubmit={handleSendOverride} className="flex gap-1.5 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <input 
                  type="text" 
                  value={overrideInput}
                  onChange={e => setOverrideInput(e.target.value)}
                  placeholder={`Override response with ${ariaName}...`} 
                  disabled={convos.length === 0}
                  className={`flex-1 px-2.5 py-1.5 text-[9.5px] focus:outline-none rounded-lg border ${
                    theme === 'dark' 
                      ? 'bg-neutral-950 border-neutral-855 text-white focus:ring-1 focus:ring-amber-500' 
                      : 'bg-white border-stone-300 text-stone-900 focus:ring-1 focus:ring-amber-500'
                  }`}
                />
                <button 
                  type="submit" 
                  disabled={convos.length === 0}
                  className={`p-1.5 px-2 bg-amber-500 hover:bg-amber-400 text-black rounded-md transition-all shrink-0 cursor-pointer ${convos.length === 0 && 'opacity-40'}`}
                >
                  <ArrowRight size={11} />
                </button>
              </form>
            </div>
          </div>
        </section>

      </div>

      {/* Custom Personalised Co-Pilot Pop-up Modal Creator Wizard */}
      {showCreatorPopup && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-[300] flex items-center justify-center p-4">
          <div className={`p-6 rounded-[32px] border shadow-2xl max-w-lg w-full flex flex-col justify-between ${
            theme === 'dark' ? 'bg-[#1C1917] border-[#3E3832] text-white' : 'bg-white border-stone-200 text-stone-900'
          }`}>
            <div>
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <span className="p-1 px-2.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-500 border border-amber-550/20 font-mono">
                    System Overlay: v2.5
                  </span>
                  <h3 className="text-base font-black uppercase tracking-tight">Configure Custom Co-Pilot Persona</h3>
                </div>
                <button 
                  onClick={() => setShowCreatorPopup(false)}
                  className="p-1 text-stone-450 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <p className="text-[11px] text-neutral-400 mb-5">
                Formulate cognitive tone mappings, visual credentials, and logical constraints to spawn your custom business agent instantly.
              </p>

              {/* Form and Preview Split */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                
                {/* Form Elements */}
                <div className="space-y-3.5">
                  {/* Name Input */}
                  <div>
                    <label className="text-[8px] font-black uppercase text-stone-400 block mb-1">Agent Name</label>
                    <input 
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      placeholder="e.g. Sameer Bot, Aria Prime"
                      className="w-full text-xs p-2.5 rounded-lg bg-stone-950 border border-stone-850 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Tone Choice */}
                  <div>
                    <label className="text-[8px] font-black uppercase text-stone-400 block mb-1">Tone Profile</label>
                    <select
                      value={tempTone}
                      onChange={(e) => setTempTone(e.target.value)}
                      className="w-full text-xs p-2 bg-stone-950 border border-stone-850 text-white rounded-lg focus:outline-none focus:border-amber-500"
                    >
                      <option value="Helpful & Professional">Helpful & Professional</option>
                      <option value="Witty & Humorous">Witty & Humorous</option>
                      <option value="Analytical & Critical">Analytical & Critical</option>
                      <option value="Empathetic & Supportive">Empathetic & Supportive</option>
                      <option value="Diplomatic & Executive">Diplomatic & Executive</option>
                    </select>
                  </div>

                  {/* Engine Model Select */}
                  <div>
                    <label className="text-[8px] font-black uppercase text-stone-400 block mb-1">Inference Model</label>
                    <select
                      value={tempEngine}
                      onChange={(e) => setTempEngine(e.target.value)}
                      className="w-full text-xs p-2 bg-stone-950 border border-stone-850 text-white rounded-lg focus:outline-none focus:border-amber-500"
                    >
                      <option value="Gemini 2.5 Pro (Precision)">Gemini 2.5 Pro (Precision)</option>
                      <option value="Gemini 2.5 Flash (Ultra Fast)">Gemini 2.5 Flash (Ultra Fast)</option>
                      <option value="Gemini 2.0 Ultra (Experimental)">Gemini 2.0 Ultra (Experimental)</option>
                    </select>
                  </div>

                  {/* Temperature slider */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[8px] font-black uppercase text-stone-400">Temperature (Creativity)</label>
                      <span className="font-mono text-[9px] text-amber-500 font-extrabold">{tempTemperature}</span>
                    </div>
                    <input 
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.1"
                      value={tempTemperature}
                      onChange={(e) => setTempTemperature(parseFloat(e.target.value))}
                      className="w-full accent-amber-500 outline-none"
                    />
                  </div>
                </div>

                {/* Right columns: Emoji picker and live avatar preview widget */}
                <div className="space-y-3.5">
                  {/* Select Core Avatar */}
                  <div>
                    <label className="text-[8px] font-black uppercase text-stone-400 block mb-1.5">Avatar Glyph Core</label>
                    <div className="grid grid-cols-4 gap-1.5 mb-2">
                      {['🤖', '🌟', '🧠', '👑', '🧚', '🦁', '⚡', '💼', '🦄', '🦉', '🌋', '🔮'].map(emoji => (
                        <button
                          type="button"
                          key={emoji}
                          onClick={() => setTempAvatar(emoji)}
                          className={`p-1.5 rounded-lg text-sm hover:bg-neutral-800 transition-all cursor-pointer ${
                            tempAvatar === emoji ? 'bg-amber-500/10 border border-amber-500 text-white scale-105' : 'bg-stone-950 border border-stone-850'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>

                    {/* Image / Video File loader */}
                    <div className="space-y-1 mt-2 pb-2 border-b border-white/5">
                      <label className="text-[8px] font-black uppercase text-stone-400 block">Or upload custom avatar image/video</label>
                      <div className="flex gap-1.5 items-center">
                        <input 
                          type="file"
                          accept="image/*,video/*"
                          id="copilot-media-loader-file"
                          className="hidden"
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const r = new FileReader();
                              r.onload = () => {
                                if (r.result && typeof r.result === 'string') {
                                  setTempAvatar(r.result);
                                }
                              };
                              r.readAsDataURL(file);
                            }
                          }}
                        />
                        <label 
                          htmlFor="copilot-media-loader-file"
                          className="flex-1 text-center py-2 bg-stone-950 hover:bg-stone-900 border border-stone-850 text-[10px] text-stone-300 rounded-lg cursor-pointer font-bold hover:text-white transition-all"
                        >
                          Choose photo / video
                        </label>
                        {(tempAvatar.startsWith('data:') || tempAvatar.startsWith('http')) && (
                          <button 
                            type="button"
                            onClick={() => setTempAvatar('🤖')}
                            className="p-2 bg-red-500/15 border border-red-500/10 text-red-500 text-[10px] rounded-lg font-bold"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                      <button 
                        type="button"
                        onClick={() => {
                          setTempAvatar('https://assets.mixkit.co/videos/preview/mixkit-young-woman-with-glasses-smiling-41223-large.mp4');
                          showToast("🎭 Loopable Conversation Video preset loaded!");
                        }}
                        className="w-full text-center py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-550/25 text-[8.5px] text-amber-500 rounded-lg cursor-pointer font-black uppercase tracking-wider transition-all mt-1.5"
                      >
                        🎭 Preset: Conversational AI Loop Video
                      </button>
                    </div>
                  </div>

                  {/* Primary Business Mission */}
                  <div>
                    <label className="text-[8px] font-black uppercase text-stone-400 block mb-1">Primary Goal Objective</label>
                    <input 
                      type="text"
                      value={tempGoal}
                      onChange={(e) => setTempGoal(e.target.value)}
                      placeholder="e.g. Retention / Sales Recovery"
                      className="w-full text-xs p-2 rounded-lg bg-stone-950 border border-stone-850 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Live Card Preview Wrapper */}
                  <div className="p-3 bg-stone-950 border border-white/5 rounded-2xl relative overflow-hidden flex flex-col justify-between items-center w-full">
                    <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600" />
                    <span className="text-[7.5px] uppercase font-mono text-neutral-500 block mb-1">Virtual agent badge</span>
                    
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-450 to-amber-600 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.25)] mb-1.5 relative overflow-hidden shrink-0">
                      {tempAvatar.startsWith('data:video') || tempAvatar.includes('.mp4') || tempAvatar.includes('.webm') ? (
                        <video src={tempAvatar} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                      ) : tempAvatar.startsWith('data:image') || tempAvatar.startsWith('http') || tempAvatar.startsWith('/') ? (
                        <img src={tempAvatar} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <span className="text-xl">{tempAvatar}</span>
                      )}
                    </div>

                    <div className="text-center w-full">
                      <h4 className="text-[11px] font-black text-white truncate max-w-[130px]">{tempName || 'Aria'}</h4>
                      <p className="text-[8.5px] text-amber-500 font-bold truncate max-w-[130px] mt-0.5 uppercase tracking-wide">{tempTone}</p>
                      <p className="text-[7.5px] text-stone-500 font-mono mt-0.5">{tempEngine}</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Popup actions footer */}
            <div className="flex gap-2.5 justify-end pt-4.5 border-t border-dashed border-stone-850 mt-5 select-none">
              <button
                type="button"
                onClick={() => setShowCreatorPopup(false)}
                className="px-4 py-2 text-xs font-black uppercase text-stone-400 hover:text-white transition-colors"
              >
                Dismiss
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!tempName.trim()) {
                    showToast("⚠️ Co-Pilot must have a valid identifier name!");
                    return;
                  }
                  // Deploy custom personalized values back to props
                  setAriaName(tempName.trim());
                  setAriaTone(tempTone);
                  setAriaAvatar(tempAvatar);
                  setShowCreatorPopup(false);
                  showToast(`🚀 Successfully generated and deployed custom agent: "${tempName}" with "${tempTone}" profile!`);
                  
                  // Play dynamic audible verification
                  if (voiceEnabled) {
                    try {
                      window.speechSynthesis.cancel();
                      const u = new SpeechSynthesisUtterance(`Custom agent ${tempName} compiles successfully. Deploying to live pipelines immediately.`);
                      window.speechSynthesis.speak(u);
                    } catch (e) {}
                  }
                }}
                className="px-5 py-2 bg-gradient-to-tr from-amber-500 to-amber-600 hover:from-amber-450 hover:to-amber-550 text-black font-black uppercase text-xs rounded-xl transition-all cursor-pointer shadow-md shadow-amber-500/10 active:scale-95"
              >
                Deploy Co-Pilot Core
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
