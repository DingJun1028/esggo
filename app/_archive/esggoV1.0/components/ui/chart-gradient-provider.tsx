"use client";

import React from "react";

/**
 * ChartGradientProvider
 * Defines global SVG linear gradients for Recharts and other SVG-based visualizations.
 * This allows for brand-consistent coloring across the platform.
 */
export function ChartGradientProvider() {
    return (
        <svg style={{ height: 0, width: 0, position: "absolute", visibility: "hidden" }} aria-hidden="true">
            <defs>
                {/* Optimal / Teal Gradient */}
                <linearGradient id="gradient-optimal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary-teal-start)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-primary-teal-start)" stopOpacity={0} />
                </linearGradient>

                {/* Critical / Gold Gradient */}
                <linearGradient id="gradient-critical" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary-gold)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-primary-gold)" stopOpacity={0} />
                </linearGradient>

                {/* Info / Blue Gradient */}
                <linearGradient id="gradient-info" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-info)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-info)" stopOpacity={0} />
                </linearGradient>

                {/* Lethal / Red Gradient */}
                <linearGradient id="gradient-lethal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-error)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-error)" stopOpacity={0} />
                </linearGradient>

                {/* Neural / Slate Gradient */}
                <linearGradient id="gradient-neutral" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-on-surface-variant)" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="var(--color-on-surface-variant)" stopOpacity={0} />
                </linearGradient>
            </defs>
        </svg>
    );
}

/**
 * Helper to get the gradient URL string for Recharts.
 */
export const getChartGradient = (id: "optimal" | "critical" | "info" | "lethal" | "neutral") => `url(#gradient-${id})`;
