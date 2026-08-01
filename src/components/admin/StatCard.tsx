import React from "react";
import { ArrowUp, ArrowDown, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: { value: number; isPositive: boolean };
  iconColor?: string;
  iconBg?: string;
}

export default function StatCard({
  title, value, icon: Icon, trend, iconColor = "text-primary", iconBg = "bg-primary/10",
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            <p className="text-2xl font-bold mt-1.5">{value}</p>
            {trend && (
              <div
                className={cn(
                  "flex items-center gap-1 text-xs font-medium mt-2",
                  trend.isPositive ? "text-green-600" : "text-red-600"
                )}
              >
                {trend.isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {Math.abs(trend.value)}% from last month
              </div>
            )}
          </div>
          <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0", iconBg)}>
            <Icon className={cn("h-5 w-5", iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
