
import SalesChart from "./SalesChart";
import CategoryPieChart from "./CategoryPieChart";
import QuickActions from "./QuickActions";

interface OverviewTabProps {
  chartData: Array<{ name: string; amount: number }>;
  categoryData: Array<{ name: string; value: number }>;
  onAddProduct: () => void;
  onManageOrders: () => void;
  onSettings: () => void;
}

const OverviewTab = ({
  chartData,
  categoryData,
  onAddProduct,
  onManageOrders,
  onSettings,
}: OverviewTabProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <SalesChart chartData={chartData} />
      
      <CategoryPieChart categoryData={categoryData} />
      
      <QuickActions 
        onAddProduct={onAddProduct} 
        onManageOrders={onManageOrders} 
        onSettings={onSettings} 
      />
    </div>
  );
};

export default OverviewTab;
