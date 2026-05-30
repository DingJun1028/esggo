import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

interface ExportChapter {
  id: string;
  title: string;
}

interface WorkerData {
  chapters: ExportChapter[];
  generatedContent: Record<string, string>;
}

self.onmessage = async (event: MessageEvent) => {
  const { chapters, generatedContent } = event.data as WorkerData;

  try {
    const children: Paragraph[] = [];
    children.push(
      new Paragraph({
        text: 'ESG 永續報告書 2026',
        heading: HeadingLevel.TITLE,
        pageBreakBefore: false,
      })
    );

    chapters.forEach((chap: ExportChapter) => {
      children.push(
        new Paragraph({ text: chap.title, heading: HeadingLevel.HEADING_1, pageBreakBefore: true })
      );
      const content =
        generatedContent[chap.id] || `【尚未生成 ${chap.title} 內容，請先至編輯器進行深度擴充】`;
      const lines = content.split('\n');

      lines.forEach((line: string) => {
        if (line.startsWith('## ')) {
          children.push(
            new Paragraph({ text: line.replace('## ', ''), heading: HeadingLevel.HEADING_2 })
          );
        } else if (line.startsWith('### ')) {
          children.push(
            new Paragraph({ text: line.replace('### ', ''), heading: HeadingLevel.HEADING_3 })
          );
        } else if (line.trim() !== '' && !line.startsWith('>')) {
          children.push(new Paragraph({ children: [new TextRun(line)] }));
        }
      });
    });

    const doc = new Document({
      sections: [{ properties: {}, children }],
    });

    const blob = await Packer.toBlob(doc);

    // 成功後將打包好的 Blob 拋回給主執行緒
    self.postMessage({ status: 'success', blob });
  } catch (error) {
    // 發生錯誤時將錯誤訊息拋回
    self.postMessage({
      status: 'error',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
