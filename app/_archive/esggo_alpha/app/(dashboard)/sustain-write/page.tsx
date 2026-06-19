"use client";

import { SustainWriteView } from "@/components/views/sustain-write-view";
import { GlobalErrorBoundary } from "@/components/error-boundary";

export default function SustainWritePage() {
    return (
        <GlobalErrorBoundary>
            <SustainWriteView />
        </GlobalErrorBoundary>
    );
}
