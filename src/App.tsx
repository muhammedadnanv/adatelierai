import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Security from "./pages/Security";
import NotFound from "./pages/NotFound";
import AdvertisementPopup from "./components/AdvertisementPopup";
import ErrorBoundary from "./components/ErrorBoundary";
import { useAdvertisementPopup } from "./hooks/useAdvertisementPopup";
import PageTransition from "./components/PageTransition";
import { PersonalizationProvider } from "./contexts/PersonalizationContext";
import VisitorInsightBadge from "./components/VisitorInsightBadge";
const queryClient = new QueryClient();

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

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Index /></PageTransition>} />
          <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
          <Route path="/privacy" element={<PageTransition><Privacy /></PageTransition>} />
          <Route path="/terms" element={<PageTransition><Terms /></PageTransition>} />
          <Route path="/security" element={<PageTransition><Security /></PageTransition>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </AnimatePresence>
      
      {/* Global Advertisement Popup */}
      <AdvertisementPopup
        isOpen={isAdVisible}
        onClose={dismissAdPopup}
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
