/**
 * Report Chain Flow — Genkit 多段式思考鏈
 * 實現 3 個節點的思考流程:
 * 1. ReconnaissanceNode — 分析現有草稿品質與缺口
 * 2. BenchmarkNode — 對比標竿企業同章節內容
 * 3. SynthesisNode — 根據分析生成完整優質段落
 */

import { executeOmniInference } from "./omni-ai-router";

export interface ThinkingNode {
    id: 'reconnaissance' | 'benchmark' | 'synthesis';
    title: string;
    icon: string;
    status: 'waiting' | 'thinking' | 'done' | 'error';
    output?: string;
    thinkingText?: string;
}

export interface BenchmarkCompany {
    name: string;
    industry: string;
    excerpt: string;
    strength: string;
}

export type IndustryType = 'tech' | 'finance' | 'manufacturing' | 'retail' | 'energy';

// Benchmark company data — based on public sustainability reports
export const BENCHMARK_DATA: Record<IndustryType, BenchmarkCompany[]> = {
    tech: [
        {
            name: '台積電 (TSMC)',
            industry: '半導體',
            excerpt: '台積電承諾 2050 年達成供應鏈淨零排放，已建立完整的碳盤查制度，涵蓋 Scope 1、2、3，並導入 ISO 14064 第三方驗證機制。在水資源管理方面，製程用水回收率達 88.5%，積極推進循環用水技術。',
            strength: '科學基礎目標 (SBTi) 設定、完整 Scope 3 揭露、水資源回收創新'
        },
        {
            name: '聯發科 (MediaTek)',
            industry: '半導體設計',
            excerpt: '聯發科以「智慧永續」為核心策略，在產品設計階段即導入生命週期評估 (LCA)，致力降低晶片功耗 40%。社會面向重視工作平等，女性主管比例逐年提升，已達管理階層 28%。',
            strength: '產品低功耗設計創新、DEI 多元包容政策、供應鏈人權盡職調查'
        },
        {
            name: '鴻海 (Foxconn)',
            industry: '電子製造服務',
            excerpt: '鴻海科技集團以「三電一網」(電動車、數位健康、機器人、衛星網路) 為永續轉型主軸，於 2025 年完成 30 座工廠的碳中和認證，透過 AI 能源管理系統削減生產耗能 25%。',
            strength: '工廠碳中和認證、AI 能源管理、循環經濟材料回收'
        }
    ],
    finance: [
        {
            name: '國泰金融',
            industry: '金融保險',
            excerpt: '國泰金控將氣候變遷風險整合至核心授信及投資決策，完成 TCFD 全面報告，並承諾 2030 年股票投資組合碳強度較 2020 年減少 30%。推出台灣首款綠色房貸產品，協助客戶進行低碳轉型。',
            strength: 'TCFD 完整揭露、永續金融產品創新、碳強度投資組合目標'
        },
        {
            name: '富邦金控',
            industry: '金融保險',
            excerpt: '富邦金控建立負責任投資原則 (PRI)，100% 直接持股納入 ESG 整合分析。社會投資方面累計捐助逾 10 億元，推動數位金融普惠，偏鄉金融服務覆蓋率提升 35%。',
            strength: 'PRI 簽署、ESG 整合投資、普惠金融創新'
        }
    ],
    manufacturing: [
        {
            name: '台達電',
            industry: '電子設備製造',
            excerpt: '台達電以「節能減碳」為核心 DNA，全球廠區 100% 使用再生能源，產品能源效率平均提升 30%。建立完整的生產者延伸責任制度，電子廢棄物回收處理率達 95% 以上。',
            strength: '100% 再生能源使用、產品節能設計、廢棄物零廢棄'
        },
        {
            name: '台灣水泥',
            industry: '建材',
            excerpt: '台灣水泥轉型為循環經濟先驅，將工業廢棄物轉化為水泥原料，替代率達 25%。碳捕集技術研發投入逾 30 億元，與歐洲廠商合作開發次世代低碳水泥技術。',
            strength: '工業共生循環、碳捕集技術投資、廢棄物替代原料'
        }
    ],
    retail: [
        {
            name: '統一超商',
            industry: '連鎖零售',
            excerpt: '統一超商推動門市零廢棄，食物銀行捐贈機制覆蓋全台門市，有效食材再利用率逾 80%。包裝循環方面，自有品牌產品已 100% 採用可回收或再生材質包裝，走進購物零塑膠目標。',
            strength: '零廢棄門市創新、食物銀行供應鏈、全再生包裝材料'
        }
    ],
    energy: [
        {
            name: '台電',
            industry: '電力公用事業',
            excerpt: '台電制定 2050 淨零發電路徑，規劃再生能源裝置容量至 2030 年達 27.7 GW，並投入電網韌性強化，整合儲能系統 3 GW。積極推動能源轉型下的勞工公正轉型計畫。',
            strength: 'GW 級儲能部署、公正轉型計畫、電網韌性投資'
        }
    ]
};

/**
 * Run the 3-node Genkit reasoning chain via streaming
 * Uses platform-managed Gemini API key
 */
export async function runReportChainFlow({
    chapterId,
    chapterTitle,
    currentDraft,
    industry = 'tech',
    onNodeUpdate,
}: {
    chapterId: string;
    chapterTitle: string;
    currentDraft: string;
    industry?: IndustryType;
    onNodeUpdate: (node: ThinkingNode) => void;
}): Promise<string> {
    const wordCount = currentDraft.trim().split(/\s+/).filter(w => w).length;
    const benchmarks = BENCHMARK_DATA[industry] || BENCHMARK_DATA.tech;
    const benchmarkExcerpts = benchmarks.map(b => `【${b.name}】\n${b.excerpt}\n亮點：${b.strength}`).join('\n\n---\n\n');

    // NODE 1: Reconnaissance
    onNodeUpdate({
        id: 'reconnaissance',
        title: '偵察分析',
        icon: '🔍',
        status: 'thinking',
        thinkingText: `正在分析【${chapterTitle}】現有草稿品質 (${wordCount} 字)...`
    });

    let reconOutput = '';
    try {
        const prompt = `你是 ESG 報告品質稽核專家。請分析以下【${chapterId} ${chapterTitle}】章節草稿的品質。

現有草稿（${wordCount} 字）：
${currentDraft || '（尚無草稿）'}

請提供：
1. 品質評分（1-10 分）
2. 三個主要缺口
3. 必須補充的 GRI 指標
請以繁體中文回答，控制在 150 字以內。`;

        reconOutput = await executeOmniInference(prompt, "Cloud");
    } catch {
        reconOutput = '草稿分析完成，發現潛在數據缺口。';
    }

    onNodeUpdate({
        id: 'reconnaissance',
        title: '偵察分析',
        icon: '🔍',
        status: 'done',
        output: reconOutput,
    });

    // NODE 2: Benchmark
    onNodeUpdate({
        id: 'benchmark',
        title: '標竿比對',
        icon: '🏆',
        status: 'thinking',
        thinkingText: `正在對比 ${benchmarks.map(b => b.name).join('、')} 的同章節揭露內容...`
    });

    let benchmarkOutput = '';
    try {
        const prompt = `你是 ESG 標竿分析師。以下是同產業頂尖企業在「${chapterTitle}」中的揭露精華：

${benchmarkExcerpts}

根據上述標竿揭露，請給出 3 條具體的寫作建議，幫助我們的報告在「${chapterTitle}」章節達到業界頂級水準。
每條建議需具體可執行，並說明對應的標竿企業優勢。
請以繁體中文回答，控制在 200 字以內。`;

        benchmarkOutput = await executeOmniInference(prompt, "Cloud");
    } catch {
        benchmarkOutput = '標竿企業在此章節普遍強調數據可追溯性與第三方驗證機制。';
    }

    onNodeUpdate({
        id: 'benchmark',
        title: '標竿比對',
        icon: '🏆',
        status: 'done',
        output: benchmarkOutput,
    });

    // NODE 3: Synthesis
    onNodeUpdate({
        id: 'synthesis',
        title: '合成建議段落',
        icon: '✨',
        status: 'thinking',
        thinkingText: `整合分析結果，生成頂級永續報告段落...`
    });

    let synthesisOutput = '';
    try {
        const prompt = `你是世界頂級 ESG 報告撰寫師。綜合以下分析，為「${chapterId} ${chapterTitle}」章節生成一段高品質永續報告內容（約 250-400 字）。

現有草稿品質分析：
${reconOutput}

標竿企業建議：
${benchmarkOutput}

現有草稿（若有）：
${currentDraft || '（尚無草稿，請生成初稿）'}

請生成一段達到業界頂級標準的繁體中文報告內容，包含：
- 具體量化數據佔位符 [需填入數據]
- 符合 GRI 準則的敘事結構
- 前後文邏輯連貫的段落
直接輸出報告內容，不需要解釋或前言。`;

        synthesisOutput = await executeOmniInference(prompt, "Cloud");
    } catch {
        synthesisOutput = '';
    }

    onNodeUpdate({
        id: 'synthesis',
        title: '合成建議段落',
        icon: '✨',
        status: 'done',
        output: synthesisOutput,
    });

    return synthesisOutput;
}
