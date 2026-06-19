"use client";

import { ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface OmniCardProps {
    children: ReactNode;
    title?: string;
    subtitle?: string;
    icon?: ReactNode;
    headerAction?: ReactNode;
    footer?: ReactNode;
    className?: string;
    variant?: "matte" | "bordered" | "feature";
    noPadding?: boolean;
    onClick?: () => void;
}

export function OmniCard({
    children,
    title,
    subtitle,
    icon,
    headerAction,
    footer,
    className,
    variant = "matte",
    noPadding = false,
    onClick,
}: OmniCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onClick}
            className={cn(
                "rounded-lg border border-outline-variant shadow-minimal transition-all duration-300",
                variant === "matte" && "bg-surface-container",
                variant === "bordered" && "bg-background",
                variant === "feature" && "bg-background border-l-4 border-l-primary",
                onClick && "cursor-pointer hover:shadow-lg hover:border-primary",
                className
            )}
        >
            {(title || icon || headerAction) && (
                <div className="px-8 py-6 border-b border-outline-variant flex justify-between items-center bg-background/50">
                    <div className="flex items-center gap-4">
                        {icon && <div className="text-on-surface-variant font-bold">{icon}</div>}
                        <div className="flex flex-col">
                            {title && (
                                <h3 className="text-sm font-black text-on-surface uppercase tracking-wider">
                                    {title}
                                </h3>
                            )}
                            {subtitle && (
                                <p className="text-on-surface-variant text-[9px] font-bold uppercase tracking-widest mt-0.5 opacity-60">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    </div>
                    {headerAction}
                </div>
            )}

            <div className={cn(noPadding ? "" : "p-8")}>
                {children}
            </div>

            {footer && (
                <div className="px-8 py-4 bg-surface-container/50 border-t border-outline-variant">
                    {footer}
                </div>
            )}
        </motion.div>
    );
}
