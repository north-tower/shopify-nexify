import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Navbar from "@/components/navbar/Navbar";
import { MinusIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Package, MapPin } from "lucide-react";

interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  country: string;
  saveInfo: boolean;
  emailOffers: boolean;
  useDifferentBilling: boolean;
}

const Checkout = () => {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [tipAmount, setTipAmount] = useState<number>(0);
  const [customTip, setCustomTip] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const shippingCost = 250;

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      country: "Kenya",
      saveInfo: true,
      emailOffers: true,
      useDifferentBilling: false,
    },
  });

  const useDifferentBilling = watch("useDifferentBilling");

  const handleTipSelection = (percentage: number) => {
    const baseAmount = getTotalPrice();
    setTipAmount(percentage);
    setCustomTip(Math.round(baseAmount * (percentage / 100)));
  };

  const handleCustomTipChange = (value: number) => {
    setCustomTip(value);
    setTipAmount(0);
  };

  const calculateTotal = () => {
    return getTotalPrice() + shippingCost + customTip;
  };

  const onSubmit = async (data) => {
    if (!session?.user) {
      toast.error("Please login to complete your order");
      return;
    }

    try {
      setIsSubmitting(true);

      const shippingAddress = {
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        city: data.city,
        postalCode: data.postalCode,
        country: data.country,
        phone: data.phone,
      };

      const billingAddress = data.useDifferentBilling 
        ? { ...shippingAddress }  
        : shippingAddress;

      const { data: userData, error: userError } = await supabase
        .from("tbl_user")
        .select("userid")
        .eq("email", session.user.email)
        .single();

      if (userError || !userData) {
        console.error("Error fetching numeric user ID:", userError);
        toast.error("Unable to get user info for order. Please contact support.");
        setIsSubmitting(false);
        return;
      }

      const numericUserId = userData.userid;

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: numericUserId, // numeric user id (number)
          order_number: `ORD-${Date.now()}`,
          total_amount: calculateTotal(),
          shipping_address: JSON.stringify(shippingAddress),
          billing_address: JSON.stringify(billingAddress),
          order_status: 'pending',
          payment_status: 'unpaid',
          payment_method: 'pending'
        })
        .select()
        .single();

      if (orderError) {
        console.error('Order creation error:', orderError);
        throw orderError;
      }

      const orderItems = items.map(item => ({
        order_id: orderData.id,
        product_id: item.id,
        product_name: item.title,
        sku: `SKU-${item.id}`,
        price: item.price,
        quantity: item.quantity,
        total_price: item.price * item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Order items creation error:', itemsError);
        throw itemsError;
      }

      clearCart();
      toast.success("Order placed successfully!");
      navigate('/');

    } catch (error) {
      console.error('Error creating order:', error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Contact</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email or mobile phone number</Label>
                  <Input
                    id="email"
                    type="text"
                    {...register("email")}
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="emailOffers" {...register("emailOffers")} />
                  <Label htmlFor="emailOffers">Email me with news and offers</Label>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Delivery</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      {...register("firstName")}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      {...register("lastName")}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    {...register("address")}
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      {...register("city")}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Postal code</Label>
                    <Input
                      id="postalCode"
                      {...register("postalCode")}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    {...register("phone")}
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="saveInfo" {...register("saveInfo")} />
                  <Label htmlFor="saveInfo">Save this information for next time</Label>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Shipping method</h2>
              <div className="border rounded p-4 flex justify-between items-center">
                <span>Matatu/Bus Sacco Delivery using 4NTE SACCO</span>
                <span className="font-semibold">KSh {shippingCost.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Payment</h2>
              <div className="border rounded p-4">
                <div className="flex justify-between items-center">
                  <span>Pesapal</span>
                  <div className="flex gap-2">
                    <img src="/visa.png" alt="Visa" className="h-6" />
                    <img src="/mastercard.png" alt="Mastercard" className="h-6" />
                    <img src="/amex.png" alt="American Express" className="h-6" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Billing address</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="sameAddress"
                    checked={!useDifferentBilling}
                    onChange={() => {}}
                    className="rounded-full"
                  />
                  <Label htmlFor="sameAddress">Same as shipping address</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="differentAddress"
                    {...register("useDifferentBilling")}
                    checked={useDifferentBilling}
                    className="rounded-full"
                  />
                  <Label htmlFor="differentAddress">Use a different billing address</Label>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Add tip</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  {[3, 5, 15].map((percentage) => (
                    <button
                      key={percentage}
                      onClick={() => handleTipSelection(percentage)}
                      className={`flex-1 p-4 rounded border ${
                        tipAmount === percentage
                          ? "border-primary bg-primary/10"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="text-center">
                        <div className="font-semibold">{percentage}%</div>
                        <div className="text-sm text-gray-600">
                          KSh {Math.round(getTotalPrice() * (percentage / 100)).toLocaleString()}
                        </div>
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={() => handleTipSelection(0)}
                    className={`flex-1 p-4 rounded border ${
                      tipAmount === 0 && customTip === 0
                        ? "border-primary bg-primary/10"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="text-center">None</div>
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label>Custom tip</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleCustomTipChange(Math.max(0, customTip - 50))}
                      >
                        <MinusIcon className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={customTip}
                        onChange={(e) => handleCustomTipChange(Number(e.target.value))}
                        className="text-center"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleCustomTipChange(customTip + 50)}
                      >
                        <PlusIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-6"
                    onClick={() => setCustomTip(0)}
                  >
                    Add tip
                  </Button>
                </div>
                <p className="text-sm text-gray-600">Thank you, we appreciate it.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium">{item.title}</h3>
                      <p className="text-sm text-gray-600">Size: 40</p>
                    </div>
                    <div className="text-sm font-semibold">
                      KSh {(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>KSh {getTotalPrice().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>KSh {shippingCost.toLocaleString()}</span>
                  </div>
                  {customTip > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Tip</span>
                      <span>KSh {customTip.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                    <span>Total</span>
                    <div className="text-right">
                      <div>KSh {calculateTotal().toLocaleString()}</div>
                      <div className="text-sm text-gray-600">
                        Including KSh {Math.round(calculateTotal() * 0.16).toLocaleString()} in taxes
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Pay now"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
