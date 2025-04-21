
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

      // Use user.id as string (UUID) directly, don't convert to numeric ID
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id, // use string UUID user id
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
    <div className="space-y-8 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-primary/10 animate-fade-in [animation-delay:200ms]">
      <div className="flex items-center space-x-6">
        <span className="text-gray-700 dark:text-gray-300 font-medium">Quantity:</span>
        <div className="flex items-center space-x-2 bg-purple-50/80 dark:bg-gray-900/80 backdrop-blur-sm p-1.5 rounded-lg border border-primary/10 shadow-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setQuantity(Math.max(minimumOrder, quantity - 1))}
            disabled={quantity <= minimumOrder}
            className="hover:bg-purple-100 dark:hover:bg-gray-800 transition-colors"
          >
            -
          </Button>
          <span className="w-12 text-center font-medium">{quantity}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setQuantity(Math.min(stockQuantity, quantity + 1))}
            disabled={quantity >= stockQuantity}
            className="hover:bg-purple-100 dark:hover:bg-gray-800 transition-colors"
          >
            +
          </Button>
        </div>
      </div>

      <div className="flex space-x-4">
        <Button
          className="flex-1 shadow-lg shadow-primary/20 hover:shadow-primary/10 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
          onClick={() => {
            toast.success("Added to cart successfully!");
          }}
        >
          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
        <Button
          variant="secondary"
          className="flex-1 shadow-lg shadow-secondary/20 hover:shadow-secondary/10 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-r from-secondary/80 to-primary/80 hover:from-secondary/70 hover:to-primary/70 text-white"
          onClick={handleBuyNow}
          disabled={stockQuantity < minimumOrder}
        >
          Buy Now
        </Button>
      </div>

      {stockQuantity < minimumOrder && (
        <div className="animate-fade-in">
          <p className="text-destructive text-sm bg-destructive/10 p-4 rounded-lg backdrop-blur-sm border border-destructive/20">
            This product is currently out of stock
          </p>
        </div>
      )}
    </div>
  );
};
