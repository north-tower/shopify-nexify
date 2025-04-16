
import { Link } from "react-router-dom";
import { Store, ShoppingCart, LayoutDashboard, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface NavbarMobileMenuProps {
  isOpen: boolean;
  user: any;
  isSellerRoute: boolean;
  isSeller: boolean;
  cartCount: number;
  handleSignOut: () => Promise<void>;
}

export const NavbarMobileMenu = ({ 
  isOpen, 
  user, 
  isSellerRoute, 
  isSeller,
  cartCount,
  handleSignOut 
}: NavbarMobileMenuProps) => {
  if (!isOpen) return null;

  return (
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
  );
};
