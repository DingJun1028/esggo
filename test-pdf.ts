import path from 'path';
import fs from 'fs';
import { PDFParser } from './lib/sonar/core/pdf-parser';

async function runTests() {
  console.log('🚀 開始 PDF 測試...');
  
  try {
    const parser = new PDFParser();
    const testPdfPath = path.resolve('./public/sample-evidence.pdf');
    
    if (!fs.existsSync(testPdfPath)) {
      throw new Error(`PDF 檔案不存在: ${testPdfPath}`);
    }
    const buffer = fs.readFileSync(testPdfPath);
    
    const isValid = parser.verify(buffer);
    console.log('✓ PDF 驗證:', isValid);
    
    const metadata = await parser.getMetadata(buffer);
    console.log('✓ 元資料:', JSON.stringify(metadata, null, 2));
    
    const text = await parser.extractText(buffer);
    console.log('✓ 文字長度:', text.length);
    console.log('✓ 文字預覽:', text.substring(0, 200));
    
    console.log('🎉 測試全pass');
  } catch (error: any) {
    console.error('❌ 測試失敗:', error.message);
    console.error(error.stack);
  }
}

runTests();
