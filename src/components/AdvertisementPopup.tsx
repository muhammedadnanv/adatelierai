import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, ExternalLink, ShoppingBag, Zap, TrendingUp } from 'lucide-react';
import storeLinkLogo from '@/assets/storelink-logo.png';

interface AdvertisementPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdvertisementPopup = ({ isOpen, onClose }: AdvertisementPopupProps) => {
  const handleVisitStore = () => {
    window.open('https://store.link?via=Um4wGCfwh0xG', '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <div className="relative bg-gradient-subtle">
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full bg-white/80 hover:bg-white"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Header with logo */}
          <div className="bg-gradient-hero p-6 text-white">
            <div className="flex items-center justify-center mb-4">
              <img 
                src={storeLinkLogo} 
                alt="store.link" 
                className="h-12 w-auto"
              />
            </div>
            <DialogTitle className="text-2xl text-center mb-2 text-white">
              Turn Your Content Into Sales
            </DialogTitle>
            <DialogDescription className="text-center text-white/90">
              You're creating viral content. Now monetize it!
            </DialogDescription>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Launch Your Online Store</h4>
                  <p className="text-sm text-muted-foreground">
                    Create a professional store in seconds without any coding
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Sell What You Promote</h4>
                  <p className="text-sm text-muted-foreground">
                    Perfect for influencers, creators, and social sellers
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Boost Your Revenue</h4>
                  <p className="text-sm text-muted-foreground">
                    Convert your social media audience into paying customers
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
              <p className="text-sm text-center font-medium">
                🎉 <span className="text-accent">Special Offer:</span> Start selling in minutes, no setup fees!
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-2 pt-2">
              <Button 
                onClick={handleVisitStore}
                className="w-full"
                size="lg"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Create Your Store Now
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={onClose}
                className="w-full"
              >
                Maybe Later
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Powered by store.link - Trusted by thousands of creators
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdvertisementPopup;
