import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductActions } from "@/components/product/ProductActions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

const ProductDetail = () => {
  const { id } = useParams();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", parseInt(id as string))
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error("Product not found");
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50/50 to-white dark:from-gray-950 dark:to-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-[600px] bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-lg w-2/3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
              <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50/50 to-white dark:from-gray-950 dark:to-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Product not found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              The product you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50/50 via-white to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="sticky top-24">
            <ProductGallery
              imageUrl={product.photo_url}
              productName={product.product_name}
            />
          </div>

          <div className="space-y-8">
            <div className="animate-fade-in">
              <ProductInfo
                name={product.product_name}
                ratings={product.ratings}
                reviewsCount={product.reviews_count}
                price={product.price}
                stockQuantity={product.stock_quantity}
                minimumOrder={product.minimum_order}
              />
            </div>

            <div className="animate-fade-in [animation-delay:200ms]">
              <ProductActions
                productId={product.id}
                minimumOrder={product.minimum_order}
                stockQuantity={product.stock_quantity}
                price={product.price}
                productName={product.product_name}
                imageUrl={product.photo_url}
              />
            </div>

            <div className="animate-fade-in [animation-delay:400ms]">
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm p-1 rounded-xl sticky top-20 z-10">
                  <TabsTrigger value="description" className="flex-1 rounded-lg">
                    Description
                  </TabsTrigger>
                  <TabsTrigger value="specifications" className="flex-1 rounded-lg">
                    Specifications
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="mt-6">
                  <Card className="border-none bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm shadow-lg">
                    <CardContent className="pt-6">
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {product.description}
                      </p>
                      {product.features && product.features.length > 0 && (
                        <div className="mt-8">
                          <h3 className="font-semibold mb-6 text-gray-900 dark:text-gray-100">
                            Key Features
                          </h3>
                          <ul className="grid gap-4">
                            {product.features.map((feature, index) => (
                              <li
                                key={index}
                                className="flex items-center space-x-3 text-gray-600 dark:text-gray-400 group"
                              >
                                <span className="h-2 w-2 rounded-full bg-primary/60 group-hover:bg-primary transition-colors flex-shrink-0" />
                                <span className="group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
                                  {feature}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="specifications" className="mt-6">
                  <Card className="border-none bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm shadow-lg">
                    <CardContent className="pt-6">
                      {product.specifications && (
                        <div className="space-y-4">
                          {Object.entries(product.specifications).map(
                            ([key, value]) => (
                              <div
                                key={key}
                                className="grid grid-cols-2 gap-4 py-4 border-b last:border-0 group hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors rounded-lg px-3"
                              >
                                <span className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors">
                                  {key}
                                </span>
                                <span className="text-gray-600 dark:text-gray-400">
                                  {String(value)}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;