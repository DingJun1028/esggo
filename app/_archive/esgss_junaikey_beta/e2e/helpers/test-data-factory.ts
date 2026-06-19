/**
 * 🏭 測試數據工廠
 * Test Data Factory for Journey Tests
 * 
 * 為 E2E 測試生成真實但隨機的測試數據
 */

import { faker } from '@faker-js/faker/locale/zh_TW';

/**
 * 產業選項（繁體中文）
 */
const INDUSTRIES = [
    '製造業',
    '科技業',
    '服務業',
    '金融業',
    '零售業',
    '醫療業',
    '教育業',
    '營建業'
] as const;

/**
 * 測試數據工廠主類別
 */
export class JourneyTestDataFactory {
    /**
     * 創建測試用戶
     * 
     * @param role - 用戶角色
     * @returns 用戶資料物件
     */
    static createUser(role: 'individual' | 'corporate' | 'consultant' = 'corporate') {
        const timestamp = Date.now();

        return {
            email: `test-${role}-${timestamp}@infoone.test`,
            password: 'Test123456!',
            name: faker.person.fullName(),
            company: role === 'individual' ? null : faker.company.name(),
            role,
            phone: faker.phone.number('09########'),
            region: faker.helpers.arrayElement(['台北市', '新北市', '台中市', '高雄市']),
        };
    }

    /**
     * 創建生態羅盤評估數據
     * 
     * @returns 評估表單數據
     */
    static createEcoAssessment() {
        return {
            companyName: faker.company.name(),
            industry: faker.helpers.arrayElement(INDUSTRIES),
            employeeCount: faker.number.int({ min: 50, max: 5000 }),
            annualRevenue: faker.number.int({ min: 10000000, max: 1000000000 }), // 1千萬 - 10億
            electricityKwh: faker.number.int({ min: 10000, max: 500000 }),
            naturalGasM3: faker.number.int({ min: 500, max: 50000 }),
            dieselLiters: faker.number.int({ min: 100, max: 10000 }),
        };
    }

    /**
     * 創建碳足跡計算器數據
     * 
     * @returns 碳計算表單數據
     */
    static createCarbonCalculation() {
        return {
            activityType: faker.helpers.arrayElement(['交通運輸', '能源使用', '廢棄物處理', '產品製造']),
            quantity: faker.number.float({ min: 1, max: 1000, fractionDigits: 2 }),
            unit: faker.helpers.arrayElement(['公噸', '公斤', '公里', '度']),
            period: faker.helpers.arrayElement(['每日', '每週', '每月', '每年']),
        };
    }

    /**
     * 創建證據保險庫上傳數據
     * 
     * @returns 證據上傳數據
     */
    static createEvidenceUpload() {
        return {
            title: `${faker.word.adjective()}證據文件`,
            description: faker.lorem.sentence(),
            category: faker.helpers.arrayElement(['環境', '社會', '治理']),
            tags: Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, () => faker.word.noun()),
            confidentiality: faker.helpers.arrayElement(['公開', '內部', '機密']),
        };
    }

    /**
     * 創建董事會副駕駛會議數據
     * 
     * @returns 會議資料
     */
    static createBoardMeeting() {
        return {
            title: faker.company.catchPhrase() + ' 董事會議',
            date: faker.date.future().toISOString().split('T')[0],
            agenda: Array.from({ length: faker.number.int({ min: 3, max: 8 }) }, () => faker.lorem.sentence()),
            attendees: Array.from({ length: faker.number.int({ min: 5, max: 15 }) }, () => ({
                name: faker.person.fullName(),
                role: faker.person.jobTitle(),
            })),
        };
    }

    /**
     * 創建多元包容追蹤器數據
     * 
     * @returns 多元包容數據
     */
    static createDiversityData() {
        const totalEmployees = faker.number.int({ min: 100, max: 2000 });

        return {
            totalEmployees,
            genderDistribution: {
                male: faker.number.int({ min: 40, max: totalEmployees - 40 }),
                female: faker.number.int({ min: 40, max: totalEmployees - 40 }),
                nonBinary: faker.number.int({ min: 0, max: 10 }),
            },
            ageDistribution: {
                under30: faker.number.int({ min: 10, max: totalEmployees * 0.4 }),
                between30And50: faker.number.int({ min: 10, max: totalEmployees * 0.5 }),
                over50: faker.number.int({ min: 10, max: totalEmployees * 0.3 }),
            },
            leadershipDiversity: faker.number.int({ min: 20, max: 60 }), // 百分比
        };
    }

    /**
     * 創建市場情報查詢
     * 
     * @returns 情報查詢參數
     */
    static createMarketIntelQuery() {
        return {
            keyword: faker.helpers.arrayElement(['ESG', '碳中和', '永續發展', 'CSR', '綠色金融']),
            region: faker.helpers.arrayElement(['台灣', '亞太', '全球']),
            industry: faker.helpers.arrayElement(INDUSTRIES),
            timeRange: faker.helpers.arrayElement(['本週', '本月', '本季', '本年']),
        };
    }

    /**
     * 創建風險評估數據
     * 
     * @returns 風險評估表單
     */
    static createRiskAssessment() {
        return {
            riskCategory: faker.helpers.arrayElement(['環境風險', '社會風險', '治理風險', '財務風險']),
            severity: faker.helpers.arrayElement(['低', '中', '高', '極高']),
            likelihood: faker.helpers.arrayElement(['不太可能', '可能', '很可能', '幾乎確定']),
            description: faker.lorem.paragraph(),
            mitigationPlan: faker.lorem.sentences(3),
        };
    }

    /**
     * 創建利害關係人參與記錄
     * 
     * @returns 參與記錄
     */
    static createStakeholderEngagement() {
        return {
            stakeholderType: faker.helpers.arrayElement(['員工', '客戶', '供應商', '投資人', '社區', '政府']),
            engagementMethod: faker.helpers.arrayElement(['會議', '問卷調查', '工作坊', '公聽會', '線上平台']),
            topic: faker.lorem.sentence(),
            date: faker.date.recent().toISOString().split('T')[0],
            participantCount: faker.number.int({ min: 10, max: 500 }),
            keyFindings: Array.from({ length: 3 }, () => faker.lorem.sentence()),
        };
    }

    /**
     * 創建合規檢查清單
     * 
     * @returns 合規檢查項目
     */
    static createComplianceChecklist() {
        return {
            regulation: faker.helpers.arrayElement(['勞基法', '環保法', '公司法', '證交法', 'GDPR']),
            checklistItems: Array.from({ length: faker.number.int({ min: 5, max: 15 }) }, () => ({
                item: faker.lorem.sentence(),
                status: faker.helpers.arrayElement(['符合', '不符合', '部分符合', '不適用']),
                evidence: faker.lorem.words(3),
            })),
            lastReviewDate: faker.date.recent().toISOString().split('T')[0],
            nextReviewDate: faker.date.future().toISOString().split('T')[0],
        };
    }

    /**
     * 生成唯一識別碼
     * 
     * @param prefix - 前綴
     * @returns UUID 格式字串
     */
    static generateUuid(prefix: string = ''): string {
        const timestamp = Date.now().toString(16);
        const random = Math.random().toString(16).substring(2, 10);
        return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`;
    }

    /**
     * 生成評估 ID
     * 
     * @param serviceCode - 服務代碼（如 'eco', 'carbon', 'evidence'）
     * @returns 評估 ID
     */
    static generateAssessmentId(serviceCode: string): string {
        const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
        const random = Math.random().toString(36).substring(2, 10);
        return `${serviceCode}-${date}-${random}`;
    }
}
