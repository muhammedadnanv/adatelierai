import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UserBehavior {
  captionsGenerated: number;
  imagesUploaded: number;
  lastActiveDate: string;
  streakDays: number;
  achievements: string[];
  joinedDate: string;
}

const STORAGE_KEY = 'ad-atelier-behavior';

const ACHIEVEMENTS = {
  FIRST_CAPTION: { id: 'first_caption', name: 'First Steps', desc: 'Generated your first caption', icon: '🎯' },
  TEN_CAPTIONS: { id: 'ten_captions', name: 'Getting Started', desc: 'Generated 10 captions', icon: '🚀' },
  FIFTY_CAPTIONS: { id: 'fifty_captions', name: 'Caption Pro', desc: 'Generated 50 captions', icon: '⭐' },
  STREAK_3: { id: 'streak_3', name: '3-Day Streak', desc: 'Used the app 3 days in a row', icon: '🔥' },
  STREAK_7: { id: 'streak_7', name: 'Week Warrior', desc: '7-day streak!', icon: '💪' },
  EARLY_BIRD: { id: 'early_bird', name: 'Early Bird', desc: 'Joined Ad Atelier AI', icon: '🌟' }
};

export const useBehaviorTracking = () => {
  const { toast } = useToast();
  const [behavior, setBehavior] = useState<UserBehavior>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      captionsGenerated: 0,
      imagesUploaded: 0,
      lastActiveDate: new Date().toISOString().split('T')[0],
      streakDays: 1,
      achievements: [ACHIEVEMENTS.EARLY_BIRD.id],
      joinedDate: new Date().toISOString().split('T')[0]
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(behavior));
  }, [behavior]);

  const updateStreak = () => {
    const today = new Date().toISOString().split('T')[0];
    const lastActive = new Date(behavior.lastActiveDate);
    const todayDate = new Date(today);
    const daysDiff = Math.floor((todayDate.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff === 1) {
      // Consecutive day
      const newStreak = behavior.streakDays + 1;
      setBehavior(prev => ({ ...prev, streakDays: newStreak, lastActiveDate: today }));
      
      if (newStreak === 3 && !behavior.achievements.includes(ACHIEVEMENTS.STREAK_3.id)) {
        unlockAchievement(ACHIEVEMENTS.STREAK_3);
      }
      if (newStreak === 7 && !behavior.achievements.includes(ACHIEVEMENTS.STREAK_7.id)) {
        unlockAchievement(ACHIEVEMENTS.STREAK_7);
      }
    } else if (daysDiff > 1) {
      // Streak broken
      setBehavior(prev => ({ ...prev, streakDays: 1, lastActiveDate: today }));
    } else if (daysDiff === 0) {
      // Same day
      setBehavior(prev => ({ ...prev, lastActiveDate: today }));
    }
  };

  const unlockAchievement = (achievement: typeof ACHIEVEMENTS[keyof typeof ACHIEVEMENTS]) => {
    setBehavior(prev => ({
      ...prev,
      achievements: [...prev.achievements, achievement.id]
    }));

    toast({
      title: `${achievement.icon} Achievement Unlocked!`,
      description: `${achievement.name}: ${achievement.desc}`,
      duration: 5000,
    });
  };

  const trackCaptionGenerated = () => {
    updateStreak();
    const newCount = behavior.captionsGenerated + 1;
    setBehavior(prev => ({ ...prev, captionsGenerated: newCount }));

    if (newCount === 1 && !behavior.achievements.includes(ACHIEVEMENTS.FIRST_CAPTION.id)) {
      unlockAchievement(ACHIEVEMENTS.FIRST_CAPTION);
    } else if (newCount === 10 && !behavior.achievements.includes(ACHIEVEMENTS.TEN_CAPTIONS.id)) {
      unlockAchievement(ACHIEVEMENTS.TEN_CAPTIONS);
    } else if (newCount === 50 && !behavior.achievements.includes(ACHIEVEMENTS.FIFTY_CAPTIONS.id)) {
      unlockAchievement(ACHIEVEMENTS.FIFTY_CAPTIONS);
    }
  };

  const trackImageUploaded = () => {
    updateStreak();
    setBehavior(prev => ({ ...prev, imagesUploaded: prev.imagesUploaded + 1 }));
  };

  return {
    behavior,
    trackCaptionGenerated,
    trackImageUploaded,
    ACHIEVEMENTS
  };
};
