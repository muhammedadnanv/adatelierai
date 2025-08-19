import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Copy, Heart, Share2, Edit3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CaptionGeneratorProps {
  selectedImage: File | null;
  hasApiKey: boolean;
  onGenerate: (tone: string) => Promise<void>;
  generatedCaptions: string[];
  loading: boolean;
}

const toneOptions = [
  { value: 'professional', label: 'Professional', icon: '👔', description: 'Formal and business-appropriate' },
  { value: 'witty', label: 'Witty', icon: '😄', description: 'Clever and humorous' },
  { value: 'bold', label: 'Bold', icon: '🔥', description: 'Confident and striking' },
  { value: 'casual', label: 'Casual', icon: '😊', description: 'Relaxed and friendly' },
  { value: 'inspiring', label: 'Inspiring', icon: '✨', description: 'Motivational and uplifting' },
];

const CaptionGenerator = ({ 
  selectedImage, 
  hasApiKey, 
  onGenerate, 
  generatedCaptions, 
  loading 
}: CaptionGeneratorProps) => {
  const [selectedTone, setSelectedTone] = useState('professional');
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!selectedImage) {
      toast({
        title: "No image selected",
        description: "Please upload an image first.",
        variant: "destructive",
      });
      return;
    }

    if (!hasApiKey) {
      toast({
        title: "API key required",
        description: "Please set your Gemini API key in the API Key tab.",
        variant: "destructive",
      });
      return;
    }

    await onGenerate(selectedTone);
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
    <div className="space-y-6">
      {/* Tone Selection */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>Caption Settings</CardTitle>
          <CardDescription>
            Choose the tone and style for your captions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
                      <div>
                        <div className="font-medium">{tone.label}</div>
                        <div className="text-xs text-muted-foreground">{tone.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleGenerate}
            disabled={!selectedImage || loading || !hasApiKey}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Sparkles className="w-3 h-3 md:w-4 md:h-4 mr-2 animate-spin" />
                <span className="hidden sm:inline">Generating Captions...</span>
                <span className="sm:hidden">Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                <span className="hidden sm:inline">Generate 5 Captions</span>
                <span className="sm:hidden">Generate</span>
              </>
            )}
          </Button>

          {!hasApiKey && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs md:text-sm text-yellow-800">
                ⚠️ Please set your Gemini API key to generate captions
              </p>
            </div>
          )}
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
                <Card key={index} className="border-muted hover:shadow-sm transition-shadow">
                  <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <Badge variant="outline" className="text-xs">
                            Caption {index + 1}
                          </Badge>
                        </div>
                        <p className="text-sm leading-relaxed">{caption}</p>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(caption)}
                              className="flex-1 sm:flex-none"
                            >
                              <Copy className="w-3 h-3 md:w-4 md:h-4" />
                              <span className="ml-1">Copy</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="flex-1 sm:flex-none">
                              <Heart className="w-3 h-3 md:w-4 md:h-4" />
                              <span className="ml-1 hidden sm:inline">Save</span>
                            </Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => shareToSocial('twitter', caption)}
                              className="flex-1 sm:flex-none text-xs sm:text-sm"
                            >
                              <span className="hidden sm:inline">Share to X</span>
                              <span className="sm:hidden">X</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => shareToSocial('linkedin', caption)}
                              className="flex-1 sm:flex-none text-xs sm:text-sm"
                            >
                              LinkedIn
                            </Button>
                          </div>
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
  );
};

export default CaptionGenerator;