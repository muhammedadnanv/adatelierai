import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Instagram, Linkedin, Twitter, MessageCircle } from 'lucide-react';

interface PlatformPreviewProps {
  caption: string;
  hashtags: string[];
  imagePreview: string | null;
}

const PlatformPreview = ({ caption, hashtags, imagePreview }: PlatformPreviewProps) => {
  const hashtagText = hashtags.join(' ');

  return (
    <Card className="shadow-elegant">
      <CardContent className="p-4">
        <h3 className="text-sm font-semibold mb-4">Platform Preview</h3>
        <Tabs defaultValue="instagram" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="instagram" className="text-xs">
              <Instagram className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">Instagram</span>
            </TabsTrigger>
            <TabsTrigger value="linkedin" className="text-xs">
              <Linkedin className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">LinkedIn</span>
            </TabsTrigger>
            <TabsTrigger value="twitter" className="text-xs">
              <Twitter className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">X</span>
            </TabsTrigger>
            <TabsTrigger value="threads" className="text-xs">
              <MessageCircle className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">Threads</span>
            </TabsTrigger>
          </TabsList>

          {/* Instagram Preview */}
          <TabsContent value="instagram" className="space-y-3">
            <div className="border rounded-lg p-3 bg-background">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500" />
                <span className="text-sm font-semibold">Your Profile</span>
              </div>
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="w-full rounded-lg mb-3" />
              )}
              <div className="text-sm space-y-2">
                <p className="whitespace-pre-wrap">{caption}</p>
                <p className="text-blue-500">{hashtagText}</p>
              </div>
            </div>
          </TabsContent>

          {/* LinkedIn Preview */}
          <TabsContent value="linkedin" className="space-y-3">
            <div className="border rounded-lg p-3 bg-background">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-600" />
                <div>
                  <p className="text-sm font-semibold">Your Name</p>
                  <p className="text-xs text-muted-foreground">Your Title</p>
                </div>
              </div>
              <div className="text-sm space-y-2 mb-3">
                <p className="whitespace-pre-wrap">{caption}</p>
                <p className="text-blue-600">{hashtagText}</p>
              </div>
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="w-full rounded-lg" />
              )}
            </div>
          </TabsContent>

          {/* Twitter/X Preview */}
          <TabsContent value="twitter" className="space-y-3">
            <div className="border rounded-lg p-3 bg-background">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-black dark:bg-white" />
                <div>
                  <p className="text-sm font-semibold">Your Name</p>
                  <p className="text-xs text-muted-foreground">@yourhandle</p>
                </div>
              </div>
              <div className="text-sm space-y-2">
                <p className="whitespace-pre-wrap">{caption} {hashtagText}</p>
              </div>
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="w-full rounded-2xl mt-3" />
              )}
            </div>
          </TabsContent>

          {/* Threads Preview */}
          <TabsContent value="threads" className="space-y-3">
            <div className="border rounded-lg p-3 bg-background">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold mb-1">yourhandle</p>
                  <div className="text-sm space-y-2">
                    <p className="whitespace-pre-wrap">{caption}</p>
                    {hashtagText && <p className="text-muted-foreground">{hashtagText}</p>}
                  </div>
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="w-full rounded-lg mt-3" />
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PlatformPreview;
