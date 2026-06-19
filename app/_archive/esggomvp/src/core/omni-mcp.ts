import { OmniAPI } from './omni-api';
import { omniLogger, LogCategory } from './omniLogger';
import {
    OmniMapper,
    IReportFormInput,
    ICarbonFormInput,
    IReportDisplayDTO,
    IIndicatorRowDTO,
    ICarbonDisplayDTO,
    IIntelDisplayDTO,
} from './omni-mapper';
import type { IIntelNode, ICarbonScopeData } from './omni-types';

/**
 * 🧬 OmniMCP v2.0: Model Context Protocol Coordinator
 * =====================================================
 * 終始矩陣：雙向 TypeScript 映射器嵌入
 *
 * All tool inputs flow through OmniMapper (📤 Frontend → Backend)
 * All tool outputs flow through OmniMapper (📥 Backend → Frontend)
 *
 * Design: [可驗算 Transparent] — data transformations are explicit and typed.
 */

export class OmniMCP {
    private api: OmniAPI;
    private readonly mapper = OmniMapper; // Stateless — all methods are static

    constructor() {
        this.api = OmniAPI.getInstance();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 📤 Tools: Frontend Input → Backend Action → 📥 Mapped Output
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * 🛠️ Tool: manifest_asset
     * Maps raw payload into a typed 5T seed and returns the sealed UUID.
     */
    public async tool_manifest_asset(intent: string, payload: unknown): Promise<string> {
        const seed = this.mapper.mapToType<Record<string, unknown>>(payload);
        const atom = await this.api.manifestAtom({
            intent,
            type: 'Accomplishment',
            payload: seed,
            domainRef: 'Sovereign_Agent_Forge',
        });
        return atom.uuid;
    }

    /**
     * 🛠️ Tool: scan_impact_report
     */
    public async tool_scan_impact_report(buffer: Buffer): Promise<unknown> {
        return this.api.ingestVisual(buffer, 'PDF');
    }

    /**
     * 🛠️ Tool: sync_external_data
     */
    public async tool_sync_external_data(platformId: string): Promise<unknown> {
        return this.api.syncPlatform(platformId);
    }

    /**
     * 🛠️ Tool: analyze_trend
     */
    public async tool_analyze_trend(prompt: string): Promise<unknown> {
        return this.api.analyzeCognitiveTrend(prompt);
    }

    /**
     * 🛠️ Tool: verify_carbon
     * 📤 Validates ICarbonFormInput → ICarbonScopeData (Backend)
     * 📥 Returns ICarbonDisplayDTO[] (Frontend-ready)
     */
    public async tool_verify_carbon(
        scope: 1 | 2 | 3,
        rawData: ICarbonFormInput | ICarbonScopeData
    ): Promise<ICarbonDisplayDTO[]> {
        // Normalize: accept either form input or already-typed scope data
        const scopeData: ICarbonScopeData = 'emissionsValue' in rawData
            ? this.mapper.carbonFormToScope(rawData as ICarbonFormInput)
            : rawData as ICarbonScopeData;

        const result = await this.api.verifyCarbonScope(scope, scopeData);

        // Return display-ready DTOs for frontend charts
        const scopes: ICarbonScopeData[] = Array.isArray(result) ? result : [scopeData];
        return this.mapper.carbonScopesToDTOs(scopes);
    }

    /**
     * 🛠️ Tool: forge_gri_report
     * 📤 Validates IReportFormInput → IForgeIndicator[] (Backend)
     * 📥 Returns IReportDisplayDTO (Frontend-ready)
     */
    public async tool_forge_gri_report(
        title: string,
        rawIndicators: IReportFormInput['indicators'] | unknown[]
    ): Promise<IReportDisplayDTO> {
        // 📤 Map: frontend form rows → typed forge indicators
        const indicators = this.mapper.formToForgeIndicators(
            rawIndicators as IReportFormInput['indicators']
        );

        const result = await this.api.forgeGRIReport(title, indicators);

        // 📥 Map: backend report result → frontend display DTO
        return this.mapper.reportResultToDTO(result);
    }

    /**
     * 🛠️ Tool: get_indicator_rows
     * 📥 Converts raw indicator data to UI-ready table rows.
     */
    public tool_get_indicator_rows(
        rawIndicators: IReportFormInput['indicators']
    ): IIndicatorRowDTO[] {
        const forged = this.mapper.formToForgeIndicators(rawIndicators);
        return this.mapper.indicatorsToRows(forged);
    }

    /**
     * 🛠️ Tool: analyze_intel_nodes
     * 📥 Converts IIntelNode[] from backend to display DTOs for dashboards.
     */
    public tool_analyze_intel_nodes(nodes: IIntelNode[]): IIntelDisplayDTO[] {
        return nodes.map((n) => this.mapper.intelToDisplayDTO(n));
    }

    /**
     * 🛠️ Tool: seal_5t_proof
     */
    public async tool_seal_5t_proof(atomId: string, proof: string): Promise<void> {
        omniLogger.info(LogCategory.SYSTEM, `OmniMCP: Sealing 5T proof for [${atomId}]`);
        const evidenceMap = this.mapper.buildEvidenceMap({
            metricName: 'Proof_Seal',
            metricValue: proof,
            sourceOrigin: 'OmniMCP',
            authorSignature: atomId,
            formula: '$H = SHA256(atomId + proof + timestamp)$',
            standardRef: 'ISO-14064',
        });
        omniLogger.info(LogCategory.SYSTEM, `OmniMCP: Evidence sealed — ${JSON.stringify(evidenceMap.transparent)}`);
    }

    /**
     * 🛠️ Tool: ask_jules
     * Connects to Google Jules MCP for advanced AI reasoning and cognitive synthesis.
     */
    public async tool_ask_jules(prompt: string, context?: any): Promise<unknown> {
        omniLogger.info(LogCategory.SYSTEM, `OmniMCP: Routing to Google Jules MCP with prompt: ${prompt}`);
        return this.api.askGoogleJules(prompt, context);
    }

    /**
     * 🛠️ Tool: sequential_thinking
     * Connects to the sequential-thinking MCP server.
     */
    public async tool_sequential_thinking(args: Record<string, unknown>): Promise<unknown> {
        omniLogger.info(LogCategory.SYSTEM, `OmniMCP: Routing to Sequential Thinking MCP`);
        return this.api.sequentialThinking(args);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 📡 Dispatch: Route agent requests + auto-map inputs/outputs
    // ─────────────────────────────────────────────────────────────────────────

    public async dispatch(toolName: string, args: Record<string, unknown>): Promise<unknown> {
        omniLogger.info(LogCategory.SYSTEM, `OmniMCP: Dispatching [${toolName}]`);

        switch (toolName) {
            case 'manifest_asset':
                return this.tool_manifest_asset(args.intent as string, args.payload);

            case 'scan_report':
                return this.tool_scan_impact_report(args.buffer as Buffer);

            case 'sync_data':
                return this.tool_sync_external_data(args.platformId as string);

            case 'analyze_trend':
                return this.tool_analyze_trend(args.prompt as string);

            case 'verify_carbon':
                return this.tool_verify_carbon(
                    args.scope as 1 | 2 | 3,
                    args.data as ICarbonFormInput
                );

            case 'forge_report':
                return this.tool_forge_gri_report(
                    args.title as string,
                    args.indicators as IReportFormInput['indicators']
                );

            case 'get_indicator_rows':
                return this.tool_get_indicator_rows(
                    args.indicators as IReportFormInput['indicators']
                );

            case 'analyze_intel':
                return this.tool_analyze_intel_nodes(args.nodes as IIntelNode[]);

            case 'seal_proof':
                return this.tool_seal_5t_proof(args.atomId as string, args.proof as string);

            case 'ask_jules':
                return this.tool_ask_jules(args.prompt as string, args.context);

            case 'sequential_thinking':
                return this.tool_sequential_thinking(args);

            default:
                throw new Error(`[OmniMCP] Tool "${toolName}" not found in dispatch table.`);
        }
    }
}
