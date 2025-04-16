import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { NavbarLogo } from "./NavbarLogo";
import { NavbarLinks } from "./NavbarLinks";
import { NavbarSearch } from "./NavbarSearch";
import { NavbarAuth } from "./NavbarAuth";
import { NavbarCart } from "./NavbarCart";
import { NavbarMobileMenu } from "./NavbarMobileMenu";

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
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <NavbarLogo isSeller={isSeller} isSellerRoute={isSellerRoute} />
            <NavbarLinks isSellerRoute={isSellerRoute} isSeller={isSeller} />
          </div>

          <NavbarSearch isSellerRoute={isSellerRoute} />

          <div className="flex items-center space-x-2">
            <NavbarAuth 
              user={user}
              isSellerRoute={isSellerRoute}
              handleSignOut={handleSignOut}
            />
            <NavbarCart isSellerRoute={isSellerRoute} cartCount={cartCount} />

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

        <NavbarMobileMenu 
          isOpen={isMobileMenuOpen}
          user={user}
          isSellerRoute={isSellerRoute}
          isSeller={isSeller}
          cartCount={cartCount}
          handleSignOut={handleSignOut}
        />
      </div>
    </nav>
  );
};

export default Navbar;
