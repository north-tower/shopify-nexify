
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SellerLayout from "@/components/seller/SellerLayout";
import DashboardHeader from "@/components/seller/dashboard/DashboardHeader";
import MetricsOverview from "@/components/seller/dashboard/MetricsOverview";
import RecentOrdersTab from "@/components/seller/dashboard/RecentOrdersTab";
import TopProductsTab from "@/components/seller/dashboard/TopProductsTab";
import OverviewTab from "@/components/seller/dashboard/OverviewTab";
import { useSellerInfo } from "@/hooks/seller/useSellerInfo";
import { useSalesData } from "@/hooks/seller/useSalesData";

const SellerDashboard = () => {
  const navigate = useNavigate();
  const { sellerId, sellerName, refreshData } = useSellerInfo();
  const {
    salesData,
    isLoadingSales,
    productsCount,
    topProducts,
    isLoadingTopProducts,
    monthlySalesData,
    isLoadingMonthlySales,
    totalSales,
    totalOrders,
    averageOrderValue,
    chartData,
    categoryData
  } = useSalesData(sellerId);

  const handleAddProductClick = () => {
    navigate('/seller/add-product');
  };

  const handleViewAllProducts = () => {
    navigate('/seller/products');
  };

  const handleManageOrders = () => {
    navigate("/seller/orders");
  };

  const handleSettings = () => {
    navigate("/seller/settings");
  };

  return (
    <SellerLayout>
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <DashboardHeader 
          sellerName={sellerName}
          onAddProduct={handleAddProductClick}
          onRefreshData={refreshData}
        />
        
        <MetricsOverview 
          totalSales={totalSales}
          totalOrders={totalOrders}
          productsCount={productsCount}
          averageOrderValue={averageOrderValue}
          onViewAllProducts={handleViewAllProducts}
        />

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="recent-orders">Recent Orders</TabsTrigger>
            <TabsTrigger value="top-products">Top Products</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <OverviewTab 
              chartData={chartData}
              categoryData={categoryData}
              monthlySalesData={monthlySalesData}
              isLoadingMonthlySales={isLoadingMonthlySales}
              onAddProduct={handleAddProductClick}
              onManageOrders={handleManageOrders}
              onSettings={handleSettings}
            />
          </TabsContent>
          
          <TabsContent value="recent-orders">
            <RecentOrdersTab 
              isLoading={isLoadingSales}
              salesData={salesData}
              onViewAllProducts={handleViewAllProducts}
            />
          </TabsContent>
          
          <TabsContent value="top-products">
            <TopProductsTab 
              isLoading={isLoadingTopProducts}
              topProducts={topProducts}
              onAddProduct={handleAddProductClick}
            />
          </TabsContent>
        </Tabs>
      </div>
    </SellerLayout>
  );
};

export default SellerDashboard;
