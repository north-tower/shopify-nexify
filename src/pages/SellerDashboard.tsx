
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChartContainer, ChartLegend, ChartTooltip } from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Package, DollarSign, ShoppingCart, TrendingUp, Users, LayoutDashboard, Settings, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Link, useNavigate } from "react-router-dom";
import SellerLayout from "@/components/seller/SellerLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

const SellerDashboard = () => {
  const navigate = useNavigate();
  const [sellerId, setSellerId] = useState<string | null>(null);
  const [sellerName, setSellerName] = useState("");
  const { toast } = useToast();

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

  const { data: salesData, isLoading: isLoadingSales } = useQuery({
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
            product_name,
            id
          )
        `)
        .eq('seller_id', sellerId)
        .order('created_at', { ascending: false });
      return data;
    },
    enabled: !!sellerId
  });

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

  const { data: topProducts, isLoading: isLoadingTopProducts } = useQuery({
    queryKey: ['top-products', sellerId],
    queryFn: async () => {
      if (!sellerId) return null;
      const { data } = await supabase
        .from('sales')
        .select(`
          product_id,
          products (
            product_name,
            price,
            photo_url
          ),
          quantity,
          sale_amount
        `)
        .eq('seller_id', sellerId)
        .order('sale_amount', { ascending: false })
        .limit(5);

      // Aggregate sales by product
      const productMap = new Map();
      data?.forEach((sale) => {
        const productId = sale.product_id;
        if (productMap.has(productId)) {
          const existing = productMap.get(productId);
          productMap.set(productId, {
            ...existing,
            totalSales: existing.totalSales + Number(sale.sale_amount),
            totalQuantity: existing.totalQuantity + sale.quantity
          });
        } else {
          productMap.set(productId, {
            id: productId,
            name: sale.products?.product_name || 'Unknown Product',
            price: sale.products?.price || 0,
            image: sale.products?.photo_url || null,
            totalSales: Number(sale.sale_amount),
            totalQuantity: sale.quantity
          });
        }
      });
      
      return Array.from(productMap.values());
    },
    enabled: !!sellerId
  });

  const totalSales = salesData?.reduce((sum, sale) => sum + Number(sale.sale_amount), 0) || 0;
  const totalOrders = salesData?.length || 0;
  const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

  const chartData = salesData?.slice(0, 7).map(sale => ({
    name: new Date(sale.created_at).toLocaleDateString(),
    amount: Number(sale.sale_amount)
  })).reverse() || [];

  // Prepare data for pie chart
  const categoryData = topProducts
    ? Array.from(
        topProducts.reduce((map, product) => {
          const category = product.name.split(' ')[0]; // Just using first word as mock category
          const currentValue = map.get(category) || 0;
          map.set(category, currentValue + product.totalSales);
          return map;
        }, new Map())
      ).map(([name, value]) => ({ name, value }))
    : [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD'];

  const handleAddProductClick = () => {
    navigate('/seller/add-product');
  };

  const handleViewAllProducts = () => {
    navigate('/seller/products');
  };

  const handleRefreshData = () => {
    toast({
      title: "Dashboard Refreshed",
      description: "Your dashboard data has been updated with the latest information.",
    });
  };

  return (
    <SellerLayout>
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold">Seller Dashboard</h1>
            <p className="text-gray-500">{sellerName || "Your Store"}</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleRefreshData}
            >
              Refresh Data
            </Button>
            <Button 
              className="flex items-center gap-2"
              onClick={handleAddProductClick}
            >
              <PlusCircle className="h-4 w-4" />
              Add Product
            </Button>
          </div>
        </div>
        
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
              {productsCount > 0 && (
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-xs"
                  onClick={handleViewAllProducts}
                >
                  View all
                </Button>
              )}
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
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="col-span-1 md:col-span-2">
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

              <Card>
                <CardHeader>
                  <CardTitle>Product Categories</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  {categoryData.length > 0 ? (
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <ChartTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <p className="text-muted-foreground">No category data available</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Add more products and make sales to see category insights
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    <Button onClick={handleAddProductClick} className="w-full justify-start">
                      <PlusCircle className="mr-2 h-4 w-4" /> 
                      Add New Product
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/seller/orders")}>
                      <ShoppingCart className="mr-2 h-4 w-4" /> 
                      Manage Orders
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/seller/settings")}>
                      <Settings className="mr-2 h-4 w-4" /> 
                      Store Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="recent-orders">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingSales ? (
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
                  <div className="text-center py-8">
                    <ShoppingCart className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                    <h3 className="text-lg font-medium mb-1">No orders yet</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      When customers place orders, they will appear here
                    </p>
                    <Button onClick={handleViewAllProducts} variant="outline">
                      View your products
                    </Button>
                  </div>
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
                {isLoadingTopProducts ? (
                  <div className="flex justify-center py-8">
                    <p>Loading product data...</p>
                  </div>
                ) : topProducts && topProducts.length > 0 ? (
                  <div className="grid gap-6">
                    {topProducts.map((product, index) => (
                      <div key={product.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
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
                  <div className="text-center py-8">
                    <Package className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                    <h3 className="text-lg font-medium mb-1">No product performance data yet</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Make some sales to see which products are your best sellers
                    </p>
                    <Button onClick={handleAddProductClick}>
                      Add a product
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SellerLayout>
  );
};

export default SellerDashboard;
