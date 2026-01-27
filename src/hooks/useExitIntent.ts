import { useState, useEffect, useCallback } from 'react';

interface ExitIntentOptions {
  threshold?: number; // How far from top to trigger (pixels)
  delayBeforeShow?: number; // Minimum time on page before showing (ms)
  cooldownPeriod?: number; // Time before showing again (ms)
}

const STORAGE_KEY = 'exit-intent-shown';

export const useExitIntent = (options: ExitIntentOptions = {}) => {
  const {
    threshold = 50,
    delayBeforeShow = 5000, // 5 seconds minimum on page
    cooldownPeriod = 86400000, // 24 hours
  } = options;

  const [showExitIntent, setShowExitIntent] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [pageLoadTime] = useState(Date.now());

  const checkCooldown = useCallback(() => {
    const lastShown = localStorage.getItem(STORAGE_KEY);
    if (lastShown) {
      const timeSinceLastShow = Date.now() - parseInt(lastShown, 10);
      return timeSinceLastShow < cooldownPeriod;
    }
    return false;
  }, [cooldownPeriod]);

  const handleMouseLeave = useCallback((e: MouseEvent) => {
    // Check if mouse is leaving from the top of the viewport
    if (e.clientY <= threshold && !hasTriggered) {
      const timeOnPage = Date.now() - pageLoadTime;
      
      // Only trigger if user has been on page long enough and cooldown passed
      if (timeOnPage >= delayBeforeShow && !checkCooldown()) {
        setShowExitIntent(true);
        setHasTriggered(true);
        localStorage.setItem(STORAGE_KEY, Date.now().toString());
      }
    }
  }, [threshold, hasTriggered, pageLoadTime, delayBeforeShow, checkCooldown]);

  const dismissExitIntent = useCallback(() => {
    setShowExitIntent(false);
  }, []);

  const resetExitIntent = useCallback(() => {
    setHasTriggered(false);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  useEffect(() => {
    // Only add listener on desktop (exit intent doesn't work well on mobile)
    if (window.innerWidth >= 768) {
      document.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseLeave]);

  // Also detect rapid scroll up (mobile alternative)
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let rapidScrollCount = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDiff = lastScrollY - currentScrollY;
      
      // Detect rapid upward scroll
      if (scrollDiff > 100 && currentScrollY < 200) {
        rapidScrollCount++;
        if (rapidScrollCount >= 2 && !hasTriggered) {
          const timeOnPage = Date.now() - pageLoadTime;
          if (timeOnPage >= delayBeforeShow && !checkCooldown()) {
            setShowExitIntent(true);
            setHasTriggered(true);
            localStorage.setItem(STORAGE_KEY, Date.now().toString());
          }
        }
      } else {
        rapidScrollCount = 0;
      }
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasTriggered, pageLoadTime, delayBeforeShow, checkCooldown]);

  return {
    showExitIntent,
    dismissExitIntent,
    resetExitIntent,
    hasTriggered,
  };
};
