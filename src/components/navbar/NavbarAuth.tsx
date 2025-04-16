
import { Link } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarAuthProps {
  user: any;
  isSellerRoute: boolean;
  handleSignOut: () => Promise<void>;
}

export const NavbarAuth = ({ user, isSellerRoute, handleSignOut }: NavbarAuthProps) => {
  return (
    <div className="hidden sm:flex items-center space-x-2">
      {user ? (
        <>
          <Link to={isSellerRoute ? "/seller/account" : "/account"}>
            <Button variant="ghost" className="hover:bg-primary/10 transition-colors">
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
          <Button variant="ghost" className="hover:bg-primary/10 transition-colors">
            <User className="h-5 w-5 mr-2" />
            <span className="hidden sm:inline">Sign In</span>
          </Button>
        </Link>
      )}
    </div>
  );
};
