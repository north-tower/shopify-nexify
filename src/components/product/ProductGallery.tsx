import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

interface ProductGalleryProps {
  imageUrl: string | null;
  productName: string;
}

export const ProductGallery = ({ imageUrl, productName }: ProductGalleryProps) => {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <Card className="overflow-hidden border-none bg-gradient-to-b from-purple-50/80 to-white dark:from-gray-900/80 dark:to-gray-950/80 group backdrop-blur-sm">
      <CardContent className="p-4">
        <div 
          className="relative overflow-hidden rounded-xl bg-white dark:bg-gray-900 shadow-xl shadow-primary/5"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent dark:from-primary/20 z-10" />
          <div className="absolute inset-0 bg-gradient-to-bl from-secondary/10 to-transparent dark:from-secondary/20 z-10" />
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={productName}
            className={`w-full h-[600px] object-cover transition-all duration-700 ease-out ${
              isZoomed ? "scale-110 rotate-1" : "scale-100 rotate-0"
            }`}
          />
          <div className={`absolute inset-0 bg-black/5 backdrop-blur-[1px] transition-opacity duration-700 ${
            isZoomed ? "opacity-0" : "opacity-100"
          }`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </CardContent>
    </Card>
  );
};