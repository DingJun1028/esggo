import { BaseCrawler, CrawlResult } from './base-crawler';
import { HashLock } from '../core/hash-lock';
import { PDFParser } from '../core/pdf-parser';

/**
 * ESGSonar | TWSE ESG Report Crawler
 */
export class TWSECrawler extends BaseCrawler {
  private pdfParser = new PDFParser();

  async crawl(config: { url: string }): Promise<CrawlResult> {
    return this.withRetry(async () => {
      const browser = await this.initBrowser();
      const context = await browser.newContext();
      const page = await context.newPage();
      
      await page.goto(config.url, { waitUntil: 'networkidle' });
      
      // Simulated dynamic parsing for TWSE ESG Platform
      const items = await page.evaluate(() => {
        const rows = Array.from(document.querySelectorAll('.report-table tr'));
        return rows.map(r => ({
          company: r.querySelector('.comp-name')?.textContent?.trim(),
          reportType: 'ESG Report',
          year: 2024,
          pdfUrl: r.querySelector('a.pdf-link')?.getAttribute('href')
        })).filter(i => i.company);
      });

      // Optionally, if PDF URLs were found, parse them.
      // (This is skipped for items without a pdfUrl or if the URL is relative)
      for (const item of items) {
        if (item.pdfUrl && item.pdfUrl.startsWith('http')) {
          try {
            const buffer = await this.pdfParser.download(item.pdfUrl);
            const text = await this.pdfParser.extractText(buffer);
            (item as any).extractedTextPreview = text.substring(0, 500); // Save a preview
          } catch (e) {
            console.error(`Failed to parse PDF for ${item.company}`, e);
          }
        }
      }

      await context.close();

      return {
        url: config.url,
        timestamp: new Date().toISOString(),
        itemsFound: items.length,
        data: items,
        hashLock: HashLock.batchHash(items)
      };
    });
  }
}

