import { X, MessageCircle } from 'lucide-react';

interface AdvertisementPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdvertisementPopup = ({ isOpen, onClose }: AdvertisementPopupProps) => {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/919656778508', '_blank', 'noopener,noreferrer');
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative bg-white rounded-lg p-5 w-[90%] max-w-[400px] shadow-elegant animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-foreground hover:text-destructive transition-colors text-2xl leading-none bg-transparent border-0 cursor-pointer p-1"
          aria-label="Close popup"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            🚀 Ready to Launch Your Digital Presence?
          </h2>
          
          <p className="text-base text-muted-foreground mb-3">
            Transform ideas into reality with cutting-edge web solutions.
          </p>
          
          <p className="text-sm text-muted-foreground mb-5">
            As a solo-run agency, I personally handle every project—no middle-men, no recurring fees—just one transparent investment for a professional website that you own for life.
          </p>

          <button
            onClick={handleWhatsAppClick}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25d366] hover:bg-[#128c7e] text-white rounded-md font-bold transition-colors duration-300 cursor-pointer"
          >
            <MessageCircle className="w-5 h-5" />
            Chat on WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvertisementPopup;
