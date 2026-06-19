"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function ScrollArea({
    className,
    children,
    orientation = "vertical",
    ...props
}: React.HTMLAttributes<HTMLDivElement> & {
    orientation?: "vertical" | "horizontal";
}) {
    return (
        <div
            className={cn(
                "relative overflow-hidden group/scroll",
                orientation === "vertical" ? "h-full overflow-y-auto" : "w-full overflow-x-auto",
                "custom-scrollbar", // Assumes custom CSS scrollbar is defined or uses standard ones
                className
            )}
            {...props}
        >
            <div className="h-full w-full">
                {children}
            </div>

            {/* Scrollbar decorations can be added here if needed to mimic shadcn/radix */}
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(0, 0, 0, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(0, 0, 0, 0.2);
                }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </div>
    );
}

ScrollArea.displayName = "ScrollArea";
