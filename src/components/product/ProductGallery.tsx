import { Card, CardContent } from "@/components/ui/card";

interface ProductGalleryProps {
  imageUrl: string | null;
  productName: string;
}

export const ProductGallery = ({ imageUrl, productName }: ProductGalleryProps) => {
  return (
    <Card>
      <CardContent className="p-2">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={productName}
          className="w-full h-[400px] object-cover rounded-lg"
        />
      </CardContent>
    </Card>
  );
};