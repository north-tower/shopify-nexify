import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Deals = () => {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products-deals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('price', { ascending: true })
        .limit(12);
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Today's Best Deals</h1>
            <p className="mt-2 text-gray-600">Discover our best prices and biggest savings.</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
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
                Failed to load deals. Please try again later.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products?.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.product_name}
                  price={Number(product.price)}
                  image={product.photo_url || '/placeholder.svg'}
                  ratings={product.ratings}
                  reviews_count={product.reviews_count}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Deals;