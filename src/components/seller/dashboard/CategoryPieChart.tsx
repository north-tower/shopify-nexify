
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartTooltip } from "@/components/ui/chart";
import { Package } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

interface CategoryData {
  name: string;
  value: number;
}

interface CategoryPieChartProps {
  categoryData: CategoryData[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD'];

const CategoryPieChart = ({ categoryData }: CategoryPieChartProps) => {
  return (
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
  );
};

export default CategoryPieChart;
