import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target, TrendingUp } from 'lucide-react';

interface ProgressTrackerProps {
  captionsGenerated: number;
  imagesUploaded: number;
}

const ProgressTracker = ({ captionsGenerated, imagesUploaded }: ProgressTrackerProps) => {
  const nextMilestone = captionsGenerated < 10 ? 10 : captionsGenerated < 50 ? 50 : 100;
  const progressToMilestone = (captionsGenerated / nextMilestone) * 100;

  return (
    <Card className="shadow-elegant">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Your Progress
        </CardTitle>
        <CardDescription>
          Keep creating to unlock new achievements
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Captions Generated</span>
            <span className="font-bold text-foreground">{captionsGenerated} / {nextMilestone}</span>
          </div>
          <Progress value={progressToMilestone} className="h-2" />
          <div className="text-xs text-muted-foreground mt-1">
            {nextMilestone - captionsGenerated} more to reach next milestone! 🎯
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10">
            <div className="text-2xl font-bold text-foreground">{captionsGenerated}</div>
            <div className="text-xs text-muted-foreground">Total Captions</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-secondary/10 to-muted/10">
            <div className="text-2xl font-bold text-foreground">{imagesUploaded}</div>
            <div className="text-xs text-muted-foreground">Images Uploaded</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressTracker;
