import { NextRequest, NextResponse } from "next/server";
import { ocrBrain } from "@/lib/ocr-brain";

/**
 * 🛰️ Evidence Upload API
 * 
 * Handles evidence file uploads, performs OCR via OCRBrain, 
 * and returns structured ESG data with 5T metadata.
 */
export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Process evidence through OCR Brain
        const evidenceData = await ocrBrain.processEvidence(
            buffer,
            file.name,
            file.type
        );

        // In a real implementation, we would also save the evidence to Supabase/NCB
        // and the file to storage (e.g., Supabase Storage or Vercel Blob)

        return NextResponse.json({
            success: true,
            evidence: evidenceData,
            message: "Evidence processed with high precision."
        });
    } catch (error: any) {
        console.error("Evidence Processing Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error", details: error.message },
            { status: 500 }
        );
    }
}
