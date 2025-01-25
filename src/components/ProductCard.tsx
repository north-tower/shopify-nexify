import { Card, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { toast } from "sonner";

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
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    toast.success("Added to cart successfully!");
    // TODO: Implement actual cart functionality
  };

  return (
    <Link to={`/product/${id}`}>
      <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 h-full">
        <CardContent className="p-0 relative">
          {discount && (
            <Badge className="absolute top-2 right-2 bg-sale hover:bg-sale/90">-{discount}%</Badge>
          )}
          <div className="relative overflow-hidden">
            <img
              src={image || "/placeholder.svg"}
              alt={title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Button 
                onClick={handleAddToCart}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start p-4 gap-2">
          <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <div className="flex items-center space-x-2 text-sm">
            <div className="flex items-center text-yellow-400">
              <Star className="h-4 w-4 fill-current" />
              <span className="ml-1 text-gray-700">{ratings.toFixed(1)}</span>
            </div>
            <span className="text-gray-500">({reviews_count} reviews)</span>
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-lg font-bold text-primary">
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