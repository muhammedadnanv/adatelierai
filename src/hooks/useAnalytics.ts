import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const SESSION_KEY = 'ad-atelier-session-id';

const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
};

const getDeviceType = (): string => {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

export const useAnalytics = () => {
  const location = useLocation();
  const previousPath = useRef<string | null>(null);

  const trackPageView = useCallback((path: string) => {
    supabase.from('page_views').insert({
      page_path: path,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
      screen_width: window.innerWidth,
      screen_height: window.innerHeight,
      device_type: getDeviceType(),
      session_id: getSessionId(),
      duration_seconds: 0,
    }).then(({ error }) => {
      if (error) console.error('Analytics error:', error.message);
    });
  }, []);

  useEffect(() => {
    const currentPath = location.pathname;
    if (previousPath.current === currentPath) return;
    previousPath.current = currentPath;
    trackPageView(currentPath);
  }, [location.pathname, trackPageView]);

  return { trackPageView };
};
