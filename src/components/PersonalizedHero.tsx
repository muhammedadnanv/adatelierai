import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Users, ArrowRight, Camera, Play, Zap, CheckCircle } from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';
import { usePersonalization } from '@/contexts/PersonalizationContext';
import { motion, AnimatePresence } from 'framer-motion';

interface PersonalizedHeroProps {
  activeUsers: number;
  recentGenerations: number;
  stats: { number: string; label: string }[];
}

const PersonalizedHero = ({ activeUsers, recentGenerations, stats }: PersonalizedHeroProps) => {
  const navigate = useNavigate();
  const { content, visitorType, trackClick, device } = usePersonalization();

  const handlePrimaryCTA = () => {
    trackClick('cta');
    navigate('/dashboard');
  };

  const handleSecondaryCTA = () => {
    trackClick('cta');
    // Scroll to features section for explorers/comparers
    if (visitorType === 'explorer' || visitorType === 'comparer') {
      document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/dashboard');
    }
  };

  // Different CTA icons based on visitor type
  const getPrimaryIcon = () => {
    switch (visitorType) {
      case 'explorer': return <Play className="w-5 h-5 mr-2" />;
      case 'comparer': return <Zap className="w-5 h-5 mr-2" />;
      case 'action-taker': return <ArrowRight className="w-5 h-5 mr-2" />;
      default: return <Camera className="w-5 h-5 mr-2" />;
    }
  };

  return (
    <section className="py-16 md:py-24 lg:py-32 relative overflow-hidden">
      {/* Ambient glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <Badge className="bg-primary/10 text-primary border-primary/20 font-medium px-4 py-1.5">
                <Sparkles className="w-3.5 h-3.5 mr-2" />
                {content.featureHighlight}
              </Badge>
              
              <AnimatePresence mode="wait">
                <motion.h1 
                  key={visitorType + '-headline'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="font-heading text-4xl sm:text-5xl lg:text-hero leading-tight"
                >
                  {content.headline.includes('Viral') ? (
                    <>
                      {content.headline.split('Viral')[0]}
                      <span className="text-gradient-brand">Viral</span>
                      {content.headline.split('Viral')[1]}
                    </>
                  ) : (
                    <span className="text-gradient-brand">{content.headline}</span>
                  )}
                </motion.h1>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.p 
                  key={visitorType + '-subheadline'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl"
                >
                  {content.subheadline}
                </motion.p>
              </AnimatePresence>
            </div>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Button 
                size="lg" 
                className="bg-gradient-hero hover:opacity-90 text-white shadow-primary hover:shadow-glow transition-all duration-300 font-semibold text-base px-8 py-6" 
                onClick={handlePrimaryCTA}
              >
                {getPrimaryIcon()}
                {content.ctaText}
                {visitorType === 'action-taker' && <ArrowRight className="w-5 h-5 ml-2" />}
              </Button>
              
              {(visitorType === 'explorer' || visitorType === 'comparer' || visitorType === 'new') && (
                <Button 
                  size="lg" 
                  variant="outline"
                  className="font-semibold text-base px-6 py-6 border-border/50 hover:bg-muted/50" 
                  onClick={handleSecondaryCTA}
                >
                  {content.ctaSecondaryText}
                </Button>
              )}
            </motion.div>

            {/* Urgency message for action-takers and comparers */}
            {content.urgencyMessage && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="bg-success/10 text-success border border-success/20 rounded-lg px-4 py-2 inline-flex items-center gap-2 text-sm font-medium"
              >
                <CheckCircle className="w-4 h-4" />
                {content.urgencyMessage}
              </motion.div>
            )}

            {/* Social Proof - Live Activity */}
            <div className="flex flex-wrap items-center gap-6 text-sm pt-4">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-9 h-9 rounded-full bg-gradient-hero flex items-center justify-center text-white text-xs font-bold border-2 border-background shadow-sm">
                    {activeUsers.toString().slice(-2)}
                  </div>
                  <div className="w-9 h-9 rounded-full bg-success flex items-center justify-center text-white text-xs font-bold border-2 border-background shadow-sm">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-muted-foreground">
                  <span className="font-semibold text-foreground">{activeUsers}</span> creators online
                </div>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                <span><span className="font-semibold text-foreground">{recentGenerations}</span> captions generated</span>
              </div>
            </div>

            {/* Stats - Premium layout */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-border/50">
              {stats.map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="text-2xl lg:text-3xl font-heading font-bold text-gradient-brand">{stat.number}</div>
                  <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-hero rounded-3xl blur-3xl opacity-15 scale-105"></div>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border/20">
              <img src={heroImage} alt="Ad Atelier AI Hero" className="w-full h-auto" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PersonalizedHero;
