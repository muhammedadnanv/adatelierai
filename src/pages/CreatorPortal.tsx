import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Sparkles, 
  Instagram, 
  CheckCircle2, 
  Star, 
  Users, 
  TrendingUp, 
  Gift,
  Shield,
  Zap,
  Crown,
  ArrowLeft,
  ExternalLink,
  Copy,
  BadgeCheck
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';
import ThemeToggle from '@/components/ThemeToggle';
import SEOHead from '@/components/SEOHead';

const benefits = [
  {
    icon: Gift,
    title: 'Exclusive Rewards',
    description: 'Earn rewards for every creator you bring to the platform through your content.',
    highlight: 'Up to ₹500 per referral',
  },
  {
    icon: BadgeCheck,
    title: 'Verified Creator Badge',
    description: 'Get a verified badge displayed on your profile after approval.',
    highlight: 'Stand out from the crowd',
  },
  {
    icon: Zap,
    title: 'Priority Support',
    description: 'Get faster responses and dedicated support from our team.',
    highlight: '24-hour response time',
  },
  {
    icon: Crown,
    title: 'Early Access',
    description: 'Be the first to try new features before they launch publicly.',
    highlight: 'Exclusive beta access',
  },
];

const requirements = [
  'Minimum 1,000 Instagram followers',
  'Active posting (at least 3 posts/week)',
  'Content aligned with our brand values',
  'Share at least 2 pieces of content featuring Ad Atelier AI per month',
];

const contentIdeas = [
  {
    type: 'Reels',
    description: 'Create engaging reels showing how you use Ad Atelier AI to generate captions',
    example: 'Before/after caption transformation videos',
  },
  {
    type: 'Stories',
    description: 'Share quick tips and behind-the-scenes of your content creation',
    example: 'Swipe-up to our platform with your referral link',
  },
  {
    type: 'Posts',
    description: 'Feature our platform in your carousel posts about content creation tools',
    example: 'Top 5 AI tools for creators (featuring Ad Atelier AI)',
  },
];

const CreatorPortal = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    instagram: '',
    followers: '',
    why: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const referralLink = 'https://adatelierai.lovable.app/?ref=creator';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('send-email', {
        body: {
          to: formData.email,
          subject: `Creator Application — @${formData.instagram}`,
          name: formData.name,
          inquiryType: 'partnership',
          message: `Creator Application\n\nInstagram: @${formData.instagram}\nFollowers: ${formData.followers}\n\nWhy they want to join:\n${formData.why}`,
        },
      });

      if (error) throw error;

      toast({
        title: '🎉 Application Submitted!',
        description: 'We\'ll review your application and get back to you within 48 hours.',
      });

      setFormData({ name: '', email: '', instagram: '', followers: '', why: '' });
    } catch {
      toast({
        title: 'Submission failed',
        description: 'Please try again later or email us directly.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: 'Link Copied!',
      description: 'Your referral link has been copied to clipboard.',
    });
  };

  return (
    <div className="min-h-screen bg-background relative">
      <SEOHead
        title="Creator Portal — Become a Verified Ad Atelier AI Creator"
        description="Join our Instagram creator program. Promote Ad Atelier AI, earn rewards, and get a verified creator badge."
        canonical="https://adatelierai.lovable.app/creators"
      />
      {/* Global ambient glass overlay */}
      <div className="fixed inset-0 pointer-events-none z-[1]">
        <div className="absolute top-1/4 right-1/4 w-[450px] h-[450px] bg-primary/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/3 left-1/3 w-[350px] h-[350px] bg-accent/5 rounded-full blur-[100px]"></div>
      </div>
      {/* Header */}
      <header className="border-b border-border/30 glass-overlay sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center shadow-primary">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-lg md:text-xl font-heading font-bold text-gradient-brand">
                Creator Portal
              </h1>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <Badge className="bg-accent/10 text-accent border-accent/20 font-medium px-4 py-1.5">
              <Instagram className="w-3.5 h-3.5 mr-2" />
              Instagram Creator Program
            </Badge>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold">
              Become a <span className="text-gradient-brand">Verified Creator</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Join our exclusive creator program. Promote Ad Atelier AI on Instagram 
              and earn rewards while helping fellow creators discover the power of AI.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button 
                size="lg" 
                className="bg-gradient-hero hover:opacity-90 shadow-primary font-semibold"
                onClick={() => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Apply Now
                <Crown className="w-5 h-5 ml-2" />
              </Button>
              <a 
                href="https://instagram.com/ad.atelier.eo" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg">
                  <Instagram className="w-5 h-5 mr-2" />
                  Follow @ad.atelier.eo
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl lg:text-4xl font-bold mb-4">
              Creator <span className="text-gradient-brand">Benefits</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join hundreds of creators already earning with Ad Atelier AI
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full glass-card hover:shadow-elegant hover:border-primary/20 hover:scale-[1.03] transition-all duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-hero rounded-xl flex items-center justify-center mb-4 shadow-primary">
                      <benefit.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg font-heading">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <CardDescription className="text-sm">
                      {benefit.description}
                    </CardDescription>
                    <Badge variant="secondary" className="bg-success/10 text-success border-0">
                      {benefit.highlight}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-20 glass-section relative z-[2]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl lg:text-4xl font-bold mb-4">
              How It <span className="text-gradient-brand">Works</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '01', title: 'Apply', description: 'Fill out the application form below with your Instagram details' },
              { step: '02', title: 'Get Verified', description: 'Our team reviews your application within 48 hours' },
              { step: '03', title: 'Start Earning', description: 'Create content, share your link, and earn rewards' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="text-center"
              >
                <div className="relative inline-block mb-4">
                  <div className="w-16 h-16 bg-gradient-hero rounded-2xl flex items-center justify-center shadow-primary">
                    <span className="text-2xl font-bold text-white">{item.step}</span>
                  </div>
                </div>
                <h3 className="text-xl font-heading font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Ideas */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl lg:text-4xl font-bold mb-4">
              Content <span className="text-gradient-brand">Ideas</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Here's how you can promote Ad Atelier AI on Instagram
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {contentIdeas.map((idea, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full glass-card">
                  <CardHeader>
                    <Badge className="w-fit bg-primary/10 text-primary border-0 mb-2">
                      {idea.type}
                    </Badge>
                    <CardDescription>{idea.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">Example:</p>
                      <p className="text-sm font-medium">{idea.example}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Referral Link Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 max-w-2xl mx-auto"
          >
            <Card className="shadow-card border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardHeader className="text-center">
                <CardTitle className="font-heading">Your Referral Link</CardTitle>
                <CardDescription>
                  Share this link in your bio and content to track your referrals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input 
                    value={referralLink} 
                    readOnly 
                    className="bg-background/50 font-mono text-sm"
                  />
                  <Button onClick={copyReferralLink} variant="outline">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="py-16 md:py-20 glass-section relative z-[2]">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="font-heading text-3xl lg:text-4xl font-bold mb-4">
                Apply to Become a <span className="text-gradient-brand">Creator</span>
              </h2>
              <p className="text-muted-foreground">
                Fill out the form below and we'll get back to you within 48 hours
              </p>
            </div>

            {/* Requirements */}
            <Card className="mb-8 shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="text-lg font-heading flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Form */}
            <Card className="shadow-card border-border/50">
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="instagram">Instagram Handle *</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                        <Input
                          id="instagram"
                          name="instagram"
                          value={formData.instagram}
                          onChange={handleInputChange}
                          placeholder="your.handle"
                          className="pl-8"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="followers">Follower Count *</Label>
                      <Input
                        id="followers"
                        name="followers"
                        value={formData.followers}
                        onChange={handleInputChange}
                        placeholder="e.g., 5000"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="why">Why do you want to join? *</Label>
                    <Textarea
                      id="why"
                      name="why"
                      value={formData.why}
                      onChange={handleInputChange}
                      placeholder="Tell us why you'd be a great fit for our creator program..."
                      rows={4}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-hero hover:opacity-90 shadow-primary py-6 text-lg font-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Application
                        <Sparkles className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CreatorPortal;
