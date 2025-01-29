import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProductInfoProps {
  name: string;
  ratings?: number | null;
  reviewsCount?: number | null;
  price?: number | null;
  stockQuantity?: number | null;
  minimumOrder?: number | null;
}

export const ProductInfo = ({
  name,
  ratings = 0,
  reviewsCount = 0,
  price = 0,
  stockQuantity = 0,
  minimumOrder = 1,
}: ProductInfoProps) => {
  return (
    <div className="space-y-6 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm rounded-xl p-8 shadow-lg">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
          {name}
        </h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-purple-50/80 dark:bg-gray-900/80 backdrop-blur-sm px-4 py-2 rounded-lg">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 transition-all duration-300 ${
                    star <= Math.floor(ratings || 0)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              ({reviewsCount || 0} reviews)
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-4">
          <p className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-primary/20 after:to-secondary/20">
            KSh {price?.toLocaleString()}
          </p>
          <div className="flex gap-3">
            <Badge 
              variant="secondary" 
              className="px-4 py-1.5 text-sm backdrop-blur-sm hover:bg-secondary/20"
            >
              {stockQuantity} in stock
            </Badge>
            <Badge 
              variant="outline" 
              className="px-4 py-1.5 text-sm backdrop-blur-sm hover:bg-primary/10"
            >
              Min order: {minimumOrder}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};