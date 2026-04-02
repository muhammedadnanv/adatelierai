import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, QrCode, IndianRupee, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PaymentWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const upiId = 'muhammed.39@superyes';
  const payeeName = 'Muhammed Adnan';
  const amount = 39;
  const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 z-[1000] w-14 h-14 md:w-[60px] md:h-[60px] rounded-full bg-success text-success-foreground flex items-center justify-center shadow-lg border-0 outline-none cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open payment"
      >
        <CreditCard className="w-6 h-6" />
      </motion.button>

      {/* Payment Popup */}
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

            {/* Content */}
            <div className="p-5 space-y-4">
              <h4 className="text-xl font-heading font-semibold text-center text-foreground flex items-center justify-center gap-2">
                <QrCode className="w-5 h-5 text-primary" />
                Pay with UPI
              </h4>

              {/* QR Code */}
              <div className="flex justify-center">
                <img
                  src={qrUrl}
                  alt="UPI QR Code"
                  className="w-[200px] h-[200px] rounded-lg border-2 border-border/50"
                  loading="lazy"
                />
              </div>

              <p className="text-xs text-muted-foreground text-center">Scan with any UPI app</p>

              {/* Payment Details */}
              <div className="space-y-1.5 text-sm text-foreground">
                <p><span className="text-muted-foreground">UPI ID:</span> {upiId}</p>
                <p><span className="text-muted-foreground">Payee:</span> {payeeName}</p>
                <p><span className="text-muted-foreground">Amount:</span> ₹{amount}</p>
              </div>

              {/* Pay Button */}
              <a
                href={upiLink}
                className="block w-full"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="w-full bg-success hover:bg-success/90 text-success-foreground font-semibold py-5 text-base">
                  💳 Pay ₹{amount} via UPI
                </Button>
              </a>

              <p className="text-[11px] text-muted-foreground text-center flex items-center justify-center gap-1">
                <Shield className="w-3 h-3" />
                Secure UPI payment · Powered by Widgetify
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PaymentWidget;
