import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

interface ProductGalleryProps {
  imageUrl: string | null;
  productName: string;
}

export const ProductGallery = ({ imageUrl, productName }: ProductGalleryProps) => {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <Card className="overflow-hidden border-none bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950 group">
      <CardContent className="p-4">
        <div 
          className="relative overflow-hidden rounded-xl bg-white dark:bg-gray-900"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent dark:from-primary/10" />
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={productName}
            className={`w-full h-[600px] object-cover transition-all duration-700 ease-out ${
              isZoomed ? "scale-110" : "scale-100"
            }`}
          />
          <div className={`absolute inset-0 bg-black/5 backdrop-blur-[1px] transition-opacity duration-700 ${
            isZoomed ? "opacity-0" : "opacity-100"
          }`} />
        </div>
      </CardContent>
    </Card>
  );
};