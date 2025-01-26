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
    <div className="space-y-6 bg-white dark:bg-gray-950 rounded-xl p-6 shadow-sm">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">{name}</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-purple-50 dark:bg-gray-900 px-3 py-1.5 rounded-lg">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.floor(ratings || 0)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              ({reviewsCount || 0} reviews)
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-4">
          <p className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            KSh {price?.toLocaleString()}
          </p>
          <div className="flex gap-3">
            <Badge variant="secondary" className="px-3 py-1">
              {stockQuantity} in stock
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              Min order: {minimumOrder}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};