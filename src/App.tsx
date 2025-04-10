
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import CategoryPage from "./pages/CategoryPage";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Deals from "./pages/Deals";
import Account from "./pages/Account";
import Auth from "./pages/Auth";
import SellerRegistration from "./pages/SellerRegistration";
import SellerDashboard from "./pages/SellerDashboard";

// Route guard for seller routes
const SellerRoute = ({ element }) => {
  const [loading, setLoading] = useState(true);
  const [isSeller, setIsSeller] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkSellerStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setLoading(false);
        setIsAuthenticated(false);
        return;
      }
      
      setIsAuthenticated(true);
      
      // Check if user is a seller
      const { data: seller } = await supabase
        .from('sellers')
        .select('id')
        .eq('user_id', session.user.id)
        .single();
      
      setIsSeller(!!seller);
      setLoading(false);
    };
    
    checkSellerStatus();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  
  if (!isAuthenticated) {
    return <Navigate to="/auth?seller=true" replace />;
  }
  
  if (!isSeller) {
    return <Navigate to="/seller/register" replace />;
  }
  
  return element;
};

const App = () => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 1,
      },
    },
  }));
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Customer Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/category/:category/:subcategory" element={<CategoryPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/deals" element={<Deals />} />
            <Route 
              path="/account" 
              element={
                session ? <Account /> : <Navigate to="/auth" replace />
              } 
            />
            
            {/* Auth Routes */}
            <Route path="/auth" element={<Auth />} />
            
            {/* Seller Routes */}
            <Route 
              path="/seller/register" 
              element={
                session ? <SellerRegistration /> : <Navigate to="/auth?seller=true" replace />
              }
            />
            <Route path="/seller/dashboard" element={<SellerRoute element={<SellerDashboard />} />} />
            <Route path="/seller/products" element={<SellerRoute element={<div>Products Management</div>} />} />
            <Route path="/seller/orders" element={<SellerRoute element={<div>Orders Management</div>} />} />
            <Route path="/seller/analytics" element={<SellerRoute element={<div>Analytics</div>} />} />
            <Route path="/seller/settings" element={<SellerRoute element={<div>Settings</div>} />} />
            <Route 
              path="/seller/account" 
              element={<SellerRoute element={<Account />} />} 
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
