import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  Volume2, 
  VolumeX, 
  X, 
  Send, 
  Sparkles, 
  HelpCircle, 
  Mic, 
  MicOff, 
  Compass, 
  Wifi, 
  Zap, 
  ChevronRight,
  Sparkle
} from 'lucide-react';

interface AriaFloatingCompanionProps {
  theme: 'light' | 'dark';
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isSimulatingLive: boolean;
  setIsSimulatingLive: (val: boolean) => void;
  showToast: (msg: string) => void;
}

export default function AriaFloatingCompanion({
  theme,
  currentTab,
  setCurrentTab,
  isSimulatingLive,
  setIsSimulatingLive,
  showToast
}: AriaFloatingCompanionProps) {
  const isDark = theme === 'dark';
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [lastHeard, setLastHeard] = useState<string>('');
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState<string>('Greetings Principal! Aria voice control interface is primed. Toggle the microphone icon below, then just talk: try saying "go to costguard" or "go online" to operate hands-free!');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showCommandsHelp, setShowCommandsHelp] = useState(false);

  // Auto-speak responses unless muted
  const speak = (text: string) => {
    if (isMuted) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 1.05;
      u.pitch = 1.15;
      u.onstart = () => setIsSpeaking(true);
      u.onend = () => setIsSpeaking(false);
      u.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(u);
    } catch (e) {
      console.warn('Speech synthesis unavailable:', e);
    }
  };

  // Give context-specific active tips based on the active tab
  const getTabTip = () => {
    switch (currentTab) {
      case 'dashboard':
        return isSimulatingLive 
          ? "📡 Live telemetry stream is synchronized. Active margins look stable, but duplicate licensing in CostGuard warrants an audit sequence."
          : "🔌 We are currently offline. Establish your telemetry link to let me ingest real-time product demand signals.";
      case 'retainflow':
        return "🌸 RetainFlow mitigation is active. I suggest deploying automated win-back emails to high-churn subscriber bands.";
      case 'costguard':
        return "💰 Profit leaks are locked. Duplicate courier price creeps have been flagged. Let's draft a supplier renegotiation contract.";
      case 'stocksense':
        return "📦 I recommend triggering the Cash-Aware Stocking test to safeguard cash flow reserves relative to lead delays.";
      case 'contacts':
        return "👥 Connecting customer logs into unified CRM profiles. I can summarize any phone calls made inside this directory instantly.";
      case 'social_omni':
        return "💬 Unified conversational sync active on Meta channels. Zernio gateway holds automated triggers ready.";
      case 'community':
        return "🤝 Principal group discussions are online. I have configured automatic VIP tags for high-spending loyal partners.";
      default:
        return "⚡ Multi-engine SMB dashboard reporting steady telemetry. I'm actively listening for custom operational scripts.";
    }
  };

  // Direct text query router
  const handleQueryText = (queryText: string, isFromVoice: boolean = false) => {
    let botResponse = '';
    const query = queryText.toLowerCase();

    if (query.includes('hello') || query.includes('greetings') || query.includes('hi')) {
      botResponse = "Hello Principal! Ready to secure shipping margins, jump node views, or run some supply stress testing?";
    } else if (query.includes('cost') || query.includes('leak') || query.includes('invoice')) {
      botResponse = "CostGuard metrics reveal software licensing duplicate creeps. I can draft dynamic renegotiation emails on command.";
    } else if (query.includes('inventory') || query.includes('stock') || query.includes('product')) {
      botResponse = "StockSense suggests Premium wireless adapters are dropping fast. Run the Supply Stress Test to safeguard delivery times.";
    } else if (query.includes('retention') || query.includes('churn') || query.includes('customer')) {
      botResponse = "RetainFlow is monitoring active subscribers. We have aligned win-back vouchers for customers with churn risk indices past 80%.";
    } else if (query.includes('zernio') || query.includes('api') || query.includes('social')) {
      botResponse = "Zernio Omni-Channel configuration is successfully loaded. Instagram and WhatsApp automated routing pipelines are aligned!";
    } else {
      botResponse = isFromVoice 
        ? `I detected your voice query: "${queryText}". Let's continue calibrating the logistics matrix together!`
        : "Understood. Synchronizing cognitive core values to process that operational target. Let me deploy responsive AI rules!";
    }

    setReply(botResponse);
    setTimeout(() => speak(botResponse), 150);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    handleQueryText(message, false);
    setMessage('');
  };

  // Background continuously streaming speech recognition logic
  useEffect(() => {
    let rec: any = null;

    if (isListening) {
      const SpeechLib = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechLib) {
        showToast("⚠️ Speech Recognition not supported in this browser environment.");
        setIsListening(false);
        return;
      }

      try {
        rec = new SpeechLib();
        rec.continuous = true;
        rec.interimResults = false;
        rec.lang = 'en-US';

        rec.onstart = () => {
          showToast("🎙️ Voice Command active! Speak commands like 'go to costguard' or 'go online'");
        };

        rec.onresult = (event: any) => {
          const lastIndex = event.results.length - 1;
          const transcript = event.results[lastIndex][0].transcript.trim();
          if (!transcript) return;

          setLastHeard(transcript);
          const text = transcript.toLowerCase();

          // 1. Navigation Commands
          if (
            text.includes("go to dashboard") || 
            text.includes("open dashboard") || 
            text.includes("show dashboard") || 
            text.includes("go to home") || 
            text.includes("show home")
          ) {
            setCurrentTab('dashboard');
            showToast(`🎙️ Voice Route: "dashboard"`);
            speak("Switching central display to home dashboard.");
          } 
          else if (
            text.includes("go to retainflow") || 
            text.includes("go to retention") || 
            text.includes("open retention") || 
            text.includes("show retention") || 
            text.includes("open retainflow") || 
            text.includes("show retainflow") ||
            text.includes("navigate to retention")
          ) {
            setCurrentTab('retainflow');
            showToast(`🎙️ Voice Route: "retainflow"`);
            speak("Establishing link to subscriber retention and automated churn filters.");
          }
          else if (
            text.includes("go to costguard") || 
            text.includes("go to cost guard") || 
            text.includes("open costguard") || 
            text.includes("open cost guard") || 
            text.includes("show costguard") || 
            text.includes("show cost guard") ||
            text.includes("go to costs") ||
            text.includes("open costs")
          ) {
            setCurrentTab('costguard');
            showToast(`🎙️ Voice Route: "costguard"`);
            speak("Transitioning container view to CostGuard profit audit panel.");
          }
          else if (
            text.includes("go to stocksense") || 
            text.includes("go to stock sense") || 
            text.includes("open stocksense") || 
            text.includes("open stock sense") || 
            text.includes("show stocksense") || 
            text.includes("show stock sense") ||
            text.includes("go to stock") ||
            text.includes("open stock") ||
            text.includes("go to inventory") ||
            text.includes("open inventory")
          ) {
            setCurrentTab('stocksense');
            showToast(`🎙️ Voice Route: "stocksense"`);
            speak("Accessing stock levels and supplier lead-time stress test parameters.");
          }
          else if (
            text.includes("go to social") || 
            text.includes("open social") || 
            text.includes("show social") || 
            text.includes("go to chat") || 
            text.includes("open chat") || 
            text.includes("show chat")
          ) {
            setCurrentTab('social_omni');
            showToast(`🎙️ Voice Route: "social hub"`);
            speak("Hooking Meta channel triggers and active conversational chats.");
          }
          else if (
            text.includes("go to contacts") || 
            text.includes("open contacts") || 
            text.includes("show contacts") || 
            text.includes("go to customers") || 
            text.includes("open customers")
          ) {
            setCurrentTab('contacts');
            showToast(`🎙️ Voice Route: "CRM directory"`);
            speak("Pulling up operator customer logs with synchronized audio files.");
          }
          else if (
            text.includes("go to community") || 
            text.includes("open community") || 
            text.includes("show community")
          ) {
            setCurrentTab('community');
            showToast(`🎙️ Voice Route: "community hub"`);
            speak("Entering partner loyalty feed board.");
          }
          else if (
            text.includes("go to workflows") || 
            text.includes("open workflows") || 
            text.includes("show workflows") ||
            text.includes("go to recipes") ||
            text.includes("show recipes") ||
            text.includes("open recipes")
          ) {
            setCurrentTab('workflows');
            showToast(`🎙️ Voice Route: "workflow recipes"`);
            speak("Activating graph design nodes for triggered client alerts.");
          }
          else if (
            text.includes("go to pricing") || 
            text.includes("open pricing") || 
            text.includes("show pricing") ||
            text.includes("go to plans") ||
            text.includes("show plans")
          ) {
            setCurrentTab('pricing');
            showToast(`🎙️ Voice Route: "subscription plans"`);
            speak("Opening subscription packages matrix.");
          }
          else if (
            text.includes("go to settings") || 
            text.includes("open settings") || 
            text.includes("show settings") ||
            text.includes("navigate to settings")
          ) {
            setCurrentTab('settings');
            showToast(`🎙️ Voice Route: "settings"`);
            speak("Unlocking primary configuration values.");
          }
          // 2. Telemetry / Live Stream Control Commands
          else if (
            text.includes("enable stream") || 
            text.includes("start stream") || 
            text.includes("link live") || 
            text.includes("go online") || 
            text.includes("start simulation") ||
            text.includes("activate stream")
          ) {
            setIsSimulatingLive(true);
            localStorage.setItem('omni_dashboard_simulating', 'true');
            showToast(`🎙️ Telemetry: "online live stream active"`);
            speak("Live channel feeds actively streaming checkout and retention events now.");
          }
          else if (
            text.includes("disable stream") || 
            text.includes("stop stream") || 
            text.includes("go offline") || 
            text.includes("stop simulation") ||
            text.includes("disconnect stream")
          ) {
            setIsSimulatingLive(false);
            localStorage.setItem('omni_dashboard_simulating', 'false');
            showToast(`🎙️ Telemetry: "simulation paused ready"`);
            speak("Telemetry system standby initialized.");
          }
          // 3. Audio / Mute Controls
          else if (
            text.includes("mute aria") || 
            text.includes("stop talking") || 
            text.includes("shut up") || 
            text.includes("silence voice")
          ) {
            setIsMuted(true);
            showToast("🔇 Voice synthesis muted.");
          }
          else if (
            text.includes("unmute aria") || 
            text.includes("start talking") || 
            text.includes("speak out loud") || 
            text.includes("talk to me")
          ) {
            setIsMuted(false);
            showToast("🔊 Voice synthesis unmuted.");
            setTimeout(() => {
              speak("Speech feed successfully restored, Principal!");
            }, 100);
          }
          // 4. Default to standard answers
          else {
            handleQueryText(transcript, true);
          }
        };

        rec.onerror = (err: any) => {
          if (err.error !== 'no-speech') {
            console.warn("Speech recognition diagnostic warning:", err.error);
          }
        };

        rec.onend = () => {
          // Keep loop alive continuously if active
          if (isListening) {
            try {
              rec.start();
            } catch (e) {}
          }
        };

        rec.start();
      } catch (err) {
        console.error("Critical: Metaspeech API block failed to bind:", err);
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
  }, [isListening]);

  // Verbally announce manual tab switches
  useEffect(() => {
    const speechText = `Syncing viewport workspace to ${currentTab} framework.`;
    speak(speechText);
  }, [currentTab]);

  return (
    <div className="fixed bottom-6 left-6 z-[6000] font-sans select-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: 'spring', damping: 20 }}
            className={`w-80 p-4 rounded-[28px] border mb-3 shadow-2xl flex flex-col justify-between ${
              isDark ? 'bg-stone-900 border-stone-850 text-white' : 'bg-[#FAF9F6] border-stone-200 text-[#1C1917]'
            }`}
          >
            {/* Header */}
            <div className="flex justify-between items-center pb-2 border-b border-dashed border-stone-800/10 dark:border-stone-100/5">
              <div className="flex items-center gap-2">
                <div className={`relative w-8 h-8 rounded-xl flex items-center justify-center ${isSpeaking ? 'bg-amber-500 text-black animate-pulse' : 'bg-stone-100 dark:bg-stone-950 text-amber-500'}`}>
                  <Bot size={16} />
                  {isListening && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-black animate-ping"></span>
                  )}
                </div>
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-wider flex items-center gap-1">
                    Aria Voice Assist
                  </h4>
                  <span className="text-[8px] uppercase tracking-widest font-mono text-stone-400">
                    {isListening ? '🎙️ Continuous Listening' : '🔌 Standby Mod'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5">
                {/* Voice Control Mic Switch */}
                <button
                  type="button"
                  onClick={() => {
                    setIsListening(!isListening);
                    if (!isListening) {
                      speak("Hands free voice command active. Tell me where to navigate!");
                    } else {
                      speak("Voice listening deactivated.");
                    }
                  }}
                  className={`p-1.5 rounded-lg cursor-pointer transition-all ${
                    isListening 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                      : 'bg-stone-100/15 text-stone-400 hover:text-amber-500 hover:bg-stone-100/20'
                  }`}
                  title={isListening ? "Mute Microphone Capture" : "Trigger Speech Commands mode"}
                >
                  {isListening ? <Mic size={12} className="animate-pulse" /> : <MicOff size={12} />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMuted(!isMuted);
                    showToast(isMuted ? "🎙️ Aria speech synthesis ACTIVE" : "🔇 Aria speech muted");
                  }}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-amber-500 transition-colors cursor-pointer bg-stone-100/15"
                  title={isMuted ? "Unmute vocal playback" : "Mute vocal playback"}
                >
                  {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-red-400 transition-colors cursor-pointer bg-stone-100/15"
                >
                  <X size={12} />
                </button>
              </div>
            </div>

            {/* Bubble Panel */}
            <div className="py-3 text-xs flex-grow font-sans space-y-2">
              <div className="p-3 bg-white dark:bg-stone-950/60 rounded-2xl border border-stone-300/10 font-medium leading-relaxed dark:text-stone-300">
                {reply}
              </div>

              {/* Heard feedback indicator boarding */}
              {lastHeard && (
                <div className="px-2.5 py-1.5 bg-amber-500/10 text-amber-500 border border-dashed border-amber-500/15 rounded-xl text-[9px] font-mono flex items-center justify-between">
                  <div className="flex items-center gap-1 overflow-hidden">
                    <Zap size={9} className="shrink-0" />
                    <span className="truncate">Heard: "{lastHeard}"</span>
                  </div>
                  <span className="text-[8px] uppercase tracking-widest font-bold opacity-80 shrink-0">DECODED</span>
                </div>
              )}
              
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => {
                    const tip = getTabTip();
                    setReply(tip);
                    speak(tip);
                  }}
                  className="px-2.5 py-1.5 text-[8.5px] font-black uppercase bg-stone-100 hover:bg-stone-200 dark:bg-stone-950 dark:hover:bg-stone-900 border border-stone-300/10 text-amber-500 tracking-wider rounded-lg flex items-center gap-1 cursor-pointer transition-all active:scale-95 flex-grow justify-center"
                >
                  <Sparkles size={10} /> Active Screen Tip
                </button>
                <button
                  type="button"
                  onClick={() => setShowCommandsHelp(!showCommandsHelp)}
                  className={`px-2.5 py-1.5 text-[8.5px] font-black uppercase tracking-wider rounded-lg flex items-center gap-1 cursor-pointer transition-all active:scale-95 flex-grow justify-center ${
                    showCommandsHelp 
                      ? 'bg-amber-500 text-black border border-amber-500/35' 
                      : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-950 dark:hover:bg-stone-900 border border-stone-300/10 text-stone-400'
                  }`}
                >
                  <HelpCircle size={10} /> Spoken Guides
                </button>
              </div>

              {/* Commands Cheat Sheet Modal Box */}
              <AnimatePresence>
                {showCommandsHelp && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden bg-stone-950/80 rounded-2xl border border-stone-850 p-2 text-[8.5px] font-mono text-stone-300 space-y-2 mt-1"
                  >
                    <div className="text-[9px] uppercase tracking-widest text-[#F59E0B] font-black border-b border-stone-800 pb-1">
                      🗣️ Speech Cheat Sheet
                    </div>
                    <ul className="space-y-1.5">
                      <li className="flex items-center gap-1"><ChevronRight size={8} className="text-amber-500" /> "go to dashboard" / "go home"</li>
                      <li className="flex items-center gap-1"><ChevronRight size={8} className="text-amber-500" /> "go to costguard" / "go to retainflow"</li>
                      <li className="flex items-center gap-1"><ChevronRight size={8} className="text-amber-500" /> "go to stocksense" / "go to social"</li>
                      <li className="flex items-center gap-1"><ChevronRight size={8} className="text-amber-500" /> "go to contacts" / "go to community"</li>
                      <li className="flex items-center gap-1"><ChevronRight size={8} className="text-amber-500" /> "go online" / "enable stream"</li>
                      <li className="flex items-center gap-1"><ChevronRight size={8} className="text-amber-500" /> "go offline" / "disable stream"</li>
                      <li className="flex items-center gap-1"><ChevronRight size={8} className="text-amber-500" /> "mute aria" / "unmute"</li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Form Input */}
            <form onSubmit={handleFormSubmit} className="flex gap-1.5 select-none pt-2 border-t border-t-stone-800/10 dark:border-t-stone-100/5">
              <input
                type="text"
                placeholder="Ask Aria anything..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-grow bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-850 rounded-xl py-2 px-3 text-[10.5px] font-medium text-stone-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="p-2 bg-amber-500 hover:bg-gradient-to-tr hover:from-amber-500 hover:to-amber-600 rounded-xl text-black cursor-pointer transition-all active:scale-95 shadow-md shrink-0 flex items-center justify-center"
              >
                <Send size={11} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button with neon rings on live broadcast mode */}
      <div className="relative">
        <motion.button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            const response = isOpen 
              ? "Close" 
              : "Aria online Principal! Just speak your commands like 'go to cost guard' or 'go home' after clicking the microphone.";
            setReply(response);
            if (!isOpen) {
              setTimeout(() => speak(response), 200);
            }
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-12 h-12 rounded-full shadow-2xl flex items-center justify-center cursor-pointer relative z-50 ${
            isListening 
              ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
              : 'bg-amber-500 hover:bg-amber-450 text-black'
          }`}
          title="Talk to ARIA AI Companion"
        >
          <Bot size={22} className={isListening ? "" : "animate-spin"} style={{ animationDuration: isListening ? 'none' : '24s' }} />
          {isListening && (
            <span className="absolute inset-0 rounded-full border-4 border-red-500 animate-ping opacity-75"></span>
          )}
        </motion.button>
        
        {/* Floating miniature mic status label */}
        {isListening && (
          <div className="absolute right-[-115px] top-3 bg-red-500 text-white px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-widest flex items-center gap-1 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
            <span>Mic Live</span>
          </div>
        )}
      </div>
    </div>
  );
}
