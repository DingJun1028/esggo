import { cn } from "@/lib/utils";

export type BadgeVariant = "lethal" | "critical" | "optimal" | "primary" | "outline";
export type BadgeStyle = "solid" | "soft" | "sovereign";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  styleType?: BadgeStyle;
}

export function Badge({
  className,
  variant = "optimal",
  styleType = "solid",
  children,
  ...props
}: BadgeProps) {
  const variants: Record<BadgeVariant, Record<BadgeStyle, string>> = {
    lethal: {
      solid: "bg-lethal text-white",
      soft: "bg-lethal/15 text-lethal",
      sovereign: "bg-white text-lethal border border-lethal/20 shadow-sm",
    },
    critical: {
      solid: "bg-critical text-white",
      soft: "bg-critical/15 text-critical",
      sovereign: "bg-white text-critical border border-critical/20 shadow-sm",
    },
    optimal: {
      solid: "bg-optimal text-white",
      soft: "bg-optimal/15 text-optimal",
      sovereign: "bg-white text-emerald-600 border border-emerald-500/20 shadow-sm",
    },
    primary: {
      solid: "bg-primary-teal-start text-white",
      soft: "bg-primary-teal-start/15 text-primary-teal-start",
      sovereign: "bg-white text-primary-teal-start border border-primary-teal-start/20 shadow-sm",
    },
    outline: {
      solid: "border border-current",
      soft: "border border-emerald-500/30 text-emerald-600 bg-emerald-500/10",
      sovereign: "bg-black text-white border border-white/20",
    },
  };

  return (
    <span
      className={cn(
        "px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest transition-colors duration-200",
        variants[variant][styleType],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
