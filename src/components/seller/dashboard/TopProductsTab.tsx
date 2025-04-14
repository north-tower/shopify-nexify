
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmptyState from "./EmptyState";
import { useNavigate } from "react-router-dom";

interface TopProduct {
  id: string;
  name: string;
  price: number;
  image: string | null;
  totalSales: number;
  totalQuantity: number;
}

interface TopProductsTabProps {
  isLoading: boolean;
  topProducts: TopProduct[] | null;
  onAddProduct: () => void;
}

const TopProductsTab = ({ isLoading, topProducts, onAddProduct }: TopProductsTabProps) => {
  const navigate = useNavigate();

  const handleViewProduct = (productId: string) => {
    navigate(`/seller/products?highlight=${productId}`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Top Products</CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/seller/products')}
        >
          View All Products
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <p>Loading product data...</p>
          </div>
        ) : topProducts && topProducts.length > 0 ? (
          <div className="grid gap-6">
            {topProducts.map((product) => (
              <div 
                key={product.id} 
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0 hover:bg-gray-50 p-2 rounded-md cursor-pointer transition-colors"
                onClick={() => handleViewProduct(product.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <Package className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.totalQuantity} units sold
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${product.totalSales.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">
                    ${product.price.toFixed(2)} each
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Package}
            title="No product performance data yet"
            description="Make some sales to see which products are your best sellers"
            actionLabel="Add a product"
            onAction={onAddProduct}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default TopProductsTab;
