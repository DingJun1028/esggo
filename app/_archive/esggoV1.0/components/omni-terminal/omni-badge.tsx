"use client";

import { cn } from "@/lib/utils";

interface OmniBadgeProps {
    label?: string;
    children?: React.ReactNode;
    status?: "lethal" | "critical" | "optimal" | "info" | "neutral";
    className?: string;
    dot?: boolean;
}

export function OmniBadge({
    label,
    children,
    status = "neutral",
    className,
    dot = false,
}: OmniBadgeProps) {
    const getStyles = () => {
        switch (status) {
            case "lethal":
                return "bg-error text-white border-error";
            case "critical":
                return "bg-primary-gold text-white border-primary-gold";
            case "optimal":
                return "bg-primary-teal-start text-white border-primary-teal-start";
            case "info":
                return "bg-info text-white border-info";
            default:
                return "bg-surface-container text-on-surface-variant border-outline-variant";
        }
    };

    const getDotStyles = () => {
        return status === "neutral" ? "bg-primary-teal-start" : "bg-white";
    };

    return (
        <span
            role="status"
            aria-label={`Status: ${status}`}
            className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border transition-all duration-300",
                getStyles(),
                className
            )}
        >
            {dot && (
                <span className={cn("w-1 h-1 rounded-full animate-pulse", getDotStyles())} />
            )}
            {children || label}
        </span>
    );
}
