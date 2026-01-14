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

const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

const getInitialBehavior = (): VisitorBehavior => ({
  clicks: 0,
  scrollDepth: 0,
  timeOnPage: 0,
  pagesVisited: [window.location.pathname],
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
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const profile = JSON.parse(stored);
      // Reset if session is older than 30 minutes
      if (Date.now() - profile.behavior.lastActivity > 30 * 60 * 1000) {
        return null;
      }
      return profile;
    }
  } catch (e) {
    console.error('Error loading visitor profile:', e);
  }
  return null;
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

  const timeRef = useRef<NodeJS.Timeout | null>(null);
  const scrollRef = useRef<number>(0);

  // Classify visitor based on behavior
  const classifyVisitor = useCallback((behavior: VisitorBehavior): { type: VisitorType; confidence: number; intent: VisitorProfile['intent'] } => {
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

    // CTA interaction scoring
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
  }, []);

  // Update behavior and reclassify
  const updateBehavior = useCallback((updates: Partial<VisitorBehavior>) => {
    setProfile(prev => {
      const newBehavior = {
        ...prev.behavior,
        ...updates,
        lastActivity: Date.now(),
        engagementScore: prev.behavior.engagementScore + (updates.clicks || 0) * 2 + (updates.ctaClicks || 0) * 5,
      };
      const classification = classifyVisitor(newBehavior);
      
      const newProfile = {
        ...prev,
        ...classification,
        behavior: newBehavior,
      };
      
      // Persist to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
      
      return newProfile;
    });
  }, [classifyVisitor]);

  // Track clicks
  const trackClick = useCallback((elementType?: 'cta' | 'feature' | 'testimonial' | 'general') => {
    const updates: Partial<VisitorBehavior> = { clicks: profile.behavior.clicks + 1 };
    
    if (elementType === 'cta') {
      updates.ctaClicks = profile.behavior.ctaClicks + 1;
    } else if (elementType === 'feature') {
      updates.featureViews = profile.behavior.featureViews + 1;
    } else if (elementType === 'testimonial') {
      updates.testimonialViews = profile.behavior.testimonialViews + 1;
    }
    
    updateBehavior(updates);
  }, [profile.behavior, updateBehavior]);

  // Track page navigation
  const trackPageVisit = useCallback((path: string) => {
    if (!profile.behavior.pagesVisited.includes(path)) {
      updateBehavior({
        pagesVisited: [...profile.behavior.pagesVisited, path],
      });
    }
  }, [profile.behavior.pagesVisited, updateBehavior]);

  // Track scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);
      
      if (scrollPercent > scrollRef.current) {
        scrollRef.current = scrollPercent;
        updateBehavior({ scrollDepth: scrollPercent });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [updateBehavior]);

  // Track time on page
  useEffect(() => {
    timeRef.current = setInterval(() => {
      updateBehavior({
        timeOnPage: Math.floor((Date.now() - profile.behavior.sessionStart) / 1000),
      });
    }, 5000);

    return () => {
      if (timeRef.current) clearInterval(timeRef.current);
    };
  }, [profile.behavior.sessionStart, updateBehavior]);

  // Track page visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        updateBehavior({ lastActivity: Date.now() });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [updateBehavior]);

  return {
    profile,
    trackClick,
    trackPageVisit,
    visitorType: profile.type,
    intent: profile.intent,
    confidence: profile.confidence,
    device: profile.behavior.device,
  };
};
