
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface DashboardHeaderProps {
  sellerName: string;
  onAddProduct: () => void;
  onRefreshData: () => void;
}

const DashboardHeader = ({ sellerName, onAddProduct, onRefreshData }: DashboardHeaderProps) => {
  return (
    <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
      <div>
        <h1 className="text-3xl font-bold">Seller Dashboard</h1>
        <p className="text-gray-500">{sellerName || "Your Store"}</p>
      </div>
      
      <div className="mt-4 md:mt-0 flex gap-2">
        <Button 
          variant="outline" 
          onClick={onRefreshData}
        >
          Refresh Data
        </Button>
        <Button 
          className="flex items-center gap-2"
          onClick={onAddProduct}
        >
          <PlusCircle className="h-4 w-4" />
          Add Product
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
