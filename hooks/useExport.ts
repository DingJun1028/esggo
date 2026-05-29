export interface ExportChapter {
  id: string;
  title: string;
}

export function useExport() {
  const exportDocx = async (
    chapters: ExportChapter[],
    generatedContent: Record<string, string>,
    showToast: (msg: string, type: 'success' | 'error' | 'info') => void
  ) => {
    showToast('開始彙整 250 頁 (30萬字) 永續報告文檔...', 'info');
    try {
      // 利用 modern bundler (如 Next.js/Webpack 5) 的原生 Worker 支援
      const worker = new Worker(new URL('../workers/exportDocx.worker.ts', import.meta.url));

      worker.onmessage = (event) => {
        const { status, blob, error } = event.data;
        if (status === 'success') {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'ESG_Sustainability_Report_2026.docx';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          showToast('匯出 Docx 成功！', 'success');
        } else {
          console.error('[Web Worker Error]:', error);
          showToast('匯出 Docx 失敗', 'error');
        }
        worker.terminate(); // 完成後立刻釋放記憶體
      };

      // 傳遞資料給 Worker 開始運算，主執行緒完全不卡頓
      worker.postMessage({ chapters, generatedContent });
    } catch (e) {
      console.error(e);
      showToast('匯出 Docx 失敗', 'error');
    }
  };

  const exportPdf = async (
    chapters: ExportChapter[],
    generatedContent: Record<string, string>,
    showToast: (msg: string, type: 'success' | 'error' | 'info') => void
  ) => {
    showToast('準備 PDF 匯出環境...', 'info');
    try {
      // 讓步給事件迴圈 (Yield to Event Loop)：
      // 強制主執行緒暫停 100 毫秒，讓瀏覽器有時間把上面的 showToast 畫面渲染出來。
      // 避免後續 html2pdf 高壓運算直接把畫面完全凍結在舊狀態。
      await new Promise(resolve => setTimeout(resolve, 100));

      const html2pdf = (await import('html2pdf.js' as any)).default;
      const element = document.createElement('div');

      element.className = 'print-container';
      element.innerHTML = `
        <style>
          .print-container { font-family: ui-sans-serif, system-ui, sans-serif; padding: 40px; color: #0f172a; }
          .print-title { text-align: center; font-size: 36px; font-weight: 900; margin-bottom: 60px; color: #06b6d4; }
          .print-chapter { page-break-before: always; }
          .print-chapter-title { color: #0891b2; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 24px; font-size: 24px; font-weight: 800; }
          .print-content { white-space: pre-wrap; font-size: 14px; line-height: 1.8; color: #334155; }
          .print-heading { font-weight: 800; color: #0f172a; margin-top: 20px; margin-bottom: 10px; font-size: 18px; }
        </style>
        <h1 class="print-title">ESG 永續報告書 2026</h1>
        ${chapters.map(c => `
          <div class="print-chapter">
            <h2 class="print-chapter-title">${c.title}</h2>
            <div class="print-content">
              ${(generatedContent[c.id] || '【尚未生成內容】').replace(/### /g, '<strong>').replace(/## /g, '<strong>').replace(/\n/g, '<br/>')}
            </div>
          </div>
        `).join('')}
      `;

      await html2pdf().from(element).set({
        margin: 15,
        filename: 'ESG_Sustainability_Report_2026.pdf',
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }).save();

      showToast('匯出 PDF 成功！', 'success');
    } catch (e) {
      console.error(e);
      showToast('匯出 PDF 失敗，請確認內容是否過長', 'error');
    }
  };

  const exportMarkdown = async (
    chapters: ExportChapter[],
    generatedContent: Record<string, string>,
    showToast: (msg: string, type: 'success' | 'error' | 'info') => void
  ) => {
    showToast('準備匯出 Markdown...', 'info');
    try {
      let mdContent = '# ESG 永續報告書 2026\n\n';
      chapters.forEach(c => {
        mdContent += `## ${c.title}\n\n`;
        mdContent += `${generatedContent[c.id] || '【尚未生成內容】'}\n\n`;
      });

      const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ESG_Sustainability_Report_2026.md';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showToast('匯出 Markdown 成功！', 'success');
    } catch (e) {
      console.error(e);
      showToast('匯出 Markdown 失敗', 'error');
    }
  };

  return { exportDocx, exportPdf, exportMarkdown };
}
