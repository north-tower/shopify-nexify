import Navbar from "@/components/Navbar";
import CategorySidebar from "@/components/CategorySidebar";
import FlashSales from "@/components/FlashSales";
import ProductCard from "@/components/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const Index = () => {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('*');
      console.log("Supabase Response:", { data, error });
      if (error) throw error;
      return data;
    },
  });
  
  const isMobile = useIsMobile();
  console.log("Products:", products);
  console.error("Error:", error);

  const CategorySidebarContent = () => (
    <div className="h-full">
      <CategorySidebar />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block lg:col-span-3">
            <CategorySidebarContent />
          </div>
          
          {/* Sidebar - Mobile */}
          <div className="lg:hidden mb-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Menu className="h-4 w-4 mr-2" />
                  Browse Categories
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <div className="py-4">
                  <CategorySidebarContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-9">
            <div className="mb-8">
              <FlashSales />
            </div>
            
            {/* Products Grid */}
            <div>
              <h2 className="text-xl font-bold mb-6">Featured Products</h2>
              
              {isLoading ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-4">
                      <Skeleton className="h-48 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : error ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Failed to load products. Please try again later.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                  {products?.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      title={product.product_name}
                      price={Number(product.price)}
                      image={product.photo_url || '/placeholder.svg'}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;