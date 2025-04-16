
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarCartProps {
  isSellerRoute: boolean;
  cartCount: number;
}

export const NavbarCart = ({ isSellerRoute, cartCount }: NavbarCartProps) => {
  if (isSellerRoute) return null;

  return (
    <Link to="/cart">
      <Button variant="ghost" className="hover:bg-primary/10 transition-colors relative">
        <ShoppingCart className="h-5 w-5 mr-2" />
        <span className="hidden sm:inline">Cart</span>
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </Button>
    </Link>
  );
};
