import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, ImageIcon, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  selectedImage: File | null;
  imagePreview: string;
  onClear: () => void;
}

const ImageUpload = ({ onImageSelect, selectedImage, imagePreview, onClear }: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && validateFile(file)) {
      onImageSelect(file);
    }
  };

  const validateFile = (file: File) => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG, WEBP, etc.)",
        variant: "destructive",
      });
      return false;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      onImageSelect(file);
    }
  };

  return (
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
          className={`border-2 border-dashed rounded-xl p-4 md:p-8 text-center transition-all duration-300 cursor-pointer ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {imagePreview ? (
            <div className="space-y-4">
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mx-auto max-h-32 sm:max-h-48 rounded-lg shadow-sm"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClear();
                  }}
                >
                  <X className="w-3 h-3 md:w-4 md:h-4" />
                </Button>
              </div>
              <Button variant="outline" size="sm">
                <Upload className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                <span className="hidden sm:inline">Change Image</span>
                <span className="sm:hidden">Change</span>
              </Button>
              {selectedImage && (
                <p className="text-xs text-muted-foreground">
                  {selectedImage.name} ({(selectedImage.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-3 md:space-y-4">
              <Upload className="w-8 h-8 md:w-12 md:h-12 mx-auto text-muted-foreground" />
              <div>
                <p className="text-base md:text-lg font-medium">Drop your image here</p>
                <p className="text-xs md:text-sm text-muted-foreground">
                  or click to browse (JPG, PNG, WEBP - max 10MB)
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
      </CardContent>
    </Card>
  );
};

export default ImageUpload;