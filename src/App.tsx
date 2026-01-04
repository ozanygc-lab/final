import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AuthCallback from "./pages/AuthCallback";
import Pricing from "./pages/Pricing";
import EbookProduct from "./pages/EbookProduct";
import Success from "./pages/Success";
import Dashboard from "./pages/Dashboard";
import EbookEditor from "./pages/EbookEditor";
import Generate from "./pages/Generate";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/ebook/:slug" element={<EbookProduct />} />
          <Route path="/p/:slug" element={<EbookProduct />} />
          <Route path="/ebook/:slug/success" element={<Success />} />
          <Route path="/success" element={<Success />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/ebooks/:id" element={<EbookEditor />} />
          <Route path="/dashboard/generate" element={<Generate />} />
          <Route path="/app" element={<Dashboard />} />
          <Route path="/app/chat" element={<Dashboard />} />
          <Route path="/app/generate" element={<Generate />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
