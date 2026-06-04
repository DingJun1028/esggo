/**
 * ESG GO | Verifiable Report Engine
 * Generates and signs 5T-certified reports with embedded Hash Locks.
 */
import { IComponentCore } from '../src/shared/types';
export interface ReportMetadata {
    reportId: string;
    title: string;
    companyId: string;
    issuedAt: string;
    components: IComponentCore[];
}
export interface VerifiableExport {
    fileName: string;
    content: string;
    masterSeal: string;
    verificationUrl: string;
}
export declare class ProofExportEngine {
    private static instance;
    static getInstance(): ProofExportEngine;
    /**
     * Generates a 5T Manifest for a report.
     * This is the "Integrity Page" that goes into the PDF.
     */
    generateManifest(metadata: ReportMetadata): Promise<VerifiableExport>;
    /**
     * Signs an artifact for external disclosure.
     */
    signArtifact(artifactId: string, content: string): Promise<string>;
}
export declare const proofExportEngine: ProofExportEngine;
export interface IntegrityCertificate {
    certificateId: string;
    issuedTo: string;
    issuedAt: string;
    masterSeal: string;
    verificationUrl: string;
    dataSummary: {
        metric: string;
        source: string;
        version: string;
    };
    integrityMatrix: Record<string, string>;
}
export declare function generateIntegrityCertificate(component: IComponentCore, issuedTo: string): Promise<IntegrityCertificate>;
//# sourceMappingURL=proof-export.d.ts.map