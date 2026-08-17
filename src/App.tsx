import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import Newsletters from "./pages/Newsletters";
import Resources from "./pages/Resources";
import Podcasts from "./pages/Podcasts";
import Article from "./pages/Article";
import Author from "./pages/Author";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import RequireAdmin from "./components/RequireAdmin";
import { AuthProvider } from "./hooks/useAuth";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/newsletters" element={<Newsletters />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/podcasts" element={<Podcasts />} />
          <Route path="/article/:id" element={<Article />} />
          <Route path="/author/:authorName" element={<Author />} />
          <Route path="/search" element={<Search />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
