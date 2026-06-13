import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, Grid, 
  HelpCircle, User, Bot, Clock, AlertCircle, X, ChevronRight, Zap,
  Video, VideoOff, Users, Monitor, Search, Calendar, Sparkles, MessageSquare,
  Minus, Maximize2
} from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatarColor: string;
  avatarChar: string;
  firstName?: string;
}

interface TelephonyDialerProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
  onTriggerToast: (msg: string) => void;
}

export default function TelephonyDialer({ isOpen, onClose, theme, onTriggerToast }: TelephonyDialerProps) {
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<'contacts' | 'dialer'>('contacts');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [callStatus, setCallStatus] = useState<'idle' | 'dialing' | 'active' | 'ended'>('idle');
  const [callType, setCallType] = useState<'audio' | 'video' | 'meeting'>('audio');
  
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  const [callDuration, setCallDuration] = useState(0);
  const [activeTranscript, setActiveTranscript] = useState<string[]>([]);
  const [ariaAutopilot, setAriaAutopilot] = useState(true);

  const transcriptEndRef = useRef<HTMLDivElement>(null);

  const contactsDirectory: Contact[] = [
    {
      id: 'c_sameer',
      name: 'Samad Khan (Sameer)',
      role: 'Principal Director & VIP Owner',
      email: 'samadkhansameerkhan@gmail.com',
      phone: '+1 (555) 019-2834',
      avatarColor: 'from-amber-500 to-amber-600',
      avatarChar: 'SK',
      firstName: 'Sameer'
    },
    {
      id: 'c_sarah',
      name: 'Sarah Miller',
      role: 'Dispatch Operations Manager',
      email: 'sarah.m@retailcloud.io',
      phone: '+44 (20) 7946-0958',
      avatarColor: 'from-emerald-500 to-teal-600',
      avatarChar: 'SM',
      firstName: 'Sarah'
    },
    {
      id: 'c_liam',
      name: 'Liam Neeson',
      role: 'UK Wholesale Partner',
      email: 'liam@neeson.co.uk',
      phone: '+44 7700 900592',
      avatarColor: 'from-blue-500 to-indigo-600',
      avatarChar: 'LN',
      firstName: 'Liam'
    },
    {
      id: 'c_amanda',
      name: 'Amanda Croft',
      role: 'Chief Procurement Officer',
      email: 'amanda.croft@designco.com',
      phone: '+1 (312) 555-4927',
      avatarColor: 'from-fuchsia-500 to-purple-600',
      avatarChar: 'AC',
      firstName: 'Amanda'
    }
  ];

  const filteredContacts = contactsDirectory.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.role.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.phone.includes(searchQuery)
  );

  // Timer for connected call duration
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (callStatus === 'active') {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [callStatus]);

  // Scroll transcript to bottom automatically
  useEffect(() => {
    if (transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeTranscript]);

  // Transcriptions simulator sequence during active sessions
  useEffect(() => {
    if (callStatus !== 'active') {
      setActiveTranscript([]);
      return;
    }

    const participantName = selectedContact ? selectedContact.name : 'Unknown Stakeholder';
    const shortName = selectedContact ? (selectedContact.firstName || selectedContact.name.split(' ')[0]) : 'Operator';

    const audioSteps = [
      { sender: 'client', text: `Hello? This is ${participantName}. Who's connecting?` },
      { sender: 'aria', text: `Hi ${shortName}! This is ARIA speaking, your active ledger co-pilot. I am checking in regarding our latest automated stock forecasts.` },
      { sender: 'client', text: "Oh, hi ARIA! Glad you called. I noticed a custom threshold trigger on our main wholesale coffee line." },
      { sender: 'aria', text: "Yes, exactly! I balanced the procurement index 12 mins ago. Our system detected safe reserves, preventing an estimated $1,400 stockout leak." },
      { sender: 'client', text: "That is fantastic tracking. Thanks for the quick update, ARIA! I approve the order." },
      { sender: 'aria', text: "Perfect. Dispatch processed. I am syncing our system backup logs. Talk soon!" }
    ];

    const videoSteps = [
      { sender: 'client', text: `[CAMERA SYNCED] Hello! Good to see you on video, ARIA.` },
      { sender: 'aria', text: `[VIDEO FEED ONLINE] Greetings! Connecting with crystal-clear resolution. I am loading our operations visual dashboard on-screen.` },
      { sender: 'client', text: "Wow, this diagnostic looks solid. Can we review our current cost cutoff constraints?" },
      { sender: 'aria', text: "Absolutely. I've initiated the token cost guard at $50 daily limit to preserve buffers. It is active now." },
      { sender: 'client', text: "Outstanding security parameters. Keep this active, please. Thanks ARIA!" },
      { sender: 'aria', text: "Your safety guidelines are securely locked in. Have a brilliant afternoon!" }
    ];

    const meetingSteps = [
      { sender: 'client', text: `[BOARDROOM ENTRANCE] Welcome everyone. Let's begin the ARIA joint sync meeting.` },
      { sender: 'aria', text: `[AI CHAIRPERSON ACTIVE] Presenting briefing notes for Today's Operations. We have secured 98/100 business health index rating.` },
      { sender: 'client', text: "Impressive numbers! What about the disengaged loyal wholesale accounts?" },
      { sender: 'aria', text: "I've drafted 3 automatic win-back coupon triggers to reactivate them. It's predicted to retain 12% additional annual LTV." },
      { sender: 'client', text: "Brilliant strategy. Let's roll out the coupon program immediately." },
      { sender: 'aria', text: "Directives verified. Automated workflows launched with real-time sync. Meeting adjourned." }
    ];

    const conversationSteps = callType === 'audio' ? audioSteps : callType === 'video' ? videoSteps : meetingSteps;

    let currentStepIdx = 0;
    const interval = setInterval(() => {
      if (currentStepIdx < conversationSteps.length) {
        const step = conversationSteps[currentStepIdx];
        const displayLabel = step.sender === 'aria' ? '🤖 ARIA (AUTOPILOT)' : `👤 ${participantName.toUpperCase()}`;
        setActiveTranscript(prev => [...prev, `${displayLabel}: "${step.text}"`]);
        currentStepIdx++;
      } else {
        clearInterval(interval);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [callStatus, callType, selectedContact]);

  const handleKeyPress = (num: string) => {
    if (callStatus === 'idle') {
      setPhoneNumber(prev => prev + num);
    }
  };

  const handleInitiateCall = (contact: Contact | null, type: 'audio' | 'video' | 'meeting') => {
    setSelectedContact(contact);
    setCallType(type);
    
    const targetName = contact ? contact.name : phoneNumber || 'Selected Voip Channel';
    
    if (!phoneNumber && contact) {
      setPhoneNumber(contact.phone);
    }

    setCallStatus('dialing');
    
    const label = type === 'audio' ? 'Audio Session' : type === 'video' ? 'Hyper Video Call' : 'Encrypted Joint Room Meeting';
    onTriggerToast(`📞 Initializing ARIA ${label} to ${targetName}...`);

    setTimeout(() => {
      setCallStatus('active');
      onTriggerToast(`⚡ Connected securely to ${targetName}!`);
    }, 2000);
  };

  const handleCallEnd = () => {
    setCallStatus('ended');
    onTriggerToast("🛑 Session disconnected successfully.");
    setTimeout(() => {
      setCallStatus('idle');
      setPhoneNumber('');
      setSelectedContact(null);
    }, 1200);
  };

  const formatDuration = (secs: number) => {
    const mm = Math.floor(secs / 60).toString().padStart(2, '0');
    const ss = (secs % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isMinimized ? (
        /* MINIMIZED VIEW: Pulsing float badge bottom-right */
        <motion.div
          key="minimized-pill"
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 30 }}
          onClick={() => setIsMinimized(false)}
          className="fixed bottom-6 right-6 z-[260] bg-stone-900 hover:bg-stone-850 text-white rounded-full p-3.5 flex items-center justify-center gap-2 cursor-pointer shadow-2xl border border-stone-800 transition-all select-none w-14 h-14"
          title="Restore compact Telephony Dialing Hub"
        >
          <div className="relative flex items-center justify-center">
            {callStatus === 'active' ? (
              <>
                <div className="absolute -inset-2 bg-emerald-500/10 rounded-full animate-ping" />
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Phone className="text-emerald-400" size={22} />
                </motion.div>
                <div className="absolute -top-6 bg-emerald-500 text-black text-[8px] font-mono font-black py-0.5 px-1.5 rounded-full select-none shadow-md">
                  {formatDuration(callDuration)}
                </div>
              </>
            ) : callStatus === 'dialing' ? (
              <Phone className="text-amber-500 animate-pulse" size={22} style={{ animationDuration: '0.5s' }} />
            ) : (
              <Phone className="text-amber-500" size={22} />
            )}
            <span className="absolute -bottom-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
          </div>
        </motion.div>
      ) : (
        /* COMPACT EXPANDED FLOATING CONTAINER */
        <motion.div
          key="expanded-widget"
          initial={{ scale: 0.94, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.94, y: 30, opacity: 0 }}
          className={`fixed bottom-6 right-6 z-[250] w-[390px] md:w-[410px] max-w-[calc(100vw-32px)] h-[580px] rounded-[32px] border p-5 shadow-2xl font-sans flex flex-col justify-between select-none ${
            isDark ? 'bg-stone-950/95 border-stone-800 text-stone-100 shadow-stone-950' : 'bg-white border-stone-250 text-stone-950 shadow-2xl'
          } backdrop-blur-md`}
        >
          {/* TOP BAR / HEADER CONTROL */}
          <div className="flex justify-between items-center pb-2 border-b border-stone-800/20 dark:border-stone-800/60 shrink-0">
            <div className="flex items-center gap-1.5 bg-transparent">
              <span className="p-1 px-2 rounded-md text-[8.5px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20 font-mono flex items-center gap-1">
                <Zap size={9} className="animate-pulse" /> SIP Node v2.5
              </span>
              <span className="text-[10px] font-black text-stone-400 font-mono tracking-widest">ARIA DIALER</span>
            </div>

            {/* Minimize and Close Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsMinimized(true)}
                className="p-1 rounded-lg hover:bg-stone-500/10 text-stone-400 hover:text-amber-500 transition-all cursor-pointer"
                title="Minimize Call Panel to Bubble"
              >
                <Minus size={14} />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-stone-505/10 text-stone-450 hover:text-red-500 transition-all cursor-pointer"
                title="Close Dialer"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* MAIN INTERNAL INTERFACE */}
          <div className="flex-grow flex flex-col justify-between overflow-hidden py-3">
            {callStatus === 'idle' ? (
              /* IDLE STATE: DIRECTORY OR DIALPAD TABBED SWITCH */
              <div className="flex-1 flex flex-col justify-between overflow-hidden">
                
                {/* Responsive Tab Buttons */}
                <div className="flex bg-stone-500/5 p-1 rounded-xl border border-stone-800/10 dark:border-stone-800/40 mb-3.5 w-full shrink-0">
                  <button
                    onClick={() => setActiveTab('contacts')}
                    className={`flex-1 py-1.5 rounded-lg text-[9.5px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                      activeTab === 'contacts' 
                        ? 'bg-amber-500 text-black font-extrabold shadow-sm' 
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    Directory Contacts
                  </button>
                  <button
                    onClick={() => setActiveTab('dialer')}
                    className={`flex-1 py-1.5 rounded-lg text-[9.5px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                      activeTab === 'dialer' 
                        ? 'bg-amber-500 text-black font-extrabold shadow-sm' 
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    Numeric Keypad
                  </button>
                </div>

                {activeTab === 'contacts' ? (
                  /* CONTACTS LIST */
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="relative mb-3 shrink-0">
                      <Search className="absolute left-3 top-2.5 text-stone-400" size={13} />
                      <input 
                        type="text"
                        placeholder="Search VIP and wholesale profiles..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className={`w-full bg-stone-500/5 border p-2 pl-9 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                          isDark ? 'border-stone-800/80 text-white' : 'border-stone-200 text-stone-900'
                        }`}
                      />
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-none max-h-[300px]">
                      {filteredContacts.map(c => (
                        <div 
                          key={c.id} 
                          className={`p-3 rounded-2xl border transition-all flex flex-col justify-between gap-2.5 ${
                            isDark ? 'bg-stone-900/30 border-stone-850 hover:bg-stone-900/60' : 'bg-stone-50 border-stone-200 hover:bg-stone-100/60'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8.5 h-8.5 rounded-lg bg-gradient-to-tr ${c.avatarColor} text-white font-extrabold flex items-center justify-center text-[10px] shrink-0 shadow-md`}>
                              {c.avatarChar}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-bold text-xs truncate text-stone-900 dark:text-stone-100 leading-none">{c.name}</h4>
                              <p className="text-[9px] text-amber-500 uppercase tracking-widest font-mono font-bold mt-0.5">{c.role}</p>
                              <p className="text-[9.5px] text-stone-400 font-mono mt-0.5">{c.phone}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-1 shrink-0 pt-0.5 border-t border-dashed border-stone-800/10 dark:border-stone-800/40">
                            <button
                              onClick={() => handleInitiateCall(c, 'audio')}
                              className="py-1 px-1 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-md text-[8.5px] font-black uppercase flex items-center justify-center gap-1 cursor-pointer transition-all"
                            >
                              <Phone size={10} />
                              <span>Audio</span>
                            </button>
                            <button
                              onClick={() => handleInitiateCall(c, 'video')}
                              className="py-1 px-1 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border border-blue-500/20 rounded-md text-[8.5px] font-black uppercase flex items-center justify-center gap-1 cursor-pointer transition-all"
                            >
                              <Video size={10} />
                              <span>Video</span>
                            </button>
                            <button
                              onClick={() => handleInitiateCall(c, 'meeting')}
                              className="py-1 px-1 bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 border border-purple-500/20 rounded-md text-[8.5px] font-black uppercase flex items-center justify-center gap-1 cursor-pointer transition-all"
                            >
                              <Users size={10} />
                              <span>Meeting</span>
                            </button>
                          </div>
                        </div>
                      ))}

                      {filteredContacts.length === 0 && (
                        <div className="text-center py-8 text-stone-400 font-medium text-xs">
                          🔍 No matching accounts found.
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* KEYPAD VIEW */
                  <div className="flex-1 flex flex-col justify-between overflow-hidden pt-1">
                    <div className={`p-3.5 rounded-2xl text-center mb-3 select-all ${
                      isDark ? 'bg-stone-950/60 border border-stone-850' : 'bg-stone-50 border-stone-200'
                    }`}>
                      <input
                        type="text"
                        placeholder="Type phone or wholesale number..."
                        value={phoneNumber}
                        onChange={e => setPhoneNumber(e.target.value)}
                        className="w-full bg-transparent border-none text-center text-base font-mono font-black text-amber-500 focus:outline-none placeholder-stone-500"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center my-auto px-4 max-w-[280px] mx-auto">
                      {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map(key => (
                        <button
                          key={key}
                          onClick={() => handleKeyPress(key)}
                          className={`h-9 w-14 rounded-xl border text-[11px] font-black font-mono transition-all active:scale-95 cursor-pointer flex items-center justify-center mx-auto ${
                            isDark 
                              ? 'bg-stone-900/60 border-stone-800/80 text-white hover:bg-stone-800' 
                              : 'bg-stone-100 border-stone-200 text-stone-950 hover:bg-stone-200'
                          }`}
                        >
                          {key}
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-3 shrink-0">
                      {phoneNumber && (
                        <button
                          onClick={() => setPhoneNumber('')}
                          className="px-3 bg-stone-500/10 hover:bg-stone-500/20 border border-stone-850 text-stone-300 rounded-xl font-black text-[9.5px] uppercase transition-all"
                        >
                          Clear
                        </button>
                      )}
                      <button
                        onClick={() => handleInitiateCall(null, 'audio')}
                        className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-450 text-black font-black uppercase text-[10px] tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/10"
                      >
                        <Phone size={12} />
                        <span>Dispatch Custom Audio Loop</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* ACTIVE CALL / DIALING CONTENT SCREEN */
              <div className="flex-Grow flex flex-col justify-between overflow-hidden">
                {/* Connected Header Box */}
                <div className={`p-3 rounded-2xl text-center mb-2.5 select-none ${
                  isDark ? 'bg-stone-950/70 border border-stone-850' : 'bg-stone-50 border border-stone-200'
                }`}>
                  <p className="text-[9px] uppercase font-mono tracking-widest text-amber-500 font-extrabold flex items-center justify-center gap-1 leading-none">
                    <Sparkles size={10} className="animate-spin" style={{ animationDuration: '3s' }} /> SECURE SIP BRIDGE
                  </p>
                  <p className="text-sm font-black text-stone-900 dark:text-white mt-1.5 truncate">
                    {selectedContact ? selectedContact.name : phoneNumber || '+44 7700 900592'}
                  </p>
                  <p className="text-[9px] font-mono font-bold text-emerald-400 animate-pulse tracking-wide mt-1 uppercase">
                    {callStatus.toUpperCase()} {callStatus === 'active' && `• ${formatDuration(callDuration)}`}
                  </p>
                </div>

                {/* GRAPHIC PIPELINE STREAM SEGMENT */}
                <div className="shrink-0 mb-3.5">
                  {callStatus === 'active' && callType === 'video' ? (
                    /* Video screen mode */
                    <div className="relative h-28 rounded-xl bg-black border border-stone-800 overflow-hidden shadow-inner flex items-center justify-center">
                      {isVideoOn ? (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/30 via-neutral-900 to-amber-950/10" />
                          <div className="z-10 flex flex-col items-center text-center">
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${selectedContact ? selectedContact.avatarColor : 'from-amber-500 to-amber-600'} text-white text-[10px] font-bold flex items-center justify-center shadow-lg animate-pulse`}>
                              {selectedContact ? selectedContact.avatarChar : 'VIP'}
                            </div>
                            <p className="text-[8px] font-bold text-emerald-400 font-mono flex items-center mt-1"><Video size={9} /> CAM FEED (24fps)</p>
                          </div>
                        </>
                      ) : (
                        <div className="text-stone-400 text-[9px] font-black uppercase font-mono flex flex-col items-center gap-1">
                          <VideoOff size={14} /> CAMERA MUTED
                        </div>
                      )}
                    </div>
                  ) : callStatus === 'active' && callType === 'meeting' ? (
                    /* Boardroom active layout */
                    <div className="relative h-28 rounded-xl bg-stone-950 border border-stone-850 p-1.5 grid grid-cols-2 gap-1.5 shadow-inner">
                      <div className="bg-stone-900 rounded-lg flex flex-col items-center justify-center text-center p-0.5 border border-white/5 relative">
                        <div className="w-6 h-6 rounded-full bg-amber-500/15 border border-amber-500/20 flex items-center justify-center text-[8px] font-bold text-amber-500">
                          {selectedContact ? selectedContact.avatarChar : 'VIP'}
                        </div>
                        <p className="text-[7.5px] text-stone-200 truncate w-full mt-0.5">{selectedContact ? selectedContact.name.split(' ')[0] : 'Merchant'}</p>
                      </div>

                      <div className="bg-stone-900 rounded-lg flex flex-col items-center justify-center text-center p-0.5 border border-white/5 relative">
                        <div className="w-6 h-6 rounded-full bg-amber-500 text-black flex items-center justify-center text-[10px] font-bold">
                          🤖
                        </div>
                        <p className="text-[7.5px] font-black text-amber-400 mt-0.5">ARIA BOT</p>
                      </div>
                    </div>
                  ) : (
                    /* WAVE PULSE FRAME for voice */
                    <div className="relative h-28 rounded-xl bg-black/40 border border-stone-850/80 shadow-inner flex flex-col items-center justify-center overflow-hidden">
                      <motion.div 
                        animate={{ 
                          scale: callStatus === 'active' ? [1, 1.06, 1] : 1,
                        }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center border border-white/15 relative z-10 shrink-0"
                      >
                        <span className="text-base">🤖</span>
                      </motion.div>

                      {callStatus === 'active' && (
                        <div className="flex gap-0.5 items-end h-4 mt-2 relative z-10 bg-black/10 p-1 px-2 rounded-full border border-white/5">
                          {[...Array(5)].map((_, i) => (
                            <motion.div 
                              key={i}
                              animate={{ height: [3, Math.max(4, Math.random() * 12), 3] }}
                              transition={{ duration: 0.2 + (i * 0.05), repeat: Infinity, ease: 'easeInOut' }}
                              className="w-0.5 rounded-full bg-amber-500"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* AUTOPILOT INDICATOR ROW */}
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-stone-800 bg-stone-950/20 mb-2.5">
                  <div>
                    <span className="text-[9px] font-extrabold text-stone-200 uppercase block tracking-wide">ARIA CO-PILOT AUTOPILOT</span>
                    <span className="text-[8px] text-stone-400 block leading-none">Handles queries using Gemini Model API</span>
                  </div>
                  <button
                    onClick={() => {
                      setAriaAutopilot(!ariaAutopilot);
                      onTriggerToast(`Autopilot: ${!ariaAutopilot ? 'ON' : 'OFF'}`);
                    }}
                    className={`px-2.5 py-1 rounded-md text-[8.5px] font-mono font-black uppercase transition-all cursor-pointer ${
                      ariaAutopilot ? 'bg-amber-500 text-black' : 'bg-stone-800 text-white'
                    }`}
                  >
                    {ariaAutopilot ? 'Active' : 'Standby'}
                  </button>
                </div>

                {/* SCROLL TRANSCRIPTS */}
                <div className={`p-2.5 rounded-xl border text-[9px] flex-grow overflow-y-auto max-h-[140px] leading-relaxed space-y-1.5 scrollbar-none mb-3 ${
                  isDark ? 'bg-stone-950/50 border-stone-850' : 'bg-white border-stone-200'
                }`}>
                  <div className="flex justify-between items-center text-[7.5px] font-mono font-black text-amber-500 uppercase tracking-widest pb-1 border-b border-white/5">
                    <span>LIVE COGNITIVE TIMELINE</span>
                    <span className="flex items-center gap-0.5"><span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" /> SYNCING</span>
                  </div>

                  {activeTranscript.length === 0 ? (
                    <div className="text-center text-stone-400 py-6 animate-pulse leading-none font-medium">
                      📱 Registering voice lines feed...
                    </div>
                  ) : (
                    activeTranscript.map((log, idx) => {
                      const isAria = log.startsWith('🤖');
                      return (
                        <div 
                          key={idx} 
                          className={`p-1 rounded-md border text-[9px] leading-snug ${
                            isAria 
                              ? 'bg-amber-500/5 border-amber-500/10 text-amber-500 font-bold' 
                              : isDark ? 'bg-stone-900 border-stone-850 text-stone-200 font-medium' : 'bg-stone-50 border-stone-200 text-stone-850'
                          }`}
                        >
                          {log}
                        </div>
                      );
                    })
                  )}
                  <div ref={transcriptEndRef} />
                </div>
              </div>
            )}
          </div>

          {/* LOWER ACTION CONTROLS FOR ACTIVE DIALOGS */}
          {callStatus !== 'idle' && (
            <div className="border-t border-stone-800/10 dark:border-stone-800/40 pt-3 flex justify-around items-center shrink-0">
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                  isMuted ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-stone-800 text-white hover:bg-stone-750'
                }`}
                title={isMuted ? "Unmute Mic" : "Mute Mic"}
              >
                {isMuted ? <MicOff size={14} /> : <Mic size={14} />}
              </button>

              <button
                type="button"
                onClick={handleCallEnd}
                className="w-11 h-11 bg-red-600 hover:bg-red-500 text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 active:scale-95 transition-all animate-pulse duration-1000"
                title="Disconnect line"
              >
                <PhoneOff size={16} />
              </button>

              <button
                type="button"
                onClick={() => setIsSpeaker(!isSpeaker)}
                className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                  isSpeaker ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/10' : 'bg-stone-800 text-white'
                }`}
                title={isSpeaker ? "Disable Speaker" : "Enable Speaker"}
              >
                {isSpeaker ? <Volume2 size={14} /> : <VolumeX size={14} />}
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
