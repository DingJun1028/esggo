"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * OmniButton - ESG GO Sustainability Edition
 * 善向永續版標準按鈕：去發光、高對比、機械位移反饋。
 */

type ButtonVariant = "solid" | "outline" | "gold" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface OmniButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  isLoading?: boolean;
}

export const OmniButton = React.forwardRef<HTMLButtonElement, OmniButtonProps>(
  ({ className, variant = "solid", size = "md", children, isLoading, ...props }, ref) => {
    
    // 基礎樣式與變體映射
    const variants = {
      solid: "btn-teal-gradient text-white shadow-sm",
      outline: "bg-transparent border border-[var(--theme-primary)] text-[var(--theme-primary)] hover:bg-[var(--theme-primary-muted)]",
      gold: "bg-[var(--theme-accent)] text-white shadow-sm",
      ghost: "bg-transparent hover:bg-slate-100 text-[var(--theme-text-sub)]",
      danger: "bg-[var(--color-lethal)] text-white shadow-sm",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs font-medium",
      md: "px-5 py-2.5 text-sm font-semibold",
      lg: "px-8 py-4 text-base font-bold",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ translateY: -1 }}
        whileTap={{ translateY: 1, scale: 0.98 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className={cn(
          "relative overflow-hidden inline-flex items-center justify-center rounded-md transition-colors",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>處理中...</span>
          </div>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

OmniButton.displayName = "OmniButton";
