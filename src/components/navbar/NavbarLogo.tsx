
import { Link } from "react-router-dom";

interface NavbarLogoProps {
  isSeller: boolean;
  isSellerRoute: boolean;
}

export const NavbarLogo = ({ isSeller, isSellerRoute }: NavbarLogoProps) => {
  return (
    <Link to={isSeller && isSellerRoute ? "/seller/dashboard" : "/"}>
      <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
        {isSeller && isSellerRoute ? "Seller Hub" : "ShopEase"}
      </h1>
    </Link>
  );
};
