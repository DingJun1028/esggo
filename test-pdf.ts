import path from 'path';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { PDFParser } from './lib/sonar/core/pdf-parser.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runTests() {
  console.log('🚀 開始 PDF 測試...');
  
  const parser = new PDFParser();
  
  // 測試 1: 內嵌完整 PDF
  console.log('\n--- 測試 1: 內嵌完整 PDF ---');
  const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 44 >>
stream
BT
/F1 24 Tf
100 700 Td
(Hello ESG GO World!) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000266 00000 n 
0000000360 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
437
%%EOF`;

  const buffer = Buffer.from(pdfContent, 'ascii');
  console.log('✓ 檔案大小:', buffer.length, 'bytes');
  
  const isValid = parser.verify(buffer);
  console.log('✓ PDF 驗證:', isValid);
  
  try {
    const metadata = await parser.getMetadata(buffer);
    console.log('✓ 元資料:', JSON.stringify(metadata, null, 2));
  } catch (e: any) {
    console.log('⚠️ 元資料:', e.message);
  }
  
  try {
    const text = await parser.extractText(buffer);
    console.log('✓ 文字長度:', text.length);
    console.log('✓ 文字預覽:', text.substring(0, 200));
  } catch (e: any) {
    console.log('⚠️ 文字提取:', e.message);
  }
  
  // 測試 2: sample-evidence.pdf
  console.log('\n--- 測試 2: sample-evidence.pdf ---');
  const testPdfPath = path.resolve(__dirname, 'public/sample-evidence.pdf');
  console.log('📂 路徑:', testPdfPath);
  console.log('📂 存在:', existsSync(testPdfPath));
  
  if (existsSync(testPdfPath)) {
    const fileBuffer = readFileSync(testPdfPath);
    console.log('✓ 檔案大小:', fileBuffer.length, 'bytes');
    console.log('✓ PDF 驗證:', parser.verify(fileBuffer));
    
    try {
      await parser.getMetadata(fileBuffer);
      console.log('✓ 元資料解析成功');
    } catch (e: any) {
      console.log('⚠️ 元資料解析失敗:', e.message);
      console.log('   → 這個 PDF 檔案結構太簡單（54 bytes，缺少 xref table），pdfjs-dist@6.x 無法解析');
    }
    
    try {
      await parser.extractText(fileBuffer);
      console.log('✓ 文字提取成功');
    } catch (e: any) {
      console.log('⚠️ 文字提取失敗:', e.message);
    }
  }
  
  console.log('\n🎉 測試完成');
}

runTests();
