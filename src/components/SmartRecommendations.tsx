import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lightbulb, TrendingUp, Zap, Target, ArrowRight } from 'lucide-react';
import { usePersonalization } from '@/contexts/PersonalizationContext';
import { motion } from 'framer-motion';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  action: string;
  icon: typeof Lightbulb;
  priority: 'high' | 'medium' | 'low';
}

interface SmartRecommendationsProps {
  captionsGenerated: number;
  lastToneUsed?: string;
  onRecommendationClick?: (id: string) => void;
}

const SmartRecommendations = ({ 
  captionsGenerated, 
  lastToneUsed,
  onRecommendationClick 
}: SmartRecommendationsProps) => {
  const { visitorType, engagementLevel, device } = usePersonalization();

  const getRecommendations = (): Recommendation[] => {
    const recommendations: Recommendation[] = [];

    // New user recommendations
    if (captionsGenerated === 0) {
      recommendations.push({
        id: 'first-caption',
        title: 'Create Your First Caption',
        description: 'Upload an image to experience AI-powered caption generation.',
        action: 'Upload Now',
        icon: Zap,
        priority: 'high',
      });
    }

    // Tone variety recommendation
    if (captionsGenerated > 0 && lastToneUsed) {
      const alternativeTones = {
        professional: 'Try the "witty" tone for more engagement',
        witty: 'Try "bold" for maximum impact',
        bold: 'Try "inspiring" for motivational content',
        casual: 'Try "professional" for business posts',
        inspiring: 'Try "casual" for relatable content',
      };
      
      recommendations.push({
        id: 'try-tone',
        title: 'Explore Different Tones',
        description: alternativeTones[lastToneUsed as keyof typeof alternativeTones] || 'Try a different tone for variety.',
        action: 'Try Now',
        icon: Target,
        priority: 'medium',
      });
    }

    // Engagement-based recommendations
    if (engagementLevel === 'high' && captionsGenerated > 5) {
      recommendations.push({
        id: 'power-tip',
        title: 'Power User Tip',
        description: 'Use specific context prompts to get more targeted captions.',
        action: 'Learn More',
        icon: TrendingUp,
        priority: 'medium',
      });
    }

    // Visitor type specific
    if (visitorType === 'comparer') {
      recommendations.push({
        id: 'compare-platforms',
        title: 'Optimize for Platforms',
        description: 'Generate captions optimized for Twitter vs LinkedIn.',
        action: 'Compare',
        icon: Lightbulb,
        priority: 'medium',
      });
    }

    if (visitorType === 'action-taker' && captionsGenerated > 3) {
      recommendations.push({
        id: 'batch-create',
        title: 'Batch Content Creation',
        description: 'Upload multiple images to build your content library faster.',
        action: 'Go Faster',
        icon: Zap,
        priority: 'high',
      });
    }

    return recommendations.slice(0, device === 'mobile' ? 2 : 3);
  };

  const recommendations = getRecommendations();

  if (recommendations.length === 0) return null;

  const getPriorityColor = (priority: Recommendation['priority']) => {
    switch (priority) {
      case 'high': return 'bg-primary/10 text-primary border-primary/20';
      case 'medium': return 'bg-accent/10 text-accent border-accent/20';
      default: return 'bg-muted text-muted-foreground border-muted';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="shadow-card border-border/50">
        <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6 pt-3 sm:pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <CardTitle className="text-sm sm:text-base font-heading flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-warning flex-shrink-0" />
              Smart Recommendations
            </CardTitle>
            <Badge variant="outline" className="text-xs w-fit">
              Personalized for you
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 sm:space-y-3 px-3 sm:px-6 pb-3 sm:pb-6">
          {recommendations.map((rec, index) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.1 }}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 p-2.5 sm:p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start gap-2 sm:gap-3">
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getPriorityColor(rec.priority)}`}>
                  <rec.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-xs sm:text-sm">{rec.title}</div>
                  <div className="text-xs text-muted-foreground line-clamp-2">{rec.description}</div>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => onRecommendationClick?.(rec.id)}
                className="flex-shrink-0 text-xs sm:text-sm h-8 px-2 sm:px-3 self-end sm:self-auto"
              >
                {rec.action}
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SmartRecommendations;
