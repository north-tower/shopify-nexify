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
      <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-500 h-full bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-950/50 border-transparent hover:border-primary/20 relative before:absolute before:inset-0 before:bg-white/10 before:backdrop-blur-sm dark:before:bg-black/10 before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100">
        <CardContent className="p-0 relative">
          {discount && (
            <Badge className="absolute top-3 right-3 bg-sale hover:bg-sale/90 shadow-lg animate-fade-in z-10 backdrop-blur-md">
              -{discount}% OFF
            </Badge>
          )}
          <div className="relative overflow-hidden group">
            <div className="aspect-square">
              <img
                src={image || "/placeholder.svg"}
                alt={title}
                className="w-full h-full object-cover transform transition-all duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[2px]">
              <Button 
                onClick={handleAddToCart}
                className="bg-white/90 text-primary hover:bg-primary hover:text-white transform -translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-xl hover:shadow-primary/25 opacity-0 group-hover:opacity-100"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start p-5 gap-2 bg-white/95 dark:bg-gray-900/95 relative z-20">
          <h3 className="font-medium text-sm line-clamp-2 text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors duration-300">
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
            <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-gradient-to-r after:from-primary/20 after:to-secondary/20">
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