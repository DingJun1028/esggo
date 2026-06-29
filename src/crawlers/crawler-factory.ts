// ============================================================
// Crawler Factory — register and instantiate crawlers
// src/crawlers/crawler-factory.ts
// ============================================================

import { BaseCrawler, CrawlerConfig } from './base-crawler';
import { FSCCrawler, MOENVCrawler, TWSECrawler, EUCSRDCrawler, SECCrawler } from './sources-crawlers';

type CrawlerConstructor = new () => BaseCrawler;

const registry: Map<string, CrawlerConstructor> = new Map();

// Register all built-in crawlers
export function registerCrawler(id: string, ctor: CrawlerConstructor): void {
  registry.set(id, ctor);
}

export function createCrawler(id: string): BaseCrawler | null {
  const ctor = registry.get(id);
  return ctor ? new ctor() : null;
}

export function getRegisteredSources(): Array<{ id: string; name: string }> {
  const sources: Array<{ id: string; name: string }> = [];
  registry.forEach((ctor, id) => {
    const instance = new ctor();
    sources.push({ id, name: instance.getSourceName() });
  });
  return sources;
}

export function createAllCrawlers(): BaseCrawler[] {
  const crawlers: BaseCrawler[] = [];
  registry.forEach((ctor) => {
    crawlers.push(new ctor());
  });
  return crawlers;
}

// Auto-register built-in crawlers
registerCrawler('tw-fsc', FSCCrawler);
registerCrawler('tw-moenv', MOENVCrawler);
registerCrawler('tw-twse', TWSECrawler);
registerCrawler('eu-csrd', EUCSRDCrawler);
registerCrawler('us-sec', SECCrawler);
