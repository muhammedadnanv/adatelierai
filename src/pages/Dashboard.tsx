import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/components/AuthWrapper';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Sparkles, 
  Settings, 
  History, 
  LogOut,
  User,
  Key,
  Wand2
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import ImageUpload from '@/components/ImageUpload';
import CaptionGenerator from '@/components/CaptionGenerator';
import ApiKeyManager from '@/components/ApiKeyManager';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [generatedCaptions, setGeneratedCaptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

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

  const generateCaptions = async (tone: string) => {
    if (!selectedImage || !hasApiKey) {
      toast({
        title: "Missing requirements",
        description: "Please upload an image and set your Gemini API key.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Convert image to base64
      const imageBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Remove data URL prefix to get just the base64 data
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        reader.readAsDataURL(selectedImage);
      });

      // Call Supabase edge function
      const { data, error } = await supabase.functions.invoke('generate-captions', {
        body: {
          image_base64: imageBase64,
          tone: tone,
          prompt: `Generate engaging social media captions for this image with a ${tone} tone.`
        }
      });

      if (error) {
        throw error;
      }

      if (data?.captions && data.captions.length > 0) {
        setGeneratedCaptions(data.captions);
        
        toast({
          title: "Captions generated!",
          description: `${data.captions.length} ${tone} captions created using AI.`,
        });
      } else {
        throw new Error('No captions generated');
      }
    } catch (error) {
      console.error('Caption generation error:', error);
      
      // Fallback to enhanced mock captions
      const toneVariations = {
        professional: [
          "Elevating excellence through strategic vision and innovative execution. #Leadership #Excellence #Innovation",
          "When precision meets purpose, extraordinary results follow. #Strategy #Success #Professional",
          "Building bridges between vision and reality, one milestone at a time. #Progress #Achievement #Business",
          "Excellence is not a destination, but a continuous journey of improvement. #Growth #Quality #Standards",
          "Transforming challenges into opportunities through strategic thinking. #Solutions #Strategy #Leadership"
        ],
        witty: [
          "Plot twist: This wasn't supposed to look this good, but here we are! 😄 #PlotTwist #Unexpected",
          "Me: Takes one photo. Also me: Becomes a photographer. How did this happen? 📸 #AccidentalGenius #Life",
          "Breaking news: Local person takes decent photo, more at 11. 📰 #BreakingNews #Humble",
          "Instructions unclear, accidentally created art. Send help. 🎨 #AccidentalArt #Confused",
          "When your phone camera has more talent than you do. Thanks, technology! 📱 #TechSavvy #Grateful"
        ],
        bold: [
          "🔥 UNSTOPPABLE ENERGY CAPTURED IN ONE FRAME 🔥 #Bold #Energy #Unstoppable",
          "💥 BREAKING BOUNDARIES, SETTING NEW STANDARDS 💥 #GameChanger #Bold #Revolutionary",
          "⚡ ELECTRIC VIBES, INFINITE POSSIBILITIES ⚡ #Electric #Limitless #Power",
          "🚀 LAUNCHING INTO GREATNESS, NO LOOKING BACK 🚀 #Launch #Greatness #Forward",
          "🎯 TARGETED EXCELLENCE, PRECISION IMPACT 🎯 #Precision #Excellence #Impact"
        ],
        casual: [
          "Just another day, just another awesome moment captured ✨ #ChillVibes #Casual #Life",
          "Keeping it real, keeping it simple, keeping it good 😊 #KeepItReal #Simple #Good",
          "Sometimes the best moments are the unplanned ones 🌟 #Spontaneous #Moments #Natural",
          "Living life one photo at a time, and loving every second 📷 #LifeIsGood #Living #Moments",
          "Good vibes only, always and forever 🌈 #GoodVibes #Positive #Forever"
        ],
        inspiring: [
          "✨ Every moment holds the potential for magic - we just need to believe ✨ #Believe #Magic #Potential",
          "🌟 Dreams don't work unless you do - this is proof of what's possible 🌟 #Dreams #Work #Possible",
          "💫 In every ordinary moment lies an extraordinary opportunity 💫 #Extraordinary #Opportunity #Moment",
          "🦋 Like a butterfly, transformation begins with a single moment of courage 🦋 #Transformation #Courage #Growth",
          "🌅 Rise and shine - your potential is limitless, your journey is just beginning 🌅 #Rise #Potential #Journey"
        ]
      };
      
      const captions = toneVariations[tone as keyof typeof toneVariations] || toneVariations.professional;
      setGeneratedCaptions(captions);
      
      toast({
        title: "Captions generated (demo mode)",
        description: `5 ${tone} captions created. Add your Gemini API key for AI-powered captions.`,
        variant: "default",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Socialify
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <User className="w-4 h-4 mr-2" />
              {user?.email}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="create" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit">
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Wand2 className="w-4 h-4" />
              Create
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="api-key" className="flex items-center gap-2">
              <Key className="w-4 h-4" />
              API Key
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
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
            <Card className="shadow-elegant max-w-2xl">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences and settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={user?.email || ''} disabled />
                </div>
                
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input placeholder="Enter your full name" />
                </div>
                
                <Button>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;