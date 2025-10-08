import { useState, useEffect } from 'react';

interface AdvertisementPopupSettings {
  enabled: boolean;
  initialDelay: number; // milliseconds before first show
  repeatInterval: number; // milliseconds between shows
  maxDismissals: number; // maximum times user can dismiss before disabling
  sessionTimeout: number; // milliseconds before resetting dismissal count
}

const DEFAULT_SETTINGS: AdvertisementPopupSettings = {
  enabled: true,
  initialDelay: 30000, // 30 seconds
  repeatInterval: 900000, // 15 minutes
  maxDismissals: 3,
  sessionTimeout: 3600000, // 1 hour
};

export const useAdvertisementPopup = (settings: Partial<AdvertisementPopupSettings> = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);

  const mergedSettings = { ...DEFAULT_SETTINGS, ...settings };

  useEffect(() => {
    // Load saved settings from localStorage
    const savedEnabled = localStorage.getItem('ad-popup-enabled');
    const dismissalCount = parseInt(localStorage.getItem('ad-popup-dismissals') || '0', 10);
    const lastDismissalTime = parseInt(localStorage.getItem('ad-popup-last-dismissal') || '0', 10);
    const currentTime = Date.now();

    // Check if session timeout has passed, reset dismissal count
    if (currentTime - lastDismissalTime > mergedSettings.sessionTimeout) {
      localStorage.setItem('ad-popup-dismissals', '0');
    }

    // Check if popup is disabled
    if (savedEnabled === 'false' || dismissalCount >= mergedSettings.maxDismissals) {
      setIsEnabled(false);
      return;
    }

    // Initial delay before showing popup
    const initialTimer = setTimeout(() => {
      if (mergedSettings.enabled) {
        setIsVisible(true);
      }
    }, mergedSettings.initialDelay);

    return () => clearTimeout(initialTimer);
  }, [mergedSettings.enabled, mergedSettings.initialDelay, mergedSettings.maxDismissals, mergedSettings.sessionTimeout]);

  // Repeat interval - show popup again after it's been dismissed
  useEffect(() => {
    if (!isVisible || !isEnabled) return;

    const repeatTimer = setTimeout(() => {
      const dismissalCount = parseInt(localStorage.getItem('ad-popup-dismissals') || '0', 10);
      if (dismissalCount < mergedSettings.maxDismissals) {
        setIsVisible(true);
      }
    }, mergedSettings.repeatInterval);

    return () => clearTimeout(repeatTimer);
  }, [isVisible, isEnabled, mergedSettings.repeatInterval, mergedSettings.maxDismissals]);

  const dismissPopup = (permanently: boolean = false) => {
    setIsVisible(false);

    const dismissalCount = parseInt(localStorage.getItem('ad-popup-dismissals') || '0', 10);
    const newDismissalCount = dismissalCount + 1;

    localStorage.setItem('ad-popup-dismissals', newDismissalCount.toString());
    localStorage.setItem('ad-popup-last-dismissal', Date.now().toString());

    if (permanently || newDismissalCount >= mergedSettings.maxDismissals) {
      localStorage.setItem('ad-popup-enabled', 'false');
      setIsEnabled(false);
    }
  };

  const resetPopupSettings = () => {
    localStorage.removeItem('ad-popup-enabled');
    localStorage.removeItem('ad-popup-dismissals');
    localStorage.removeItem('ad-popup-last-dismissal');
    setIsEnabled(true);
  };

  return {
    isVisible,
    dismissPopup,
    resetPopupSettings,
    isEnabled,
  };
};
