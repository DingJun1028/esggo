"use client";

import React from "react";
import { cn } from "@/lib/utils";

export function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-slate-200", className)}
            {...props}
        />
    );
}

export function CardSkeleton() {
    return (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <div className="space-y-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-2 w-16" />
                </div>
            </div>
            <Skeleton className="h-12 w-full rounded-xl" />
            <div className="flex justify-between items-center">
                <Skeleton className="h-2 w-20" />
                <Skeleton className="h-6 w-12 rounded-full" />
            </div>
        </div>
    );
}

export function DashboardSkeleton() {
    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-end">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-10 w-32 rounded-xl" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    <Skeleton className="h-[400px] w-full rounded-3xl" />
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-[400px] w-full rounded-3xl" />
                </div>
            </div>
        </div>
    );
}

export function VaultSkeleton() {
    return (
        <div className="p-8 space-y-8">
            <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 space-y-4">
                        <div className="flex justify-between">
                            <Skeleton className="w-12 h-12 rounded-2xl" />
                            <Skeleton className="w-8 h-8 rounded-lg" />
                        </div>
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-2 w-1/2" />
                        <div className="pt-4 border-t border-slate-50 flex gap-2">
                            <Skeleton className="h-8 w-16 rounded-lg" />
                            <Skeleton className="h-8 w-16 rounded-lg" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
