import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Shield, CircleHelp, ChevronDown, ChevronUp } from 'lucide-react';

interface CookieModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAcceptAll: () => void;
  onRejectAllNonEssential: () => void;
  onSavePreferences: (prefs: { analytics: boolean; marketing: boolean; functional: boolean }) => void;
  currentPrefs: { analytics: boolean; marketing: boolean; functional: boolean };
  theme?: 'light' | 'dark';
}

export default function CookieModal({
  isOpen,
  onClose,
  onAcceptAll,
  onRejectAllNonEssential,
  onSavePreferences,
  currentPrefs,
  theme = 'light'
}: CookieModalProps) {
  // Temporary preference states
  const [analytics, setAnalytics] = useState(currentPrefs.analytics);
  const [marketing, setMarketing] = useState(currentPrefs.marketing);
  const [functional, setFunctional] = useState(currentPrefs.functional);

  // Accordion open states
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(prev => (prev === section ? null : section));
  };

  const handleSave = () => {
    onSavePreferences({ analytics, marketing, functional });
    onClose();
  };

  const isDark = theme === 'dark';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-150 flex items-center justify-center p-4">
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-[4px]"
            id="cookie-modal-backdrop"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className={`relative w-full max-w-xl rounded-2xl border p-6 shadow-2xl z-10 font-sans ${
              isDark 
                ? 'bg-[#1C1917] border-stone-800 text-stone-100' 
                : 'bg-white border-stone-200 text-stone-900'
            }`}
            id="cookie-preference-modal"
          >
            {/* Header */}
            <div className="flex justify-between items-start pb-4 border-b border-stone-200/60 dark:border-stone-800/60">
              <div>
                <h3 className="font-syne text-lg font-extrabold tracking-tight uppercase flex items-center gap-2">
                  <Shield size={20} className="text-amber-500 shrink-0" />
                  Manage Cookie Preferences
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Control which cookies we use. Necessary cookies are required for the platform to function.
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-850 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-all cursor-pointer"
                aria-label="Close preferences"
                id="cookie-preferences-close-btn"
              >
                <X size={16} />
              </button>
            </div>

            {/* Accordion Categories */}
            <div className="py-4 space-y-3 overflow-y-auto max-h-[350px] pr-1">
              
              {/* Category 1: Necessary */}
              <div className={`rounded-xl border p-3.5 transition-all ${
                isDark ? 'border-stone-800 bg-[#292524]/20' : 'border-stone-200 bg-stone-50/50'
              }`}>
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => toggleSection('necessary')}
                    className="flex-1 text-left flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-stone-700 dark:text-stone-200 focus:outline-none cursor-pointer"
                    id="cookie-sec-necessary"
                  >
                    <span>Necessary Cookies</span>
                    {expandedSection === 'necessary' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/15 text-[9px] font-mono font-black uppercase">
                    Always Active
                  </span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1.5 leading-relaxed">
                  These cookies are essential for the platform to function properly. They enable security features, session tracking, and direct configuration preferences.
                </p>

                {expandedSection === 'necessary' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="mt-3 pt-3 border-t border-dashed border-stone-205 dark:border-stone-800 space-y-2 text-[11px] font-mono"
                  >
                    <div className="flex justify-between">
                      <span className="text-stone-450 font-bold">session_token</span>
                      <span className="text-stone-500 dark:text-stone-400">User session authentication</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-450 font-bold">csrf_token</span>
                      <span className="text-stone-500 dark:text-stone-400">Platform anti-forge security protection</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-450 font-bold">lang_pref</span>
                      <span className="text-stone-500 dark:text-stone-400">Owner regional settings language</span>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Category 2: Analytics */}
              <div className={`rounded-xl border p-3.5 transition-all ${
                isDark ? 'border-stone-800 bg-[#292524]/20' : 'border-stone-200 bg-stone-50/50'
              }`}>
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => toggleSection('analytics')}
                    className="flex-1 text-left flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-stone-700 dark:text-stone-200 focus:outline-none cursor-pointer"
                    id="cookie-sec-analytics"
                  >
                    <span>Analytics Cookies</span>
                    {expandedSection === 'analytics' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={analytics}
                      onChange={(e) => setAnalytics(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-stone-300 dark:bg-stone-750 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:height after:h-3 after:w-3.5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1.5 leading-relaxed">
                  Help us understand how customers engage with our platform, track feature adoption rates, and log performance errors so we can build better metrics.
                </p>

                {expandedSection === 'analytics' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="mt-3 pt-3 border-t border-dashed border-stone-205 dark:border-stone-800 space-y-2 text-[11px] font-mono"
                  >
                    <div className="flex justify-between">
                      <span className="text-stone-450 font-bold">_analytics</span>
                      <span className="text-stone-500 dark:text-stone-400">Anonymized user habit logs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-450 font-bold">performance</span>
                      <span className="text-stone-500 dark:text-stone-400">Core engine loading statistics</span>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Category 3: Marketing */}
              <div className={`rounded-xl border p-3.5 transition-all ${
                isDark ? 'border-stone-800 bg-[#292524]/20' : 'border-stone-200 bg-stone-50/50'
              }`}>
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => toggleSection('marketing')}
                    className="flex-1 text-left flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-stone-700 dark:text-stone-200 focus:outline-none cursor-pointer"
                    id="cookie-sec-marketing"
                  >
                    <span>Marketing Cookies</span>
                    {expandedSection === 'marketing' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={marketing}
                      onChange={(e) => setMarketing(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-stone-300 dark:bg-stone-750 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:height after:h-3 after:w-3.5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1.5 leading-relaxed">
                  Allow us to run personalized campaigns, track subscription metrics, and optimize feature suggestions to grow conversions.
                </p>

                {expandedSection === 'marketing' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="mt-3 pt-3 border-t border-dashed border-stone-205 dark:border-stone-800 space-y-2 text-[11px] font-mono"
                  >
                    <div className="flex justify-between">
                      <span className="text-stone-450 font-bold">campaign_id</span>
                      <span className="text-stone-500 dark:text-stone-400">Marketing attribution path tracker</span>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Category 4: Functional */}
              <div className={`rounded-xl border p-3.5 transition-all ${
                isDark ? 'border-stone-800 bg-[#292524]/20' : 'border-stone-200 bg-stone-50/50'
              }`}>
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => toggleSection('functional')}
                    className="flex-1 text-left flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-stone-700 dark:text-stone-200 focus:outline-none cursor-pointer"
                    id="cookie-sec-functional"
                  >
                    <span>Functional Cookies</span>
                    {expandedSection === 'functional' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={functional}
                      onChange={(e) => setFunctional(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-stone-300 dark:bg-stone-750 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:height after:h-3 after:w-3.5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1.5 leading-relaxed">
                  Provide custom capability memories such as holding sidebar status configuration, dashboard panel layouts, and operational chatbot voice selection.
                </p>

                {expandedSection === 'functional' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="mt-3 pt-3 border-t border-dashed border-stone-205 dark:border-stone-800 space-y-2 text-[11px] font-mono"
                  >
                    <div className="flex justify-between">
                      <span className="text-stone-450 font-bold">interface_pref</span>
                      <span className="text-stone-500 dark:text-stone-400">Stores light/dark mode preference</span>
                    </div>
                  </motion.div>
                )}
              </div>

            </div>

            {/* Footer buttons */}
            <div className="flex flex-col sm:flex-row gap-2 mt-4 pt-4 border-t border-stone-200/60 dark:border-stone-800/60 justify-end">
              <button
                onClick={onRejectAllNonEssential}
                className={`order-3 sm:order-1 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  isDark ? 'hover:bg-stone-850 text-stone-450' : 'hover:bg-stone-100 text-stone-500'
                }`}
                id="cookie-preferences-reject-btn"
              >
                Reject Non-Essential
              </button>
              
              <button
                onClick={onAcceptAll}
                className={`order-2 sm:order-2 px-4 py-2 rounded-xl text-xs font-semibold border cursor-pointer transition-all ${
                  isDark 
                    ? 'border-amber-500/20 text-amber-400 hover:bg-amber-500/5' 
                    : 'border-amber-200 text-amber-700 hover:bg-amber-50'
                }`}
                id="cookie-preferences-accept-all-btn"
              >
                Accept All Cookies
              </button>

              <button
                onClick={handleSave}
                className="order-1 sm:order-3 px-5 py-2 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-400 text-black shadow-md shadow-amber-500/10 cursor-pointer transition-all"
                id="cookie-preferences-save-btn"
              >
                Save My Preferences
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
