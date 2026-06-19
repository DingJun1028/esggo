"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface OmniTableProps<T> {
    columns: {
        header: string;
        accessorKey?: keyof T;
        cell?: (value: unknown, item: T) => ReactNode;
        className?: string;
    }[];
    data: T[];
    isLoading?: boolean;
    footer?: ReactNode;
    className?: string;
    onRowClick?: (item: T) => void;
}

export function OmniTable<T>({
    columns,
    data,
    isLoading,
    footer,
    className,
    onRowClick,
}: OmniTableProps<T>) {
    return (
        <div className={cn("overflow-hidden border border-outline-variant rounded-lg bg-white", className)}>
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-surface-container border-b border-outline-variant">
                        {(columns || []).map((col, i: number) => (
                            <th
                                key={i}
                                className={cn(
                                    "px-8 py-4 text-[10px] uppercase font-black tracking-[0.2em] text-on-surface-variant",
                                    col.className
                                )}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant text-[11px] font-bold">
                    {isLoading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <tr key={`loading-${i}`} className="animate-pulse">
                                {(columns || []).map((col, j) => (
                                    <td key={`loading-cell-${j}`} className={cn("px-8 py-5", col.className)}>
                                        <div className="h-4 bg-surface-container rounded w-3/4" />
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (data || []).length === 0 ? (
                        <tr>
                            <td colSpan={(columns || []).length} className="px-8 py-20 text-center text-on-surface-variant/40 font-black uppercase tracking-[0.2em]">
                                No transmissions found in registry
                            </td>
                        </tr>
                    ) : (
                        (data || []).map((item: T, rowIdx: number) => (
                            <tr
                                key={rowIdx}
                                onClick={() => onRowClick?.(item)}
                                className={cn(
                                    "hover:bg-surface-container/50 transition-colors duration-200",
                                    onRowClick && "cursor-pointer"
                                )}
                            >
                                {(columns || []).map((col, colIdx: number) => (
                                    <td key={colIdx} className={cn("px-8 py-5", col.className)}>
                                        {col.cell ? col.cell(col.accessorKey ? item[col.accessorKey] : undefined, item) : (
                                            <span className="text-sm font-medium text-on-surface">
                                                {col.accessorKey ? String(item[col.accessorKey]) : ""}
                                            </span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            {footer && (
                <div className="p-4 bg-surface-container border-t border-outline-variant border-dashed">
                    {footer}
                </div>
            )}
        </div>
    );
}
