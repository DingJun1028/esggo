import { BaseCrawler } from './base-crawler';
import { FSCCrawler } from './fsc-crawler';
import { MOENVCrawler } from './moenv-crawler';
import { TWSECrawler } from './twse-crawler';
import { ESG_SOURCES } from '../config/sources';

/**
 * ESGSonar | Crawler Factory
 */

const crawlerMap: Record<string, any> = {
  'tw-fsc': FSCCrawler,
  'tw-moenv': MOENVCrawler,
  'tw-twse': TWSECrawler
};

export function createCrawler(sourceId: string): BaseCrawler | null {
  const CrawlerClass = crawlerMap[sourceId];
  return CrawlerClass ? new CrawlerClass() : null;
}

export function getRegisteredSources() {
  return ESG_SOURCES.map(s => ({
    id: s.id,
    name: s.name,
    type: s.type,
    region: s.region
  }));
}
