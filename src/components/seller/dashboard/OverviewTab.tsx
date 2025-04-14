
import SalesChart from "./SalesChart";
import CategoryPieChart from "./CategoryPieChart";
import QuickActions from "./QuickActions";
import AnalyticsOverview from "./AnalyticsOverview";
import EmptyState from "./EmptyState";
import { PackagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OverviewTabProps {
  chartData: Array<{ name: string; amount: number }>;
  categoryData: Array<{ name: string; value: number }>;
  monthlySalesData: Array<{ name: string; amount: number }>;
  isLoadingMonthlySales: boolean;
  onAddProduct: () => void;
  onManageOrders: () => void;
  onSettings: () => void;
}

const OverviewTab = ({
  chartData,
  categoryData,
  monthlySalesData,
  isLoadingMonthlySales,
  onAddProduct,
  onManageOrders,
  onSettings,
}: OverviewTabProps) => {
  const hasNoProducts = categoryData.length === 0 && chartData.length === 0;

  if (hasNoProducts) {
    return (
      <div className="grid place-items-center py-16">
        <EmptyState 
          icon={PackagePlus}
          title="No Products Yet"
          description="Add your first product to start selling and see your dashboard data."
          actionLabel="Add First Product"
          onAction={onAddProduct}
        />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Analytics overview chart */}
      <AnalyticsOverview 
        monthlySalesData={monthlySalesData} 
        isLoadingMonthlySales={isLoadingMonthlySales} 
      />
      
      {/* Recent sales chart */}
      <SalesChart chartData={chartData} />
      
      {/* Category distribution */}
      <CategoryPieChart categoryData={categoryData} />
      
      {/* Quick actions */}
      <QuickActions 
        onAddProduct={onAddProduct} 
        onManageOrders={onManageOrders} 
        onSettings={onSettings} 
      />
      
      <div className="flex items-center justify-center md:justify-start">
        <Button 
          onClick={onAddProduct}
          size="lg" 
          className="w-full md:w-auto"
        >
          <PackagePlus className="mr-2" />
          Add New Product
        </Button>
      </div>
    </div>
  );
};

export default OverviewTab;
