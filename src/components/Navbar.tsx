import { Search, ShoppingCart, User } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-16">
            <h1 className="text-2xl font-bold text-primary">ShopEase</h1>
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search products, brands and categories"
                  className="w-full pl-10 pr-4 py-2"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost">
              <User className="h-5 w-5 mr-2" />
              Account
            </Button>
            <Button variant="ghost">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Cart
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;