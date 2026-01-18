import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, Wand2, Share2, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import { usePersonalization } from '@/contexts/PersonalizationContext';
import { motion } from 'framer-motion';

interface PersonalizedOnboardingProps {
  onGetStarted: () => void;
  currentStep?: number;
}

const PersonalizedOnboarding = ({ onGetStarted, currentStep = 0 }: PersonalizedOnboardingProps) => {
  const { visitorType, content, isReturningVisitor, engagementLevel } = usePersonalization();

  // Don't show for returning visitors or high engagement users
  if (isReturningVisitor || engagementLevel === 'high') {
    return null;
  }

  const getSteps = () => {
    const baseSteps = [
      { icon: Upload, title: "Upload", description: "Drop your image" },
      { icon: Wand2, title: "Generate", description: "AI creates captions" },
      { icon: Share2, title: "Share", description: "Post to social" },
    ];

    if (visitorType === 'action-taker') {
      return baseSteps.map(step => ({ ...step, description: step.description.replace('your', 'any') }));
    }
    return baseSteps;
  };

  const getHeadline = () => {
    switch (visitorType) {
      case 'explorer':
        return "Let's Walk Through It";
      case 'comparer':
        return "See How Easy It Is";
      case 'action-taker':
        return "Quick Start Guide";
      default:
        return "How It Works";
    }
  };

  const getButtonText = () => {
    switch (visitorType) {
      case 'explorer':
        return "I'm Ready to Try";
      case 'comparer':
        return "Start My First Caption";
      case 'action-taker':
        return "Let's Go!";
      default:
        return "Get Started";
    }
  };

  const steps = getSteps();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="shadow-card border-border/50 bg-gradient-to-br from-primary/5 to-accent/5 overflow-hidden">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {content.featureHighlight}
                </Badge>
              </div>
              <h3 className="font-heading text-xl font-semibold">{getHeadline()}</h3>
              
              {/* Steps */}
              <div className="flex items-center gap-4">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      index <= currentStep 
                        ? 'bg-gradient-hero text-white shadow-primary' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {index < currentStep ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <step.icon className="w-5 h-5" />
                      )}
                    </div>
                    <div className="hidden sm:block">
                      <div className="text-sm font-medium">{step.title}</div>
                      <div className="text-xs text-muted-foreground">{step.description}</div>
                    </div>
                    {index < steps.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-muted-foreground mx-2 hidden md:block" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Button 
              onClick={onGetStarted}
              className="bg-gradient-hero hover:opacity-90 shadow-primary font-semibold whitespace-nowrap"
            >
              {getButtonText()}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PersonalizedOnboarding;
