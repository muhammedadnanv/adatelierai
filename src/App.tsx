import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Security from "./pages/Security";
import CreatorPortal from "./pages/CreatorPortal";
import NotFound from "./pages/NotFound";
import AdvertisementPopup from "./components/AdvertisementPopup";
import ExitIntentPopup from "./components/ExitIntentPopup";
import WelcomeBackModal, { useWelcomeBack } from "./components/WelcomeBackModal";
import DonationPopup, { useDonationPopup } from "./components/DonationPopup";
import PaymentWidget from "./components/PaymentWidget";
import ErrorBoundary from "./components/ErrorBoundary";
import { useAdvertisementPopup } from "./hooks/useAdvertisementPopup";
import { useExitIntent } from "./hooks/useExitIntent";
import PageTransition from "./components/PageTransition";
import { PersonalizationProvider, usePersonalization } from "./contexts/PersonalizationContext";
import VisitorInsightBadge from "./components/VisitorInsightBadge";

const queryClient = new QueryClient();

// Component to track route changes
const RouteTracker = () => {
  const location = useLocation();
  const { trackPageVisit } = usePersonalization();

  useEffect(() => {
    trackPageVisit(location.pathname);
  }, [location.pathname, trackPageVisit]);

  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const { 
    isVisible: isAdVisible, 
    dismissPopup: dismissAdPopup 
  } = useAdvertisementPopup({
    initialDelay: 10000, // 10 seconds
    repeatInterval: 900000, // 15 minutes
    maxDismissals: 3,
    sessionTimeout: 3600000, // 1 hour
  });

  const {
    showExitIntent,
    dismissExitIntent,
  } = useExitIntent({
    threshold: 50,
    delayBeforeShow: 5000, // 5 seconds on page before triggering
    cooldownPeriod: 86400000, // 24 hours
  });

  const { showWelcomeBack, dismissWelcomeBack } = useWelcomeBack();
  const { isVisible: isDonationVisible, dismissPopup: dismissDonation } = useDonationPopup();

  return (
    <>
      {/* Track route changes for personalization */}
      <RouteTracker />
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Index /></PageTransition>} />
          <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
          <Route path="/privacy" element={<PageTransition><Privacy /></PageTransition>} />
          <Route path="/terms" element={<PageTransition><Terms /></PageTransition>} />
          <Route path="/security" element={<PageTransition><Security /></PageTransition>} />
          <Route path="/creators" element={<PageTransition><CreatorPortal /></PageTransition>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </AnimatePresence>
      
      {/* Global Advertisement Popup */}
      <AdvertisementPopup
        isOpen={isAdVisible}
        onClose={dismissAdPopup}
      />

      {/* Exit Intent Popup */}
      <ExitIntentPopup
        isOpen={showExitIntent && !isAdVisible}
        onClose={dismissExitIntent}
      />

      {/* Welcome Back Modal for Returning Visitors */}
      <WelcomeBackModal
        isOpen={showWelcomeBack && !isAdVisible && !showExitIntent}
        onClose={dismissWelcomeBack}
      />

      {/* Donation Popup */}
      <DonationPopup
        isOpen={isDonationVisible && !isAdVisible && !showExitIntent && !showWelcomeBack}
        onClose={dismissDonation}
      />
      
      {/* Visitor Insight Badge (dev mode only) */}
      <VisitorInsightBadge />
    </>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <PersonalizationProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AnimatedRoutes />
            </BrowserRouter>
          </PersonalizationProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
