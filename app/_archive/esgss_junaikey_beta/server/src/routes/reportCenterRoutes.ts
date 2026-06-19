/**
 * 📊 Report Center API Routes
 * 
 * API 路由：
 * - OCR 文件解析
 * - 圖表管理
 * - 範本管理
 * - 缺口分析
 * 
 * @version 1.0.0
 * @date 2026-02-08
 */

import { Router, Request, Response } from 'express';
import multer from 'multer';
import { 
    processOCR, getDocumentResult, generateAlignment, 
    cleanFormat, exportDocument, listUserDocuments, deleteDocument 
} from '../services/ocrService.js';
import { 
    createChart, getChart, updateChart, deleteChart as deleteChartSvc,
    listUserCharts, exportChartAsSVG, getDefaultChartTemplates 
} from '../services/chartService.js';

const router = Router();

// Configure multer for file uploads
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedMimes = ['application/pdf', 'image/jpeg', 'image/png', 
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'));
        }
    }
});

// ============== OCR Routes ==============

/**
 * POST /api/v1/report-center/ocr/upload
 * 上傳文件進行 OCR 解析
 */
router.post('/ocr/upload', upload.single('file'), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const userId = (req as any).user?.id || 'anonymous';
        const options = req.body.options ? JSON.parse(req.body.options) : {};

        const result = await processOCR({
            file: req.file.buffer,
            filename: req.file.originalname,
            mimeType: req.file.mimetype,
            userId,
            options
        });

        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/v1/report-center/ocr/status/:id
 * 取得文件解析狀態
 */
router.get('/ocr/status/:id', async (req: Request, res: Response) => {
    try {
        const result = getDocumentResult(req.params.id);
        if (!result) {
            return res.status(404).json({ error: 'Document not found' });
        }
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/v1/report-center/ocr/align/:id
 * 執行繁英對照
 */
router.post('/ocr/align/:id', async (req: Request, res: Response) => {
    try {
        const targetLanguage = req.body.targetLanguage || 'en';
        const alignments = await generateAlignment(req.params.id, targetLanguage);
        res.json({ documentId: req.params.id, alignments });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/v1/report-center/ocr/clean/:id
 * 執行格式清洗
 */
router.post('/ocr/clean/:id', async (req: Request, res: Response) => {
    try {
        const format = req.body.format || 'markdown';
        const cleanedContent = await cleanFormat(req.params.id, format);
        res.json({ documentId: req.params.id, format, cleanedContent });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/v1/report-center/ocr/export/:id
 * 匯出文件
 */
router.get('/ocr/export/:id', async (req: Request, res: Response) => {
    try {
        const format = req.query.format as string || 'txt';
        const content = await exportDocument(req.params.id, format as any);
        
        res.setHeader('Content-Type', format === 'json' ? 'application/json' : 'text/plain');
        res.setHeader('Content-Disposition', `attachment; filename="export.${format}"`);
        res.send(content);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/v1/report-center/ocr/documents
 * 列出用戶所有文件
 */
router.get('/ocr/documents', async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id || 'anonymous';
        const documents = listUserDocuments(userId);
        res.json({ documents });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * DELETE /api/v1/report-center/ocr/:id
 * 刪除文件
 */
router.delete('/ocr/:id', async (req: Request, res: Response) => {
    try {
        const success = deleteDocument(req.params.id);
        res.json({ success });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// ============== Chart Routes ==============

/**
 * GET /api/v1/report-center/charts/types
 * 取得支援的圖表類型
 */
router.get('/charts/types', (req: Request, res: Response) => {
    res.json({
        types: [
            { id: 'line', name: '折線圖', description: '適合顯示趨勢變化' },
            { id: 'bar', name: '長條圖', description: '適合比較不同類別' },
            { id: 'pie', name: '圓餅圖', description: '適合顯示比例分布' },
            { id: 'radar', name: '雷達圖', description: '適合多維度評估' },
            { id: 'area', name: '面積圖', description: '適合累積趨勢' },
            { id: 'scatter', name: '散點圖', description: '適合相關性分析' },
            { id: 'heatmap', name: '熱力圖', description: '適合密集度顯示' },
        ]
    });
});

/**
 * GET /api/v1/report-center/charts/templates
 * 取得圖表範本
 */
router.get('/charts/templates', (req: Request, res: Response) => {
    const templates = getDefaultChartTemplates();
    res.json({ templates });
});

/**
 * POST /api/v1/report-center/charts
 * 建立新圖表
 */
router.post('/charts', async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id || 'anonymous';
        const chart = await createChart({ ...req.body, userId });
        res.json({ chart });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/v1/report-center/charts/:id
 * 取得圖表
 */
router.get('/charts/:id', async (req: Request, res: Response) => {
    try {
        const chart = getChart(req.params.id);
        if (!chart) {
            return res.status(404).json({ error: 'Chart not found' });
        }
        res.json({ chart });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * PUT /api/v1/report-center/charts/:id
 * 更新圖表
 */
router.put('/charts/:id', async (req: Request, res: Response) => {
    try {
        const chart = await updateChart(req.params.id, req.body);
        if (!chart) {
            return res.status(404).json({ error: 'Chart not found' });
        }
        res.json({ chart });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * DELETE /api/v1/report-center/charts/:id
 * 刪除圖表
 */
router.delete('/charts/:id', async (req: Request, res: Response) => {
    try {
        const success = deleteChartSvc(req.params.id);
        res.json({ success });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/v1/report-center/charts/:id/svg
 * 匯出圖表為 SVG
 */
router.get('/charts/:id/svg', async (req: Request, res: Response) => {
    try {
        const svg = exportChartAsSVG(req.params.id);
        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Content-Disposition', `inline; filename="chart-${req.params.id}.svg"`);
        res.send(svg);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/v1/report-center/charts
 * 列出用戶圖表
 */
router.get('/charts', async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id || 'anonymous';
        const reportId = req.query.reportId as string;
        const charts = listUserCharts(userId, reportId);
        res.json({ charts });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// ============== Template Routes ==============

/**
 * GET /api/v1/report-center/templates
 * 取得所有範本
 */
router.get('/templates', (req: Request, res: Response) => {
    res.json({
        templates: [
            { id: 'gri-annual', name: 'GRI 年度報告書', framework: 'GRI 2021', years: [2022, 2023, 2024] },
            { id: 'tcfd-report', name: 'TCFD 氣候揭露', framework: 'TCFD', years: [2023, 2024] },
            { id: 'sasb-industry', name: 'SASB 行業別報告', framework: 'SASB', years: [2024] },
            { id: 'integrated', name: '整合報告書', framework: 'GRI+TCFD', years: [2024] },
        ]
    });
});

/**
 * GET /api/v1/report-center/templates/:id
 * 取得範本詳情
 */
router.get('/templates/:id', (req: Request, res: Response) => {
    // Mock template data
    const templates: Record<string, any> = {
        'gri-annual': {
            id: 'gri-annual',
            name: 'GRI 年度報告書',
            framework: 'GRI 2021',
            chapters: [
                { id: 'intro', title: '執行長的話', required: true },
                { id: 'about', title: '關於我們', required: true },
                { id: 'governance', title: '公司治理', required: true },
                { id: 'environment', title: '環境永續', required: true },
                { id: 'social', title: '社會責任', required: true },
                { id: 'appendix', title: '附錄', required: false },
            ],
            griIndicators: ['GRI 2', 'GRI 302', 'GRI 305', 'GRI 306', 'GRI 401', 'GRI 403', 'GRI 405'],
        },
    };
    
    const template = templates[req.params.id];
    if (!template) {
        return res.status(404).json({ error: 'Template not found' });
    }
    res.json({ template });
});

/**
 * POST /api/v1/report-center/templates/compare
 * 比較多個範本
 */
router.post('/templates/compare', (req: Request, res: Response) => {
    const { templateIds, metrics } = req.body;
    
    // Mock comparison result
    res.json({
        comparison: {
            completeness: {
                '2022': 78,
                '2023': 85,
                '2024': 92,
            },
            score: {
                '2022': 75,
                '2023': 82,
                '2024': 88,
            },
            trends: {
                completeness: '+25%',
                score: '+17%',
            },
        }
    });
});

// ============== Gap Analysis Routes ==============

/**
 * POST /api/v1/report-center/analysis/gap
 * 執行缺口分析
 */
router.post('/analysis/gap', async (req: Request, res: Response) => {
    const { reportId, framework } = req.body;
    
    // Mock gap analysis result
    res.json({
        reportId,
        framework,
        gaps: [
            {
                category: 'GRI 302 能源',
                missingItems: ['能源密度指標', '再生能源佔比'],
                suggestions: ['補充能源使用密度計算', '增加再生能源憑證說明'],
                priority: 'high',
            },
            {
                category: 'GRI 305 排放',
                missingItems: ['範疇三排放'],
                suggestions: ['建立範疇三盤查機制', '納入供應商排放'],
                priority: 'high',
            },
            {
                category: 'TCFD 風險',
                missingItems: ['實體風險評估'],
                suggestions: ['補充氣候情境分析', '增加實體風險鑑別'],
                priority: 'medium',
            },
        ],
        scores: {
            environment: 92,
            social: 88,
            governance: 95,
            overall: 91,
        },
    });
});

/**
 * GET /api/v1/report-center/analysis/score/:reportId
 * 取得報告書完整度分數
 */
router.get('/analysis/score/:reportId', (req: Request, res: Response) => {
    // Mock score data
    res.json({
        reportId: req.params.reportId,
        scores: {
            overall: 91,
            environment: 92,
            social: 88,
            governance: 95,
            transparency: 90,
            innovation: 75,
        },
        trends: {
            overall: '+5%',
            environment: '+3%',
            social: '+2%',
        },
    });
});

export default router;
