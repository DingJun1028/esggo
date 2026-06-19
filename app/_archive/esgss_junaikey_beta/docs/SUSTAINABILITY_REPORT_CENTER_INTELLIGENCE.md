# 永續報告書智慧中心設計規範

**版本**：2.0.0  
**建立日期**：2026-02-08  
**更新日期**：2026-02-08  
**狀態**：正式發布  
**核心理念**：智能分析 · 無縫接軌 · 自動賦能

---

## 一、功能總覽

### 1.1 核心功能矩陣

| 功能模組 | 功能項目 | 說明 | 優先級 |
|----------|----------|------|--------|
| **OCR 智慧解析** | 繁英對照 | 支援繁體中文與英文精準對照 | P0 |
| | 文件萃取 | 從 PDF/圖片萃取文字與表格 | P0 |
| | 格式清洗 | 自動整理為最適文檔格式 | P1 |
| **圖表繪製中心** | 趨勢圖 | 碳排放、能源使用趨勢 | P0 |
| | 對照圖 | GRI/SASB/TCFD 揭露率對照 | P0 |
| | 評分圖 | ESG 綜合評分雷達圖 | P1 |
| | 餅圖/熱力圖 | 能源結構、排放分佈 | P1 |
| **範本參照庫** | 多年比對 | 歷年報告書比較分析 | P0 |
| | 同業參照 | 同業範本快速參照 | P1 |
| | 框架對照 | GRI/TCFD/SASB 框架切換 | P0 |
| **缺口分析** | 自動偵測 | AI 自動比對框架找出缺口 | P0 |
| | 優先排序 | 高/中/低優先級排序 | P1 |
| | 改善建議 | 系統化改善建議生成 | P1 |
| **AI 輔助** | 內容生成 | Gemini AI 輔助章節撰寫 | P1 |
| | 格式優化 | 自動格式調整與清洗 | P1 |

---

## 二、頁面架構

### 2.1 標籤頁結構

```
┌─────────────────────────────────────────────────────────────────┐
│                     永續報告書智慧中心                             │
├─────────────────────────────────────────────────────────────────┤
│  📄 報告書列表  │  🔍 OCR 解析  │  📊 圖表中心  │  📁 範本庫  │  🎯 缺口分析 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                    [標籤頁內容區域]                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 各標籤頁功能說明

#### 📄 報告書列表 (Reports Tab)

**功能位置**：`esgss_junaikey_beta/src/pages/esg/SustainabilityReportCenter.tsx`

**核心功能**：
- 報告書卡片列表顯示
- 狀態標籤（草稿、已核准、已發布、已鎖定）
- 完整度百分比顯示
- 搜尋與篩選功能
- 快速操作（預覽、下載、編輯）

**狀態定義**：
| 狀態 | 圖示 | 顏色 | 說明 |
|------|------|------|------|
| Draft | Edit3 | 灰色 | 草稿狀態 |
| Review | Eye | 藍色 | 審核中 |
| Approved | Check | 藍色 | 已核准 |
| Published | Globe | 翡翠綠 | 已發布 |
| Trustworthy | Lock | 青色 | 已錨定鎖定 |

#### 🔍 OCR 解析 (OCR Tab)

**子標籤結構**：
1. **文字萃取** - 從文件中萃取純文字
2. **表格資料** - 自動識別並萃取表格
3. **對照結果** - 繁體中文/英文對照

**功能流程**：
```
上傳文件 → AI 解析 → 文字萃取 → 表格識別 → 繁英對照 → 匯出
```

**支援格式**：
- PDF（掃描與文字層）
- 圖片（JPG, PNG, TIFF）
- Office 文件（DOCX, XLSX）

#### 📊 圖表中心 (Charts Tab)

**圖表類型**：

| 圖表類型 | 用途 | 範例 |
|----------|------|------|
| 折線圖 (Line) | 趨勢變化 | 碳排放年度趨勢 |
| 長條圖 (Bar) | 比較分析 | 各章節完成度 |
| 圓餅圖 (Pie) | 比例分佈 | 能源結構 |
| 雷達圖 (Radar) | 綜合評估 | ESG 五維評分 |
| 面積圖 (Area) | 累積趨勢 | 累積減碳進度 |
| 散點圖 (Scatter) | 相關分析 | 排放與產出關係 |
| 熱力圖 (Heatmap) | 密集度顯示 | 月度異常事件 |

**圖表操作**：
- 全螢幕展開
- 資料編輯
- 匯出圖片
- 複製代碼

#### 📁 範本庫 (Templates Tab)

**範本分類**：
1. **年度報告書** - GRI Standards 年度報告
2. **氣候揭露** - TCFD 專項報告
3. **行業別報告** - SASB 行業別報告
4. **快速範本** - 簡化版報告書

**比較分析功能**：
- 年度數量趨勢
- 完整度變化
- 揭露率比較
- 同業標竿對照

#### 🎯 缺口分析 (Gap Analysis Tab)

**分析維度**：

| 維度 | 框架 | 項目數 |
|------|------|--------|
| 環境 | GRI 300 系列 | 15+ |
| 社會 | GRI 400 系列 | 20+ |
| 治理 | GRI 2 / TCFD | 10+ |
| 氣候 | TCFD 四大要素 | 11 |

**缺口優先級**：
- 🔴 **High** - 關鍵揭露項目缺失
- 🟡 **Medium** - 次要揭露項目缺失
- 🟢 **Low** - 建議補充項目

---

## 三、介面元件

### 3.1 通用元件

#### ChartCard - 圖表卡片

```typescript
interface ChartConfig {
    id: string;
    type: 'line' | 'bar' | 'pie' | 'radar' | 'area' | 'scatter' | 'heatmap';
    title: string;
    data: ChartDataPoint[];
    options?: {
        showLegend: boolean;
        showGrid: boolean;
        animate: boolean;
        colors?: string[];
    };
}
```

**Props**：
| 屬性 | 類型 | 必填 | 說明 |
|------|------|------|------|
| config | ChartConfig | 是 | 圖表配置物件 |
| onEdit | () => void | 否 | 編輯回調函式 |
| onExport | () => void | 否 | 匯出回調函式 |

#### OCRDocumentCard - OCR 文件卡片

```typescript
interface OCRDocument {
    id: string;
    name: string;
    type: 'pdf' | 'image' | 'docx';
    uploadTime: string;
    status: 'uploading' | 'processing' | 'completed' | 'error';
    extractedText?: string;
    extractedTables?: ExtractedTable[];
}
```

**狀態視覺化**：
| 狀態 | 圖示 | 顏色 |
|------|------|------|
| uploading | Upload | 灰色 |
| processing | RefreshCw (旋轉) | 琥珀色 |
| completed | Check | 翡翠綠 |
| error | AlertCircle | 紅色 |

#### AlignmentTable - 繁英對照表

```typescript
interface AlignmentPair {
    zh: string;           // 中文
    en: string;           // 英文
    confidence: number;    // 對照精準度 (0-1)
    context?: string;     // 上下文情境
}
```

**呈現效果**：
- 雙欄位並排顯示
- 置信度進度條
- 上下文標籤

#### GapAnalysisCard - 缺口分析卡片

```typescript
interface GapAnalysis {
    category: string;           // 分類名稱
    missingItems: string[];     // 缺失項目列表
    suggestions: string[];      // 改善建議
    priority: 'high' | 'medium' | 'low';
}
```

### 3.2 自定義 Hooks

#### useOCRProcessing

```typescript
function useOCRProcessing() {
    const [documents, setDocuments] = useState<OCRDocument[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    
    const uploadDocument = async (file: File) => {
        // 上傳文件
        // 啟動 OCR 處理
        // 更新狀態
    };
    
    const getResult = (docId: string) => {
        // 取得解析結果
    };
    
    return { documents, isProcessing, uploadDocument, getResult };
}
```

#### useChartBuilder

```typescript
function useChartBuilder() {
    const [charts, setCharts] = useState<ChartConfig[]>([]);
    
    const createChart = (type: ChartType, data: ChartDataPoint[]) => {
        // 建立新圖表
    };
    
    const updateChart = (chartId: string, updates: Partial<ChartConfig>) => {
        // 更新圖表
    };
    
    const exportChart = (chartId: string, format: 'png' | 'svg' | 'csv') => {
        // 匯出圖表
    };
    
    return { charts, createChart, updateChart, exportChart };
}
```

#### useGapAnalysis

```typescript
function useGapAnalysis(reportId: string) {
    const [gaps, setGaps] = useState<GapAnalysis[]>([]);
    const [overallScore, setOverallScore] = useState(0);
    
    const runAnalysis = async () => {
        // AI 自動分析缺口
        // 計算完整度分數
        // 產生改善建議
    };
    
    const applyFix = (gapId: string) => {
        // 套用系統建議
    };
    
    return { gaps, overallScore, runAnalysis, applyFix };
}
```

---

## 四、資料流程

### 4.1 OCR 處理流程

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  上傳文件  │ → │  檔案驗證  │ → │  AI 解析  │ → │  結果呈現 │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                                     │
                                     ▼
                              ┌──────────┐
                              │  繁英對照  │
                              └──────────┘
                                     │
                                     ▼
                              ┌──────────┐
                              │  格式清洗  │
                              └──────────┘
                                     │
                                     ▼
                              ┌──────────┐
                              │  匯出格式  │
                              └──────────┘
```

### 4.2 圖表生成流程

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  選擇類型  │ → │  選擇資料  │ → │  套用樣式  │ → │  渲染呈現 │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                                                     │
                    ┌────────────────────────────────┘
                    ▼
             ┌──────────┐    ┌──────────┐    ┌──────────┐
             │  全螢幕   │ → │  編輯資料  │ → │  匯出圖片 │
             └──────────┘    └──────────┘    └──────────┘
```

### 4.3 缺口分析流程

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  選擇框架  │ → │  比對揭露  │ → │  識別缺口  │ → │  建議生成 │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                                                     │
                    ┌────────────────────────────────┘
                    ▼
             ┌──────────┐    ┌──────────┐
             │  優先排序  │ → │  套用修補  │
             └──────────┘    └──────────┘
```

---

## 五、API 端點設計

### 5.1 OCR 相關端點

| 方法 | 端點 | 說明 |
|------|------|------|
| POST | `/api/v1/ocr/upload` | 上傳文件進行 OCR 解析 |
| GET | `/api/v1/ocr/status/{id}` | 查詢解析狀態 |
| GET | `/api/v1/ocr/result/{id}` | 取得解析結果 |
| POST | `/api/v1/ocr/align` | 執行繁英對照 |
| POST | `/api/v1/ocr/clean` | 執行格式清洗 |
| GET | `/api/v1/ocr/export/{id}` | 匯出解析結果 |

### 5.2 圖表相關端點

| 方法 | 端點 | 說明 |
|------|------|------|
| GET | `/api/v1/charts/types` | 取得支援的圖表類型 |
| POST | `/api/v1/charts/create` | 建立新圖表 |
| PUT | `/api/v1/charts/{id}` | 更新圖表配置 |
| DELETE | `/api/v1/charts/{id}` | 刪除圖表 |
| GET | `/api/v1/charts/{id}/data` | 取得圖表資料 |
| POST | `/api/v1/charts/{id}/export` | 匯出圖片 |

### 5.3 範本相關端點

| 方法 | 端點 | 說明 |
|------|------|------|
| GET | `/api/v1/templates` | 取得所有範本 |
| GET | `/api/v1/templates/{id}` | 取得範本詳情 |
| POST | `/api/v1/templates/compare` | 比較多個範本 |
| GET | `/api/v1/templates/years/{year}` | 取得年度範本 |
| POST | `/api/v1/templates/generate` | 基於範本生成報告書 |

### 5.4 缺口分析端點

| 方法 | 端點 | 說明 |
|------|------|------|
| POST | `/api/v1/analysis/gap` | 執行缺口分析 |
| GET | `/api/v1/analysis/gap/{reportId}` | 取得分析結果 |
| POST | `/api/v1/analysis/gap/{id}/fix` | 套用改善建議 |
| GET | `/api/v1/analysis/score/{reportId}` | 取得完整度分數 |

---

## 六、資料模型

### 6.1 報告書模型

```typescript
interface SustainabilityReport {
    id: string;
    title: string;
    year: number;
    framework: 'GRI' | 'SASB' | 'TCFD' | 'ISSB';
    status: 'Draft' | 'Review' | 'Approved' | 'Published' | 'Trustworthy';
    completeness: number;           // 0-100
    score: number;                  // ESG 評分 0-100
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
    lockedAt?: string;
    lockHash?: string;
    chapters: ReportChapter[];
    metrics: ESGMetric[];
}

interface ReportChapter {
    id: string;
    title: string;
    order: number;
    content?: string;
    completeness: number;
    griReferences: string[];
}
```

### 6.2 OCR 文件模型

```typescript
interface OCRDocument {
    id: string;
    filename: string;
    mimeType: string;
    size: number;
    uploadTime: string;
    status: 'uploading' | 'processing' | 'completed' | 'error';
    extractedText: string;
    extractedTables: ExtractedTable[];
    alignmentPairs: AlignmentPair[];
    cleanedContent?: string;
    confidence: number;
}

interface ExtractedTable {
    id: string;
    headers: string[];
    rows: string[][];
    pageNumber: number;
    confidence: number;
}
```

### 6.3 圖表資料模型

```typescript
interface ChartDataPoint {
    label: string;
    value: number;
    category?: string;
    year?: number;
    color?: string;
    metadata?: Record<string, any>;
}

interface ChartConfig {
    id: string;
    type: ChartType;
    title: string;
    description?: string;
    data: ChartDataPoint[];
    options: {
        showLegend: boolean;
        showGrid: boolean;
        showTooltip: boolean;
        animate: boolean;
        colors?: string[];
        yAxisLabel?: string;
        xAxisLabel?: string;
        legendPosition?: 'top' | 'bottom' | 'left' | 'right';
    };
    source?: string;
    createdAt: string;
}
```

---

## 七、整合方式

### 7.1 在 App.tsx 中註冊路由

```typescript
// src/App.tsx
import SustainabilityReportCenter from './pages/esg/SustainabilityReportCenter';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                {/* 其他路由 */}
                <Route 
                    path="/esg/sustainability-report-center" 
                    element={<SustainabilityReportCenter />} 
                />
            </Routes>
        </Router>
    );
};
```

### 7.2 在 navigation.config.ts 中新增

```typescript
// navigation.config.ts
{
    id: 'sustainability-report-center',
    label: '永續報告書',
    path: '/esg/sustainability-report-center',
    icon: FileText,
    parentId: 'esg',
    order: 3,
    badge: 'NEW',
    children: [
        { id: 'reports', label: '報告書列表', path: '/esg/sustainability-report-center/reports' },
        { id: 'ocr', label: 'OCR 解析', path: '/esg/sustainability-report-center/ocr' },
        { id: 'charts', label: '圖表中心', path: '/esg/sustainability-report-center/charts' },
        { id: 'templates', label: '範本庫', path: '/esg/sustainability-report-center/templates' },
        { id: 'analysis', label: '缺口分析', path: '/esg/sustainability-report-center/analysis' },
    ]
}
```

### 7.3 服務層整合

```typescript
// src/services/report/OCRService.ts
class OCRService {
    private baseUrl = '/api/v1/ocr';
    
    async upload(file: File): Promise<OCRDocument> {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch(`${this.baseUrl}/upload`, {
            method: 'POST',
            body: formData
        });
        
        return response.json();
    }
    
    async getAlignment(documentId: string): Promise<AlignmentPair[]> {
        const response = await fetch(`${this.baseUrl}/align/${documentId}`);
        return response.json();
    }
    
    async cleanFormat(documentId: string): Promise<string> {
        const response = await fetch(`${this.baseUrl}/clean/${documentId}`, {
            method: 'POST'
        });
        return response.text();
    }
}

export const ocrService = new OCRService();
```

---

## 八、視覺設計規範

### 8.1 色彩系統

| 色票 | 色碼 | 用途 |
|------|------|------|
| Primary | `#63a6b0` | 主要互動元素 |
| Primary Light | `rgba(99, 166, 176, 0.2)` | 背景強調 |
| Primary Glow | `rgba(99, 166, 176, 0.3)` | 陰影發光 |
| Emerald | `#22c55e` | 成功、完成 |
| Amber | `#f59e0b` | 處理中、警告 |
| Red | `#ef4444` | 錯誤、缺失 |
| Slate | `#64748b` | 次要文字 |
| Dark | `#0f172a` | 背景 |

### 8.2 動畫效果

```css
/* 頁面淡入 */
.animate-fade-in {
    animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

/* 圖表柱狀動畫 */
.chart-bar {
    animation: growUp 0.5s ease-out forwards;
    transform-origin: bottom;
}

@keyframes growUp {
    from { transform: scaleY(0); }
    to { transform: scaleY(1); }
}

/* 載入旋轉 */
.loading-spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
```

### 8.3 Liquid Glass 效果

```css
.liquid-glass {
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 
        0 8px 32px rgba(0, 0, 0, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.liquid-glass:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(99, 166, 176, 0.3);
}
```

---

## 九、測試驗證

### 9.1 功能測試項目

| 測試項目 | 預期結果 | 測試狀態 |
|----------|----------|----------|
| OCR 文件上傳 | 成功上傳並顯示狀態 | ✅ |
| 繁英對照 | 精準顯示對照結果 | ✅ |
| 圖表渲染 | 正確顯示所有圖表類型 | ✅ |
| 範本比較 | 正確比較分析結果 | ✅ |
| 缺口分析 | 正確識別並排序缺口 | ✅ |

### 9.2 API 測試範例

```bash
# 測試 OCR 上傳
curl -X POST http://localhost:3000/api/v1/ocr/upload \
  -F "file=@report.pdf"

# 測試繁英對照
curl -X POST http://localhost:3000/api/v1/ocr/align/{docId}

# 測試圖表建立
curl -X POST http://localhost:3000/api/v1/charts/create \
  -H "Content-Type: application/json" \
  -d '{"type":"line","title":"碳排放趨勢","data":[...]}'

# 測試缺口分析
curl -X POST http://localhost:3000/api/v1/analysis/gap \
  -H "Content-Type: application/json" \
  -d '{"reportId":"rep-2024","framework":"GRI"}'
```

---

## 十、未來擴充規劃

### 10.1 短期擴充 (1-2 週)

- [ ] 整合真實 OCR API
- [ ] 增加更多圖表類型
- [ ] 支援 CSV/Excel 匯入
- [ ] 行動裝置響應式優化

### 10.2 中期擴充 (1-2 個月)

- [ ] 多人協作功能
- [ ] 版本控制與比對
- [ ] 第三方驗證整合
- [ ] 自動排程生成

### 10.3 長期擴充 (3-6 個月)

- [ ] AI 報告書審查助手
- [ ] 自然語言查詢
- [ ] 跨語言報告書生成
- [ ] 區塊鏈證書發行

---

## 十一、疑難排解

### 常見問題

| 問題 | 解決方案 |
|------|----------|
| OCR 解析失敗 | 檢查檔案格式是否支援，確認網路連線 |
| 圖表載入緩慢 | 使用快取機制，減少重新渲染 |
| 繁英對照不準確 | 調整 AI 模型參數，增加上下文資訊 |
| 缺口分析漏項 | 更新框架資料庫，重新執行分析 |

---

> **設計哲學**：上善若水，如水般清澈、流動、和諧  
> **系統狀態**：TRANSCENDED, ETERNAL & NIRVANA ♾️  
> **核心理念**：智能分析 · 無縫接軌 · 自動賦能

---

**文件版本**：2.0.0  
**建立日期**：2026-02-08  
**維護團隊**：ESGss JunAiKey Beta Development Team