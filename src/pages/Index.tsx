import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Star, Heart, ChevronRight, ArrowRight, TrendingUp, Award, Gift } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import CategorySidebar from "@/components/CategorySidebar";
import FlashSales from "@/components/FlashSales";
import ProductCard from "@/components/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
  
  const [currentBanner, setCurrentBanner] = useState(0);
  const banners = [
    {
      title: "Spring Collection 2025",
      subtitle: "Refresh your style with our newest arrivals",
      cta: "Shop Now",
      bgColor: "bg-gradient-to-r from-emerald-500 to-teal-400",
      textColor: "text-white"
    },
    {
      title: "Limited Time Offer",
      subtitle: "Get 30% off on selected items",
      cta: "View Deals",
      bgColor: "bg-gradient-to-r from-amber-500 to-orange-400",
      textColor: "text-white"
    },
    {
      title: "Premium Quality",
      subtitle: "Discover our handcrafted collection",
      cta: "Explore",
      bgColor: "bg-gradient-to-r from-indigo-500 to-purple-400",
      textColor: "text-white"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);
  
  const isMobile = useIsMobile();
  
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
            {/* Hero Banner Carousel */}
            <div className="mb-8 rounded-xl overflow-hidden shadow-md">
              <div className={`${banners[currentBanner].bgColor} p-8 md:p-12 relative`}>
                <div className="absolute top-4 right-4 flex space-x-2">
                  {banners.map((_, index) => (
                    <button 
                      key={index}
                      onClick={() => setCurrentBanner(index)}
                      className={`h-2 w-8 rounded-full ${currentBanner === index ? 'bg-white' : 'bg-white/40'}`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
                <div className="max-w-lg">
                  <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${banners[currentBanner].textColor}`}>
                    {banners[currentBanner].title}
                  </h1>
                  <p className={`text-lg md:text-xl mb-6 ${banners[currentBanner].textColor} opacity-90`}>
                    {banners[currentBanner].subtitle}
                  </p>
                  <Button size="lg" className="bg-white text-black hover:bg-gray-100">
                    {banners[currentBanner].cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {[
                { icon: TrendingUp, text: "Trending Items" },
                { icon: Gift, text: "Free Shipping" },
                { icon: Award, text: "Best Quality" },
                { icon: Heart, text: "Customer Favorites" }
              ].map((feature, idx) => (
                <Card key={idx} className="text-center py-3 border-none shadow-sm hover:shadow transition-shadow">
                  <CardContent className="pt-4">
                    <feature.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm font-medium">{feature.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Flash Sales Section - Conditionally rendered if you have a FlashSales component */}
            {/* <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center">
                  <Gift className="h-5 w-5 mr-2 text-red-500" />
                  Flash Sales
                </h2>
                <Button variant="ghost" size="sm" className="text-primary">
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <FlashSales />
            </div> */}
            
            {/* Products Grid */}
            <div>
              <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center">
                  <Gift className="h-5 w-5 mr-2 text-red-500" />
                  Products
                </h2>
              </div>
              
              {isLoading ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
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

            {/* Newsletter Section */}
            <div className="mt-12 bg-gray-100 rounded-xl p-6 md:p-8">
              <div className="text-center max-w-md mx-auto">
                <h3 className="text-xl font-bold mb-2">Stay Updated</h3>
                <p className="text-gray-600 mb-4">Subscribe to our newsletter for exclusive deals and updates</p>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Your email address" 
                    className="bg-white" 
                  />
                  <Button>Subscribe</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;