import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ShoppingCart, 
  Star, 
  Heart, 
  Package, 
  Truck, 
  ArrowLeft, 
  Share2, 
  Shield, 
  ThumbsUp, 
  MessageCircle 
} from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductActions } from "@/components/product/ProductActions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showShareOptions, setShowShareOptions] = useState(false);

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

  // Related products data (could be implemented with actual data later)
  const relatedProducts = [
    { id: 1, name: "Similar Product 1", price: 99.99, imageUrl: "/api/placeholder/300/300" },
    { id: 2, name: "Similar Product 2", price: 129.99, imageUrl: "/api/placeholder/300/300" },
    { id: 3, name: "Similar Product 3", price: 79.99, imageUrl: "/api/placeholder/300/300" },
  ];

  const goBack = () => {
    navigate(-1);
  };

  const shareProduct = (platform) => {
    // This would be implemented with actual sharing functionality
    toast({
      title: "Shared!",
      description: `Product shared via ${platform}`,
      variant: "success",
    });
    setShowShareOptions(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50/50 to-white dark:from-gray-950 dark:to-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="animate-pulse space-y-8"
          >
            <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-lg w-2/3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
              <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
            </div>
          </motion.div>
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Product not found
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mt-4">
                The product you're looking for doesn't exist or has been removed.
              </p>
              <Button 
                onClick={goBack}
                className="mt-6 bg-primary/90 hover:bg-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50/50 via-white to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <Navbar />
      
      <div className="container mx-auto px-4 py-4">
        <button 
          onClick={goBack}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to products
        </button>
      </div>
      
      <main className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 sticky top-24"
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-lg">
              <ProductGallery
                imageUrl={product.photo_url}
                productName={product.product_name}
              />
              
              <div className="mt-4 flex justify-between">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                        onClick={() => {
                          toast({
                            title: "Added to favorites!",
                            description: "This product has been added to your favorites",
                          });
                        }}
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add to favorites</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                        onClick={() => setShowShareOptions(!showShareOptions)}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Share this product</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              {showShareOptions && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg"
                >
                  <div className="flex justify-center space-x-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex flex-col items-center" 
                      onClick={() => shareProduct("Facebook")}
                    >
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">f</div>
                      <span className="text-xs mt-1">Facebook</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex flex-col items-center"
                      onClick={() => shareProduct("Twitter")}
                    >
                      <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-white">𝕏</div>
                      <span className="text-xs mt-1">Twitter</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex flex-col items-center"
                      onClick={() => shareProduct("Email")}
                    >
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white">@</div>
                      <span className="text-xs mt-1">Email</span>
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-8"
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
                    {product.product_name}
                  </h1>
                  <div className="flex items-center mt-2 space-x-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.ratings)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-600 dark:text-gray-400 text-sm">
                      {product.ratings} ({product.reviews_count} reviews)
                    </span>
                    <Badge variant="outline" className="ml-2 bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800">
                      In Stock: {product.stock_quantity}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</div>
                  {product.old_price && (
                    <div className="text-sm text-gray-500 line-through">${product.old_price.toFixed(2)}</div>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-800 pt-6 mt-6">
                <ProductActions
                  productId={product.id}
                  minimumOrder={product.minimum_order}
                  stockQuantity={product.stock_quantity}
                  price={product.price}
                  productName={product.product_name}
                  imageUrl={product.photo_url}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="flex items-center bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <Truck className="h-5 w-5 text-primary mr-3" />
                  <div>
                    <div className="text-sm font-medium">Free Shipping</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Orders over $50</div>
                  </div>
                </div>
                <div className="flex items-center bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <Shield className="h-5 w-5 text-primary mr-3" />
                  <div>
                    <div className="text-sm font-medium">2 Year Warranty</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Full coverage</div>
                  </div>
                </div>
                <div className="flex items-center bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <Package className="h-5 w-5 text-primary mr-3" />
                  <div>
                    <div className="text-sm font-medium">30-Day Returns</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">No questions asked</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden">
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm p-1 rounded-t-xl sticky top-20 z-10 border-b border-gray-100 dark:border-gray-800">
                  <TabsTrigger value="description" className="flex-1 rounded-lg">
                    Description
                  </TabsTrigger>
                  <TabsTrigger value="specifications" className="flex-1 rounded-lg">
                    Specifications
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="flex-1 rounded-lg">
                    Reviews
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="description" className="p-6">
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {product.description}
                    </p>
                    
                    {product.features && product.features.length > 0 && (
                      <div className="mt-8">
                        <h3 className="font-semibold mb-6 text-gray-900 dark:text-gray-100 text-xl">
                          Key Features
                        </h3>
                        <ul className="grid gap-4">
                          {product.features.map((feature, index) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 * index }}
                              className="flex items-start space-x-3 text-gray-600 dark:text-gray-400 group"
                            >
                              <span className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                                <ThumbsUp className="h-3 w-3" />
                              </span>
                              <span className="group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
                                {feature}
                              </span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="specifications" className="p-6">
                  {product.specifications && (
                    <div className="space-y-1">
                      {Object.entries(product.specifications).map(
                        ([key, value], index) => (
                          <motion.div
                            key={key}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 * index }}
                            className="grid grid-cols-2 gap-4 py-4 border-b last:border-0 group hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors rounded-lg px-3"
                          >
                            <span className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors">
                              {key}
                            </span>
                            <span className="text-gray-600 dark:text-gray-400">
                              {String(value)}
                            </span>
                          </motion.div>
                        )
                      )}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="reviews" className="p-6">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        Customer Reviews ({product.reviews_count})
                      </h3>
                      <Button className="bg-primary/90 hover:bg-primary">
                        <MessageCircle className="h-4 w-4 mr-2" /> Write a Review
                      </Button>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="font-semibold text-primary">JD</span>
                          </div>
                          <div>
                            <h4 className="font-medium">John Doe</h4>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < 5
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                              <span className="text-xs text-gray-500 ml-2">3 weeks ago</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="mt-3 text-gray-600 dark:text-gray-400">
                        This product exceeded my expectations. The quality is excellent and it works perfectly for what I needed. 
                        I would definitely recommend it to anyone looking for something similar.
                      </p>
                    </div>
                    
                    <div className="flex justify-center">
                      <Button variant="outline">View All Reviews</Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Related Products Section */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg mt-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                You may also like
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {relatedProducts.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden group"
                  >
                    <div className="aspect-square relative overflow-hidden">
                      <img 
                        src={item.imageUrl} 
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors">
                        {item.name}
                      </h4>
                      <div className="flex justify-between items-center mt-2">
                        <div className="font-semibold text-primary">${item.price.toFixed(2)}</div>
                        <Button variant="ghost" size="sm" className="rounded-full w-8 h-8 p-0">
                          <ShoppingCart className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;