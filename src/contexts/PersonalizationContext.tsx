import React, { createContext, useContext, useMemo } from 'react';
import { useVisitorTracking, VisitorType } from '@/hooks/useVisitorTracking';

interface PersonalizedContent {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaSecondaryText: string;
  valueProposition: string;
  urgencyMessage: string;
  socialProof: string;
  featureHighlight: string;
}

interface PersonalizationContextType {
  visitorType: VisitorType;
  intent: 'browsing' | 'researching' | 'converting';
  confidence: number;
  device: 'mobile' | 'tablet' | 'desktop';
  content: PersonalizedContent;
  trackClick: (elementType?: 'cta' | 'feature' | 'testimonial' | 'general') => void;
  trackPageVisit: (path: string) => void;
}

const contentByVisitorType: Record<VisitorType, PersonalizedContent> = {
  new: {
    headline: "Transform Your Images Into Viral Content",
    subheadline: "Upload any image and get 3-5 engaging social media captions instantly. Powered by Google Gemini AI with professional tone options.",
    ctaText: "Try It Free",
    ctaSecondaryText: "See How It Works",
    valueProposition: "Join thousands of creators already boosting their content",
    urgencyMessage: "",
    socialProof: "Join 10,000+ creators",
    featureHighlight: "AI-Powered Content Creation",
  },
  explorer: {
    headline: "Discover the Power of AI Captions",
    subheadline: "Curious how AI can transform your social media game? Upload any image and watch the magic happen — no commitment required.",
    ctaText: "Explore the Tool",
    ctaSecondaryText: "Watch Demo",
    valueProposition: "See why creators love our simple, powerful approach",
    urgencyMessage: "",
    socialProof: "Trusted by content creators worldwide",
    featureHighlight: "Easy to Start, Powerful Results",
  },
  comparer: {
    headline: "The Smartest Way to Create Captions",
    subheadline: "5 unique tones. Instant generation. Direct sharing to Twitter & LinkedIn. See why Ad Atelier AI outperforms the competition.",
    ctaText: "Compare Features",
    ctaSecondaryText: "View All Features",
    valueProposition: "Professional-quality captions without the professional price",
    urgencyMessage: "95% satisfaction rate from 10K+ users",
    socialProof: "Rated #1 by content creators",
    featureHighlight: "More Features, Better Results",
  },
  'action-taker': {
    headline: "Ready to Go Viral?",
    subheadline: "You know what you want. Get 3-5 perfect captions in seconds. Start creating now — no signup required.",
    ctaText: "Start Creating Now",
    ctaSecondaryText: "Get Started Free",
    valueProposition: "From image to viral post in under 60 seconds",
    urgencyMessage: "🔥 127 creators are generating captions right now",
    socialProof: "50K+ captions generated this month",
    featureHighlight: "Instant Results, Real Impact",
  },
};

const PersonalizationContext = createContext<PersonalizationContextType | undefined>(undefined);

export const PersonalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { visitorType, intent, confidence, device, trackClick, trackPageVisit } = useVisitorTracking();

  const content = useMemo(() => {
    return contentByVisitorType[visitorType];
  }, [visitorType]);

  const value = useMemo(() => ({
    visitorType,
    intent,
    confidence,
    device,
    content,
    trackClick,
    trackPageVisit,
  }), [visitorType, intent, confidence, device, content, trackClick, trackPageVisit]);

  return (
    <PersonalizationContext.Provider value={value}>
      {children}
    </PersonalizationContext.Provider>
  );
};

export const usePersonalization = () => {
  const context = useContext(PersonalizationContext);
  if (!context) {
    throw new Error('usePersonalization must be used within PersonalizationProvider');
  }
  return context;
};
