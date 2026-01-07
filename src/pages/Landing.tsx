import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Upload, Wand2, Share2, Shield, Zap, Users, Star, ArrowRight, CheckCircle, Camera, MessageSquare, TrendingUp, Lock } from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';
import { useState, useEffect } from 'react';
const features = [{
  icon: Upload,
  title: "Easy Upload",
  description: "Drag & drop your images or browse from your device. Supports all popular formats."
}, {
  icon: Wand2,
  title: "AI-Powered Generation",
  description: "Generate 3-5 unique captions using Google Gemini AI with different tones and styles."
}, {
  icon: MessageSquare,
  title: "Multiple Tones",
  description: "Professional, witty, bold, casual, or inspiring - choose the perfect tone for your audience."
}, {
  icon: Share2,
  title: "Native Sharing",
  description: "Share directly to X (Twitter) and LinkedIn with optimized formatting."
}, {
  icon: Shield,
  title: "Secure & Private",
  description: "Your API keys are encrypted and your images are processed securely."
}, {
  icon: TrendingUp,
  title: "Caption History",
  description: "View, edit, and save your favorite captions for future reference."
}];
const stats = [{
  number: "10k+",
  label: "Creators"
}, {
  number: "50k+",
  label: "Captions Generated"
}, {
  number: "95%",
  label: "Satisfaction Rate"
}, {
  number: "24/7",
  label: "AI Availability"
}];
const testimonials = [{
  name: "Sarah Johnson",
  role: "Content Creator",
  content: "Ad Atelier AI transformed my content game! The AI captions are spot-on and save me hours every week.",
  rating: 5
}, {
  name: "Mike Chen",
  role: "Social Media Manager",
  content: "The variety of tones and quick sharing features make this a must-have tool for any marketer.",
  rating: 5
}, {
  name: "Emma Davis",
  role: "Small Business Owner",
  content: "Finally, professional-quality captions without the professional price tag. Love the simplicity!",
  rating: 5
}];
const Landing = () => {
  const navigate = useNavigate();
  const [activeUsers, setActiveUsers] = useState(127);
  const [recentGenerations, setRecentGenerations] = useState(8);

  useEffect(() => {
    // Simulate live user activity
    const interval = setInterval(() => {
      setActiveUsers(prev => prev + (Math.random() > 0.5 ? 1 : -1));
      setRecentGenerations(prev => Math.max(1, prev + (Math.random() > 0.7 ? 1 : 0)));
    }, 3000);

    return () => clearInterval(interval);
  }, []);
  return <div className="min-h-screen bg-background">
      {/* Header - Premium glassmorphism */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-hero rounded-xl flex items-center justify-center shadow-primary">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl md:text-2xl font-heading font-extrabold text-gradient-brand">
              Ad Atelier AI
            </h1>
          </div>
          
          <div className="flex items-center space-x-3 md:space-x-4">
            {/* Product Hunt Badge */}
            <a href="https://www.producthunt.com/products/ad-atelier-ai?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-ad%E2%80%A3atelier%E2%80%A3ai" target="_blank" rel="noopener noreferrer" className="hidden lg:block hover:opacity-90 transition-opacity">
              <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1005540&theme=light&t=1755261791027" alt="Ad Atelier AI - Transform Your Images Into Viral Content | Product Hunt" style={{
              width: '250px',
              height: '54px'
            }} width="250" height="54" />
            </a>
            <Button 
              variant="default" 
              onClick={() => navigate('/dashboard')} 
              className="bg-gradient-hero hover:opacity-90 shadow-primary font-semibold"
            >
              <span className="hidden sm:inline">Get Started</span>
              <span className="sm:hidden">Start</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section - Bold & Impactful */}
      <section className="py-16 md:py-24 lg:py-32 relative overflow-hidden">
        {/* Ambient glow effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl -z-10"></div>
        
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge className="bg-primary/10 text-primary border-primary/20 font-medium px-4 py-1.5">
                  <Sparkles className="w-3.5 h-3.5 mr-2" />
                  AI-Powered Content Creation
                </Badge>
                <h1 className="font-heading text-4xl sm:text-5xl lg:text-hero leading-tight">
                  Transform Your Images Into 
                  <span className="text-gradient-brand block mt-2">Viral Content</span>
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl">
                  Upload any image and get 3-5 engaging social media captions instantly. 
                  Powered by Google Gemini AI with professional tone options.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-hero hover:opacity-90 text-white shadow-primary hover:shadow-glow transition-all duration-300 font-semibold text-base px-8 py-6" 
                  onClick={() => navigate('/dashboard')}
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Start Creating Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>

              {/* Social Proof - Live Activity */}
              <div className="flex flex-wrap items-center gap-6 text-sm pt-4">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-9 h-9 rounded-full bg-gradient-hero flex items-center justify-center text-white text-xs font-bold border-2 border-background shadow-sm">
                      {activeUsers.toString().slice(-2)}
                    </div>
                    <div className="w-9 h-9 rounded-full bg-success flex items-center justify-center text-white text-xs font-bold border-2 border-background shadow-sm">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-muted-foreground">
                    <span className="font-semibold text-foreground">{activeUsers}</span> creators online
                  </div>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                  <span><span className="font-semibold text-foreground">{recentGenerations}</span> captions generated</span>
                </div>
              </div>

              {/* Stats - Premium layout */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-border/50">
                {stats.map((stat, index) => <div key={index} className="text-center lg:text-left">
                    <div className="text-2xl lg:text-3xl font-heading font-bold text-gradient-brand">{stat.number}</div>
                    <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                  </div>)}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-hero rounded-3xl blur-3xl opacity-15 scale-105"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border/20">
                <img src={heroImage} alt="Ad Atelier AI Hero" className="w-full h-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Clean & Elevated */}
      <section className="py-20 md:py-28 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-accent/10 text-accent border-accent/20 font-medium px-4 py-1.5">
              <Zap className="w-3.5 h-3.5 mr-2" />
              Powerful Features
            </Badge>
            <h2 className="font-heading text-3xl lg:text-title">
              Everything You Need for 
              <span className="text-gradient-brand"> Social Success</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              From upload to viral content in seconds. Our AI understands context, 
              tone, and engagement patterns.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => <Card key={index} className="shadow-card border-border/50 hover:shadow-elegant hover:border-primary/20 transition-all duration-300 bg-card">
                <CardHeader>
                  <div className="w-14 h-14 bg-gradient-hero rounded-2xl flex items-center justify-center mb-4 shadow-primary">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl font-heading">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* How It Works - Bold steps */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="font-heading text-3xl lg:text-title">
              Three Simple Steps to <span className="text-gradient-brand">Viral Content</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Get started in minutes, not hours
            </p>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[{
            step: "01",
            title: "Upload Your Image",
            description: "Drag and drop any image or browse from your device. We support all popular formats.",
            icon: Upload
          }, {
            step: "02",
            title: "Choose Your Tone",
            description: "Select from professional, witty, bold, casual, or inspiring tones to match your brand.",
            icon: Wand2
          }, {
            step: "03",
            title: "Generate & Share",
            description: "Get 3-5 unique captions instantly and share directly to your social platforms.",
            icon: Share2
          }].map((item, index) => <div key={index} className="text-center space-y-5">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-gradient-hero rounded-3xl flex items-center justify-center mx-auto shadow-primary">
                    <item.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-secondary text-white rounded-xl flex items-center justify-center text-sm font-heading font-bold shadow-lg">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-heading font-semibold">{item.title}</h3>
                <p className="text-muted-foreground max-w-xs mx-auto">{item.description}</p>
              </div>)}
          </div>
        </div>
      </section>

      {/* Testimonials - Premium cards */}
      <section className="py-20 md:py-28 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="font-heading text-3xl lg:text-title">
              Loved by <span className="text-gradient-brand">10,000+ Creators</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              See what our community has to say
            </p>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => <Card key={index} className="shadow-card border-border/50 bg-card">
                <CardHeader>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-5 h-5 fill-warning text-warning" />)}
                  </div>
                  <CardDescription className="text-base leading-relaxed italic">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <div className="font-heading font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* CTA Section - Bold impact */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-hero text-white border-0 shadow-glow overflow-hidden relative">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            
            <CardContent className="p-8 md:p-16 text-center space-y-6 relative z-10">
              <h2 className="font-heading text-3xl lg:text-title">
                Ready to Create Viral Content?
              </h2>
              <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
                Join thousands of creators who are already using AI to boost their social media presence.
                Get started for free today!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 font-semibold text-base px-8 py-6 shadow-lg" onClick={() => navigate('/dashboard')}>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Free Today
                </Button>
                <div className="flex items-center gap-2 text-sm opacity-90">
                  <CheckCircle className="w-4 h-4" />
                  <span>No setup required</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer - Clean & Professional */}
      <footer className="py-12 md:py-16 border-t border-border/50 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-hero rounded-xl flex items-center justify-center shadow-primary">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-heading font-bold text-gradient-brand">
                  Ad Atelier AI
                </h3>
              </div>
              <p className="text-muted-foreground max-w-sm leading-relaxed">
                Transform your images into viral social media content with AI-powered captions.
              </p>
            </div>
            
            <div>
              <h4 className="font-heading font-semibold mb-4">Legal</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link></li>
                <li><Link to="/terms" className="hover:text-primary transition-colors">Terms</Link></li>
                <li><Link to="/security" className="hover:text-primary transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border/50 mt-12 pt-8 text-center text-muted-foreground text-sm">
            <p>&copy; {new Date().getFullYear()} Ad Atelier AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>;
};
export default Landing;