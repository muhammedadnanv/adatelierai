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
  // Contact form personalization
  contactHeadline: string;
  contactSubheadline: string;
  contactCTA: string;
  // Dashboard personalization
  dashboardGreeting: string;
  dashboardMotivation: string;
  dashboardTip: string;
  // Testimonial ordering priority
  testimonialPriority: 'social-proof' | 'features' | 'results';
  // Navigation labels
  navCTA: string;
}

interface PersonalizationContextType {
  visitorType: VisitorType;
  intent: 'browsing' | 'researching' | 'converting';
  confidence: number;
  device: 'mobile' | 'tablet' | 'desktop';
  content: PersonalizedContent;
  trackClick: (elementType?: 'cta' | 'feature' | 'testimonial' | 'general') => void;
  trackPageVisit: (path: string) => void;
  isReturningVisitor: boolean;
  sessionDuration: number;
  engagementLevel: 'low' | 'medium' | 'high';
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
    contactHeadline: "Let's Connect",
    contactSubheadline: "Have questions or ideas? We'd love to hear from you.",
    contactCTA: "Send Message",
    dashboardGreeting: "Welcome to Ad Atelier AI!",
    dashboardMotivation: "Let's create your first viral caption together.",
    dashboardTip: "Start by uploading an image to generate AI-powered captions.",
    testimonialPriority: 'social-proof',
    navCTA: "Get Started",
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
    contactHeadline: "Curious About Something?",
    contactSubheadline: "Explore our features or ask us anything — we're here to help.",
    contactCTA: "Ask a Question",
    dashboardGreeting: "Let's Explore Together!",
    dashboardMotivation: "Take your time — there's so much to discover.",
    dashboardTip: "Try different tones to see how AI adapts to your style.",
    testimonialPriority: 'features',
    navCTA: "Explore",
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
    contactHeadline: "Want to Know More?",
    contactSubheadline: "Have specific questions about features or pricing? Let's talk.",
    contactCTA: "Get Details",
    dashboardGreeting: "You Know What You Want",
    dashboardMotivation: "Let's show you why we're the best choice.",
    dashboardTip: "Compare our 5 unique tones — each designed for different platforms.",
    testimonialPriority: 'results',
    navCTA: "See Features",
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
    contactHeadline: "Ready for Partnership?",
    contactSubheadline: "Let's discuss how we can work together to amplify your success.",
    contactCTA: "Start Conversation",
    dashboardGreeting: "Let's Get to Work!",
    dashboardMotivation: "Your next viral post is just seconds away.",
    dashboardTip: "Pro tip: Use 'bold' tone for maximum engagement.",
    testimonialPriority: 'results',
    navCTA: "Start Now",
  },
};

const PersonalizationContext = createContext<PersonalizationContextType | undefined>(undefined);

export const PersonalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { visitorType, intent, confidence, device, trackClick, trackPageVisit, profile } = useVisitorTracking();

  const content = useMemo(() => {
    return contentByVisitorType[visitorType];
  }, [visitorType]);

  const isReturningVisitor = useMemo(() => {
    return profile.behavior.pagesVisited.length > 1 || profile.behavior.timeOnPage > 60;
  }, [profile.behavior.pagesVisited.length, profile.behavior.timeOnPage]);

  const sessionDuration = profile.behavior.timeOnPage;

  const engagementLevel = useMemo((): 'low' | 'medium' | 'high' => {
    const score = profile.behavior.engagementScore;
    if (score > 50) return 'high';
    if (score > 20) return 'medium';
    return 'low';
  }, [profile.behavior.engagementScore]);

  const value = useMemo(() => ({
    visitorType,
    intent,
    confidence,
    device,
    content,
    trackClick,
    trackPageVisit,
    isReturningVisitor,
    sessionDuration,
    engagementLevel,
  }), [visitorType, intent, confidence, device, content, trackClick, trackPageVisit, isReturningVisitor, sessionDuration, engagementLevel]);

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
