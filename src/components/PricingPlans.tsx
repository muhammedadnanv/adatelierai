import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Crown, Gem, Loader2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const RAZORPAY_KEY_ID = 'rzp_live_SZIYgnAQN4Bg5n';

interface Plan {
  id: string;
  name: string;
  price: number;
  description: string;
  icon: typeof Sparkles;
  badge?: string;
  features: string[];
  gradient: string;
  popular?: boolean;
}

const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 39,
    description: 'Perfect for getting started with AI captions',
    icon: Zap,
    features: [
      '50 AI captions per month',
      '3 social platforms',
      'Basic tone selection',
      'Standard generation speed',
      'Email support',
    ],
    gradient: 'from-blue-500 to-cyan-400',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 199,
    description: 'For serious creators who want more power',
    icon: Crown,
    badge: 'Most Popular',
    popular: true,
    features: [
      'Unlimited AI captions',
      'All social platforms',
      'All tones & styles',
      'Priority generation speed',
      'Caption history & analytics',
      'Bulk generation (up to 10)',
      'Priority email support',
    ],
    gradient: 'from-primary to-purple-500',
  },
  {
    id: 'ultra-rich',
    name: 'Ultra Rich',
    price: 1599,
    description: 'Enterprise-grade for agencies & power users',
    icon: Gem,
    badge: 'Best Value',
    features: [
      'Everything in Premium',
      'API access for integrations',
      'Custom brand voice training',
      'Team collaboration (5 seats)',
      'Dedicated account manager',
      'White-label export',
      'SLA guarantee (99.9%)',
      'Custom AI model fine-tuning',
    ],
    gradient: 'from-amber-500 to-orange-500',
  },
];

const PricingPlans = () => {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSubscribe = async (plan: Plan) => {
    setLoadingPlan(plan.id);
    try {
      const { data, error } = await supabase.functions.invoke('razorpay-order', {
        body: { action: 'create_order', amount: plan.price },
      });

      if (error || !data?.order_id) {
        throw new Error(error?.message || 'Failed to create order');
      }

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
        description: `${plan.name} Plan`,
        order_id: data.order_id,
        handler: async (response: any) => {
          const userEmail = prompt('Enter your email for the receipt (optional):') || '';
          const { data: verifyData, error: verifyError } = await supabase.functions.invoke('razorpay-order', {
            body: {
              action: 'verify_payment',
              payment_id: response.razorpay_payment_id,
              order_id: response.razorpay_order_id,
              signature: response.razorpay_signature,
              email: userEmail,
              name: plan.name,
              amount: plan.price,
            },
          });

          if (verifyError || !verifyData?.verified) {
            toast({ title: 'Payment verification failed', description: 'Please contact support.', variant: 'destructive' });
            return;
          }

          toast({
            title: '🎉 Welcome to ' + plan.name + '!',
            description: verifyData.access_code
              ? `Your access code: ${verifyData.access_code}`
              : 'Your subscription is now active.',
          });
        },
        prefill: { name: '', email: '', contact: '' },
        theme: { color: '#9b87f5' },
        modal: { ondismiss: () => setLoadingPlan(null) },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response: any) => {
        toast({ title: 'Payment Failed', description: response.error?.description || 'Please try again.', variant: 'destructive' });
        setLoadingPlan(null);
      });
      rzp.open();
      setLoadingPlan(null);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Something went wrong', variant: 'destructive' });
      setLoadingPlan(null);
    }
  };

  return (
    <section id="pricing" className="py-20 md:py-28 relative z-[2]">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <Badge className="bg-primary/10 text-primary border-primary/20 font-medium px-4 py-1.5">
            <Sparkles className="w-3.5 h-3.5 mr-2" />
            Pricing Plans
          </Badge>
          <h2 className="font-heading text-3xl lg:text-title">
            Choose Your <span className="text-gradient-brand">Perfect Plan</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Start free, upgrade when you're ready. All plans include a one-time payment with lifetime access.
          </p>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12, duration: 0.5 }}
              className={`relative flex flex-col ${plan.popular ? 'md:-mt-4 md:mb-[-16px]' : ''}`}
            >
              {/* Popular badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <Badge className={`bg-gradient-to-r ${plan.gradient} text-white border-0 px-4 py-1 text-xs font-bold shadow-lg`}>
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <div
                className={`glass-card flex flex-col flex-1 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-elegant hover:scale-[1.02] ${
                  plan.popular
                    ? 'border-primary/40 shadow-primary/20 shadow-xl ring-1 ring-primary/20'
                    : 'border-border/30'
                }`}
              >
                {/* Plan header */}
                <div className={`bg-gradient-to-br ${plan.gradient} p-6 text-center`}>
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <plan.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-white">{plan.name}</h3>
                  <p className="text-white/80 text-sm mt-1">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="p-6 text-center border-b border-border/20">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-2xl font-bold text-muted-foreground">₹</span>
                    <span className="text-5xl font-heading font-extrabold text-foreground">{plan.price}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">One-time payment</p>
                </div>

                {/* Features */}
                <div className="p-6 flex-1">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm">
                        <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.popular ? 'text-primary' : 'text-success'}`} />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="p-6 pt-0">
                  <Button
                    onClick={() => handleSubscribe(plan)}
                    disabled={loadingPlan === plan.id}
                    className={`w-full py-5 text-base font-semibold ${
                      plan.popular
                        ? 'bg-gradient-to-r from-primary to-purple-500 hover:opacity-90 text-white shadow-primary'
                        : 'bg-foreground/10 hover:bg-foreground/20 text-foreground'
                    }`}
                  >
                    {loadingPlan === plan.id ? (
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : null}
                    {loadingPlan === plan.id ? 'Processing...' : `Get ${plan.name} — ₹${plan.price}`}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;
