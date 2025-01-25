import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ProductActionsProps {
  productId: number;
  minimumOrder?: number;
  stockQuantity?: number;
  price: number;
  productName: string;
  imageUrl?: string | null;
}

export const ProductActions = ({
  productId,
  minimumOrder = 1,
  stockQuantity = 0,
  price,
  productName,
  imageUrl,
}: ProductActionsProps) => {
  const [quantity, setQuantity] = useState(minimumOrder);
  const navigate = useNavigate();

  const handleBuyNow = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please login to place an order");
        return;
      }

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: parseInt(user.id), // Convert UUID to number
          order_number: `ORD-${Date.now()}`,
          total_amount: price * quantity,
          shipping_address: {},
          billing_address: {},
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order item
      const { error: itemError } = await supabase
        .from('order_items')
        .insert({
          order_id: order.id,
          product_id: productId,
          product_name: productName,
          sku: `SKU-${productId}`,
          price: price,
          quantity: quantity,
          total_price: price * quantity,
        });

      if (itemError) throw itemError;

      toast.success("Order created successfully!");
      navigate('/checkout');
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error("Failed to create order. Please try again.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <span className="text-gray-600">Quantity:</span>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuantity(Math.max(minimumOrder, quantity - 1))}
            disabled={quantity <= minimumOrder}
          >
            -
          </Button>
          <span className="w-12 text-center">{quantity}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuantity(Math.min(stockQuantity, quantity + 1))}
            disabled={quantity >= stockQuantity}
          >
            +
          </Button>
        </div>
      </div>

      <div className="flex space-x-4">
        <Button
          className="flex-1"
          onClick={() => {
            toast.success("Added to cart successfully!");
          }}
        >
          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
        <Button
          variant="secondary"
          className="flex-1"
          onClick={handleBuyNow}
          disabled={stockQuantity < minimumOrder}
        >
          Buy Now
        </Button>
      </div>

      {stockQuantity < minimumOrder && (
        <p className="text-destructive text-sm">
          This product is currently out of stock
        </p>
      )}
    </div>
  );
};