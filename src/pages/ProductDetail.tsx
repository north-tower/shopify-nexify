import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductActions } from "@/components/product/ProductActions";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

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
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-32 bg-gray-200 rounded mb-8"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Product not found
            </h2>
            <p className="mt-2 text-gray-600">
              The product you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50/50 to-white dark:from-gray-950 dark:to-gray-900">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProductGallery
            imageUrl={product.photo_url}
            productName={product.product_name}
          />

          <div className="space-y-6">
            <ProductInfo
              name={product.product_name}
              ratings={product.ratings}
              reviewsCount={product.reviews_count}
              price={product.price}
              stockQuantity={product.stock_quantity}
              minimumOrder={product.minimum_order}
            />

            <ProductActions
              productId={product.id}
              minimumOrder={product.minimum_order}
              stockQuantity={product.stock_quantity}
              price={product.price}
              productName={product.product_name}
              imageUrl={product.photo_url}
            />

            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full bg-white dark:bg-gray-950 p-1 rounded-xl">
                <TabsTrigger value="description" className="flex-1 rounded-lg">
                  Description
                </TabsTrigger>
                <TabsTrigger value="specifications" className="flex-1 rounded-lg">
                  Specifications
                </TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-6">
                <Card className="border-none bg-white dark:bg-gray-950 shadow-sm">
                  <CardContent className="pt-6">
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {product.description}
                    </p>
                    {product.features && product.features.length > 0 && (
                      <div className="mt-6">
                        <h3 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">
                          Key Features
                        </h3>
                        <ul className="grid gap-3">
                          {product.features.map((feature, index) => (
                            <li
                              key={index}
                              className="flex items-center space-x-3 text-gray-600 dark:text-gray-400"
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="specifications" className="mt-6">
                <Card className="border-none bg-white dark:bg-gray-950 shadow-sm">
                  <CardContent className="pt-6">
                    {product.specifications && (
                      <div className="space-y-4">
                        {Object.entries(product.specifications).map(
                          ([key, value]) => (
                            <div
                              key={key}
                              className="grid grid-cols-2 gap-4 py-3 border-b last:border-0"
                            >
                              <span className="font-medium text-gray-900 dark:text-gray-100">
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
      </main>
    </div>
  );
};

export default ProductDetail;