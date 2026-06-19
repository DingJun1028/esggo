import { useState, useEffect, useCallback } from "react";
import { omniChart } from "../omni/core/OmniChart.ts";

export const useOmniViz = (userId: string) => {
    const [isLoading, setIsLoading] = useState(true);
    const [funnelData, setFunnelData] = useState<any>(null);
    const [ganttData, setGanttData] = useState<any>(null);
    const [heatmapData, setHeatmapData] = useState<any>(null);

    const refresh = useCallback(async () => {
        setIsLoading(true);
        try {
            const rawFunnel = [
                { stage: "Awareness", count: 1200, resonance: 0.85 },
                { stage: "Interest", count: 850, resonance: 0.92 },
                { stage: "Decision", count: 420, resonance: 0.78 },
                { stage: "Action", count: 150, resonance: 0.95 }
            ];

            const rawGantt = [
                { id: 1, name: "Eternal Anchoring", start: "2026-02-01", end: "2026-02-15", status: "completed" },
                { id: 2, name: "Sentient Evolution", start: "2026-02-16", end: "2026-03-01", status: "in-progress" }
            ];

            const rawHeatmap = [
                { x: "Mon", y: "Morning", value: 85, label: "High Resonance" },
                { x: "Tue", y: "Afternoon", value: 42, label: "Standard Flow" }
            ];

            const mappedFunnel = await omniChart.mapToVisual(rawFunnel, "funnel");
            const mappedGantt = await omniChart.mapToVisual(rawGantt, "gantt");
            const mappedHeatmap = await omniChart.mapToVisual(rawHeatmap, "heatmap");

            await omniChart.verifyDataIntegrity(mappedFunnel);

            setFunnelData(mappedFunnel.payload);
            setGanttData(mappedGantt.payload);
            setHeatmapData(mappedHeatmap.payload);

        } catch (error) {
            console.error("[useOmniViz] Failed to harmonize data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return {
        funnelData,
        ganttData,
        heatmapData,
        isLoading,
        refresh
    };
};
