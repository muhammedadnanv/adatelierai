import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Coffee, X, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface DonationPopupProps {
  isOpen: boolean;
  onClose: (permanently?: boolean) => void;
}

const DonationPopup = ({ isOpen, onClose }: DonationPopupProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleUPIPayment = async () => {
    setLoading(true);
    
    try {
      const upiUrl = 'upi://pay?pa=adatelier.ai@paytm&pn=Ad%20Atelier%20AI&am=50&tn=Support%20Ad%20Atelier%20AI%20Development';
      
      if (isMobile) {
        // Direct UPI app navigation on mobile
        window.location.href = upiUrl;
        
        toast({
          title: "UPI Payment Initiated",
          description: "Opening your UPI app to complete the donation. Thank you for your support!",
        });
        
        // Close popup after initiating payment on mobile
        setTimeout(() => {
          onClose(false);
        }, 1000);
      } else {
        // Open in new tab for desktop
        window.open(upiUrl, '_blank');
        
        toast({
          title: "UPI Payment Link Opened",
          description: "Please scan the QR code or use UPI ID on your mobile device.",
        });
      }
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemindLater = () => {
    onClose(true); // Temporarily dismiss
    toast({
      title: "Reminder Set",
      description: "We'll remind you again later. Thank you for considering!",
    });
  };

  const handleNoThanks = () => {
    onClose(false); // Permanent dismissal
    toast({
      title: "No Problem!",
      description: "Thanks for using Ad Atelier AI!",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose(true)}>
      <DialogContent className="sm:max-w-md bg-gradient-subtle border-2 border-primary/20">
        <DialogHeader className="text-center space-y-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <DialogTitle className="text-xl font-bold text-primary flex items-center justify-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Support Our Mission
              </DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onClose(true)}
              className="h-6 w-6 p-0 hover:bg-red-100"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <DialogDescription className="text-base">
            Love using Ad Atelier AI? Help us keep improving and adding new features!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Main CTA */}
          <Card className="bg-gradient-primary text-white border-0 shadow-glow">
            <CardContent className="p-4 text-center space-y-3">
              <div className="flex items-center justify-center gap-2">
                <Coffee className="w-5 h-5" />
                <span className="font-semibold text-lg">Buy us a coffee!</span>
              </div>
              <p className="text-sm opacity-90">
                Support our team with ₹50 and help us build better AI tools
              </p>
              
              <Button
                onClick={handleUPIPayment}
                disabled={loading}
                variant="secondary"
                className="w-full bg-white text-primary hover:bg-white/90"
                size="lg"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {isMobile ? <Smartphone className="w-4 h-4 mr-2" /> : <span className="mr-2">💳</span>}
                    Pay ₹50 via UPI
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Features List */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="w-2 h-2 p-0 bg-green-500 border-green-500"></Badge>
              <span>Free AI Captions</span>
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="w-2 h-2 p-0 bg-blue-500 border-blue-500"></Badge>
              <span>Regular Updates</span>
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="w-2 h-2 p-0 bg-purple-500 border-purple-500"></Badge>
              <span>No Ads</span>
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="w-2 h-2 p-0 bg-orange-500 border-orange-500"></Badge>
              <span>New Features</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleRemindLater}
              className="flex-1 text-sm"
              size="sm"
            >
              Remind Later
            </Button>
            <Button
              variant="ghost"
              onClick={handleNoThanks}
              className="flex-1 text-sm text-muted-foreground"
              size="sm"
            >
              No Thanks
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Your support helps us maintain and improve Ad Atelier AI for everyone! 🚀
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DonationPopup;