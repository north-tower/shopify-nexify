
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Clock, Tag, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "@/lib/utils";

interface FlashSaleProduct {
  id: string;
  name: string;
  price: number;
  discount: number;
  image: string;
  endTime: string;
  category: string;
}

const FlashSales = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  const flashSales: FlashSaleProduct[] = [
    {
      id: "1",
      name: "Premium Headphones",
      price: 299.99,
      discount: 30,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
      endTime: "2024-03-20T23:59:59",
      category: "Electronics"
    },
    {
      id: "2",
      name: "Smart Watch",
      price: 199.99,
      discount: 25,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
      endTime: "2024-03-20T23:59:59",
      category: "Electronics"
    },
    {
      id: "3",
      name: "Wireless Earbuds",
      price: 149.99,
      discount: 20,
      image: "https://images.unsplash.com/photo-1606220588911-5117a8a1db8b",
      endTime: "2024-03-20T23:59:59",
      category: "Electronics"
    },
    {
      id: "4",
      name: "Gaming Laptop",
      price: 1299.99,
      discount: 15,
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
      endTime: "2024-03-20T23:59:59",
      category: "Electronics"
    },
    {
      id: "5",
      name: "Wireless Mouse",
      price: 49.99,
      discount: 40,
      image: "https://images.unsplash.com/photo-1527814050087-3793815479db",
      endTime: "2024-03-20T23:59:59",
      category: "Accessories"
    },
    {
      id: "6",
      name: "Mechanical Keyboard",
      price: 89.99,
      discount: 35,
      image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3",
      endTime: "2024-03-20T23:59:59",
      category: "Accessories"
    }
  ];

  const productsPerPage = 4;
  const totalPages = Math.ceil(flashSales.length / productsPerPage);
  const currentProducts = flashSales.slice(
    currentPage * productsPerPage,
    (currentPage + 1) * productsPerPage
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const endTime = new Date(flashSales[0].endTime);
      const diff = endTime.getTime() - now.getTime();

      if (diff <= 0) {
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, [flashSales]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Tag className="h-5 w-5 text-red-500" />
          <h2 className="text-xl font-bold">Flash Deals</h2>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">Ends in: {timeLeft}</span>
        </div>
      </div>

      {/* Products Grid */}
      <div className="relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {currentProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="group cursor-pointer"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                  {product.discount}% OFF
                </div>
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-500">{product.category}</p>
                <h3 className="font-medium text-gray-900 line-clamp-2">{product.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg font-bold text-primary">
                    {formatCurrency(product.price * (1 - product.discount / 100))}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    {formatCurrency(product.price)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {totalPages > 1 && (
          <>
            <button
              onClick={() => setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-sm"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={() => setCurrentPage((prev) => (prev + 1) % totalPages)}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-sm"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      {/* View All Button */}
      <div className="mt-4 text-center">
        <Button
          variant="outline"
          className="group"
          onClick={() => navigate("/flash-sales")}
        >
          View All Deals
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  );
};

export default FlashSales;
