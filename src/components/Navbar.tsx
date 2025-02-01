import { Search, ShoppingCart, User, Menu, LogOut, Store } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/useCartStore";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
      toast({
        title: "Signed out successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto px-4">
        {/* Main Navbar */}
        <div className="h-16 flex items-center justify-between">
          {/* Left Section - Logo */}
          <div className="flex items-center space-x-6">
            <Link to="/">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                ShopEase
              </h1>
            </Link>
            <Link to="/deals" className="hidden md:block text-sm font-medium hover:text-primary transition-colors">
              Deals
            </Link>
            <Link to="/seller/register" className="hidden md:block text-sm font-medium hover:text-primary transition-colors">
              <span className="flex items-center">
                <Store className="h-4 w-4 mr-1" />
                Become a Seller
              </span>
            </Link>
          </div>

          {/* Center Section - Search (Hidden on mobile) */}
          <div className="hidden md:block flex-1 max-w-2xl mx-8">
            <div className="relative group">
              <Input
                type="search"
                placeholder="Search products, brands and categories"
                className="w-full pl-10 pr-4 py-2 transition-shadow duration-200 focus:ring-2 ring-primary/20"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center space-x-2">
            <div className="hidden sm:flex items-center space-x-2">
              {user ? (
                <>
                  <Link to="/account">
                    <Button 
                      variant="ghost" 
                      className="hover:bg-primary/10 transition-colors"
                    >
                      <User className="h-5 w-5 mr-2" />
                      <span className="hidden sm:inline">Account</span>
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="hover:bg-primary/10 transition-colors"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </Button>
                </>
              ) : (
                <Link to="/auth">
                  <Button 
                    variant="ghost" 
                    className="hover:bg-primary/10 transition-colors"
                  >
                    <User className="h-5 w-5 mr-2" />
                    <span className="hidden sm:inline">Sign In</span>
                  </Button>
                </Link>
              )}
              
              <Link to="/cart">
                <Button 
                  variant="ghost"
                  className="hover:bg-primary/10 transition-colors relative"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  <span className="hidden sm:inline">Cart</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t py-4 space-y-4">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <div className="flex flex-col space-y-2">
              <Link to="/deals">
                <Button variant="ghost" className="w-full justify-start">
                  Deals
                </Button>
              </Link>
              {user ? (
                <>
                  <Link to="/account">
                    <Button variant="ghost" className="w-full justify-start">
                      <User className="h-5 w-5 mr-2" />
                      Account
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Link to="/auth">
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="h-5 w-5 mr-2" />
                    Sign In
                  </Button>
                </Link>
              )}
              <Link to="/cart">
                <Button variant="ghost" className="w-full justify-start relative">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Cart
                  {cartCount > 0 && (
                    <span className="absolute top-2 left-8 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>
              <Link to="/seller/register">
                <Button variant="ghost" className="w-full justify-start">
                  <Store className="h-5 w-5 mr-2" />
                  Become a Seller
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
