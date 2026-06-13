import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Cookie } from 'lucide-react';
import CookieModal from './CookieModal';

interface CookieBannerProps {
  theme?: 'light' | 'dark';
}

export default function CookieBanner({ theme = 'light' }: CookieBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [preferences, setPreferences] = useState({
    analytics: true,
    marketing: false,
    functional: true
  });

  useEffect(() => {
    // Check if user has already declared cookie preferences
    const cachedConsent = localStorage.getItem('omni_cookie_consent');
    if (!cachedConsent) {
      // Trigger slide up after a short delay on initial launch
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      try {
        const parsed = JSON.parse(cachedConsent);
        setPreferences(parsed);
      } catch (e) {
        // Fallback
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allPrefs = { analytics: true, marketing: true, functional: true };
    localStorage.setItem('omni_cookie_consent', JSON.stringify(allPrefs));
    setPreferences(allPrefs);
    setIsVisible(false);
    setIsModalOpen(false);
  };

  const handleRejectAllNonEssential = () => {
    const minPrefs = { analytics: false, marketing: false, functional: false };
    localStorage.setItem('omni_cookie_consent', JSON.stringify(minPrefs));
    setPreferences(minPrefs);
    setIsVisible(false);
    setIsModalOpen(false);
  };

  const handleSavePreferences = (newPrefs: { analytics: boolean; marketing: boolean; functional: boolean }) => {
    localStorage.setItem('omni_cookie_consent', JSON.stringify(newPrefs));
    setPreferences(newPrefs);
    setIsVisible(false);
  };

  const isDark = theme === 'dark';

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: 150, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 150, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 180 }}
            className={`fixed bottom-0 left-0 right-0 z-140 border-t-3 border-amber-500 shadow-[0_-15px_30px_rgba(12,10,9,0.06)] px-5 py-4 font-sans ${
              isDark 
                ? 'bg-[#1C1917] text-stone-100 border-stone-850' 
                : 'bg-white text-stone-900 border-stone-100'
            }`}
            id="cookie-consent-banner"
          >
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              
              {/* Left Side: Information */}
              <div className="flex items-start gap-3.5 flex-1">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 shrink-0 mt-0.5">
                  <Cookie size={18} className="animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-syne text-[11px] font-black uppercase tracking-wider text-stone-905 dark:text-white">
                      We value your privacy
                    </span>
                    <span className="text-[9px] font-bold py-0.5 px-2 bg-amber-500/10 text-amber-500 rounded-full border border-amber-500/20">
                      GDPR Compliant
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed max-w-4xl">
                    We use cookies to improve your user experience, analyze store operations usage patterns, and serve custom AI recommendations. You can control exactly what we collect under GDPR guidelines.{' '}
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="text-amber-500 hover:text-amber-400 font-semibold underline bg-transparent border-none p-0 cursor-pointer text-xs"
                      id="cookie-banner-learn-more-link"
                    >
                      Learn more and customize.
                    </button>
                  </p>
                </div>
              </div>

              {/* Right Side: Options Call-to-actions */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full lg:w-auto justify-end border-t lg:border-t-0 border-stone-200 dark:border-stone-800/65 pt-3 lg:pt-0">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                    isDark ? 'hover:bg-stone-850 text-stone-400' : 'hover:bg-stone-100 text-stone-500'
                  }`}
                  id="cookie-banner-manage-btn"
                >
                  Manage Preferences
                </button>

                <button
                  onClick={handleRejectAllNonEssential}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border cursor-pointer transition-all ${
                    isDark ? 'border-stone-800 hover:bg-stone-850 text-stone-300' : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                  id="cookie-banner-reject-btn"
                >
                  Reject All
                </button>

                <button
                  onClick={handleAcceptAll}
                  className="px-5 py-2 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-400 text-black shadow-md shadow-amber-500/10 cursor-pointer transition-all"
                  id="cookie-banner-accept-all-btn"
                >
                  Accept All Cookies
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CookieModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAcceptAll={handleAcceptAll}
        onRejectAllNonEssential={handleRejectAllNonEssential}
        onSavePreferences={handleSavePreferences}
        currentPrefs={preferences}
        theme={theme}
      />
    </>
  );
}
