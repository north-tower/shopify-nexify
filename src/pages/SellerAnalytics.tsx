
import { useState } from "react";
import { format, subDays, subMonths } from "date-fns";
import { 
  Bar, 
  Line, 
  BarChart, 
  LineChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart,
  Pie,
  Cell
} from "recharts";
import { useSellerInfo } from "@/hooks/seller/useSellerInfo";
import { useSalesData } from "@/hooks/seller/useSalesData";
import SellerLayout from "@/components/seller/SellerLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, Filter, RefreshCw } from "lucide-react";

const SellerAnalytics = () => {
  const { sellerId } = useSellerInfo();
  const [timeframe, setTimeframe] = useState("7days");
  const [chartType, setChartType] = useState("line");
  
  const {
    salesData,
    isLoadingSales,
    monthlySalesData,
    isLoadingMonthlySales,
    totalSales,
    totalOrders,
    categoryData,
    chartData,
    averageOrderValue
  } = useSalesData(sellerId);

  const handleDownloadReport = () => {
    // In a real app, this would generate a CSV/PDF report
    console.log("Downloading analytics report...");
    alert("Report download started");
  };

  const handleRefreshData = () => {
    window.location.reload();
  };

  // Calculate revenue trends
  const getRevenueTrend = () => {
    if (monthlySalesData.length < 2) return "neutral";
    
    const lastMonth = monthlySalesData[monthlySalesData.length - 1]?.amount || 0;
    const previousMonth = monthlySalesData[monthlySalesData.length - 2]?.amount || 0;
    
    if (lastMonth > previousMonth) return "up";
    if (lastMonth < previousMonth) return "down";
    return "neutral";
  };

  const revenueTrend = getRevenueTrend();
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <SellerLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground">
              Track your store performance and sales metrics.
            </p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button variant="outline" onClick={handleRefreshData}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button variant="outline" onClick={handleDownloadReport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KSh {totalSales.toLocaleString()}</div>
              <div className={`flex items-center text-xs mt-1 ${
                revenueTrend === "up" ? "text-green-500" : 
                revenueTrend === "down" ? "text-red-500" : ""
              }`}>
                {revenueTrend === "up" && "↑ "}
                {revenueTrend === "down" && "↓ "}
                {revenueTrend === "up" ? "Increasing" : 
                 revenueTrend === "down" ? "Decreasing" : "Stable"} trend
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <div className="text-xs text-muted-foreground mt-1">From all time</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg. Order Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KSh {averageOrderValue.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-1">Per transaction</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Conversion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.2%</div>
              <div className="text-xs text-green-500 mt-1">↑ 0.5% from last month</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="revenue" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="90days">Last 90 Days</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>

              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Chart Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="revenue" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Over Time</CardTitle>
                <CardDescription>
                  Your store's revenue trends over the selected time period
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                {isLoadingMonthlySales ? (
                  <div className="h-full flex items-center justify-center">
                    Loading revenue data...
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === "line" ? (
                      <LineChart data={monthlySalesData}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="name" />
                        <YAxis 
                          tickFormatter={(value) => `KSh ${value.toLocaleString()}`}
                        />
                        <Tooltip 
                          formatter={(value) => [`KSh ${Number(value).toLocaleString()}`, "Revenue"]}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="amount" 
                          name="Revenue" 
                          stroke="#8884d8" 
                          strokeWidth={2} 
                          dot={{ r: 4 }} 
                        />
                      </LineChart>
                    ) : (
                      <BarChart data={monthlySalesData}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="name" />
                        <YAxis 
                          tickFormatter={(value) => `KSh ${value.toLocaleString()}`}
                        />
                        <Tooltip 
                          formatter={(value) => [`KSh ${Number(value).toLocaleString()}`, "Revenue"]}
                        />
                        <Legend />
                        <Bar 
                          dataKey="amount" 
                          name="Revenue" 
                          fill="#8884d8" 
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Category</CardTitle>
                  <CardDescription>
                    Revenue distribution across product categories
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {categoryData.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                      No category data available
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`KSh ${Number(value).toLocaleString()}`, "Revenue"]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Selling Products</CardTitle>
                  <CardDescription>
                    Your best performing products by revenue
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingSales ? (
                    <div className="h-full flex items-center justify-center">
                      Loading product data...
                    </div>
                  ) : salesData.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                      No product data available
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {salesData.slice(0, 5).map((sale, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-muted flex items-center justify-center rounded">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium">{sale.products?.product_name || 'Unknown Product'}</p>
                              <p className="text-sm text-muted-foreground">SKU: {sale.products?.id || 'N/A'}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">KSh {sale.sale_amount?.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">Qty: {sale.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Orders Timeline</CardTitle>
                <CardDescription>Number of orders over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Orders timeline visualization would appear here
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Product Performance</CardTitle>
                <CardDescription>Performance metrics for your products</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Product performance visualization would appear here
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Customer Analytics</CardTitle>
                <CardDescription>Customer demographics and buying patterns</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Customer analytics visualization would appear here
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SellerLayout>
  );
};

export default SellerAnalytics;
