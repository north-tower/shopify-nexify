import { Search, ShoppingCart, User, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto px-4">
        {/* Main Navbar */}
        <div className="h-16 flex items-center justify-between">
          {/* Left Section - Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              ShopEase
            </h1>
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
              <Button 
                variant="ghost" 
                className="hover:bg-primary/10 transition-colors"
              >
                <User className="h-5 w-5 mr-2" />
                <span className="hidden sm:inline">Account</span>
              </Button>
              
              <Button 
                variant="ghost"
                className="hover:bg-primary/10 transition-colors relative"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                <span className="hidden sm:inline">Cart</span>
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </Button>
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
              <Button variant="ghost" className="justify-start">
                <User className="h-5 w-5 mr-2" />
                Account
              </Button>
              <Button variant="ghost" className="justify-start">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Cart
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;