import { Card } from '@/components/ui/card';
import { Flame } from 'lucide-react';

interface StreakWidgetProps {
  streakDays: number;
}

const StreakWidget = ({ streakDays }: StreakWidgetProps) => {
  return (
    <Card className="p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-300/50 shadow-md hover:shadow-lg transition-all duration-300 hover-scale">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Flame className="w-8 h-8 text-orange-500 animate-pulse" />
          {streakDays >= 3 && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
          )}
        </div>
        <div>
          <div className="text-2xl font-bold text-foreground">{streakDays} Day{streakDays !== 1 ? 's' : ''}</div>
          <div className="text-xs text-muted-foreground">Current Streak 🔥</div>
        </div>
      </div>
      {streakDays >= 3 && (
        <div className="mt-2 text-xs text-orange-600 font-medium animate-fade-in">
          You're on fire! Keep it up! 🎉
        </div>
      )}
    </Card>
  );
};

export default StreakWidget;
