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
      <CardContent className="p-3 sm:p-4">
        <h3 className="text-sm font-semibold mb-3 sm:mb-4">Platform Preview</h3>
        <Tabs defaultValue="instagram" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-3 sm:mb-4 h-auto p-1">
            <TabsTrigger value="instagram" className="text-xs px-1 py-2 sm:px-2">
              <Instagram className="w-3 h-3 sm:mr-1" />
              <span className="hidden sm:inline">Instagram</span>
            </TabsTrigger>
            <TabsTrigger value="linkedin" className="text-xs px-1 py-2 sm:px-2">
              <Linkedin className="w-3 h-3 sm:mr-1" />
              <span className="hidden sm:inline">LinkedIn</span>
            </TabsTrigger>
            <TabsTrigger value="twitter" className="text-xs px-1 py-2 sm:px-2">
              <Twitter className="w-3 h-3 sm:mr-1" />
              <span className="hidden sm:inline">X</span>
            </TabsTrigger>
            <TabsTrigger value="threads" className="text-xs px-1 py-2 sm:px-2">
              <MessageCircle className="w-3 h-3 sm:mr-1" />
              <span className="hidden sm:inline">Threads</span>
            </TabsTrigger>
          </TabsList>

          {/* Instagram Preview */}
          <TabsContent value="instagram" className="space-y-2 sm:space-y-3">
            <div className="border rounded-lg p-2 sm:p-3 bg-background">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-semibold">Your Profile</span>
              </div>
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="w-full rounded-lg mb-2 sm:mb-3" />
              )}
              <div className="text-xs sm:text-sm space-y-2">
                <p className="whitespace-pre-wrap break-words">{caption}</p>
                <p className="text-blue-500 break-words">{hashtagText}</p>
              </div>
            </div>
          </TabsContent>

          {/* LinkedIn Preview */}
          <TabsContent value="linkedin" className="space-y-2 sm:space-y-3">
            <div className="border rounded-lg p-2 sm:p-3 bg-background">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-semibold truncate">Your Name</p>
                  <p className="text-xs text-muted-foreground truncate">Your Title</p>
                </div>
              </div>
              <div className="text-xs sm:text-sm space-y-2 mb-2 sm:mb-3">
                <p className="whitespace-pre-wrap break-words">{caption}</p>
                <p className="text-blue-600 break-words">{hashtagText}</p>
              </div>
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="w-full rounded-lg" />
              )}
            </div>
          </TabsContent>

          {/* Twitter/X Preview */}
          <TabsContent value="twitter" className="space-y-2 sm:space-y-3">
            <div className="border rounded-lg p-2 sm:p-3 bg-background">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black dark:bg-white flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-semibold truncate">Your Name</p>
                  <p className="text-xs text-muted-foreground truncate">@yourhandle</p>
                </div>
              </div>
              <div className="text-xs sm:text-sm space-y-2">
                <p className="whitespace-pre-wrap break-words">{caption} {hashtagText}</p>
              </div>
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="w-full rounded-2xl mt-2 sm:mt-3" />
              )}
            </div>
          </TabsContent>

          {/* Threads Preview */}
          <TabsContent value="threads" className="space-y-2 sm:space-y-3">
            <div className="border rounded-lg p-2 sm:p-3 bg-background">
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-semibold mb-1 truncate">yourhandle</p>
                  <div className="text-xs sm:text-sm space-y-2">
                    <p className="whitespace-pre-wrap break-words">{caption}</p>
                    {hashtagText && <p className="text-muted-foreground break-words">{hashtagText}</p>}
                  </div>
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="w-full rounded-lg mt-2 sm:mt-3" />
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
