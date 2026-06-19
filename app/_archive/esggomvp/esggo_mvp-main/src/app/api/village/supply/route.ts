import { NextRequest, NextResponse } from "next/server";
import { limiters } from "@/core/rate-limiter";
import { OmniSupplyChainManager } from "@/core/omni-supply-chain";

export async function GET(req: NextRequest) {
    try {
        const ip = req.headers.get('x-forwarded-for') || 'unknown';
        const { success } = await limiters.apiGeneral(ip);
        if (!success) {
            return new NextResponse('Rate limit exceeded', { status: 429 });
        }

        const supplyChain = OmniSupplyChainManager.getInstance();
        const suppliers = await (supplyChain as any).getSuppliers ? await (supplyChain as any).getSuppliers() : supplyChain.getAllSuppliers();
        const stats = await (supplyChain as any).getSupplyChainStats ? await (supplyChain as any).getSupplyChainStats() : supplyChain.getMetrics();
        const distribution = await (supplyChain as any).getEsgDistribution ? await (supplyChain as any).getEsgDistribution() : (supplyChain.getMetrics() as any).tierDistribution;
        const riskNodes = await (supplyChain as any).getRiskNodes ? await (supplyChain as any).getRiskNodes() : supplyChain.getRisks();

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
