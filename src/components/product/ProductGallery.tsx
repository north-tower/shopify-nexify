import { Card, CardContent } from "@/components/ui/card";

interface ProductGalleryProps {
  imageUrl: string | null;
  productName: string;
}

export const ProductGallery = ({ imageUrl, productName }: ProductGalleryProps) => {
  return (
    <Card className="overflow-hidden border-none bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950">
      <CardContent className="p-4">
        <div className="group relative overflow-hidden rounded-xl">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={productName}
            className="w-full h-[500px] object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/5 transition-opacity group-hover:opacity-0" />
        </div>
      </CardContent>
    </Card>
  );
};