import axios from 'axios';
import redisService from './redisService.js';

const RSS_URL =
  'https://news.google.com/rss/search?q=ESG+Sustainability+Carbon&hl=en-US&gl=US&ceid=US:en';

const CACHE_KEY = 'omni_global_news';
const CACHE_TTL = 15 * 60; // 15 minutes (seconds)

/**
 * Robust extraction of text content from XML tags using Regex
 */
function extractTag(xml, tagName) {
  const regex = new RegExp(`<${tagName}.*?>(.*?)<\/${tagName}>`, 's');
  const match = xml.match(regex);
  return match ? match[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1') : null;
}

interface NewsItem {
  id: string;
  title: string | null;
  link: string | null;
  date: string;
  source: string | null;
  category: string;
  sentiment: string;
  impact: string;
  summary: string | null;
}

/**
 * Fetches and parses global ESG news from Google News RSS
 */
export async function getGlobalNews() {
  return redisService.getOrSet<NewsItem[]>(CACHE_KEY, async () => {
    try {
      console.log(`[NewsService] Fetching RSS from: ${RSS_URL}`);
      const response = await axios.get(RSS_URL, { timeout: 10000 });
      const xmlData = response.data;

      const items: NewsItem[] = [];
      const itemRegex = /<item>(.*?)<\/item>/gs;
      let match;

      while ((match = itemRegex.exec(xmlData)) !== null) {
        const itemContent = match[1];
        const title = extractTag(itemContent, 'title');
        const link = extractTag(itemContent, 'link');
        const pubDate = extractTag(itemContent, 'pubDate');
        const source = extractTag(itemContent, 'source');

        // Rudimentary sentiment analysis based on keywords
        let sentiment = 'neutral';
        if (title && /growth|record|positive|success|breakthrough|gain/i.test(title)) sentiment = 'positive';
        else if (title && /risk|crisis|fail|fine|violation|threat|delay/i.test(title)) sentiment = 'negative';

        // Category classification
        let category = 'General';
        if (title && /policy|law|regulation|eu|cbam|sec/i.test(title)) category = 'Policy';
        else if (title && /tech|ai|innovation|solar|wind|hydrogen/i.test(title)) category = 'Technology';
        else if (title && /report|disclosure|gri|issb/i.test(title)) category = 'Reporting';
        else if (title && /invest|fund|finance|stock/i.test(title)) category = 'Finance';

        // Impact estimation
        let impact = 'Low';
        if (title && /breakthrough|major|crisis|historic|global/i.test(title)) impact = 'High';
        else if (title && /update|guidance|launch/i.test(title)) impact = 'Medium';

        // Summary simulation (RSS often has empty descriptions or HTML junk)
        const summary = title; // Use title as summary for now to keep it clean

        items.push({
          id: Buffer.from(title || '').toString('base64').substring(0, 10),
          title,
          link,
          date: pubDate ? new Date(pubDate).toLocaleDateString() : new Date().toLocaleDateString(),
          source: source || 'Google News',
          category,
          sentiment,
          impact,
          summary,
        });

        if (items.length >= 20) break; // Limit to 20 items
      }

      console.log(`[NewsService] Parsed ${items.length} news items.`);
      return items;
    } catch (error: any) {
      console.error('[NewsService] Failed to fetch news:', error.message);
      throw new Error('Failed to fetch global news');
    }
  }, CACHE_TTL);
}
