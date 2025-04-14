
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar
} from "recharts";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ChartBarIcon, LayoutGridIcon } from "lucide-react";

interface AnalyticsData {
  name: string;
  amount: number;
  month?: number;
  year?: number;
}

interface AnalyticsOverviewProps {
  monthlySalesData: AnalyticsData[];
  isLoadingMonthlySales: boolean;
}

const AnalyticsOverview = ({
  monthlySalesData,
  isLoadingMonthlySales,
}: AnalyticsOverviewProps) => {
  const [chartType, setChartType] = useState<"line" | "bar">("line");

  if (isLoadingMonthlySales) {
    return (
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Monthly Sales Trends</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <p className="text-muted-foreground">Loading sales data...</p>
        </CardContent>
      </Card>
    );
  }

  if (!monthlySalesData || monthlySalesData.length === 0) {
    return (
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Monthly Sales Trends</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] flex flex-col items-center justify-center">
          <ChartBarIcon className="h-16 w-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium">No sales data available</h3>
          <p className="text-sm text-muted-foreground">
            Start selling to see your monthly sales trends here
          </p>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (value: number) => `KSh ${value.toLocaleString()}`;
  
  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Monthly Sales Trends</CardTitle>
        <div className="flex items-center gap-2">
          <Select value={chartType} onValueChange={(value) => setChartType(value as "line" | "bar")}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Chart Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="line">Line Chart</SelectItem>
              <SelectItem value="bar">Bar Chart</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[400px]" config={{
          sales: {
            label: "Monthly Sales",
            color: "#2563eb"
          }
        }}>
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "line" ? (
              <LineChart data={monthlySalesData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" />
                <YAxis
                  tickFormatter={formatCurrency}
                />
                <Tooltip
                  formatter={(value) => [formatCurrency(value as number), "Sales"]}
                  contentStyle={{
                    backgroundColor: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: "0.5rem",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="amount"
                  name="sales"
                  stroke="var(--color-sales)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            ) : (
              <BarChart data={monthlySalesData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" />
                <YAxis
                  tickFormatter={formatCurrency}
                />
                <Tooltip
                  formatter={(value) => [formatCurrency(value as number), "Sales"]}
                  contentStyle={{
                    backgroundColor: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: "0.5rem",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="amount"
                  name="sales"
                  fill="var(--color-sales)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default AnalyticsOverview;
