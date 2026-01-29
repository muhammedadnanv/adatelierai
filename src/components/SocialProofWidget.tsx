import { Card } from '@/components/ui/card';
import { Users, TrendingUp, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

const SocialProofWidget = () => {
  // Simulated real-time stats (in production, these would come from your database)
  const [stats, setStats] = useState({
    activeUsers: 2847,
    captionsToday: 15234,
    growthRate: 23
  });

  useEffect(() => {
    // Simulate live updates
    const interval = setInterval(() => {
      setStats(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 5),
        captionsToday: prev.captionsToday + Math.floor(Math.random() * 10),
        growthRate: prev.growthRate + (Math.random() > 0.5 ? 1 : -1)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
      <Card className="p-3 sm:p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-300/50 shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-blue-500/20 rounded-lg flex-shrink-0">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          </div>
          <div className="min-w-0">
            <div className="text-lg sm:text-xl font-bold text-foreground">{stats.activeUsers.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground truncate">Active Users Today</div>
          </div>
        </div>
      </Card>

      <Card className="p-3 sm:p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-300/50 shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-green-500/20 rounded-lg flex-shrink-0">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
          </div>
          <div className="min-w-0">
            <div className="text-lg sm:text-xl font-bold text-foreground">{stats.captionsToday.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground truncate">Captions Generated</div>
          </div>
        </div>
      </Card>

      <Card className="p-3 sm:p-4 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border-orange-300/50 shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in sm:col-span-2 lg:col-span-1" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-orange-500/20 rounded-lg flex-shrink-0">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
          </div>
          <div className="min-w-0">
            <div className="text-lg sm:text-xl font-bold text-foreground">+{stats.growthRate}%</div>
            <div className="text-xs text-muted-foreground truncate">Growth This Week</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SocialProofWidget;
