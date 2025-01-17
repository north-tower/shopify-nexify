import { useEffect, useState } from "react";
import { Clock, ArrowRight, Percent, Tag, ChevronLeft, ChevronRight } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Wireless Noise Cancelling Headphones",
    price: 199.99,
    originalPrice: 299.99,
    discount: 33,
    image: "/api/placeholder/200/200",
    sold: 154,
    stock: 200
  },
  {
    id: 2,
    name: "Smart Fitness Watch Pro",
    price: 149.99,
    originalPrice: 249.99,
    discount: 40,
    image: "/api/placeholder/200/200",
    sold: 89,
    stock: 100
  },
  {
    id: 3,
    name: "4K Ultra HD Smart TV",
    price: 599.99,
    originalPrice: 899.99,
    discount: 33,
    image: "/api/placeholder/200/200",
    sold: 76,
    stock: 150
  },
  {
    id: 4,
    name: "Premium Coffee Maker",
    price: 79.99,
    originalPrice: 129.99,
    discount: 38,
    image: "/api/placeholder/200/200",
    sold: 245,
    stock: 300
  }
];

const FlashSales = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 16,
    minutes: 0,
    seconds: 0,
  });
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(null);

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
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(products.length / 2));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(products.length / 2)) % Math.ceil(products.length / 2));
  };

  return (
    <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl overflow-hidden">
      {/* Header Section */}
      <div className="p-6 border-b border-red-100">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-red-600 p-2 rounded-lg">
              <Tag className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-red-600">Flash Sales</h2>
            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
              Today's Deals
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-red-600" />
              <span className="text-sm text-gray-600">Ends in:</span>
              <div className="flex items-center space-x-1">
                {[
                  timeLeft.hours,
                  timeLeft.minutes,
                  timeLeft.seconds
                ].map((time, index) => (
                  <div key={index} className="flex items-center">
                    <div className="bg-red-600 text-white px-3 py-1 rounded-lg font-mono">
                      {String(time).padStart(2, "0")}
                    </div>
                    {index < 2 && <span className="mx-1 text-red-600 font-bold">:</span>}
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
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
                  onMouseEnter={() => setIsHovered(product.id)}
                  onMouseLeave={() => setIsHovered(null)}
                >
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 left-2 flex space-x-2">
                      <span className="bg-red-600 text-white px-2 py-1 rounded-full text-sm font-medium flex items-center">
                        <Percent className="h-4 w-4 mr-1" />
                        {product.discount}% OFF
                      </span>
                    </div>
                    {isHovered === product.id && (
                      <div className="absolute inset-0 bg-black bg-opacity-20 transition-opacity duration-300">
                        <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-red-600 px-6 py-2 rounded-full font-medium hover:bg-red-600 hover:text-white transition-colors duration-300">
                          View Deal
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                    <div className="mt-2 flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-red-600">${product.price}</span>
                        <span className="ml-2 text-sm text-gray-500 line-through">${product.originalPrice}</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block text-red-600">
                              {Math.round((product.sold / product.stock) * 100)}% Sold
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-red-600">
                              {product.stock - product.sold} left
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-red-200">
                          <div
                            style={{ width: `${(product.sold / product.stock) * 100}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-600"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-red-600 hover:text-white transition-colors duration-300"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-red-600 hover:text-white transition-colors duration-300"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Footer Section */}
      <div className="p-4 bg-white border-t border-red-100">
        <button className="w-full flex items-center justify-center space-x-2 text-red-600 hover:text-red-700 transition-colors duration-300">
          <span className="font-medium">View All Deals</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default FlashSales;