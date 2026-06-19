declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | number[];
    filename?: string;
    image?: { type?: string; quality?: number };
    enableLinks?: boolean;
    html2canvas?: any;
    jsPDF?: any;
  }

  interface Html2PdfWorker {
    from(element: HTMLElement | string): Html2PdfWorker;
    set(options: Html2PdfOptions): Html2PdfWorker;
    save(filename?: string): Promise<void>;
    toPdf(): Html2PdfWorker;
    getPdf(cb: (pdf: any) => void): Html2PdfWorker;
    output(type: string, options?: any): Promise<any>;
    outputImg(type: string, options?: any): Promise<any>;
  }

  function html2pdf(): Html2PdfWorker;
  export default html2pdf;
}
