import { PDFParser } from './lib/sonar/core/pdf-parser.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

async function testPDFParser() {
  console.log('🧪 Testing PDF Parser...');
  
  const parser = new PDFParser();
  
  // Test with sample-evidence.pdf
  const testFilePath = './public/sample-evidence.pdf';
  console.log(`Testing file: ${testFilePath}`);
  
  try {
    const buffer = readFileSync(testFilePath);
    console.log('✓ File read successfully');
    
    // Verify PDF
    const isValid = parser.verify(buffer);
    console.log('✓ PDF verification:', isValid);
    
    if (!isValid) {
      console.log('❌ Not a valid PDF file');
      return;
    }
    
    // Extract metadata
    const metadata = await parser.getMetadata(buffer);
    console.log('✓ Metadata:', JSON.stringify(metadata, null, 2));
    
    // Extract text
    const text = await parser.extractText(buffer);
    console.log('✓ Text extraction successful');
    console.log(`✓ Text length: ${text.length} characters`);
    console.log('✓ Text preview:', text.substring(0, 200));
    
    console.log('🎉 All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
  }
}

testPDFParser();