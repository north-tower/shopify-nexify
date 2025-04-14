
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table, TableHeader, TableRow, TableHead,
  TableBody, TableCell 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, XCircle, Truck, Package } from "lucide-react";

interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  price: number;
  total_price: number;
}

interface Order {
  id: number;
  order_number: string;
  created_at: string;
  order_status: string;
  payment_status: string;
  payment_method: string | null;
  total_amount: number;
  shipping_address: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  billing_address: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  items: OrderItem[];
}

interface OrderDetailsModalProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ 
  order, 
  open,
  onClose
}) => {
  if (!order) return null;

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <Clock className="mr-1 h-3 w-3" /> Pending
        </Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <Package className="mr-1 h-3 w-3" /> Processing
        </Badge>;
      case 'shipped':
        return <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
          <Truck className="mr-1 h-3 w-3" /> Shipped
        </Badge>;
      case 'delivered':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle2 className="mr-1 h-3 w-3" /> Delivered
        </Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <XCircle className="mr-1 h-3 w-3" /> Cancelled
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get payment status badge styling
  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Paid</Badge>;
      case 'unpaid':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Unpaid</Badge>;
      case 'refunded':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Refunded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Order Details - {order.order_number}</DialogTitle>
          <DialogDescription>
            Placed on {new Date(order.created_at).toLocaleString()}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
          <div className="space-y-2">
            <h3 className="font-medium text-sm">Status</h3>
            <div className="flex flex-col gap-2">
              <div>Order: {getStatusBadge(order.order_status)}</div>
              <div>Payment: {getPaymentBadge(order.payment_status)}</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium text-sm">Customer</h3>
            <p>
              {order.shipping_address.firstName} {order.shipping_address.lastName}<br />
              {order.shipping_address.phone}
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium text-sm">Shipping Address</h3>
            <p>
              {order.shipping_address.address}<br />
              {order.shipping_address.city}, {order.shipping_address.postalCode}<br />
              {order.shipping_address.country}
            </p>
          </div>
        </div>
        
        <div className="my-4">
          <h3 className="font-medium mb-2">Order Items</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.product_name}</TableCell>
                  <TableCell>KSh {item.price.toLocaleString()}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell className="text-right">KSh {item.total_price.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="flex justify-end border-t pt-4">
          <div className="space-y-1 text-right">
            <div className="text-sm text-gray-500">Total</div>
            <div className="text-lg font-bold">KSh {order.total_amount.toLocaleString()}</div>
            <div className="text-xs text-gray-500">
              via {order.payment_method || 'Not specified'}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
