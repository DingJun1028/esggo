import { cn } from "@/lib/utils";

export function Button({
  className,
  variant = "solid",
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "wireframe" | "gold";
}) {
  const baseStyles =
    "px-6 py-2.5 rounded-lg font-medium snappy-transition flex items-center justify-center gap-2 text-sm active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    solid:
      "bg-gradient-to-r from-primary-teal-start to-primary-teal-end text-white hover:brightness-110",
    wireframe:
      "bg-transparent border border-primary-teal-start text-primary-teal-start hover:bg-primary-teal-start/5",
    gold: "bg-primary-gold text-white hover:brightness-110",
  };

  return (
    <button className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}
