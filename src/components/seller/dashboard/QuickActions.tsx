
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Settings, ShoppingCart } from "lucide-react";

interface QuickActionsProps {
  onAddProduct: () => void;
  onManageOrders: () => void;
  onSettings: () => void;
}

const QuickActions = ({ onAddProduct, onManageOrders, onSettings }: QuickActionsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <Button onClick={onAddProduct} className="w-full justify-start">
            <PlusCircle className="mr-2 h-4 w-4" /> 
            Add New Product
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={onManageOrders}>
            <ShoppingCart className="mr-2 h-4 w-4" /> 
            Manage Orders
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={onSettings}>
            <Settings className="mr-2 h-4 w-4" /> 
            Store Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
