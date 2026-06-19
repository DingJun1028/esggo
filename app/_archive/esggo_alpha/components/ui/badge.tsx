import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'optimal' | 'danger' | 'warning'
  styleType?: 'solid' | 'soft'
}

function Badge({
  className,
  variant = "default",
  styleType = "soft",
  ...props
}: BadgeProps) {
  const variants = {
    default: styleType === 'soft' ? "bg-slate-100 text-slate-800" : "bg-slate-900 text-white",
    outline: "border border-slate-200 text-slate-600 bg-transparent",
    optimal: styleType === 'soft' ? "bg-[#009E9D]/10 text-[#009E9D] border border-[#009E9D]/20" : "bg-[#009E9D] text-white",
    danger: styleType === 'soft' ? "bg-rose-100 text-rose-700 border border-rose-200" : "bg-rose-600 text-white",
    warning: styleType === 'soft' ? "bg-amber-100 text-amber-700 border border-amber-200" : "bg-amber-500 text-white"
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
