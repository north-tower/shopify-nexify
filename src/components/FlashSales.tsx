import { useEffect, useState } from "react";
import { Clock, ArrowRight, Percent, Tag, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

const FlashSales = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 16,
    minutes: 0,
    seconds: 0,
  });
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(null);

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['flash-sale-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('ratings', { ascending: false })
        .limit(4);
      
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newSeconds = prev.seconds - 1;
        if (newSeconds >= 0) return { ...prev, seconds: newSeconds };
        
        const newMinutes = prev.minutes - 1;
        if (newMinutes >= 0) return { ...prev, minutes: newMinutes, seconds: 59 };
        
        const newHours = prev.hours - 1;
        if (newHours >= 0) return { hours: newHours, minutes: 59, seconds: 59 };
        
        clearInterval(timer);
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil((products?.length || 0) / 2));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => 
      (prev - 1 + Math.ceil((products?.length || 0) / 2)) % Math.ceil((products?.length || 0) / 2)
    );
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 space-y-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-xl p-6">
        <p className="text-red-600">Error loading flash sale products</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl overflow-hidden">
      {/* Header Section */}
      <div className="p-6 border-b border-purple-100">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-primary p-2 rounded-lg">
              <Tag className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-primary">Flash Sales</h2>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
              Today's Deals
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <span className="text-sm text-gray-600">Ends in:</span>
              <div className="flex items-center space-x-1">
                {[
                  timeLeft.hours,
                  timeLeft.minutes,
                  timeLeft.seconds
                ].map((time, index) => (
                  <div key={index} className="flex items-center">
                    <div className="bg-primary text-white px-3 py-1 rounded-lg font-mono">
                      {String(time).padStart(2, "0")}
                    </div>
                    {index < 2 && <span className="mx-1 text-primary font-bold">:</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="p-6 relative">
        <div className="relative overflow-hidden">
          <div className="flex transition-transform duration-300 ease-in-out"
               style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {products?.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="block"
                >
                  <div
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group"
                    onMouseEnter={() => setIsHovered(product.id)}
                    onMouseLeave={() => setIsHovered(null)}
                  >
                    <div className="relative">
                      <img
                        src={product.photo_url || "/placeholder.svg"}
                        alt={product.product_name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2 flex space-x-2">
                        <span className="bg-sale text-white px-2 py-1 rounded-full text-sm font-medium flex items-center">
                          <Percent className="h-4 w-4 mr-1" />
                          30% OFF
                        </span>
                      </div>
                      {isHovered === product.id && (
                        <div className="absolute inset-0 bg-black bg-opacity-20 transition-opacity duration-300 flex items-center justify-center">
                          <Button className="bg-white text-primary hover:bg-primary hover:text-white transition-colors duration-300">
                            View Deal
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 truncate">{product.product_name}</h3>
                      <div className="mt-2 flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-primary">
                            KSh {product.price?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="relative pt-1">
                          <div className="flex mb-2 items-center justify-between">
                            <div>
                              <span className="text-xs font-semibold inline-block text-primary">
                                {Math.round((product.stock_quantity || 0) * 0.7)}% Sold
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-semibold inline-block text-primary">
                                {product.stock_quantity} left
                              </span>
                            </div>
                          </div>
                          <div className="overflow-hidden h-2 text-xs flex rounded bg-primary/20">
                            <div
                              style={{ width: `${(product.stock_quantity || 0) * 0.7}%` }}
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <Button
          onClick={prevSlide}
          variant="outline"
          size="icon"
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white hover:bg-primary hover:text-white transition-colors duration-300 rounded-full"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          onClick={nextSlide}
          variant="outline"
          size="icon"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white hover:bg-primary hover:text-white transition-colors duration-300 rounded-full"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Footer Section */}
      <div className="p-4 bg-white border-t border-purple-100">
        <Button
          variant="ghost"
          className="w-full flex items-center justify-center space-x-2 text-primary hover:text-primary/90 hover:bg-primary/10"
        >
          <span className="font-medium">View All Deals</span>
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default FlashSales;