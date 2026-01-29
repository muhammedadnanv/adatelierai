import { useState, useEffect } from 'react';
import { X, Sparkles, History, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePersonalization } from '@/contexts/PersonalizationContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface WelcomeBackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WELCOME_BACK_STORAGE_KEY = 'welcome-back-shown';
const WELCOME_BACK_COOLDOWN = 3600000; // 1 hour

export const useWelcomeBack = () => {
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);
  const { isReturningVisitor, sessionDuration } = usePersonalization();

  useEffect(() => {
    // Check if this is a returning visitor and we haven't shown the modal recently
    const lastShown = localStorage.getItem(WELCOME_BACK_STORAGE_KEY);
    const now = Date.now();
    
    if (isReturningVisitor && sessionDuration < 5) {
      if (!lastShown || now - parseInt(lastShown, 10) > WELCOME_BACK_COOLDOWN) {
        // Small delay before showing
        const timer = setTimeout(() => {
          setShowWelcomeBack(true);
          localStorage.setItem(WELCOME_BACK_STORAGE_KEY, now.toString());
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [isReturningVisitor, sessionDuration]);

  const dismissWelcomeBack = () => {
    setShowWelcomeBack(false);
  };

  return { showWelcomeBack, dismissWelcomeBack };
};

const WelcomeBackModal = ({ isOpen, onClose }: WelcomeBackModalProps) => {
  const { visitorType, content, engagementLevel, sessionDuration, trackClick } = usePersonalization();

  // Get personalized recommendations based on history
  const getPersonalizedRecommendations = () => {
    const baseRecommendations = [
      {
        icon: TrendingUp,
        title: "Trending Tones",
        description: "Bold & Witty are hot right now",
        action: "Try trending tones",
      },
      {
        icon: Clock,
        title: "Quick Generate",
        description: "Continue where you left off",
        action: "Resume creating",
      },
      {
        icon: Sparkles,
        title: "New Feature",
        description: "Multi-platform optimization",
        action: "Explore now",
      },
    ];

    // Customize based on engagement level
    if (engagementLevel === 'high') {
      baseRecommendations[0] = {
        icon: TrendingUp,
        title: "Power User Tip",
        description: "Batch generate for multiple images",
        action: "Try batch mode",
      };
    }

    return baseRecommendations;
  };

  const recommendations = getPersonalizedRecommendations();

  const getWelcomeMessage = () => {
    switch (visitorType) {
      case 'action-taker':
        return {
          greeting: "Welcome back, creator! 🔥",
          subtitle: "Ready to make more viral content?",
        };
      case 'comparer':
        return {
          greeting: "Great to see you again! 📊",
          subtitle: "We've got some new features to show you",
        };
      case 'explorer':
        return {
          greeting: "Welcome back, explorer! ✨",
          subtitle: "Discovered anything new since last time?",
        };
      default:
        return {
          greeting: "Welcome back! 👋",
          subtitle: "We're glad you're here",
        };
    }
  };

  const welcomeMessage = getWelcomeMessage();

  const handleRecommendationClick = (index: number) => {
    trackClick('feature');
    onClose();
    // Scroll to caption generator
    const captionSection = document.getElementById('caption-generator');
    if (captionSection) {
      captionSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-card rounded-2xl p-4 sm:p-6 w-[92%] max-w-[500px] shadow-2xl border border-border mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-muted"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-4 sm:mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="inline-flex items-center gap-2 mb-3"
              >
                <History className="w-5 h-5 text-primary" />
                <Badge variant="secondary" className="text-xs">
                  Returning Visitor
                </Badge>
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-xl sm:text-2xl font-bold text-foreground mb-2"
              >
                {welcomeMessage.greeting}
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-muted-foreground"
              >
                {welcomeMessage.subtitle}
              </motion.p>
            </div>

            {/* Personalized Recommendations */}
            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="text-sm font-medium text-foreground"
              >
                Recommended for you:
              </motion.p>
              
              {recommendations.map((rec, index) => {
                const IconComponent = rec.icon;
                return (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    onClick={() => handleRecommendationClick(index)}
                    className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-muted/50 hover:bg-muted border border-border hover:border-primary/30 transition-all group text-left"
                  >
                    <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm sm:text-base text-foreground group-hover:text-primary transition-colors">
                        {rec.title}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">
                        {rec.description}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </motion.button>
                );
              })}
            </div>

            {/* Quick Action */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                onClick={() => {
                  trackClick('cta');
                  onClose();
                  const captionSection = document.getElementById('caption-generator');
                  if (captionSection) {
                    captionSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="w-full"
                size="lg"
              >
                {content.ctaText}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>

            {/* Dismiss option */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center mt-4"
            >
              <button
                onClick={onClose}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Skip for now
              </button>
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeBackModal;
