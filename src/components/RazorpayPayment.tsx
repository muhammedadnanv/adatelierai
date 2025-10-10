import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const RazorpayPayment = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [accessCode, setAccessCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const amount = '399'; // Fixed amount

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const copyAccessCode = async () => {
    if (!accessCode) return;
    
    try {
      await navigator.clipboard.writeText(accessCode);
      setCopied(true);
      toast({
        title: "Access code copied!",
        description: "Your access code has been copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy the access code manually.",
        variant: "destructive",
      });
    }
  };

  const handlePayment = async () => {
    setLoading(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      
      if (!scriptLoaded) {
        toast({
          title: "Payment gateway error",
          description: "Failed to load payment gateway. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Create order via edge function (amount is fixed at ₹399)
      const { data: orderData, error: orderError } = await supabase.functions.invoke('create-razorpay-order', {
        body: {}
      });

      if (orderError) throw orderError;

      const options = {
        key: 'rzp_live_RRgxSkgbXd5qsM',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Ad Atelier AI',
        description: 'Premium Features Payment',
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            // Verify payment
            const { data: verifyData, error: verifyError } = await supabase.functions.invoke('verify-razorpay-payment', {
              body: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            });

            if (verifyError) throw verifyError;

            // Store access code from verification response
            if (verifyData?.access_code) {
              setAccessCode(verifyData.access_code);
              
              // Also store in localStorage for persistence
              localStorage.setItem('access_code', verifyData.access_code);
              
              toast({
                title: "Payment successful!",
                description: "Your access code has been generated. Save it securely!",
              });
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast({
              title: "Payment verification failed",
              description: "Please contact support with your payment details.",
              variant: "destructive",
            });
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        theme: {
          color: '#6366f1'
        },
        modal: {
          ondismiss: function() {
            toast({
              title: "Payment cancelled",
              description: "You cancelled the payment process.",
            });
            setLoading(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      setLoading(false);
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  // Check if user already has access code
  const storedAccessCode = localStorage.getItem('access_code');
  
  if (accessCode || storedAccessCode) {
    const displayCode = accessCode || storedAccessCode;
    return (
      <Card className="shadow-elegant max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CreditCard className="w-5 h-5" />
            Payment Successful!
          </CardTitle>
          <CardDescription>
            Your access code for the platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gradient-primary/10 rounded-lg p-6 space-y-4">
            <p className="text-sm font-medium text-center">Your Access Code:</p>
            <div className="bg-white rounded-lg p-4 border-2 border-primary">
              <p className="text-2xl font-bold text-center tracking-wider text-primary">
                {displayCode}
              </p>
            </div>
            <Button
              onClick={copyAccessCode}
              variant="outline"
              className="w-full"
            >
              {copied ? 'Copied!' : 'Copy Access Code'}
            </Button>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800 font-medium mb-2">⚠️ Important:</p>
            <ul className="text-xs text-yellow-700 space-y-1">
              <li>• Save this code securely</li>
              <li>• You'll need it to access premium features</li>
              <li>• Don't share this code with anyone</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-elegant max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Unlock Platform Access
        </CardTitle>
        <CardDescription>
          One-time payment of ₹399 for lifetime access
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-primary/10 rounded-lg p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Platform Access</span>
            <span className="text-2xl font-bold text-primary">₹399</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Get lifetime access to all premium features
          </p>
        </div>

        <div className="space-y-2">
          <Label>Features included:</Label>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>✓ Unlimited AI caption generation</li>
            <li>✓ All tone variations</li>
            <li>✓ Priority support</li>
            <li>✓ Early access to new features</li>
          </ul>
        </div>

        <Button 
          onClick={handlePayment}
          disabled={loading}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Pay ₹399 Now
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Secure payment powered by Razorpay. All major payment methods supported including cards, UPI, and wallets.
        </p>
      </CardContent>
    </Card>
  );
};

export default RazorpayPayment;
