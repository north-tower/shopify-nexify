
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface NavbarSearchProps {
  isSellerRoute: boolean;
}

export const NavbarSearch = ({ isSellerRoute }: NavbarSearchProps) => {
  if (isSellerRoute) return null;

  return (
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
  );
};
