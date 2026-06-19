import { cn } from "@/lib/utils";

export function GlassCard({
  className,
  variant = "base",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { variant?: "base" | "liquid" }) {
  return (
    <div
      className={cn(
        "rounded-lg overflow-hidden transition-all duration-300",
        variant === "base" && "bg-white shadow-minimal",
        variant === "liquid" && "stitch-glass",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

