import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Security from "./pages/Security";
import NotFound from "./pages/NotFound";
import DonationPopup from "./components/DonationPopup";
import AdvertisementPopup from "./components/AdvertisementPopup";
import ErrorBoundary from "./components/ErrorBoundary";
import { useDonationPopup } from "./hooks/useDonationPopup";
import { useAdvertisementPopup } from "./hooks/useAdvertisementPopup";

const queryClient = new QueryClient();

const App = () => {
  const { isVisible, dismissPopup } = useDonationPopup({
    initialDelay: 45000, // 45 seconds
    repeatInterval: 600000, // 10 minutes
    maxDismissals: 2,
    sessionTimeout: 1800000, // 30 minutes
  });

  const { 
    isVisible: isAdVisible, 
    dismissPopup: dismissAdPopup 
  } = useAdvertisementPopup({
    initialDelay: 30000, // 30 seconds
    repeatInterval: 900000, // 15 minutes
    maxDismissals: 3,
    sessionTimeout: 3600000, // 1 hour
  });

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/security" element={<Security />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          
          {/* Global Donation Popup */}
          <DonationPopup
            isOpen={isVisible}
            onClose={dismissPopup}
          />

          {/* Global Advertisement Popup */}
          <AdvertisementPopup
            isOpen={isAdVisible}
            onClose={dismissAdPopup}
          />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
