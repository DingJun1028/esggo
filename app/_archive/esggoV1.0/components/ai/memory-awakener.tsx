"use client";

import { useEffect } from "react";
import { useEternalMemory } from "@/hooks/use-eternal-memory-store";
import { useOmniTelepathy } from "@/hooks/use-omni-telepathy";

/**
 * MemoryAwakener
 * 
 * A silent sentinel component that initializes the Omni Memory system.
 * It ensures the "Awakening" signal is sent once the platform is ready.
 */
export function MemoryAwakener() {
    const { isAwakened, awaken } = useEternalMemory();

    // Activate Real-Time Cloud Telepathy
    useOmniTelepathy();

    useEffect(() => {
        if (!isAwakened) {
            // Simulate system diagnostic before awakening
            const timer = setTimeout(() => {
                awaken({
                    isAwakened: true,
                    worldLevel: 1 // Default starting level for the 2026 ESG landscape
                });
                console.log("🌌 [Omni_Terminal] System Awakened. Eternal Memory Engraved.");
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [isAwakened, awaken]);

    return null; // Silent component
}
