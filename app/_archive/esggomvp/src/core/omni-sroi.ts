export interface ISROIMetric {
    id: string;
    project: string;
    investment: number;
    socialValue: number;
    ratio: number;
    category: 'environmental' | 'social' | 'governance';
    status: 'active' | 'completed' | 'planned';
    startDate: string;
}

export class OmniSROIService {
    private static instance: OmniSROIService;
    private sroiMetrics: ISROIMetric[] = [];

    private constructor() {
        this.sroiMetrics = [
            {
                id: 'sroi-001',
                project: '綠色供應鏈輔導計畫',
                investment: 500000,
                socialValue: 2150000,
                ratio: 4.3,
                category: 'environmental',
                status: 'active',
                startDate: '2025-01-10'
            },
            {
                id: 'sroi-002',
                project: '社區偏鄉教育賦能',
                investment: 300000,
                socialValue: 1050000,
                ratio: 3.5,
                category: 'social',
                status: 'active',
                startDate: '2025-03-01'
            },
            {
                id: 'sroi-003',
                project: '員工身心靈健康工作坊',
                investment: 150000,
                socialValue: 720000,
                ratio: 4.8,
                category: 'governance',
                status: 'completed',
                startDate: '2024-06-15'
            }
        ];
    }

    public static getInstance() {
        if (!OmniSROIService.instance) {
            OmniSROIService.instance = new OmniSROIService();
        }
        return OmniSROIService.instance;
    }

    public getSROIMetrics() {
        return this.sroiMetrics;
    }

    public getAggregateSROI() {
        const totalInvestment = this.sroiMetrics.reduce((sum, item) => sum + item.investment, 0);
        const totalSocialValue = this.sroiMetrics.reduce((sum, item) => sum + item.socialValue, 0);
        const averageRatio = totalInvestment > 0 ? (totalSocialValue / totalInvestment) : 0;

        return {
            totalInvestment,
            totalSocialValue,
            averageRatio: Math.round(averageRatio * 10) / 10
        };
    }
}

export const sroiService = OmniSROIService.getInstance();
