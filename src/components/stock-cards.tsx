"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import { useState } from "react";
import { StockDetail } from "./stock-detail";

export interface Stock {
  symbol: string;
  name: string;
  change: string;
  data: number[];
  trend: "up" | "down";
  price: number;
  marketCap: string;
  volume: string;
  pe: string | number;
  weekRange: {
    low: number;
    high: number;
  };
}

const placeholderInvestments: Stock[] = [
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank",
    change: "+1.2%",
    data: [40, 35, 45, 30, 35, 40],
    trend: "up",
    price: 1623.45,
    marketCap: "12.3L Cr",
    volume: "8.2L",
    pe: 21.5,
    weekRange: { low: 1432.45, high: 1778.89 },
  },
  {
    symbol: "RELIANCE",
    name: "Reliance Industries",
    change: "-0.8%",
    data: [45, 40, 35, 30, 25, 20],
    trend: "down",
    price: 2458.75,
    marketCap: "16.7L Cr",
    volume: "12.4L",
    pe: 28.7,
    weekRange: { low: 2155.98, high: 2698.23 },
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Services",
    change: "+2.5%",
    data: [20, 25, 35, 45, 40, 50],
    trend: "up",
    price: 3542.60,
    marketCap: "13.2L Cr",
    volume: "9.8L",
    pe: 25.3,
    weekRange: { low: 3122.23, high: 3755.89 },
  },
  {
    symbol: "INFY",
    name: "Infosys",
    change: "-0.5%",
    data: [40, 35, 45, 35, 40, 35],
    trend: "down",
    price: 1534.90,
    marketCap: "6.35L Cr",
    volume: "7.5L",
    pe: 24.7,
    weekRange: { low: 1289.45, high: 1678.12 },
  },
  {
    symbol: "BHARTIARTL",
    name: "Bharti Airtel",
    change: "+1.9%",
    data: [45, 40, 35, 30, 45, 40],
    trend: "up",
    price: 945.20,
    marketCap: "5.28L Cr",
    volume: "10.1L",
    pe: 32.8,
    weekRange: { low: 823.45, high: 1068.92 },
  },
];

interface StockCardsProps {
  data?: {
    name: string;
    originalName: string;
    value: number;
    percentage: number;
    progress: string;
  }[];
}

export function StockCards({ data = [] }: StockCardsProps) {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {placeholderInvestments.map((stock) => {
          const investmentData = data?.find(
            (d) => d.originalName === stock.symbol
          );

          return (
            <Card
              key={stock.symbol}
              className="cursor-pointer transition-colors hover:bg-muted/50"
              onClick={() => setSelectedStock(stock)}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    {stock.symbol}
                  </div>
                  <div className="font-medium">
                    {investmentData ? investmentData.name : stock.name}
                  </div>
                  <div className="h-[60px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={stock.data.map((value) => ({ value }))}>
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke={
                            stock.trend === "up"
                              ? "hsl(var(--chart-2))"
                              : "hsl(var(--destructive))"
                          }
                          strokeWidth={1.5}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                      stock.trend === "up"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {investmentData
                      ? `₹${(investmentData.value / 1000).toFixed(0)}K`
                      : "₹0.00"}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Sheet
        open={selectedStock !== null}
        onOpenChange={() => setSelectedStock(null)}
      >
        <SheetContent side="right" className="w-full sm:w-[540px]">
          {selectedStock && <StockDetail stock={selectedStock} />}
        </SheetContent>
      </Sheet>
    </>
  );
}
