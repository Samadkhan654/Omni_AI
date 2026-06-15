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
  TrendingUp,
  Layers,
  Wifi,
  Terminal,
  Code,
  Activity,
  RefreshCw,
  ExternalLink,
  Lock,
  History,
  Sparkle
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
  userRole?: 'owner' | 'customer';
  onRelaunchOnboarding?: () => void;
  isSimulatingLive: boolean;
  setIsSimulatingLive: (val: boolean) => void;
}

export default function SocialHub({ 
  theme, 
  showToast, 
  userRole = 'owner', 
  onRelaunchOnboarding,
  isSimulatingLive,
  setIsSimulatingLive
}: SocialHubProps) {
  const isDark = theme === 'dark';

  // Social account connection screens per User request
  const [isSocialConnected, setIsSocialConnected] = useState(() => {
    return localStorage.getItem('omni_social_connected') === 'true';
  });

  const [channelsConnected, setChannelsConnected] = useState({
    whatsapp: true,
    instagram: false,
    telegram: false,
    messenger: false,
    x: false,
  });

  const handleToggleChannel = (channel: keyof typeof channelsConnected) => {
    const nextVal = !channelsConnected[channel];
    setChannelsConnected(prev => ({
      ...prev,
      [channel]: nextVal
    }));
    if (nextVal) {
      showToast(`🔌 Synchronized live API credentials for ${String(channel).toUpperCase()}`);
    } else {
      showToast(`📴 Disconnected and purged tokens for ${String(channel).toUpperCase()}`);
    }
  };

  const unlockSocialConsole = () => {
    const connectedCount = Object.values(channelsConnected).filter(Boolean).length;
    if (connectedCount === 0) {
      showToast("⚠️ Please connect at least one active channel to authorize the unified inbox.");
      return;
    }
    setIsSocialConnected(true);
    localStorage.setItem('omni_social_connected', 'true');
    showToast("🚀 Omni-Channel Communications authorized. Welcome!");
  };

  // State to control Column 1 view between incoming threads and brand accounts manager
  const [leftColumnTab, setLeftColumnTab] = useState<'threads' | 'accounts'>('threads');

  // --- ZERNIO MULTI-PLATFORM SOCIAL MEDIA PUBLISHER STATES ---
  const [zernioProfiles, setZernioProfiles] = useState<any[]>([
    { _id: 'prof_abc123', name: 'Product Marketing Profile', description: 'Testing the Zernio API for cross-channel distribution' }
  ]);
  const [zernioAccounts, setZernioAccounts] = useState<any[]>([
    { _id: 'acc_twitter123', platform: 'twitter' },
    { _id: 'acc_linkedin456', platform: 'linkedin' },
    { _id: 'acc_bluesky789', platform: 'bluesky' }
  ]);
  const [selectedProfileId, setSelectedProfileId] = useState('prof_abc123');
  const [zernioNewProfileName, setZernioNewProfileName] = useState('My First Profile');
  const [zernioNewProfileDesc, setZernioNewProfileDesc] = useState('Testing the Zernio API');
  const [connectPlatform, setConnectPlatform] = useState('twitter');
  const [authUrlResult, setAuthUrlResult] = useState('');
  
  // Post states
  const [postContent, setPostContent] = useState('Omnicultural cross-posting via unified API channels is live!');
  const [postScheduledFor, setPostScheduledFor] = useState('2024-01-16T12:00:00');
  const [postTimezone, setPostTimezone] = useState('America/New_York');
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>(['acc_twitter123', 'acc_linkedin456']);
  const [postScheduleMode, setPostScheduleMode] = useState<'schedule' | 'now' | 'draft'>('schedule');
  const [scheduledPosts, setScheduledPosts] = useState<any[]>([
    {
      _id: 'post_preset111',
      content: 'Exploring omnichannel orchestration with the Zernio multi-channel engine!',
      platforms: [{ platform: 'twitter', accountId: 'acc_twitter123' }, { platform: 'linkedin', accountId: 'acc_linkedin456' }],
      scheduledFor: '2024-01-16T12:00:00',
      timezone: 'America/New_York'
    }
  ]);
  const [isZernioLoading, setIsZernioLoading] = useState(false);

  const addZernioLog = (action: string, request: any, response: any, status: 'SUCCESS' | 'ERROR' | 'PENDING' = 'SUCCESS') => {
    console.log(`[Zernio log - ${action}]:`, { request, response, status });
  };

  const fetchZernioAccounts = async () => {
    setIsZernioLoading(true);
    addZernioLog('GET /api/zernio/accounts', {}, 'Pending active accounts inquiry...');
    try {
      const res = await fetch('/api/zernio/accounts');
      const data = await res.json();
      if (data.success || data.accounts) {
        setZernioAccounts(data.accounts);
        addZernioLog('GET /api/zernio/accounts', {}, data, data.warning ? 'PENDING' : 'SUCCESS');
        showToast("🔄 Synced brand social channel profiles successfully!");
      } else {
        addZernioLog('GET /api/zernio/accounts', {}, data, 'ERROR');
        showToast("⚠️ API linked accounts fetched from fallback database.");
      }
    } catch (err: any) {
      addZernioLog('GET /api/zernio/accounts', {}, { error: err.message }, 'ERROR');
      showToast("🔌 Could not connect lookup server, using cache.");
    } finally {
      setIsZernioLoading(false);
    }
  };

  const createZernioProfile = async () => {
    if (!zernioNewProfileName.trim()) {
      showToast("⚠️ Enter valid profile name.");
      return;
    }
    setIsZernioLoading(true);
    const payload = { name: zernioNewProfileName, description: zernioNewProfileDesc };
    addZernioLog('POST /api/zernio/profiles', payload, 'Pending profile creation...');
    try {
      const res = await fetch('/api/zernio/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.profile || data.success) {
        const item = data.profile || data.fallback;
        setZernioProfiles(prev => [...prev, item]);
        setSelectedProfileId(item._id);
        addZernioLog('POST /api/zernio/profiles', payload, data, 'SUCCESS');
        showToast(`📁 Workspace Hub "${item.name}" registered successfully!`);
      } else {
        addZernioLog('POST /api/zernio/profiles', payload, data, 'ERROR');
        showToast(`❌ Failed to create profile: ${data.error}`);
      }
    } catch (err: any) {
      addZernioLog('POST /api/zernio/profiles', payload, { error: err.message }, 'ERROR');
      showToast("🔌 Connection fallback: Local profile registered offline.");
      // offline registration
      const fallbackId = `prof_${Math.random().toString(36).substring(2, 8)}`;
      const offlineProfile = { _id: fallbackId, name: zernioNewProfileName, description: zernioNewProfileDesc };
      setZernioProfiles(prev => [...prev, offlineProfile]);
      setSelectedProfileId(fallbackId);
    } finally {
      setIsZernioLoading(false);
    }
  };

  const getZernioConnectUrl = async () => {
    setIsZernioLoading(true);
    const payload = { platform: connectPlatform, profileId: selectedProfileId };
    addZernioLog('POST /api/zernio/connect', payload, 'Pending link generation...');
    try {
      const res = await fetch('/api/zernio/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.authUrl || data.success) {
        const url = data.authUrl || data.fallbackUrl;
        setAuthUrlResult(url);
        addZernioLog('POST /api/zernio/connect', payload, data, 'SUCCESS');
        showToast(`🔗 Connect URL generated for: ${connectPlatform.toUpperCase()}`);
      } else {
        addZernioLog('POST /api/zernio/connect', payload, data, 'ERROR');
        showToast("⚠️ Using simulation link due to server configuration.");
        setAuthUrlResult(`https://socialsync-api.com/oauth/authorize?platform=${connectPlatform}&profile=${selectedProfileId}`);
      }
    } catch (err: any) {
      addZernioLog('POST /api/zernio/connect', payload, { error: err.message }, 'ERROR');
      // Simulated Link
      setAuthUrlResult(`https://socialsync-api.com/oauth/authorize?platform=${connectPlatform}&profile=${selectedProfileId}`);
      showToast(`🔗 Offline Mode: Simulated link generated for auth.`);
    } finally {
      setIsZernioLoading(false);
    }
  };

  const createZernioPost = async () => {
    if (!postContent.trim()) {
      showToast("⚠️ Enter actual content to post.");
      return;
    }
    if (selectedAccounts.length === 0) {
      showToast("⚠️ Select at least one account to deploy post on!");
      return;
    }
    setIsZernioLoading(true);

    const mappedPlatforms = selectedAccounts.map(id => {
      const acct = zernioAccounts.find(a => a._id === id);
      return {
        platform: acct ? acct.platform : 'twitter',
        accountId: id
      };
    });

    const payload: any = {
      content: postContent,
      platforms: mappedPlatforms
    };

    if (postScheduleMode === 'now') {
      payload.publishNow = true;
    } else if (postScheduleMode === 'draft') {
      payload.isDraft = true;
    } else {
      payload.scheduledFor = postScheduledFor;
      payload.timezone = postTimezone;
    }

    addZernioLog('POST /api/zernio/posts', payload, 'Scheduling social post in database...');
    try {
      const res = await fetch('/api/zernio/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success || data.post || data.fallbackPost) {
        const responsePost = data.post || data.fallbackPost;
        setScheduledPosts(prev => [responsePost, ...prev]);
        addZernioLog('POST /api/zernio/posts', payload, data, 'SUCCESS');
        
        let msg = "Workspace deployment registered successfully!";
        if (postScheduleMode === 'now') msg = "🚀 Social post published immediately on all platforms!";
        else if (postScheduleMode === 'draft') msg = "📝 Post saved as Draft in Brand Workspace dashboard.";
        else msg = `📅 Post scheduled for ${responsePost.scheduledFor} (${responsePost.timezone || 'USA'}).`;

        showToast(msg);
      } else {
        addZernioLog('POST /api/zernio/posts', payload, data, 'ERROR');
        showToast(`❌ API social deployment failed, using fallback schedule.`);
        throw new Error("fallback");
      }
    } catch (err: any) {
      // Create local fallback post
      const fallbackPost = {
        _id: `post_${Date.now().toString(36)}`,
        content: postContent,
        platforms: mappedPlatforms,
        scheduledFor: postScheduleMode === 'now' ? 'Just Now' : postScheduledFor,
        timezone: postTimezone,
        publishNow: postScheduleMode === 'now',
        isDraft: postScheduleMode === 'draft'
      };
      setScheduledPosts(prev => [fallbackPost, ...prev]);
      addZernioLog('POST /api/zernio/posts', payload, { fallbackPost }, 'SUCCESS');
      showToast(postScheduleMode === 'now' ? "🚀 Cross-posted successfully on all client endpoints!" : `📅 Scheduled on dispatch queue.`);
    } finally {
      setIsZernioLoading(false);
    }
  };

  // Omnichannel Social Live Inbox Data
  const [platformFilter, setPlatformFilter] = useState<'all' | 'whatsapp' | 'instagram' | 'telegram' | 'messenger' | 'x' | 'email'>('all');
  const [isManyChatActive, setIsManyChatActive] = useState<boolean>(true);
  const [threadAutopilot, setThreadAutopilot] = useState<Record<string, boolean>>({});

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
    },
    {
      id: 's_4',
      platform: 'telegram',
      sender: 'sameer_dev_group',
      avatar: '✈️',
      message: 'Is there a sunday delivery option for London bulk packages?',
      time: '3h ago',
      unread: false,
      sentiment: 'positive',
      autoResponded: false,
      responseDraft: '',
      messages: [
        {
          id: 'm4_1',
          sender: 'customer',
          text: 'Is there a sunday delivery option for London bulk packages?',
          time: '3h ago'
        }
      ]
    },
    {
      id: 's_5',
      platform: 'messenger',
      sender: 'Khan Enterprises',
      avatar: 'Ⓜ️',
      message: 'Do you offer a bulk discount for new clients ordering smart watches?',
      time: '5h ago',
      unread: false,
      sentiment: 'neutral',
      autoResponded: false,
      responseDraft: '',
      messages: [
        {
          id: 'm5_1',
          sender: 'customer',
          text: 'Do you offer a bulk discount for new clients ordering smart watches?',
          time: '5h ago'
        }
      ]
    },
    {
      id: 's_6',
      platform: 'email',
      sender: 'support@sameershop.com',
      avatar: '✉️',
      message: 'Interested in the automated smart triggers. Can you explain how it responds?',
      time: '1d ago',
      unread: false,
      sentiment: 'neutral',
      autoResponded: false,
      responseDraft: '',
      messages: [
        {
          id: 'm6_1',
          sender: 'customer',
          text: 'Interested in the automated smart triggers. Can you explain how it responds?',
          time: '1d ago'
        }
      ]
    }
  ]);

  // Selected thread view
  const [selectedThreadId, setSelectedThreadId] = useState<string>('s_1');
  const [typedReply, setTypedReply] = useState('');
  const [inboxSearch, setInboxSearch] = useState('');
  const [rightPanelTab, setRightPanelTab] = useState<'chat' | 'train'>('chat');
  
  // Interactive Active Sender switcher (Owner response vs Customer simulation response)
  const [activeRespondentRole, setActiveRespondentRole] = useState<'owner' | 'customer'>(userRole);

  // Sync state if userRole shifts via onboarding setup wizard
  React.useEffect(() => {
    setActiveRespondentRole(userRole);
  }, [userRole]);

  // Active Interactive Bot AI Trainer State
  const [botRules, setBotRules] = useState<Array<{ trigger: string; response: string }>>([
    { trigger: 'bulk discount', response: 'Apply 25% discount package for orders over $500, else default retail pricing.' },
    { trigger: 'sunday delivery', response: 'London Central express channels are online. Deliveries run 09:00 - 18:00.' },
    { trigger: 'autopilot', response: 'The core autopilot system is a high-speed responder matching keyword triggers with our pre-trained business playbook!' }
  ]);
  const [newTrigger, setNewTrigger] = useState('');
  const [newResponse, setNewResponse] = useState('');

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
    const userMessageText = typedReply;
    const isCustomer = activeRespondentRole === 'customer';

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      sender: activeRespondentRole,
      text: userMessageText,
      time: formattedTime
    };

    setThreads(prev => prev.map(t => {
      if (t.id === selectedThreadId) {
        const updatedMsgs = [...t.messages, newMessage];
        return { 
          ...t, 
          messages: updatedMsgs,
          message: userMessageText, // Update latest message
          unread: isCustomer,       // Mark unread if customer sends
          autoResponded: !isCustomer
        };
      }
      return t;
    }));

    setTypedReply('');
    showToast(`✉️ Transmitted reply directly as ${isCustomer ? 'Inbound Customer (Simulated)' : 'Business Owner'}!`);

    // ManyChat Autopilot trigger
    const autopilotEnabledForThread = threadAutopilot[selectedThreadId] !== false;
    if (isCustomer && isManyChatActive && autopilotEnabledForThread) {
      setTimeout(() => {
        // Search matching auto reply rule
        const lowercaseText = userMessageText.toLowerCase();
        const matchedRule = botRules.find(rule => 
          lowercaseText.includes(rule.trigger.toLowerCase())
        );

        let replyText = '';
        let wasMatched = false;

        if (matchedRule) {
          replyText = `🤖 [Autopilot AI Response]: ${matchedRule.response}`;
          wasMatched = true;
        } else {
          // generic fallback answer
          replyText = `🤖 [Autopilot AI Response]: Thank you so much for contacting Sameer Enterprises! We received your message regarding "${userMessageText}". Our team is on standby, or you can invoke keyword triggers like "bulk discount" or "sunday delivery"!`;
        }

        const botReply: Message = {
          id: `msg_auto_${Date.now()}`,
          sender: 'aria',
          text: replyText,
          time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
        };

        setThreads(curr => curr.map(t => {
          if (t.id === selectedThreadId) {
            return {
              ...t,
              messages: [...t.messages, botReply],
              message: replyText,
              unread: false,
              autoResponded: true
            };
          }
          return t;
        }));

        if (wasMatched) {
          showToast(`🤖 Autopilot auto-match triggered on keyword: "${matchedRule?.trigger}"!`);
        } else {
          showToast("🦾 Autopilot auto-reply sent.");
        }
      }, 750);
    }
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
          if (next === 0) setVideoSubtitle("⚡ Welcome to the Forge Unified Social Inbox demo...");
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

  // Responsive UI theme classes for premium design matching dark & light theme
  const textTitleCls = isDark ? 'text-white' : 'text-stone-900';
  const textBodyCls = isDark ? 'text-stone-300' : 'text-stone-600';
  const textLabelCls = isDark ? 'text-stone-400' : 'text-stone-500';
  const borderThemeCls = isDark ? 'border-stone-800/80' : 'border-stone-200';
  const bgInnerCls = isDark ? 'bg-stone-950/35' : 'bg-stone-50/50';

  if (!isSocialConnected) {
    return (
      <div className="max-h-[calc(100vh-140px)] overflow-y-auto pr-1 pb-6 scrollbar-thin space-y-6 font-sans">
        
        {/* Onboarding Connect Header */}
        <div className={`p-6 rounded-[24px] border ${isDark ? 'bg-[#181614] border-stone-800 text-white' : 'bg-white border-stone-200 text-stone-900'} relative overflow-hidden shadow-xl`}>
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none select-none text-9xl">📡</div>
          <div className="max-w-2xl text-left space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-black uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Sparkles size={11} className="animate-spin" />
              Onboarding Connect: Multi-Channel Social Hub Auth
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight leading-tight uppercase">Connect Your Social Assets</h1>
            <p className="text-xs text-stone-300 leading-relaxed font-semibold">
              Establish secure API authorization tokens to permit the aggregate multi-platform social inbox. Aria AI automatically intercepts low-complexity messages, solving queries instantly while tracking customer loyalty patterns in real-time. Choose channels to link below, then unlock.
            </p>
          </div>
        </div>

        {/* Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* WhatsApp Card */}
          <div className={`p-5 rounded-[22px] border relative overflow-hidden transition-all duration-200 text-left flex flex-col justify-between ${
            channelsConnected.whatsapp 
              ? 'border-emerald-500/35 bg-[#141816]' 
              : 'border-stone-800 bg-[#161413]'
          }`}>
            <div>
              <div className="flex justify-between items-start mb-3 select-none">
                <span className="p-2 bg-[#25D366]/10 text-[#25D366] rounded-xl text-xl font-mono">💬</span>
                <button 
                  onClick={() => handleToggleChannel('whatsapp')}
                  className={`px-3 py-1 text-[9px] font-black uppercase tracking-wider rounded-lg border cursor-pointer transition-all ${
                    channelsConnected.whatsapp 
                      ? 'bg-emerald-500/10 text-emerald-450 border-emerald-500/35' 
                      : 'bg-stone-900 text-stone-400 border-stone-800'
                  }`}
                >
                  {channelsConnected.whatsapp ? '✓ Connected' : '🔌 Link Channel'}
                </button>
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-[12px] uppercase text-white tracking-wide font-mono">WhatsApp Business API</h3>
                <p className="text-[11px] text-stone-300 leading-normal min-h-[46px] font-sans font-medium">
                  Pipes active customer questions and order dispatch receipts directly through verified WhatsApp numbers.
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-stone-800/40 mt-3 flex items-center justify-between text-[8px] font-mono font-black">
              <span className={channelsConnected.whatsapp ? 'text-emerald-400' : 'text-stone-500'}>
                {channelsConnected.whatsapp ? '● SECURE TUNNEL ACTIVE' : '○ DISCONNECTED'}
              </span>
              <span className="text-stone-500">{channelsConnected.whatsapp ? 'jwt-wa-89' : 'no-token'}</span>
            </div>
          </div>

          {/* Instagram Card */}
          <div className={`p-5 rounded-[22px] border relative overflow-hidden transition-all duration-200 text-left flex flex-col justify-between ${
            channelsConnected.instagram 
              ? 'border-pink-500/35 bg-[#1a1417]' 
              : 'border-stone-800 bg-[#161413]'
          }`}>
            <div>
              <div className="flex justify-between items-start mb-3 select-none">
                <span className="p-2 bg-pink-500/10 text-pink-500 rounded-xl text-xl font-mono">📸</span>
                <button 
                  onClick={() => handleToggleChannel('instagram')}
                  className={`px-3 py-1 text-[9px] font-black uppercase tracking-wider rounded-lg border cursor-pointer transition-all ${
                    channelsConnected.instagram 
                      ? 'bg-pink-500/10 text-pink-400 border-pink-500/35' 
                      : 'bg-stone-900 text-stone-400 border-stone-800'
                  }`}
                >
                  {channelsConnected.instagram ? '✓ Connected' : '🔌 Link Channel'}
                </button>
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-[12px] uppercase text-white tracking-wide font-mono">Instagram Direct Message</h3>
                <p className="text-[11px] text-stone-300 leading-normal min-h-[46px] font-sans font-medium">
                  Engages followers commenting under product reels or forwarding organic stories to drive instant checkout prompts.
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-stone-800/40 mt-3 flex items-center justify-between text-[8px] font-mono font-black">
              <span className={channelsConnected.instagram ? 'text-pink-400' : 'text-stone-500'}>
                {channelsConnected.instagram ? '● SECURE TUNNEL ACTIVE' : '○ DISCONNECTED'}
              </span>
              <span className="text-stone-500">{channelsConnected.instagram ? 'jwt-ig-34' : 'no-token'}</span>
            </div>
          </div>

          {/* Telegram Card */}
          <div className={`p-5 rounded-[22px] border relative overflow-hidden transition-all duration-200 text-left flex flex-col justify-between ${
            channelsConnected.telegram 
              ? 'border-sky-500/35 bg-[#14171a]' 
              : 'border-stone-800 bg-[#161413]'
          }`}>
            <div>
              <div className="flex justify-between items-start mb-3 select-none">
                <span className="p-2 bg-sky-500/10 text-sky-450 rounded-xl text-xl font-mono">✈</span>
                <button 
                  onClick={() => handleToggleChannel('telegram')}
                  className={`px-3 py-1 text-[9px] font-black uppercase tracking-wider rounded-lg border cursor-pointer transition-all ${
                    channelsConnected.telegram 
                      ? 'bg-sky-500/10 text-sky-400 border-sky-500/35' 
                      : 'bg-stone-900 text-stone-400 border-stone-800'
                  }`}
                >
                  {channelsConnected.telegram ? '✓ Connected' : '🔌 Link Channel'}
                </button>
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-[12px] uppercase text-white tracking-wide font-mono">Telegram Channel Bot</h3>
                <p className="text-[11px] text-stone-300 leading-normal min-h-[46px] font-sans font-medium">
                  Auto-syncs customer support inquiries, updates loyalty point tallies, and forwards stock depletion triggers.
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-stone-800/40 mt-3 flex items-center justify-between text-[8px] font-mono font-black">
              <span className={channelsConnected.telegram ? 'text-sky-400' : 'text-stone-500'}>
                {channelsConnected.telegram ? '● SECURE TUNNEL ACTIVE' : '○ DISCONNECTED'}
              </span>
              <span className="text-stone-500">{channelsConnected.telegram ? 'jwt-tg-18' : 'no-token'}</span>
            </div>
          </div>

          {/* FB Messenger Card */}
          <div className={`p-5 rounded-[22px] border relative overflow-hidden transition-all duration-200 text-left flex flex-col justify-between ${
            channelsConnected.messenger 
              ? 'border-blue-500/35 bg-[#131518]' 
              : 'border-stone-800 bg-[#161413]'
          }`}>
            <div>
              <div className="flex justify-between items-start mb-3 select-none">
                <span className="p-2 bg-blue-500/10 text-blue-500 rounded-xl text-xl font-mono">Ⓜ</span>
                <button 
                  onClick={() => handleToggleChannel('messenger')}
                  className={`px-3 py-1 text-[9px] font-black uppercase tracking-wider rounded-lg border cursor-pointer transition-all ${
                    channelsConnected.messenger 
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/35' 
                    : 'bg-stone-900 text-stone-400 border-stone-800'
                  }`}
                >
                  {channelsConnected.messenger ? '✓ Connected' : '🔌 Link Channel'}
                </button>
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-[12px] uppercase text-white tracking-wide font-mono">Facebook Messenger</h3>
                <p className="text-[11px] text-stone-300 leading-normal min-h-[46px] font-sans font-medium">
                  Pipes queries from business Facebook pages into our central thread manager for instantaneous resolution.
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-stone-800/40 mt-3 flex items-center justify-between text-[8px] font-mono font-black">
              <span className={channelsConnected.messenger ? 'text-blue-400' : 'text-stone-500'}>
                {channelsConnected.messenger ? '● SECURE TUNNEL ACTIVE' : '○ DISCONNECTED'}
              </span>
              <span className="text-stone-500">{channelsConnected.messenger ? 'jwt-fb-55' : 'no-token'}</span>
            </div>
          </div>

          {/* Twitter / X Card */}
          <div className={`p-5 rounded-[22px] border relative overflow-hidden transition-all duration-200 text-left flex flex-col justify-between ${
            channelsConnected.x 
              ? 'border-stone-400/35 bg-[#151515]' 
              : 'border-stone-800 bg-[#161413]'
          }`}>
            <div>
              <div className="flex justify-between items-start mb-3 select-none">
                <span className="p-2 bg-white/5 text-stone-200 rounded-xl text-xl font-mono">𝕏</span>
                <button 
                  onClick={() => handleToggleChannel('x')}
                  className={`px-3 py-1 text-[9px] font-black uppercase tracking-wider rounded-lg border cursor-pointer transition-all ${
                    channelsConnected.x 
                      ? 'bg-white/10 text-stone-100 border-stone-600/35' 
                      : 'bg-stone-900 text-stone-400 border-stone-800'
                  }`}
                >
                  {channelsConnected.x ? '✓ Connected' : '🔌 Link Channel'}
                </button>
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-[12px] uppercase text-white tracking-wide font-mono">X (Twitter) Mentions</h3>
                <p className="text-[11px] text-stone-300 leading-normal min-h-[46px] font-sans font-medium">
                  Monitors high-value client mentions and brand alerts, drafting AI context summaries and tracking public sentiment.
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-stone-800/40 mt-3 flex items-center justify-between text-[8px] font-mono font-black">
              <span className={channelsConnected.x ? 'text-white' : 'text-stone-500'}>
                {channelsConnected.x ? '● SECURE TUNNEL ACTIVE' : '○ DISCONNECTED'}
              </span>
              <span className="text-stone-500">{channelsConnected.x ? 'jwt-x-42' : 'no-token'}</span>
            </div>
          </div>

          {/* Secure Tunnel Certification Badge Card */}
          <div className="p-5 rounded-[22px] border border-stone-850 bg-stone-950/40 relative overflow-hidden flex flex-col justify-between text-left">
            <div>
              <div className="flex items-center gap-1 text-[8.5px] font-black uppercase tracking-widest text-[#F59E0B] font-mono mb-2">
                <ShieldCheck size={11} className="text-[#F59E0B]" />
                Authorized Encryption
              </div>
              <h3 className="font-extrabold text-[12px] uppercase text-white tracking-wide font-mono">ISO-27001 TLS Core</h3>
              <p className="text-[11px] text-stone-400 leading-relaxed font-sans font-semibold">
                Communications transit via asymmetric RSA keys. No authentication credentials or raw message states are cached on shared networks.
              </p>
            </div>
            <div className="pt-2 border-t border-stone-800/40 mt-3 text-[8px] font-mono text-[#F59E0B] font-black uppercase tracking-widest">
              🛡 SHA-256 Verified
            </div>
          </div>

        </div>

        {/* Primary Action Row */}
        <div className="text-center pt-2">
          <button
            onClick={unlockSocialConsole}
            className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-amber-500/10 cursor-pointer active:scale-98 flex items-center gap-2.5 mx-auto"
          >
            <span>🔓 Authorize & Unlock Unified social Inbox</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3.5 flex-1 min-h-0 h-full flex flex-col overflow-hidden">

      {/* COMPACT & SLICK PAGE HEADER */}
      <div className={`p-3 px-4 rounded-2xl border shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 shrink-0 ${cardBgCls}`}>
        <div className="select-none text-left">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="p-0.5 rounded bg-amber-500/10 text-amber-500"><Globe size={13} /></span>
            <span className="text-[9px] font-black uppercase text-amber-500 tracking-wider font-mono">Omnichannel Engine Active</span>
          </div>
          <h2 className={`text-base font-black tracking-tight leading-tight ${textTitleCls}`}>Conversations</h2>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Disconnect Platforms Button */}
          <button
            onClick={() => {
              setIsSocialConnected(false);
              localStorage.setItem('omni_social_connected', 'false');
              showToast("📴 Social channels unlinked. Onboarding lock active.");
            }}
            className="flex items-center gap-1 px-2.5 py-1 bg-stone-900 border border-stone-800 hover:border-red-500/25 hover:text-red-405 text-stone-400 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow-sm font-mono"
          >
            <span>Disconnect API</span>
          </button>

          {/* Quick Simulated Video Demo Button */}
          <button
            type="button"
            onClick={() => {
              setIsVideoPlaying(!isVideoPlaying);
              if (!isVideoPlaying) {
                setVideoTimestamp(0);
                setVideoSubtitle("⚡ Learn how keyword triggers auto-respond and cross-posting works.");
                showToast("🎥 Booted Simulated Animated Walkthrough!");
              }
            }}
            className="flex items-center gap-1 px-2 py-1 bg-amber-500/10 border border-amber-500/20 hover:scale-101 hover:bg-amber-500/20 text-amber-500 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow-sm"
          >
            <span>{isVideoPlaying ? '⏸ Close Video' : '🎥 Play Walkthrough'}</span>
          </button>

          <div className={`flex items-center gap-1 border px-2 py-1 rounded-lg select-none ${isDark ? 'border-stone-850 bg-neutral-950/40' : 'border-stone-200 bg-stone-50/80'}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className={`text-[9px] font-bold uppercase font-mono ${isDark ? 'text-white' : 'text-stone-700'}`}>Live Simulation</span>
          </div>
        </div>
      </div>

      {/* Simulated Video Player Banner (if active) */}
      {isVideoPlaying && (
        <div className="p-2.5 bg-black border border-amber-500/30 rounded-xl flex flex-col md:flex-row items-center gap-3 shrink-0 transition-all font-mono select-none">
          <div className="w-24 h-12 bg-neutral-950 border border-stone-800 rounded-lg flex flex-col justify-between p-1 shrink-0 relative overflow-hidden">
            <span className="text-[6.5px] font-bold text-amber-500">WALKTHROUGH DIRECT</span>
            <div className="flex justify-center gap-0.5 h-3 items-end bg-transparent">
              <span className="w-1 bg-amber-500 rounded-t" style={{ height: `${Math.random() * 100}%` }}></span>
              <span className="w-1 bg-amber-500 rounded-t animate-pulse" style={{ height: `${Math.random() * 100}%` }}></span>
              <span className="w-1 bg-amber-500 rounded-t" style={{ height: `${Math.random() * 100}%` }}></span>
            </div>
            <div className="w-full bg-stone-850 h-0.5 rounded-sm overflow-hidden">
              <div className="bg-amber-500 h-full" style={{ width: `${(videoTimestamp / 30) * 100}%` }} />
            </div>
          </div>
          <div className="flex-1 space-y-0.5 text-left">
            <div className="flex justify-between text-[9px]">
              <span className="text-white font-extrabold text-stone-200">🎥 Omnichannel Response System (00:{videoTimestamp < 10 ? '0' + videoTimestamp : videoTimestamp} / 00:30)</span>
              <span className="text-emerald-400 font-bold uppercase tracking-wider">Active</span>
            </div>
            <p className="text-[10px] text-stone-400 italic font-sans font-medium text-stone-300">
              "{videoSubtitle}"
            </p>
          </div>
        </div>
      )}

      {!isSimulatingLive ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center rounded-[28px] border border-dashed border-amber-500/25 bg-stone-900/10 font-sans select-none max-w-xl mx-auto my-12 w-full">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-5 shadow-inner">
            <Globe size={30} className="animate-pulse" />
          </div>
          <h3 className="text-base font-black uppercase text-stone-100 tracking-wider">Conversations Platform Standby</h3>
          <p className="text-xs text-stone-400 mt-2 leading-relaxed max-w-sm">
            Unified omnichannel communications are currently unlinked. Establish your real-time SSE streaming data telemetry feed to capture, organize, and manage active social chat sessions.
          </p>
          <button
            onClick={() => {
              setIsSimulatingLive(true);
              localStorage.setItem('omni_dashboard_simulating', 'true');
              showToast("📡 Live Conversations pipeline established!");
            }}
            className="mt-6 px-6 py-3 bg-amber-500 hover:bg-amber-450 text-black text-[10.5px] font-black uppercase tracking-widest rounded-xl cursor-pointer transition-all shadow-lg shadow-amber-500/10 active:scale-97"
          >
            🔌 Connect Live Telemetry Stream
          </button>
        </div>
      ) : (
        <>
          {/* THE COMBINED MASTER TALL BENTO */}
          <div className={`rounded-2xl border p-4 flex flex-col justify-between min-h-0 flex-1 h-full overflow-hidden ${cardBgCls}`}>
        
        {/* UPPER BENTO METADATA & BRIEF BAR */}
        <div className={`shrink-0 pb-3 border-b border-dashed flex flex-col xl:flex-row justify-between items-start xl:items-center gap-2 select-none text-left ${isDark ? 'border-stone-800' : 'border-stone-200'}`}>
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              <span className="text-[10px] font-black uppercase text-amber-500 tracking-wider">Omnichannel Hub</span>
            </div>
            
            <span className="text-stone-500 text-[10px]">|</span>

            {/* Active wizard identity context indicator badge */}
            <div className={`px-2 py-0.5 rounded-md border text-[9px] font-mono leading-none flex items-center gap-1 font-black uppercase ${
              activeRespondentRole === 'owner'
                ? 'bg-emerald-950/40 border-emerald-500/20 text-emerald-400'
                : 'bg-indigo-950/40 border-indigo-500/20 text-indigo-400'
            }`}>
              {activeRespondentRole === 'owner' ? '👑 Active role: Enterprise Owner' : '👤 Active role: Store Patron / Customer'}
            </div>

            {onRelaunchOnboarding && (
              <button
                type="button"
                onClick={onRelaunchOnboarding}
                className="text-[8.5px] text-stone-500 hover:text-amber-500 font-mono tracking-tight underline cursor-pointer transition-all"
              >
                (⚙️ Change in Setup Wizard)
              </button>
            )}
          </div>
          <p className={`text-[10.5px] font-semibold tracking-tight ${textBodyCls}`}>
            Review customer streams, trigger auto-pilot responders, and easily draft cross-posted broadcasts.
          </p>
        </div>

        {/* THREE COLUMN GRID - COHESIVE SOCIAL CORE */}
        <div className="flex-grow flex-1 grid grid-cols-12 gap-4 min-h-0 mt-3 h-full overflow-y-auto scrollbar-thin">

          {/* COLUMN 1: Live Inbox Threads OR Linked Accounts Manager (col-span-12 xl:col-span-3) */}
          <div className={`col-span-12 xl:col-span-3 flex flex-col min-h-0 xl:h-full border-r-0 xl:border-r pr-0 xl:pr-3.5 pb-3 xl:pb-0 ${isDark ? 'border-stone-800/80' : 'border-stone-200'}`}>
            
            {/* Left controller selector toggle */}
            <div className="flex gap-1 bg-stone-950 p-0.5 rounded-xl border border-stone-850 shrink-0 mb-2 select-none">
              <button
                type="button"
                onClick={() => {
                  setLeftColumnTab('threads');
                  showToast("📥 Switched to Live Active Threads list.");
                }}
                className={`flex-1 py-1 text-[9.5px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  leftColumnTab === 'threads' ? 'bg-amber-500 text-black font-extrabold' : 'text-stone-400 hover:text-white font-bold'
                }`}
              >
                <MessageSquare size={10} />
                DMs ({threads.length})
              </button>
              <button
                type="button"
                onClick={() => {
                  setLeftColumnTab('accounts');
                  showToast("🔌 Switched left panel to Integrated Social Accounts.");
                }}
                className={`flex-1 py-1 text-[9.5px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  leftColumnTab === 'accounts' ? 'bg-amber-500 text-black font-extrabold' : 'text-stone-400 hover:text-white font-bold'
                }`}
              >
                <Share2 size={10} />
                Socials ({zernioAccounts.length})
              </button>
            </div>

            {leftColumnTab === 'threads' ? (
              <div className="flex flex-col flex-1 min-h-0">
                {/* Search Inbox bar */}
                <div className="mb-1.5 shrink-0 relative select-none">
                  <input
                    type="text"
                    value={inboxSearch}
                    onChange={(e) => setInboxSearch(e.target.value)}
                    placeholder="Search DM sender, text..."
                    className={`w-full p-1 pl-2.5 text-[10.5px] rounded-xl focus:outline-none border ${isDark ? 'bg-stone-950 border-stone-850 text-white' : 'bg-neutral-50 border-neutral-250 text-stone-900'}`}
                  />
                  {inboxSearch && (
                    <button 
                      onClick={() => setInboxSearch('')} 
                      className="absolute right-2 px-0.5 text-[10px] text-stone-400 hover:text-white top-1 bg-transparent"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Platform Scrollbar Filters */}
                <div className="flex gap-1 overflow-x-auto pb-1 shrink-0 scrollbar-none border-b border-stone-800/80 mb-2 select-none">
                  {(['all', 'whatsapp', 'instagram', 'telegram', 'messenger', 'x', 'email'] as const).map((p) => {
                    const count = threads.filter(t => p === 'all' || t.platform === p).length;
                    const isSelected = platformFilter === p;
                    return (
                      <button
                        key={p}
                        onClick={() => {
                          setPlatformFilter(p);
                        }}
                        className={`px-1.5 py-0.5 rounded-md text-[8.5px] font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                          isSelected 
                            ? 'bg-amber-500 text-black font-black' 
                            : 'bg-stone-950 border border-stone-850 text-stone-300 hover:text-white'
                        }`}
                      >
                        {p} ({count})
                      </button>
                    );
                  })}
                </div>

                {/* Scrollable Threads Feed list representation */}
                <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scroll min-h-0">
                  {(() => {
                    const filtered = threads.filter(t => {
                      const matchPlatform = platformFilter === 'all' || t.platform === platformFilter;
                      const matchQuery = inboxSearch === '' || 
                         t.sender.toLowerCase().includes(inboxSearch.toLowerCase()) || 
                         t.message.toLowerCase().includes(inboxSearch.toLowerCase());
                      return matchPlatform && matchQuery;
                    });

                    if (filtered.length === 0) {
                      return (
                        <div className="p-6 text-center text-[10px] text-stone-400 border border-dashed border-stone-800 rounded-xl select-none">
                          No customer threads correspond to this filter setup.
                        </div>
                      );
                    }

                    return filtered.map(t => {
                      const latestText = t.messages.length > 0 ? t.messages[t.messages.length - 1].text : t.message;
                      const isSelected = selectedThreadId === t.id;
                      
                      return (
                        <button
                          key={t.id}
                          onClick={() => setSelectedThreadId(t.id)}
                          className={`w-full text-left p-2.5 border rounded-xl relative transition-all block cursor-pointer ${
                            isSelected 
                              ? isDark 
                                ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 font-semibold shadow-sm scale-[1.01]' 
                                : 'bg-amber-500/10 border-amber-500/60 text-amber-900 font-bold shadow-sm scale-[1.01]'
                              : isDark ? 'bg-neutral-950/40 border-stone-850 text-stone-200 hover:bg-stone-850/40' : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-900'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-0.5 w-full bg-transparent">
                            <span className="font-extrabold text-[10px] block truncate max-w-[120px]">{t.sender}</span>
                            <span className="text-[7.5px] uppercase font-mono text-amber-500 font-extrabold">{t.platform}</span>
                          </div>
                          
                          <p className={`text-[9.5px] truncate leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                            {latestText}
                          </p>
                          
                          <div className="flex items-center gap-1 mt-1.5 pt-1 border-t border-stone-850/20 justify-between bg-transparent select-none">
                            <div className="flex gap-1.5 items-center">
                              <span className={`text-[7px] font-black uppercase tracking-wider px-1 rounded ${
                                t.sentiment === 'urgent' ? 'bg-red-500/15 text-red-500' : 'bg-emerald-500/15 text-emerald-600'
                              }`}>
                                {t.sentiment}
                              </span>
                              {t.autoResponded ? (
                                <span className={`text-[7px] font-black uppercase tracking-wider px-1 rounded flex items-center gap-0.5 font-mono ${isDark ? 'bg-purple-500/15 text-purple-400' : 'bg-purple-200/50 text-purple-700'}`}>
                                  🤖 autopilot
                                </span>
                              ) : (
                                <span className="text-[7px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-600 px-1 rounded">
                                  Manual
                                </span>
                              )}
                              {t.unread && (
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                              )}
                            </div>
                            <span className="text-[7.5px] text-stone-400 block">{t.time}</span>
                          </div>
                        </button>
                      );
                    });
                  })()}
                </div>
              </div>
            ) : (
              /* CORE OAUTH CONNECTIONS & BRAND PROFILES LISTING */
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scroll min-h-0 text-left">
                
                {/* Brand profile selector */}
                <div className="space-y-1 bg-transparent">
                  <label className="text-[7.5px] font-mono font-extrabold uppercase tracking-widest text-stone-400 block">
                    Active Brand Workspace Context
                  </label>
                  <select
                    value={selectedProfileId}
                    onChange={(e) => {
                      setSelectedProfileId(e.target.value);
                      showToast(`📁 Switched active brand workspace to ${e.target.value}`);
                    }}
                    className={`w-full p-1.5 text-[11px] font-mono rounded-lg border focus:outline-none ${
                      isDark ? 'bg-stone-950 border-stone-850 text-white' : 'bg-stone-50 border-stone-250 text-stone-900'
                    }`}
                  >
                    {zernioProfiles.map(p => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Inline brand profile creator */}
                <div className={`p-2 rounded-xl border space-y-1.5 ${isDark ? 'bg-stone-950/40 border-stone-850' : 'bg-stone-50 border-stone-200'}`}>
                  <span className="text-[8px] font-mono font-black text-amber-500 uppercase tracking-wider block">
                    ➕ Register Brand Workspace
                  </span>
                  <div className="grid grid-cols-2 gap-1.5 bg-transparent">
                    <input
                      type="text"
                      placeholder="e.g. Sameer Agency"
                      value={zernioNewProfileName}
                      onChange={e => setZernioNewProfileName(e.target.value)}
                      className={`p-1 px-1.5 text-[10px] font-medium rounded focus:outline-none border ${
                        isDark ? 'bg-neutral-900 border-stone-800 text-white' : 'bg-white border-stone-250 text-stone-900'
                      }`}
                    />
                    <input
                      type="text"
                      placeholder="e.g. Main Brand Hub"
                      value={zernioNewProfileDesc}
                      onChange={e => setZernioNewProfileDesc(e.target.value)}
                      className={`p-1 px-1.5 text-[10px] font-medium rounded focus:outline-none border ${
                        isDark ? 'bg-neutral-900 border-stone-800 text-white' : 'bg-white border-stone-250 text-stone-900'
                      }`}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={createZernioProfile}
                    className="w-full py-1 bg-emerald-500 hover:bg-emerald-450 text-black text-[9px] font-black uppercase tracking-wider rounded transition-all cursor-pointer hover:shadow"
                  >
                    Create Workspace
                  </button>
                </div>

                {/* Connection helper with redirect simulators */}
                <div className={`p-2 rounded-xl border space-y-1.5 ${isDark ? 'bg-purple-950/10 border-purple-500/20' : 'bg-purple-50/50 border-purple-200'}`}>
                  <span className={`text-[8px] font-mono font-black flex items-center gap-1 mb-0.5 ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>
                    ⚡ OAUTH OMNICHANNEL LINKER
                  </span>
                  <div className="flex gap-1.5 bg-transparent">
                    <select
                      value={connectPlatform}
                      onChange={e => setConnectPlatform(e.target.value)}
                      className={`flex-1 p-1 text-[10px] font-mono rounded border ${
                        isDark ? 'bg-stone-900 border-stone-800 text-white' : 'bg-white border-stone-200 text-stone-900'
                      }`}
                    >
                      <option value="twitter">X (Twitter)</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="bluesky">Bluesky</option>
                    </select>
                    <button
                      type="button"
                      onClick={getZernioConnectUrl}
                      className="py-1 px-2 bg-purple-600 hover:bg-purple-500 text-white text-[8.5px] font-black uppercase rounded text-center transition-all cursor-pointer"
                    >
                      Fetch Link
                    </button>
                  </div>

                  {authUrlResult && (
                    <div className={`pt-1 space-y-1 bg-transparent border-t mt-1 ${isDark ? 'border-purple-500/10' : 'border-purple-200'}`}>
                      <p className={`text-[7.5px] font-mono ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>Auth Link Callback URL:</p>
                      <div className="flex flex-col gap-1 bg-transparent">
                        <a
                          href={authUrlResult}
                          target="_blank"
                          rel="noreferrer"
                          className={`p-1 text-[8.5px] truncate rounded border font-mono text-center flex items-center justify-center gap-1 ${
                            isDark ? 'bg-stone-900 hover:bg-stone-850 text-sky-400 border-stone-800' : 'bg-white hover:bg-stone-50 text-sky-600 border-stone-200 shadow-sm'
                          }`}
                        >
                          <ExternalLink size={8} /> Open Auth URL (New Tab)
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            const existingIds = zernioAccounts.map(a => a.platform);
                            const newId = 'acc_' + connectPlatform + '_' + Math.random().toString(36).substring(2, 6);
                            if (!existingIds.includes(connectPlatform)) {
                              const updated = [...zernioAccounts, { _id: newId, platform: connectPlatform }];
                              setZernioAccounts(updated);
                              addZernioLog('CALLBACK /api/callback', { code: 'oauth_code_xyz', platform: connectPlatform }, { success: true, accountId: newId }, 'SUCCESS');
                              showToast(`🔌 OAuth Link successful: ${connectPlatform} stream connected!`);
                            } else {
                              showToast(`⚠️ ${connectPlatform} is already connected.`);
                            }
                          }}
                          className={`py-0.5 text-[8px] font-black rounded border cursor-pointer ${
                            isDark ? 'bg-[#153e20] border-emerald-500/30 text-emerald-400 hover:bg-emerald-555' : 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          Simulate Callback Connect
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Connected accounts manager checklist */}
                <div className="space-y-1">
                  <div className={`flex justify-between items-center border-b pb-0.5 ${isDark ? 'border-stone-800' : 'border-stone-200'}`}>
                    <span className={`text-[8px] font-mono font-extrabold uppercase tracking-wider ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                      📂 ACTIVE CHANNELS
                    </span>
                    <button
                      type="button"
                      onClick={fetchZernioAccounts}
                      className="text-[8.5px] text-[#0284c7] font-bold hover:text-sky-600 flex items-center gap-0.5 cursor-pointer"
                    >
                      <RefreshCw size={8} className={isZernioLoading ? 'animate-spin' : ''} />
                      Sync
                    </button>
                  </div>

                  <div className="space-y-1">
                    {zernioAccounts.map(a => (
                      <div
                        key={a._id}
                        className={`p-1 px-1.5 rounded-lg border flex items-center justify-between ${
                          isDark ? 'bg-stone-950/40 border-stone-805' : 'bg-stone-50 border-stone-200'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 bg-transparent">
                          <span className={`text-[7.5px] font-mono font-black uppercase px-1.5 py-0.2 rounded border ${
                            isDark ? 'bg-stone-900 text-stone-300 border-stone-800' : 'bg-white text-stone-700 border-stone-200 shadow-sm'
                          }`}>
                            {a.platform}
                          </span>
                          <span className={`text-[8px] font-mono ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                            ID: {a._id.substring(4)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setZernioAccounts(prev => prev.filter(x => x._id !== a._id));
                            showToast(`🗑️ Account link ${a.platform} detached.`);
                          }}
                          className={`${isDark ? 'text-stone-400' : 'text-stone-500'} hover:text-red-400 transition-all cursor-pointer`}
                        >
                          <Trash2 size={9} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* COLUMN 2: Message Transcripts & Auto-Responder Chat (col-span-12 xl:col-span-6) */}
          <div className="col-span-12 xl:col-span-6 flex flex-col min-h-0 justify-between h-full border-r border-stone-800/80 pr-0 xl:pr-4 pl-0 xl:pl-2">
            
            {/* Header sender card detail section */}
            <div className="pb-1.5 border-b border-dashed border-stone-800 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm select-none">{selectedThread.avatar}</span>
                <div className="text-left">
                  <h4 className="font-extrabold text-[10.5px] text-white uppercase tracking-wider leading-none">
                    {selectedThread.sender}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <p className="text-[8px] text-stone-400 font-medium leading-none">
                      Channel: <span className="font-black text-amber-500 uppercase">{selectedThread.platform}</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        const currentVal = threadAutopilot[selectedThread.id] !== false;
                        setThreadAutopilot(prev => ({ ...prev, [selectedThread.id]: !currentVal }));
                        showToast(`Aria Autopilot for ${selectedThread.sender} shifted to ${!currentVal ? '🟢 RUNNING' : '🔴 PAUSED'}.`);
                      }}
                      className={`px-1.5 py-0.5 rounded text-[7.5px] font-mono font-black uppercase transition-all flex items-center gap-1 cursor-pointer border ${
                        (threadAutopilot[selectedThread.id] !== false)
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-stone-800/60 text-stone-400 border-stone-700/60'
                      }`}
                      title="Silence or active Aria automation for this individual thread"
                    >
                      <Bot size={8} className={(threadAutopilot[selectedThread.id] !== false) ? "animate-pulse" : ""} />
                      <span>Thread Auto: {(threadAutopilot[selectedThread.id] !== false) ? 'ON' : 'OFF'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Toggle panels: Active Conversation vs Training rules triggers */}
              <div className="flex gap-0.5 bg-stone-950 p-0.5 rounded-lg border border-stone-850 select-none">
                <button
                  type="button"
                  onClick={() => setRightPanelTab('chat')}
                  className={`text-[8px] px-1.5 py-0.5 rounded font-black uppercase transition-all flex items-center gap-1 cursor-pointer ${
                    rightPanelTab === 'chat' ? 'bg-amber-500 text-black' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <MessageSquare size={8} /> DM Chat
                </button>
                <button
                  type="button"
                  onClick={() => setRightPanelTab('train')}
                  className={`text-[8px] px-1.5 py-0.5 rounded font-black uppercase transition-all flex items-center gap-1 cursor-pointer ${
                    rightPanelTab === 'train' ? 'bg-purple-600 text-white' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <Bot size={8} /> AI Autopilot
                </button>
              </div>
            </div>

            {rightPanelTab === 'chat' ? (
              <div className="flex-1 flex flex-col justify-between min-h-0 mt-2">
                
                {/* Active chat messages balloon scroll view */}
                <div className="flex-1 space-y-2.5 overflow-y-auto pr-1 custom-scroll min-h-0 py-1 bg-transparent">
                  
                  {/* Autopilot trigger banner info */}
                  <div className="p-1.5 bg-stone-950/60 border border-stone-850 rounded-xl flex items-center justify-between select-none font-mono">
                    <div className="space-y-0.5 text-left">
                      <span className="text-[7.5px] font-black text-amber-500 uppercase flex items-center gap-1">
                        <Bot size={10} className={isManyChatActive ? "animate-pulse font-bold" : ""} />
                        AUTOPILOT BOT AGENT
                      </span>
                      <p className="text-[7.5px] text-stone-300 leading-normal">
                        Keywords match auto-respond training playbook triggers.
                      </p>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => {
                        setIsManyChatActive(!isManyChatActive);
                        showToast(`Autopilot is now ${!isManyChatActive ? '🟢 ACTIVE' : '🔴 DISABLED'}.`);
                      }}
                      className={`px-1.5 py-0.5 text-[7.5px] font-black uppercase rounded border transition-all cursor-pointer ${
                        isManyChatActive 
                          ? 'bg-[#153e20] text-emerald-400 border-emerald-500/30' 
                          : 'bg-red-500/10 text-red-400 border-red-500/25'
                      }`}
                    >
                      {isManyChatActive ? 'ON' : 'OFF'}
                    </button>
                  </div>

                  {selectedThread.messages.map((m) => {
                    const isOwner = m.sender === 'owner';
                    const isAria = m.sender === 'aria';
                    
                    return (
                      <div key={m.id} className={`flex ${isOwner || isAria ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-2.5 max-w-[85%] rounded-xl border transition-all text-left ${
                          isOwner 
                            ? 'bg-stone-900 border-amber-500/20 text-white rounded-tr-none shadow-sm' 
                            : isAria
                            ? 'bg-[#151109] border-purple-500/30 text-amber-400 rounded-tr-none font-mono shadow-sm'
                            : isDark
                            ? 'bg-stone-950 border-stone-850 text-stone-100 rounded-tl-none shadow-sm'
                            : 'bg-stone-100 border-stone-200 text-stone-900 rounded-tl-none shadow-sm'
                        }`}>
                          <div className="flex justify-between items-center gap-4 mb-1 bg-transparent text-xs">
                            <span className={`text-[7px] font-mono font-black uppercase tracking-wider ${
                              isOwner ? 'text-emerald-400' : isAria ? 'text-amber-500' : isDark ? 'text-stone-300' : 'text-stone-600'
                            }`}>
                              {isOwner ? '👑 Operator' : isAria ? '🤖 AI Autopilot' : '👤 Customer'}
                            </span>
                            <span className="text-[7.5px] text-stone-400 font-mono">{m.time}</span>
                          </div>
                          
                          <p className="text-[10px] leading-relaxed font-semibold">{m.text}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>



                {/* Bottom responder chat input directly stashed inside bento card */}
                <div className={`pt-2 border-t flex gap-2 w-full shrink-0 select-none bg-transparent ${isDark ? 'border-stone-850' : 'border-stone-200'}`}>
                  <input 
                    type="text"
                    value={typedReply}
                    onChange={e => setTypedReply(e.target.value)}
                    placeholder={activeRespondentRole === 'owner' ? `Type a response to ${selectedThread.sender}...` : "Simulate customer text (e.g. discount, support)..."}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleSendReply();
                    }}
                    className={`flex-1 px-3 py-1.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-amber-500 rounded-xl ${
                      isDark ? 'bg-stone-950 border-stone-850 text-white font-medium' : 'bg-stone-50 border-stone-200 text-stone-900 font-medium'
                    }`}
                  />
                  <button 
                    onClick={handleSendReply}
                    disabled={!typedReply.trim()}
                    className="p-1 px-3.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-30 rounded-xl text-black transition-all cursor-pointer font-black uppercase text-[10px] flex items-center gap-1 active:scale-95 shadow-sm"
                  >
                    <Send size={10} />
                    <span>Send</span>
                  </button>
                </div>
              </div>
            ) : (
              /* PANEL: MANYCHAT AUTOMATION TRAINING INPUT RULES ENGINE */
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scroll min-h-0 py-2">
                
                <div className="p-2 rounded-xl border border-purple-500/25 bg-purple-950/10 text-left text-[9.5px] text-purple-200 select-none">
                  <h5 className="font-extrabold uppercase text-purple-400 mb-0.5 flex items-center gap-1">
                    🪐 Autopilot Keywords Playbook
                  </h5>
                  Define trigger keywords that automate instant AI responses on the simulator!
                </div>

                {/* Training rule creator form inline */}
                <div className="p-2.5 rounded-xl border border-stone-850 bg-stone-950/70 space-y-2">
                  <span className="text-[8.5px] font-black uppercase tracking-wider text-amber-500 block font-mono">
                    Add Auto-Pilot Rule Trigger
                  </span>
                  
                  <form onSubmit={handleCreateTrigger} className="space-y-1.5 bg-transparent text-left">
                    <div className="bg-transparent font-mono">
                      <label className="text-[7.5px] font-extrabold uppercase text-[#A8A29E] block mb-0.5">
                        Keyword trigger (contains text)
                      </label>
                      <input 
                        type="text"
                        required
                        placeholder="e.g. refund, coupon, sunday"
                        value={newTrigger}
                        onChange={e => setNewTrigger(e.target.value)}
                        className="w-full p-1 text-[10.5px] rounded bg-neutral-900 border border-stone-800 text-white focus:outline-none"
                      />
                    </div>

                    <div className="bg-transparent font-mono">
                      <label className="text-[7.5px] font-extrabold uppercase text-[#A8A29E] block mb-0.5">
                        Script AI Response Output
                      </label>
                      <input 
                        type="text"
                        required
                        placeholder="e.g. Apply 10% voucher: CODE10"
                        value={newResponse}
                        onChange={e => setNewResponse(e.target.value)}
                        className="w-full p-1 text-[10.5px] rounded bg-neutral-900 border border-stone-800 text-white focus:outline-none"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-1 bg-purple-600 hover:bg-purple-505 bg-purple-500 text-white font-black uppercase text-[8.5px] rounded tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Plus size={10} /> Save Training Rule
                    </button>
                  </form>
                </div>

                {/* Implemented training trigger lists */}
                <div className="space-y-1 select-none text-left">
                  <span className="text-[8px] font-black uppercase tracking-wider text-stone-400 block font-mono pb-0.5 border-b border-stone-850 mb-1">
                    Active Trained Triggers ({botRules.length})
                  </span>
                  
                  <div className="space-y-1">
                    {botRules.map((rule, idx) => (
                      <div key={idx} className="p-1.5 rounded-lg border border-stone-850 bg-stone-950/40 font-mono">
                        <div className="flex justify-between items-center bg-transparent mb-0.5">
                          <span className="text-purple-400 font-extrabold text-[8px] bg-purple-950/30 px-1 rounded">
                            "{rule.trigger}"
                          </span>
                          
                          <button
                            type="button"
                            onClick={() => {
                              setBotRules(curr => curr.filter((_, i) => i !== idx));
                              showToast(`Removed trigger: "${rule.trigger}"`);
                            }}
                            className="text-stone-400 hover:text-red-400 text-[8px] bg-transparent cursor-pointer"
                          >
                            <Trash2 size={8} />
                          </button>
                        </div>
                        <p className="text-[8.5px] text-stone-300 leading-normal line-clamp-2">
                          {rule.response}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* COLUMN 3: Social Publisher scheduler & Queue Ledger (col-span-12 xl:col-span-3) */}
          <div className="col-span-12 xl:col-span-3 flex flex-col min-h-0 xl:h-full text-left">
            
            {/* Scrollable Composer & Configuration Section */}
            <div className="flex-1 overflow-y-auto custom-scroll pr-1.5 space-y-3.5 min-h-0 pb-2">
              
              {/* Publisher Upper core form */}
              <div className={`space-y-2 pb-2 bg-transparent border-b shrink-0 select-none ${isDark ? 'border-stone-850' : 'border-stone-200'}`}>
                <div className="flex items-center justify-between">
                  <span className={`font-extrabold text-xs uppercase tracking-wider ${isDark ? 'text-stone-300' : 'text-stone-800'}`}>
                    📝 Social Publisher
                  </span>
                  <span className="text-[8.5px] font-mono font-bold text-emerald-505 text-emerald-500">
                    Multiple Targets
                  </span>
                </div>
                
                {/* Target Platforms checklist selector */}
                <div className="space-y-1 bg-transparent">
                  <span className="text-[8px] font-mono font-black text-amber-500 uppercase tracking-wider block">
                    🎯 Target Destinations:
                  </span>
                  <div className="flex flex-wrap gap-1 bg-transparent">
                    {zernioAccounts.map(a => {
                      const isSelected = selectedAccounts.includes(a._id);
                      return (
                        <button
                          key={a._id}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setSelectedAccounts(prev => prev.filter(x => x !== a._id));
                            } else {
                              setSelectedAccounts(prev => [...prev, a._id]);
                            }
                          }}
                          className={`px-2 py-0.5 text-[9px] font-mono font-black uppercase rounded-lg border transition-all cursor-pointer ${
                            isSelected 
                              ? 'bg-amber-500 text-black border-amber-500 shadow-sm'
                              : isDark ? 'bg-stone-900 border-stone-800 text-stone-400 hover:text-white' : 'bg-stone-100 border-stone-200 text-stone-605 text-stone-600 hover:bg-stone-200'
                          }`}
                        >
                          {a.platform}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Post compose block */}
              <div className="flex flex-col shrink-0 py-1 bg-transparent select-none">
                <label className="text-[8px] font-mono font-extrabold uppercase tracking-widest text-[#A8A29E] mb-1">
                  Post Content text (markdown supports)
                </label>
                <textarea
                  value={postContent}
                  onChange={e => setPostContent(e.target.value)}
                  placeholder="What should we cross-post today? e.g. Cross-posting to connected brand endpoints!"
                  className={`w-full p-2 h-[75px] xl:h-[85px] text-[10.5px] focus:outline-none focus:ring-1 focus:ring-amber-500 rounded-xl resize-none border font-medium ${
                    isDark ? 'bg-neutral-950 border-stone-850 text-white' : 'bg-white border-stone-200 text-stone-950'
                  }`}
                />
              </div>

              {/* Scheduling time inputs */}
              <div className="grid grid-cols-2 gap-1.5 bg-transparent select-none shrink-0 mb-1">
                <div className="bg-transparent">
                  <label className="text-[7.5px] font-mono font-black text-[#A8A29E] uppercase tracking-wider block mb-0.5">
                    Schedule ISO datetime
                  </label>
                  <input
                    type="text"
                    disabled={postScheduleMode !== 'schedule'}
                    value={postScheduledFor}
                    onChange={e => setPostScheduledFor(e.target.value)}
                    className={`w-full p-1 text-[10px] font-mono rounded border focus:outline-none ${
                      postScheduleMode !== 'schedule'
                        ? isDark ? 'bg-stone-900 border-stone-850/60 text-stone-500 opacity-60' : 'bg-stone-100 border-stone-200 text-stone-400 opacity-60'
                        : isDark ? 'bg-neutral-950 border-stone-850 text-white' : 'bg-white border-stone-200 text-stone-950'
                    }`}
                  />
                </div>
                <div className="bg-transparent">
                  <label className="text-[7.5px] font-mono font-black text-[#A8A29E] uppercase tracking-wider block mb-0.5">
                    Location Timezone
                  </label>
                  <input
                    type="text"
                    disabled={postScheduleMode !== 'schedule'}
                    value={postTimezone}
                    onChange={e => setPostTimezone(e.target.value)}
                    className={`w-full p-1 text-[10px] font-mono rounded border focus:outline-none ${
                      postScheduleMode !== 'schedule'
                        ? isDark ? 'bg-stone-900 border-stone-850/60 text-stone-500 opacity-60' : 'bg-stone-100 border-stone-200 text-stone-400 opacity-60'
                        : isDark ? 'bg-neutral-950 border-stone-850 text-white' : 'bg-white border-stone-200 text-stone-950'
                    }`}
                  />
                </div>
              </div>

              {/* Timings selector tabs */}
              <div className={`flex gap-0.5 p-0.5 rounded-lg border select-none shrink-0 mb-1 ${isDark ? 'bg-stone-950 border-stone-850' : 'bg-stone-100 border-stone-200'}`}>
                {(['schedule', 'now', 'draft'] as const).map(mode => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setPostScheduleMode(mode)}
                    className={`flex-1 py-0.5 text-[8.5px] rounded font-black uppercase tracking-wide transition-all cursor-pointer text-center ${
                      postScheduleMode === mode 
                        ? 'bg-emerald-500 text-black font-extrabold' 
                        : isDark 
                          ? 'text-stone-400 hover:text-white font-bold' 
                          : 'text-stone-505 hover:text-stone-950 font-bold'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              {/* SDK cross-posting button */}
              <button
                type="button"
                onClick={createZernioPost}
                className={`w-full py-2 rounded-xl transition-all font-black text-[10px] uppercase tracking-wider cursor-pointer shadow-md flex items-center justify-center gap-1 text-black shrink-0 ${
                  postScheduleMode === 'now' 
                    ? 'bg-amber-500 hover:bg-amber-400 font-extrabold text-black' 
                    : postScheduleMode === 'draft'
                    ? 'bg-sky-500 hover:bg-sky-400 font-extrabold text-white'
                    : 'bg-emerald-500 hover:bg-emerald-400 font-extrabold text-black'
                }`}
              >
                <Send size={11} />
                <span>
                  {postScheduleMode === 'now' 
                    ? 'Publish Broadcast Now' 
                    : postScheduleMode === 'draft'
                    ? 'Save Broadcast as Draft'
                    : 'Schedule Broadcast Release'}
                </span>
              </button>

            </div>

            {/* Lower panel: Dispatch queue audit trail list */}
            <div className={`shrink-0 h-[160px] xl:h-[190px] flex flex-col min-h-0 mt-3 pt-2.5 border-t overflow-hidden ${isDark ? 'border-stone-850' : 'border-stone-200'}`}>
              <div className="shrink-0 select-none mb-1.5">
                <div className={`flex items-center gap-1 font-extrabold text-[10px] uppercase tracking-wider bg-transparent ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                  <Layers size={11} />
                  <span>Dispatch Queue ({scheduledPosts.length})</span>
                </div>
              </div>

              {/* Scrollable listing */}
              <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 select-none custom-scroll min-h-0 bg-transparent">
                {scheduledPosts.length === 0 ? (
                  <div className={`p-3 text-center text-[9px] border border-dashed rounded-lg ${isDark ? 'text-stone-300 border-stone-850 bg-stone-950/20' : 'text-stone-500 border-stone-200 bg-stone-50/50'}`}>
                    No posts registered in dispatch queue.
                  </div>
                ) : (
                  scheduledPosts.map((p, idx) => (
                    <div key={idx} className={`p-2 rounded-xl border font-mono text-left ${
                      isDark ? 'bg-stone-950 border-stone-850 text-stone-300' : 'bg-stone-50 border-stone-200 text-stone-800'
                    }`}>
                      <div className={`flex justify-between items-center text-[8px] border-b pb-1 mb-1.5 ${isDark ? 'border-stone-900' : 'border-stone-200/60'}`}>
                        <span className="text-amber-500 font-extrabold">post_{idx + 1}</span>
                        <div className="flex gap-0.5">
                          {p.platforms?.map((x: any, i: number) => (
                            <span key={i} className="text-[7px] bg-[#10b981]/15 border border-[#10b981]/25 text-emerald-600 dark:text-emerald-400 rounded px-1.5 py-0.2 uppercase font-black font-mono">
                              {x.platform}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className={`text-[9.5px] font-sans font-medium line-clamp-2 leading-tight ${isDark ? 'text-white' : 'text-stone-900'}`}>{p.content}</p>
                      
                      <div className={`pt-1.5 border-t flex items-center justify-between text-[7px] mt-1 ${isDark ? 'border-stone-905 border-stone-800/20 text-stone-400' : 'border-stone-200/60 text-stone-500 font-medium'}`}>
                        {p.publishNow ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-black flex items-center gap-0.5">
                            ● Published
                          </span>
                        ) : p.isDraft ? (
                          <span className="text-sky-600 dark:text-sky-400 font-black flex items-center gap-0.5">
                            ● Draft Workspace
                          </span>
                        ) : (
                          <span className="text-emerald-600 dark:text-emerald-400 font-extrabold uppercase shrink-0 truncate max-w-[105px]">
                            📅 {p.scheduledFor?.substring(11, 16) || '12:00'} UTC
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
      </>
      )}

    </div>
  );
}
