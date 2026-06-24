import { CartesianGrid, Area, AreaChart, XAxis, YAxis } from "recharts";
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
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";

interface RevenueTrendItem {
  name: string;
  realisasi: number;
}

interface RevenueChartProps {
  data: RevenueTrendItem[];
  loading: boolean;
}

const chartConfig = {
  realisasi: {
    label: "Realisasi",
    color: "#2D6A4F", 
  },
} satisfies ChartConfig;

export function RevenueChart({ data, loading }: RevenueChartProps) {
  return (
    <Card className="shadow-sm border-gray-100 border-none sm:border-solid flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-bold text-lg text-ugo-sidebar">Tren Pendapatan & Utilisasi</CardTitle>
          <CardDescription>Statistik performa lapangan minggu ini</CardDescription>
        </div>
        <Link 
          href="/admin/laporan" 
          className="text-sm font-medium text-ugo-sidebar hover:text-opacity-80 flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-lg transition-colors"
        >
          Lihat Selengkapnya
          <ArrowRight className="w-4 h-4" />
        </Link>
      </CardHeader>
      <CardContent className="flex flex-col pt-0">
        {loading ? (
          <div className="flex justify-center items-center h-[300px]">
            <Loader2 className="w-8 h-8 animate-spin text-[#2D6A4F]" />
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <AreaChart
              accessibilityLayer
              data={data}
              margin={{
                top: 10,
                left: -20,
                right: 10,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="colorRealisasi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-realisasi)" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="var(--color-realisasi)" stopOpacity={0}/>
                </linearGradient>
              </defs>
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
              <Area
                name="Realisasi"
                dataKey="realisasi"
                type="monotone"
                stroke="var(--color-realisasi)"
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorRealisasi)"
                dot={{ r: 5, fill: "white", stroke: "var(--color-realisasi)", strokeWidth: 2 }}
                activeDot={{ r: 7, fill: "var(--color-realisasi)", stroke: "white", strokeWidth: 2 }}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
