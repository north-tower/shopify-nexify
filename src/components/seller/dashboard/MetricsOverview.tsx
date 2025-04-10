
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import DashboardCard from "./DashboardCard";

interface MetricsOverviewProps {
  totalSales: number;
  totalOrders: number;
  productsCount: number | null;
  averageOrderValue: number;
  onViewAllProducts: () => void;
}

const MetricsOverview = ({
  totalSales,
  totalOrders,
  productsCount,
  averageOrderValue,
  onViewAllProducts,
}: MetricsOverviewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <DashboardCard
        title="Total Sales"
        value={`$${totalSales.toFixed(2)}`}
        icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
      />

      <DashboardCard
        title="Total Orders"
        value={totalOrders}
        icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
      />

      <DashboardCard
        title="Products"
        value={productsCount || 0}
        icon={<Package className="h-4 w-4 text-muted-foreground" />}
        action={
          productsCount ? {
            label: "View all",
            onClick: onViewAllProducts,
          } : undefined
        }
      />

      <DashboardCard
        title="Avg. Order Value"
        value={`$${averageOrderValue.toFixed(2)}`}
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
      />
    </div>
  );
};

export default MetricsOverview;
