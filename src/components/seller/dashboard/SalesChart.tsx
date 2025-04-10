
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface SalesChartData {
  name: string;
  amount: number;
}

interface SalesChartProps {
  chartData: SalesChartData[];
}

const SalesChart = ({ chartData }: SalesChartProps) => {
  return (
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
  );
};

export default SalesChart;
