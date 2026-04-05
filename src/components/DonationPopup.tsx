import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Heart, Coffee, Sparkles, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface DonationPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const DonationPopup = ({ isOpen, onClose }: DonationPopupProps) => {
  const [loading, setLoading] = useState(false);

  const handleDonate = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('razorpay-order', {
        body: { action: 'create_order', amount: 39 },
      });

      if (error || !data?.order_id) throw new Error('Failed to create order');

      if (!window.Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement('script');
          s.src = 'https://checkout.razorpay.com/v1/checkout.js';
          s.onload = () => resolve();
          s.onerror = () => reject(new Error('Failed to load Razorpay'));
          document.head.appendChild(s);
        });
      }

      const rzp = new window.Razorpay({
        key: data.key_id,
        amount: data.amount,
        currency: 'INR',
        name: 'Ad Atelier AI',
        description: 'Support Ad Atelier AI',
        order_id: data.order_id,
        handler: async (response: any) => {
          const userEmail = prompt('Enter your email for the receipt (optional):') || '';
          await supabase.functions.invoke('razorpay-order', {
            body: {
              action: 'verify_payment',
              payment_id: response.razorpay_payment_id,
              order_id: response.razorpay_order_id,
              signature: response.razorpay_signature,
              email: userEmail,
              name: '',
            },
          });
          toast({ title: '🎉 Thank you!', description: 'Your donation means a lot to us.' });
          onClose();
        },
        theme: { color: '#9b87f5' },
        modal: { ondismiss: () => setLoading(false) },
      });
      rzp.open();
      setLoading(false);
    } catch {
      toast({ title: 'Error', description: 'Could not initiate payment', variant: 'destructive' });
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md glass-card p-0 overflow-hidden">
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
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground text-center">Your support helps us:</p>
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

          <div className="space-y-3">
            <Button
              onClick={handleDonate}
              disabled={loading}
              className="w-full bg-gradient-hero hover:opacity-90 shadow-primary text-lg py-6 font-semibold"
            >
              {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Heart className="w-5 h-5 mr-2 fill-current" />}
              {loading ? 'Processing...' : 'Donate ₹39 Now'}
            </Button>
            <Button variant="ghost" onClick={onClose} className="w-full text-muted-foreground">
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

export const useDonationPopup = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const lastShown = localStorage.getItem('donation_popup_last_shown');
    const dismissCount = parseInt(localStorage.getItem('donation_popup_dismiss_count') || '0', 10);
    if (dismissCount >= 5) return;
    if (lastShown) {
      const hoursSinceLastShown = (Date.now() - parseInt(lastShown, 10)) / (1000 * 60 * 60);
      if (hoursSinceLastShown < 24) return;
    }
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
