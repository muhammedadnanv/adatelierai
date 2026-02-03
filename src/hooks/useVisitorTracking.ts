import { useState, useEffect, useCallback, useRef } from 'react';

export type VisitorType = 'explorer' | 'comparer' | 'action-taker' | 'new';

interface VisitorBehavior {
  clicks: number;
  scrollDepth: number;
  timeOnPage: number;
  pagesVisited: string[];
  ctaClicks: number;
  featureViews: number;
  testimonialViews: number;
  lastActivity: number;
  device: 'mobile' | 'tablet' | 'desktop';
  sessionStart: number;
  engagementScore: number;
}

interface VisitorProfile {
  type: VisitorType;
  confidence: number;
  behavior: VisitorBehavior;
  intent: 'browsing' | 'researching' | 'converting';
}

const STORAGE_KEY = 'ad-atelier-visitor-profile';
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  if (typeof window === 'undefined') return 'desktop';
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

const getInitialBehavior = (): VisitorBehavior => ({
  clicks: 0,
  scrollDepth: 0,
  timeOnPage: 0,
  pagesVisited: [typeof window !== 'undefined' ? window.location.pathname : '/'],
  ctaClicks: 0,
  featureViews: 0,
  testimonialViews: 0,
  lastActivity: Date.now(),
  device: getDeviceType(),
  sessionStart: Date.now(),
  engagementScore: 0,
});

const loadStoredProfile = (): VisitorProfile | null => {
  try {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const profile = JSON.parse(stored) as VisitorProfile;
      // Reset if session is older than timeout
      if (Date.now() - profile.behavior.lastActivity > SESSION_TIMEOUT) {
        // Preserve some historical data for returning visitor detection
        return {
          type: 'new',
          confidence: 0,
          intent: 'browsing',
          behavior: {
            ...getInitialBehavior(),
            pagesVisited: profile.behavior.pagesVisited, // Keep history
          },
        };
      }
      return profile;
    }
  } catch (e) {
    console.error('Error loading visitor profile:', e);
  }
  return null;
};

// Classify visitor based on behavior patterns
const classifyVisitor = (behavior: VisitorBehavior): { type: VisitorType; confidence: number; intent: VisitorProfile['intent'] } => {
  const { clicks, scrollDepth, timeOnPage, ctaClicks, featureViews, testimonialViews, engagementScore } = behavior;
  
  // Calculate weighted scores for each visitor type
  let explorerScore = 0;
  let comparerScore = 0;
  let actionTakerScore = 0;

  // Time-based scoring
  if (timeOnPage < 30) {
    explorerScore += 2;
  } else if (timeOnPage < 90) {
    comparerScore += 2;
  } else {
    actionTakerScore += 1;
    comparerScore += 1;
  }

  // Scroll depth scoring
  if (scrollDepth > 80) {
    actionTakerScore += 3;
    comparerScore += 2;
  } else if (scrollDepth > 50) {
    comparerScore += 2;
    explorerScore += 1;
  } else if (scrollDepth > 20) {
    explorerScore += 2;
  }

  // Click behavior scoring
  if (clicks < 3) {
    explorerScore += 1;
  } else if (clicks < 8) {
    comparerScore += 2;
  } else {
    actionTakerScore += 2;
  }

  // CTA interaction scoring - strong signal
  if (ctaClicks > 0) {
    actionTakerScore += 4;
  }

  // Feature/testimonial views
  if (featureViews > 2) {
    comparerScore += 3;
  }
  if (testimonialViews > 0) {
    comparerScore += 2;
    actionTakerScore += 1;
  }

  // Engagement score multiplier
  if (engagementScore > 50) {
    actionTakerScore += 2;
  } else if (engagementScore > 25) {
    comparerScore += 1;
  }

  // Determine type and confidence
  const maxScore = Math.max(explorerScore, comparerScore, actionTakerScore);
  const totalScore = explorerScore + comparerScore + actionTakerScore;
  const confidence = totalScore > 0 ? Math.min((maxScore / totalScore) * 100, 95) : 0;

  let type: VisitorType = 'new';
  let intent: VisitorProfile['intent'] = 'browsing';

  if (maxScore < 3) {
    type = 'new';
    intent = 'browsing';
  } else if (explorerScore === maxScore) {
    type = 'explorer';
    intent = 'browsing';
  } else if (comparerScore === maxScore) {
    type = 'comparer';
    intent = 'researching';
  } else {
    type = 'action-taker';
    intent = 'converting';
  }

  return { type, confidence, intent };
};

export const useVisitorTracking = () => {
  const [profile, setProfile] = useState<VisitorProfile>(() => {
    const stored = loadStoredProfile();
    return stored || {
      type: 'new',
      confidence: 0,
      behavior: getInitialBehavior(),
      intent: 'browsing',
    };
  });

  const timeRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollRef = useRef<number>(0);
  const isInitializedRef = useRef(false);

  // Update behavior and reclassify
  const updateBehavior = useCallback((updates: Partial<VisitorBehavior>) => {
    setProfile(prev => {
      const engagementIncrease = 
        (updates.clicks ? updates.clicks * 2 : 0) + 
        (updates.ctaClicks ? updates.ctaClicks * 5 : 0);
      
      const newBehavior: VisitorBehavior = {
        ...prev.behavior,
        ...updates,
        lastActivity: Date.now(),
        engagementScore: prev.behavior.engagementScore + engagementIncrease,
      };
      
      const classification = classifyVisitor(newBehavior);
      
      const newProfile: VisitorProfile = {
        ...prev,
        ...classification,
        behavior: newBehavior,
      };
      
      // Persist to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
      } catch (e) {
        console.error('Error saving visitor profile:', e);
      }
      
      return newProfile;
    });
  }, []);

  // Track clicks with element type
  const trackClick = useCallback((elementType?: 'cta' | 'feature' | 'testimonial' | 'general') => {
    setProfile(prev => {
      const updates: Partial<VisitorBehavior> = { 
        clicks: prev.behavior.clicks + 1 
      };
      
      if (elementType === 'cta') {
        updates.ctaClicks = prev.behavior.ctaClicks + 1;
      } else if (elementType === 'feature') {
        updates.featureViews = prev.behavior.featureViews + 1;
      } else if (elementType === 'testimonial') {
        updates.testimonialViews = prev.behavior.testimonialViews + 1;
      }
      
      const engagementIncrease = 2 + (elementType === 'cta' ? 5 : 0);
      
      const newBehavior: VisitorBehavior = {
        ...prev.behavior,
        ...updates,
        lastActivity: Date.now(),
        engagementScore: prev.behavior.engagementScore + engagementIncrease,
      };
      
      const classification = classifyVisitor(newBehavior);
      
      const newProfile: VisitorProfile = {
        ...prev,
        ...classification,
        behavior: newBehavior,
      };
      
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
      } catch (e) {
        console.error('Error saving visitor profile:', e);
      }
      
      return newProfile;
    });
  }, []);

  // Track page navigation
  const trackPageVisit = useCallback((path: string) => {
    setProfile(prev => {
      if (prev.behavior.pagesVisited.includes(path)) {
        return prev;
      }
      
      const newBehavior: VisitorBehavior = {
        ...prev.behavior,
        pagesVisited: [...prev.behavior.pagesVisited, path],
        lastActivity: Date.now(),
        engagementScore: prev.behavior.engagementScore + 3,
      };
      
      const classification = classifyVisitor(newBehavior);
      
      const newProfile: VisitorProfile = {
        ...prev,
        ...classification,
        behavior: newBehavior,
      };
      
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
      } catch (e) {
        console.error('Error saving visitor profile:', e);
      }
      
      return newProfile;
    });
  }, []);

  // Track scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);
      
      // Only update if scroll increased significantly (every 10%)
      if (scrollPercent > scrollRef.current + 10) {
        scrollRef.current = scrollPercent;
        updateBehavior({ scrollDepth: scrollPercent });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [updateBehavior]);

  // Track time on page
  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;
    
    timeRef.current = setInterval(() => {
      setProfile(prev => {
        const timeOnPage = Math.floor((Date.now() - prev.behavior.sessionStart) / 1000);
        
        // Only update every 10 seconds worth of time
        if (timeOnPage - prev.behavior.timeOnPage < 10) {
          return prev;
        }
        
        const newBehavior: VisitorBehavior = {
          ...prev.behavior,
          timeOnPage,
          lastActivity: Date.now(),
        };
        
        const classification = classifyVisitor(newBehavior);
        
        const newProfile: VisitorProfile = {
          ...prev,
          ...classification,
          behavior: newBehavior,
        };
        
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
        } catch (e) {
          console.error('Error saving visitor profile:', e);
        }
        
        return newProfile;
      });
    }, 10000); // Update every 10 seconds

    return () => {
      if (timeRef.current) clearInterval(timeRef.current);
    };
  }, []);

  // Track page visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setProfile(prev => ({
          ...prev,
          behavior: {
            ...prev.behavior,
            lastActivity: Date.now(),
          },
        }));
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Track device resize
  useEffect(() => {
    const handleResize = () => {
      const newDevice = getDeviceType();
      setProfile(prev => {
        if (prev.behavior.device === newDevice) return prev;
        return {
          ...prev,
          behavior: {
            ...prev.behavior,
            device: newDevice,
          },
        };
      });
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    profile,
    trackClick,
    trackPageVisit,
    visitorType: profile.type,
    intent: profile.intent,
    confidence: profile.confidence,
    device: profile.behavior.device,
    updateBehavior,
  };
};
