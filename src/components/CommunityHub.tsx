import React, { useState } from 'react';
import { 
  Users, 
  Share2, 
  MessageSquare, 
  ThumbsUp, 
  Vote, 
  Sparkles, 
  Send, 
  ShieldCheck, 
  TrendingUp 
} from 'lucide-react';

interface FeedPost {
  id: string;
  author: string;
  role: 'Owner' | 'Merchant VIP' | 'Loyallist Partner';
  avatar: string;
  content: string;
  likes: number;
  commentsCount: number;
  time: string;
}

interface CommunityHubProps {
  theme: 'light' | 'dark';
  showToast: (msg: string) => void;
}

export default function CommunityHub({ theme, showToast }: CommunityHubProps) {
  const isDark = theme === 'dark';

  const [posts, setPosts] = useState<FeedPost[]>([
    {
      id: 'p_1',
      author: 'Sameer Director',
      role: 'Owner',
      avatar: '👑',
      content: '🚨 ANNOUNCEMENT: We have successfully launched Sunday Express Shipping Lines inside Central London. All local wholesale accessory packages delivered under 3 hours systemwide!',
      likes: 24,
      commentsCount: 3,
      time: '3 hours ago'
    },
    {
      id: 'p_2',
      author: 'Samad Khan Sameer',
      role: 'Merchant VIP',
      avatar: '💼',
      content: 'I have tested the new Aria automated CRM auto-replies module. It has reduced my team software creep overhead significantly while preserving up to 98% response accuracy. Elite work!',
      likes: 18,
      commentsCount: 2,
      time: '1 day ago'
    }
  ]);

  const [newPostText, setNewPostText] = useState('');
  const [pollVotes, setPollVotes] = useState({ optionA: 12, optionB: 4 });
  const [hasVoted, setHasVoted] = useState(false);

  // Members static directory
  const members = [
    { name: 'Samad Khan Sameer', score: 'VIP Director', status: '🟢 Active' },
    { name: 'Sarah Miller', score: 'Gold Logistics', status: '🟢 Active' },
    { name: 'Amanda Croft', score: 'Adventures Inc', status: '🟡 Away' }
  ];

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const created: FeedPost = {
      id: `p_${Date.now()}`,
      author: 'Default Operator',
      role: 'Loyallist Partner',
      avatar: '👤',
      content: newPostText.trim(),
      likes: 1,
      commentsCount: 0,
      time: 'Just now'
    };

    setPosts(prev => [created, ...prev]);
    setNewPostText('');
    showToast("📣 Published announcement directly onto the Community Feed!");
  };

  const handleLikePost = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
    showToast("👍 Left premium endorsement validation inside feed channel.");
  };

  const handleVotePoll = (option: 'A' | 'B') => {
    if (hasVoted) {
      showToast("⚠️ You have already left your vote in this cycle.");
      return;
    }
    setPollVotes(prev => ({
      ...prev,
      optionA: option === 'A' ? prev.optionA + 1 : prev.optionA,
      optionB: option === 'B' ? prev.optionB + 1 : prev.optionB
    }));
    setHasVoted(true);
    showToast("🗳️ Submitted vote choice directly to group analytics.");
  };

  // Interactive Simulated Video Demo
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [videoTimestamp, setVideoTimestamp] = useState(0);
  const [videoSubtitle, setVideoSubtitle] = useState("Keep in sync with VIP clients and manage joint priority voting rounds.");

  React.useEffect(() => {
    let timer: any;
    if (isVideoOpen) {
      timer = setInterval(() => {
        setVideoTimestamp(prev => {
          const next = (prev + 1) % 25;
          if (next === 0) setVideoSubtitle("👥 Welcome to the Core Member & Loyalist Hub tutorial...");
          else if (next === 6) setVideoSubtitle("📣 Express Sunday Delivery and auto-Aria setup announcements are shared instantly...");
          else if (next === 13) setVideoSubtitle("🗳️ Open the Priority Decision Panel and let VIP clients vote on features...");
          else if (next === 19) setVideoSubtitle("👑 Operators can also log, endorse posts, or update member active tiers instantly!");
          return next;
        });
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isVideoOpen]);

  const cardBgCls = isDark ? 'bg-stone-900 border-stone-800 text-white' : 'bg-white border-stone-200 text-[#1C1917]';
  const inputBgCls = isDark ? 'bg-stone-950 border-stone-850 text-white rounded-2xl' : 'bg-neutral-50 border border-neutral-250 text-[#1C1917] rounded-xl';

  return (
    <div className="space-y-4 max-h-[calc(100vh-140px)] flex flex-col overflow-hidden">

      {/* Main Header */}
      <div className={`p-4 px-5 rounded-[24px] border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-3 shrink-0 ${cardBgCls}`}>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="p-1 rounded bg-amber-500/10 text-amber-500"><Users size={14} /></span>
            <span className="text-[10px] font-black uppercase text-amber-500 tracking-wider font-mono">Operations Feed</span>
          </div>
          <h2 className="text-xl font-black tracking-tight text-white select-none">Loyalists Group & Core Community Hub</h2>
          <p className="text-xs text-stone-200 mt-0.5 font-medium">Foster active relationships between principal directors, operations managers, and loyal wholesale customers.</p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Simulated walkthrough button */}
          <button
            type="button"
            onClick={() => {
              setIsVideoOpen(!isVideoOpen);
              if (!isVideoOpen) {
                setVideoTimestamp(0);
                showToast("🎥 Booted Loyalists Hub Interactive Walkthrough Video Simulator!");
              }
            }}
            className="px-3 py-1.5 bg-gradient-to-tr from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-750 text-black text-[10px] font-black uppercase tracking-wider rounded-full transition-all shadow-md cursor-pointer"
          >
            <span>{isVideoOpen ? '⏸ Pause Guide' : '🎥 Learn Community Hub (video)'}</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
            <ShieldCheck size={14} /> VIP Encrypted Channel
          </div>
        </div>
      </div>

      {/* Embedded Walkthrough Tutorial if active */}
      {isVideoOpen && (
        <div className="p-3 bg-black border border-amber-500/30 rounded-2xl flex flex-col md:flex-row items-center gap-4 shrink-0 transition-all font-mono select-none">
          <div className="w-24 h-14 bg-neutral-900 border border-stone-800 rounded-lg flex flex-col justify-between p-1 shrink-0 relative overflow-hidden">
            <span className="text-[6px] font-black text-amber-500">TUTORIAL DEMO</span>
            <div className="flex justify-center gap-0.5 h-5 items-end bg-transparent">
              <span className="w-1 bg-amber-400 rounded-t h-2 animate-bounce"></span>
              <span className="w-1 bg-amber-500 rounded-t h-4 animate-pulse"></span>
              <span className="w-1 bg-amber-400 rounded-t h-5"></span>
              <span className="w-1 bg-amber-500 rounded-t h-3 animate-ping"></span>
            </div>
            <div className="w-full bg-stone-800 h-1 rounded-sm overflow-hidden">
              <div className="bg-amber-500 h-full" style={{ width: `${(videoTimestamp / 25) * 100}%` }} />
            </div>
          </div>
          <div className="flex-1 space-y-0.5">
            <div className="flex justify-between text-[9px]">
              <span className="text-white font-black flex items-center gap-1">🎥 Community & VIP Board Guide (00:{videoTimestamp < 10 ? '0' + videoTimestamp : videoTimestamp} / 00:25)</span>
              <span className="text-[#32CD32] font-black uppercase tracking-wider">GUIDE ACTIVE</span>
            </div>
            <p className="text-[11px] leading-relaxed italic bg-neutral-950 p-1.5 rounded border border-stone-850 text-stone-200 font-sans">
              "{videoSubtitle}"
            </p>
          </div>
        </div>
      )}

      {/* 2 Column Mesh Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch overflow-hidden flex-grow">
        
        {/* Left main Column: Create Post formulation & Feeds logs (8 columns) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Create Post box */}
          <form onSubmit={handleCreatePost} className={`p-3 rounded-xl border space-y-2 ${cardBgCls}`}>
            <h3 className="font-extrabold text-[10px] uppercase tracking-wider text-amber-500">Post Group Announcement</h3>
            <textarea 
              rows={2}
              value={newPostText}
              onChange={e => setNewPostText(e.target.value)}
              placeholder="What strategic operations insight, courier updates, or discount codes are we sharing today?"
              className={`w-full p-2 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 ${inputBgCls}`}
            />
            <div className="flex justify-end">
              <button 
                type="submit"
                className="px-3 py-1 bg-amber-550 hover:bg-amber-450 text-black text-[9px] font-black uppercase tracking-wider rounded-full transition-all shadow-md active:scale-95 flex items-center gap-1 cursor-pointer"
              >
                <Send size={10} /> Publish Post
              </button>
            </div>
          </form>

          {/* Social Feeds logs */}
          <div className="space-y-2.5 max-h-[310px] overflow-y-auto pr-1 scrollbar-thin">
            {posts.map(post => (
              <div key={post.id} className={`p-3 rounded-xl border space-y-1.5 transition-all ${cardBgCls}`}>
                {/* Header author line */}
                <div className="flex justify-between items-center pb-1.5 border-b border-light/5 dark:border-stone-850/50">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-stone-950 border border-stone-850 flex items-center justify-center text-xs select-none">
                      {post.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-[11px] text-stone-900 dark:text-white leading-none">{post.author}</h4>
                      <span className="text-[8px] uppercase tracking-wider font-mono font-black text-amber-500 leading-none">{post.role}</span>
                    </div>
                  </div>
                  <span className="text-[8px] text-neutral-400">{post.time}</span>
                </div>

                {/* Content */}
                <p className="text-xs text-stone-300 leading-relaxed font-normal">
                  {post.content}
                </p>

                {/* Reactions actions rail */}
                <div className="flex gap-3 pt-1.5 border-t border-light/5 dark:border-stone-850/50 text-[10px]">
                  <button 
                    onClick={() => handleLikePost(post.id)}
                    className="flex items-center gap-1 hover:text-amber-500 transition-colors font-bold text-stone-450 cursor-pointer"
                  >
                    <ThumbsUp size={10} /> Endorse ({post.likes})
                  </button>
                  <span className="text-stone-450 flex items-center gap-1 font-bold">
                    <MessageSquare size={10} /> Discussion ({post.commentsCount})
                  </span>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Right side widgets Column: Group Polls & Active Directory (4 columns) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Strategic Decision Poll widget */}
          <div className={`p-3.5 rounded-xl border space-y-2.5 ${cardBgCls}`}>
            <div className="flex items-center gap-1.5 text-amber-500 font-extrabold text-[10px] uppercase tracking-wider">
              <Vote size={12} />
              <span>Priority Decision Poll</span>
            </div>
            <p className="text-[10px] text-neutral-450 leading-relaxed">Cast votes for which operational automation or freight route we should standardize next.</p>
            
            <div className="space-y-2">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold">
                  <span>A: London Overground Couriers</span>
                  <span className="font-mono font-bold text-amber-500">{pollVotes.optionA} votes</span>
                </div>
                <button 
                  onClick={() => handleVotePoll('A')}
                  disabled={hasVoted}
                  className={`w-full py-1.5 bg-stone-950 border border-stone-850 hover:bg-stone-855 text-[9px] text-left px-2 rounded font-bold block ${
                    hasVoted ? 'opacity-80' : 'cursor-pointer'
                  }`}
                >
                  Cast Vote Choice A
                </button>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold">
                  <span>B: Aria Automatic Callback bot</span>
                  <span className="font-mono font-bold text-amber-500">{pollVotes.optionB} votes</span>
                </div>
                <button 
                  onClick={() => handleVotePoll('B')}
                  disabled={hasVoted}
                  className={`w-full py-1.5 bg-stone-950 border border-stone-850 hover:bg-stone-855 text-[9px] text-left px-2 rounded font-bold block ${
                    hasVoted ? 'opacity-80' : 'cursor-pointer'
                  }`}
                >
                  Cast Vote Choice B
                </button>
              </div>
            </div>
          </div>

          {/* Members list widgets directory */}
          <div className={`p-3.5 rounded-xl border space-y-2.5 ${cardBgCls}`}>
            <h4 className="font-extrabold text-[10px] uppercase tracking-wider text-stone-400">VIP Members Directory</h4>
            
            <div className="space-y-2">
              {members.map((mem, index) => (
                <div key={index} className="flex justify-between items-center text-xs pb-1.5 border-b border-light/5 dark:border-stone-850 last:border-0 last:pb-0">
                  <div>
                    <p className="font-bold text-stone-900 dark:text-white text-[11px]">{mem.name}</p>
                    <p className="text-[9px] text-neutral-450">{mem.score}</p>
                  </div>
                  <span className="text-[8px] font-mono font-black uppercase text-emerald-400">{mem.status}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
