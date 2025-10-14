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
  Key,
  Wand2,
  ArrowLeft
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import ImageUpload from '@/components/ImageUpload';
import CaptionGenerator from '@/components/CaptionGenerator';
import ApiKeyManager from '@/components/ApiKeyManager';

interface CaptionVariation {
  caption: string;
  hashtags: string[];
  keywords: string[];
  platform: string;
}

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [generatedCaptions, setGeneratedCaptions] = useState<CaptionVariation[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
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

  const generateCaptions = async (tone: string, platform: string) => {
    if (!selectedImage) {
      toast({
        title: "Missing image",
        description: "Please upload an image first.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (hasApiKey) {
        // Try to use real API key for actual generation
        const apiKey = localStorage.getItem('gemini-api-key');
        if (apiKey) {
          // Convert image to base64
          const imageBase64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
              const result = reader.result as string;
              const base64 = result.split(',')[1];
              resolve(base64);
            };
            reader.readAsDataURL(selectedImage);
          });

          // Call edge function
          try {
            const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-captions`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                image_base64: imageBase64,
                tone,
                platform,
                apiKey
              })
            });

            if (response.ok) {
              const data = await response.json();
              
              if (data.variations) {
                setGeneratedCaptions(data.variations);
                toast({
                  title: "Captions generated!",
                  description: `${data.variations.length} variations created for ${platform}.`,
                });
                return;
              }
            }
          } catch (error) {
            console.error('API error:', error);
          }
        }
      }
      
      // Fallback to demo captions with hashtags
      const demoVariations: Record<string, CaptionVariation[]> = {
        professional: [
          {
            caption: "Elevating excellence through strategic vision and innovative execution.",
            hashtags: ["#Leadership", "#Excellence", "#Innovation"],
            keywords: ["leadership", "strategy", "innovation"],
            platform
          },
          {
            caption: "When precision meets purpose, extraordinary results follow.",
            hashtags: ["#Strategy", "#Success", "#Professional"],
            keywords: ["precision", "purpose", "results"],
            platform
          },
          {
            caption: "Building bridges between vision and reality, one milestone at a time.",
            hashtags: ["#Progress", "#Achievement", "#Business"],
            keywords: ["vision", "reality", "milestones"],
            platform
          }
        ],
        witty: [
          {
            caption: "Plot twist: This wasn't supposed to look this good, but here we are! 😄",
            hashtags: ["#PlotTwist", "#Unexpected", "#Surprise"],
            keywords: ["unexpected", "surprise", "humor"],
            platform
          },
          {
            caption: "Me: Takes one photo. Also me: Becomes a photographer. How did this happen? 📸",
            hashtags: ["#AccidentalGenius", "#Life", "#Photography"],
            keywords: ["photography", "accidental", "life"],
            platform
          },
          {
            caption: "Breaking news: Local person takes decent photo, more at 11. 📰",
            hashtags: ["#BreakingNews", "#Humble", "#Fun"],
            keywords: ["news", "humble", "funny"],
            platform
          }
        ],
        bold: [
          {
            caption: "🔥 UNSTOPPABLE ENERGY CAPTURED IN ONE FRAME 🔥",
            hashtags: ["#Bold", "#Energy", "#Unstoppable"],
            keywords: ["energy", "unstoppable", "power"],
            platform
          },
          {
            caption: "💥 BREAKING BOUNDARIES, SETTING NEW STANDARDS 💥",
            hashtags: ["#GameChanger", "#Bold", "#Revolutionary"],
            keywords: ["boundaries", "standards", "revolutionary"],
            platform
          },
          {
            caption: "⚡ ELECTRIC VIBES, INFINITE POSSIBILITIES ⚡",
            hashtags: ["#Electric", "#Limitless", "#Power"],
            keywords: ["electric", "limitless", "possibilities"],
            platform
          }
        ],
        casual: [
          {
            caption: "Just another day, just another awesome moment captured ✨",
            hashtags: ["#ChillVibes", "#Casual", "#Life"],
            keywords: ["chill", "moment", "life"],
            platform
          },
          {
            caption: "Keeping it real, keeping it simple, keeping it good 😊",
            hashtags: ["#KeepItReal", "#Simple", "#Good"],
            keywords: ["real", "simple", "good"],
            platform
          },
          {
            caption: "Sometimes the best moments are the unplanned ones 🌟",
            hashtags: ["#Spontaneous", "#Moments", "#Natural"],
            keywords: ["spontaneous", "moments", "natural"],
            platform
          }
        ],
        inspiring: [
          {
            caption: "✨ Every moment holds the potential for magic - we just need to believe ✨",
            hashtags: ["#Believe", "#Magic", "#Potential"],
            keywords: ["believe", "magic", "potential"],
            platform
          },
          {
            caption: "🌟 Dreams don't work unless you do - this is proof of what's possible 🌟",
            hashtags: ["#Dreams", "#Work", "#Possible"],
            keywords: ["dreams", "work", "possible"],
            platform
          },
          {
            caption: "💫 In every ordinary moment lies an extraordinary opportunity 💫",
            hashtags: ["#Extraordinary", "#Opportunity", "#Moment"],
            keywords: ["extraordinary", "opportunity", "moment"],
            platform
          }
        ]
      };
      
      const variations = demoVariations[tone as keyof typeof demoVariations] || demoVariations.professional;
      setGeneratedCaptions(variations);
      
      toast({
        title: hasApiKey ? "Captions generated!" : "Demo captions generated",
        description: hasApiKey 
          ? `3 variations created for ${platform}.` 
          : `3 demo variations created. Add your API key for AI-powered captions.`,
        variant: "default",
      });
    } catch (error) {
      console.error('Caption generation error:', error);
      toast({
        title: "Error generating captions",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 md:space-x-4 min-w-0 flex-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="flex items-center gap-1 md:gap-2"
            >
              <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <div className="flex items-center space-x-2 min-w-0">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-white" />
              </div>
              <h1 className="text-lg md:text-xl font-bold font-montserrat bg-gradient-hero bg-clip-text text-transparent truncate">
                Ad Atelier AI
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 md:py-8">
        <Tabs defaultValue="create" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 text-sm md:text-base">
            <TabsTrigger value="create" className="flex items-center gap-1 md:gap-2 px-2 md:px-4">
              <Wand2 className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Create</span>
              <span className="sm:hidden">New</span>
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
            <TabsTrigger value="api-key" className="flex items-center gap-1 md:gap-2 px-2 md:px-4">
              <Key className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">API Key</span>
              <span className="sm:hidden">Key</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-4 md:space-y-6">
            <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
              <ImageUpload
                onImageSelect={handleImageSelect}
                selectedImage={selectedImage}
                imagePreview={imagePreview}
                onClear={clearImage}
              />
              
              <CaptionGenerator
                selectedImage={selectedImage}
                hasApiKey={hasApiKey}
                onGenerate={generateCaptions}
                generatedCaptions={generatedCaptions}
                loading={loading}
                imagePreview={imagePreview}
              />
            </div>
          </TabsContent>

          <TabsContent value="api-key" className="space-y-6">
            <ApiKeyManager onApiKeyChange={setHasApiKey} />
          </TabsContent>

          <TabsContent value="history">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Caption History</CardTitle>
                <CardDescription>
                  View and manage your previously generated captions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No caption history yet. Generate some captions to see them here!</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-6">
              <Card className="shadow-elegant max-w-2xl">
                <CardHeader>
                  <CardTitle>Application Settings</CardTitle>
                  <CardDescription>
                    Manage your preferences and settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Default Caption Tone</Label>
                    <Input placeholder="Professional" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Language Preference</Label>
                    <Input placeholder="English" />
                  </div>
                  
                  <Button>Save Settings</Button>
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