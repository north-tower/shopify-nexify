
import { Link } from "react-router-dom";
import { Store, ShoppingCart, LayoutDashboard } from "lucide-react";

interface NavbarLinksProps {
  isSellerRoute: boolean;
  isSeller: boolean;
}

export const NavbarLinks = ({ isSellerRoute, isSeller }: NavbarLinksProps) => {
  if (isSellerRoute) return null;

  return (
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
  );
};
