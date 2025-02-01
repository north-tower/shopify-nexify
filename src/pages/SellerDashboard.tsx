import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChartContainer, ChartLegend, ChartTooltip } from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Package, DollarSign, ShoppingCart, Users } from "lucide-react";

const SellerDashboard = () => {
  const [sellerId, setSellerId] = useState<string | null>(null);

  // Fetch seller ID for the current user
  useEffect(() => {
    const fetchSellerId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('sellers')
          .select('id')
          .eq('user_id', user.id)
          .single();
        if (data) {
          setSellerId(data.id);
        }
      }
    };
    fetchSellerId();
  }, []);

  // Fetch sales data
  const { data: salesData } = useQuery({
    queryKey: ['sales', sellerId],
    queryFn: async () => {
      if (!sellerId) return null;
      const { data } = await supabase
        .from('sales')
        .select(`
          sale_amount,
          quantity,
          created_at,
          products (
            product_name
          )
        `)
        .eq('seller_id', sellerId)
        .order('created_at', { ascending: false });
      return data;
    },
    enabled: !!sellerId
  });

  // Fetch products count
  const { data: productsCount } = useQuery({
    queryKey: ['products-count', sellerId],
    queryFn: async () => {
      if (!sellerId) return 0;
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('seller_id', sellerId);
      return count || 0;
    },
    enabled: !!sellerId
  });

  // Calculate metrics
  const totalSales = salesData?.reduce((sum, sale) => sum + Number(sale.sale_amount), 0) || 0;
  const totalOrders = salesData?.length || 0;
  const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

  // Format sales data for chart
  const chartData = salesData?.slice(0, 7).map(sale => ({
    name: new Date(sale.created_at).toLocaleDateString(),
    amount: Number(sale.sale_amount)
  })).reverse() || [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Seller Dashboard</h1>
      
      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSales.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productsCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageOrderValue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Chart */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer className="h-[300px]" config={{
            sales: {
              label: "Sales",
              color: "#2563eb"
            }
          }}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Bar
                dataKey="amount"
                name="sales"
                fill="var(--color-sales)"
                radius={[4, 4, 0, 0]}
              />
              <ChartTooltip />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerDashboard;