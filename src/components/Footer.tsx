import { Link } from 'react-router-dom';
import { Sparkles, Instagram, Heart, Crown, IndianRupee, KeyRound } from 'lucide-react';
import founderhuntLogo from '@/assets/founderhunt-logo.png';

const Footer = () => {
  return (
    <footer className="py-12 md:py-16 border-t border-border/30 glass-section relative z-[2]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <div className="space-y-4 col-span-2 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-hero rounded-xl flex items-center justify-center shadow-primary">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-heading font-bold text-gradient-brand">
                Ad Atelier AI
              </h3>
            </div>
            <p className="text-muted-foreground max-w-sm leading-relaxed text-sm">
              Transform your images into viral social media content with AI-powered captions.
            </p>
          </div>
          
          <div>
            <h4 className="font-heading font-semibold mb-4">Product</h4>
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li><Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
              <li>
                <Link to="/creators" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5 text-warning" />
                  Creator Portal
                </Link>
              </li>
              <li>
                <a 
                  href="https://razorpay.me/@adnan4402" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <Heart className="w-3.5 h-3.5 text-destructive" />
                  Support Us
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading font-semibold mb-4">Legal</h4>
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms</Link></li>
              <li><Link to="/security" className="hover:text-primary transition-colors">Security</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">Connect</h4>
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li>
                <a 
                  href="https://instagram.com/ad.atelier.eo" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  @ad.atelier.eo
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* FounderHunt Branding */}
        <div className="border-t border-border/50 mt-8 md:mt-12 pt-6 md:pt-8">
          <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between md:gap-6">
            {/* FounderHunt Attribution */}
            <a 
              href="https://founderhuntai.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity group text-center sm:text-left"
            >
              <img 
                src={founderhuntLogo} 
                alt="FounderHunt" 
                className="h-7 sm:h-8 w-auto"
              />
              <span className="text-xs sm:text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                Developed by <span className="font-semibold text-foreground">FounderHunt</span> — Turning ideas into MVPs
              </span>
            </a>
            
            {/* Copyright */}
            <p className="text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} Ad Atelier AI. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
