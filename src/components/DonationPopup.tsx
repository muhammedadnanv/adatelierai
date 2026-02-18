import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Heart, Coffee, Sparkles, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface DonationPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const DonationPopup = ({ isOpen, onClose }: DonationPopupProps) => {
  const razorpayLink = 'https://razorpay.me/@adnan4402';

  const handleDonate = () => {
    window.open(razorpayLink, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md glass-card p-0 overflow-hidden">
        {/* Gradient header */}
        <div className="bg-gradient-hero p-6 text-center relative">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring' }}
            className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full backdrop-blur-sm mb-4"
          >
            <Heart className="w-8 h-8 text-white fill-white" />
          </motion.div>
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-2xl font-heading font-bold text-white">
              Support Ad Atelier AI
            </DialogTitle>
            <DialogDescription className="text-white/90 text-base">
              Help us keep building amazing AI tools for creators
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6">
          {/* Benefits */}
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground text-center">
              Your support helps us:
            </p>
            <div className="grid gap-3">
              {[
                { icon: Sparkles, text: 'Improve AI caption quality' },
                { icon: Coffee, text: 'Keep the platform free for everyone' },
                { icon: Heart, text: 'Add more features & platforms' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleDonate}
              className="w-full bg-gradient-hero hover:opacity-90 shadow-primary text-lg py-6 font-semibold"
            >
              <Heart className="w-5 h-5 mr-2 fill-current" />
              Donate Now
            </Button>
            <Button
              variant="ghost"
              onClick={onClose}
              className="w-full text-muted-foreground"
            >
              Maybe Later
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Secure payment powered by Razorpay 🔒
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DonationPopup;

// Hook to manage donation popup visibility
export const useDonationPopup = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const lastShown = localStorage.getItem('donation_popup_last_shown');
    const dismissCount = parseInt(localStorage.getItem('donation_popup_dismiss_count') || '0', 10);
    
    // Don't show if dismissed more than 5 times
    if (dismissCount >= 5) return;
    
    // Don't show if shown in the last 24 hours
    if (lastShown) {
      const hoursSinceLastShown = (Date.now() - parseInt(lastShown, 10)) / (1000 * 60 * 60);
      if (hoursSinceLastShown < 24) return;
    }

    // Show after 60 seconds on page
    const timer = setTimeout(() => {
      setIsVisible(true);
      localStorage.setItem('donation_popup_last_shown', Date.now().toString());
    }, 60000);

    return () => clearTimeout(timer);
  }, []);

  const dismissPopup = () => {
    setIsVisible(false);
    const currentCount = parseInt(localStorage.getItem('donation_popup_dismiss_count') || '0', 10);
    localStorage.setItem('donation_popup_dismiss_count', (currentCount + 1).toString());
  };

  return { isVisible, dismissPopup };
};
