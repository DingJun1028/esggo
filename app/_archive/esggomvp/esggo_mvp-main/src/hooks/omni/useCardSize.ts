"use client";

import { useState, useEffect } from "react";

export type CardSize = "sm" | "md" | "lg";

/**
 * 依據視窗寬度回傳最適合的卡牌尺寸
 * sm → 手機 (<640px)
 * md → 平板 (640px~1024px)
 * lg → 桌機 (>1024px)
 */
export function useCardSize(override?: CardSize): CardSize {
    const [size, setSize] = useState<CardSize>(override ?? "md");

    useEffect(() => {
        if (override) return;

        const update = () => {
            const w = window.innerWidth;
            if (w < 480) setSize("sm");
            else if (w < 1024) setSize("md");
            else setSize("lg");
        };

        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, [override]);

    return size;
}

/**
 * 依據視窗寬度回傳卡牌格 columns 數量
 * binder 模式下有不同的邏輯
 */
export function useCardColumns(mode: "grid" | "binder" = "grid"): number {
    const [cols, setCols] = useState(4);

    useEffect(() => {
        const update = () => {
            const w = window.innerWidth;
            if (mode === "binder") {
                if (w < 480) setCols(1);
                else if (w < 768) setCols(2);
                else setCols(3);
            } else {
                if (w < 480) setCols(1);
                else if (w < 768) setCols(2);
                else if (w < 1280) setCols(3);
                else setCols(4);
            }
        };

        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, [mode]);

    return cols;
}
