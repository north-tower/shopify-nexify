
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import EmptyState from "./EmptyState";

interface Sale {
  created_at: string;
  quantity: number;
  sale_amount: number;
  products: {
    product_name: string;
  } | null;
}

interface RecentOrdersTabProps {
  isLoading: boolean;
  salesData: Sale[] | null;
  onViewAllProducts: () => void;
}

const RecentOrdersTab = ({ isLoading, salesData, onViewAllProducts }: RecentOrdersTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <p>Loading order data...</p>
          </div>
        ) : salesData && salesData.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesData.slice(0, 10).map((sale, index) => (
                <TableRow key={index}>
                  <TableCell>{new Date(sale.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">
                    {sale.products?.product_name || "Product"}
                  </TableCell>
                  <TableCell>{sale.quantity}</TableCell>
                  <TableCell className="text-right">
                    ${Number(sale.sale_amount).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <EmptyState
            icon={ShoppingCart}
            title="No orders yet"
            description="When customers place orders, they will appear here"
            actionLabel="View your products"
            onAction={onViewAllProducts}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default RecentOrdersTab;
