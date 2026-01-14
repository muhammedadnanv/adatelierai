import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import founderhuntLogo from '@/assets/founderhunt-logo.png';

const Footer = () => {
  return (
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
        
        {/* FounderHunt Branding */}
        <div className="border-t border-border/50 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* FounderHunt Attribution */}
            <a 
              href="https://founderhuntai.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
            >
              <img 
                src={founderhuntLogo} 
                alt="FounderHunt" 
                className="h-8 w-auto"
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                This MVP was developed by <span className="font-semibold text-foreground">FounderHunt</span> — Turning startup ideas into MVPs
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
