import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import CategorySidebar from "@/components/CategorySidebar";
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const CategoryPage = () => {
  const { category, subcategory } = useParams();
  
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products', category, subcategory],
    queryFn: async () => {
      let query = supabase.from('products').select('*');
      
      if (category) {
        query = query.eq('category', category.toLowerCase());
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const categoryTitle = subcategory || category;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-3">
            <CategorySidebar />
          </div>
          
          <div className="col-span-9">
            <h1 className="text-2xl font-bold mb-6 text-primary capitalize">
              {categoryTitle?.replace(/-/g, ' ')}
            </h1>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                {products?.length === 0 && (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    No products found in this category.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CategoryPage;