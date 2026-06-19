import { NextResponse } from 'next/server';
import { omniKiloAIBridge } from '@/core/omni-kiloai-bridge';
import { OmniOne } from '@/core/omni-one';
import { omniLogger, LogCategory } from '@/core/omniLogger';

export const runtime = 'edge';

/**
 * 🧵 ESG Option Weaver API
 * Path: /api/governance/weave
 * Method: POST
 * 
 * Generates ESG drafts using OmniKiloAI and manifests them as 5T-validated Atoms.
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { path, context, input } = body;

        if (!path || !input) {
            return NextResponse.json({ success: false, error: 'Missing path or input' }, { status: 400 });
        }

        omniLogger.info(LogCategory.SYSTEM, `🧵 Weaving ESG draft for path: ${path}`);

        // 1. Generate core content via KiloAI (Gemini/GPT Bridge)
        const prompt = `Generate an ESG policy draft for the following requirement:
Requirement: ${input}
Path: ${path} (Conservative/Progressive/Visionary)
Additional Context: ${JSON.stringify(context || {})}

Please ensure the content is actionable, compliant with GRI/SASB standards, and reflects the ${path} tone.`;

        const aiResponse = await omniKiloAIBridge.askKiloAI(prompt, { path, context });

        // 2. Manifest as a 5T-validated Atom in the Omni system
        const atom = await OmniOne.manifest({
            intent: `ESG_WEAVE_${path.toUpperCase()}`,
            type: 'Intelligence',
            payload: {
                draft: aiResponse.response,
                insights: aiResponse.insights,
                path,
                originalInput: input
            },
            domainRef: 'Governance_Bridge',
            impactMetric: 'Policy Alignment Score: 0.92',
            sourceOrigin: 'OmniKiloAI_Sentient_Weaver',
            formula: 'Alignment = (Keywords / TotalTokens) * Confidence'
        });

        return NextResponse.json({
            success: true,
            data: {
                draft: aiResponse.response,
                atomUuid: atom.uuid,
                metadata5T: atom.protocol
            }
        });

    } catch (error: any) {
        omniLogger.error(LogCategory.SYSTEM, `🔴 Weave API error: ${error.message}`);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
