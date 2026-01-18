import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Sparkles, 
  Settings, 
  History, 
  Wand2,
  Trophy
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import ImageUpload from '@/components/ImageUpload';
import CaptionGenerator from '@/components/CaptionGenerator';
import { useBehaviorTracking } from '@/hooks/useBehaviorTracking';
import StreakWidget from '@/components/StreakWidget';
import AchievementBadges from '@/components/AchievementBadges';
import SocialProofWidget from '@/components/SocialProofWidget';
import ProgressTracker from '@/components/ProgressTracker';
import PersonalizedDashboardHeader from '@/components/PersonalizedDashboardHeader';
import PersonalizedOnboarding from '@/components/PersonalizedOnboarding';
import SmartRecommendations from '@/components/SmartRecommendations';
import { usePersonalization } from '@/contexts/PersonalizationContext';

interface CaptionVariation {
  caption: string;
  hashtags: string[];
  keywords: string[];
  platform: string;
}

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { behavior, trackCaptionGenerated, trackImageUploaded, ACHIEVEMENTS } = useBehaviorTracking();
  const { trackClick, trackPageVisit, visitorType, engagementLevel, device } = usePersonalization();
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [generatedCaptions, setGeneratedCaptions] = useState<CaptionVariation[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastToneUsed, setLastToneUsed] = useState<string>();
  const [showOnboarding, setShowOnboarding] = useState(true);

  // Track page visit on mount
  useEffect(() => {
    trackPageVisit('/dashboard');
  }, [trackPageVisit]);

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    trackImageUploaded();
    trackClick('general');
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview('');
    setGeneratedCaptions([]);
  };

  const generateCaptions = async (tone: string, prompt: string, platform: string) => {
    if (!selectedImage) {
      toast({
        title: "Missing image",
        description: "Please upload an image first.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setGeneratedCaptions([]);
    setLastToneUsed(tone);
    trackClick('cta');

    try {
      const imageBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(selectedImage);
      });

      const { data, error } = await supabase.functions.invoke('generate-captions', {
        body: {
          image_base64: imageBase64,
          tone,
          prompt,
          platform
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      if (data?.variations && data.variations.length > 0) {
        setGeneratedCaptions(data.variations);
        trackCaptionGenerated();
        
        // Personalized success messages
        const successMessages = {
          'explorer': "Amazing! See how different tones can transform your content.",
          'comparer': `${data.variations.length} unique variations ready for comparison.`,
          'action-taker': "Done! Your captions are ready to share.",
          'new': `Generated ${data.variations.length} AI-powered variations for ${platform}.`,
        };
        
        toast({
          title: "✨ Captions generated!",
          description: successMessages[visitorType] || successMessages.new,
        });
      } else {
        throw new Error('No captions generated');
      }
    } catch (error: any) {
      console.error('Caption generation error:', error);
      toast({
        title: "Generation failed",
        description: error.message || "Failed to generate captions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRecommendationClick = (id: string) => {
    trackClick('feature');
    if (id === 'first-caption') {
      document.querySelector('[data-image-upload]')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOnboardingStart = () => {
    setShowOnboarding(false);
    trackClick('cta');
  };

  return (
    <div className="min-h-screen bg-background">
      <PersonalizedDashboardHeader 
        streakDays={behavior.streakDays}
        captionsGenerated={behavior.captionsGenerated}
      />

      <div className="container mx-auto px-4 py-4 md:py-8">
        <Tabs defaultValue="create" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 text-sm md:text-base">
            <TabsTrigger value="create" className="flex items-center gap-1 md:gap-2 px-2 md:px-4">
              <Wand2 className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Create</span>
              <span className="sm:hidden">New</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-1 md:gap-2 px-2 md:px-4">
              <Trophy className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Progress</span>
              <span className="sm:hidden">Stats</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-1 md:gap-2 px-2 md:px-4">
              <History className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">History</span>
              <span className="sm:hidden">List</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1 md:gap-2 px-2 md:px-4">
              <Settings className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Settings</span>
              <span className="sm:hidden">Set</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-4 md:space-y-6">
            {/* Personalized Onboarding for new users */}
            {showOnboarding && behavior.captionsGenerated === 0 && (
              <PersonalizedOnboarding 
                onGetStarted={handleOnboardingStart}
                currentStep={selectedImage ? 1 : 0}
              />
            )}

            <SocialProofWidget />
            
            <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-4">
                <div className="grid gap-4 md:gap-6 lg:grid-cols-2" data-image-upload>
                  <ImageUpload
                    onImageSelect={handleImageSelect}
                    selectedImage={selectedImage}
                    imagePreview={imagePreview}
                    onClear={clearImage}
                  />
                  
                  <CaptionGenerator
                    selectedImage={selectedImage}
                    onGenerate={generateCaptions}
                    generatedCaptions={generatedCaptions}
                    loading={loading}
                    imagePreview={imagePreview}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <StreakWidget streakDays={behavior.streakDays} />
                <SmartRecommendations 
                  captionsGenerated={behavior.captionsGenerated}
                  lastToneUsed={lastToneUsed}
                  onRecommendationClick={handleRecommendationClick}
                />
                {device !== 'mobile' && (
                  <ProgressTracker 
                    captionsGenerated={behavior.captionsGenerated}
                    imagesUploaded={behavior.imagesUploaded}
                  />
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <StreakWidget streakDays={behavior.streakDays} />
              <ProgressTracker 
                captionsGenerated={behavior.captionsGenerated}
                imagesUploaded={behavior.imagesUploaded}
              />
            </div>
            <AchievementBadges 
              unlockedIds={behavior.achievements}
              allAchievements={ACHIEVEMENTS}
            />
          </TabsContent>

          <TabsContent value="history">
            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="font-heading">Caption History</CardTitle>
                <CardDescription>
                  {visitorType === 'action-taker' 
                    ? "Quick access to your recent captions"
                    : "View and manage your previously generated captions"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>
                    {behavior.captionsGenerated === 0 
                      ? "No caption history yet. Generate some captions to see them here!"
                      : "Your caption history will appear here in a future update."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-6">
              <Card className="shadow-card border-border/50 max-w-2xl">
                <CardHeader>
                  <CardTitle className="font-heading">Application Settings</CardTitle>
                  <CardDescription>
                    {engagementLevel === 'high' 
                      ? "Customize your power-user experience"
                      : "Manage your preferences and settings"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Default Caption Tone</Label>
                    <Input placeholder={visitorType === 'action-taker' ? "Bold" : "Professional"} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Language Preference</Label>
                    <Input placeholder="English" />
                  </div>
                  
                  <Button className="bg-gradient-hero hover:opacity-90 shadow-primary">
                    Save Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
