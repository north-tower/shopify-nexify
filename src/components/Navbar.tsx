
import { Search, ShoppingCart, User, Menu, LogOut, Store, LayoutDashboard } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCartStore } from "@/store/useCartStore";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const isSellerRoute = location.pathname.startsWith('/seller');

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Check if user is a seller
        const { data: seller } = await supabase
          .from('sellers')
          .select('id')
          .eq('user_id', session.user.id)
          .single();
        
        setIsSeller(!!seller);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        setIsSeller(false);
      } else {
        // Check if user is a seller when auth state changes
        supabase
          .from('sellers')
          .select('id')
          .eq('user_id', session.user.id)
          .single()
          .then(({ data }) => {
            setIsSeller(!!data);
          });
      }
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
            <Link to={isSeller && isSellerRoute ? "/seller/dashboard" : "/"}>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {isSeller && isSellerRoute ? "Seller Hub" : "ShopEase"}
              </h1>
            </Link>
            
            {!isSellerRoute && (
              <>
                <Link to="/deals" className="hidden md:block text-sm font-medium hover:text-primary transition-colors">
                  Deals
                </Link>
                {!isSeller && (
                  <Link to="/seller/register" className="hidden md:block text-sm font-medium hover:text-primary transition-colors">
                    <span className="flex items-center">
                      <Store className="h-4 w-4 mr-1" />
                      Become a Seller
                    </span>
                  </Link>
                )}
              </>
            )}
            
            {isSeller && (
              <Link 
                to={isSellerRoute ? "/" : "/seller/dashboard"} 
                className="hidden md:block text-sm font-medium hover:text-primary transition-colors"
              >
                <span className="flex items-center">
                  {isSellerRoute ? (
                    <>
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Shop as Customer
                    </>
                  ) : (
                    <>
                      <LayoutDashboard className="h-4 w-4 mr-1" />
                      Seller Dashboard
                    </>
                  )}
                </span>
              </Link>
            )}
          </div>

          {/* Center Section - Search (Hidden on mobile and in seller routes) */}
          {!isSellerRoute && (
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
          )}

          {/* Right Section - Actions */}
          <div className="flex items-center space-x-2">
            <div className="hidden sm:flex items-center space-x-2">
              {user ? (
                <>
                  <Link to={isSellerRoute ? "/seller/account" : "/account"}>
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
                <Link to={isSellerRoute ? "/auth?seller=true" : "/auth"}>
                  <Button 
                    variant="ghost" 
                    className="hover:bg-primary/10 transition-colors"
                  >
                    <User className="h-5 w-5 mr-2" />
                    <span className="hidden sm:inline">Sign In</span>
                  </Button>
                </Link>
              )}
              
              {!isSellerRoute && (
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
              )}
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
            {!isSellerRoute && (
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            )}
            
            <div className="flex flex-col space-y-2">
              {!isSellerRoute && (
                <Link to="/deals">
                  <Button variant="ghost" className="w-full justify-start">
                    Deals
                  </Button>
                </Link>
              )}
              
              {user ? (
                <>
                  <Link to={isSellerRoute ? "/seller/account" : "/account"}>
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
                <Link to={isSellerRoute ? "/auth?seller=true" : "/auth"}>
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="h-5 w-5 mr-2" />
                    Sign In
                  </Button>
                </Link>
              )}
              
              {!isSellerRoute && (
                <>
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
                  
                  {!isSeller ? (
                    <Link to="/seller/register">
                      <Button variant="ghost" className="w-full justify-start">
                        <Store className="h-5 w-5 mr-2" />
                        Become a Seller
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/seller/dashboard">
                      <Button variant="ghost" className="w-full justify-start">
                        <LayoutDashboard className="h-5 w-5 mr-2" />
                        Seller Dashboard
                      </Button>
                    </Link>
                  )}
                </>
              )}
              
              {isSeller && (
                <Link to={isSellerRoute ? "/" : "/seller/dashboard"}>
                  <Button variant="ghost" className="w-full justify-start">
                    {isSellerRoute ? (
                      <>
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Shop as Customer
                      </>
                    ) : (
                      <>
                        <LayoutDashboard className="h-5 w-5 mr-2" />
                        Seller Dashboard
                      </>
                    )}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
