import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Heart, Coffee, CreditCard, Gift } from 'lucide-react';

const DonationButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleDonation = async () => {
    setLoading(true);
    try {
      // Simulate donation processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Thank you for your support! 🙏",
        description: "Your ₹50 donation helps us keep improving Ad Atelier AI.",
      });
      
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Donation failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUPIPayment = () => {
    const upiUrl = `upi://pay?pa=support@adatelierai.com&pn=Ad%20Atelier%20AI&am=50&cu=INR&tn=Support%20Ad%20Atelier%20AI%20Development`;
    window.open(upiUrl, '_blank');
    
    toast({
      title: "UPI Payment Initiated",
      description: "Complete the payment in your UPI app.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2 hover:bg-primary/10">
          <Heart className="w-4 h-4 text-red-500" />
          Support Us
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            Support Ad Atelier AI
          </DialogTitle>
          <DialogDescription>
            Help us continue building amazing AI-powered tools for creators like you!
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Coffee className="w-5 h-5 text-orange-500" />
                Buy us a coffee
              </CardTitle>
              <CardDescription>
                Your ₹50 donation helps us maintain and improve the platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">₹50</div>
                <div className="text-sm text-muted-foreground">One-time donation</div>
              </div>
              
              <div className="space-y-2">
                <Button 
                  onClick={handleUPIPayment}
                  className="w-full"
                  variant="default"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay with UPI
                </Button>
                
                <Button 
                  onClick={handleDonation}
                  className="w-full"
                  variant="outline"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Other Payment Methods'}
                </Button>
              </div>
              
              <div className="text-xs text-center text-muted-foreground">
                Secure payment processing • 100% goes to development
              </div>
            </CardContent>
          </Card>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Thank you for supporting open-source AI tools! 🚀
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DonationButton;