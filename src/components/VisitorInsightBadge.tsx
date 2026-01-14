import { Badge } from '@/components/ui/badge';
import { usePersonalization } from '@/contexts/PersonalizationContext';
import { Eye, Search, Zap, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VisitorInsightBadge = () => {
  const { visitorType, confidence, intent } = usePersonalization();

  // Only show in development or when confidence is high enough
  const shouldShow = process.env.NODE_ENV === 'development' || confidence > 60;
  
  if (!shouldShow) return null;

  const getIcon = () => {
    switch (visitorType) {
      case 'explorer': return <Eye className="w-3 h-3" />;
      case 'comparer': return <Search className="w-3 h-3" />;
      case 'action-taker': return <Zap className="w-3 h-3" />;
      default: return <Sparkles className="w-3 h-3" />;
    }
  };

  const getLabel = () => {
    switch (visitorType) {
      case 'explorer': return 'Exploring';
      case 'comparer': return 'Comparing';
      case 'action-taker': return 'Ready to Act';
      default: return 'Welcome';
    }
  };

  const getColor = () => {
    switch (visitorType) {
      case 'explorer': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'comparer': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'action-taker': return 'bg-green-500/10 text-green-600 border-green-500/20';
      default: return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="fixed bottom-4 left-4 z-50"
      >
        <Badge className={`${getColor()} font-medium px-3 py-1.5 shadow-lg`}>
          {getIcon()}
          <span className="ml-1.5">{getLabel()}</span>
          <span className="ml-2 opacity-60 text-xs">({Math.round(confidence)}%)</span>
        </Badge>
      </motion.div>
    </AnimatePresence>
  );
};

export default VisitorInsightBadge;
