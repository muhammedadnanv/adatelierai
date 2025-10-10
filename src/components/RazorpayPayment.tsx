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
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount.",
        variant: "destructive",
      });
      return;
    }

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

      // Create order via edge function
      const { data: orderData, error: orderError } = await supabase.functions.invoke('create-razorpay-order', {
        body: { amount: parseFloat(amount) * 100 } // Convert to paise
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

            toast({
              title: "Payment successful!",
              description: "Thank you for your payment. Premium features unlocked.",
            });
            
            setAmount('');
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

  return (
    <Card className="shadow-elegant max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Make a Payment
        </CardTitle>
        <CardDescription>
          Secure payment powered by Razorpay
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (₹)</Label>
          <Input
            id="amount"
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
            step="0.01"
          />
        </div>

        <Button 
          onClick={handlePayment}
          disabled={loading || !amount}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Pay with Razorpay
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          All payments are secure and encrypted. We support all major payment methods including cards, UPI, and wallets.
        </p>
      </CardContent>
    </Card>
  );
};

export default RazorpayPayment;
