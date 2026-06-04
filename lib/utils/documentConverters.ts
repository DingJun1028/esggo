import html2pdf from 'html2pdf.js';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import TurndownService from 'turndown';

// PDF 轉換
export const convertHtmlToPdf = async (htmlContent: string, filename: string = 'document.pdf') => {
  const element = document.createElement('div');
  element.innerHTML = htmlContent; // html2pdf 可以直接從 HTML 字符串生成
  
  const options = {
    margin: 1,
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
  };

  try {
    const pdf = await html2pdf().from(element).set(options).outputPdf('datauristring');
    const link = document.createElement('a');
    link.href = pdf;
    link.download = filename;
    link.click();
    return { success: true, message: 'PDF 匯出成功' };
  } catch (error) {
    console.error('PDF 匯出失敗:', error);
    return { success: false, message: `PDF 匯出失敗: ${error}` };
  }
};

// DOCX 轉換
export const convertHtmlToDocx = async (htmlContent: string, filename: string = 'document.docx') => {
  // DOCX 轉換比較複雜，因為 docx 庫不是直接從 HTML 轉換。
  // 這裡需要將 HTML 內容轉換為 DOCX 庫的結構。
  // 為了簡化，目前只將純文本內容放入 DOCX。更完善的轉換需要更複雜的解析。
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          children: [
            new TextRun(htmlContent.replace(/<[^>]*>/g, '')), // 暫時只提取純文本
          ],
        }),
      ],
    }],
  });

  try {
    const buffer = await Packer.toBuffer(doc);
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    return { success: true, message: 'DOCX 匯出成功' };
  } catch (error) {
    console.error('DOCX 匯出失敗:', error);
    return { success: false, message: `DOCX 匯出失敗: ${error}` };
  }
};

// HTML 到 Markdown 轉換
const turndownService = new TurndownService();
export const convertHtmlToMarkdown = (htmlContent: string): string => {
  return turndownService.turndown(htmlContent);
};

// HTML 到純文本轉換 (透過獲取編輯器 getText 內容)
export const convertHtmlToPlainText = (htmlContent: string): string => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  return tempDiv.textContent || tempDiv.innerText || '';
};
