import { FSCCrawler } from './fsc-crawler';
import { MOENVCrawler } from './moenv-crawler';
import { TWSECrawler } from './twse-crawler';
import { ESG_SOURCES } from '../config/sources';
/**
 * ESGSonar | Crawler Factory
 */
const crawlerMap = {
    'tw-fsc': FSCCrawler,
    'tw-moenv': MOENVCrawler,
    'tw-twse': TWSECrawler
};
export function createCrawler(sourceId) {
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
//# sourceMappingURL=index.js.map