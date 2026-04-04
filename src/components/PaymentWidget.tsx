import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, IndianRupee, Shield, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const RAZORPAY_KEY_ID = 'rzp_live_SZIYgnAQN4Bg5n';

const PaymentWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [accessCode, setAccessCode] = useState('');

  const amount = 39;

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Create order via edge function
      const { data, error } = await supabase.functions.invoke('razorpay-order', {
        body: { action: 'create_order', amount },
      });

      if (error || !data?.order_id) {
        throw new Error(error?.message || 'Failed to create order');
      }

      // Load Razorpay script if not loaded
      if (!window.Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load Razorpay'));
          document.head.appendChild(script);
        });
      }

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: 'INR',
        name: 'Ad Atelier AI',
        description: 'Premium Access',
        order_id: data.order_id,
        handler: async (response: any) => {
          // Verify payment
          const { data: verifyData, error: verifyError } = await supabase.functions.invoke('razorpay-order', {
            body: {
              action: 'verify_payment',
              payment_id: response.razorpay_payment_id,
              order_id: response.razorpay_order_id,
              signature: response.razorpay_signature,
            },
          });

          if (verifyError || !verifyData?.verified) {
            toast({ title: 'Payment verification failed', description: 'Please contact support.', variant: 'destructive' });
            return;
          }

          setPaymentSuccess(true);
          setAccessCode(verifyData.access_code || '');
          toast({ title: '🎉 Payment Successful!', description: 'Thank you for your support.' });
        },
        prefill: { name: '', email: '', contact: '' },
        theme: { color: '#9b87f5' },
        modal: { ondismiss: () => setLoading(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response: any) => {
        toast({ title: 'Payment Failed', description: response.error?.description || 'Please try again.', variant: 'destructive' });
        setLoading(false);
      });
      rzp.open();
      setLoading(false);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Something went wrong', variant: 'destructive' });
      setLoading(false);
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 z-[1000] w-14 h-14 md:w-[60px] md:h-[60px] rounded-full bg-success text-success-foreground flex items-center justify-center shadow-lg border-0 outline-none cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open payment"
      >
        <CreditCard className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-[85px] right-5 z-[999] w-[400px] max-w-[90vw] glass-card rounded-xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-muted/50 px-4 py-3 flex items-center justify-between border-b border-border/50">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-primary" />
                Payment Gateway
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
                aria-label="Close payment popup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {paymentSuccess ? (
                <div className="text-center space-y-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.1 }}
                  >
                    <CheckCircle className="w-16 h-16 text-success mx-auto" />
                  </motion.div>
                  <h4 className="text-xl font-heading font-semibold text-foreground">Payment Successful!</h4>
                  <p className="text-sm text-muted-foreground">Thank you for your support.</p>
                  {accessCode && (
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">Your Access Code</p>
                      <p className="text-lg font-mono font-bold text-primary tracking-wider">{accessCode}</p>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <h4 className="text-xl font-heading font-semibold text-center text-foreground">
                    Premium Access
                  </h4>

                  <div className="bg-muted/30 rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-primary">₹{amount}</p>
                    <p className="text-xs text-muted-foreground mt-1">One-time payment</p>
                  </div>

                  <ul className="space-y-2 text-sm text-foreground">
                    {['Unlimited AI captions', 'All platforms supported', 'Priority generation', 'Premium templates'].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={handlePayment}
                    disabled={loading}
                    className="w-full bg-success hover:bg-success/90 text-success-foreground font-semibold py-5 text-base"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                      <CreditCard className="w-5 h-5 mr-2" />
                    )}
                    {loading ? 'Processing...' : `Pay ₹${amount} with Razorpay`}
                  </Button>

                  <p className="text-[11px] text-muted-foreground text-center flex items-center justify-center gap-1">
                    <Shield className="w-3 h-3" />
                    Secure payment powered by Razorpay
                  </p>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PaymentWidget;
