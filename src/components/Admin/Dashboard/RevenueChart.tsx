"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

const chartData = [
  { name: 'SENIN', realisasi: 20, target: 40 },
  { name: 'SELASA', realisasi: 35, target: 50 },
  { name: 'RABU', realisasi: 65, target: 55 },
  { name: 'KAMIS', realisasi: 45, target: 52 },
  { name: 'JUMAT', realisasi: 55, target: 58 },
  { name: 'SABTU', realisasi: 80, target: 62 },
];

const chartConfig = {
  realisasi: {
    label: "Realisasi",
    color: "#1C2B1E",
  },
  target: {
    label: "Target",
    color: "#D4A574",
  },
} satisfies ChartConfig;

export function RevenueChart() {
  return (
    <Card className="shadow-sm border-gray-100 border-none sm:border-solid h-full flex flex-col">
      <CardHeader>
        <CardTitle className="font-bold text-lg text-ugo-sidebar">Tren Pendapatan & Utilisasi</CardTitle>
        <CardDescription>Statistik performa lapangan bulan ini</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-end">
        <ChartContainer config={chartConfig} className="h-[300px] w-full mt-auto">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 10,
              left: -20,
              right: 10,
              bottom: 0,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tick={{ fontSize: 12, fill: '#888' }}
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tick={{ fontSize: 12, fill: '#888' }}
            />
            <ChartTooltip 
              cursor={false} 
              content={<ChartTooltipContent className="bg-white rounded-xl shadow-lg border-gray-100" />} 
            />
            <ChartLegend content={<ChartLegendContent />} verticalAlign="top" align="right" />
            <Line
              name="Realisasi"
              dataKey="realisasi"
              type="monotone"
              stroke="var(--color-realisasi)"
              strokeWidth={3}
              dot={{ r: 4, fill: "white", stroke: "var(--color-realisasi)", strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
            <Line
              name="Target"
              dataKey="target"
              type="monotone"
              stroke="var(--color-target)"
              strokeWidth={3}
              dot={{ r: 4, fill: "white", stroke: "var(--color-target)", strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
