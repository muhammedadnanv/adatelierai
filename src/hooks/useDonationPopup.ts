import { useState, useEffect } from 'react';

interface DonationPopupSettings {
  enabled: boolean;
  initialDelay: number; // milliseconds
  repeatInterval: number; // milliseconds
  maxDismissals: number;
  sessionTimeout: number; // milliseconds
}

const DEFAULT_SETTINGS: DonationPopupSettings = {
  enabled: true,
  initialDelay: 60000, // 1 minute
  repeatInterval: 300000, // 5 minutes
  maxDismissals: 3,
  sessionTimeout: 3600000, // 1 hour
};

export const useDonationPopup = (settings: Partial<DonationPopupSettings> = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  
  // Load user settings from localStorage
  const loadUserSettings = (): DonationPopupSettings => {
    try {
      const savedSettings = localStorage.getItem('donation-popup-settings');
      const userSettings = savedSettings ? JSON.parse(savedSettings) : {};
      return { ...DEFAULT_SETTINGS, ...userSettings, ...settings };
    } catch (error) {
      console.error('Error loading donation popup settings:', error);
      return { ...DEFAULT_SETTINGS, ...settings };
    }
  };
  
  const config = loadUserSettings();

  useEffect(() => {
    // Check if popup should be disabled
    const lastDismissed = localStorage.getItem('donation-popup-last-dismissed');
    const dismissCount = parseInt(localStorage.getItem('donation-popup-dismiss-count') || '0');
    const sessionStart = localStorage.getItem('donation-popup-session-start');
    
    const now = Date.now();
    
    // Set session start if not exists
    if (!sessionStart) {
      localStorage.setItem('donation-popup-session-start', now.toString());
    }
    
    // Check if we've exceeded max dismissals
    if (dismissCount >= config.maxDismissals) {
      setIsEnabled(false);
      return;
    }
    
    // Check if we're within session timeout of last dismissal
    if (lastDismissed && (now - parseInt(lastDismissed)) < config.sessionTimeout) {
      setIsEnabled(false);
      return;
    }
    
    if (!config.enabled || !isEnabled) return;

    // Set initial timer
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, config.initialDelay);

    return () => clearTimeout(initialTimer);
  }, [config.enabled, config.initialDelay, config.sessionTimeout, config.maxDismissals, isEnabled]);

  useEffect(() => {
    if (!isVisible || !config.enabled || !isEnabled) return;

    // Set repeat timer after popup is shown
    const repeatTimer = setTimeout(() => {
      setIsVisible(true);
    }, config.repeatInterval);

    return () => clearTimeout(repeatTimer);
  }, [isVisible, config.enabled, config.repeatInterval, isEnabled]);

  const dismissPopup = (temporarily: boolean = false) => {
    setIsVisible(false);
    
    const now = Date.now();
    localStorage.setItem('donation-popup-last-dismissed', now.toString());
    
    if (temporarily) {
      const dismissCount = parseInt(localStorage.getItem('donation-popup-dismiss-count') || '0');
      localStorage.setItem('donation-popup-dismiss-count', (dismissCount + 1).toString());
      
      // If max dismissals reached, disable for session
      if (dismissCount + 1 >= config.maxDismissals) {
        setIsEnabled(false);
      }
    } else {
      // Permanent dismissal - disable for extended period
      localStorage.setItem('donation-popup-dismiss-count', config.maxDismissals.toString());
      setIsEnabled(false);
    }
  };

  const resetPopupSettings = () => {
    localStorage.removeItem('donation-popup-last-dismissed');
    localStorage.removeItem('donation-popup-dismiss-count');
    localStorage.removeItem('donation-popup-session-start');
    setIsEnabled(true);
  };

  return {
    isVisible,
    dismissPopup,
    resetPopupSettings,
    isEnabled,
  };
};