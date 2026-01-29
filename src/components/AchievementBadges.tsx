import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Lock } from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  desc: string;
  icon: string;
}

interface AchievementBadgesProps {
  unlockedIds: string[];
  allAchievements: Record<string, Achievement>;
}

const AchievementBadges = ({ unlockedIds, allAchievements }: AchievementBadgesProps) => {
  const achievements = Object.values(allAchievements);
  
  return (
    <Card className="shadow-elegant">
      <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-2 sm:pb-4">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          Achievements
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          {unlockedIds.length} of {achievements.length} unlocked
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {achievements.map((achievement) => {
            const isUnlocked = unlockedIds.includes(achievement.id);
            return (
              <div
                key={achievement.id}
                className={`p-2 sm:p-3 rounded-lg border transition-all duration-300 ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30 hover-scale'
                    : 'bg-muted/30 border-muted opacity-50'
                }`}
              >
                <div className="text-2xl sm:text-3xl mb-1 sm:mb-2 text-center">
                  {isUnlocked ? achievement.icon : <Lock className="w-5 h-5 sm:w-6 sm:h-6 mx-auto text-muted-foreground" />}
                </div>
                <div className="text-[10px] sm:text-xs font-semibold text-center text-foreground leading-tight">{achievement.name}</div>
                <div className="text-[8px] sm:text-[10px] text-center text-muted-foreground mt-0.5 sm:mt-1 leading-tight">{achievement.desc}</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementBadges;
