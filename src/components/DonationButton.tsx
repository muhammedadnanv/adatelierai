import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { Heart, Coffee, CreditCard, Gift, Smartphone, QrCode, Copy, CheckCircle } from 'lucide-react';
import QRCode from 'qrcode';

const DonationButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const upiId = 'adnanmuhammad4393@okicici';
  const upiUrl = `upi://pay?pa=${upiId}&pn=Ad%20Atelier%20AI&am=50&tn=Support%20Ad%20Atelier%20AI%20Development`;

  // Generate QR code when dialog opens
  useEffect(() => {
    if (isOpen) {
      generateQRCode();
    }
  }, [isOpen]);

  const generateQRCode = async () => {
    try {
      const qrCodeDataURL = await QRCode.toDataURL(upiUrl, {
        width: 180,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCode(qrCodeDataURL);
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast({
        title: "QR Code Error",
        description: "Unable to generate QR code. Please use direct payment method.",
        variant: "destructive",
      });
    }
  };

  const handleUPIPayment = () => {
    setLoading(true);
    
    try {
      if (isMobile) {
        // On mobile, directly navigate to UPI URL
        window.location.href = upiUrl;
        
        toast({
          title: "UPI Payment Initiated",
          description: "Opening your UPI app to complete the ₹50 payment.",
          duration: 4000,
        });
        
        // Close dialog after initiating payment on mobile for better UX
        setTimeout(() => setIsOpen(false), 1000);
      } else {
        // On desktop, open in new tab/window
        window.open(upiUrl, '_blank');
        
        toast({
          title: "UPI Payment Link Opened",
          description: "Complete the ₹50 payment in your UPI app to support Ad Atelier AI.",
          duration: 4000,
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

  const copyUPIId = async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      setCopied(true);
      toast({
        title: "UPI ID Copied",
        description: "You can now paste it in your UPI app",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please manually copy the UPI ID",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2 hover:bg-primary/10">
          <Heart className="w-4 h-4 text-red-500" />
          Support Us
        </Button>
      </DialogTrigger>
      <DialogContent className={`sm:max-w-md ${isMobile ? 'w-[95vw] mx-2' : ''}`}>
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
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">₹50</div>
                <div className="text-sm text-muted-foreground">One-time donation</div>
              </div>
              
              {/* Payment Methods Tabs */}
              <Tabs defaultValue="qr" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="qr" className="flex items-center gap-1 text-xs">
                    <QrCode className="w-3 h-3" />
                    QR Code
                  </TabsTrigger>
                  <TabsTrigger value="direct" className="flex items-center gap-1 text-xs">
                    <Smartphone className="w-3 h-3" />
                    Direct Pay
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="qr" className="space-y-3 mt-4">
                  <div className="text-center space-y-3">
                    {qrCode ? (
                      <>
                        <img 
                          src={qrCode} 
                          alt="UPI Payment QR Code" 
                          className="w-40 h-40 mx-auto border border-primary/20 rounded-lg shadow-sm"
                        />
                        <p className="text-xs text-muted-foreground">
                          Scan with any UPI app to donate ₹50
                        </p>
                      </>
                    ) : (
                      <div className="w-40 h-40 mx-auto border border-primary/20 rounded-lg flex items-center justify-center bg-muted">
                        <div className="text-center space-y-2">
                          <QrCode className="w-6 h-6 mx-auto text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">Generating...</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* UPI ID Copy */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-center">Or copy UPI ID:</p>
                    <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                      <code className="flex-1 text-xs font-mono">{upiId}</code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={copyUPIId}
                        className="h-6 px-2"
                      >
                        {copied ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="direct" className="space-y-3 mt-4">
                  <div className="text-center space-y-2">
                    <p className="text-xs text-muted-foreground">
                      {isMobile 
                        ? "Tap to open your UPI app directly"
                        : "Click to open UPI payment"
                      }
                    </p>
                  </div>
                  
                  <Button 
                    onClick={handleUPIPayment}
                    disabled={loading}
                    className={`w-full ${isMobile ? 'h-10 text-sm' : 'text-sm'}`}
                    variant="default"
                  >
                    {loading ? (
                      <>
                        <div className="w-3 h-3 mr-2 border border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        {isMobile ? <Smartphone className="w-4 h-4 mr-2" /> : <CreditCard className="w-4 h-4 mr-2" />}
                        {isMobile ? 'Open UPI App' : 'Pay with UPI'}
                      </>
                    )}
                  </Button>
                </TabsContent>
              </Tabs>
              
              <div className="text-xs text-center text-muted-foreground">
                Secure UPI payment • To: {upiId}
              </div>
            </CardContent>
          </Card>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Thank you for supporting Ad Atelier AI development! 🚀
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DonationButton;