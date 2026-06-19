import { NextRequest, NextResponse } from "next/server";
import { limiters } from "@/core/rate-limiter";
import { omniSupplyChain } from "@/core/omni-supply-chain";

export async function GET(req: NextRequest) {
    try {
        const ip = req.headers.get('x-forwarded-for') || 'unknown';
        const { success } = await limiters.apiGeneral(ip);
        if (!success) {
            return new NextResponse('Rate limit exceeded', { status: 429 });
        }

        const suppliers = await omniSupplyChain.getSuppliers();
        const stats = await omniSupplyChain.getSupplyChainStats();
        const distribution = await omniSupplyChain.getEsgDistribution();
        const riskNodes = await omniSupplyChain.getRiskNodes();

        return NextResponse.json({
            success: true,
            data: { suppliers, stats, distribution, riskNodes }
        });
    } catch (error: any) {
        console.error("🔴 Village Supply Chain API Error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
