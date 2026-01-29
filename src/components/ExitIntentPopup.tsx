import { X, Sparkles, Gift, Zap, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePersonalization } from '@/contexts/PersonalizationContext';
import { Button } from '@/components/ui/button';

interface ExitIntentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
}

const ExitIntentPopup = ({ isOpen, onClose, onAccept }: ExitIntentPopupProps) => {
  const { visitorType, content, engagementLevel, trackClick } = usePersonalization();

  // Personalized offers based on visitor type
  const getPersonalizedOffer = () => {
    switch (visitorType) {
      case 'new':
        return {
          icon: Gift,
          title: "Wait! Here's a Special Welcome Gift 🎁",
          subtitle: "Your first 10 captions are on us!",
          description: "Don't miss out on transforming your social media presence. Start creating viral content today.",
          ctaText: "Claim Free Captions",
          incentive: "No credit card required",
          gradient: "from-primary to-primary/70",
        };
      case 'explorer':
        return {
          icon: Sparkles,
          title: "Still Exploring? Let Us Help! ✨",
          subtitle: "See the magic in action",
          description: "Watch a quick 30-second demo and discover how AI captions can transform your content strategy.",
          ctaText: "Watch Quick Demo",
          incentive: "Takes only 30 seconds",
          gradient: "from-accent to-accent/70",
        };
      case 'comparer':
        return {
          icon: Zap,
          title: "You're Almost There! ⚡",
          subtitle: "Here's why creators choose us",
          description: "95% of users see better engagement within their first week. Join 10,000+ satisfied creators.",
          ctaText: "See Full Comparison",
          incentive: "Backed by real results",
          gradient: "from-secondary to-secondary/70",
        };
      case 'action-taker':
        return {
          icon: Zap,
          title: "Ready to Go Viral? 🔥",
          subtitle: "Your next post is waiting",
          description: "You're just one click away from creating content that gets noticed. Let's make it happen!",
          ctaText: "Start Creating Now",
          incentive: "127 creators are generating right now",
          gradient: "from-destructive to-destructive/70",
        };
      default:
        return {
          icon: Gift,
          title: "Before You Go... 💡",
          subtitle: "Unlock your content potential",
          description: "Don't miss the opportunity to transform your social media presence with AI-powered captions.",
          ctaText: "Try It Free",
          incentive: "No commitment required",
          gradient: "from-primary to-primary/70",
        };
    }
  };

  const offer = getPersonalizedOffer();
  const IconComponent = offer.icon;

  const handleAccept = () => {
    trackClick('cta');
    onAccept?.();
    onClose();
    // Scroll to the caption generator section
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
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-card rounded-2xl p-5 sm:p-8 w-[92%] max-w-[480px] shadow-2xl border border-border overflow-hidden mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background gradient accent */}
            <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${offer.gradient}`} />
            
            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-primary/20"
                  initial={{ 
                    x: Math.random() * 100 + '%',
                    y: Math.random() * 100 + '%',
                    scale: 0 
                  }}
                  animate={{ 
                    y: [null, '-20%'],
                    scale: [0, 1, 0],
                    opacity: [0, 0.6, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                />
              ))}
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-muted"
              aria-label="Close popup"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="relative text-center space-y-5">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${offer.gradient} text-primary-foreground shadow-lg`}
              >
                <IconComponent className="w-8 h-8" />
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl sm:text-2xl font-bold text-foreground"
              >
                {offer.title}
              </motion.h2>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-base sm:text-lg font-medium text-primary"
              >
                {offer.subtitle}
              </motion.p>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-sm sm:text-base text-muted-foreground"
              >
                {offer.description}
              </motion.p>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="pt-2"
              >
                <Button
                  onClick={handleAccept}
                  size="lg"
                  className={`w-full bg-gradient-to-r ${offer.gradient} hover:opacity-90 text-primary-foreground font-semibold py-5 sm:py-6 text-base sm:text-lg group`}
                >
                  {offer.ctaText}
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>

              {/* Incentive text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-muted-foreground"
              >
                {offer.incentive}
              </motion.p>

              {/* Dismiss link */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                onClick={onClose}
                className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline transition-colors"
              >
                No thanks, I'll pass
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExitIntentPopup;
