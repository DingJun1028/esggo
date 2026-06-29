// ============================================================
// Crawler Factory — Register and instantiate all 21 crawlers
// src/crawlers/crawler-factory.ts
// ============================================================

import type { BaseCrawler } from './base-crawler';

// Lazy-import map: sourceId → crawler class
const registry = new Map<string, () => BaseCrawler>();

function registerAll() {
  if (registry.size > 0) return; // already registered

  // Import all source crawlers (lazy to avoid loading all at once)
  const {
    FSCCrawler, MOENVCrawler, MOEACrawler, GazetteCrawler,
    TWSECrawler, TPEXCrawler, MOFCrawler,
    EUCSRDCrawler, EUESRSCrawler, IFRSCrawler, GRICrawler,
    TCFDCrawler, UNFCCCCrawler,
    SECCrawler, SECGovCrawler,
    JapanFSACrawler, HKEXCrawler,
    MSCIESGCrawler, SustainalyticsCrawler, CDPCrawler,
  } = require('./sources-crawlers');

  // ─── 台灣 🇹🇼 ────
  registry.set('tw-fsc',      () => new FSCCrawler());
  registry.set('tw-moenv',    () => new MOENVCrawler());
  registry.set('tw-moea',     () => new MOEACrawler());
  registry.set('tw-gazette',  () => new GazetteCrawler());
  registry.set('tw-twse',     () => new TWSECrawler());
  registry.set('tw-tpex',     () => new TPEXCrawler());
  registry.set('tw-mof',      () => new MOFCrawler());

  // ─── 國際 🌍 ────
  registry.set('eu-csrd',     () => new EUCSRDCrawler());
  registry.set('eu-esrs',     () => new EUESRSCrawler());
  registry.set('int-ifrs',    () => new IFRSCrawler());
  registry.set('int-gri',     () => new GRICrawler());
  registry.set('int-tcfd',    () => new TCFDCrawler());
  registry.set('int-unfccc',  () => new UNFCCCCrawler());

  // ─── 美國 🇺🇸 ────
  registry.set('us-sec',      () => new SECCrawler());
  registry.set('us-sec-gov',  () => new SECGovCrawler());

  // ─── 亞太 🌏 ────
  registry.set('ap-jp-fsa',   () => new JapanFSACrawler());
  registry.set('ap-hkex',     () => new HKEXCrawler());

  // ─── 第三方 📊 ────
  registry.set('3p-msci',     () => new MSCIESGCrawler());
  registry.set('3p-sustainalytics', () => new SustainalyticsCrawler());
  registry.set('3p-cdp',      () => new CDPCrawler());
}

/** Create a crawler instance by sourceId */
export function createCrawler(sourceId: string): BaseCrawler | null {
  registerAll();
  const factory = registry.get(sourceId);
  return factory ? factory() : null;
}

/** Create all registered crawlers */
export function createAllCrawlers(): BaseCrawler[] {
  registerAll();
  return Array.from(registry.values()).map(f => f());
}

/** Get list of registered source IDs and names */
export function getRegisteredSources(): Array<{ id: string; name: string }> {
  registerAll();
  const sources: Array<{ id: string; name: string }> = [];
  registry.forEach((ctor, id) => {
    const instance = ctor();
    sources.push({ id, name: instance.sourceConfig.name });
  });
  return sources;
}

/** Total registered source count */
export function getSourceCount(): number {
  registerAll();
  return registry.size;
}
