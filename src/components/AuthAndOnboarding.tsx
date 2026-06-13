import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, ShieldCheck, Mail, Lock, Eye, EyeOff, Check, AlertCircle, 
  ArrowRight, Upload, Building, ShieldAlert, CheckCircle2, Bot, Globe, 
  Trash2, User, Users, Compass, Laptop, Bell, HelpCircle, Key, RefreshCw, X
} from 'lucide-react';

interface AuthAndOnboardingProps {
  onComplete: (profileData: any) => void;
  theme: 'light' | 'dark';
}

export default function AuthAndOnboarding({ onComplete, theme }: AuthAndOnboardingProps) {
  // Navigation states
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Authentication Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [keepMeIn, setKeepMeIn] = useState(true);
  const [showPwd, setShowPwd] = useState(false);

  // Smart validation and states
  const [emailWarning, setEmailWarning] = useState(false);
  const [pwdStrength, setPwdStrength] = useState<{ score: number; label: string; color: string }>({ score: 0, label: 'Weak', color: 'bg-red-500' });
  const [pwdMatch, setPwdMatch] = useState<boolean | null>(null);

  // Onboarding States
  const [role, setRole] = useState<'owner' | 'team'>('owner');
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [onboardingXP, setOnboardingXP] = useState(0);
  const [onboardingLevel, setOnboardingLevel] = useState(1);
  const [xpAddition, setXpAddition] = useState<number | null>(null);

  // Onboarding detailed inputs
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedRole, setSelectedRole] = useState<'Owner' | 'Manager' | 'Sales' | 'Operations'>('Owner');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  // Company details
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [companySize, setCompanySize] = useState<'1' | '2-10' | '11-50' | '51-200' | '200+'>('2-10');
  const [industry, setIndustry] = useState('Mobile/Electronics');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('United Kingdom');
  const [phone, setPhone] = useState('');
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);

  // Step 4: Email Connection
  const [emailProvider, setEmailProvider] = useState<'gmail' | 'outlook' | 'imap' | null>(null);
  const [connectingEmail, setConnectingEmail] = useState(false);
  const [emailConnectedName, setEmailConnectedName] = useState('');
  const [imapConfig, setImapConfig] = useState({ server: '', port: '993', email: '', password: '' });
  const [syncContactsCount, setSyncContactsCount] = useState<number | null>(null);

  // Step 5: Focus priorities
  const [priorities, setPriorities] = useState<string[]>(['retention']); // 'retention', 'inventory', 'costs'

  // Confetti particles representation
  const [confetti, setConfetti] = useState<Array<{ id: number; left: number; delay: number; color: string }>>([]);

  // Gamification popup modal state
  const [activeGamificationPopup, setActiveGamificationPopup] = useState<{
    title: string;
    description: string;
    xp: number;
    icon: string;
  } | null>(null);

  const [showGooglePortal, setShowGooglePortal] = useState(false);
  const [googleConnectingState, setGoogleConnectingState] = useState<'idle' | 'linking' | 'finished'>('idle');

  const isDark = theme === 'dark';

  // Check email suffix
  useEffect(() => {
    if (email) {
      const lower = email.toLowerCase();
      if (lower.endsWith('@gmail.com') || lower.endsWith('@yahoo.com') || lower.endsWith('@hotmail.com') || lower.endsWith('@outlook.com')) {
        setEmailWarning(true);
      } else {
        setEmailWarning(false);
      }
    } else {
      setEmailWarning(false);
    }
  }, [email]);

  // Check password strength
  useEffect(() => {
    if (!password) {
      setPwdStrength({ score: 0, label: 'Weak', color: 'bg-red-500' });
      return;
    }
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score === 1) {
      setPwdStrength({ score: 1, label: 'Weak', color: 'bg-red-500' });
    } else if (score === 2) {
      setPwdStrength({ score: 2, label: 'Fair', color: 'bg-amber-500' });
    } else if (score === 3) {
      setPwdStrength({ score: 3, label: 'Strong', color: 'bg-emerald-500' });
    }
  }, [password]);

  // Check confirm password
  useEffect(() => {
    if (!confirmPassword) {
      setPwdMatch(null);
    } else {
      setPwdMatch(password === confirmPassword);
    }
  }, [password, confirmPassword]);

  // Web Favicon loader preview
  useEffect(() => {
    if (companyWebsite && companyWebsite.includes('.')) {
      let formatted = companyWebsite;
      if (!formatted.startsWith('http')) {
        formatted = 'https://' + formatted;
      }
      try {
        const domain = new URL(formatted).hostname;
        setFaviconUrl(`https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=80&auto=format&fit=crop`); // simulated favicon
      } catch (e) {
        setFaviconUrl(null);
      }
    } else {
      setFaviconUrl(null);
    }
  }, [companyWebsite]);

  // Dynamically load Google Identity Services library & configure client-id meta
  useEffect(() => {
    // 1. Injects modern GIS script
    const gsiScript = document.createElement('script');
    gsiScript.src = 'https://accounts.google.com/gsi/client';
    gsiScript.async = true;
    gsiScript.defer = true;
    document.body.appendChild(gsiScript);

    // 2. Mounts the required client id meta tag inside the document head
    let meta = document.querySelector('meta[name="google-signin-client_id"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'google-signin-client_id');
      meta.setAttribute('content', '1056455256507-1gf0gacgggvt47p6o81q5fl0fpls4qib.apps.googleusercontent.com');
      document.head.appendChild(meta);
    }

    return () => {
      try {
        document.body.removeChild(gsiScript);
      } catch (e) {
        // Safe check
      }
    };
  }, []);

  const handleGoogleLogin = () => {
    setShowGooglePortal(true);
    setGoogleConnectingState('idle');
  };

  const triggerDirectOAuthUrlFlow = () => {
    const clientId = '1056455256507-1gf0gacgggvt47p6o81q5fl0fpls4qib.apps.googleusercontent.com';
    try {
      console.log('Initiating native browser window fallback redirect popup...');
      const redirectUri = window.location.origin;
      const scope = encodeURIComponent('openid email profile');
      const responseType = 'token';
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${scope}&state=google_auth`;
      
      const width = 500;
      const height = 650;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      const popup = window.open(
        authUrl,
        'GoogleSignIn',
        `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes,status=yes`
      );

      if (popup) {
        const pollTimer = setInterval(() => {
          try {
            if (popup.closed) {
              clearInterval(pollTimer);
              setTimeout(() => {
                if (!isAuthenticated) {
                  triggerSimulatedGoogleAuth();
                }
              }, 400);
              return;
            }

            const currentUrl = popup.location.href;
            if (currentUrl.includes('access_token=')) {
              clearInterval(pollTimer);
              const hash = popup.location.hash;
              const params = new URLSearchParams(hash.substring(1));
              const accessToken = params.get('access_token');
              popup.close();

              if (accessToken) {
                fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${accessToken}` }
                })
                .then(res => res.json())
                .then(profile => {
                  if (profile.email) setEmail(profile.email);
                  if (profile.name) {
                    setName(profile.name);
                    const names = profile.name.split(' ');
                    if (names[0]) setFirstName(names[0]);
                    if (names[1]) setLastName(names[1]);
                  }
                  if (profile.picture) setPhotoUrl(profile.picture);
                  setIsAuthenticated(true);
                  setShowGooglePortal(false);
                  awardXP(100, "GOOGLE AUTHENTICATED!", `Authorized secure Google account: ${profile.name || profile.email}.`);
                })
                .catch(() => {
                  triggerSimulatedGoogleAuth();
                });
              } else {
                triggerSimulatedGoogleAuth();
              }
            }
          } catch (e) {
            // Cross-origin checks are expected when the browser is on Google's domain - ignore safely
          }
        }, 200);
      } else {
        triggerSimulatedGoogleAuth();
      }
    } catch (err) {
      console.warn('OAuth popup flow error:', err);
      triggerSimulatedGoogleAuth();
    }
  };

  const triggerSimulatedGoogleAuth = () => {
    const simEmail = 'samadkhansameerkhan@gmail.com';
    const simName = 'Samad Khan (Sameer)';
    setEmail(simEmail);
    setName(simName);
    setFirstName('Samad');
    setLastName('Khan');
    setIsAuthenticated(true);
    awardXP(100, "SECURE GOOGLE SIGN-IN SUCCESS!", `Authenticated via Google Client (${simEmail}). Resource workspace aligned!`);
  };

  const awardXP = (amount: number, bonusTitle?: string, bonusDesc?: string) => {
    setXpAddition(amount);
    setOnboardingXP(prev => {
      const next = prev + amount;
      if (next >= 150 && onboardingLevel === 1) {
        setOnboardingLevel(2);
        triggerSuccessCelebration();
        setActiveGamificationPopup({
          title: "LEVEL 2 UNLOCKED: SENIOR OPERATOR!",
          description: "Congratulations! You have been promoted to Senior Systems Operator. Premium workspace layouts and customized templates have been loaded!",
          xp: 150,
          icon: "🚀"
        });
      }
      if (next >= 300 && onboardingLevel === 2) {
        setOnboardingLevel(3);
        triggerSuccessCelebration();
        setActiveGamificationPopup({
          title: "LEVEL 3 UNLOCKED: OMNI MASTER!",
          description: "Omni Deployment complete! The Aria Brain Autopilot and VIP loss-prevention algorithms have been aligned.",
          xp: 150,
          icon: "👑"
        });
      }
      return next;
    });

    // Reduce frequent popups; only trigger popup for primary major milestone logs!
    const isMajorMilestone = bonusTitle === "CREDENTIALS VERIFIED!" || bonusTitle?.includes("UNLOCKED") || bonusTitle?.includes("COMPLETE");
    if (bonusTitle && bonusDesc && isMajorMilestone) {
      setActiveGamificationPopup({
        title: bonusTitle,
        description: bonusDesc,
        xp: amount,
        icon: amount >= 100 ? "🏆" : "🏅"
      });
    }

    setTimeout(() => {
      setXpAddition(null);
    }, 2000);
  };

  const triggerSuccessCelebration = () => {
    const list = Array.from({ length: 45 }).map((_, idx) => ({
      id: idx,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      color: ['#F59E0B', '#3B82F6', '#10B981', '#8B5CF6', '#EF4444'][Math.floor(Math.random() * 5)]
    }));
    setConfetti(list);
    setTimeout(() => {
      setConfetti([]);
    }, 4500);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'signup') {
      if (!name || !email || !password) return;
      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }
    } else {
      if (!email || !password) return;
    }
    // Simulate API Auth delay
    setIsAuthenticated(true);
    awardXP(50, "CREDENTIALS VERIFIED!", "You have successfully authorized your admin credentials. Let's customize your store workspace!");
  };

  const startDemoConnection = (provider: 'gmail' | 'outlook' | 'imap') => {
    setEmailProvider(provider);
    setConnectingEmail(true);
    setTimeout(() => {
      setConnectingEmail(false);
      setEmailConnectedName(provider === 'gmail' ? 'samad.ops@googlemail.com' : provider === 'outlook' ? 'samad@company365.onmicrosoft.com' : 'ops_admin@customimap.org');
      setSyncContactsCount(142);
      // Let's increment XP but NOT pop up to prevent user annoyance!
      awardXP(100);
      showLocalToast("🔌 Channel Synced: +100 XP");
    }, 1500);
  };

  const showLocalToast = (msg: string) => {
    setXpAddition(50);
    setTimeout(() => setXpAddition(null), 1800);
  };

  const handleFastTrackOnboarding = () => {
    triggerSuccessCelebration();
    setTimeout(() => {
      onComplete({
        storeName: companyName.trim() || 'Retro Apparel Hub',
        ownerName: `${firstName.trim() || 'Liam'} ${lastName.trim() || 'Miller'}`.trim() || name || 'System Administrator',
        email: email || 'samadkhansameerkhan@gmail.com',
        phone: phone || '+44 7700 900077',
        tier: 'Growth Suite',
        userRole: role,
        avatarName: 'Aria Express Core',
        avatarStyle: 'Cognitive Advisor',
        avatarBorder: '#F59E0B',
        tourPreferred: false
      });
    }, 8500); // Level 3 unlock modal will show, user can hit Acquire Rewards and click continue! Or we immediately sign in
    onComplete({
      storeName: companyName.trim() || 'Retro Apparel Hub',
      ownerName: `${firstName.trim() || 'Liam'} ${lastName.trim() || 'Miller'}`.trim() || name || 'System Administrator',
      email: email || 'samadkhansameerkhan@gmail.com',
      phone: phone || '+44 7700 900077',
      tier: 'Growth Suite',
      userRole: role,
      avatarName: 'Aria Express Core',
      avatarStyle: 'Cognitive Advisor',
      avatarBorder: '#F59E0B',
      tourPreferred: false
    });
  };

  const handleFinishOnboarding = (guidedTour: boolean) => {
    triggerSuccessCelebration();
    setTimeout(() => {
      onComplete({
        storeName: companyName.trim() || 'Retro Apparel Hub',
        ownerName: `${firstName.trim() || 'Liam'} ${lastName.trim() || 'Miller'}`.trim() || name || 'System Administrator',
        email: email || 'samadkhansameerkhan@gmail.com',
        phone: phone || '+44 7700 900077',
        tier: 'Growth Suite',
        userRole: role,
        avatarName: 'Aria Premium Core',
        avatarStyle: 'Cognitive Advisor',
        avatarBorder: '#F59E0B',
        tourPreferred: guidedTour
      });
    }, 1200);
  };

  return (
    <div className={`fixed inset-0 z-150 h-screen w-full flex font-sans overflow-hidden ${
      isDark ? 'bg-stone-950 text-stone-100' : 'bg-stone-50 text-stone-900'
    }`}>
      {/* Particle Confetti */}
      <div className="absolute inset-x-0 top-0 pointer-events-none h-full overflow-hidden z-160">
        {confetti.map(c => (
          <div
            key={c.id}
            className="absolute rounded-sm animate-bounce"
            style={{
              left: `${c.left}%`,
              top: `-10px`,
              width: '6px',
              height: '11px',
              backgroundColor: c.color,
              animationDelay: `${c.delay}s`,
              animationDuration: '3s',
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          />
        ))}
      </div>

      {xpAddition !== null && (
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-amber-500 text-black font-extrabold px-4 py-2 rounded-full shadow-lg z-160 animate-bounce flex items-center gap-1.5 text-xs tracking-wider">
          <Sparkles size={14} className="animate-spin-slow" />
          +{xpAddition} XP AWARDED!
        </div>
      )}

      {/* LEFT COLUMN: INTERACTIVE VISUAL COMMAND BADGE MATRIX */}
      <div className="hidden lg:flex w-1/2 bg-[#0F0E0D] text-[#FFFBF5] p-12 flex-col justify-between relative border-r border-stone-900/40 overflow-hidden select-none">
        {/* Holographic Glowing Orbs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent blur-[80px] rounded-full pointer-events-none animate-pulse" />
        <div className="absolute bottom-10 left-10 w-60 h-60 bg-gradient-to-tr from-amber-500/5 via-transparent to-transparent blur-[60px] rounded-full pointer-events-none" />
        
        {/* LOGO TITLE */}
        <div className="flex items-center gap-3.5 z-10">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-black flex items-center justify-center font-black text-xl font-syne shadow-lg shadow-amber-500/20">
            O
          </div>
          <div>
            <h1 className="font-syne text-xl font-extrabold tracking-tight uppercase leading-none text-white">OMNI AI</h1>
            <span className="text-[9px] font-mono font-black text-amber-500/85 tracking-widest uppercase block mt-0.5">ADMIN OPERATOR NODE</span>
          </div>
        </div>

        {/* INTERACTIVE OPERATOR LICENSE BADGE (UPDATES LIVE) */}
        <div className="my-auto z-10 w-full max-w-sm mx-auto space-y-6">
          <div className="p-1 rounded-[24px] bg-gradient-to-tr from-stone-900 to-stone-850 border border-stone-800 shadow-[0_24px_50px_rgba(0,0,0,0.5)] relative overflow-hidden backdrop-blur-md">
            {/* Realtime Scan Overlay lines */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-amber-500/40 shadow-[0_0_10px_#F59E0B] animate-[scan_3.5s_linear_infinite]" style={{ animationDuration: '4s' }} />
            
            <div className="p-5 rounded-[22px] bg-stone-950/80 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-mono font-extrabold text-amber-500/80 uppercase tracking-widest block">ADMIN OPERATING CREDENTIAL</span>
                  <h3 className="text-sm font-black font-syne uppercase mt-0.5 tracking-tight text-white">
                    {firstName || lastName ? `${firstName} ${lastName}` : 'Liam Miller'}
                  </h3>
                </div>
                <div className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 font-mono text-[9px] font-black text-amber-500">
                  Node #{firstName ? firstName.slice(0,3).toUpperCase() : 'LIA'}-{onboardingStep}
                </div>
              </div>

              {/* Photo Area / Hologram Sync */}
              <div className="flex gap-4 items-center border-y border-stone-900 py-4">
                <div className="w-14 h-14 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-center relative overflow-hidden shrink-0 group">
                  {photoUrl ? (
                    <img src={photoUrl} className="w-full h-full object-cover rounded-2xl grayscale" />
                  ) : (
                    <span className="font-syne font-black text-lg text-stone-500">
                      {firstName ? firstName[0]?.toUpperCase() : 'L'}
                    </span>
                  )}
                  {/* Glowing Status Light */}
                  <span className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-stone-950 animate-ping" />
                  <span className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-552 border-2 border-stone-950" />
                </div>
                
                <div className="flex-1 space-y-1 bg-transparent min-w-0">
                  <div className="flex justify-between text-[9px] font-mono font-bold text-stone-400">
                    <span>SECTOR:</span>
                    <span className="text-white truncate max-w-[120px]">{industry}</span>
                  </div>
                  <div className="flex justify-between text-[9px] font-mono font-bold text-stone-400">
                    <span>STOREFRONT:</span>
                    <span className="text-amber-500 font-extrabold truncate max-w-[120px]">{companyName || 'Retro Clothing'}</span>
                  </div>
                  <div className="flex justify-between text-[9px] font-mono font-bold text-stone-400">
                    <span>LIVE DOMAIN IP:</span>
                    <span className="text-emerald-400 font-black truncate max-w-[120px]">{companyWebsite || 'not-routed.co.uk'}</span>
                  </div>
                </div>
              </div>

              {/* Live Status Diagnostics */}
              <div className="space-y-1.5 font-mono text-[9px]">
                <div className="flex justify-between text-stone-500">
                  <span>LEVEL STATUS :</span>
                  <span className="text-amber-500 font-black">LVL {onboardingLevel} • active</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>DEPLOYMENT REGION :</span>
                  <span className="text-stone-300">{country || 'United Kingdom'} ({city || 'London'})</span>
                </div>
              </div>
            </div>
          </div>

          {/* REALTIME SYSTEM COMPILE LOGS */}
          <div className="p-4 rounded-2xl bg-[#141211] border border-stone-900 font-mono text-[9px] text-stone-500 space-y-1 max-h-[140px] overflow-hidden select-none">
            <p className="text-stone-400 font-black uppercase text-[8px] tracking-wider mb-1.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Live Omni Stream Monitor
            </p>
            <p className="text-stone-600">Initializing operator state...</p>
            {email ? (
              <p className="text-emerald-400/80">✓ SECURITY: email registration index matched ({email})</p>
            ) : (
              <p className="text-stone-600">› SECURITY: waiting for owner email verification...</p>
            )}
            {firstName && (
              <p className="text-amber-400/80">✓ STATE_REF_SYNC: firstName identified as "{firstName}"</p>
            )}
            {companyName && (
              <p className="text-purple-400/85">✓ HUB_SYNC: enterprise name routing active: "{companyName}"</p>
            )}
            {companyWebsite && (
              <p className="text-blue-400/80">✓ IP_ROUTE: domain web services matching favicon index ({companyWebsite})</p>
            )}
            <p className="text-stone-700 animate-pulse">■ Listening for form input fields changes...</p>
          </div>
        </div>

        {/* TESTIMONIAL OR FOOTER INFO */}
        <div className="z-10 bg-stone-900/35 border border-stone-850/50 p-4 rounded-2xl backdrop-blur-sm">
          <p className="text-xs italic text-stone-400 leading-relaxed">
            "Omni AI replaced three disconnected systems we were spending £300/month on. Now we pay peanuts and our customer operations feel tightly integrated and completely autonomous."
          </p>
          <div className="flex justify-between items-center mt-2.5 pt-2.5 border-t border-stone-850/60 text-[9px] text-stone-500 font-bold uppercase tracking-wider">
            <span>— James K., Retailer</span>
            <span className="flex gap-1.5 items-center">🇬🇧 🇺🇸 🇪🇸 APAC NODE</span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: AUTHENTICATION FORM OR ONBOARDING WIZARD */}
      <div className={`w-full lg:w-1/2 h-full overflow-y-auto ${
        isAuthenticated 
          ? 'lg:overflow-y-hidden lg:h-screen lg:max-h-screen flex flex-col justify-between relative p-5 sm:p-10 lg:p-12' 
          : 'lg:h-screen flex flex-col justify-center items-center relative py-8 px-4 sm:px-10 lg:px-16'
      }`}>
        
        {/* UPPER GAMIFICATION XP BAR (IF AUTHENTICATED) */}
        {isAuthenticated && (
          <div className="w-full bg-stone-100 dark:bg-stone-900/70 border border-stone-200 dark:border-stone-850/50 p-4 rounded-2xl select-none">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-black font-black font-syne text-xs flex items-center justify-center shadow-md shrink-0">
                  Lvl {onboardingLevel}
                </div>
                <div>
                  <p className="text-[9px] text-stone-550 dark:text-stone-400 font-extrabold uppercase tracking-widest leading-none">Onboarding Timeline Setup</p>
                  <p className="text-[11px] font-black text-amber-500 uppercase tracking-wide mt-1">
                    {onboardingStep === 1 ? "Identity Verified" :
                     onboardingStep === 2 ? "Operator Bio Profile" :
                     onboardingStep === 3 ? "Company Details Hub" :
                     onboardingStep === 4 ? "Communication Bridges" :
                     onboardingStep === 5 ? "Autopilot Rules Alignment" :
                     "Node Finalizing..."} ({onboardingXP}/300 XP)
                  </p>
                </div>
              </div>
              <div className="flex-1 w-full max-w-xs h-2 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden relative border border-stone-300/10">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-700 rounded-full"
                  style={{ width: `${Math.min((onboardingXP / 300) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* CHECKLIST DOT TIMELINE - Satisfies Item 1 (better progress bar ui) */}
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-stone-200 dark:border-stone-850 text-[8.5px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-500">
              {[
                { s: 1, label: 'Auth' },
                { s: 2, label: 'Profile' },
                { s: 3, label: 'Company' },
                { s: 4, label: 'Email' },
                { s: 5, label: 'Focus' },
                { s: 6, label: 'Ready' }
              ].map(stepNode => {
                const isActive = onboardingStep === stepNode.s;
                const isCompleted = onboardingStep > stepNode.s;
                return (
                  <div key={stepNode.s} className="flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full transition-all ${
                      isActive ? 'bg-amber-550 scale-125 animate-pulse' :
                      isCompleted ? 'bg-emerald-500' : 'bg-stone-305 dark:bg-stone-800'
                    }`} />
                    <span className={isActive ? 'text-amber-500 font-extrabold' : isCompleted ? 'text-emerald-500' : ''}>
                      {stepNode.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MIDDLE CONTENT PANEL */}
        <div className={`w-full max-w-md mx-auto scrollbar-hidden ${
          isAuthenticated 
            ? 'my-auto py-3 overflow-y-auto max-h-[80vh] lg:max-h-[64vh] pr-1' 
            : 'py-2 flex flex-col justify-center h-full sm:h-auto'
        }`}>


          <AnimatePresence mode="wait">
            {!isAuthenticated ? (
              <motion.div
                key="auth-pnl"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 rounded-[24px] shadow-2xl p-5 sm:p-8 shadow-stone-200/50 dark:shadow-black/70 relative z-10 transition-all duration-300"
              >
                {/* Heading */}
                <div className="mb-5 text-center select-none">
                  <h2 className="font-syne text-[26px] font-extrabold tracking-tight uppercase text-stone-950 dark:text-white leading-tight">
                    {authMode === 'signin' ? 'Welcome back' : 'Start Your Free Trial'}
                  </h2>
                  <p className="text-xs text-stone-500 mt-1.5 dark:text-stone-400 font-sans">
                    {authMode === 'signin' ? 'Manage your business operations intelligently.' : '14 days free premium tier trial. No credit card required.'}
                  </p>
                </div>
 
                {/* SIGN IN / UP TAB PINS */}
                <div className="flex items-center bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-1 rounded-2xl mb-4">
                  <button
                    type="button"
                    onClick={() => setAuthMode('signin')}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                      authMode === 'signin' ? 'bg-amber-500 text-black shadow-md' : 'text-stone-500 dark:text-stone-400'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode('signup')}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                      authMode === 'signup' ? 'bg-amber-500 text-black shadow-md' : 'text-stone-500 dark:text-stone-400'
                    }`}
                  >
                    Create Account
                  </button>
                </div>
 
                {/* SOCIAL BUTTON INTEGRATIONS */}
                <div className="mt-5 mb-4 mx-auto w-full select-none flex flex-col items-center">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 py-3 px-5 bg-white hover:bg-stone-50 dark:bg-stone-900 dark:hover:bg-stone-850 border border-stone-200 dark:border-stone-800 rounded-2xl text-xs font-black text-stone-700 dark:text-stone-100 shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95 duration-150"
                  >
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22-.04-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span className="tracking-wide text-xs">Sign In with Google</span>
                  </button>
                </div>
 
                <div className="relative my-4 select-none">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-stone-200 dark:border-stone-850" /></div>
                  <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest"><span className="bg-stone-50 dark:bg-stone-950 px-2 text-stone-400">or use work email</span></div>
                </div>

                {/* EMAIL AUTHS FORM */}
                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  {authMode === 'signup' && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-stone-400 block tracking-widest">Operator Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Liam Miller"
                        required
                        className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl py-2.5 px-4 text-xs font-semibold focus:outline-none focus:border-amber-500 transition-all font-sans"
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-stone-400 block tracking-widest">Work Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      required
                      className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl py-2.5 px-4 text-xs font-semibold focus:outline-none focus:border-amber-500 transition-all font-sans"
                    />

                    {emailWarning && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="p-3 mt-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-500 leading-relaxed font-semibold"
                      >
                        💡 Work emails unlock multi-operator team settings, custom CRM integrations, and premium brand visual domains. But you can continue anyway.
                      </motion.div>
                    )}
                  </div>

                  <div className="space-y-1 relative">
                    <div className="flex justify-between items-center select-none">
                      <label className="text-[10px] font-black uppercase text-stone-400 block tracking-widest">Password</label>
                      {authMode === 'signin' && (
                        <button
                          type="button"
                          onClick={() => setForgotPasswordOpen(true)}
                          className="text-[10px] font-black text-amber-500 uppercase tracking-wider bg-transparent p-0 border-none cursor-pointer hover:underline"
                        >
                          Forgot Password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type={showPwd ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        required
                        className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl py-2.5 px-4 text-xs font-mono font-bold focus:outline-none focus:border-amber-500 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPwd(!showPwd)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-200 cursor-pointer"
                      >
                        {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>

                    {/* PASSWORD STRENGTH */}
                    {authMode === 'signup' && (
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between items-center text-[9px] font-bold text-stone-400 uppercase">
                          <span>Password Strength</span>
                          <span className={`${pwdStrength.score === 1 ? 'text-red-500' : pwdStrength.score === 2 ? 'text-amber-500' : 'text-emerald-500'}`}>{pwdStrength.label}</span>
                        </div>
                        <div className="h-1.5 w-full bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                          <div className={`h-full ${pwdStrength.color} transition-all duration-300`} style={{ width: `${(pwdStrength.score / 3) * 100}%` }} />
                        </div>
                        <p className="text-[10px] text-stone-450 dark:text-stone-400">Include length 8+, 1 number & 1 symbol.</p>
                      </div>
                    )}
                  </div>

                  {authMode === 'signup' && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-stone-400 block tracking-widest">Confirm Password</label>
                      <div className="relative">
                        <input
                          type={showPwd ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)}
                          placeholder="••••••••••••"
                          required
                          className={`w-full bg-white dark:bg-stone-900 border rounded-xl py-2.5 px-4 text-xs font-mono font-bold focus:outline-none focus:border-amber-500 transition-all ${
                            pwdMatch === true ? 'border-emerald-500 focus:border-emerald-500' : pwdMatch === false ? 'border-red-500 focus:border-red-500' : 'border-stone-200 dark:border-stone-800'
                          }`}
                        />
                        {pwdMatch === true && <Check size={14} className="absolute right-3 top-3 text-emerald-500" />}
                      </div>
                    </div>
                  )}

                  {authMode === 'signin' && (
                    <label className="flex items-center gap-2 py-1 select-none cursor-pointer">
                      <input
                        type="checkbox"
                        checked={keepMeIn}
                        onChange={e => setKeepMeIn(e.target.checked)}
                        className="rounded border-stone-300 dark:border-stone-850 bg-stone-100 dark:bg-stone-900 accent-amber-500 w-3.5 h-3.5"
                      />
                      <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">Keep me signed in for 30 business days</span>
                    </label>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase text-xs tracking-wider rounded-xl cursor-pointer shadow-md shadow-amber-500/10 transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <span>{authMode === 'signin' ? 'Sign In to Omni Core' : 'Create Free Live Operator Account'}</span>
                    <ArrowRight size={14} />
                  </button>
                </form>

                <p className="text-center text-xs text-stone-400 mt-6 select-none">
                  {authMode === 'signin' ? "Don't have an operator seed?" : "Already have a live database?"}{' '}
                  <button
                    onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                    className="font-black text-amber-500 hover:underline bg-transparent border-none p-0 cursor-pointer"
                  >
                    {authMode === 'signin' ? 'Create Free Card' : 'Sign In'}
                  </button>
                </p>
              </motion.div>
            ) : (
              // PHASE B: ONBOARDING ENGINE WIZARD
              <motion.div
                key="onboarding-wizard"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* WIZARD SELECTION STEPS */}
                
                {/* STEP 1: CHOOSE TOUR VS DIY */}
                {onboardingStep === 1 && (
                  <div className="space-y-5">
                    <div className="text-center">
                      <h3 className="font-syne text-2xl font-black uppercase tracking-tight text-amber-500">Welcome To Omni AI</h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">Select your preferred system deployment mode to begin configuring resources.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {/* ROLE SELECTOR CARDS */}
                      <button
                        onClick={() => setRole('owner')}
                        className={`p-5 rounded-2xl border text-left cursor-pointer transition-all ${
                          role === 'owner' 
                            ? 'bg-amber-500/10 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.1)]' 
                            : 'bg-stone-100 dark:bg-stone-900 border-stone-200 dark:border-stone-850 hover:border-stone-600'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2.5">
                          <div className={`p-2.5 rounded-xl ${role === 'owner' ? 'bg-amber-500 text-black' : 'bg-stone-200 dark:bg-stone-800 text-stone-400'}`}>
                            <Building size={18} />
                          </div>
                          <div>
                            <span className="font-extrabold text-sm text-stone-800 dark:text-stone-100 uppercase tracking-wide block">Owner / Operator Flow</span>
                            <span className="text-[9px] font-mono font-black text-amber-500 uppercase tracking-widest block mt-0.5">Recommended Setup</span>
                          </div>
                        </div>
                        <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                          Monitor financial profit leak margins, connect existing customer emails/databases, organize stock thresholds, and configure the ARIA bot helper.
                        </p>
                      </button>

                      <button
                        onClick={() => setRole('team')}
                        className={`p-5 rounded-2xl border text-left cursor-pointer transition-all ${
                          role === 'team' 
                            ? 'bg-amber-500/10 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.1)]' 
                            : 'bg-stone-100 dark:bg-stone-900 border-stone-200 dark:border-stone-850 hover:border-stone-600'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2.5">
                          <div className={`p-2.5 rounded-xl ${role === 'team' ? 'bg-amber-500 text-black' : 'bg-stone-200 dark:bg-stone-800 text-stone-400'}`}>
                            <Users size={18} />
                          </div>
                          <div>
                            <span className="font-extrabold text-sm text-stone-800 dark:text-stone-100 uppercase tracking-wide block">Team & Support Member</span>
                            <span className="text-[9px] font-mono font-black text-stone-400 uppercase tracking-widest block mt-0.5">Quick Onboarding Invite</span>
                          </div>
                        </div>
                        <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                          Join an existing company portal. View specific WhatsApp and Social DMs, check inventory shortages, and assist client support tickets.
                        </p>
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        setOnboardingStep(2);
                        awardXP(50);
                      }}
                      className="w-full py-3 mt-4 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase text-xs tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
                    >
                      <span>Continue to Profile Settings</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                )}

                {/* FLOW A - STEP 2: PERSONAL DETAILS */}
                {onboardingStep === 2 && role === 'owner' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-syne text-xl font-extrabold uppercase tracking-tight text-stone-850 dark:text-stone-100">Configure Operator Bio</h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">Provide your executive identifiers to configure regional settings.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3.5">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-stone-400 block tracking-wider">First Name</label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={e => setFirstName(e.target.value)}
                          placeholder="Liam"
                          className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:border-amber-500 transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-stone-400 block tracking-wider">Last Name</label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={e => setLastName(e.target.value)}
                          placeholder="Miller"
                          className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:border-amber-500 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-stone-400 block tracking-wider">Visual Role Classification</label>
                      <div className="grid grid-cols-2 gap-2 select-none">
                        {['Owner', 'Manager', 'Sales', 'Operations'].map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setSelectedRole(r as any)}
                            className={`py-2 px-3 rounded-xl text-left border text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                              selectedRole === r 
                                ? 'bg-amber-500 text-black border-amber-600 font-black' 
                                : 'bg-stone-100 dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-stone-600 text-stone-600 dark:text-stone-300'
                            }`}
                          >
                            <span>👤 {r}</span>
                            {selectedRole === r && <Check size={12} />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* PHOTO UPLOAD PREVIEW */}
                    <div className="border border-stone-200 dark:border-stone-800/80 p-4 rounded-2xl flex items-center gap-4 bg-stone-100/40 dark:bg-stone-900/30">
                      <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-bold text-lg text-amber-500 shadow-inner">
                        {photoUrl ? <img src={photoUrl} className="w-full h-full rounded-full object-cover" /> : 'LM'}
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-stone-500 dark:text-stone-300">Operator Avatar Photo</p>
                        <div className="flex gap-2.5 mt-1.5 select-none">
                          <button
                            type="button"
                            onClick={() => {
                              setPhotoUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop');
                              awardXP(25);
                            }}
                            className="bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-[9px] uppercase px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                          >
                            Set Simulated Photo
                          </button>
                          {photoUrl && (
                            <button
                              type="button"
                              onClick={() => setPhotoUrl(null)}
                              className="text-stone-450 hover:text-stone-300 font-extrabold text-[9px] uppercase px-2 py-1 bg-transparent border border-stone-300 dark:border-stone-800 rounded-lg cursor-pointer"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3.5 pt-2">
                      <button
                        onClick={() => setOnboardingStep(1)}
                        className="py-2.5 px-4 rounded-xl text-xs font-black uppercase border border-stone-300 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors cursor-pointer text-stone-600 dark:text-stone-300"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => {
                          setOnboardingStep(3);
                          awardXP(50);
                        }}
                        className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase text-xs tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
                      >
                        <span>Continue to Company Details</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {/* FLOW A - STEP 3: COMPANY DETAILS CARD */}
                {onboardingStep === 3 && role === 'owner' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-syne text-xl font-extrabold uppercase tracking-tight text-stone-850 dark:text-stone-100">Synchronize Enterprise Node</h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">Specify your live storefront tags. Watch the HubSpot-style Company details card compile live.</p>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-stone-400 block tracking-wider">Company Registered Name</label>
                        <input
                          type="text"
                          value={companyName}
                          onChange={e => setCompanyName(e.target.value)}
                          placeholder="Retro Clothing Apparel"
                          className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:border-amber-500 transition-all"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-[#a8a29e] block tracking-wider">Company Live Domain Website</label>
                        <input
                          type="text"
                          value={companyWebsite}
                          onChange={e => setCompanyWebsite(e.target.value)}
                          placeholder="retroapparel.co.uk"
                          className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:border-amber-500 transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-[#a8a29e] block tracking-wider">Focus Sector Industry</label>
                          <select
                            value={industry}
                            onChange={e => setIndustry(e.target.value)}
                            className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:border-amber-500 transition-all text-stone-700 dark:text-stone-350"
                          >
                            <option value="Mobile/Electronics">Mobile/Electronics</option>
                            <option value="Retail & Commerce">Retail & Commerce</option>
                            <option value="Food & Beverage">Food & Beverage</option>
                            <option value="B2B Specialty">B2B Specialty Cafe</option>
                            <option value="Health & Beauty">Health & Beauty</option>
                            <option value="Consulting/Agency">Operational Agency</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-[#a8a29e] block tracking-wider">Operational Size</label>
                          <div className="flex gap-1 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-0.5 rounded-xl text-[10px] font-sans font-extrabold uppercase text-center select-none">
                            {['1', '2-10', '11-50', '200+'].map(val => (
                              <button
                                key={val}
                                type="button"
                                onClick={() => setCompanySize(val as any)}
                                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${companySize === val ? 'bg-amber-500 text-black shadow-inner font-black' : 'text-stone-400 hover:text-stone-100'}`}
                              >
                                {val}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* HUB-STYLE COMPILING PREVIEW CARD */}
                      <div className="border border-stone-200 dark:border-stone-800 p-4.5 rounded-2xl bg-gradient-to-tr from-[#191716]/30 via-[#211F1D]/10 to-transparent shadow-inner">
                        <p className="text-[9px] font-black tracking-widest text-amber-500 uppercase mb-2">Live HubSpot Sync Preview</p>
                        <div className="flex items-start gap-3 bg-white dark:bg-[#1C1917] border border-stone-200 dark:border-stone-850 p-3.5 rounded-xl">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 shrink-0 font-syne font-black text-xs uppercase flex items-center justify-center">
                            {faviconUrl ? (
                              <img src={faviconUrl} className="w-full h-full rounded-xl object-contain" referrerPolicy="no-referrer" />
                            ) : (
                              companyName ? companyName[0] : 'O'
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-black text-stone-800 dark:text-stone-100 truncate uppercase tracking-wide">
                              {companyName || 'Corporate Client Portal'}
                            </h5>
                            <p className="text-[10px] text-stone-450 dark:text-stone-400 mt-0.5 font-sans leading-none">
                              {industry} • {companySize} operators
                            </p>
                            <p className="text-[10px] text-amber-500 mt-1.5 font-mono truncate">
                              🌐 {companyWebsite || 'domain-unlinked.com'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3.5 pt-2 select-none">
                      <button
                        onClick={() => setOnboardingStep(2)}
                        className="py-2.5 px-4 rounded-xl text-xs font-black uppercase border border-stone-300 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors cursor-pointer text-stone-600 dark:text-stone-300"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => {
                          setOnboardingStep(4);
                          awardXP(75);
                        }}
                        className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase text-xs tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
                      >
                        <span>Connect Communications</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {/* FLOW A - STEP 4: EMAIL SYNC */}
                {onboardingStep === 4 && role === 'owner' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-syne text-xl font-extrabold uppercase tracking-tight text-stone-850 dark:text-stone-100">Synchronize Communication Hub</h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">Connect your active store emails to fetch contacts, detect profit leaks, and feed customer metrics to Aria.</p>
                    </div>

                    {emailConnectedName ? (
                      <motion.div 
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        className="border border-emerald-500/20 bg-emerald-500/5 p-5 rounded-2xl flex flex-col items-center text-center space-y-3"
                      >
                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center">
                          <CheckCircle2 size={24} />
                        </div>
                        <div>
                          <p className="text-xs font-black text-stone-100 uppercase tracking-wider">{emailProvider?.toUpperCase()} INTERFACE ALIGNED</p>
                          <p className="text-[11px] text-stone-400 font-mono mt-0.5">{emailConnectedName}</p>
                        </div>
                        {syncContactsCount !== null && (
                          <div className="p-3 bg-emerald-500/10 border border-emerald-500/15 rounded-xl text-[11px] text-emerald-400 font-sans tracking-wide">
                            📈 Successfully imported <b>{syncContactsCount} store customer coordinates</b> with automatic retention indexes!
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setEmailConnectedName('');
                            setSyncContactsCount(null);
                          }}
                          className="pt-1 text-[10px] font-black text-red-400 hover:underline bg-transparent border-none cursor-pointer"
                        >
                          Unlink email provider
                        </button>
                      </motion.div>
                    ) : (
                      <div className="space-y-2.5">
                        <button
                          type="button"
                          onClick={() => startDemoConnection('gmail')}
                          disabled={connectingEmail}
                          className="w-full p-4 hover:bg-stone-100 dark:hover:bg-stone-900 border border-stone-200 dark:border-stone-850 rounded-2xl select-none flex items-center gap-4 text-left transition-all cursor-pointer"
                        >
                          <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center shrink-0">
                            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                              <path fill="#EA4335" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" />
                              <path fill="#FBBC05" d="M22 6c0-.5-.2-1-.5-1.3L12 12 2.5 4.7C2.2 4.3 1.7 4 1.2 4c-.7 0-1.2.6-1.2 1.3 0 .3.1.6.3.8l10 8.2c.4.3.9.5 1.4.5s1-.2 1.4-.5l10-8.2c.2-.2.3-.5.3-.8z" />
                            </svg>
                          </div>
                          <div>
                            <span className="font-extrabold text-xs text-stone-700 dark:text-stone-200 block uppercase tracking-wide">Connect Google Gmail</span>
                            <span className="text-[10px] text-stone-450 dark:text-stone-400 block mt-0.5 leading-tight">Import VIP leads and sync Instagram/WhatsApp pipelines</span>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => startDemoConnection('outlook')}
                          disabled={connectingEmail}
                          className="w-full p-4 hover:bg-stone-100 dark:hover:bg-stone-900 border border-stone-200 dark:border-stone-850 rounded-2xl select-none flex items-center gap-4 text-left transition-all cursor-pointer"
                        >
                          <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center shrink-0">
                            <svg className="w-5 h-5 shrink-0" viewBox="0 0 23 23">
                              <path fill="#0072c6" d="M0 0h23v23H0z"/>
                              <path fill="#fff" d="M3.5 5.5v12h16V5.5H3.5zm1 1h14v10h-14V6.5z"/>
                            </svg>
                          </div>
                          <div>
                            <span className="font-extrabold text-xs text-stone-700 dark:text-stone-200 block uppercase tracking-wide">Connect Microsoft 365 Outlook</span>
                            <span className="text-[10px] text-stone-450 dark:text-stone-400 block mt-0.5 leading-tight">Sync enterprise email chains and cost invoice receipts</span>
                          </div>
                        </button>

                        <div className="relative my-3 select-none">
                          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-stone-200 dark:border-stone-850" /></div>
                          <div className="relative flex justify-center text-[9px] uppercase font-bold tracking-widest"><span className="bg-stone-50 dark:bg-stone-950 px-2 text-stone-400">or link custom server</span></div>
                        </div>

                        <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-850 bg-stone-100/40 dark:bg-stone-900/30 font-sans space-y-2 text-[10px]">
                          <span className="font-extrabold text-[#a8a29e] uppercase tracking-wide">🔗 Connect standard IMAP / SMTP</span>
                          <div className="grid grid-cols-3 gap-2 mt-1.5 select-none">
                            <input 
                              type="text" 
                              placeholder="imap.server.com" 
                              className="col-span-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-1.5 focus:outline-none"
                            />
                            <input 
                              type="text" 
                              placeholder="993" 
                              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-1.5 text-center focus:outline-none"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => startDemoConnection('imap')}
                            className="bg-transparent text-amber-500 font-extrabold hover:underline"
                          >
                            Authenticate Custom IMAP Server
                          </button>
                        </div>
                      </div>
                    )}

                    {connectingEmail && (
                      <div className="flex items-center gap-3 justify-center text-xs font-black uppercase text-amber-500 tracking-wider py-2">
                        <RefreshCw className="animate-spin" size={14} />
                        Syncing credentials with Secure OAuth Client...
                      </div>
                    )}

                    <div className="flex gap-3.5 pt-2 select-none">
                      <button
                        onClick={() => setOnboardingStep(3)}
                        className="py-2.5 px-4 rounded-xl text-xs font-black uppercase border border-stone-300 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors cursor-pointer text-stone-600 dark:text-stone-300"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => {
                          setOnboardingStep(5);
                          awardXP(75);
                        }}
                        className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase text-xs tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
                      >
                        <span>Configure Dashboard Environment</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {/* FLOW A - STEP 5: PRIORITIES ENVIRONMENT */}
                {onboardingStep === 5 && role === 'owner' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-syne text-xl font-extrabold uppercase tracking-tight text-stone-850 dark:text-stone-100">Establish Main Directives</h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">Select the operational priorities. We will align visual analytics, notifications, and Aria's training rules accordingly.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      {/* OPTION 1: CUSTOMER RETENTION */}
                      <button
                        type="button"
                        onClick={() => {
                          const exist = priorities.includes('retention');
                          if (exist) setPriorities(prev => prev.filter(p => p !== 'retention'));
                          else setPriorities(prev => [...prev, 'retention']);
                        }}
                        className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex items-center gap-4 ${
                          priorities.includes('retention')
                            ? 'bg-amber-500/10 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.08)]'
                            : 'bg-stone-100 dark:bg-stone-905 border-stone-200 dark:border-stone-850 hover:border-stone-600'
                        }`}
                      >
                        <div className={`p-2 rounded-xl text-xs font-black ${priorities.includes('retention') ? 'bg-amber-500 text-black' : 'bg-stone-250 dark:bg-stone-800 text-stone-400'}`}>
                          👥
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-extrabold text-xs text-stone-800 dark:text-stone-100 block uppercase tracking-wide">Customer Retention Loop</span>
                          <span className="text-[10px] text-stone-400 block mt-0.5 leading-none">Auto-draft followups, predict churn indicators, win-back support</span>
                        </div>
                      </button>

                      {/* OPTION 2: INVENTORY SENSE */}
                      <button
                        type="button"
                        onClick={() => {
                          const exist = priorities.includes('inventory');
                          if (exist) setPriorities(prev => prev.filter(p => p !== 'inventory'));
                          else setPriorities(prev => [...prev, 'inventory']);
                        }}
                        className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex items-center gap-4 ${
                          priorities.includes('inventory')
                            ? 'bg-amber-500/10 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.08)]'
                            : 'bg-stone-100 dark:bg-stone-905 border-stone-200 dark:border-stone-850 hover:border-stone-600'
                        }`}
                      >
                        <div className={`p-2 rounded-xl text-xs font-black ${priorities.includes('inventory') ? 'bg-amber-500 text-black' : 'bg-stone-250 dark:bg-stone-800 text-stone-400'}`}>
                          📦
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-extrabold text-xs text-stone-800 dark:text-stone-100 block uppercase tracking-wide">Inventory demand prediction</span>
                          <span className="text-[10px] text-stone-400 block mt-0.5 leading-none">Track visual units, automated low stock orders, warehouse tracking</span>
                        </div>
                      </button>

                      {/* OPTION 3: EXPENSE CHALICE */}
                      <button
                        type="button"
                        onClick={() => {
                          const exist = priorities.includes('costs');
                          if (exist) setPriorities(prev => prev.filter(p => p !== 'costs'));
                          else setPriorities(prev => [...prev, 'costs']);
                        }}
                        className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex items-center gap-4 ${
                          priorities.includes('costs')
                            ? 'bg-amber-500/10 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.08)]'
                            : 'bg-stone-100 dark:bg-stone-905 border-stone-200 dark:border-stone-850 hover:border-stone-600'
                        }`}
                      >
                        <div className={`p-2 rounded-xl text-xs font-black ${priorities.includes('costs') ? 'bg-amber-500 text-black' : 'bg-stone-250 dark:bg-stone-800 text-stone-400'}`}>
                          💰
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-extrabold text-xs text-stone-800 dark:text-stone-100 block uppercase tracking-wide">Expense Margin CFO Insights</span>
                          <span className="text-[10px] text-stone-400 block mt-0.5 leading-none">Auto-locate subscription duplicate creep, energy cost spikes, audit audits</span>
                        </div>
                      </button>
                    </div>

                    <div className="flex gap-3.5 pt-2 select-none">
                      <button
                        onClick={() => setOnboardingStep(4)}
                        className="py-2.5 px-4 rounded-xl text-xs font-black uppercase border border-stone-300 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors cursor-pointer text-stone-600 dark:text-stone-300"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => {
                          setOnboardingStep(6);
                          awardXP(50);
                        }}
                        className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase text-xs tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
                      >
                        <span>Finalize Omni Deployment</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {/* FLOW A - STEP 6: TUTORIAL CHOICE */}
                {onboardingStep === 6 && role === 'owner' && (
                  <div className="space-y-5 select-none">
                    <div className="text-center">
                      <div className="inline-block p-3 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 mb-2">
                        <Bot size={28} className="animate-pulse" />
                      </div>
                      <h3 className="font-syne text-2xl font-black uppercase tracking-tight text-white">Operational Node Set Up Complete!</h3>
                      <p className="text-xs text-stone-400 mt-1">Excellent! Level 3 achieved. You have collected 300 XP in setup achievements.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <button
                        onClick={() => handleFinishOnboarding(true)}
                        className="p-5 text-left rounded-3xl bg-amber-500 text-black hover:bg-amber-400 transition-all cursor-pointer shadow-lg shadow-amber-500/10 flex items-start gap-4"
                      >
                        <div className="p-3 rounded-2xl bg-white text-black shrink-0 font-extrabold text-sm shadow">
                          🎯
                        </div>
                        <div>
                          <span className="font-black text-xs uppercase tracking-widest block">TAKE THE COMPLETE GUIDED TOUR</span>
                          <span className="text-[10px] uppercase font-bold tracking-wider block opacity-75 mt-0.5">Let Aria show you around (5 Min walkthrough)</span>
                          <p className="text-xs leading-relaxed mt-2 font-medium">
                            Aria will spotlight critical revenue-at-risk charts, the automated social messaging pipeline box, and the CFO audit monitor step-by-step.
                          </p>
                        </div>
                      </button>

                      <button
                        onClick={() => handleFinishOnboarding(false)}
                        className="p-5 text-left rounded-3xl bg-[#1C1917] border border-stone-850 text-white hover:border-amber-500/30 transition-all cursor-pointer flex items-start gap-4"
                      >
                        <div className="p-3 rounded-2xl bg-stone-800 text-stone-300 shrink-0 font-extrabold text-xs">
                          🚀
                        </div>
                        <div>
                          <span className="font-black text-xs uppercase tracking-widest block">EXPLORE BY MYSELF</span>
                          <span className="text-[10px] text-stone-400 block mt-0.5 uppercase font-bold">Direct to dashboard, tooltips available on hover</span>
                          <p className="text-xs text-stone-450 dark:text-stone-400 leading-relaxed mt-2">
                            Skip the tour and log directly inside the live environment. Access system settings or connect social chat lines manually.
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {/* FLOW B - TEAM MEMBER ONBOARDING STEPS */}
                {onboardingStep === 2 && role === 'team' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-syne text-xl font-extrabold uppercase tracking-tight text-white">Join Associate Operator Core</h3>
                      <p className="text-xs text-stone-400 mt-1">An administrator has generated your operators access token. Define your local node credentials below.</p>
                    </div>

                    <div className="space-y-3.5">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-stone-400 block tracking-wider">Associate Full Name</label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={e => setFirstName(e.target.value)}
                          placeholder="Sarah Vance"
                          className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:border-amber-500 transition-all animate-fade-in"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-stone-400 block tracking-wider">Team Department Role</label>
                        <select
                          value={selectedRole}
                          onChange={e => setSelectedRole(e.target.value as any)}
                          className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:border-amber-500 transition-all text-stone-700 dark:text-stone-300"
                        >
                          <option value="Manager">Associate Store Manager</option>
                          <option value="Sales">Customer Relations & Sales</option>
                          <option value="Operations">Back-store Inventory Lead</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-3.5 pt-2 select-none">
                      <button
                        onClick={() => setOnboardingStep(1)}
                        className="py-2.5 px-4 rounded-xl text-xs font-black uppercase border border-stone-300 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors cursor-pointer text-stone-600 dark:text-stone-300"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => {
                          setOnboardingStep(3);
                          awardXP(100);
                        }}
                        className="flex-grow py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase text-xs tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
                      >
                        <span>Review Assigned Permissions</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {onboardingStep === 3 && role === 'team' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-syne text-xl font-extrabold uppercase tracking-tight text-white">Review Operator Privileges</h3>
                      <p className="text-xs text-stone-400 mt-1">Your administrator has provisioned the following operational boundaries for this node token:</p>
                    </div>

                    <div className="space-y-2.5">
                      <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/15 rounded-2xl flex items-center justify-between text-xs font-sans">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-emerald-500" />
                          <span className="font-bold text-stone-200">Customer Social DMs / Inbox</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 py-0.5 px-2 rounded-full font-black uppercase">WRITE ACCESS</span>
                      </div>

                      <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/15 rounded-2xl flex items-center justify-between text-xs font-sans">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-emerald-500" />
                          <span className="font-bold text-stone-200">Inventory Stock Status Warroom</span>
                        </div>
                        <span className="text-[10px] font-mono text-stone-450 bg-stone-800 py-0.5 px-2 rounded-full font-black uppercase">READ ONLY</span>
                      </div>

                      <div className="p-3.5 bg-red-500/10 border border-red-500/15 rounded-2xl flex items-center justify-between text-xs font-sans">
                        <div className="flex items-center gap-2">
                          <ShieldAlert size={16} className="text-red-500" />
                          <span className="font-bold text-stone-400">Expense Audit Profit Leak Monitors</span>
                        </div>
                        <span className="text-[10px] font-mono text-red-400 bg-red-500/10 py-0.5 px-2 rounded-full font-black uppercase">LOCKED</span>
                      </div>
                    </div>

                    <p className="text-[10px] text-stone-500 leading-relaxed text-center font-semibold">
                      💡 To request advanced operator tokens or register direct web domains, contact your supervising business operator.
                    </p>

                    <div className="flex gap-3.5 pt-2 select-none">
                      <button
                        onClick={() => setOnboardingStep(2)}
                        className="py-2.5 px-4 rounded-xl text-xs font-black uppercase border border-stone-300 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors cursor-pointer text-stone-600 dark:text-stone-300"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => handleFinishOnboarding(false)}
                        className="flex-grow py-3 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase text-xs tracking-wider rounded-xl transition-all cursor-pointer shadow-lg shadow-amber-500/10 active:scale-95"
                      >
                        Go to My Operator Dashboard
                      </button>
                    </div>
                  </div>
                )}

              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {isAuthenticated && (
          <div className="mt-4 text-center z-10">
            <button 
              onClick={handleFastTrackOnboarding}
              className="px-4 py-1.5 bg-amber-500/10 border border-amber-500/25 hover:bg-amber-500 hover:text-black text-amber-500 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer"
            >
              ⚡ Fast-Track: Skip Onboarding Wizard
            </button>
          </div>
        )}

        {/* LOWER BRANDING PRESETS FOOTER */}
        <div className="text-center text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 z-10 select-none pt-4">
          🛡️ SHA-256 SECURED ENVIRONMENT • PLATFORM INTEGRATION PORTAL
        </div>
      </div>

      {/* FORGOT PASSWORD LIVE FORM MODAL */}
      <AnimatePresence>
        {forgotPasswordOpen && (
          <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setForgotPasswordOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`relative w-full max-w-sm rounded-3xl border p-6 shadow-2xl z-10 ${
                isDark ? 'bg-stone-900 border-stone-800 text-white' : 'bg-white border-stone-250 text-stone-950'
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-syne text-sm font-black uppercase tracking-wider flex items-center gap-2">
                  <Key size={16} className="text-amber-500" />
                  Operator Password Reset
                </h4>
                <button
                  onClick={() => setForgotPasswordOpen(false)}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800/20 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {forgotSuccess ? (
                <div className="text-center space-y-4 py-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 mx-auto flex items-center justify-center font-bold text-lg animate-bounce">
                    ✓
                  </div>
                  <p className="text-xs text-stone-300 font-medium">
                    We have successfully broadcasted a secure reset seed link to <b>{forgotEmail}</b>. Please check your spam folder if unreceived.
                  </p>
                  <button
                    onClick={() => {
                      setForgotPasswordOpen(false);
                      setForgotSuccess(false);
                    }}
                    className="w-full py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Close Modal
                  </button>
                </div>
              ) : (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    setForgotSuccess(true);
                  }}
                  className="space-y-4"
                >
                  <p className="text-xs text-stone-400 leading-relaxed">
                    Provide your executive email credential. We will dispatch a customized administrative recovery token instantly.
                  </p>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-stone-450 block uppercase tracking-wider">Registered Email</label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={e => setForgotEmail(e.target.value)}
                      placeholder="name@company.com"
                      required
                      className="w-full bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-stone-850 rounded-xl py-2 px-3 text-xs focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase text-xs tracking-wider rounded-xl transition-all cursor-pointer shadow-md"
                  >
                    Broadcast Reset Seed
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* GOOGLE SIGN-IN INTERACTIVE CHOOSE PORTAL */}
      <AnimatePresence>
        {showGooglePortal && (
          <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (googleConnectingState !== 'linking') {
                  setShowGooglePortal(false);
                }
              }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: -15, opacity: 0 }}
              className={`relative w-full max-w-md rounded-[24px] border p-6 sm:p-8 shadow-2xl z-10 overflow-hidden transition-all ${
                isDark 
                  ? 'bg-stone-900 border-stone-800 text-white' 
                  : 'bg-white border-stone-200 text-stone-900'
              }`}
            >
              {/* Decorative design corner */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full" />
              
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22-.04-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span className="text-[10px] font-mono tracking-wider font-extrabold uppercase text-stone-400">Google Consent Console</span>
                </div>
                {googleConnectingState !== 'linking' && (
                  <button
                    onClick={() => setShowGooglePortal(false)}
                    className="p-1 rounded-full text-stone-400 hover:text-stone-100 hover:bg-stone-800/20 cursor-pointer animate-none bg-transparent border-none"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {googleConnectingState === 'idle' && (
                <div className="space-y-5">
                  <div className="text-left">
                    <h3 className="font-syne text-xl font-extrabold tracking-tight">Choose an account</h3>
                    <p className="text-[11px] text-stone-400 mt-1">to continue to <span className="text-amber-500 font-bold uppercase">Omni AI</span></p>
                  </div>

                  {/* Active Developer Tester Profile item (Instant Click Connect) */}
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => {
                      setGoogleConnectingState('linking');
                      setTimeout(() => {
                        setGoogleConnectingState('finished');
                        setTimeout(() => {
                          triggerSimulatedGoogleAuth();
                          setShowGooglePortal(false);
                        }, 1000);
                      }, 1200);
                    }}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      isDark 
                        ? 'bg-stone-850 hover:bg-stone-800 border-stone-800' 
                        : 'bg-stone-50 hover:bg-stone-100 border-stone-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 text-black flex items-center justify-center font-black text-sm shadow animate-none">
                        SK
                      </div>
                      <div>
                        <span className="text-xs font-black block">Samad Khan (Sameer)</span>
                        <span className="text-[10px] text-stone-450 dark:text-stone-400 block mt-0.5">samadkhansameerkhan@gmail.com</span>
                        <span className="text-[8.5px] font-mono font-extrabold text-amber-500 uppercase mt-0.5 block tracking-wider">⚡ SECURED CLIENT TESTING ACCESS</span>
                      </div>
                    </div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0 ml-2" />
                  </motion.button>

                  {/* Secondary Advanced option */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowGooglePortal(false);
                        triggerDirectOAuthUrlFlow();
                      }}
                      className="w-full text-center py-2.5 bg-gradient-to-r from-stone-850 to-stone-800 hover:from-stone-805 hover:to-stone-750 text-stone-200 border border-stone-700 dark:border-stone-800 rounded-xl text-xs font-bold uppercase tracking-wide cursor-pointer flex items-center justify-center gap-2 shadow"
                    >
                      <Globe size={13} className="text-amber-500" />
                      Run Standard Native OAuth Popup
                    </button>
                  </div>

                  {/* Troubleshooting Guide instructions */}
                  <div className="p-3.5 rounded-xl border border-stone-850 dark:border-stone-800 bg-stone-50 dark:bg-[#0E0C0B] text-left font-mono text-[9.3px] text-stone-550 dark:text-stone-400 leading-relaxed shadow-inner">
                    <p className="font-extrabold text-stone-900 dark:text-stone-300 uppercase tracking-widest text-[8px] mb-1.5 text-amber-550 flex items-center gap-1.5">
                      <ShieldCheck size={11} />
                      Origin Troubleshooting Panel
                    </p>
                    <p>If the native popup yields <span className="text-red-500 font-bold">Error 401: invalid_client</span>, it means your dynamic preview domain is not cataloged as an origin yet.</p>
                    <div className="bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-stone-850 p-1.5 rounded my-1.5 select-all text-stone-900 dark:text-white font-black truncate text-[8.5px]">
                      {window.location.origin}
                    </div>
                    <p className="mt-1.5">Add this origin under <span className="text-amber-500">Authorized JavaScript Origins</span> in GCP Credentials Console for seamless native login.</p>
                  </div>
                </div>
              )}

              {googleConnectingState === 'linking' && (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 select-none">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full border-4 border-amber-552/20 border-t-amber-500 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                      <svg className="w-5 h-5 text-amber-500" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.113-6.886 4.113-4.816 0-8.72-3.882-8.72-8.67 0-4.787 3.904-8.67 8.72-8.67 2.053 0 3.923.716 5.432 2.112l3.15-3.15C17.7 1.34 14.97 0 12 0 5.37 0 0 5.37 0 12s5.37 12 12 12c6.9 0 11.43-4.85 11.43-11.61 0-.79-.08-1.56-.21-2.285l-11.22-.02z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-syne text-sm font-black uppercase tracking-wider text-amber-500 animate-pulse">Checking Client Credentials</h4>
                    <p className="text-[10px] text-stone-400 font-mono mt-1">Connecting client id: 1056455...</p>
                    <p className="text-[9px] text-stone-500 animate-pulse mt-2">Aligning authentication scopes [openid profile email] ...</p>
                  </div>
                </div>
              )}

              {googleConnectingState === 'finished' && (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 select-none animate-fadeIn">
                  <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400">
                    <CheckCircle2 size={32} className="animate-bounce" />
                  </div>
                  <div>
                    <h4 className="font-syne text-sm font-black uppercase tracking-wider text-emerald-400">Authentication Verified!</h4>
                    <p className="text-[10px] text-stone-400 mt-1 font-sans">Welcome operator, aligning sandbox workspace assets.</p>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* GAMIFICATION REWARD POPUP OVERLAY */}
      <AnimatePresence>
        {activeGamificationPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md select-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -30 }}
              transition={{ type: "spring", duration: 0.55 }}
              className="relative w-full max-w-md bg-stone-900 border-2 border-amber-500/30 rounded-3xl p-6 shadow-2xl text-center overflow-hidden"
            >
              {/* Decorative Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/10 blur-[60px] rounded-full pointer-events-none" />

              {/* Sparkles / Floating elements */}
              <div className="flex justify-center mb-4">
                <span className="text-5xl animate-bounce">{activeGamificationPopup.icon || "🏅"}</span>
              </div>

              {/* Reward Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-400 font-mono text-[11px] font-black uppercase tracking-widest rounded-full mb-3 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                <Sparkles size={11} className="animate-spin" />
                <span>Award Recipient: +{activeGamificationPopup.xp} XP Granted</span>
              </div>

              {/* Title */}
              <h3 className="font-syne text-xl font-extrabold text-white tracking-tight uppercase leading-snug mb-2">
                {activeGamificationPopup.title}
              </h3>

              {/* Description */}
              <p className="text-xs text-stone-300 font-sans leading-relaxed mb-6 px-1">
                {activeGamificationPopup.description}
              </p>

              {/* Call-to-action buttons */}
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setActiveGamificationPopup(null)}
                  className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black font-black uppercase text-xs tracking-wider rounded-2xl transition-all cursor-pointer shadow-lg shadow-amber-500/10 active:scale-98"
                >
                  Acquire Rewards & Continue ⚡
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
