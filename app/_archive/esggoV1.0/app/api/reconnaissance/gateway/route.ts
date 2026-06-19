import { NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";
import { IIntelNode5T } from "@/lib/core/5t-protocol";
import { saveIntelNode, getIntelNodes } from "@/lib/services/ncbdb";

// --- Validation Schemas ---
const reconnaissanceSchema = z.object({
  category: z.enum(["S1", "S2", "S3", "S4", "S5"]),
  rawData: z.object({
    risk_score: z.number().optional(),
    raw_evidence: z.record(z.string(), z.any()).optional(),
    source_url: z.string().optional(),
    calculation_method: z.string().optional(),
    title: z.string().optional(),
    insight: z.string().optional(),
    affected_supply_chain: z.array(z.string()).optional(),
  }),
});

// --- Utility Functions ---
const generateHash = (data: string): string => {
  return crypto.createHash("sha256").update(data).digest("hex");
};

const getUnixTimestamp = (): number => {
  return Math.floor(Date.now() / 1000);
};

// --- 5T Protocol Gateway Core ---
/**
 * 💡 核心模組：ESGss 商業偵情 5T 協議閘口 (S1-S5 Intelligence Gateway)
 * 哲學：以神聖代碼契約鑄造永恆架構，在熵增的混沌中開闢秩序之路。
 */
const processReconnaissanceIntel = (
  rawData: any,
  category: "S1" | "S2" | "S3" | "S4" | "S5"
): IIntelNode5T => {
  // 1. 提取資訊熵 (Extract Quantum Essence)
  const intelId = `INTEL-${category}-${Date.now()}`;

  // 2. 鑄造 5T 神聖契約
  const intelNode: IIntelNode5T = {
    uuid: intelId,
    version: "2.0.0",
    timestamp: getUnixTimestamp(),
    category: category,
    impact_level: rawData.risk_score > 80 ? 5 : 3,
    evidence: { ...rawData.raw_evidence }, // 證據左證庫
    protocol_5T: {
      tangible: true, // 標記為已準備好渲染「液態玻璃」UI
      traceable: rawData.source_url || "UNKNOWN_ORIGIN", // 🟢 [真] 鏈式日誌起點 (e.g., unfccc.int)
      trackable: ["CREATED_AT_GATEWAY", "MAPPED_TO_EXPOSURE"], // 🔵 [真] 流轉路徑
      transparent: rawData.calculation_method || "SROI_Impact_Model_v2 [ISO-14064-1]", // 🟠 [善] 零幻覺驗算標籤
      trustworthy: generateHash(JSON.stringify(rawData)), // 🔴 [信] SHA-256 雜湊鎖
    },
    payload: {
      title: rawData.title || "Untitled Intelligence",
      decision_ready_insight: rawData.insight || "Pending Analysis", // 90天行動建議
      target_entities: rawData.affected_supply_chain || ["General Operations"],
    },
  };

  // 3. 核心禁區：寫入後即刻執行 Object.freeze()
  // Note: Object.freeze is shallow. In a real DB layer, this ensures immutability in memory
  // before being persisted to a WORM (Write Once Read Many) storage or blockchain.
  return Object.freeze(intelNode);
};

// --- API Route Handler ---
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // JSON Schema Validation using Zod
    const validationResult = reconnaissanceSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid request body format.",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const { category, rawData } = validationResult.data;

    // Process through the 5T Gateway
    const processedIntel = processReconnaissanceIntel(rawData, category as any);

    // 4. Persistence to 5T Vault (ncbdb)
    await saveIntelNode(processedIntel);

    return NextResponse.json(
      {
        message: "Intelligence successfully processed through 5T Protocol Gateway.",
        status: "LOCKED",
        hash: processedIntel.protocol_5T.trustworthy,
        data: processedIntel,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("5T Gateway Error:", error);

    let statusCode = 500;
    let errorType = "GATEWAY_INTERNAL_ERROR";
    let message = "Internal Server Error processing intelligence.";
    let errorCode = 5000; // Default system error code

    // Differentiate error types for more specific client feedback
    if (error instanceof SyntaxError) {
      statusCode = 400;
      errorType = "MALFORMED_JSON";
      message = "The request body contains malformed JSON.";
      errorCode = 4001;
    } else if (error.name === "ZodError" || error.name === "ValidationError") {
      statusCode = 422;
      errorType = "INTELLIGENCE_VALIDATION_FAILURE";
      message = "Intelligence data failed 5T protocol validation.";
      errorCode = 4221;
    } else if (error.message?.toLowerCase().includes("persistence") || error.message?.toLowerCase().includes("database")) {
      statusCode = 503;
      errorType = "PERSISTENCE_LAYER_FAILURE";
      message = "Failed to persist intelligence to the 5T vault (WORM Storage).";
      errorCode = 5031;
    } else if (error.message?.toLowerCase().includes("processing")) {
      statusCode = 500;
      errorType = "INTELLIGENCE_PROCESSING_ERROR";
      message = "An error occurred during the 5T protocol transformation phase.";
      errorCode = 5001;
    }

    return NextResponse.json(
      {
        error: message,
        type: errorType,
        errorCode: errorCode, // Numerical code for client-side handling
        details: error.message,
        metadata: {
          brandColor: "#D4AF37", // 永恆金 (Eternal Gold) - 確保數字與提示在 UI 上清晰可見
          theme: "Sentient-UI-Dark",
          timestamp: getUnixTimestamp(),
          system: "5T-RECON-GATEWAY-v2"
        }
      },
      { status: statusCode }
    );
  }
}

// --- GET Handler for Reconnaissance Hub ---
export async function GET() {
  try {
    const nodes = await getIntelNodes();
    return NextResponse.json({ nodes });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to retrieve intel nodes", details: error.message },
      { status: 500 }
    );
  }
}
