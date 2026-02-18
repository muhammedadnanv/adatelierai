import { Card } from '@/components/ui/card';
import { Flame } from 'lucide-react';

interface StreakWidgetProps {
  streakDays: number;
}

const StreakWidget = ({ streakDays }: StreakWidgetProps) => {
  return (
    <Card className="p-3 sm:p-4 glass-card bg-gradient-to-br from-warning/10 to-destructive/10 border-warning/30 hover:shadow-elegant hover:scale-[1.03] transition-all duration-300">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative flex-shrink-0">
          <Flame className="w-6 h-6 sm:w-8 sm:h-8 text-warning animate-pulse" />
          {streakDays >= 3 && (
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-destructive rounded-full animate-ping" />
          )}
        </div>
        <div className="min-w-0">
          <div className="text-xl sm:text-2xl font-bold text-foreground">{streakDays} Day{streakDays !== 1 ? 's' : ''}</div>
          <div className="text-xs text-muted-foreground">Current Streak 🔥</div>
        </div>
      </div>
      {streakDays >= 3 && (
        <div className="mt-2 text-xs text-warning font-medium animate-fade-in">
          You're on fire! Keep it up! 🎉
        </div>
      )}
    </Card>
  );
};

export default StreakWidget;
