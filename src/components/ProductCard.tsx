import { Card, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/store/useCartStore";

interface ProductCardProps {
  id?: number;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  discount?: number;
  ratings?: number;
  reviews_count?: number;
}

const ProductCard = ({ 
  id, 
  title, 
  price, 
  originalPrice, 
  image, 
  discount,
  ratings = 0,
  reviews_count = 0
}: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (id) {
      addItem({
        id,
        title,
        price,
        image,
      });
      toast.success("Added to cart successfully!");
    }
  };

  return (
    <Link to={`/product/${id}`}>
      <Card className="overflow-hidden group hover:shadow-xl transition-all duration-500 h-full bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-950/50 border-transparent hover:border-primary/20">
        <CardContent className="p-0 relative">
          {discount && (
            <Badge className="absolute top-3 right-3 bg-sale hover:bg-sale/90 shadow-lg animate-fade-in">
              -{discount}% OFF
            </Badge>
          )}
          <div className="relative overflow-hidden">
            <div className="aspect-square">
              <img
                src={image || "/placeholder.svg"}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
              />
            </div>
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
              <Button 
                onClick={handleAddToCart}
                className="bg-white text-primary hover:bg-primary hover:text-white transform -translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-xl"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start p-5 gap-2">
          <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>
          <div className="flex items-center space-x-2 text-sm">
            <div className="flex items-center text-yellow-400">
              <Star className="h-4 w-4 fill-current" />
              <span className="ml-1 text-gray-700 dark:text-gray-300">{ratings.toFixed(1)}</span>
            </div>
            <span className="text-gray-500">({reviews_count} reviews)</span>
          </div>
          <div className="flex items-center space-x-3 mt-1">
            <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              KSh {price.toLocaleString()}
            </span>
            {originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                KSh {originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProductCard;