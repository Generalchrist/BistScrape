declare module "pdf-parse" {
  interface PDFParseResult {
    text: string;
    numpages: number;
    numrender: number;
    info: any;
    metadata: any;
    version: string;
  }

  function pdf(
    data: Buffer | Uint8Array,
    options?: any
  ): Promise<PDFParseResult>;

  export = pdf;
}
