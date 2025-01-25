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
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{name}</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
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
            <span className="ml-2 text-sm text-gray-600">
              ({reviewsCount || 0} reviews)
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-3xl font-bold text-primary">
            KSh {price?.toLocaleString()}
          </p>
          <div className="flex gap-2 mt-2">
            <Badge variant="secondary">
              Stock: {stockQuantity} available
            </Badge>
            <Badge variant="outline">
              Min order: {minimumOrder} piece(s)
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};