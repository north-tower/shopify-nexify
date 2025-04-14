
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Package,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  Truck
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Table, TableHeader, TableRow, TableHead,
  TableBody, TableCell 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import SellerLayout from "@/components/seller/SellerLayout";

// Type definition for orders
interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  price: number;
  total_price: number;
}

// Define the shape of shipping address
interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  country: string;
}

interface Order {
  id: number;
  order_number: string;
  created_at: string;
  order_status: string;
  payment_status: string;
  total_amount: number;
  shipping_address: ShippingAddress;
  items: OrderItem[];
}

const SellerOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  // Fetch orders for the current seller
  const { data: orders, isLoading, refetch } = useQuery({
    queryKey: ["sellerOrders"],
    queryFn: async () => {
      // Get the current user's session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("No active session");
      }

      // Get seller ID for the current user
      const { data: seller } = await supabase
        .from('sellers')
        .select('id')
        .eq('user_id', session.user.id)
        .single();

      if (!seller) {
        throw new Error("Seller profile not found");
      }

      // Get all sales for this seller
      const { data: sales, error: salesError } = await supabase
        .from('sales')
        .select(`
          order_id,
          product_id,
          quantity,
          sale_amount,
          products (
            product_name
          )
        `)
        .eq('seller_id', seller.id)
        .order('created_at', { ascending: false });

      if (salesError) throw salesError;

      // Group sales by order_id
      const orderIds = [...new Set(sales.map(sale => sale.order_id))];
      
      // Get order details for these order_ids
      const { data: orderDetails, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .in('id', orderIds)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Map orders to include their items
      const ordersWithItems = orderDetails.map(order => {
        const orderItems = sales
          .filter(sale => sale.order_id === order.id)
          .map(sale => ({
            id: sale.product_id,
            product_name: sale.products?.product_name || 'Unknown Product',
            quantity: sale.quantity,
            price: sale.sale_amount / sale.quantity,
            total_price: sale.sale_amount
          }));
          
        return {
          ...order,
          items: orderItems,
          // Properly cast shipping_address from Json to ShippingAddress type
          shipping_address: order.shipping_address as unknown as ShippingAddress
        };
      });

      return ordersWithItems;
    }
  });

  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      setIsUpdating(true);
      
      const { error } = await supabase
        .from('orders')
        .update({ order_status: status })
        .eq('id', orderId);
      
      if (error) throw error;
      
      toast.success(`Order status updated to ${status}`);
      refetch();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

  // Filter orders based on search term and status filter
  const filteredOrders = orders?.filter(order => {
    const matchesSearch = 
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => 
        item.product_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesStatusFilter = 
      statusFilter === "all" || 
      order.order_status === statusFilter;
    
    return matchesSearch && matchesStatusFilter;
  }) || [];

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

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
    <SellerLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">Orders Management</h1>
            <p className="text-gray-500">View and manage customer orders for your products</p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <Input 
                  placeholder="Search by order number or product"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-52">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <p>Loading orders...</p>
              </div>
            ) : orders?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Package className="h-16 w-16 text-gray-300" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No orders yet</h3>
                <p className="mt-1 text-sm text-gray-500">Orders will appear here when customers purchase your products.</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order #</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Products</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.order_number}</TableCell>
                          <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {order.shipping_address.firstName} {order.shipping_address.lastName}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{order.items.length} item(s)</span>
                              <span className="text-xs text-gray-500">
                                {order.items.map(item => item.product_name).join(", ")}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>KSh {order.total_amount.toLocaleString()}</TableCell>
                          <TableCell>{getStatusBadge(order.order_status)}</TableCell>
                          <TableCell>{getPaymentBadge(order.payment_status)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  Update status
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem 
                                  disabled={isUpdating || order.order_status === 'pending'} 
                                  onClick={() => updateOrderStatus(order.id, 'pending')}
                                >
                                  Set as Pending
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  disabled={isUpdating || order.order_status === 'processing'} 
                                  onClick={() => updateOrderStatus(order.id, 'processing')}
                                >
                                  Set as Processing
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  disabled={isUpdating || order.order_status === 'shipped'} 
                                  onClick={() => updateOrderStatus(order.id, 'shipped')}
                                >
                                  Set as Shipped
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  disabled={isUpdating || order.order_status === 'delivered'} 
                                  onClick={() => updateOrderStatus(order.id, 'delivered')}
                                >
                                  Set as Delivered
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  disabled={isUpdating || order.order_status === 'cancelled'} 
                                  onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                >
                                  Set as Cancelled
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-between items-center p-4">
                    <p className="text-sm text-gray-500">
                      Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length} orders
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </SellerLayout>
  );
};

export default SellerOrders;
