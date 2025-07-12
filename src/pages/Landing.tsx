import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Upload, 
  Wand2, 
  Share2, 
  Shield, 
  Zap, 
  Users, 
  Star,
  ArrowRight,
  CheckCircle,
  Camera,
  MessageSquare,
  TrendingUp,
  Lock
} from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';

const features = [
  {
    icon: Upload,
    title: "Easy Upload",
    description: "Drag & drop your images or browse from your device. Supports all popular formats."
  },
  {
    icon: Wand2,
    title: "AI-Powered Generation",
    description: "Generate 3-5 unique captions using Google Gemini AI with different tones and styles."
  },
  {
    icon: MessageSquare,
    title: "Multiple Tones",
    description: "Professional, witty, bold, casual, or inspiring - choose the perfect tone for your audience."
  },
  {
    icon: Share2,
    title: "Native Sharing",
    description: "Share directly to X (Twitter) and LinkedIn with optimized formatting."
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your API keys are encrypted and your images are processed securely."
  },
  {
    icon: TrendingUp,
    title: "Caption History",
    description: "View, edit, and save your favorite captions for future reference."
  }
];

const stats = [
  { number: "10k+", label: "Creators" },
  { number: "50k+", label: "Captions Generated" },
  { number: "95%", label: "Satisfaction Rate" },
  { number: "24/7", label: "AI Availability" }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Content Creator",
    content: "Socialify transformed my content game! The AI captions are spot-on and save me hours every week.",
    rating: 5
  },
  {
    name: "Mike Chen",
    role: "Social Media Manager",
    content: "The variety of tones and quick sharing features make this a must-have tool for any marketer.",
    rating: 5
  },
  {
    name: "Emma Davis",
    role: "Small Business Owner",
    content: "Finally, professional-quality captions without the professional price tag. Love the simplicity!",
    rating: 5
  }
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Socialify
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/auth">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/auth">
              <Button variant="hero">
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI-Powered Content Creation
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Transform Your Images Into 
                  <span className="bg-gradient-hero bg-clip-text text-transparent"> Viral Content</span>
                </h1>
                <p className="text-xl text-muted-foreground">
                  Upload any image and get 3-5 engaging social media captions instantly. 
                  Powered by Google Gemini AI with professional tone options.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth">
                  <Button size="xl" variant="hero" className="w-full sm:w-auto">
                    <Camera className="w-5 h-5 mr-2" />
                    Start Creating Now
                  </Button>
                </Link>
                <Button size="xl" variant="outline" className="w-full sm:w-auto">
                  <Users className="w-5 h-5 mr-2" />
                  Join 10k+ Creators
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-primary">{stat.number}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-hero rounded-3xl blur-3xl opacity-20"></div>
              <img
                src={heroImage}
                alt="Socialify Hero"
                className="relative rounded-3xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-accent/10 text-accent border-accent/20">
              <Zap className="w-3 h-3 mr-1" />
              Powerful Features
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold">
              Everything You Need for 
              <span className="text-primary"> Social Success</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From upload to viral content in seconds. Our AI understands context, 
              tone, and engagement patterns.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-elegant border-0 hover:shadow-glow transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Three Simple Steps to <span className="text-accent">Viral Content</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Get started in minutes, not hours
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Upload Your Image",
                description: "Drag and drop any image or browse from your device. We support all popular formats.",
                icon: Upload
              },
              {
                step: "02", 
                title: "Choose Your Tone",
                description: "Select from professional, witty, bold, casual, or inspiring tones to match your brand.",
                icon: Wand2
              },
              {
                step: "03",
                title: "Generate & Share",
                description: "Get 3-5 unique captions instantly and share directly to your social platforms.",
                icon: Share2
              }
            ].map((item, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto shadow-primary">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Loved by <span className="text-primary">10,000+ Creators</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              See what our community has to say
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="shadow-elegant border-0">
                <CardHeader>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="text-base italic">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-hero text-white border-0 shadow-glow">
            <CardContent className="p-12 text-center space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold">
                Ready to Create Viral Content?
              </h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                Join thousands of creators who are already using AI to boost their social media presence.
                Get started for free today!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/auth">
                  <Button size="xl" variant="secondary" className="w-full sm:w-auto">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Start Free Today
                  </Button>
                </Link>
                <div className="flex items-center gap-2 text-sm opacity-90">
                  <CheckCircle className="w-4 h-4" />
                  <span>No credit card required</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-white/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                  Socialify
                </h3>
              </div>
              <p className="text-muted-foreground">
                Transform your images into viral social media content with AI-powered captions.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Features</a></li>
                <li><a href="#" className="hover:text-primary">Pricing</a></li>
                <li><a href="#" className="hover:text-primary">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Help Center</a></li>
                <li><a href="#" className="hover:text-primary">Contact</a></li>
                <li><a href="#" className="hover:text-primary">Status</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Privacy</a></li>
                <li><a href="#" className="hover:text-primary">Terms</a></li>
                <li><a href="#" className="hover:text-primary">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Socialify. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;