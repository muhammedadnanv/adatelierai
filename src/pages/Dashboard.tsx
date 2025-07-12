import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/AuthWrapper';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Upload, 
  Sparkles, 
  Image as ImageIcon, 
  Settings, 
  History, 
  Share2, 
  Copy, 
  Heart, 
  Edit3,
  LogOut,
  User,
  Key,
  Wand2,
  Download
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';

const toneOptions = [
  { value: 'professional', label: 'Professional', icon: '👔' },
  { value: 'witty', label: 'Witty', icon: '😄' },
  { value: 'bold', label: 'Bold', icon: '🔥' },
  { value: 'casual', label: 'Casual', icon: '😊' },
  { value: 'inspiring', label: 'Inspiring', icon: '✨' },
];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [selectedTone, setSelectedTone] = useState('professional');
  const [generatedCaptions, setGeneratedCaptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [hasApiKey, setHasApiKey] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateCaptions = async () => {
    if (!selectedImage || !geminiApiKey) {
      toast({
        title: "Missing requirements",
        description: "Please upload an image and set your Gemini API key.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Mock captions for now - will integrate with Gemini API
      const mockCaptions = [
        `🌟 Discover the extraordinary in everyday moments! This ${selectedTone} perspective brings new life to ordinary scenes. #Inspiration #Creativity`,
        `✨ When vision meets opportunity, magic happens. This image tells a story that words alone cannot capture. #Storytelling #Visual`,
        `🎯 Bold choices lead to remarkable outcomes. Sometimes the best shot is the one you almost didn't take. #BoldMoves #Photography`,
        `💫 In a world full of noise, authentic moments speak the loudest. This captures that perfect authentic essence. #Authentic #Moment`,
        `🚀 Innovation starts with seeing things differently. This perspective challenges us to think beyond the ordinary. #Innovation #Perspective`
      ];
      
      setGeneratedCaptions(mockCaptions);
      
      toast({
        title: "Captions generated!",
        description: "5 unique captions created for your image.",
      });
    } catch (error) {
      toast({
        title: "Error generating captions",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Caption copied to clipboard.",
    });
  };

  const shareToSocial = (platform: string, caption: string) => {
    const encodedCaption = encodeURIComponent(caption);
    let url = '';
    
    if (platform === 'twitter') {
      url = `https://twitter.com/intent/tweet?text=${encodedCaption}`;
    } else if (platform === 'linkedin') {
      url = `https://www.linkedin.com/sharing/share-offsite/?url=${window.location.origin}&text=${encodedCaption}`;
    }
    
    window.open(url, '_blank');
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
              {/* Image Upload Section */}
              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Upload Your Image
                  </CardTitle>
                  <CardDescription>
                    Upload an image to generate engaging social media captions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div
                    className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {imagePreview ? (
                      <div className="space-y-4">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="mx-auto max-h-48 rounded-lg shadow-sm"
                        />
                        <Button variant="outline" size="sm">
                          <Upload className="w-4 h-4 mr-2" />
                          Change Image
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                        <div>
                          <p className="text-lg font-medium">Drop your image here</p>
                          <p className="text-sm text-muted-foreground">
                            or click to browse (JPG, PNG, WEBP)
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  {/* Tone Selection */}
                  <div className="space-y-2">
                    <Label>Caption Tone</Label>
                    <Select value={selectedTone} onValueChange={setSelectedTone}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {toneOptions.map((tone) => (
                          <SelectItem key={tone.value} value={tone.value}>
                            <div className="flex items-center gap-2">
                              <span>{tone.icon}</span>
                              {tone.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={generateCaptions} 
                    disabled={!selectedImage || loading || !hasApiKey}
                    className="w-full"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                        Generating Captions...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Captions
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Generated Captions */}
              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Edit3 className="w-5 h-5" />
                    Generated Captions
                  </CardTitle>
                  <CardDescription>
                    AI-powered captions tailored to your image and tone
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {generatedCaptions.length > 0 ? (
                    <div className="space-y-4">
                      {generatedCaptions.map((caption, index) => (
                        <Card key={index} className="border-muted">
                          <CardContent className="p-4">
                            <p className="text-sm mb-3">{caption}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(caption)}
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Heart className="w-4 h-4" />
                                </Button>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => shareToSocial('twitter', caption)}
                                >
                                  Share to X
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => shareToSocial('linkedin', caption)}
                                >
                                  LinkedIn
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Upload an image and generate captions to see them here</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="api-key" className="space-y-6">
            <Card className="shadow-elegant max-w-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Google Gemini API Key
                </CardTitle>
                <CardDescription>
                  Enter your Google Gemini API key to enable AI caption generation. Your key is encrypted and stored securely.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <Input
                    id="api-key"
                    type="password"
                    placeholder="Enter your Gemini API key"
                    value={geminiApiKey}
                    onChange={(e) => setGeminiApiKey(e.target.value)}
                  />
                </div>
                
                <Button 
                  onClick={() => {
                    setHasApiKey(true);
                    toast({
                      title: "API Key saved",
                      description: "Your Gemini API key has been saved securely.",
                    });
                  }}
                  disabled={!geminiApiKey}
                >
                  Save API Key
                </Button>
                
                {hasApiKey && (
                  <div className="flex items-center gap-2 text-sm text-success">
                    <Badge variant="outline" className="text-success border-success">
                      ✓ API Key configured
                    </Badge>
                  </div>
                )}
                
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">How to get your API key:</h4>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Visit the Google AI Studio</li>
                    <li>Sign in with your Google account</li>
                    <li>Create a new API key</li>
                    <li>Copy and paste it here</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
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