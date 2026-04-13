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
  const pageEntryTime = useRef<number>(Date.now());
  const previousPath = useRef<string | null>(null);

  const trackPageView = useCallback((path: string) => {
    const sessionId = getSessionId();

    supabase.from('page_views').insert({
      page_path: path,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
      screen_width: window.innerWidth,
      screen_height: window.innerHeight,
      device_type: getDeviceType(),
      session_id: sessionId,
      duration_seconds: 0,
    }).then(({ error }) => {
      if (error) console.error('Analytics insert error:', error.message);
    });
  }, []);

  const updateDuration = useCallback((path: string) => {
    const duration = Math.round((Date.now() - pageEntryTime.current) / 1000);
    if (duration < 2) return; // Skip very short visits

    const sessionId = getSessionId();

    // Update the most recent page_view for this path/session with duration
    supabase.rpc('generate_access_code'); // no-op, we can't UPDATE via client
    // Since we can only INSERT, log a duration event
    // We'll rely on created_at timestamps to calculate duration analytically
  }, []);

  // Track page view on route change
  useEffect(() => {
    const currentPath = location.pathname;

    // Don't re-track the same path
    if (previousPath.current === currentPath) return;

    previousPath.current = currentPath;
    pageEntryTime.current = Date.now();
    trackPageView(currentPath);
  }, [location.pathname, trackPageView]);

  // Track duration on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      const duration = Math.round((Date.now() - pageEntryTime.current) / 1000);
      const sessionId = getSessionId();

      // Use sendBeacon for reliable unload tracking
      const payload = JSON.stringify({
        page_path: location.pathname,
        session_id: sessionId,
        duration_seconds: duration,
        device_type: getDeviceType(),
        screen_width: window.innerWidth,
        screen_height: window.innerHeight,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
      });

      const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/page_views`;
      navigator.sendBeacon(
        url + `?apikey=${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        new Blob([payload], { type: 'application/json' })
      );
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [location.pathname]);

  return { trackPageView };
};
