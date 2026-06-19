import { L1MinimumViableData, L1HealthCheckResult, TrafficLightStatus } from '@/types/esg_go_schema.js';

export class L1HealthCheckService {

    /**
     * Conducts a Fast Screening (L1) based on Minimum Viable Data.
     */
    /**
     * Conducts a Fast Screening (L1) based on Minimum Viable Data.
     * 5T Traceable: Persists result to the backend.
     */
    public async assess(data: L1MinimumViableData): Promise<L1HealthCheckResult> {
        const { score, missingFields, riskFactors } = this.calculateScore(data);
        const overallStatus = this.determineStatus(score);
        const ninetyDayTasks = this.generateActionPlan(data, riskFactors);

        const result: L1HealthCheckResult = {
            overallStatus,
            score,
            missingFields,
            riskFactors,
            ninetyDayTasks,
            generatedAt: Date.now()
        };

        // Persist to Backend (Traceable)
        try {
            await fetch('/api/l1-assessment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    companyName: data.companyName,
                    industry: data.industry,
                    employeeCount: data.employeeCount,
                    hasGhInventory: data.hasGhInventory,
                    hasCodeOfConduct: data.hasCodeOfConduct,
                    hasSustainabilityReport: data.hasSustainabilityReport,
                    supplyChainPolicy: data.supplyChainPolicy,
                    contactPerson: data.contactPerson,
                    email: data.email,
                    score,
                    overallStatus
                })
            });
        } catch (error) {
            console.error('Failed to save L1 Assessment Trace:', error);
            // We still return the local result so the user isn't blocked, 
            // but in a real 5T system, this might be a blocking error.
        }

        return result;
    }

    private calculateScore(data: L1MinimumViableData): { score: number, missingFields: string[], riskFactors: string[] } {
        let score = 100;
        const missingFields: string[] = [];
        const riskFactors: string[] = [];

        // Basic Compliance Checks
        if (!data.hasCodeOfConduct) {
            score -= 20;
            missingFields.push('Code of Conduct');
            riskFactors.push('Lack of basic governance policy (Code of Conduct).');
        }

        if (!data.hasGhInventory) {
            score -= 25;
            missingFields.push('GHG Inventory');
            riskFactors.push('No carbon baseline established (High Customer Risk).');
        }

        if (!data.hasSustainabilityReport) {
            score -= 15;
            missingFields.push('Sustainability Report');
            riskFactors.push('No public disclosure of ESG performance.');
        }

        if (!data.supplyChainPolicy) {
            score -= 10;
            missingFields.push('Supply Chain Policy');
        }

        // Integrity Check
        if (!data.contactPerson || !data.email) {
            score -= 5;
            missingFields.push('Contact Information');
        }

        return { score: Math.max(0, score), missingFields, riskFactors };
    }

    private determineStatus(score: number): TrafficLightStatus {
        if (score >= 80) return 'Green';
        if (score >= 50) return 'Yellow';
        return 'Red';
    }

    private generateActionPlan(data: L1MinimumViableData, risks: string[]) {
        const tasks = [];

        if (!data.hasGhInventory) {
            tasks.push({
                id: 'task-ghg-001',
                title: '建立 Scope 1 & 2 碳盤查邊界',
                priority: 'High' as const,
                estimatedEffort: '2 weeks'
            });
        }

        if (!data.hasCodeOfConduct) {
            tasks.push({
                id: 'task-gov-001',
                title: '簽署並發布供應商行為準則 (CoC)',
                priority: 'High' as const,
                estimatedEffort: '3 days'
            });
        }

        if (!data.supplyChainPolicy) {
            tasks.push({
                id: 'task-sup-001',
                title: '盤點前十大供應商名單與風險分級',
                priority: 'Medium' as const,
                estimatedEffort: '1 week'
            });
        }

        // Default task for everyone
        tasks.push({
            id: 'task-gen-001',
            title: '完成 ESG GO L2 深度診斷',
            priority: 'Medium' as const,
            estimatedEffort: '2 hours'
        });

        return tasks;
    }
}

export const l1HealthCheckService = new L1HealthCheckService();
