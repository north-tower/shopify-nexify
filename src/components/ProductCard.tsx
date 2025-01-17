import { Card, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";

interface ProductCardProps {
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  discount?: number;
}

const ProductCard = ({ title, price, originalPrice, image, discount }: ProductCardProps) => {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
      <CardContent className="p-0 relative">
        {discount && (
          <Badge className="absolute top-2 right-2 bg-sale">-{discount}%</Badge>
        )}
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
        />
      </CardContent>
      <CardFooter className="flex flex-col items-start p-4">
        <h3 className="font-medium text-sm line-clamp-2 mb-2">{title}</h3>
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold">KSh {price.toLocaleString()}</span>
          {originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              KSh {originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;