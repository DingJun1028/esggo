import * as React from 'react';
import { ResponsiveContainer, TooltipProps } from 'recharts';

export const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  // Rudimentary wrapper
  <div ref={ref} className={`w-full ${className}`} {...props}>
    {children}
  </div>
));
ChartContainer.displayName = 'ChartContainer';

export const ChartTooltipContent = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">{label}</span>
            <span className="font-bold text-foreground">{data.value}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};
