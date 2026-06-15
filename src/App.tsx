/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  TrendingUp, 
  ShieldAlert, 
  PackageSearch,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  BarChart3,
  Users,
  LineChart,
  MessageSquare,
  Clock,
  Zap,
  Check,
  Building,
  Menu,
  X,
  Plus,
  HelpCircle,
  LayoutDashboard,
  Coins,
  User,
  Mail,
  Phone,
  Moon,
  Sun,
  ShieldCheck,
  CreditCard,
  Sliders,
  Sparkle,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  Activity,
  FileText,
  Share2,
  Cpu,
  LogOut
} from 'lucide-react';

import { Customer, ProfitLeak, Product } from './types';
import Dashboard from './components/Dashboard';
import RetentionHub from './components/RetentionHub';
import CostMonitor from './components/CostMonitor';
import InventoryHub from './components/InventoryHub';
import AriaManager from './components/AriaManager';
import FloatingChatbot from './components/FloatingChatbot';
import CookieBanner from './components/CookieBanner';
import { translations, Language } from './translations';
import { 
  getCollectionData, 
  writeDocumentData, 
  deleteDocumentData, 
} from './lib/firebase';

// Modern CRM, Social Messenger, Notion Notes, and Group Community hubs
import ContactsHub from './components/ContactsHub';
import SocialHub from './components/SocialHub';
import AdvancedNotes from './components/AdvancedNotes';
import CommunityHub from './components/CommunityHub';

// New HubSpot-level features imports
import AuthAndOnboarding from './components/AuthAndOnboarding';
import WorkflowBuilder from './components/WorkflowBuilder';
import CommandPalette from './components/CommandPalette';
import ActivityFeedSidebar from './components/ActivityFeedSidebar';
import QuickActionButton from './components/QuickActionButton';
import ShortcutsModal from './components/ShortcutsModal';
import TelephonyDialer from './components/TelephonyDialer';
import HelpCenterPanel from './components/HelpCenterPanel';
import ProblemFeatureMatrix from './components/ProblemFeatureMatrix';
import AriaFloatingCompanion from './components/AriaFloatingCompanion';
import ForgeLogo from './components/ForgeLogo';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function App() {
  // Navigation tabs
  const [currentTab, setCurrentTab] = useState<'landing' | 'dashboard' | 'retainflow' | 'costguard' | 'stocksense' | 'aria' | 'workflows' | 'pricing' | 'settings' | 'contacts' | 'social_omni' | 'notepad' | 'community'>('dashboard');

  // Multi-Account Suite & Trial tracking
  const [trialDaysLeft, setTrialDaysLeft] = useState<number>(12);
  const [trialType, setTrialType] = useState<'14' | '3' | 'none'>('14'); // trial selector type
  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false);
  const [accounts, setAccounts] = useState<string[]>(['Main Sameer Enterprises', 'Alternative LED Outlet']);
  const [activeAccount, setActiveAccount] = useState('Main Sameer Enterprises');
  
  // Professional Personae status
  const [ownerTitle, setOwnerTitle] = useState('Principal operations Director');
  const [isOnline, setIsOnline] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Interactive modal/panel controls
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [activityFeedOpen, setActivityFeedOpen] = useState(false);
  const [telephonyOpen, setTelephonyOpen] = useState(false);
  const [helpCenterOpen, setHelpCenterOpen] = useState(false);

  // Notifications state
  const [unreadNotifications, setUnreadNotifications] = useState<string[]>([
    "🤖 Aria answered customer Jessica Vance (+5 XP)",
    "📦 Low stock warning: Premium wireless adapters are below 5 units",
    "💼 Margin audit: Cost creep detected on courier fuel updates"
  ]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Sidebar responsiveness state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Multilingual State and Translation load
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('omni_language');
      if (saved && (saved === 'en' || saved === 'es' || saved === 'fr' || saved === 'de' || saved === 'ja')) {
        return saved as Language;
      }
    } catch (e) {}
    return 'en';
  });

  const t = translations[language];

  // Contact list state
  const [syncedContacts, setSyncedContacts] = useState(() => {
    try {
      const saved = localStorage.getItem('omni_synced_contacts');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      { name: "John Doe", phone: "+1 555-0192", email: "john@example.com", tag: "VIP Customer" },
      { name: "Maria Garcia", phone: "+34 612 345 678", email: "maria@salestrip.es", tag: "High spender" },
      { name: "Hans Müller", phone: "+49 170 1234567", email: "hans.m@techcorp.de", tag: "Wholesale Partner" }
    ];
  });

  // Contact inputs
  const [contName, setContName] = useState('');
  const [contPhone, setContPhone] = useState('');
  const [contEmail, setContEmail] = useState('');
  const [contTag, setContTag] = useState('VIP Candidate');
  const [bulkText, setBulkText] = useState('');
  const [isSyncingContacts, setIsSyncingContacts] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);

  // Expanded interactive settings states
  const [dailyBudget, setDailyBudget] = useState(50);
  const [voiceActor, setVoiceActor] = useState("Aria Premium Female");
  const [backupSchedule, setBackupSchedule] = useState("Weekly");
  const [isCostLimitActive, setIsCostLimitActive] = useState(true);

  // Welcome popup state
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(false);
  const [activeTourStep, setActiveTourStep] = useState<number | null>(null);

  React.useEffect(() => {
    if (activeTourStep === 0) {
      setCurrentTab('dashboard');
    } else if (activeTourStep === 1) {
      setCurrentTab('aria');
    } else if (activeTourStep === 2) {
      setCurrentTab('stocksense');
    } else if (activeTourStep === 3) {
      setCurrentTab('settings');
    }
  }, [activeTourStep]);

  // User Onboarding State
  const [onboarded, setOnboarded] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('omni_onboarded');
      if (saved) return saved === 'true';
    } catch (e) {}
    return false; // Default to showing welcoming onboarding setup wizard
  });

  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('omni_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      storeName: 'Local Grind Coffee',
      ownerName: 'Liam Miller',
      email: 'owner@localgrind.com',
      phone: '+44 7700 900077',
      tier: 'Growth Suite',
      userRole: 'owner', // 'owner' | 'customer'
      avatarName: 'Aria Core',
      avatarStyle: 'Hologram Core',
      avatarBorder: '#F59E0B'
    };
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('omni_theme');
      if (saved) return saved as 'light' | 'dark';
    } catch (e) {}
    return 'dark'; // We default to dark theme for that elite premium visual branding
  });

  const isDark = theme === 'dark';

  const [isAnnualBilling, setIsAnnualBilling] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Team Roles System local persistence state
  const [teamMembers, setTeamMembers] = useState<Array<{ id: string; name: string; email: string; role: 'Owner' | 'Manager' | 'Staff'; joinedDate: string }>>([
    { id: '1', name: 'Sarah Lin', email: 'owner@linboutique.com', role: 'Owner', joinedDate: '2026-01-10' },
    { id: '2', name: 'Marcus Brody', email: 'marcus@linboutique.com', role: 'Manager', joinedDate: '2026-03-15' },
    { id: '3', name: 'Leah Vance', email: 'leah@linboutique.com', role: 'Staff', joinedDate: '2026-05-01' }
  ]);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<'Owner' | 'Manager' | 'Staff'>('Staff');

  // Profile Edit modal
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<1 | 2 | 3>(1);

  // Temporary edit states
  const [editStore, setEditStore] = useState(profile.storeName);
  const [editOwner, setEditOwner] = useState(profile.ownerName);
  const [editEmail, setEditEmail] = useState(profile.email);
  const [editPhone, setEditPhone] = useState(profile.phone);
  
  const [editDashboardName, setEditDashboardName] = useState(profile.customDashboardName || '');
  const [editRetainName, setEditRetainName] = useState(profile.customRetainName || '');
  const [editCostName, setEditCostName] = useState(profile.customCostName || '');
  const [editStockName, setEditStockName] = useState(profile.customStockName || '');
  const [editAriaName, setEditAriaName] = useState(profile.customAriaName || '');
  
  // Onboarding temporary states
  const [onbRole, setOnbRole] = useState<'owner' | 'customer'>('owner');
  const [onbEmail, setOnbEmail] = useState('');
  const [onbPassword, setOnbPassword] = useState('');
  const [onbStore, setOnbStore] = useState('Retro Apparel');
  const [onbOwner, setOnbOwner] = useState('Sarah Vance');
  const [onbPhone, setOnbPhone] = useState('+1 (555) 902-1422');
  const [onbSector, setOnbSector] = useState('Bespoke Retail');
  const [onbChannel, setOnbChannel] = useState<'WhatsApp' | 'SMS' | 'Email'>('WhatsApp');
  const [onbAvatarName, setOnbAvatarName] = useState('Aria Co-Pilot');
  const [onbAvatarStyle, setOnbAvatarStyle] = useState('Hologram Core');
  const [onbAvatarBorder, setOnbAvatarBorder] = useState('#F59E0B');

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Global Keyboard Shortcuts Event Handler registration
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid tracking keystrokes when editing any standard forms
      const activeEl = document.activeElement;
      if (activeEl && (
        activeEl.tagName === 'INPUT' || 
        activeEl.tagName === 'TEXTAREA' || 
        activeEl.tagName === 'SELECT' ||
        activeEl.getAttribute('contenteditable') === 'true'
      )) {
        return;
      }

      // Check for CMD+K or CTRL+K
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
        return;
      }

      // Help shortcuts
      if (e.key === '?') {
        e.preventDefault();
        setShortcutsOpen(prev => !prev);
        return;
      }

      // Live Theme switcher
      if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        handleToggleTheme();
        return;
      }

      // Circle localization
      if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        const locs: Language[] = ['en', 'es', 'fr', 'de', 'ja'];
        const currentIdx = locs.indexOf(language);
        const nextIdx = (currentIdx + 1) % locs.length;
        const nextLang = locs[nextIdx];
        setLanguage(nextLang);
        localStorage.setItem('omni_language', nextLang);
        showToast(`🌐 System Locale set to: ${nextLang.toUpperCase()}`);
        return;
      }

      // Escape close
      if (e.key === 'Escape') {
        e.preventDefault();
        setCommandPaletteOpen(false);
        setShortcutsOpen(false);
        setActivityFeedOpen(false);
        setTelephonyOpen(false);
        setHelpCenterOpen(false);
        setNotificationsOpen(false);
        return;
      }

      // Hotkey Sidebar Navigation Routes
      if (e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        setCurrentTab('dashboard');
        showToast("🚀 Fast Route: Dashboard.");
      }
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        setCurrentTab('retainflow');
        showToast("🔔 Fast Route: CRM Loyalty Retention Hub.");
      }
      if (e.key === 'i' || e.key === 'I') {
        e.preventDefault();
        setCurrentTab('stocksense');
        showToast("📦 Fast Route: Stock Sense Supply Genius.");
      }
      if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        setCurrentTab('costguard');
        showToast("💰 Fast Route: CFO margins Cost Guard.");
      }
      if (e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        setCurrentTab('aria');
        showToast("🤖 Fast Route: Connect ARIA AI co-pilot.");
      }
      if (e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        setCurrentTab('workflows');
        showToast("⚡ Fast Route: Automated operations canvasses.");
      }
      if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        setCurrentTab('settings');
        showToast("⚙️ Fast Route: Channel settings.");
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [language, theme]);

  // Trigger welcoming top banner whenever currentTab swaps
  React.useEffect(() => {
    if (currentTab !== 'landing') {
      setShowWelcomeBanner(true);
      const timer = setTimeout(() => {
        setShowWelcomeBanner(false);
      }, 2500);
      return () => clearTimeout(timer);
    } else {
      setShowWelcomeBanner(false);
    }
  }, [currentTab]);

  // Load data from Firestore node on startup in parallel
  React.useEffect(() => {
    async function syncFirestoreData() {
      try {
        const [cloudProfiles, cloudCustomers, cloudLeaks, cloudProducts, cloudContacts] = await Promise.all([
          getCollectionData<any>('profiles'),
          getCollectionData<Customer>('customers'),
          getCollectionData<ProfitLeak>('leaks'),
          getCollectionData<Product>('products'),
          getCollectionData<any>('contacts')
        ]);

        const activeUser = cloudProfiles?.find((p: any) => p.id === 'active_user');
        if (activeUser) {
          setProfile(activeUser);
          setEditStore(activeUser.storeName || '');
          setEditOwner(activeUser.ownerName || '');
          setEditEmail(activeUser.email || '');
          setEditPhone(activeUser.phone || '');
        } else {
          await writeDocumentData('profiles', 'active_user', profile);
        }

        if (cloudCustomers && cloudCustomers.length > 0) {
          setCustomers(cloudCustomers);
        } else {
          for (const item of customers) {
            await writeDocumentData('customers', item.id, item);
          }
        }

        if (cloudLeaks && cloudLeaks.length > 0) {
          setLeaks(cloudLeaks);
        } else {
          for (const item of leaks) {
            await writeDocumentData('leaks', item.id, item);
          }
        }

        if (cloudProducts && cloudProducts.length > 0) {
          setProducts(cloudProducts);
        } else {
          for (const item of products) {
            await writeDocumentData('products', item.id, item);
          }
        }

        if (cloudContacts && cloudContacts.length > 0) {
          setSyncedContacts(cloudContacts);
        } else {
          for (let i = 0; i < syncedContacts.length; i++) {
            await writeDocumentData('contacts', `contact_${i}`, syncedContacts[i]);
          }
        }
      } catch (e) {
        console.warn("Operating indices in cloud bypass fallback mode: ", e);
      } finally {
        setIsInitializing(false);
      }
    }
    syncFirestoreData();
  }, []);

  // Sync to database / localStorage
  React.useEffect(() => {
    localStorage.setItem('omni_profile', JSON.stringify(profile));
    localStorage.setItem('omni_onboarded', onboarded ? 'true' : 'false');
    localStorage.setItem('omni_theme', theme);
    localStorage.setItem('omni_language', language);
    localStorage.setItem('omni_synced_contacts', JSON.stringify(syncedContacts));
    
    if (!isInitializing) {
      try {
        writeDocumentData('profiles', 'active_user', profile);
      } catch (e) {}
    }
  }, [profile, onboarded, theme, language, syncedContacts, isInitializing]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
  };

  // Launch Onboarding or skip straight in
  const launchSystemSuite = () => {
    if (onboarded) {
      setCurrentTab('dashboard');
    } else {
      // Open step 1 onboarding wizard
      setOnboardingStep(1);
      setCurrentTab('dashboard'); // This kicks off workspace view inside which we render onboarding overlay
    }
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStore.trim() || !editOwner.trim()) {
      showToast("⚠️ Store Name and Owner Name cannot be empty.");
      return;
    }
    if (!editEmail.includes('@') || !editEmail.includes('.')) {
      showToast("⚠️ Please specify a valid email address.");
      return;
    }
    setProfile({
      ...profile,
      storeName: editStore,
      ownerName: editOwner,
      email: editEmail,
      phone: editPhone,
      customDashboardName: editDashboardName,
      customRetainName: editRetainName,
      customCostName: editCostName,
      customStockName: editStockName,
      customAriaName: editAriaName
    });
    setProfileModalOpen(false);
    showToast("✨ Profile database updated! Aria is training custom responses.");
  };

  const handleOnboardingComplete = (profileData: any) => {
    localStorage.setItem('omni_onboarded', 'true');
    localStorage.setItem('omni_profile', JSON.stringify(profileData));
    setProfile(profileData);
    setEditStore(profileData.storeName);
    setEditOwner(profileData.ownerName);
    setEditEmail(profileData.email);
    setEditPhone(profileData.phone);
    setOnboarded(true);
    setCurrentTab('dashboard');
    showToast(`🎉 Operational Node Deployed! Aria avatar ${profileData.avatarName} initialized. Welcome, ${profileData.ownerName}!`);
    if (profileData.tourPreferred) {
      setTimeout(() => {
        setActiveTourStep(0);
      }, 300);
    }
  };

  // Static templates for quick start loading
  const STARTER_CUSTOMERS: Customer[] = [
    { id: '1', name: 'James Chen', avatar: 'JC', healthScore: 20, daysSilent: 14, riskLevel: 'HIGH', revenue: 1200, nextBestAction: 'Send discount code — 15% off', status: 'pending', sentiment: 'negative' },
    { id: '2', name: 'Sarah Miller', avatar: 'SM', healthScore: 45, daysSilent: 8, riskLevel: 'HIGH', revenue: 800, nextBestAction: 'Resolve outstanding courier support ticket #847', status: 'pending', sentiment: 'negative' },
    { id: '3', name: 'Local Grind Coffee', avatar: 'LG', healthScore: 85, daysSilent: 5, riskLevel: 'MEDIUM', revenue: 340, nextBestAction: 'Send wholesale client survey check-in', status: 'pending', sentiment: 'neutral' },
    { id: '4', name: 'Jessica Vance', avatar: 'JV', healthScore: 92, daysSilent: 2, riskLevel: 'LOW', revenue: 640, nextBestAction: 'Auto tracking normal parameters', status: 'pending', sentiment: 'positive' }
  ];

  const STARTER_LEAKS: ProfitLeak[] = [
    { id: 'l1', category: 'Supplier Cost Creep', amount: 1200, description: 'Courier partner fuel price updates without bulk contract protection', resolved: false },
    { id: 'l2', category: 'Waste Software Licenses', amount: 340, description: 'Duplicate active logins and unused seat licenses within ERP logs', resolved: false }
  ];

  const STARTER_PRODUCTS: Product[] = [
    { id: 'p1', name: 'Premium Smart Accessory Kit', stock: 15, threshold: 40, stockoutDays: 11, ltvImpact: 18000, decision: 'Reorder 200 units immediately', cashImpact: 'warning', lifecycle: 'growing' },
    { id: 'p2', name: 'Wired audio adapters link', stock: 320, threshold: 50, stockoutDays: 90, ltvImpact: 2100, decision: 'Slow rotation. Suggest custom headphone bundling discount.', cashImpact: 'safe', lifecycle: 'declining' },
    { id: 'p3', name: 'Silicone accessory cases', stock: 45, threshold: 30, stockoutDays: 24, ltvImpact: 7200, decision: 'Order 300 units on next Tuesday', cashImpact: 'safe', lifecycle: 'stable' }
  ];

  // Global Interactive Mock Datasets running the app features reactively (EMPTY BY DEFAULT)
  const [isSimulatingLive, setIsSimulatingLive] = useState<boolean>(() => {
    return localStorage.getItem('omni_dashboard_simulating') === 'true';
  });

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [leaks, setLeaks] = useState<ProfitLeak[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // Automatically sync datasets when `isSimulatingLive` changes
  React.useEffect(() => {
    if (isSimulatingLive) {
      setCustomers(STARTER_CUSTOMERS);
      setLeaks(STARTER_LEAKS);
      setProducts(STARTER_PRODUCTS);
    } else {
      setCustomers([]);
      setLeaks([]);
      setProducts([]);
    }
  }, [isSimulatingLive]);

  // Aria Personalization States (load from localStorage if available)
  const [ariaName, setAriaName] = useState(() => localStorage.getItem('omni_aria_name') || 'Aria AI');
  const [ariaTone, setAriaTone] = useState(() => localStorage.getItem('omni_aria_tone') || 'Helpful & Professional');
  const [ariaAvatar, setAriaAvatar] = useState(() => localStorage.getItem('omni_aria_avatar') || '🤖');

  // Sync effect for Aria configurations
  React.useEffect(() => {
    localStorage.setItem('omni_aria_name', ariaName);
    localStorage.setItem('omni_aria_tone', ariaTone);
    localStorage.setItem('omni_aria_avatar', ariaAvatar);
  }, [ariaName, ariaTone, ariaAvatar]);

  // Method to seed starter data for demo ease
  const seedStarterData = () => {
    setCustomers(STARTER_CUSTOMERS);
    setLeaks(STARTER_LEAKS);
    setProducts(STARTER_PRODUCTS);
    showToast("⚡ Fully Populated: Template core operational datasets initialized!");
  };

  // Landing Page Parts
  const Navbar = () => (
    <nav className={`fixed w-full top-0 left-0 z-50 border-b backdrop-blur-md transition-all duration-300 ${
      isDark ? 'bg-[#151311]/95 border-stone-850 text-white' : 'bg-[#F5F5F4]/95 border-stone-250 text-[#1C1917]'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setCurrentTab('landing')}>
          <div className="w-8 h-8 rounded-xl bg-[#110F0E] border border-stone-850 flex items-center justify-center text-black font-black shadow-lg shadow-amber-500/5">
            <ForgeLogo size={24} />
          </div>
          <span className={`font-extrabold text-xl tracking-tight ${isDark ? 'text-white' : 'text-[#1C1917]'}`}>{t.brandLogo}</span>
        </div>
        <div className={`hidden md:flex items-center gap-8 text-xs font-black uppercase tracking-wider ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
          <a href="#features" className={`transition-colors ${isDark ? 'hover:text-amber-400' : 'hover:text-[#1C1917]'}`}>{t.capEngines}</a>
          <a href="#aria" className={`transition-colors ${isDark ? 'hover:text-amber-400' : 'hover:text-[#1C1917]'}`}>{t.meetAria}</a>
          <a href="#comparison" className={`transition-colors ${isDark ? 'hover:text-amber-400' : 'hover:text-[#1C1917]'}`}>{t.enterpriseSpecs}</a>
          <button onClick={launchSystemSuite} className="text-amber-500 font-bold hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer">
            {t.sandboxMode} <Sparkle size={14} />
          </button>
        </div>
        <div className="flex items-center gap-3">
          {/* Quick theme toggler in landing navbar */}
          <button 
            type="button"
            onClick={handleToggleTheme}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isDark ? 'bg-[#292524] border-stone-800 text-amber-500 hover:bg-neutral-800' : 'bg-white border-stone-250 text-stone-600 hover:bg-stone-100'
            }`}
            title="Toggle Theme Mode"
          >
            {isDark ? <Sun size={12} /> : <Moon size={12} />}
          </button>

          <select 
            value={language}
            onChange={(e) => {
              const langSelected = e.target.value as Language;
              setLanguage(langSelected);
              showToast(`🌐 System Language set to: ${langSelected.toUpperCase()}`);
            }}
            className={`text-[10px] font-black uppercase tracking-wider border py-1.5 px-2 rounded-xl focus:outline-none cursor-pointer font-sans transition-all ${
              isDark ? 'bg-[#1C1917] border-stone-800 text-white hover:border-stone-750' : 'bg-white border-stone-250 text-[#1C1917] hover:border-stone-400'
            }`}
          >
            <option value="en">English (EN)</option>
            <option value="es">Español (ES)</option>
            <option value="fr">Français (FR)</option>
            <option value="de">Deutsch (DE)</option>
            <option value="ja">日本語 (JA)</option>
          </select>

          <button onClick={launchSystemSuite} className={`px-4 py-2 rounded-full text-[10px] font-black tracking-widest uppercase transition-all hover:shadow-lg active:scale-95 ${
            isDark ? 'bg-amber-500 hover:bg-amber-450 text-black' : 'bg-[#1C1917] text-[#FEF9EF] hover:bg-black'
          }`}>
            {t.launchConsole}
          </button>
        </div>
      </div>
    </nav>
  );

  const Hero = () => (
    <section className={`pt-36 pb-20 px-6 relative overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-[#151311]' : 'bg-[#F5F5F4]'
    }`}>
      <div className="absolute top-0 left-1 center h-[500px] w-full max-w-[800px] bg-amber-400/20 rounded-full blur-[140px] pointer-events-none -translate-y-20 -z-10"></div>
      <motion.div 
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="max-w-4xl mx-auto text-center"
      >
        <motion.div variants={fadeIn} className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-amber-600 text-[10px] font-extrabold uppercase tracking-widest shadow-sm mx-auto mb-8 transition-colors ${
          isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-250'
        }`}>
          <Sparkle size={14} className="animate-spin" style={{ animationDuration: '6s' }} />
          <span>{t.heroBadge}</span>
        </motion.div>
        
        <motion.h1 variants={fadeIn} className={`text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.05] transition-colors ${
          isDark ? 'text-white' : 'text-[#1C1917]'
        }`}>
          {t.heroHeaderPart1}<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600">{t.heroHeaderPart2}</span>
        </motion.h1>
        
        <motion.p variants={fadeIn} className={`text-base md:text-lg mb-10 max-w-2xl mx-auto leading-relaxed transition-colors ${
          isDark ? 'text-stone-400' : 'text-stone-500'
        }`}>
          {t.heroDesc}
        </motion.p>
        
        <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={launchSystemSuite}
            className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-black px-8 py-4 rounded-full font-black text-xs tracking-widest uppercase hover:shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            {t.heroCTA1} <ArrowRight size={16} />
          </button>
          <a href="#aria"
            className={`w-full sm:w-auto border px-8 py-4 rounded-full font-black text-xs tracking-widest uppercase transition-all shadow-sm flex items-center justify-center gap-2 ${
              isDark ? 'bg-stone-900 text-white border-stone-800 hover:bg-stone-850' : 'bg-white text-[#1C1917] border-stone-200 hover:bg-stone-50'
            }`}
          >
            {t.heroCTA2}
          </a>
        </motion.div>
      </motion.div>
    </section>
  );

  const Features = () => {
    const engines = [
      {
        title: "RetainFlow Engine",
        subtitle: "VIP Retention Hub",
        desc: "Accurately predicts customer churn risk. Generates instant win-back coupons, monitors sentiment signals, and catalogs revenue trends.",
        icon: <Users className="text-blue-500" size={22} />,
        color: isDark ? "bg-blue-950/40 border-blue-900/55" : "bg-blue-50/70 border-blue-100",
        tab: "retainflow" as const
      },
      {
        title: "CostGuard CFO",
        subtitle: "Profit Leak Shield",
        desc: "Maintains absolute vendor subscription audit trail. Identifies software license creep, tracks delivery surcharges, and suggests negotiation paths.",
        icon: <TrendingUp className="text-red-500" size={22} />,
        color: isDark ? "bg-red-950/40 border-red-900/55" : "bg-red-50/70 border-red-100",
        tab: "costguard" as const
      },
      {
        title: "StockSense Tool",
        subtitle: "Autonomous Reorders",
        desc: "Provides cash-aware asset reordering sequences, tests supplier schedule delays under cash stress, and liquidates slow dead assets.",
        icon: <PackageSearch className="text-emerald-500" size={22} />,
        color: isDark ? "bg-emerald-950/40 border-emerald-900/55" : "bg-emerald-50/70 border-emerald-100",
        tab: "stocksense" as const
      }
    ];

    return (
      <section id="features" className={`py-24 px-6 border-y relative z-10 transition-colors duration-300 ${
        isDark ? 'bg-[#1C1917] border-stone-850 text-white' : 'bg-white border-stone-250 text-[#1C1917]'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-5xl font-black tracking-tight mb-4 transition-colors ${isDark ? 'text-white' : 'text-[#1C1917]'}`}>Three Engines. Complete Control.</h2>
            <p className={`text-sm max-w-2xl mx-auto transition-colors ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>Skip separate unintegrated software tools. Forge AI unites marketing loyalty, accounting monitoring, and reordering sequences natively.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {engines.map((engine, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => {
                  launchSystemSuite();
                  setTimeout(() => setCurrentTab(engine.tab), 100);
                }}
                className={`p-8 rounded-[32px] border hover:shadow-lg hover:-translate-y-1 cursor-pointer transition-all duration-300 group flex flex-col justify-between h-full ${
                  isDark ? 'bg-stone-900 border-stone-800 hover:bg-stone-850' : 'bg-white border-stone-200 hover:bg-[#FAF9F6]'
                }`}
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl ${engine.color} border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    {engine.icon}
                  </div>
                  <h3 className={`text-xl font-bold mb-1.5 transition-colors ${isDark ? 'text-white' : 'text-[#1C1917]'}`}>{engine.title}</h3>
                  <p className="text-[10px] font-black text-neutral-400 uppercase tracking-wider mb-4">{engine.subtitle}</p>
                  <p className={`leading-relaxed text-sm mb-6 transition-colors ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>{engine.desc}</p>
                </div>
                <span className="text-amber-500 font-extrabold text-[11px] uppercase tracking-wider flex items-center gap-1 mt-auto">Configure Engine <ArrowRight size={14} /></span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const AriaSection = () => (
    <section id="aria" className="py-28 px-6 overflow-hidden bg-[#12100E] text-white relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[110px] pointer-events-none"></div>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 text-amber-500 text-[10px] font-extrabold uppercase tracking-widest mb-6 border border-white/10 backdrop-blur-sm">
              <Sparkles size={14} className="text-amber-500" />
              <span>THE COGNITIVE CORE</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6 leading-tight">
              Meet ARIA.<br />
              Your Retail Assistant.
            </h2>
            <p className="text-sm text-stone-400 mb-8 leading-relaxed max-w-lg">
              Aria sits at the absolute center of your operational dashboard. She maintains live training databases and communicates with customers and operators seamlessly.
            </p>
            
            <div className="space-y-4">
              <div className="flex gap-4 items-start bg-white/5 p-5 rounded-3xl border border-white/10">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h4 className="font-extrabold text-[#F59E0B] text-xs uppercase tracking-widest mb-1">Customer-Face Pipelines</h4>
                  <p className="text-stone-300 text-xs">Monitors and answers queries across active messaging gateways 24/7. Elevates complex logs back to the dashboard.</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start bg-white/5 p-5 rounded-3xl border border-white/10">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                  <BarChart3 size={20} />
                </div>
                <div>
                  <h4 className="font-extrabold text-[#F59E0B] text-xs uppercase tracking-widest mb-1">CFO Analytical Assistant</h4>
                  <p className="text-stone-300 text-xs">Presents streamlined performance digests visual and verbal. Flags immediate expense leaks in plain human English.</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative z-10 lg:ml-auto w-full max-w-md"
          >
            {/* Avatar Hologram Grid Container */}
            <div className="bg-gradient-to-br from-[#1C1917] to-[#292524] rounded-[40px] p-8 border border-neutral-800 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,#F59E0B_0%,transparent_70%)]"></div>
              
              <div className="aspect-square rounded-[32px] bg-neutral-900/40 mb-8 relative flex items-center justify-center overflow-hidden border border-white/5">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} 
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  className="absolute inset-0 bg-amber-500/10 rounded-full blur-[40px]" 
                />
                
                <motion.div 
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                  className="w-32 h-32 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 shadow-[0_0_50px_rgba(245,158,11,0.3)] flex items-center justify-center border-4 border-white/20 relative cursor-pointer"
                >
                  <Bot size={48} className="text-black" />
                  <div className="absolute -bottom-2 right-0 bg-amber-500 px-3 py-1 rounded-full text-[9px] font-black text-black border-2 border-[#1C1917]">DISPATCHED</div>
                </motion.div>
              </div>
              
              <div className="space-y-4 font-sans relative z-10">
                <div className="p-5 rounded-3xl bg-white/5 text-stone-200 border border-white/10 leading-relaxed text-xs italic">
                  <span className="font-extrabold text-[#F59E0B] not-italic block mb-1">Aria Core Engine:</span>
                  "Greetings, operator. My algorithms detected $340 inside sub-license duplicate creep. Let's fix this now to protect our retail operations runway."
                </div>
                <button 
                  onClick={() => {
                    launchSystemSuite();
                    setTimeout(() => setCurrentTab('aria'), 100);
                  }}
                  className="w-full py-4 text-center bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs tracking-wider uppercase rounded-2xl transition-all"
                >
                  Configure Aria Guidelines
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );

  const ComparisionSection = () => {
    const rows = [
      { feature: "AI Customer Support Avatar", omni: true, standard: false },
      { feature: "Profit Leak Detection", omni: true, standard: false },
      { feature: "Cash-Aware Inventory Sync", omni: true, standard: false },
      { feature: "Cost Root Cause AI", omni: true, standard: false },
      { feature: "Standard Reporting", omni: true, standard: true },
      { feature: "Expense Tracking", omni: true, standard: true },
    ];

    return (
      <section id="comparison" className={`py-24 px-6 border-t transition-colors duration-300 ${
        isDark ? 'bg-[#151311] border-stone-850' : 'bg-[#F5F5F4] border-stone-200'
      }`}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-5xl font-black tracking-tight mb-4 transition-colors ${isDark ? 'text-white' : 'text-[#1C1917]'}`}>Smarter Operations. Less Software.</h2>
            <p className={`text-sm max-w-xl mx-auto transition-colors ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>Consolidate point solutions into a beautiful bento dashboard workspace.</p>
          </div>
          
          <div className={`rounded-[32px] border overflow-hidden transition-colors ${
            isDark ? 'bg-stone-900 border-stone-800 shadow-xl' : 'bg-white border-stone-200 shadow-sm'
          }`}>
            <div className={`grid grid-cols-3 p-6 md:p-8 border-b ${
              isDark ? 'bg-stone-950/40 border-stone-800 text-stone-300' : 'bg-stone-50 border-stone-200 text-stone-500'
            }`}>
              <div className="font-black uppercase tracking-widest text-[10px] flex items-center">Capability</div>
              <div className="font-black text-amber-500 text-center flex items-center justify-center gap-1.5 uppercase text-xs tracking-wider">
                <Sparkles size={16} /> Forge System Suite
              </div>
              <div className="font-black uppercase tracking-widest text-[10px] text-center flex items-center justify-center">Legacy App Handlers</div>
            </div>
            
            <div className={`divide-y ${isDark ? 'divide-stone-805' : 'divide-stone-150'}`}>
              {rows.map((row, i) => (
                <div key={i} className={`grid grid-cols-3 p-6 md:p-8 transition-colors ${
                  isDark ? 'hover:bg-stone-950/20 text-stone-200' : 'hover:bg-stone-50/50 text-[#1C1917]'
                }`}>
                  <div className="font-bold flex items-center text-sm">{row.feature}</div>
                  <div className="flex items-center justify-center">
                    {row.omni ? <CheckCircle2 className="text-amber-500" size={22} /> : <div className={`w-5 h-px ${isDark ? 'bg-stone-750' : 'bg-stone-200'}`}></div>}
                  </div>
                  <div className="flex items-center justify-center">
                    {row.standard ? <CheckCircle2 className={isDark ? "text-stone-600" : "text-stone-300"} size={22} /> : <div className={`w-5 h-px ${isDark ? 'bg-stone-750' : 'bg-stone-200'}`}></div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  };

  const CTASection = () => (
    <section className={`py-28 px-6 relative overflow-hidden border-t transition-colors duration-300 ${
      isDark ? 'bg-[#1C1917] border-stone-850' : 'bg-white border-stone-250'
    }`}>
      <div className="absolute top-0 left-1 center h-[350px] w-[500px] bg-amber-400/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className={`text-4xl md:text-6xl font-black tracking-tight mb-6 transition-colors ${isDark ? 'text-white' : 'text-[#1C1917]'}`}>Take total control of your parameters.</h2>
        <p className={`text-sm md:text-base mb-10 max-w-xl mx-auto leading-relaxed transition-colors ${
          isDark ? 'text-stone-400' : 'text-stone-500'
        }`}>
          Reclaim lost audience engagement, trace rising software costs, and manage stock thresholds today.
        </p>
        <button 
          onClick={launchSystemSuite}
          className={`px-10 py-5 rounded-full font-black text-xs tracking-widest uppercase transition-all hover:shadow-lg active:scale-95 shadow-sm cursor-pointer ${
            isDark ? 'bg-amber-500 hover:bg-amber-450 text-black' : 'bg-[#1C1917] hover:bg-black text-white'
          }`}
        >
          START YOUR 14-DAY TRIAL
        </button>
        <p className={`text-[10px] mt-5 font-black uppercase tracking-widest transition-colors ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>No credit card configurations required • Unlocks instantly</p>
      </div>
    </section>
  );

  const Footer = () => (
    <footer className={`py-12 px-6 border-t transition-colors duration-300 ${
      isDark ? 'bg-[#151311] border-stone-850 text-stone-400' : 'bg-[#F5F5F4] border-stone-200 text-stone-500'
    }`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentTab('landing')}>
          <div className="w-6 h-6 rounded bg-[#110F0E] border border-stone-850 flex items-center justify-center text-black font-bold">
            <ForgeLogo size={18} />
          </div>
          <span className={`font-extrabold text-sm tracking-tight ${isDark ? 'text-white' : 'text-[#1C1917]'}`}>Forge AI</span>
        </div>
        <p className={`${isDark ? 'text-stone-500' : 'text-neutral-400'} text-xs font-semibold`}>Empowering retail merchants with autonomous cloud-native intelligence</p>
        <div className={`flex gap-6 text-xs font-extrabold uppercase tracking-widest ${isDark ? 'text-stone-300' : 'text-[#1C1917]'}`}>
          <a href="#" className="hover:text-amber-550 transition-colors">Privacy</a>
          <a href="#" className="hover:text-amber-550 transition-colors">Terms of Operations</a>
        </div>
      </div>
    </footer>
  );

  // INITIAL SYNCHRONIZATION LOADING SPLASH
  if (isInitializing) {
    return (
      <div className="fixed inset-0 z-200 bg-[#151311] flex flex-col items-center justify-center font-sans">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#F59E0B_0.05%,transparent_60%)] opacity-20 pointer-events-none" />
        <div className="relative flex flex-col items-center">
          {/* Pulsing Logo */}
          <div className="w-16 h-16 rounded-2xl bg-amber-500 text-black flex items-center justify-center text-4xl font-extrabold shadow-2xl animate-pulse select-none font-sans">
            O
          </div>
          
          <h2 className="mt-6 text-sm font-black text-white uppercase tracking-widest leading-none select-none">
            OMNI NEURAL MATRIX
          </h2>
          <p className="mt-2 text-[10px] font-mono text-stone-400 font-bold uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
            Synchronizing Core Databases...
          </p>

          <div className="mt-8 w-40 h-1 bg-stone-900 rounded-full overflow-hidden relative border border-stone-800/40">
            <motion.div 
              className="h-full bg-amber-500 rounded-full"
              initial={{ x: '-100%', width: '40%' }}
              animate={{ x: '250%' }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            />
          </div>
        </div>
      </div>
    );
  }

  // LANDING VIEW WRAPPER
  if (currentTab === 'landing') {
    return (
      <div className={`min-h-screen transition-all duration-300 ${
        isDark ? 'bg-[#151311] text-[#FAF9F6] selection:bg-amber-950 selection:text-amber-200' : 'bg-[#F5F5F4] text-[#1C1917] selection:bg-amber-100 selection:text-amber-900'
      } font-sans`}>
        {/* Floating dashboard reminder tag */}
        <div className="fixed bottom-4 right-4 z-40 bg-[#1C1917] text-[#FEF9EF] rounded-full p-2.5 pl-4 pr-4 border border-amber-500/20 flex items-center gap-2.5 shadow-2xl text-[10px] font-black uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
          <span>SYSTEM OFFLINE</span>
          <button 
            onClick={launchSystemSuite}
            className="bg-[#F59E0B] hover:bg-amber-400 text-black px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-transform hover:scale-105"
          >
            Start Operations Wizard
          </button>
        </div>

        <Navbar />
        <Hero />
        <Features />
        <AriaSection />
        <ComparisionSection />
        <CTASection />
        <Footer />
      </div>
    );
  }

  // ACTIVE MAIN WORKSPACE WRAPPER (Includes Onboarding overlay if not onboarded)
  const mainBgStyle = isDark ? 'bg-[#151311] text-[#F5F5F4]' : 'bg-[#F7F6F5] text-[#1C1917]';
  const sidebarStyle = 'bg-[#1C1917] text-white';

  return (
    <div className={`flex h-screen w-full font-sans overflow-hidden transition-colors duration-300 ${isDark ? 'dark' : ''} ${mainBgStyle}`}>
      
      {/* Toast Notification Container */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-5 right-5 z-50 bg-[#1C1917] border border-amber-500/20 text-[#FEF9EF] px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-black uppercase tracking-widest"
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OMNI DUAL AUTH & ONBOARDING WIZARD */}
      <AnimatePresence>
        {!onboarded && (
          <AuthAndOnboarding 
            onComplete={handleOnboardingComplete}
            theme={theme}
          />
        )}
      </AnimatePresence>

      {/* BYPASSED LEGACY WIZARD CARD WRAPPER */}
      {false && !onboarded && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#1C1917] border border-stone-850 text-white w-full max-w-lg rounded-[36px] overflow-hidden shadow-2xl relative"
            >
              <div className="absolute top-0 right-0 p-4">
                <button 
                  onClick={() => {
                    setOnboarded(true); // Bypass link
                    showToast("Bypassed onboarding. Loaded standard datasets.");
                  }}
                  className="text-stone-500 hover:text-stone-300 text-xs font-bold uppercase tracking-wider"
                >
                  Skip Wizard →
                </button>
              </div>
 
              {/* Progress bar */}
               <div className="h-1 w-full bg-stone-800">
                <div 
                  className="h-full bg-[#F59E0B] transition-all duration-300"
                  style={{ width: `${(onboardingStep / (onbRole === 'customer' ? 2 : 3)) * 100}%` }}
                ></div>
              </div>
 
               <div className="p-8">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-7 h-7 rounded bg-[#110F0E] border border-stone-850 flex items-center justify-center text-black">
                    <ForgeLogo size={20} />
                  </div>
                  <span className="font-extrabold text-[#F59E0B] text-xs uppercase tracking-widest font-mono">
                    Forge Setup Portal — Step {onboardingStep} of {onbRole === 'customer' ? 2 : 3}
                  </span>
                </div>
 
                 {onboardingStep === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-black tracking-tight text-white mb-1.5">Select Your System Persona</h3>
                    <p className="text-xs text-stone-400">Specify your administrative node role below to custom-configure platform modules immediately.</p>
                    
                    <div className="grid grid-cols-1 gap-3.5 mt-4">
                      {/* CARD 1: EXECUTOR OWNER */}
                      <div 
                        onClick={() => setOnbRole('owner')}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer text-left flex items-start gap-4 ${
                          onbRole === 'owner' 
                            ? 'bg-amber-500/10 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.15)]' 
                            : 'bg-[#292524] border-stone-800 hover:border-stone-600'
                        }`}
                      >
                        <div className={`p-3 rounded-xl shrink-0 ${onbRole === 'owner' ? 'bg-amber-500 text-black' : 'bg-stone-800 text-stone-300'}`}>
                          <Building size={20} />
                        </div>
                        <div>
                          <div className="flex items-center justify-between">
                            <h4 className="font-extrabold text-sm text-stone-100">Enterprise Owner / Operator</h4>
                            {onbRole === 'owner' && <span className="w-2 h-2 rounded-full bg-amber-500"></span>}
                          </div>
                          <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                            Formulate margins, prevent cost-leaks, automate stock thresholds, and configure a custom cognitive AI Avatar helper.
                          </p>
                        </div>
                      </div>

                      {/* CARD 2: LOYALTY CUSTOMER */}
                      <div 
                        onClick={() => setOnbRole('customer')}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer text-left flex items-start gap-4 ${
                          onbRole === 'customer' 
                            ? 'bg-amber-500/10 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.15)]' 
                            : 'bg-[#292524] border-stone-800 hover:border-stone-600'
                        }`}
                      >
                        <div className={`p-3 rounded-xl shrink-0 ${onbRole === 'customer' ? 'bg-amber-500 text-black' : 'bg-stone-800 text-stone-300'}`}>
                          <User size={20} />
                        </div>
                        <div>
                          <div className="flex items-center justify-between">
                            <h4 className="font-extrabold text-sm text-stone-100">Store Customer / Patron</h4>
                            {onbRole === 'customer' && <span className="w-2 h-2 rounded-full bg-amber-500"></span>}
                          </div>
                          <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                            Access customer-tailored dashboard with active loyalty discounts, direct inventory reorder alerts, and support co-pilot.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
 
                 {onboardingStep === 2 && onbRole === 'owner' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-black tracking-tight text-white">Configure Brand Parameters</h3>
                    <p className="text-xs text-stone-400">Specify your main enterprise identifiers to customize reports, stock sheets, and system directives.</p>
                    
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div className="space-y-1 col-span-2">
                        <label className="text-[10px] font-black uppercase text-stone-400 block tracking-wider">Business / Store Name</label>
                        <input 
                          type="text"
                          value={onbStore}
                          onChange={e => setOnbStore(e.target.value)}
                          placeholder="Local Grind Cafe"
                          className="w-full bg-[#292524] border border-stone-800 rounded-xl py-3.5 px-4 text-xs font-medium text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
 
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-stone-400 block tracking-wider">Director/Owner Name</label>
                        <input 
                          type="text"
                          value={onbOwner}
                          onChange={e => setOnbOwner(e.target.value)}
                          placeholder="Liam Miller"
                          className="w-full bg-[#292524] border border-stone-800 rounded-xl py-3.5 px-4 text-xs font-medium text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
 
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-stone-400 block tracking-wider">Operations Sector</label>
                        <select 
                          value={onbSector}
                          onChange={e => setOnbSector(e.target.value)}
                          className="w-full bg-[#292524] border border-stone-800 rounded-xl py-3.5 px-4 text-xs font-medium text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                        >
                          <option value="Bespoke Retail">Bespoke Retail</option>
                          <option value="Specialty Cafe">Specialty Cafe</option>
                          <option value="e-Commerce Merchant">e-Commerce Merchant</option>
                          <option value="B2B Wholesale">B2B Wholesale</option>
                        </select>
                      </div>

                      <div className="space-y-1 col-span-2">
                        <label className="text-[10px] font-black uppercase text-stone-400 block tracking-wider">Corporate Administrator Email</label>
                        <input 
                          type="email"
                          value={onbEmail}
                          onChange={e => setOnbEmail(e.target.value)}
                          placeholder="owner@localgrind.com"
                          className="w-full bg-[#292524] border border-stone-800 rounded-xl py-3.5 px-4 text-xs font-medium text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                 {onboardingStep === 2 && onbRole === 'customer' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-black tracking-tight text-white">Initialize Customer Loyalty Node</h3>
                    <p className="text-xs text-stone-400">Provide direct feedback profiles to unlock special loyalty codes, stock reordering sheets, and support.</p>
                    
                    <div className="space-y-3.5 mt-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-stone-400 block tracking-wider">Full Name</label>
                        <input 
                          type="text"
                          value={onbOwner}
                          onChange={e => setOnbOwner(e.target.value)}
                          placeholder="Arthur Dent"
                          className="w-full bg-[#292524] border border-stone-800 rounded-xl py-3.5 px-4 text-xs font-medium text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
 
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-stone-400 block tracking-wider">Preferred Communication Email</label>
                        <input 
                          type="email"
                          value={onbEmail}
                          onChange={e => setOnbEmail(e.target.value)}
                          placeholder="arthur@hitchhiker.org"
                          className="w-full bg-[#292524] border border-stone-800 rounded-xl py-3.5 px-4 text-xs font-medium text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-stone-400 block tracking-wider">Active Phone Line</label>
                        <input 
                          type="text"
                          value={onbPhone}
                          onChange={e => setOnbPhone(e.target.value)}
                          placeholder="+44 7700 901234"
                          className="w-full bg-[#292524] border border-stone-800 rounded-xl py-3.5 px-4 text-xs font-medium text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
 
                 {onboardingStep === 3 && onbRole === 'owner' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                       <Bot size={20} className="text-amber-500" />
                       Design Your ARIA Avatar agent
                    </h3>
                    <p className="text-xs text-stone-400">
                      Since you are an Owner, customize Aria's primary cognitive personality, style, and interface indicators.
                    </p>
                    
                    <div className="space-y-3 mt-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-stone-400 block tracking-wider">Avatar Custom Name</label>
                        <input 
                          type="text"
                          value={onbAvatarName}
                          onChange={e => setOnbAvatarName(e.target.value)}
                          placeholder="Aria Core Co-pilot"
                          className="w-full bg-[#292524] border border-stone-800 rounded-xl py-3 px-4 text-xs font-medium text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
 
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-stone-400 block tracking-wider">Personality Character Style</label>
                        <div className="grid grid-cols-3 gap-2">
                          {['Hologram Core', 'Sunset Bot', 'Void Sentinel'].map((style) => (
                            <button
                              key={style}
                              type="button"
                              onClick={() => setOnbAvatarStyle(style)}
                              className={`py-2 rounded-xl text-[10px] font-extrabold uppercase border transition-all text-center ${
                                onbAvatarStyle === style
                                  ? 'bg-amber-500 text-black border-amber-600 font-black'
                                  : 'bg-[#292524] border-stone-800 text-stone-400 hover:text-white'
                              }`}
                            >
                              {style}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-stone-400 block tracking-wider">Visual Beam Accent Ring</label>
                        <div className="flex items-center gap-3 mt-1.5">
                          {[
                            { color: '#F59E0B', label: 'Amber' },
                            { color: '#10B981', label: 'Emerald' },
                            { color: '#8B5CF6', label: 'Violet' },
                            { color: '#EF4444', label: 'Crimson' }
                          ].map((item) => (
                            <button
                              key={item.color}
                              type="button"
                              onClick={() => setOnbAvatarBorder(item.color)}
                              className="focus:outline-none flex items-center justify-center relative cursor-pointer"
                              title={item.label}
                            >
                              <span 
                                className="w-8 h-8 rounded-full inline-block border-2"
                                style={{ 
                                  backgroundColor: item.color,
                                  borderColor: onbAvatarBorder === item.color ? '#FFFFFF' : 'transparent' 
                                }}
                              ></span>
                              {onbAvatarBorder === item.color && (
                                <span className="absolute text-white font-black text-xs font-mono"></span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
 
                 <div className="mt-8 flex gap-3">
                  {onboardingStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setOnboardingStep(prev => (prev - 1) as any)}
                      className="px-6 py-3.5 border border-stone-850 rounded-xl text-xs font-bold text-stone-300 hover:bg-stone-800 transition-colors uppercase"
                    >
                      Back
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {}}
                    className="flex-grow py-3.5 bg-[#F59E0B] hover:bg-amber-400 text-black font-black uppercase text-xs tracking-wider rounded-xl transition-all shadow-md active:scale-95"
                  >
                    {onbRole === 'customer' 
                      ? onboardingStep === 2 ? "Deploy Loyalty Node" : "Continue Wizard"
                      : onboardingStep === 3 ? "Deploy System Core" : "Continue Wizard"
                    }
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

      {/* MOBILE DRAWER SIDEBAR OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/75 md:hidden flex items-start justify-center p-4 animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div 
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`w-full max-w-sm max-h-[80vh] p-5 rounded-3xl shadow-2xl relative flex flex-col justify-between border overflow-y-auto transition-colors duration-300 ${
                isDark ? 'bg-[#1C1917] text-white border-stone-800' : 'bg-[#FAF9F6] text-[#1C1917] border-stone-200'
              }`}
              onClick={e => e.stopPropagation()}
            >
              <div>
                {/* Brand Logo Header */}
                <div className={`flex items-center justify-between mb-5 border-b pb-3 ${isDark ? 'border-stone-800' : 'border-stone-200'}`}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-[#110F0E] border border-stone-850 rounded-xl flex items-center justify-center text-black font-extrabold shadow-md">
                      <ForgeLogo size={24} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h1 className={`text-xs font-black tracking-tight truncate ${isDark ? 'text-white' : 'text-[#1C1917]'}`}>{profile.storeName || 'Forge AI'}</h1>
                      <span className={`text-[8px] block uppercase font-mono tracking-widest ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>{profile.ownerName || 'Operator'}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setMobileMenuOpen(false)} 
                    className={`p-1 px-1.5 rounded-lg border transition-all cursor-pointer ${
                      isDark ? 'bg-white/5 border-white/10 text-stone-400 hover:text-white hover:bg-white/15' : 'bg-stone-100 border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-200'
                    }`}
                  >
                    <X size={16} />
                  </button>
                </div>
 
                {/* Navigation Items list */}
                <nav className="space-y-1">
                  <button 
                    onClick={() => { setCurrentTab('dashboard'); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all text-xs font-bold uppercase tracking-wider ${
                      currentTab === 'dashboard'
                        ? isDark ? 'bg-white/10 text-amber-500 font-black' : 'bg-amber-505/10 bg-amber-500/10 text-amber-600 font-extrabold border border-amber-500/20'
                        : isDark ? 'text-stone-400 hover:text-white hover:bg-white/5' : 'text-stone-600 hover:text-[#1C1917] hover:bg-stone-205/50 hover:bg-stone-200/50'
                    }`}
                  >
                    <LayoutDashboard size={14} />
                    <span>{profile.customDashboardName || t.navDashboard}</span>
                  </button>

                  <button 
                    onClick={() => { setCurrentTab('retainflow'); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all text-xs font-bold uppercase tracking-wider ${
                      currentTab === 'retainflow'
                        ? isDark ? 'bg-white/10 text-amber-500 font-black' : 'bg-amber-500/10 text-amber-600 font-extrabold border border-amber-500/20'
                        : isDark ? 'text-stone-400 hover:text-white hover:bg-white/5' : 'text-stone-600 hover:text-[#1C1917] hover:bg-stone-200/50'
                    }`}
                  >
                    <Users size={14} />
                    <span>{profile.customRetainName || t.navRetainFlow}</span>
                  </button>
                  <button 
                    onClick={() => { setCurrentTab('costguard'); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all text-xs font-bold uppercase tracking-wider ${
                      currentTab === 'costguard'
                        ? isDark ? 'bg-white/10 text-amber-500 font-black' : 'bg-amber-500/10 text-amber-600 font-extrabold border border-amber-500/20'
                        : isDark ? 'text-stone-400 hover:text-white hover:bg-white/5' : 'text-stone-600 hover:text-[#1C1917] hover:bg-stone-200/50'
                    }`}
                  >
                    <Coins size={14} />
                    <span>{profile.customCostName || t.navCostGuard}</span>
                  </button>
                  <button 
                    onClick={() => { setCurrentTab('stocksense'); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all text-xs font-bold uppercase tracking-wider ${
                      currentTab === 'stocksense'
                        ? isDark ? 'bg-white/10 text-amber-500 font-black' : 'bg-amber-500/10 text-amber-600 font-extrabold border border-amber-500/20'
                        : isDark ? 'text-stone-400 hover:text-white hover:bg-white/5' : 'text-stone-600 hover:text-[#1C1917] hover:bg-stone-200/50'
                    }`}
                  >
                    <PackageSearch size={14} />
                    <span>{profile.customStockName || t.navStockSense}</span>
                  </button>
                  <button 
                    onClick={() => { setCurrentTab('aria'); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all text-xs font-bold uppercase tracking-wider ${
                      currentTab === 'aria'
                        ? isDark ? 'bg-white/10 text-amber-500 font-black' : 'bg-amber-500/10 text-amber-600 font-extrabold border border-amber-500/20'
                        : isDark ? 'text-stone-400 hover:text-white hover:bg-white/5' : 'text-stone-600 hover:text-[#1C1917] hover:bg-stone-200/50'
                    }`}
                  >
                    <Bot size={14} />
                    <span>{profile.customAriaName || t.navAria}</span>
                  </button>
                  <button 
                    onClick={() => { setCurrentTab('workflows'); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all text-xs font-bold uppercase tracking-wider ${
                      currentTab === 'workflows'
                        ? isDark ? 'bg-white/10 text-amber-500 font-black' : 'bg-amber-500/10 text-amber-600 font-extrabold border border-amber-500/20'
                        : isDark ? 'text-stone-400 hover:text-white hover:bg-white/5' : 'text-stone-600 hover:text-[#1C1917] hover:bg-stone-200/50'
                    }`}
                  >
                    <Zap size={14} className="text-amber-500 animate-pulse" />
                    <span>Flow Builder</span>
                  </button>
                  <button 
                    onClick={() => { setCurrentTab('pricing'); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all text-xs font-bold uppercase tracking-wider ${
                      currentTab === 'pricing'
                        ? isDark ? 'bg-white/10 text-amber-500 font-black' : 'bg-amber-500/10 text-amber-600 font-extrabold border border-amber-500/20'
                        : isDark ? 'text-stone-400 hover:text-white hover:bg-white/5' : 'text-stone-600 hover:text-[#1C1917] hover:bg-stone-200/50'
                    }`}
                  >
                    <CreditCard size={14} />
                    <span>{t.navPricing}</span>
                  </button>
                  <button 
                    onClick={() => { setCurrentTab('settings'); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all text-xs font-bold uppercase tracking-wider ${
                      currentTab === 'settings'
                        ? isDark ? 'bg-white/10 text-amber-500 font-black' : 'bg-amber-500/10 text-amber-600 font-extrabold border border-amber-500/20'
                        : isDark ? 'text-stone-400 hover:text-white hover:bg-white/5' : 'text-stone-600 hover:text-[#1C1917] hover:bg-stone-200/50'
                    }`}
                  >
                    <Sliders size={14} />
                    <span>{t.navSettings}</span>
                  </button>
                </nav>
              </div>

              {/* Lower actions rail */}
              <div className={`space-y-3 pt-3 mt-4 border-t ${isDark ? 'border-stone-850' : 'border-stone-200'}`}>
                <div className={`p-3 border rounded-xl text-center ${
                  isDark ? 'bg-stone-900 border-stone-850' : 'bg-stone-100 border-stone-200'
                }`}>
                  <span className="text-[9px] text-amber-500 font-black uppercase block tracking-wider mb-0.5">{t.activeCore}</span>
                  <span className={`text-[8px] block font-semibold ${isDark ? 'text-neutral-450' : 'text-stone-500'}`}>{profile.tier}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DESKTOP SIDEBAR RAIL (Permanently collapsed - HubSpot style) */}
      <aside className={`w-[66px] py-5 px-2 hidden md:flex flex-col shrink-0 items-center justify-between transition-colors duration-300 ${
        isDark ? 'bg-[#151311] text-white' : 'bg-[#F7F6F5] text-[#1C1917]'
      }`}>
        <div className="w-full flex flex-col items-center">
          {/* Brand Logo Header (Just Sparkles) */}
          <div className="flex items-center justify-center mb-6">
            <div 
              onClick={() => setCurrentTab('dashboard')}
              className="w-10 h-10 bg-[#110F0E] border border-stone-800 rounded-full flex items-center justify-center text-black font-extrabold shadow-lg shadow-amber-500/20 cursor-pointer active:scale-95 transition-all"
              title={`${profile.storeName || 'Forge AI'} (Go to Dashboard)`}
            >
              <ForgeLogo size={28} />
            </div>
          </div>

          <nav className="flex flex-col items-center gap-1.5 w-full">
            {[
              { id: 'dashboard', label: profile.customDashboardName || t.navDashboard, icon: LayoutDashboard },
              { id: 'contacts', label: 'People Hub', icon: Users },
              { id: 'social_omni', label: 'Conversations', icon: Mail, pulse: true },
              { id: 'retainflow', label: profile.customRetainName || t.navRetainFlow, icon: Activity },
              { id: 'costguard', label: profile.customCostName || t.navCostGuard, icon: Coins },
              { id: 'stocksense', label: profile.customStockName || t.navStockSense, icon: PackageSearch },
              { id: 'aria', label: profile.customAriaName || t.navAria, icon: Bot },
              { id: 'workflows', label: 'Flow Builder', icon: Zap, pulse: true },
              { id: 'notepad', label: 'Notebook', icon: FileText },
              { id: 'community', label: 'Community', icon: Share2 },
              { id: 'pricing', label: t.navPricing, icon: CreditCard },
              { id: 'settings', label: t.navSettings, icon: Sliders },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer relative ${
                    isActive
                      ? isDark ? 'bg-white/10 text-amber-500 font-extrabold shadow-xs' : 'bg-amber-500/15 text-amber-600 border border-amber-500/20 font-extrabold'
                      : isDark ? 'text-stone-400 hover:text-white hover:bg-white/5' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                  }`}
                  title={item.label}
                >
                  <Icon size={15} className={`shrink-0 ${item.pulse ? 'animate-pulse' : ''}`} />
                  {item.pulse && (
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Lower actions rail (Centered Badge) */}
        <div className="flex flex-col items-center">
          <div 
            className={`w-8 h-8 rounded-full flex items-center justify-center text-amber-500 text-[10px] font-black uppercase shadow-inner border ${
              isDark ? 'bg-[#292524] border-stone-850' : 'bg-stone-100 border-stone-200'
            }`} 
            title={`${profile.tier} Active`}
          >
            {profile.tier ? profile.tier[0] : 'S'}
          </div>
        </div>
      </aside>

      {/* RIGHT SIDE MAIN CONTAINER WITH HUBSPOT FLAT LAYOUT */}
      <div className={`flex-grow flex flex-col h-full min-w-0 ${
        isDark ? 'bg-[#151311]' : 'bg-[#F7F6F5]'
      }`}>
        
        {/* SAAS TRIAL REMAINING WARNING BANNER */}
        {trialType !== 'none' && (
          <div className="bg-[#B45309] text-white px-4 py-1 flex justify-between items-center text-[11px] font-black tracking-wide leading-normal relative z-100 shadow-md">
            <div className="flex-1 flex justify-center items-center gap-2">
              <Sparkles size={11} className="text-amber-300 animate-pulse" />
              <span>You are currently utilizing a <span className="underline font-black">{trialType}-Day Free Trial package</span>. <span className="font-extrabold text-amber-200">{trialDaysLeft} days remaining</span> before upgrade.</span>
              <button 
                onClick={() => setCurrentTab('pricing')}
                className="ml-3 px-2 py-0.5 bg-neutral-950 hover:bg-black text-white text-[9px] font-black uppercase tracking-wider rounded transition-all active:scale-95"
              >
                Upgrade Plan
              </button>
            </div>
            <button 
              onClick={() => setTrialType('none')} 
              className="text-stone-300 hover:text-white absolute right-4 focus:outline-none cursor-pointer"
              title="Dismiss Warning"
            >
              <X size={12} />
            </button>
          </div>
        )}
        
        {/* UPPER WINDOW TOPBAR PANEL */}
        <header className={`h-14 flex items-center justify-between px-4 sm:px-6 shrink-0 select-none ${
          isDark ? 'bg-[#151311]' : 'bg-[#F7F6F5]'
        }`}>
          <div className="flex items-center gap-3">
            {/* Mobile burger button */}
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-[#1C1917] dark:text-amber-500 hover:bg-stone-200 dark:hover:bg-stone-850 md:hidden transition-all cursor-pointer"
              title="Toggle Menu"
            >
              <Menu size={13} />
            </button>

            {/* Path Breadcrumbs - Now JUST Icons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentTab('dashboard')}
                className="p-1 rounded-lg text-amber-500 hover:text-amber-400 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                title="Go to Dashboard"
              >
                <Sparkles size={14} className="animate-pulse" />
              </button>
              
              <span className="text-[#78716C] dark:text-neutral-500 text-[10px] font-bold">/</span>

              <div 
                className="p-1 rounded-lg text-[#1C1917] dark:text-[#FEF9EF] flex items-center justify-center" 
                title={currentTab.toUpperCase()}
              >
                {(() => {
                  switch (currentTab) {
                    case 'dashboard': return <LayoutDashboard size={13} />;
                    case 'contacts': return <Users size={13} />;
                    case 'social_omni': return <Mail size={13} />;
                    case 'retainflow': return <Activity size={13} />;
                    case 'costguard': return <Coins size={13} />;
                    case 'stocksense': return <PackageSearch size={13} />;
                    case 'aria': return <Bot size={13} />;
                    case 'workflows': return <Zap size={13} className="text-amber-500 animate-pulse" />;
                    case 'pricing': return <CreditCard size={13} />;
                    case 'settings': return <Sliders size={13} />;
                    case 'notepad': return <FileText size={13} />;
                    case 'community': return <Share2 size={13} />;
                    default: return <Sparkles size={13} />;
                  }
                })()}
              </div>
            </div>
          </div>

          {/* Expanded & Centered Search Bar */}
          <div className="flex-grow max-w-xl mx-auto px-4 hidden md:flex justify-center">
            <div 
              onClick={() => setCommandPaletteOpen(true)}
              className="flex items-center justify-between gap-3 w-full max-w-md px-4 py-1.5 bg-stone-100 dark:bg-stone-904/40 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-850 hover:border-amber-500/80 rounded-full text-[#A8A29E] dark:text-[#E7E5E4] text-xs cursor-pointer select-none transition-all shadow-inner"
              title="Search everything with Cmd+K Command Palette"
            >
              <div className="flex items-center gap-2 truncate">
                <Search size={12} className="text-stone-500 dark:text-amber-500 shrink-0" />
                <span className="text-neutral-450 dark:text-stone-400 text-[10px] font-medium truncate">Search contacts, social inbox, notepad, commands...</span>
              </div>
              <kbd className="text-[8px] font-mono select-none px-1.5 py-0.5 bg-stone-200 dark:bg-stone-850 dark:text-stone-300 rounded border border-stone-300 dark:border-stone-800 tracking-normal leading-none shrink-0 font-bold">⌘K</kbd>
            </div>
          </div>

          {/* Quick Header Right Operations block */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Standout Amber Upgrade Button */}
            <button
              onClick={() => {
                setCurrentTab('pricing');
                showToast("🔮 Subscribed to Ultimate Core System parameters.");
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-tr from-amber-500 to-amber-600 text-black text-[9px] font-black uppercase tracking-widest rounded-full transition-all hover:bg-gradient-to-r hover:scale-102 active:scale-95 cursor-pointer shadow-md select-none shrink-0"
              title="Upgrade parameters tier"
            >
              <Sparkles size={10} className="animate-pulse" />
              <span>Upgrade</span>
            </button>

            {/* Multi-Language Quick Flags Cycler (JUST ICON) */}
            <button
              onClick={() => {
                const locs: Language[] = ['en', 'es', 'fr', 'de', 'ja'];
                const currentIdx = locs.indexOf(language);
                const nextIdx = (currentIdx + 1) % locs.length;
                const nextLang = locs[nextIdx];
                setLanguage(nextLang);
                localStorage.setItem('omni_language', nextLang);
                showToast(`🌐 System Locale set to: ${nextLang.toUpperCase()}`);
              }}
              className={`p-1.5 w-8 h-8 rounded-full border flex items-center justify-center text-xs font-black uppercase font-mono tracking-wider transition-all cursor-pointer ${
                isDark ? 'bg-[#292524] border-stone-800 text-stone-100 hover:bg-[#3e3835]' : 'bg-stone-50 border-stone-250 text-stone-700 hover:bg-stone-100'
              }`}
              title="System Language / Locale"
            >
              <span className="text-sm select-none">
                {language === 'en' ? '🇺🇸' : language === 'es' ? '🇪🇸' : language === 'fr' ? '🇫🇷' : language === 'de' ? '🇩🇪' : '🇯🇵'}
              </span>
            </button>

            {/* ARIA Simulation Dial Center */}
            <button 
              onClick={() => setTelephonyOpen(true)}
              className={`p-1.5 w-8 h-8 rounded-full border relative transition-all cursor-pointer flex items-center justify-center ${
                isDark ? 'bg-[#292524] border-stone-800 text-amber-500 hover:bg-[#3e3835]' : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
              title="Simulate Telephony Call Center"
            >
              <Phone size={13} />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            </button>

            {/* Real-time Audit Logger logs drawer toggle */}
            <button 
              onClick={() => setActivityFeedOpen(true)}
              className={`p-1.5 w-8 h-8 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
                isDark ? 'bg-[#292524] border-stone-800 text-stone-300 hover:bg-[#3e3835]' : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
              title="Open Activity Pulse Audit Logs"
            >
              <Activity size={13} />
            </button>

            {/* Simple Inline Notification Center popover trigger */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className={`p-1.5 w-8 h-8 rounded-full border relative transition-all cursor-pointer flex items-center justify-center ${
                  isDark ? 'bg-[#292524] border-stone-800 text-stone-300 hover:bg-[#3e3835]' : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
                title="Open Intelligent Notifications Panel"
              >
                <Bell size={13} />
                {unreadNotifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center scale-90 border border-[#1C1917] font-sans">
                    {unreadNotifications.length}
                  </span>
                )}
              </button>

              {/* Header Notifications dropdown card */}
              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className={`absolute right-0 mt-2.5 w-80 rounded-2xl border shadow-2xl p-4 z-50 text-xs text-left ${
                      isDark ? 'bg-[#1C1816] border-stone-850 text-white animate-fade-in' : 'bg-white border-stone-200 text-stone-900 animate-fade-in'
                    }`}
                  >
                    <div className="flex items-center justify-between border-b pb-2 mb-2 border-stone-150 dark:border-stone-850">
                      <span className="font-extrabold uppercase tracking-wider text-amber-500">Node Notifications</span>
                      <button 
                        onClick={() => {
                          setUnreadNotifications([]);
                          showToast("📬 Cleared all micro notifications!");
                        }}
                        className="text-[9px] font-black uppercase text-stone-400 hover:text-white"
                      >
                        Read All
                      </button>
                    </div>
                    <div className="space-y-2.5 max-h-56 overflow-y-auto">
                      {unreadNotifications.length === 0 ? (
                        <div className="text-center py-4 text-stone-500 font-medium">
                          No unread notifications systemwide.
                        </div>
                      ) : (
                        unreadNotifications.map((notif, index) => (
                          <div key={index} className="p-2 ml-1 rounded-xl bg-orange-500/5 border border-stone-200/10">
                            <p className="font-bold text-[10px] text-stone-200">{notif}</p>
                            <p className="text-[9px] text-stone-400 mt-0.5">Alert Log</p>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* AI Advisor help bubble */}
            <button 
              onClick={() => setHelpCenterOpen(true)}
              className={`p-1.5 w-8 h-8 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
                isDark ? 'bg-[#292524] border-stone-800 text-stone-300 hover:bg-[#3e3835]' : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
              title="Help & Contact ARIA Agent Advisor"
            >
              <HelpCircle size={13} />
            </button>

            {/* Quick theme toggler for mobile/desktop convenience */}
            <button 
              onClick={handleToggleTheme}
              className={`p-1.5 w-8 h-8 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
                isDark ? 'bg-[#292524] border-stone-800 text-amber-500 hover:bg-[#3e3835]' : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
              title="Force Light/Dark Mode"
            >
              {isDark ? <Sun size={12} /> : <Moon size={12} />}
            </button>

            {/* MULTI ACCOUNT ACCENT (+) BUTTON */}
            <div className="relative flex items-center">
              <button 
                onClick={() => setShowAccountSwitcher(!showAccountSwitcher)}
                className="w-8 h-8 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-full transition-all font-black flex items-center justify-center cursor-pointer shadow-md active:scale-95"
                title="Manage multiple account channels or tabs (+)"
              >
                <Plus size={13} className="font-extrabold" />
              </button>

              <AnimatePresence>
                {showAccountSwitcher && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className={`absolute right-0 mt-2.5 w-72 rounded-2xl border shadow-2xl p-4 z-50 text-xs text-left ${
                      isDark ? 'bg-[#1C1816] border-stone-850 text-white animate-fade-in' : 'bg-white border-stone-200 text-stone-900 animate-fade-in'
                    }`}
                    style={{ top: '100%', right: '0' }}
                  >
                    <div className="flex items-center justify-between border-b pb-2 mb-3 border-stone-200 dark:border-stone-850">
                      <span className="font-black uppercase tracking-wider text-amber-500 text-[10px]">Accounts & Staff Suite</span>
                      <button onClick={() => setShowAccountSwitcher(false)} className="text-[10px] text-stone-400">✕</button>
                    </div>

                    <div className="space-y-2.5 mb-4">
                      <span className="text-[9px] uppercase font-mono tracking-widest text-[#78716C] block">Switch Active Account</span>
                      {accounts.map(acc => (
                        <button
                          key={acc}
                          onClick={() => {
                            setActiveAccount(acc);
                            setProfile(prev => ({ ...prev, storeName: acc }));
                            showToast(`☁️ Loaded corporate workspace: ${acc}`);
                            setShowAccountSwitcher(false);
                          }}
                          className={`w-full text-left p-2 rounded-xl text-[11px] border font-bold flex justify-between items-center transition-all ${
                            activeAccount === acc 
                              ? 'bg-amber-500/10 border-amber-500 text-amber-500 font-extrabold'
                              : isDark ? 'bg-stone-950/40 border-stone-850 hover:bg-stone-850' : 'bg-stone-50 border-stone-150 hover:bg-stone-100'
                          }`}
                        >
                          <span>{acc}</span>
                          {activeAccount === acc && <span className="text-[8px] bg-amber-500 text-black px-1.5 rounded uppercase font-black">Active</span>}
                        </button>
                      ))}
                    </div>

                    <div className="border-t border-stone-200 dark:border-stone-850 pt-3 space-y-2">
                      <span className="text-[9px] uppercase font-mono tracking-widest text-[#78716C] block">Link New Brand / Tab</span>
                      <div className="flex gap-1">
                        <input 
                          type="text" 
                          id="new-brand-account-input"
                          placeholder="Brand name, e.g. London LED"
                          className={`flex-1 p-2 text-[10.5px] rounded-lg border focus:outline-none ${isDark ? 'bg-neutral-950 border-stone-850 text-white' : 'bg-stone-50 border-stone-150 text-[#1C1917]'}`}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const val = (e.target as HTMLInputElement).value.trim();
                              if (val) {
                                setAccounts(prev => [...prev, val]);
                                (e.target as HTMLInputElement).value = '';
                                showToast(`🎉 Brand account linked: ${val}`);
                              }
                            }
                          }}
                        />
                        <button 
                          onClick={() => {
                            const input = document.getElementById('new-brand-account-input') as HTMLInputElement;
                            const val = input?.value.trim();
                            if (val) {
                              setAccounts(prev => [...prev, val]);
                              input.value = '';
                              showToast(`🎉 Brand account linked: ${val}`);
                            }
                          }}
                          className="px-2.5 bg-amber-500 text-black font-black rounded-lg text-xs"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* WORKING PROFILE TRIGGER WITH INTERACTIVE STATUS SWITCHES */}
            <div className="relative">
              <button 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="group flex items-center gap-2 px-2.5 py-1 bg-stone-100/50 dark:bg-stone-900/40 hover:bg-stone-150/70 dark:hover:bg-stone-850/60 border border-stone-200/50 dark:border-stone-800 rounded-full transition-all cursor-pointer"
                title="Click to view personalized status & details"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-500/30 bg-gradient-to-tr from-[#1C1917] to-[#1C1917] flex items-center justify-center text-[#F59E0B] font-black text-xs h-8 select-none relative shrink-0">
                  {profile.ownerName ? profile.ownerName.split(' ').map((n: string) => n[0]).join('') : 'OP'}
                  <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-stone-900 ${isOnline ? 'bg-emerald-505 bg-emerald-500' : 'bg-stone-500'}`}></span>
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-xs font-black leading-tight text-[#1C1917] dark:text-white truncate max-w-[100px]">{profile.ownerName || 'Active Operator'}</p>
                  <p className="text-[10px] text-neutral-400 leading-none truncate max-w-[100px]">{ownerTitle}</p>
                </div>
              </button>

              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className={`absolute right-0 mt-2.5 w-64 rounded-2xl border shadow-2xl p-4 z-50 text-xs text-left ${
                      isDark ? 'bg-[#1C1816] border-stone-850 text-white animate-fade-in' : 'bg-white border-stone-200 text-stone-900 animate-fade-in'
                    }`}
                    style={{ top: '100%', right: '0' }}
                  >
                    <div className="flex items-center justify-between border-b pb-2 mb-3 border-stone-200 dark:border-stone-850">
                      <span className="font-black uppercase tracking-wider text-amber-500 text-[10px]">Personalized Profile Status</span>
                      <button onClick={() => setProfileDropdownOpen(false)} className="text-[10px] text-stone-400">✕</button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="font-black text-xs text-white dark:text-white">{profile.ownerName || 'Operator Name'}</p>
                        <p className="text-[10px] text-stone-400 mt-0.5">{ownerTitle}</p>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-xl bg-neutral-900/40 border border-stone-850">
                        <span className="text-[10px] font-bold text-stone-300">Professional Presence</span>
                        <button 
                          onClick={() => {
                            setIsOnline(!isOnline);
                            showToast(`🟢 Set presence: ${!isOnline ? 'Online / Active' : 'Offline / Away'}`);
                          }}
                          className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider cursor-pointer ${
                            isOnline ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-stone-800 text-stone-400'
                          }`}
                        >
                          {isOnline ? '● Online' : '○ Away'}
                        </button>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-mono tracking-widest text-[#78716C] block">Professional Title</label>
                        <input 
                          type="text" 
                          value={ownerTitle}
                          onChange={(e) => setOwnerTitle(e.target.value)}
                          placeholder="e.g. Director of Operations"
                          className={`w-full p-2 text-[10px] rounded-lg border focus:outline-none ${isDark ? 'bg-neutral-950 border-stone-800 text-white' : 'bg-stone-50 border-stone-150 text-[#1C1917]'}`}
                        />
                      </div>

                      <div className="border-t border-stone-200 dark:border-stone-850 pt-2.5 flex justify-between gap-1.5">
                        <button 
                          onClick={() => {
                            setCurrentTab('settings');
                            setProfileDropdownOpen(false);
                          }}
                          className="flex-1 py-1.5 bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-black text-center uppercase tracking-wider rounded-lg transition-all"
                        >
                          Modify Details
                        </button>
                        <button 
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            showToast("🔒 Logged out active session securely.");
                          }}
                          className="px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-350 text-[10px] font-bold rounded-lg transition-all"
                        >
                          Log out
                        </button>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* WORKSPACE CONTENT COMPARTMENT - WITH ROUNDED HUBSPOT CARD ENVELOPE */}
        <div className="flex-grow flex-1 p-1 md:p-2 md:pb-2.5 min-h-0 min-w-0 flex flex-col overflow-hidden">
          <main className={`flex-grow flex flex-col h-full overflow-hidden border shadow-sm transition-all duration-300 rounded-[16px] md:rounded-[20px] ${
            isDark 
              ? 'bg-[#1C1917] border-stone-850/80 shadow-[0_4px_30px_rgba(0,0,0,0.5)]' 
              : 'bg-white border-stone-200/95 shadow-[0_4px_24px_rgba(0,0,0,0.02)]'
          }`}>

        {/* WORKSPACE MIDDLE VIEW CONTENT PANEL */}
        <div className={`flex-1 max-w-full w-full mx-auto relative ${
          currentTab === 'social_omni' 
            ? 'h-full flex flex-col overflow-hidden p-2.5 sm:p-4' 
            : 'overflow-y-auto p-3 sm:p-5 md:p-6'
        }`}>
          
          {/* DYNAMIC WELCOMING FLOATING TOAST (NON-INTRUSIVE) */}
          <AnimatePresence>
            {showWelcomeBanner && t.welcomePopDesc[currentTab] && (
              <motion.div
                initial={{ opacity: 0, y: 40, x: 40, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, x: 20, scale: 0.92 }}
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
                className="fixed bottom-6 right-6 z-200 p-4 rounded-2xl bg-neutral-900 border border-neutral-800 text-white shadow-2xl flex items-start gap-3 w-80 max-w-full backdrop-blur-md"
              >
                {/* Visual accent badge */}
                <div className="p-2 rounded-xl bg-amber-500 text-black flex items-center justify-center font-bold shrink-0 shadow-md shadow-amber-500/10">
                  <Sparkles size={14} className="animate-pulse" />
                </div>
                
                <div className="flex-1">
                  <p className="text-[8px] font-mono font-black uppercase tracking-widest text-amber-500 mb-0.5">{t.welcomePopTitle}</p>
                  <h4 className="text-[10px] font-black tracking-wider text-stone-200 mb-1 leading-tight truncate">
                    {profile.ownerName || 'Operator'} / {profile.storeName}
                  </h4>
                  <p className="text-[11.5px] text-stone-300 leading-relaxed font-medium">
                    {t.welcomePopDesc[currentTab]}
                  </p>
                </div>

                {/* Close action */}
                <button 
                  onClick={() => setShowWelcomeBanner(false)}
                  className="p-1 rounded-lg hover:bg-white/10 text-stone-400 hover:text-white transition-all cursor-pointer"
                  title="Dismiss Welcome Message"
                >
                  <X size={12} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <div className={currentTab === 'dashboard' ? 'block' : 'hidden'}>
              <Dashboard 
                customers={customers} 
                setCustomers={setCustomers} 
                leaks={leaks} 
                setLeaks={setLeaks}
                products={products}
                setProducts={setProducts}
                onTabChange={setCurrentTab}
                theme={theme}
                profile={profile}
                ariaName={ariaName}
                ariaTone={ariaTone}
                ariaAvatar={ariaAvatar}
                seedStarterData={seedStarterData}
                isSimulatingLive={isSimulatingLive}
                setIsSimulatingLive={setIsSimulatingLive}
              />
            </div>

            <div className={currentTab === 'retainflow' ? 'block' : 'hidden'}>
              <RetentionHub 
                customers={customers} 
                setCustomers={setCustomers} 
                theme={theme}
                isSimulatingLive={isSimulatingLive}
                setIsSimulatingLive={setIsSimulatingLive}
              />
            </div>

            <div className={currentTab === 'costguard' ? 'block' : 'hidden'}>
              <CostMonitor 
                leaks={leaks} 
                setLeaks={setLeaks} 
                theme={theme}
                onTriggerToast={showToast}
                isSimulatingLive={isSimulatingLive}
                setIsSimulatingLive={setIsSimulatingLive}
              />
            </div>

            <div className={currentTab === 'stocksense' ? 'block' : 'hidden'}>
              <InventoryHub 
                products={products} 
                setProducts={setProducts} 
                theme={theme}
                isSimulatingLive={isSimulatingLive}
                setIsSimulatingLive={setIsSimulatingLive}
              />
            </div>

            <div className={currentTab === 'contacts' ? 'block max-h-[calc(100vh-120px)] overflow-y-auto pr-1 scrollbar-thin' : 'hidden'}>
              <ContactsHub 
                theme={theme}
                syncedContacts={syncedContacts}
                setSyncedContacts={setSyncedContacts}
                showToast={showToast}
                isSimulatingLive={isSimulatingLive}
                setIsSimulatingLive={setIsSimulatingLive}
                onTriggerCall={(phone) => {
                  setTelephonyOpen(true);
                  showToast(`☎️ Dispatching Aria Telephony Dial Center for: ${phone}`);
                }}
              />
            </div>

            <div className={currentTab === 'social_omni' ? 'block h-full flex flex-col min-h-0 overflow-hidden' : 'hidden'}>
              <SocialHub 
                theme={theme}
                showToast={showToast}
                userRole={profile.userRole || 'owner'}
                isSimulatingLive={isSimulatingLive}
                setIsSimulatingLive={setIsSimulatingLive}
                onRelaunchOnboarding={() => {
                  setOnboarded(false);
                  setOnboardingStep(1);
                }}
              />
            </div>

            <div className={currentTab === 'notepad' ? 'block max-h-[calc(100vh-120px)] overflow-y-auto pr-1 scrollbar-thin' : 'hidden'}>
              <AdvancedNotes 
                theme={theme}
                showToast={showToast}
              />
            </div>

            <div className={currentTab === 'community' ? 'block max-h-[calc(100vh-120px)] overflow-y-auto pr-1 scrollbar-thin' : 'hidden'}>
              <CommunityHub 
                theme={theme}
                showToast={showToast}
                isSimulatingLive={isSimulatingLive}
                setIsSimulatingLive={setIsSimulatingLive}
              />
            </div>

            <div className={currentTab === 'aria' ? 'block' : 'hidden'}>
              <AriaManager 
                theme={theme} 
                ariaName={ariaName}
                setAriaName={setAriaName}
                ariaTone={ariaTone}
                setAriaTone={setAriaTone}
                ariaAvatar={ariaAvatar}
                setAriaAvatar={setAriaAvatar}
              />
            </div>

            <div className={currentTab === 'workflows' ? 'block' : 'hidden'}>
              <WorkflowBuilder theme={theme} onTriggerToast={showToast} />
            </div>

            {/* BRAND NEW INTERACTIVE BILLING & PRICING PLANS TAB SCREEN */}
            <div className={currentTab === 'pricing' ? 'block font-sans text-white max-h-[calc(100vh-140px)] overflow-y-auto pr-1 scrollbar-thin' : 'hidden'}>
              <div className="space-y-6 max-w-5xl mx-auto select-none pb-8 text-left">
                
                {/* Header Banner & Billing Switcher */}
                <div className={`p-6 rounded-[24px] border flex flex-col md:flex-row justify-between items-center gap-4 ${
                  isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200 text-[#1C1917]'
                }`}>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-amber-500 tracking-wider font-mono">Subscription Pricing</span>
                    <h2 className="text-xl font-black tracking-tight text-white">Flexible SaaS Core Rates</h2>
                    <p className={`text-xs ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                      Select your operational scale. Annual subscriptions get an instant 20% discount on standard rates.
                    </p>
                  </div>

                  {/* Toggle Controls */}
                  <div className="flex items-center gap-3 bg-stone-950 p-1.5 rounded-full border border-stone-850">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAnnualBilling(false);
                        showToast("📅 Switched to Monthly billing cadence.");
                      }}
                      className={`px-4 py-1.5 text-[9.5px] font-black uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                        !isAnnualBilling 
                          ? 'bg-amber-500 text-black' 
                          : 'text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAnnualBilling(true);
                        showToast("🎉 Switched to Annual billing cadence! 20% discount auto-applied.");
                      }}
                      className={`px-4 py-1.5 text-[9.5px] font-black uppercase tracking-wider rounded-full transition-all cursor-pointer flex items-center gap-1 ${
                        isAnnualBilling 
                          ? 'bg-amber-500 text-black' 
                          : 'text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      Annual 
                      <span className="text-[8px] bg-stone-900 text-amber-400 px-1 py-0.2 rounded font-black font-mono">SAVE 20%</span>
                    </button>
                  </div>
                </div>

                {/* Plan Tier Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  
                  {/* Starter Tier */}
                  <div className={`p-6 md:p-8 min-h-[440px] rounded-[28px] border flex flex-col justify-between transition-all hover:scale-[1.01] ${
                    profile.tier === 'Starter Plan'
                      ? 'border-amber-500 bg-stone-900 shadow-xl shadow-amber-500/5 text-white' 
                      : isDark ? 'bg-stone-900 border-stone-800 text-white' : 'bg-white border-stone-200 text-stone-900 shadow-sm'
                  }`}>
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[9px] font-mono font-black uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">Entry level</span>
                        {profile.tier === 'Starter Plan' && (
                          <span className="text-[8px] font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded-full uppercase">Active</span>
                        )}
                      </div>
                      <h3 className="text-sm font-black uppercase tracking-wide">Starter Standard</h3>
                      
                      <div className="flex items-baseline gap-1 mt-2.5 mb-3 select-text">
                        <span className="text-3xl font-mono font-black text-amber-500">
                          ${isAnnualBilling ? '23' : '29'}
                        </span>
                        <span className={`text-[10px] uppercase font-bold ${isDark ? 'text-stone-405' : 'text-stone-500'}`}>
                          / mo {isAnnualBilling && '(billed annually)'}
                        </span>
                      </div>
                      <p className={`text-xs leading-normal mb-4 ${isDark ? 'text-stone-300' : 'text-stone-605'}`}>
                        For emerging SMB owners seeking automated stock tracking, client health monitoring, and SOP boards.
                      </p>

                      <div className={`space-y-2 pt-4 border-t border-dashed text-xs ${isDark ? 'border-stone-850 text-stone-300' : 'border-stone-200 text-stone-605'}`}>
                        <div className="flex items-center gap-1.5"><Check size={11} className="text-amber-500 shrink-0" /> <span className="truncate">10 active Win-back sequences</span></div>
                        <div className="flex items-center gap-1.5"><Check size={11} className="text-amber-500 shrink-0" /> <span className="truncate">Standard stock alerts (StockSense)</span></div>
                        <div className="flex items-center gap-1.5"><Check size={11} className="text-amber-500 shrink-0" /> <span className="truncate">Basic SOP journal boards (Notebook)</span></div>
                        <div className="flex items-center gap-1.5"><Check size={11} className="text-amber-500 shrink-0" /> <span className="truncate">Single-role access authorization</span></div>
                      </div>
                    </div>

                    <button 
                      type="button"
                      onClick={() => {
                        setProfile((p: any) => ({ ...p, tier: 'Starter Plan' }));
                        showToast(`✨ Plan active: Down-graded to Starter Plan ($${isAnnualBilling ? '23' : '29'}/mo) successfully.`);
                      }}
                      className={`w-full mt-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all cursor-pointer ${
                        profile.tier === 'Starter Plan' 
                          ? 'bg-amber-500 text-black border-amber-500 font-extrabold shadow' 
                          : 'bg-transparent text-amber-500 border-amber-500 hover:bg-amber-500 hover:text-black'
                      }`}
                    >
                      {profile.tier === 'Starter Plan' ? 'Active Tier' : 'Choose Starter'}
                    </button>
                  </div>

                  {/* Growth Suite (Popular) */}
                  <div className={`p-6 md:p-8 min-h-[440px] rounded-[28px] border relative flex flex-col justify-between transition-all hover:scale-[1.01] ${
                    profile.tier === 'Growth Suite' || profile.tier === 'Growth Suite Active'
                      ? 'border-amber-500 bg-stone-900 shadow-xl shadow-amber-500/5 text-white' 
                      : isDark ? 'bg-stone-900 border-stone-800 text-white' : 'bg-white border-stone-200 text-stone-900 shadow-sm'
                  }`}>
                    <div className="absolute top-0 right-6 -translate-y-1/2 bg-amber-500 text-black text-[8px] font-mono font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider border border-stone-900 shadow-md">
                      MOST POPULAR
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[9px] font-mono font-black uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">Mid-scale scales</span>
                        {(profile.tier === 'Growth Suite' || profile.tier === 'Growth Suite Active') && (
                          <span className="text-[8px] font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded-full uppercase">Active</span>
                        )}
                      </div>
                      <h3 className="text-sm font-black uppercase tracking-wide">Growth Core Suite</h3>
                      
                      <div className="flex items-baseline gap-1 mt-2.5 mb-3 select-text">
                        <span className="text-3xl font-mono font-black text-amber-500">
                          ${isAnnualBilling ? '63' : '79'}
                        </span>
                        <span className={`text-[10px] uppercase font-bold ${isDark ? 'text-stone-405' : 'text-stone-500'}`}>
                          / mo {isAnnualBilling && '(billed annually)'}
                        </span>
                      </div>
                      <p className={`text-xs leading-normal mb-4 ${isDark ? 'text-stone-300' : 'text-stone-605'}`}>
                        For scaling retail outlets looking to connect Aria Autopilots, automated cash-aware ordering, and multi-channel marketing campaigns.
                      </p>

                      <div className={`space-y-2 pt-4 border-t border-dashed text-xs ${isDark ? 'border-stone-850 text-stone-300' : 'border-stone-200 text-stone-605'}`}>
                        <div className="flex items-center gap-1.5"><Check size={11} className="text-amber-500 shrink-0" /> <span className="truncate">Unlimited multi-channel campaigns</span></div>
                        <div className="flex items-center gap-1.5"><Check size={11} className="text-amber-500 shrink-0" /> <span className="truncate">Cash-Aware automatic reorders</span></div>
                        <div className="flex items-center gap-1.5"><Check size={11} className="text-amber-500 shrink-0" /> <span className="truncate">Aria Autopilot threads & Tone Rewriters</span></div>
                        <div className="flex items-center gap-1.5"><Check size={11} className="text-amber-500 shrink-0" /> <span className="truncate">Advanced Staff/Manager support delegation</span></div>
                      </div>
                    </div>

                    <button 
                      type="button"
                      onClick={() => {
                        setProfile((p: any) => ({ ...p, tier: 'Growth Suite' }));
                        showToast(`✨ Plan active: Up-graded to Growth Suite ($${isAnnualBilling ? '63' : '79'}/mo) successfully.`);
                      }}
                      className={`w-full mt-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all cursor-pointer ${
                        (profile.tier === 'Growth Suite' || profile.tier === 'Growth Suite Active')
                          ? 'bg-amber-500 text-black border-amber-500 font-extrabold shadow' 
                          : 'bg-transparent text-amber-500 border-amber-500 hover:bg-amber-500 hover:text-black'
                      }`}
                    >
                      {(profile.tier === 'Growth Suite' || profile.tier === 'Growth Suite Active') ? 'Active Tier' : 'Choose Growth'}
                    </button>
                  </div>

                  {/* Enterprise Tier */}
                  <div className={`p-6 md:p-8 min-h-[440px] rounded-[28px] border flex flex-col justify-between transition-all hover:scale-[1.01] ${
                    profile.tier === 'Enterprise Suite' 
                      ? 'border-amber-400 bg-stone-900 shadow-xl shadow-amber-500/5 text-white' 
                      : isDark ? 'bg-stone-900 border-stone-800 text-white' : 'bg-white border-stone-200 text-stone-900 shadow-sm'
                  }`}>
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[9px] font-mono font-black uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">Unlimited Console</span>
                        {profile.tier === 'Enterprise Suite' && (
                          <span className="text-[8px] font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded-full uppercase">Active</span>
                        )}
                      </div>
                      <h3 className="text-sm font-black uppercase tracking-wide">Corporate Forge Console</h3>
                      
                      <div className="flex items-baseline gap-1 mt-2.5 mb-3 select-text">
                        <span className="text-3xl font-mono font-black text-amber-500">
                          ${isAnnualBilling ? '199' : '249'}
                        </span>
                        <span className={`text-[10px] uppercase font-bold ${isDark ? 'text-stone-405' : 'text-stone-500'}`}>
                          / mo {isAnnualBilling && '(billed annually)'}
                        </span>
                      </div>
                      <p className={`text-xs leading-normal mb-4 ${isDark ? 'text-stone-300' : 'text-stone-605'}`}>
                        For high-volume multi-store franchises demanding custom data schemas, dedicated VM priority, and high frequency stock simulation loops.
                      </p>

                      <div className={`space-y-2 pt-4 border-t border-dashed text-xs ${isDark ? 'border-stone-850 text-stone-300' : 'border-stone-200 text-stone-605'}`}>
                        <div className="flex items-center gap-1.5"><Check size={11} className="text-amber-500 shrink-0" /> <span className="truncate">Unlimited multi-store nodes</span></div>
                        <div className="flex items-center gap-1.5"><Check size={11} className="text-amber-500 shrink-0" /> <span className="truncate">Dedicated engineer schema mapping</span></div>
                        <div className="flex items-center gap-1.5"><Check size={11} className="text-amber-500 shrink-0" /> <span className="truncate">High frequency stock simulations</span></div>
                        <div className="flex items-center gap-1.5"><Check size={11} className="text-amber-500 shrink-0" /> <span className="truncate">Custom database API access</span></div>
                      </div>
                    </div>

                    <button 
                      type="button"
                      onClick={() => {
                        setProfile((p: any) => ({ ...p, tier: 'Enterprise Suite' }));
                        showToast(`🔥 Active: Multi-Store Corporate Forge Console ($${isAnnualBilling ? '199' : '249'}/mo) unlocked.`);
                      }}
                      className={`w-full mt-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all cursor-pointer ${
                        profile.tier === 'Enterprise Suite' 
                          ? 'bg-amber-500 text-black border-amber-500 font-extrabold shadow' 
                          : 'bg-transparent text-amber-500 border-amber-500 hover:bg-amber-500 hover:text-black'
                      }`}
                    >
                      {profile.tier === 'Enterprise Suite' ? 'Active Tier' : 'Choose Enterprise'}
                    </button>
                  </div>

                </div>

                {/* Comprehensive Feature Comparison Table */}
                <div className={`p-6 rounded-[24px] border space-y-4 ${
                  isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200 text-stone-900'
                }`}>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-amber-500">Complete Feature Matrices</h3>
                    <p className="text-[10px] text-stone-400 mt-0.5">Compare features across free, standard limits, and enterprise setups to find the right fit.</p>
                  </div>

                  <div className="overflow-x-auto select-text">
                    <table className="w-full text-[11px] text-left border-collapse">
                      <thead>
                        <tr className="border-b border-stone-800/80 text-stone-400 font-mono text-[9px] uppercase tracking-wide">
                          <th className="py-2.5 font-bold">Core Capability</th>
                          <th className="py-2.5 font-bold">Starter Standard</th>
                          <th className="py-2.5 font-bold">Growth Core</th>
                          <th className="py-2.5 font-bold">Corporate Console</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-800/40 font-medium">
                        <tr>
                          <td className="py-2 text-stone-300">Active Win-back Automations</td>
                          <td className="py-2 text-stone-400">10 / mo</td>
                          <td className="py-2 text-stone-200">Unlimited</td>
                          <td className="py-2 text-stone-100 font-bold">Unlimited (Priority Queue)</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-stone-300">Cash-Aware Reorder parameters</td>
                          <td className="py-2 text-[#EF4444] font-bold">✕ None</td>
                          <td className="py-2 text-emerald-400">✔ Full Integration</td>
                          <td className="py-2 text-emerald-500 font-bold">✔ Multi-store Hubs</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-stone-300">Aria Studio Control access</td>
                          <td className="py-2 text-stone-400">Standard Monitoring</td>
                          <td className="py-2 text-stone-200">Full Autonomous</td>
                          <td className="py-2 text-stone-100 font-bold">Cognitive Overrides</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-stone-300">SOP Kanban board synchronization</td>
                          <td className="py-2 text-emerald-401">✔ Enabled</td>
                          <td className="py-2 text-emerald-401">✔ Auto-SOP Generators</td>
                          <td className="py-2 text-emerald-401">✔ Custom APIs Linked</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-stone-300">Custom Role Delegation</td>
                          <td className="py-2 text-stone-400">Owner Access Only</td>
                          <td className="py-2 text-emerald-400">✔ Owner / Manager / Staff</td>
                          <td className="py-2 text-emerald-400">✔ Granular Permissions Matrix</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-stone-300">Customer Support SLAs</td>
                          <td className="py-2 text-stone-400">Email ticket (24h)</td>
                          <td className="py-2 text-stone-200">Priority support ({"< 2h"})</td>
                          <td className="py-2 text-amber-400 font-black">Dedicated Slack Engineer</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* FAQ Section with Slide-open dynamic Accordions */}
                <div className={`p-6 rounded-[24px] border space-y-4 ${
                  isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200 text-stone-900'
                }`}>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-amber-500">Subscriptions FAQ Panel</h3>
                    <p className="text-[10px] text-stone-400 mt-0.5">Find straightforward answers to general billing and feature constraints.</p>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      {
                        q: "Can I upgrade or downgrade billing terms at any time?",
                        a: "Absolutely! Changing tiers updates your limits immediately. Downgrades take effect at the end of your current cycle, preserving your active limits till then."
                      },
                      {
                        q: "What does 'Cash-Aware Reordering' in StockSense mean?",
                        a: "On standard platforms, stock reorders are triggered strictly by material thresholds. Carbon-Aware or Cash-Aware reorders parse your current profit accounts, calculate minimum cost-of-capital, and safely delay or accelerate procurement orders."
                      },
                      {
                        q: "How does the 'Aria Cognitive Loop' calculate runtime efficiency?",
                        a: "Aria parses transaction logs and customer threads in real time. We audit token sizes, compute the average cognitive loops taken per dispatch, and optimize prompt models server-side dynamically."
                      },
                      {
                        q: "Are there any hidden API integration or setup charges?",
                        a: "Not at all. There are zero connection setup fees. All standard plans cover our default database pipelines and communication channel triggers out of the box."
                      }
                    ].map((faq, fIdx) => {
                      const isOpen = activeFaq === fIdx;
                      return (
                        <div 
                          key={fIdx}
                          className="border-b border-stone-800/40 pb-2.5 bg-transparent"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setActiveFaq(isOpen ? null : fIdx);
                            }}
                            className="w-full flex justify-between items-center text-left py-2 text-xs font-bold text-stone-200 hover:text-amber-500 transition-colors cursor-pointer"
                          >
                            <span>{faq.q}</span>
                            <span className="text-amber-500 text-sm font-mono">{isOpen ? '−' : '+'}</span>
                          </button>
                          
                          {isOpen && (
                            <p className="text-[10.5px] text-stone-450 bg-stone-950/40 p-3.5 rounded-xl border border-stone-850/60 leading-relaxed mb-1 font-sans">
                              {faq.a}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>

              {/* INTEGRATED DEDICATED FULL PAGE SYSTEM SETTINGS PANEL */}
              <div className={currentTab === 'settings' ? 'block text-white max-h-[calc(100vh-140px)] overflow-y-auto pr-1 scrollbar-thin' : 'hidden'}>
                {(() => {
                const settingsInputBg = 'bg-[#0a0a0a] border-neutral-800 text-white focus:outline-none focus:border-amber-500 rounded-2xl';
                const settingsCardBg = 'bg-[#1C1917] border-neutral-800 text-white shadow-xl';
                return (
                  <div className="space-y-4">
                    {/* System Settings Header */}
                    <div className={`p-4 px-5 rounded-[24px] border ${settingsCardBg}`}>
                      <h2 className="text-xl font-black mb-0.5 tracking-tight">{t.settingsTitle}</h2>
                      <p className="text-xs text-stone-300 dark:text-stone-300 leading-normal">{t.settingsSubtitle}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-stretch">
                      {/* Card 1 - Store Identity & Custom Sidebar Navigation labels */}
                      <div className={`p-4 rounded-2xl border flex flex-col justify-between ${settingsCardBg}`}>
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`p-1 rounded-md ${isDark ? 'bg-amber-500/10 text-amber-500' : 'bg-stone-100 text-stone-800'}`}><Sliders size={13} /></span>
                          <div>
                            <h3 className="font-bold text-xs">{t.storeIdentityTitle}</h3>
                            <p className="text-[9px] text-neutral-400">{t.storeIdentityDesc}</p>
                          </div>
                        </div>

                        <form onSubmit={handleProfileSave} className="space-y-2">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pb-1">
                            <div className="space-y-1">
                              <label className="text-[9px] font-black uppercase text-neutral-400 block tracking-wider">{t.bizNameLabel}</label>
                              <input 
                                type="text" 
                                value={editStore}
                                onChange={e => setEditStore(e.target.value)}
                                className={`w-full border p-2 text-xs font-bold leading-tight ${settingsInputBg}`}
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[9px] font-black uppercase text-stone-400 block tracking-wider">{t.adminNameLabel}</label>
                              <input 
                                type="text" 
                                value={editOwner}
                                onChange={e => setEditOwner(e.target.value)}
                                className={`w-full border rounded-lg p-2 text-xs font-bold leading-tight ${settingsInputBg}`}
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[9px] font-black uppercase text-stone-400 block tracking-wider">{t.adminEmailLabel}</label>
                              <input 
                                type="text" 
                                value={editEmail}
                                onChange={e => setEditEmail(e.target.value)}
                                className={`w-full border rounded-lg p-2 text-xs font-bold leading-tight ${settingsInputBg}`}
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[9px] font-black uppercase text-stone-400 block tracking-wider">{t.smsAlertLabel}</label>
                              <input 
                                type="text" 
                                value={editPhone}
                                onChange={e => setEditPhone(e.target.value)}
                                className={`w-full border rounded-lg p-2 text-xs font-bold leading-tight ${settingsInputBg}`}
                              />
                            </div>
                          </div>

                          {/* Extra Sidebar Rename Input Grid */}
                          <div className="border-t border-stone-800/10 dark:border-stone-805 pt-3 mt-3">
                            <h4 className="text-[11px] font-black uppercase tracking-wider text-amber-500 mb-1">Custom Sidebar Navigation Rename</h4>
                            <p className="text-[9.5px] text-stone-300 mb-2">Tailor the sidebar navigation labels to match your desired vocabulary immediately.</p>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              <div className="space-y-1">
                                <label className="text-[8px] font-black uppercase text-stone-400 block tracking-wider">Dashboard Label</label>
                                <input 
                                  type="text" 
                                  value={editDashboardName}
                                  onChange={e => setEditDashboardName(e.target.value)}
                                  placeholder={t.navDashboard}
                                  className={`w-full border rounded-lg p-1.5 text-xs font-bold leading-tight ${settingsInputBg}`}
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[8px] font-black uppercase text-stone-450 block tracking-wider">Loyalty Label Key</label>
                                <input 
                                  type="text" 
                                  value={editRetainName}
                                  onChange={e => setEditRetainName(e.target.value)}
                                  placeholder={t.navRetainFlow}
                                  className={`w-full border rounded-lg p-1.5 text-xs font-bold leading-tight ${settingsInputBg}`}
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[8px] font-black uppercase text-stone-450 block tracking-wider">Expense Leak Label</label>
                                <input 
                                  type="text" 
                                  value={editCostName}
                                  onChange={e => setEditCostName(e.target.value)}
                                  placeholder={t.navCostGuard}
                                  className={`w-full border rounded-lg p-1.5 text-xs font-bold leading-tight ${settingsInputBg}`}
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[8px] font-black uppercase text-stone-450 block tracking-wider">Supply Label</label>
                                <input 
                                  type="text" 
                                  value={editStockName}
                                  onChange={e => setEditStockName(e.target.value)}
                                  placeholder={t.navStockSense}
                                  className={`w-full border rounded-lg p-1.5 text-xs font-bold leading-tight ${settingsInputBg}`}
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[8px] font-black uppercase text-stone-450 block tracking-wider">AI Co-Pilot Label</label>
                                <input 
                                  type="text" 
                                  value={editAriaName}
                                  onChange={e => setEditAriaName(e.target.value)}
                                  placeholder={t.navAria}
                                  className={`w-full border rounded-lg p-1.5 text-xs font-bold leading-tight ${settingsInputBg}`}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="pt-2 flex justify-end">
                            <button 
                              type="submit" 
                              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-450 text-black text-[10px] font-black rounded-lg transition-all uppercase tracking-wider cursor-pointer"
                            >
                              {t.updateBtn}
                            </button>
                          </div>
                        </form>
                      </div>

                      {/* Card 2 - CRM Unified Contacts Database Panel (Aligned Side-by-Side) */}
                      <div className={`p-4 px-5 rounded-2xl border ${isDark ? 'bg-stone-900 border-stone-800 text-white shadow-xl' : 'bg-white border-stone-200 text-[#1C1917]'}`}>
                        <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500"><Users size={14} /></span>
                            <div>
                              <h3 className="font-bold text-xs">{t.contactSyncTitle}</h3>
                              <p className="text-[10px] text-stone-300">{t.contactSyncDesc}</p>
                            </div>
                          </div>
                          
                          <div className="px-2 py-0.5 bg-[#141210] border border-stone-850 rounded text-[10px] font-mono text-amber-500">
                            {syncedContacts.length} Synced
                          </div>
                        </div>

                        {/* Direct CRM Single Addition Form */}
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-3.5 p-3 rounded-xl bg-amber-500/[0.02] border border-dashed border-stone-800">
                          <input 
                            type="text"
                            placeholder={t.contactNamePlaceholder}
                            value={contName}
                            onChange={e => setContName(e.target.value)}
                            className="bg-transparent text-xs p-2.5 font-bold border border-stone-800 rounded-xl focus:outline-none text-[#1C1917] dark:text-white"
                          />
                          <input 
                            type="text"
                            placeholder={t.contactPhonePlaceholder}
                            value={contPhone}
                            onChange={e => setContPhone(e.target.value)}
                            className="bg-transparent text-xs p-2.5 font-bold border border-stone-800 rounded-xl focus:outline-none text-[#1C1917] dark:text-white"
                          />
                          <input 
                            type="email"
                            placeholder={t.contactEmailPlaceholder}
                            value={contEmail}
                            onChange={e => setContEmail(e.target.value)}
                            className="bg-transparent text-xs p-2.5 font-bold border border-stone-800 rounded-xl focus:outline-none text-[#1C1917] dark:text-white"
                          />
                          <button 
                            type="button"
                            onClick={(e) => {
                              if (!contName.trim() || !contPhone.trim()) {
                                showToast("⚠️ Contact Name and Phone Number are required.");
                                return;
                              }
                              const newContact = {
                                name: contName.trim(),
                                phone: contPhone.trim(),
                                email: contEmail.trim() || 'operator@synced.io',
                                tag: contTag
                              };
                              setSyncedContacts((prev: any) => [newContact, ...prev]);
                              setContName('');
                              setContPhone('');
                              setContEmail('');
                              showToast(`👤 Created contact: ${newContact.name}`);
                            }}
                            className="bg-amber-500 hover:bg-amber-450 text-black text-xs font-black p-2.5 rounded-xl uppercase tracking-wider transition-all cursor-pointer text-center"
                          >
                            {t.addContactBtn}
                          </button>
                        </div>

                        {/* Bulk Clipboard Paste Node */}
                        <div className="mb-6 space-y-2">
                          <label className="text-[10px] font-black uppercase text-neutral-450 block tracking-wider">{t.pastedContactsLabel}</label>
                          <textarea
                            placeholder={t.pastedContactsPlaceholder}
                            rows={3}
                            value={bulkText}
                            onChange={e => setBulkText(e.target.value)}
                            className={`w-full p-3 font-mono text-xs border rounded-xl leading-relaxed focus:outline-none ${
                              isDark ? 'bg-[#1C1917] border-stone-800 text-stone-200' : 'bg-stone-50 border-stone-200 text-stone-800'
                            }`}
                          />
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                if (!bulkText.trim()) {
                                  showToast("⚠️ Paste some comma-separated row text first.");
                                  return;
                                }
                                const lines = bulkText.split('\n');
                                let addedCount = 0;
                                const parsed: typeof syncedContacts = [];
                                
                                lines.forEach(ln => {
                                  if (!ln.trim()) return;
                                  const parts = ln.split(',');
                                  const name = parts[0]?.trim();
                                  const phone = parts[1]?.trim() || '';
                                  if (name) {
                                    parsed.push({
                                      name,
                                      phone,
                                      email: 'bulk@synced.io',
                                      tag: 'Bulk Imported'
                                    });
                                    addedCount++;
                                  }
                                });

                                if (parsed.length > 0) {
                                  setSyncedContacts((prev: any) => [...parsed, ...prev]);
                                  setBulkText('');
                                  showToast(`⚡ Batch loaded ${addedCount} contacts! Click Synchronize below to authorize.`);
                                } else {
                                  showToast("⚠️ Could not parse any contacts. Check format (Name, Phone).");
                                }
                              }}
                              className="px-4 py-2 bg-stone-900 border border-stone-800 hover:bg-stone-850 text-stone-300 text-[10px] font-black uppercase rounded-lg transition-all cursor-pointer"
                            >
                              {t.bulkSyncBtn}
                            </button>
                          </div>
                        </div>

                        {/* Massive Sync simulation button with progress bar */}
                        <div className="space-y-4 pt-4 border-t border-dashed border-stone-200 dark:border-stone-800">
                          {isSyncingContacts ? (
                            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-center space-y-2">
                              <div className="flex justify-between text-xs font-bold text-amber-500 font-mono">
                                <span>Synchronizing buffers...</span>
                                <span>{syncProgress}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-stone-900 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500 transition-all duration-150" style={{ width: `${syncProgress}%` }}></div>
                              </div>
                              <p className="text-[9px] text-stone-400 font-mono animate-pulse">Hashing directories & transferring phone logs natively onto Aria-Communications core...</p>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                if (syncedContacts.length === 0) {
                                  showToast("⚠️ There are no active contacts to sync.");
                                  return;
                                }
                                setIsSyncingContacts(true);
                                setSyncProgress(0);
                                
                                // Beautiful simulated progress sync loader
                                const timer = setInterval(() => {
                                  setSyncProgress(prev => {
                                    if (prev >= 100) {
                                      clearInterval(timer);
                                      setIsSyncingContacts(false);
                                      showToast(`☁️ Sync Complete! Synced ${syncedContacts.length} contacts to Aria communication channels.`);
                                      return 100;
                                    }
                                    return prev + 10;
                                  });
                                }, 150);
                              }}
                              className="w-full py-4 text-center text-xs font-black uppercase tracking-widest bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-450 hover:to-amber-550 text-black rounded-xl transition-all shadow-md cursor-pointer"
                            >
                              {t.syncAriaEngineBtn}
                            </button>
                          )}
                        </div>

                        {/* Synced Contact Database Table with removal */}
                        <div className="mt-6 space-y-2">
                          <p className="text-[10px] font-black uppercase text-stone-400 tracking-wider font-mono">{t.syncedContactsLabel}</p>
                          <div className={`max-h-[220px] overflow-y-auto border rounded-2xl ${isDark ? 'border-stone-850 divide-y divide-stone-850 bg-stone-950/20' : 'border-stone-200 divide-y divide-stone-100 bg-stone-50/50'}`}>
                            {syncedContacts.length === 0 ? (
                              <p className="p-4 text-center text-xs text-stone-400 font-mono">{t.noContacts}</p>
                            ) : (
                              syncedContacts.map((contact, i) => (
                                <div key={i} className="p-3 flex items-center justify-between text-xs hover:bg-stone-500/5">
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-extrabold text-stone-800 dark:text-stone-100 truncate">{contact.name}</span>
                                      <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-500 text-[8px] font-black rounded uppercase tracking-wider">{contact.tag}</span>
                                    </div>
                                    <div className="text-[10px] text-stone-400 space-x-2">
                                      <span>{contact.phone}</span>
                                      <span>•</span>
                                      <span className="hidden sm:inline">{contact.email}</span>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const backupName = syncedContacts[i]?.name;
                                      setSyncedContacts((prev: any) => prev.filter((_: any, idx: number) => idx !== i));
                                      showToast(`🗑️ Removed contact: ${backupName}`);
                                    }}
                                    className="p-1 px-2 rounded hover:bg-red-500/10 text-stone-400 hover:text-red-500 transition-colors text-[10px] font-bold cursor-pointer"
                                  >
                                    Remove
                                  </button>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Card 3 - Additional Operations, budget guards & synthesized Voice Tone controls */}
                      <div className={`p-4 px-5 rounded-2xl border ${isDark ? 'bg-stone-900 border-stone-800 text-white shadow-xl animate-fade-in animate-pulse' : 'bg-white border-stone-200 text-[#1C1917]'}`}>
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`p-1.5 rounded-lg ${isDark ? 'bg-amber-500/10 text-amber-500' : 'bg-stone-100 text-stone-800'}`}><Sparkles size={14} /></span>
                          <div>
                            <h3 className="font-bold text-xs">{t.langLabel}</h3>
                            <p className="text-[10px] text-stone-300">{t.langDesc}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1.5">
                          {([
                            { code: 'en', label: 'English 🇺🇸' },
                            { code: 'es', label: 'Español 🇪🇸' },
                            { code: 'fr', label: 'Français 🇫🇷' },
                            { code: 'de', label: 'Deutsch 🇩🇪' },
                            { code: 'ja', label: '日本語 🇯🇵' }
                          ] as const).map(lnItem => (
                            <button
                              key={lnItem.code}
                              type="button"
                              onClick={() => {
                                setLanguage(lnItem.code);
                                showToast(`🌐 Locale Swapped: ${lnItem.code.toUpperCase()}`);
                              }}
                              className={`py-3 px-1.5 rounded-xl border text-center transition-all cursor-pointer text-xs ${
                                language === lnItem.code
                                  ? 'bg-amber-500 text-black border-amber-600 font-extrabold'
                                  : isDark 
                                    ? 'bg-[#1C1917] border-stone-800 text-stone-300 hover:bg-neutral-800'
                                    : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                              }`}
                            >
                              <span className="block font-medium">{lnItem.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* NEW OPTION CUSTOM: Cost Guard & Token Budget Limiter */}
                      <div className={`p-4 px-5 rounded-2xl border ${isDark ? 'bg-stone-900 border-stone-800 text-white shadow-xl' : 'bg-white border-stone-200 text-[#1C1917]'}`}>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="p-1.5 rounded-lg bg-red-500/10 text-red-500"><ShieldCheck size={14} /></span>
                          <div>
                            <h3 className="font-bold text-xs">Cost Guard & Token Budget</h3>
                            <p className="text-[10px] text-stone-300">Set maximum daily spending thresholds on Aria's AI automation engine to watch expend buffers.</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex justify-between items-center bg-stone-500/5 p-3 rounded-2xl border border-light/5">
                            <span className="text-xs font-semibold">Enable Daily Auto-Cutoff</span>
                            <button
                              type="button"
                              onClick={() => {
                                setIsCostLimitActive(!isCostLimitActive);
                                showToast(`🛡️ Cost limit safety shield: ${!isCostLimitActive ? 'ENABLED' : 'DISABLED'}`);
                              }}
                              className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                isCostLimitActive ? 'bg-amber-500' : 'bg-neutral-700'
                              }`}
                            >
                              <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-stone-950 shadow ring-0 transition duration-200 ease-in-out ${
                                isCostLimitActive ? 'translate-x-5' : 'translate-x-0'
                              }`} />
                            </button>
                          </div>

                          <div className="space-y-1.5 p-3.5 rounded-2xl bg-stone-500/5 border border-light/5">
                            <div className="flex justify-between text-xs">
                              <span className="font-medium text-stone-400">Daily Cap Threshold</span>
                              <span className="font-mono text-amber-500 font-extrabold">${dailyBudget} USD</span>
                            </div>
                            <input
                              type="range"
                              min="5"
                              max="200"
                              step="5"
                              value={dailyBudget}
                              disabled={!isCostLimitActive}
                              onChange={(e) => setDailyBudget(Number(e.target.value))}
                              className="w-full accent-amber-500 h-1 rounded-lg bg-stone-850 cursor-pointer disabled:opacity-40"
                            />
                            <div className="flex justify-between text-[8.5px] uppercase font-mono tracking-wider font-bold text-stone-500">
                              <span>$5 Min</span>
                              <span>$200 Max</span>
                            </div>
                          </div>

                          <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-center justify-between">
                            <div>
                              <p className="text-[10px] uppercase font-mono font-black text-amber-500 tracking-wider">Aria Consumption Today</p>
                              <p className="text-[11px] font-bold text-stone-300">$14.28 of ${isCostLimitActive ? dailyBudget : '∞'} used</p>
                            </div>
                            <div className="w-10 h-10 rounded-full border-2 border-amber-500/30 flex items-center justify-center font-mono text-[10px] font-black text-amber-450 bg-stone-950">
                              {Math.round((14.28 / (isCostLimitActive ? dailyBudget : 150)) * 100)}%
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* NEW OPTION CUSTOM: Telephony Callbacks & Automatic backup schedule */}
                      <div className={`p-4 px-5 rounded-2xl border ${isDark ? 'bg-stone-900 border-stone-800 text-white shadow-xl' : 'bg-white border-stone-200 text-[#1C1917]'}`}>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500"><Cpu size={14} /></span>
                          <div>
                            <h3 className="font-bold text-xs">Telephony & Backup Rotations</h3>
                            <p className="text-[10px] text-stone-300">Configure default voice lines for automated auto-dial campaigns and backup schedule rotations.</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-black uppercase tracking-wider text-stone-450 block">Caller Synthesized Voice Tone</label>
                            <select
                              value={voiceActor}
                              onChange={(e) => {
                                setVoiceActor(e.target.value);
                                showToast(`📣 Swapped Aria telephone voice persona: ${e.target.value}`);
                              }}
                              className={`w-full p-2.5 text-xs font-bold rounded-xl border ${
                                isDark ? 'bg-stone-950 border-stone-850 text-white' : 'bg-stone-50 border-stone-200 text-stone-900'
                              } focus:outline-none`}
                            >
                              <option value="Aria Premium Female">Aria Premium Female (USA Accent, Soft Voice)</option>
                              <option value="Aria Professional Male">Aria Professional Male (UK Accent, Formal)</option>
                              <option value="Sandstone Synthetic Neural">Sandstone Synthetic Neural (Neutral Telephony)</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[9px] font-black uppercase tracking-wider text-stone-450 block">Ledger Sync Schedule Frequency</label>
                            <div className="grid grid-cols-3 gap-2">
                              {["Real-Time", "Weekly", "Monthly"].map((freq) => (
                                <button
                                  key={freq}
                                  type="button"
                                  onClick={() => {
                                    setBackupSchedule(freq);
                                    showToast(`📅 Synced ledger backup rotation changed: ${freq}`);
                                  }}
                                  className={`py-2 px-1 text-center rounded-lg border text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                                    backupSchedule === freq
                                      ? 'bg-amber-500 text-black border-amber-600'
                                      : isDark
                                        ? 'bg-stone-950 border-stone-850 text-stone-400 hover:text-white'
                                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                                  }`}
                                >
                                  {freq}
                                </button>
                              ))}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              // Generate backup in JSON
                              const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(syncedContacts, null, 2));
                              const downloadAnchor = document.createElement('a');
                              downloadAnchor.setAttribute("href",     dataStr);
                              downloadAnchor.setAttribute("download", "aria_contacts_ledger_backup.json");
                              document.body.appendChild(downloadAnchor);
                              downloadAnchor.click();
                              downloadAnchor.remove();
                              showToast("💾 Exported contacts CRM dataset to local computer folder!");
                            }}
                            className="w-full py-2.5 bg-stone-900 border border-stone-800 hover:bg-stone-550 text-stone-300 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <span>📥 Download CRM Ledger Backups (JSON)</span>
                          </button>
                        </div>
                      </div>

                      {/* TEAM ROLES SYSTEM WIDGET (Owner/Manager/Staff) */}
                      <div className={`p-4 px-5 rounded-2xl border flex flex-col justify-between h-fit space-y-3 ${
                        isDark ? 'bg-stone-900 border-stone-800 text-white shadow-xl' : 'bg-white border-stone-200 text-[#1C1917]'
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500"><Users size={12} /></span>
                          <div>
                            <h3 className="font-extrabold text-xs">Team Access Controls</h3>
                            <p className="text-[10px] text-stone-400">Delegate role credentials. Owner (All nodes), Manager (Operation logs), Staff (Stock & Chat only).</p>
                          </div>
                        </div>

                        {/* Interactive Member Addition Form */}
                        <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-850 space-y-2">
                          <p className="text-[8.5px] font-black uppercase text-amber-500 tracking-wider">Authorize New Team Member</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            <input
                              type="text"
                              placeholder="Full Name"
                              value={newMemberName}
                              onChange={e => setNewMemberName(e.target.value)}
                              className={`p-1.5 rounded-lg border text-[10.5px] font-semibold ${settingsInputBg}`}
                            />
                            <input
                              type="email"
                              placeholder="Email Address"
                              value={newMemberEmail}
                              onChange={e => setNewMemberEmail(e.target.value)}
                              className={`p-1.5 rounded-lg border text-[10.5px] font-semibold ${settingsInputBg}`}
                            />
                          </div>

                          <div className="flex justify-between items-center gap-2 flex-wrap pt-0.5">
                            <div className="flex items-center gap-1">
                              <span className="text-[8px] text-stone-400 font-bold mr-1">Role:</span>
                              {(['Owner', 'Manager', 'Staff'] as const).map(role => (
                                <button
                                  key={role}
                                  type="button"
                                  onClick={() => setNewMemberRole(role)}
                                  className={`px-1.5 py-0.5 text-[8px] uppercase font-black tracking-wider rounded transition-all cursor-pointer ${
                                    newMemberRole === role 
                                      ? 'bg-amber-500 text-black' 
                                      : 'bg-stone-900 text-stone-400 hover:text-white'
                                  }`}
                                >
                                  {role}
                                </button>
                              ))}
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                if (!newMemberName.trim() || !newMemberEmail.trim()) {
                                  showToast("⚠️ Missing Name or Email fields.");
                                  return;
                                }
                                const nId = (teamMembers.length + 1).toString();
                                const todayStr = new Date().toISOString().split('T')[0];
                                setTeamMembers([...teamMembers, { id: nId, name: newMemberName, email: newMemberEmail, role: newMemberRole, joinedDate: todayStr }]);
                                setNewMemberName('');
                                setNewMemberEmail('');
                                showToast(`🎉 Success: Invitation issued as ${newMemberRole} role!`);
                              }}
                              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-450 text-black text-[9px] font-black uppercase tracking-wider rounded-lg cursor-pointer transition-all active:scale-95"
                            >
                              Add Member
                            </button>
                          </div>
                        </div>

                        {/* Active Registered Team Roster */}
                        <div className="space-y-2">
                          <p className="text-[8.5px] font-black uppercase tracking-wider text-stone-400">Authorized Workspace Roster</p>
                          <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1 scrollbar-thin">
                            {teamMembers.map(member => (
                              <div 
                                key={member.id}
                                className="flex items-center justify-between p-2 rounded-xl border border-stone-850/60 bg-stone-950/30 text-[11px]"
                              >
                                <div className="space-y-0.5 text-left">
                                  <p className="font-extrabold text-stone-205">{member.name}</p>
                                  <p className="text-[8px] text-stone-450 font-mono">{member.email}</p>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <span className={`px-1.5 py-0.2 rounded text-[7.5px] font-mono font-black uppercase tracking-wider ${
                                    member.role === 'Owner' 
                                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/10' 
                                      : member.role === 'Manager'
                                        ? 'bg-blue-500/10 text-cyan-400 border border-cyan-500/15'
                                        : 'bg-stone-800 text-stone-400'
                                  }`}>
                                    {member.role}
                                  </span>

                                  {member.id !== '1' && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setTeamMembers(teamMembers.filter(m => m.id !== member.id));
                                        showToast(`🗑️ De-authorized credentials for ${member.name}.`);
                                      }}
                                      className="text-red-500 hover:text-red-400 font-black text-[10px] cursor-pointer inline-block ml-1"
                                      title="Revoke access"
                                    >
                                      ✕
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Server/Operations status */}
                      <div className={`p-4 px-5 rounded-2xl border flex flex-col justify-between h-fit space-y-3 ${isDark ? 'bg-stone-900 border-stone-800 text-white' : 'bg-white border-stone-200 text-[#1C1917]'}`}>
                        <div>
                          <h3 className="font-bold text-xs uppercase tracking-wider mb-1 text-stone-400">{t.opsNodeStatus}</h3>
                        <p className="text-[11px] text-stone-300 leading-normal mb-3">{t.opsNodeDesc}</p>

                        <div className="space-y-4 font-mono text-[10.5px] text-neutral-400">
                          <div className="flex justify-between border-b pb-2 border-stone-205 dark:border-stone-850">
                            <span>Ingress Service API</span>
                            <span className="text-emerald-500 font-bold">● ONLINE</span>
                          </div>
                          <div className="flex justify-between border-b pb-2 border-stone-205 dark:border-stone-850">
                            <span>Target Engine Port</span>
                            <span className="font-bold">Port 3000 Ingress</span>
                          </div>
                          <div className="flex justify-between border-b pb-2 border-stone-205 dark:border-stone-850">
                            <span>Secured Weightings</span>
                            <span className="text-amber-500">Aria2.5-Cognitive</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Account Tier Level</span>
                            <span className="font-bold uppercase text-amber-500">{profile.tier}</span>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-1 md:col-span-2 xl:col-span-3 pt-4 border-t border-dashed border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row gap-3 text-center">
                        <button 
                          onClick={() => {
                            setOnboarded(false);
                            setCurrentTab('dashboard');
                            setOnboardingStep(1);
                            showToast("🔄 Initiated Setup Wizard relaunch session!");
                          }}
                          className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                            isDark ? 'bg-transparent hover:bg-stone-800 border border-stone-800 text-amber-500' : 'bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700'
                          }`}
                        >
                          {t.relaunchWizard}
                        </button>

                        <button 
                          onClick={() => {
                            setOnboarded(false);
                            setCurrentTab('dashboard');
                            setOnboardingStep(1);
                            showToast("🔐 Securely logged out of Aria CRM Workspace!");
                          }}
                          className="flex-grow py-2.5 bg-red-600 hover:bg-red-550 text-white border border-red-700/20 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-500/10"
                        >
                          <LogOut size={12} />
                          <span>Close Workspace (Log Out)</span>
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              );
            })()}
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>

      {onboarded && (
        <FloatingChatbot 
          isDark={isDark}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          setOnboarded={setOnboarded}
          setOnboardingStep={setOnboardingStep}
          showToast={showToast}
          profile={profile}
          handleToggleTheme={handleToggleTheme}
          ariaName={ariaName}
          ariaTone={ariaTone}
          ariaAvatar={ariaAvatar}
        />
      )}

      <CookieBanner theme={isDark ? 'dark' : 'light'} />

      {/* SYSTEM COMMAND PALETTE OVERLAY */}
      <AnimatePresence>
        {commandPaletteOpen && (
          <CommandPalette 
            isOpen={commandPaletteOpen} 
            onClose={() => setCommandPaletteOpen(false)} 
            onTabChange={(tab) => {
              setCurrentTab(tab);
            }}
            theme={theme}
            onTriggerToast={showToast}
          />
        )}
      </AnimatePresence>

      {/* KEYBOARD SHORTCUTS REFERENCE OVERLAY */}
      <AnimatePresence>
        {shortcutsOpen && (
          <ShortcutsModal 
            isOpen={shortcutsOpen} 
            onClose={() => setShortcutsOpen(false)} 
            theme={theme}
          />
        )}
      </AnimatePresence>

      {/* AUDIT LOGSIDEBAR SLIDE OUT */}
      <AnimatePresence>
        {activityFeedOpen && (
          <ActivityFeedSidebar 
            isOpen={activityFeedOpen} 
            onClose={() => setActivityFeedOpen(false)} 
            theme={theme}
          />
        )}
      </AnimatePresence>

      {/* VOIP SIMULATION DIALER SCREEN */}
      <AnimatePresence>
        {telephonyOpen && (
          <TelephonyDialer 
            isOpen={telephonyOpen} 
            onClose={() => setTelephonyOpen(false)} 
            theme={theme}
            onTriggerToast={showToast}
          />
        )}
      </AnimatePresence>

      {/* AI DIY HELP CO-PILOT WIDGET */}
      <AnimatePresence>
        {helpCenterOpen && (
          <HelpCenterPanel 
            isOpen={helpCenterOpen} 
            onClose={() => setHelpCenterOpen(false)} 
            theme={theme}
            onStartTour={() => setActiveTourStep(0)}
          />
        )}
      </AnimatePresence>

      {/* COMPREHENSIVE INTERACTIVE TUTORIAL PATHWAY OVERLAY */}
      <AnimatePresence>
        {activeTourStep !== null && (
          <div className="fixed inset-0 z-250 pointer-events-none flex items-center justify-center p-4 select-none">
            {/* Ambient page dim helper for high focus */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/65 backdrop-blur-xs pointer-events-auto"
            />
            
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 30 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className={`relative z-10 w-full max-w-sm rounded-[28px] border p-5 shadow-2xl pointer-events-auto border-amber-500/35 backdrop-blur-lg ${
                theme === 'dark' ? 'bg-[#151311] text-white' : 'bg-white text-stone-900 shadow-stone-200/40'
              }`}
            >
              {/* Scanline Glowing Visual */}
              <div className="absolute top-0 inset-x-0 h-1 bg-amber-550 rounded-t-full shadow-[0_0_12px_#F59E0B]" />
              
              <div className="flex justify-between items-center pb-2.5 border-b border-stone-200 dark:border-stone-850 mb-3.5 select-none animate-fade-in">
                <div className="flex items-center gap-1.5 text-amber-500 font-mono text-[8.5px] font-black uppercase tracking-widest">
                  <Sparkles size={11} className="animate-spin-slow" />
                  <span>Quick Systems Tour</span>
                </div>
                <button
                  onClick={() => setActiveTourStep(null)}
                  className="p-1 rounded-md hover:bg-stone-100 dark:hover:bg-stone-850 text-stone-400 hover:text-stone-300 transition-colors cursor-pointer"
                  title="Close Tutorial"
                >
                  <X size={12} />
                </button>
              </div>

              {/* Progress steps bar */}
              <div className="flex items-center gap-1 mb-4 select-none">
                {[0, 1, 2, 3].map(stepIdx => (
                  <div 
                    key={stepIdx} 
                    className={`h-1 rounded-full transition-all flex-1 ${
                      activeTourStep === stepIdx ? 'bg-amber-500' :
                      activeTourStep > stepIdx ? 'bg-emerald-500' : 'bg-stone-250 dark:bg-stone-800'
                    }`}
                  />
                ))}
              </div>

              {/* Guided Info */}
              <div className="space-y-2.5">
                <span className="text-[8.5px] font-mono font-extrabold text-amber-550 uppercase tracking-widest block">
                  NODE STEP {activeTourStep + 1} OF 4 • {
                    activeTourStep === 0 ? "Operational Command Center" :
                    activeTourStep === 1 ? "ARIA AI Brain Intelligence" :
                    activeTourStep === 2 ? "Supply Genius replenishment" :
                    "Settings Config Control"
                  }
                </span>
                
                <h3 className="font-syne text-md font-black uppercase tracking-tight text-[#1C1917] dark:text-stone-105-0 text-white leading-tight">
                  {
                    activeTourStep === 0 ? "Master Dashboard bento" :
                    activeTourStep === 1 ? "ARIA AI Co-Pilot & Prompting" :
                    activeTourStep === 2 ? "Supply Delay Stress Simulator" :
                    "Unified Setup Config & Plans"
                  }
                </h3>
                
                <p className="text-[11.5px] text-stone-600 dark:text-stone-300 leading-relaxed font-semibold">
                  {
                    activeTourStep === 0 ? "Welcome! This is the primary Operational Hub. You can view overall churn risks, audit active profit leaks, and read unified live chats from WhatsApp, Instagram, or Telegram streamed directly onto the center bento panel!" :
                    activeTourStep === 1 ? "This is ARIA, your cognitive operational co-pilot. Write custom system guides, verify customer support templates, query database profiles, and edit auto-resolved messages beautifully." :
                    activeTourStep === 2 ? "Welcome to your warehouse buffer guard. Simulate delayed logistics using interactive ranges, track custom lost financial margins, and replenish levels easily without full page scrolls." :
                    "Manage email synchronized systems, edit team identity settings, choose subscription options, and configure operational API integrations all in one elegant, non-scrollable dashboard grid."
                  }
                </p>
              </div>

              {/* Action Toolbar */}
              <div className="flex justify-between items-center select-none pt-4 border-t border-stone-200 dark:border-stone-850 mt-4">
                <button
                  type="button"
                  onClick={() => setActiveTourStep(null)}
                  className="px-2 py-1 text-[9.5px] font-black uppercase text-stone-400 hover:text-stone-300 transition-colors cursor-pointer"
                >
                  Skip Tour
                </button>
                
                <div className="flex gap-1.5">
                  {activeTourStep > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveTourStep(prev => prev !== null ? prev - 1 : null)}
                      className="px-3 py-1.5 text-[9px] font-black bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-850 transition-all cursor-pointer uppercase text-stone-700 dark:text-stone-300"
                    >
                      Back
                    </button>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => {
                      if (activeTourStep < 3) {
                        setActiveTourStep(prev => prev !== null ? prev + 1 : null);
                      } else {
                        setActiveTourStep(null);
                        showToast("🎉 Walkthrough complete! Forge environment successfully synced.");
                      }
                    }}
                    className="px-4 py-1.5 text-[9px] font-black bg-amber-500 hover:bg-amber-440 text-black rounded-xl hover:shadow-lg hover:shadow-amber-500/10 transition-all cursor-pointer uppercase flex items-center gap-1"
                  >
                    <span>{activeTourStep === 3 ? "All Set!" : "Next Step"}</span>
                    <ArrowRight size={11} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* REAL-TIME SPEED ACTION FLOATING MENU WHEEL */}
      {onboarded && (
        <QuickActionButton 
          onTriggerToast={showToast}
          onOpenShortcuts={() => setShortcutsOpen(true)}
          onOpenAria={() => setCurrentTab('aria')}
          onSimulateSale={() => {
            showToast("💷 Simulation Sync: Synced custom £180 transaction lead into CRM ledger statistics.");
          }}
          theme={theme === 'dark' ? 'dark' : 'light'}
        />
      )}

      {/* ARIA FLOATING VERBAL COMPANION */}
      {onboarded && (
        <AriaFloatingCompanion 
          theme={theme === 'dark' ? 'dark' : 'light'}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          isSimulatingLive={isSimulatingLive}
          setIsSimulatingLive={setIsSimulatingLive}
          showToast={showToast}
        />
      )}

    </div>
  );
}
