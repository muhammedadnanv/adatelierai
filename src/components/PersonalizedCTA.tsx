import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Sparkles, CheckCircle, ArrowRight, Zap, Clock, Users } from 'lucide-react';
import { usePersonalization } from '@/contexts/PersonalizationContext';
import { motion } from 'framer-motion';

const PersonalizedCTA = () => {
  const navigate = useNavigate();
  const { content, visitorType, trackClick, intent } = usePersonalization();

  const handleCTA = () => {
    trackClick('cta');
    navigate('/dashboard');
  };

  // Different urgency indicators based on visitor type
  const getUrgencyIndicators = () => {
    switch (visitorType) {
      case 'explorer':
        return [
          { icon: CheckCircle, text: "No account required" },
          { icon: Clock, text: "Takes 30 seconds" },
        ];
      case 'comparer':
        return [
          { icon: CheckCircle, text: "All features included" },
          { icon: Zap, text: "5 unique tones" },
          { icon: Users, text: "Join 10K+ creators" },
        ];
      case 'action-taker':
        return [
          { icon: Zap, text: "Instant results" },
          { icon: ArrowRight, text: "Start immediately" },
        ];
      default:
        return [
          { icon: CheckCircle, text: "No setup required" },
        ];
    }
  };

  // Different headlines based on intent
  const getHeadline = () => {
    switch (intent) {
      case 'browsing':
        return "Curious? Give It a Try!";
      case 'researching':
        return "Ready to See the Difference?";
      case 'converting':
        return "Let's Create Something Amazing";
      default:
        return "Ready to Create Viral Content?";
    }
  };

  const getDescription = () => {
    switch (visitorType) {
      case 'explorer':
        return "No commitment, no signup — just upload an image and see what AI can do for your content.";
      case 'comparer':
        return "You've seen the features. You've read the reviews. Now experience why creators choose Ad Atelier AI.";
      case 'action-taker':
        return "Your next viral post is one click away. Start creating now.";
      default:
        return "Join thousands of creators who are already using AI to boost their social media presence.";
    }
  };

  const indicators = getUrgencyIndicators();

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <Card className="bg-gradient-hero text-white border-0 shadow-glow overflow-hidden relative">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          
          <CardContent className="p-5 sm:p-8 md:p-12 lg:p-16 text-center space-y-4 sm:space-y-6 relative z-10">
            <motion.h2 
              key={visitorType + '-cta-headline'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="font-heading text-2xl sm:text-3xl lg:text-title"
            >
              {getHeadline()}
            </motion.h2>
            
            <motion.p 
              key={visitorType + '-cta-desc'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-base sm:text-lg md:text-xl opacity-90 max-w-2xl mx-auto leading-relaxed px-2"
            >
              {getDescription()}
            </motion.p>
            
            <motion.div 
              className="flex flex-col gap-4 justify-center items-center pt-2 sm:pt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Button 
                size="lg" 
                variant="secondary" 
                className="bg-white text-primary hover:bg-white/90 font-semibold text-sm sm:text-base px-6 sm:px-8 py-5 sm:py-6 shadow-lg w-full sm:w-auto" 
                onClick={handleCTA}
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                {content.ctaText}
                {visitorType === 'action-taker' && <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />}
              </Button>
              
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm opacity-90">
                {indicators.map((indicator, index) => (
                  <div key={index} className="flex items-center gap-1 sm:gap-2">
                    <indicator.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{indicator.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Extra urgency for action-takers */}
            {visitorType === 'action-taker' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="mt-6 text-sm opacity-80"
              >
                <span className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  127 creators generating captions right now
                </span>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default PersonalizedCTA;
