import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "@/components/navbar/Navbar";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { LayoutDashboard, Package, ShoppingCart, TrendingUp, Settings } from "lucide-react";

interface SellerLayoutProps {
  children: ReactNode;
}

const SellerLayout = ({ children }: SellerLayoutProps) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const navItems = [
    { path: "/seller/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/seller/products", label: "Products", icon: Package },
    { path: "/seller/orders", label: "Orders", icon: ShoppingCart },
    { path: "/seller/analytics", label: "Analytics", icon: TrendingUp },
    { path: "/seller/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto py-6 px-4">
        {/* Seller Navigation */}
        <NavigationMenu className="mb-6 max-w-full">
          <NavigationMenuList className="border rounded-lg bg-white shadow-sm flex flex-nowrap overflow-x-auto">
            {navItems.map((item) => (
              <NavigationMenuItem key={item.path}>
                <Link to={item.path}>
                  <NavigationMenuLink 
                    className={`${navigationMenuTriggerStyle()} ${
                      currentPath === item.path ? "bg-muted" : ""
                    }`}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        
        {children}
      </div>
    </div>
  );
};

export default SellerLayout;
