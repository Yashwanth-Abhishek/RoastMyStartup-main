import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Roast from "./pages/Roast";
import Result from "./pages/Result";
import Pricing from "./pages/Pricing";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Signin from "./pages/Signin";
import AuthSuccess from "./pages/AuthSuccess";
import AuthError from "./pages/AuthError";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/roast" element={<Roast />} />
            <Route path="/result" element={<Result />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/auth/success" element={<AuthSuccess />} />
            <Route path="/auth/error" element={<AuthError />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
