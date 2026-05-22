import * as cheerio from 'cheerio';

export interface ScrapedArticle {
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string;
  category: string;
  tags: string[];
  impactLevel: 'high' | 'medium' | 'low';
}

export interface ScrapeResult {
  success: boolean;
  articles: ScrapedArticle[];
  scrapedAt: string;
  source: string;
  error?: string;
  totalFound: number;
  executionMs: number;
}

export interface ScrapeTarget {
  id: string;
  name: string;
  url: string;
  category: string;
  selectors: {
    articleContainer: string;
    title: string;
    summary?: string;
    link?: string;
    date?: string;
  };
}

// ESG-relevant scrape targets (public RSS/static pages)
export const ESG_SCRAPE_TARGETS: ScrapeTarget[] = [
  {
    id: 'gri',
    name: 'GRI 全球報告倡議組織',
    url: 'https://www.globalreporting.org/news/',
    category: '國際標準',
    selectors: {
      articleContainer: 'article, .news-item, .post',
      title: 'h1, h2, h3, .title',
      summary: 'p, .excerpt, .summary',
      link: 'a',
      date: 'time, .date',
    },
  },
  {
    id: 'tcfd',
    name: 'TCFD 氣候財務揭露',
    url: 'https://www.fsb-tcfd.org/news/',
    category: '氣候政策',
    selectors: {
      articleContainer: '.news-article, article, .post',
      title: 'h2, h3, .entry-title',
      summary: '.excerpt, p',
      link: 'a',
      date: '.date, time',
    },
  },
  {
    id: 'twse-esg',
    name: '台灣證交所 ESG 資訊',
    url: 'https://esg.twse.com.tw/',
    category: '法規動態',
    selectors: {
      articleContainer: '.news-list li, .announcement-item',
      title: 'a, .title',
      summary: '.content, p',
      link: 'a',
      date: '.date, span',
    },
  },
];

// Lightweight HTML scraper using fetch + cheerio (no native binary needed)
export async function scrapeWithFetch(target: ScrapeTarget): Promise<ScrapeResult> {
  const startTime = Date.now();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(target.url, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; ESG-GO-Bot/1.0; +https://esggo.com/bot)',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-TW,zh;q=0.9,en;q=0.8',
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const articles: ScrapedArticle[] = [];

    $(target.selectors.articleContainer)
      .slice(0, 10)
      .each((_, el) => {
        const titleEl = $(el).find(target.selectors.title).first();
        const title = titleEl.text().trim();
        if (!title || title.length < 5) return;

        const summaryEl = target.selectors.summary
          ? $(el).find(target.selectors.summary).first()
          : null;
        const summary =
          summaryEl?.text().trim().slice(0, 200) ||
          $(el).text().trim().slice(0, 200);

        const linkEl = target.selectors.link
          ? $(el).find(target.selectors.link).first()
          : titleEl.closest('a');
        const href = linkEl.attr('href') || '';
        const url = href.startsWith('http')
          ? href
          : href
          ? `${new URL(target.url).origin}${href}`
          : target.url;

        const dateEl = target.selectors.date
          ? $(el).find(target.selectors.date).first()
          : null;
        const dateText =
          dateEl?.attr('datetime') || dateEl?.text().trim() || '';
        const publishedAt = parseDate(dateText);

        const impactLevel = detectImpactLevel(title + ' ' + summary);
        const tags = extractTags(title + ' ' + summary);

        articles.push({
          title: title.slice(0, 150),
          summary: summary.slice(0, 300),
          url,
          source: target.name,
          publishedAt,
          category: target.category,
          tags,
          impactLevel,
        });
      });

    return {
      success: true,
      articles,
      scrapedAt: new Date().toISOString(),
      source: target.name,
      totalFound: articles.length,
      executionMs: Date.now() - startTime,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      articles: [],
      scrapedAt: new Date().toISOString(),
      source: target.name,
      error: message,
      totalFound: 0,
      executionMs: Date.now() - startTime,
    };
  }
}

// Scrape multiple targets in parallel
export async function scrapeAllTargets(
  targetIds?: string[]
): Promise<ScrapeResult[]> {
  const targets = targetIds
    ? ESG_SCRAPE_TARGETS.filter((t) => targetIds.includes(t.id))
    : ESG_SCRAPE_TARGETS;

  const results = await Promise.allSettled(
    targets.map((t) => scrapeWithFetch(t))
  );

  return results.map((r, i) => {
    if (r.status === 'fulfilled') return r.value;
    return {
      success: false,
      articles: [],
      scrapedAt: new Date().toISOString(),
      source: targets[i].name,
      error: String(r.reason),
      totalFound: 0,
      executionMs: 0,
    };
  });
}

// Extract a URL's page title and main text
export async function scrapeUrl(url: string): Promise<{
  title: string;
  content: string;
  links: string[];
  success: boolean;
  error?: string;
}> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; ESG-GO-Bot/1.0; +https://esggo.com/bot)',
      },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const html = await response.text();
    const $ = cheerio.load(html);

    $('script, style, nav, footer, header, .ad, .advertisement').remove();

    const title = $('title').text().trim() || $('h1').first().text().trim();
    const content = $('main, article, .content, body')
      .first()
      .text()
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 3000);

    const links: string[] = [];
    $('a[href]')
      .slice(0, 20)
      .each((_, el) => {
        const href = $(el).attr('href') || '';
        if (href.startsWith('http')) links.push(href);
      });

    return { title, content, links: [...new Set(links)], success: true };
  } catch (err: unknown) {
    return {
      title: '',
      content: '',
      links: [],
      success: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

// ── helpers ─────────────────────────────────────────────────────────────────

function parseDate(raw: string): string {
  if (!raw) return new Date().toISOString().split('T')[0];
  try {
    const d = new Date(raw);
    if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
  } catch {
    // ignore
  }
  return new Date().toISOString().split('T')[0];
}

function detectImpactLevel(text: string): 'high' | 'medium' | 'low' {
  const lower = text.toLowerCase();
  const highKeywords = [
    '強制', '必須', '罰款', '違規', 'mandatory', 'penalty', 'cbam', 'issb',
    '2025', '2026', '截止', 'deadline', '重大', 'critical',
  ];
  const medKeywords = [
    '建議', '鼓勵', '指引', 'guideline', 'recommend', '新規', 'update',
    'tcfd', 'gri', 'sasb', '修訂',
  ];
  if (highKeywords.some((k) => lower.includes(k))) return 'high';
  if (medKeywords.some((k) => lower.includes(k))) return 'medium';
  return 'low';
}

function extractTags(text: string): string[] {
  const knownTags: Record<string, string> = {
    'gri 2021': 'GRI 2021',
    'gri 305': 'GRI 305',
    'gri 302': 'GRI 302',
    tcfd: 'TCFD',
    'issb s1': 'ISSB S1',
    'issb s2': 'ISSB S2',
    cbam: 'CBAM',
    sasb: 'SASB',
    sbti: 'SBTi',
    csrd: 'CSRD',
    'iso 14064': 'ISO 14064',
    '金管會': '金管會',
    '碳稅': '碳稅',
    '淨零': '淨零',
    '永續': '永續',
    '範疇三': '範疇三',
    'scope 3': 'Scope 3',
    'tnfd': 'TNFD',
  };
  const lower = text.toLowerCase();
  return Object.entries(knownTags)
    .filter(([k]) => lower.includes(k))
    .map(([, v]) => v)
    .slice(0, 5);
}