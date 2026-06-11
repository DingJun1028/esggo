declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | number[];
    filename?: string;
    image?: { type?: string; quality?: number };
    html2canvas?: Record<string, unknown>;
    jsPDF?: { unit?: string; format?: string; orientation?: string };
    pagebreak?: { mode?: string | string[] };
  }

  interface Html2Pdf {
    set(options: Html2PdfOptions): Html2Pdf;
    from(element: HTMLElement | string): Html2Pdf;
    save(): Promise<void>;
    output(type: string): Promise<Blob | string>;
    toPdf(): Html2Pdf;
    toCanvas(): Html2Pdf;
    toImg(): Html2Pdf;
  }

  function html2pdf(): Html2Pdf;
  function html2pdf(element: HTMLElement | string, options?: Html2PdfOptions): Html2Pdf;

  export = html2pdf;
}
