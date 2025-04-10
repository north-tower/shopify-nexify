
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChartContainer, ChartLegend, ChartTooltip } from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Package, DollarSign, ShoppingCart, TrendingUp, Users, LayoutDashboard, Settings, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";

const SellerDashboard = () => {
  const [sellerId, setSellerId] = useState<string | null>(null);
  const [sellerName, setSellerName] = useState("");

  // Fetch seller info for the current user
  useEffect(() => {
    const fetchSellerInfo = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('sellers')
          .select('id, business_name')
          .eq('user_id', user.id)
          .single();
        if (data) {
          setSellerId(data.id);
          setSellerName(data.business_name);
        }
      }
    };
    fetchSellerInfo();
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold">Seller Dashboard</h1>
            <p className="text-gray-500">{sellerName || "Your Store"}</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex gap-2">
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Product
            </Button>
          </div>
        </div>
        
        {/* Seller Navigation */}
        <NavigationMenu className="mb-6">
          <NavigationMenuList className="border rounded-lg bg-white shadow-sm">
            <NavigationMenuItem>
              <Link to="/seller/dashboard">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/seller/products">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <Package className="h-4 w-4 mr-2" />
                  Products
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/seller/orders">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Orders
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/seller/analytics">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Analytics
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/seller/settings">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      
        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="recent-orders">Recent Orders</TabsTrigger>
            <TabsTrigger value="top-products">Top Products</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
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
                  <ResponsiveContainer width="100%" height="100%">
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
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="recent-orders">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {salesData && salesData.length > 0 ? (
                  <div className="space-y-4">
                    {salesData.slice(0, 5).map((sale, index) => (
                      <div key={index} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <p className="font-medium">{sale.products?.product_name || "Product"}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(sale.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${Number(sale.sale_amount).toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">Qty: {sale.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">No recent orders to display</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="top-products">
            <Card>
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-4">Product performance data coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SellerDashboard;
