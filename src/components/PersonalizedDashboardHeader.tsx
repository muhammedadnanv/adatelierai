import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ArrowLeft, Lightbulb, Zap, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePersonalization } from '@/contexts/PersonalizationContext';
import { motion, AnimatePresence } from 'framer-motion';

interface PersonalizedDashboardHeaderProps {
  streakDays?: number;
  captionsGenerated?: number;
}

const PersonalizedDashboardHeader = ({ streakDays = 0, captionsGenerated = 0 }: PersonalizedDashboardHeaderProps) => {
  const navigate = useNavigate();
  const { content, visitorType, isReturningVisitor, engagementLevel, device } = usePersonalization();

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getPersonalizedGreeting = () => {
    if (isReturningVisitor && streakDays > 0) {
      return `${getTimeBasedGreeting()}! 🔥 ${streakDays} day streak!`;
    }
    if (isReturningVisitor) {
      return `${getTimeBasedGreeting()}! Welcome back!`;
    }
    return content.dashboardGreeting;
  };

  const getMotivationalMessage = () => {
    if (captionsGenerated === 0) {
      return content.dashboardMotivation;
    }
    if (captionsGenerated > 10) {
      return "You're on fire! Keep the creativity flowing.";
    }
    if (captionsGenerated > 5) {
      return "Great momentum! Your content game is strong.";
    }
    return "Nice progress! Each caption gets you closer to viral.";
  };

  const getTip = () => {
    if (engagementLevel === 'high') {
      return "Pro tip: Try the 'bold' tone for maximum engagement on trending topics.";
    }
    return content.dashboardTip;
  };

  return (
    <header className="border-b bg-background/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 md:space-x-4 min-w-0 flex-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="flex items-center gap-1 md:gap-2"
            >
              <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <div className="flex items-center space-x-2 min-w-0">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-hero rounded-lg flex items-center justify-center flex-shrink-0 shadow-primary">
                <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-white" />
              </div>
              <h1 className="text-lg md:text-xl font-bold font-heading text-gradient-brand truncate">
                Ad Atelier AI
              </h1>
            </div>
          </div>

          {/* Personalized status badges */}
          <div className="flex items-center gap-2">
            {streakDays > 0 && device !== 'mobile' && (
              <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                🔥 {streakDays} day streak
              </Badge>
            )}
            {engagementLevel === 'high' && device !== 'mobile' && (
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                <Zap className="w-3 h-3 mr-1" />
                Power User
              </Badge>
            )}
          </div>
        </div>

        {/* Personalized greeting bar */}
        <AnimatePresence mode="wait">
          <motion.div
            key={visitorType + '-greeting'}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-3 px-4 bg-muted/30 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="font-medium text-sm">{getPersonalizedGreeting()}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Lightbulb className="w-3 h-3 text-warning flex-shrink-0" />
              <span>{getTip()}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </header>
  );
};

export default PersonalizedDashboardHeader;
