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
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          Achievements
        </CardTitle>
        <CardDescription>
          {unlockedIds.length} of {achievements.length} unlocked
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {achievements.map((achievement) => {
            const isUnlocked = unlockedIds.includes(achievement.id);
            return (
              <div
                key={achievement.id}
                className={`p-3 rounded-lg border transition-all duration-300 ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30 hover-scale'
                    : 'bg-muted/30 border-muted opacity-50'
                }`}
              >
                <div className="text-3xl mb-2 text-center">
                  {isUnlocked ? achievement.icon : <Lock className="w-6 h-6 mx-auto text-muted-foreground" />}
                </div>
                <div className="text-xs font-semibold text-center text-foreground">{achievement.name}</div>
                <div className="text-[10px] text-center text-muted-foreground mt-1">{achievement.desc}</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementBadges;
