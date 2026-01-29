import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Copy, Heart, Share2, Edit3, Hash, TrendingUp, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PlatformPreview from './PlatformPreview';

interface CaptionVariation {
  caption: string;
  hashtags: string[];
  keywords: string[];
  platform: string;
}

interface CaptionGeneratorProps {
  selectedImage: File | null;
  onGenerate: (tone: string, prompt: string, platform: string) => Promise<void>;
  generatedCaptions: CaptionVariation[];
  loading: boolean;
  imagePreview: string;
}

const toneOptions = [
  { value: 'professional', label: 'Professional', icon: '👔', description: 'Formal and business-appropriate' },
  { value: 'witty', label: 'Witty', icon: '😄', description: 'Clever and humorous' },
  { value: 'bold', label: 'Bold', icon: '🔥', description: 'Confident and striking' },
  { value: 'casual', label: 'Casual', icon: '😊', description: 'Relaxed and friendly' },
  { value: 'inspiring', label: 'Inspiring', icon: '✨', description: 'Motivational and uplifting' },
];

const platformOptions = [
  { value: 'instagram', label: 'Instagram', icon: '📸', description: 'Visual-first with hashtags' },
  { value: 'linkedin', label: 'LinkedIn', icon: '💼', description: 'Professional networking' },
  { value: 'twitter', label: 'X (Twitter)', icon: '🐦', description: 'Short and punchy' },
  { value: 'threads', label: 'Threads', icon: '🧵', description: 'Conversational posts' },
];

const CaptionGenerator = ({ 
  selectedImage, 
  onGenerate, 
  generatedCaptions, 
  loading,
  imagePreview 
}: CaptionGeneratorProps) => {
  const [selectedTone, setSelectedTone] = useState('professional');
  const [selectedPlatform, setSelectedPlatform] = useState('instagram');
  const [selectedVariation, setSelectedVariation] = useState(0);
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

    await onGenerate(selectedTone, '', selectedPlatform);
  };

  const copyToClipboard = (variation: CaptionVariation) => {
    const fullText = `${variation.caption}\n\n${variation.hashtags.join(' ')}`;
    navigator.clipboard.writeText(fullText);
    toast({
      title: "Copied!",
      description: "Caption and hashtags copied to clipboard.",
    });
  };

  const copyHashtags = (hashtags: string[]) => {
    navigator.clipboard.writeText(hashtags.join(' '));
    toast({
      title: "Hashtags copied!",
      description: "Paste them into your post.",
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="space-y-2">
              <Label>Target Platform</Label>
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {platformOptions.map((platform) => (
                    <SelectItem key={platform.value} value={platform.value}>
                      <div className="flex items-center gap-2">
                        <span>{platform.icon}</span>
                        <div>
                          <div className="font-medium">{platform.label}</div>
                          <div className="text-xs text-muted-foreground">{platform.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleGenerate}
            disabled={!selectedImage || loading}
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
                <span className="hidden sm:inline">Generate 3 Variations with Hashtags</span>
                <span className="sm:hidden">Generate</span>
              </>
            )}
          </Button>

        </CardContent>
      </Card>

      {/* A/B Testing Variations */}
      {generatedCaptions.length > 0 && (
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              A/B Testing Variations
            </CardTitle>
            <CardDescription>
              Compare different caption styles for optimal engagement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Variation Selector */}
              <div className="flex gap-2 flex-wrap">
                {generatedCaptions.map((variation, index) => (
                  <Button
                    key={index}
                    variant={selectedVariation === index ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedVariation(index)}
                  >
                    Variation {String.fromCharCode(65 + index)}
                  </Button>
                ))}
              </div>

              {/* Selected Variation Details */}
              {generatedCaptions[selectedVariation] && (
                <div className="space-y-4">
                  <Card className="border-2 border-primary/20">
                    <CardContent className="p-4 space-y-4">
                      {/* Caption Text */}
                      <div>
                        <Label className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                          <Edit3 className="w-3 h-3" />
                          Caption
                        </Label>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {generatedCaptions[selectedVariation].caption}
                        </p>
                      </div>

                      {/* Hashtags */}
                      <div>
                        <Label className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                          <Hash className="w-3 h-3" />
                          Suggested Hashtags ({generatedCaptions[selectedVariation].hashtags.length})
                        </Label>
                        <div className="flex flex-wrap gap-2">
                          {generatedCaptions[selectedVariation].hashtags.map((tag, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyHashtags(generatedCaptions[selectedVariation].hashtags)}
                            className="h-6 text-xs"
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Copy All
                          </Button>
                        </div>
                      </div>

                      {/* Keywords */}
                      <div>
                        <Label className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Keywords for Discoverability
                        </Label>
                        <div className="flex flex-wrap gap-2">
                          {generatedCaptions[selectedVariation].keywords.map((keyword, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row flex-wrap gap-2 pt-2">
                        <Button
                          variant="default"
                          size="sm"
                          className="w-full sm:w-auto"
                          onClick={() => copyToClipboard(generatedCaptions[selectedVariation])}
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Copy Caption
                        </Button>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 sm:flex-initial"
                            onClick={() => shareToSocial('twitter', generatedCaptions[selectedVariation].caption)}
                          >
                            Share to X
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 sm:flex-initial"
                            onClick={() => shareToSocial('linkedin', generatedCaptions[selectedVariation].caption)}
                          >
                            Share to LinkedIn
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Platform Preview */}
      {generatedCaptions.length > 0 && generatedCaptions[selectedVariation] && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-5 h-5" />
            <h3 className="font-semibold">Preview on Platforms</h3>
          </div>
          <PlatformPreview
            caption={generatedCaptions[selectedVariation].caption}
            hashtags={generatedCaptions[selectedVariation].hashtags}
            imagePreview={imagePreview}
          />
        </div>
      )}

      {/* Empty State */}
      {generatedCaptions.length === 0 && (
        <Card className="shadow-elegant">
          <CardContent className="text-center py-12 text-muted-foreground">
            <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">Ready to Generate Captions</p>
            <p className="text-sm">Upload an image, select your platform and tone, then generate variations</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CaptionGenerator;