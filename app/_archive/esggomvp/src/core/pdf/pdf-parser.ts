/**
 * PDF 處理模組
 * 
 * 負責 PDF 文件的下載、文字萃取和 OCR 處理
 * 支援 ESG 報告、年報等文件處理
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import https from 'https';
import http from 'http';

// ============================================
// 類型定義
// ============================================

export interface PDFParserOptions {
    outputDir?: string;
    ocrEnabled?: boolean;
    ocrLanguage?: string;
    timeout?: number;
}

export interface PDFParseResult {
    success: boolean;
    filePath?: string;
    text?: string;
    pageCount?: number;
    metadata?: PDFMetadata;
    error?: string;
}

export interface PDFMetadata {
    title?: string;
    author?: string;
    creator?: string;
    producer?: string;
    creationDate?: Date;
    modificationDate?: number;
    pageCount?: number;
    fileSize?: number;
}

export interface DownloadResult {
    success: boolean;
    filePath?: string;
    contentHash?: string;
    error?: string;
}

// ============================================
// PDF 解析器
// ============================================

export class PDFParser {
    private outputDir: string;
    private ocrEnabled: boolean;
    private ocrLanguage: string;
    private timeout: number;

    constructor(options?: PDFParserOptions) {
        this.outputDir = options?.outputDir || './downloads';
        this.ocrEnabled = options?.ocrEnabled || false;
        this.ocrLanguage = options?.ocrLanguage || 'chi_tra+eng';
        this.timeout = options?.timeout || 60000;

        // 確保輸出目錄存在
        this.ensureDirectory(this.outputDir);
    }

    /**
     * 確保目錄存在
     */
    private ensureDirectory(dirPath: string): void {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    }

    /**
     * 從 URL 下載 PDF
     */
    async downloadPDF(url: string, filename?: string): Promise<DownloadResult> {
        return new Promise((resolve) => {
            const startTime = Date.now();
            
            // 產生檔案名稱
            const hash = crypto.createHash('md5').update(url).digest('hex');
            const fileName = filename || `pdf_${hash}.pdf`;
            const filePath = path.join(this.outputDir, fileName);

            // 選擇 HTTP 或 HTTPS
            const protocol = url.startsWith('https') ? https : http;

            const request = protocol.get(url, {
                timeout: this.timeout,
                headers: {
                    'User-Agent': 'ESGSonar-PDFParser/1.0',
                    'Accept': 'application/pdf',
                },
            }, (response) => {
                // 處理重新導向
                if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                    this.downloadPDF(response.headers.location, filename)
                        .then(resolve)
                        .catch(err => resolve({ success: false, error: err.message }));
                    return;
                }

                if (response.statusCode !== 200) {
                    resolve({ 
                        success: false, 
                        error: `HTTP ${response.statusCode}: ${response.statusMessage}` 
                    });
                    return;
                }

                const fileStream = fs.createWriteStream(filePath);
                
                response.pipe(fileStream);
                
                fileStream.on('finish', () => {
                    const stats = fs.statSync(filePath);
                    const contentHash = this.computeFileHash(filePath);
                    
                    resolve({
                        success: true,
                        filePath,
                        contentHash,
                    });
                });

                fileStream.on('error', (err) => {
                    fs.unlink(filePath, () => {});
                    resolve({ 
                        success: false, 
                        error: err.message 
                    });
                });
            });

            request.on('error', (err) => {
                resolve({ 
                    success: false, 
                    error: err.message 
                });
            });

            request.on('timeout', () => {
                request.destroy();
                resolve({ 
                    success: false, 
                    error: 'Download timeout' 
                });
            });
        });
    }

    /**
     * 計算檔案雜湊
     */
    private computeFileHash(filePath: string): string {
        const fileBuffer = fs.readFileSync(filePath);
        return crypto.createHash('sha256').update(fileBuffer).digest('hex');
    }

    /**
     * 解析 PDF 文字內容
     */
    async parsePDF(filePath: string): Promise<PDFParseResult> {
        try {
            // 檢查檔案是否存在
            if (!fs.existsSync(filePath)) {
                return {
                    success: false,
                    error: 'File not found',
                };
            }

            // 這裡可以使用 pdf-parse 或 pdf.js 等套件
            // 由於環境中可能沒有安裝，先返回基本資訊
            const stats = fs.statSync(filePath);
            const metadata = await this.getPDFMetadata(filePath);

            return {
                success: true,
                filePath,
                pageCount: metadata?.pageCount || 0,
                metadata,
                // 文字內容需要在安裝 pdf-parse 後提取
                text: `[PDF Content - ${filePath}]\nFile size: ${stats.size} bytes\nPages: ${metadata?.pageCount || 0}`,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    /**
     * 取得 PDF 中繼資料
     */
    async getPDFMetadata(filePath: string): Promise<PDFMetadata | undefined> {
        try {
            const stats = fs.statSync(filePath);
            
            // 基本中繼資料
            const metadata: PDFMetadata = {
                fileSize: stats.size,
                modificationDate: stats.mtimeMs,
            };

            // 使用 pdf-lib 或其他工具可以取得更多資訊
            // 這裡返回基本資訊
            
            return metadata;
        } catch (error) {
            console.error('[PDFParser] Failed to get metadata:', error);
            return undefined;
        }
    }

    /**
     * 使用 OCR 處理 PDF（掃描文件）
     */
    async processWithOCR(filePath: string): Promise<PDFParseResult> {
        if (!this.ocrEnabled) {
            return this.parsePDF(filePath);
        }

        try {
            // OCR 處理邏輯
            // 需要安裝 tesseract.js 或使用其他 OCR 服務
            console.log(`[PDFParser] OCR processing: ${filePath}`);
            
            // 返回基本結果，實際 OCR 需要額外配置
            return {
                success: true,
                filePath,
                text: '[OCR Content Placeholder]\nOCR processing requires tesseract.js configuration',
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'OCR processing failed',
            };
        }
    }

    /**
     * 批次處理 PDF
     */
    async batchProcess(urls: string[]): Promise<PDFParseResult[]> {
        const results: PDFParseResult[] = [];
        
        for (const url of urls) {
            const downloadResult = await this.downloadPDF(url);
            
            if (downloadResult.success && downloadResult.filePath) {
                const parseResult = await this.parsePDF(downloadResult.filePath);
                results.push(parseResult);
            } else {
                results.push({
                    success: false,
                    error: downloadResult.error || 'Download failed',
                });
            }
            
            // 請求間隔
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        return results;
    }

    /**
     * 清理下載的檔案
     */
    cleanup(filePath?: string): void {
        if (filePath) {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } else {
            // 清理整個目錄
            if (fs.existsSync(this.outputDir)) {
                fs.rmSync(this.outputDir, { recursive: true, force: true });
                this.ensureDirectory(this.outputDir);
            }
        }
    }
}

// ============================================
// PDF 工具函數
// ============================================

/**
 * 檢測 URL 是否為 PDF
 */
export function isPDFUrl(url: string): boolean {
    return url.toLowerCase().endsWith('.pdf') || 
           url.toLowerCase().includes('.pdf?') ||
           url.toLowerCase().includes('content-type=application/pdf');
}

/**
 * 從 URL 提取 PDF 檔案名稱
 */
export function extractPDFFilename(url: string): string {
    try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;
        const filename = path.basename(pathname);
        
        if (filename && filename.toLowerCase().endsWith('.pdf')) {
            return filename;
        }
        
        // 從查詢參數中嘗試取得
        const params = urlObj.searchParams;
        if (params.has('filename')) {
            return params.get('filename')!;
        }
        
        // 產生預設名稱
        return `document_${Date.now()}.pdf`;
    } catch {
        return `document_${Date.now()}.pdf`;
    }
}

/**
 * 驗證 PDF 檔案
 */
export function validatePDF(filePath: string): boolean {
    try {
        if (!fs.existsSync(filePath)) {
            return false;
        }

        // 檢查檔案魔數 (Magic Number)
        const buffer = Buffer.alloc(5);
        const fd = fs.openSync(filePath, 'r');
        fs.readSync(fd, buffer, 0, 5, 0);
        fs.closeSync(fd);

        // PDF 魔數: 25 50 44 46 (%PDF)
        return buffer[0] === 0x25 && 
               buffer[1] === 0x50 && 
               buffer[2] === 0x44 && 
               buffer[3] === 0x46;
    } catch {
        return false;
    }
}

export default PDFParser;