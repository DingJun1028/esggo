import * as fs from 'fs';
import * as path from 'path';

async function testPdfParse() {
  const filePath = path.join(process.cwd(), 'public', 'sample-evidence.pdf');
  const buffer = fs.readFileSync(filePath);
  
  let content = '';
  try {
    const mod = await import('pdf-parse');
    const PDFParseClass = mod.PDFParse || (mod as any).default?.PDFParse;
    
    if (!PDFParseClass) throw new Error('PDFParse class not found in pdf-parse module');

    const parser = new PDFParseClass({ data: buffer });
    const pdfData = await parser.getText();
    content = pdfData.text;
    console.log("SUCCESS! Length:", content.length);
    console.log(content.substring(0, 100));
  } catch (error: any) {
    console.error('Failed to parse PDF:', error.message);
  }
}

testPdfParse();