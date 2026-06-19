import {
    IOmniAtom,
    IProtocol5T,
} from './omni-types';
import {
    IStandardIndicator,
    IStandardMappingResult,
    IndicatorMapper
} from './IndicatorMapper';
import { OmniBase } from './OmniBase';

/**
 * 🏥 HealthDiagnosticService
 * Sentient audit engine for organizational ESG health.
 */
export class HealthDiagnosticService {

    /**
     * 🔍 performSentientAudit
     * Conducts a deep-scan of available atoms and maps them to global standards.
     */
    public static async performSentientAudit(atoms: IOmniAtom<any>[]): Promise<IOmniAtom<{
        score: number;
        resilience: number;
        mapping: IStandardMappingResult;
        auditLog: string[];
        recommendations: Array<{
            indicator: string;
            priority: number;
            suggestion: string;
            courseId?: string;
        }>;
    }>> {
        // 1. Extract submitted codes from atoms
        const submittedCodes = atoms.flatMap((atom: IOmniAtom<any>) => {
            const tags = atom.tags || [];
            return tags.filter((t: any) => t.type === 'indicator').map((t: any) => t.id);
        });

        // 2. Perform Standard Mapping
        const mapping = IndicatorMapper.mapReportToStandards(submittedCodes, ['GRI', 'FSC97', 'SASB', 'TCFD']);

        // 3. Calculate Resilience based on 5T verification depth
        const totalVerificationDepth = atoms.reduce((acc, atom) => {
            let depth = 0;
            if (atom.protocol?.traceable?.status === 'verified') depth += 1;
            if (atom.protocol?.trackable?.status === 'verified') depth += 1;
            if (atom.protocol?.transparent?.status === 'verified') depth += 1;
            if (atom.protocol?.tangible?.status === 'verified') depth += 1;
            if (atom.protocol?.trustworthy?.status === 'verified') depth += 1;
            return acc + depth;
        }, 0);

        const maxPossibleDepth = (atoms.length || 1) * 5;
        const resilience = Math.round((totalVerificationDepth / maxPossibleDepth) * 100);

        // 4. Generate Recommendations linked to Berkeley Academy
        const recommendations = mapping.gaps.map(gap => ({
            indicator: gap.indicatorCode,
            priority: gap.priority,
            suggestion: gap.suggestion,
            courseId: this.mapGapToCourse(gap.indicatorCode)
        }));

        // 5. Generate Sentient Audit Log
        const auditLog = [
            `[Sentient] Deep scan initiated for ${atoms.length} organizational atoms.`,
            `[5T] Resilience Factor calculated at ${resilience}% based on verification volume.`,
            `[Mapper] Alignment with GRI 2026 Core detected at ${mapping.pillarScores.E}% (E), ${mapping.pillarScores.S}% (S), ${mapping.pillarScores.G}% (G).`,
            `[Optimization] ${mapping.missingCount} critical gaps identified. Genetic path mapped.`
        ];

        const payload = {
            score: mapping.complianceScore,
            resilience,
            mapping,
            auditLog,
            recommendations
        };

        const { OmniServiceBridge } = await import('./OmniServiceBridge');

        // 6. Manifest the 5T Audit Certificate Atom
        const auditAtom = await OmniServiceBridge.excellence.manifestAudit(
            payload,
            "企業健康檢查 - 深度 ESG 韌性掃描",
            `總體評分: ${payload.score}, 韌性: ${payload.resilience}%`
        );

        return auditAtom;
    }

    /**
     * 🧬 mapGapToCourse
     * Maps specific ESG indicator gaps to Berkeley Academy course IDs.
     */
    private static mapGapToCourse(code: string): string | undefined {
        if (code.startsWith('GRI-305')) return 'decarbonization-strategy';
        if (code.startsWith('GRI-302')) return 'energy-management';
        if (code.startsWith('GRI-301')) return 'circular-economy';
        if (code.startsWith('GRI-405')) return 'dei-metrics';
        if (code.startsWith('SASB')) return 'sasb-mastery';
        if (code.startsWith('TCFD')) return 'tcfd-analysis';
        if (code.includes('FSC')) return 'supply-chain-audit';
        return 'esg-fundamentals';
    }
}
