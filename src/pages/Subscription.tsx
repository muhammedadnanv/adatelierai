import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, Search, CheckCircle, XCircle, Loader2, Sparkles, ArrowLeft, Crown, Gem, Zap, Copy, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import ThemeToggle from '@/components/ThemeToggle';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';

interface PaymentRecord {
  id: string;
  amount: number;
  access_code: string;
  status: string;
  created_at: string;
  verified_at: string | null;
  razorpay_payment_id: string;
  razorpay_order_id: string;
  currency: string;
}

const getPlanFromAmount = (amount: number) => {
  if (amount >= 1599) return { name: 'Ultra Rich', icon: Gem, gradient: 'from-amber-500 to-orange-500', color: 'text-amber-500' };
  if (amount >= 199) return { name: 'Premium', icon: Crown, gradient: 'from-primary to-purple-500', color: 'text-primary' };
  return { name: 'Basic', icon: Zap, gradient: 'from-blue-500 to-cyan-400', color: 'text-blue-500' };
};

const Subscription = () => {
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [payment, setPayment] = useState<PaymentRecord | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleLookup = async () => {
    if (!accessCode.trim()) {
      toast({ title: 'Please enter an access code', variant: 'destructive' });
      return;
    }

    setLoading(true);
    setNotFound(false);
    setPayment(null);

    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('access_code', accessCode.trim().toUpperCase())
        .eq('status', 'verified')
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setPayment(data as PaymentRecord);
      } else {
        setNotFound(true);
      }
    } catch {
      toast({ title: 'Error looking up subscription', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard!' });
  };

  const plan = payment ? getPlanFromAmount(payment.amount) : null;

  return (
    <div className="min-h-screen bg-background relative">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-[1]">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="border-b border-border/30 glass-overlay sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-hero rounded-xl flex items-center justify-center shadow-primary">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl md:text-2xl font-heading font-extrabold text-gradient-brand">
                Ad Atelier AI
              </h1>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle variant="dropdown" />
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 md:py-20 relative z-[2]">
        <div className="max-w-2xl mx-auto">
          {/* Page Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4 mb-12"
          >
            <div className="w-16 h-16 bg-gradient-hero rounded-2xl flex items-center justify-center mx-auto shadow-primary">
              <KeyRound className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-heading font-extrabold">
              My <span className="text-gradient-brand">Subscription</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Enter your access code to view your plan details
            </p>
          </motion.div>

          {/* Lookup Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex gap-3">
                  <Input
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                    placeholder="XXXX-XXXX-XXXX-XXXX"
                    className="font-mono text-center tracking-widest text-lg bg-muted/30 border-border/50"
                    onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
                  />
                  <Button
                    onClick={handleLookup}
                    disabled={loading}
                    className="bg-gradient-hero hover:opacity-90 shadow-primary px-6"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results */}
          <AnimatePresence mode="wait">
            {payment && plan && (
              <motion.div
                key="found"
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="mt-8"
              >
                <Card className="glass-card overflow-hidden">
                  {/* Plan header */}
                  <div className={`bg-gradient-to-br ${plan.gradient} p-8 text-center`}>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.15 }}
                      className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-4"
                    >
                      <plan.icon className="w-10 h-10 text-white" />
                    </motion.div>
                    <h2 className="text-2xl font-heading font-bold text-white">{plan.name} Plan</h2>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <Badge className="bg-white/20 text-white border-0">
                        <CheckCircle className="w-3.5 h-3.5 mr-1" />
                        Active
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6 space-y-5">
                    {/* Access Code */}
                    <div className="bg-muted/30 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Access Code</p>
                        <p className="font-mono font-bold text-lg tracking-widest text-primary">{payment.access_code}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => copyToClipboard(payment.access_code)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted/20 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground">Amount Paid</p>
                        <p className="text-xl font-bold text-foreground">₹{payment.amount}</p>
                      </div>
                      <div className="bg-muted/20 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground">Currency</p>
                        <p className="text-xl font-bold text-foreground">{payment.currency}</p>
                      </div>
                      <div className="bg-muted/20 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground">Payment Date</p>
                        <p className="text-sm font-semibold text-foreground">
                          {new Date(payment.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="bg-muted/20 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground">Status</p>
                        <Badge variant="outline" className="mt-1 border-success/30 text-success">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      </div>
                    </div>

                    {/* Payment IDs */}
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between bg-muted/10 rounded-lg px-3 py-2">
                        <span className="text-muted-foreground">Payment ID</span>
                        <button onClick={() => copyToClipboard(payment.razorpay_payment_id)} className="font-mono text-foreground hover:text-primary transition-colors">
                          {payment.razorpay_payment_id}
                        </button>
                      </div>
                      <div className="flex items-center justify-between bg-muted/10 rounded-lg px-3 py-2">
                        <span className="text-muted-foreground">Order ID</span>
                        <button onClick={() => copyToClipboard(payment.razorpay_order_id)} className="font-mono text-foreground hover:text-primary transition-colors">
                          {payment.razorpay_order_id}
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-muted-foreground text-center flex items-center justify-center gap-1 pt-2">
                      <Shield className="w-3 h-3" />
                      Verified payment powered by Razorpay
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {notFound && (
              <motion.div
                key="not-found"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-8"
              >
                <Card className="glass-card">
                  <CardContent className="p-8 text-center space-y-4">
                    <XCircle className="w-16 h-16 text-destructive/60 mx-auto" />
                    <h3 className="text-xl font-heading font-semibold">No Subscription Found</h3>
                    <p className="text-muted-foreground">
                      We couldn't find a verified payment with that access code. Please double-check and try again.
                    </p>
                    <Link to="/#pricing">
                      <Button className="bg-gradient-hero hover:opacity-90 shadow-primary mt-2">
                        View Plans
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Subscription;
