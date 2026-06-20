// @ts-nocheck
// Seed reading_room_documents via Supabase REST API
// Run: node scripts/seed-reading-room.cjs

const https = require('https');
const fs = require('fs');

const envContent = fs.readFileSync('.env', 'utf-8');

const getSupabaseUrl = () => {
  const match = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
  return match ? match[1].trim() : null;
};

const getAnonKey = () => {
  const match = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/);
  return match ? match[1].trim() : null;
};

const SUPABASE_URL = getSupabaseUrl();
const ANON_KEY = getAnonKey();

if (!SUPABASE_URL || !ANON_KEY) {
  console.error('ERROR: Missing Supabase URL or anon key in .env');
  process.exit(1);
}

console.log('Supabase URL:', SUPABASE_URL);
console.log('Anon key:', ANON_KEY.substring(0, 30) + '...');

function makeRequest(method, path, data) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, SUPABASE_URL);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'apikey': ANON_KEY,
        'Authorization': 'Bearer ' + ANON_KEY,
        'Prefer': 'return=minimal,resolution=merge-duplicates'
      }
    };
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

// All documents with correct esg_category (Environmental, Social, Governance)
const documents = [
  // ── Standards ──
  { id: 'std-gri-2021', title: 'GRI 2021 Universal Standards', description: 'GRI 通用準則為所有組織提供關於一般揭露的基礎框架。', category: 'standard', gri_reference: 'GRI 2', esg_category: 'Governance', tags: ['GRI', 'Universal Standards', 'Governance'], source: 'https://www.globalreporting.org/standards/', published_date: '2023-01-01' },
  { id: 'std-gri-305', title: 'GRI 305: Emissions 2016', description: '規範組織對溫室氣體排放的揭露要求，涵蓋範疇一、二、三。', category: 'standard', gri_reference: 'GRI 305', esg_category: 'Environmental', tags: ['GRI', 'Emissions', 'Scope 1', 'Scope 2', 'Scope 3', 'GHG'], source: 'https://www.globalreporting.org/standards/', published_date: '2016-07-01' },
  { id: 'std-gri-302', title: 'GRI 302: Energy 2016', description: '規範組織對能源消耗、能源強度及再生能源使用情況的揭露要求。', category: 'standard', gri_reference: 'GRI 302', esg_category: 'Environmental', tags: ['GRI', 'Energy', 'Renewable Energy'], source: 'https://www.globalreporting.org/standards/', published_date: '2016-07-01' },
  { id: 'std-gri-401', title: 'GRI 401: Employment 2016', description: '規範組織對員工僱用、勞資關係、職業健康與安全的揭露要求。', category: 'standard', gri_reference: 'GRI 401', esg_category: 'Social', tags: ['GRI', 'Employment', 'Labor', 'Health', 'Safety'], source: 'https://www.globalreporting.org/standards/', published_date: '2016-07-01' },
  { id: 'std-gri-403', title: 'GRI 403: Occupational Health and Safety 2018', description: '規範組織對職業健康與安全管理體系、工作者參與、訓練及促進健康的揭露要求。', category: 'standard', gri_reference: 'GRI 403', esg_category: 'Social', tags: ['GRI', 'Health', 'Safety', 'Workers', 'Training'], source: 'https://www.globalreporting.org/standards/', published_date: '2018-12-01' },
  { id: 'std-gri-405', title: 'GRI 405: Diversity and Equal Opportunity 2016', description: '規範組織對多元化與平等機會的揭露要求，包括董事會與員工的性別、年齡、族群等多元指標。', category: 'standard', gri_reference: 'GRI 405', esg_category: 'Social', tags: ['GRI', 'Diversity', 'Equal Opportunity', 'Gender', 'Board'], source: 'https://www.globalreporting.org/standards/', published_date: '2016-07-01' },
  { id: 'std-gri-413', title: 'GRI 413: Local Communities 2016', description: '規範組織對當地社區影響的揭露要求，包括社區參與、衝擊評估及發展計畫。', category: 'standard', gri_reference: 'GRI 413', esg_category: 'Social', tags: ['GRI', 'Local Communities', 'Impact Assessment', 'Engagement'], source: 'https://www.globalreporting.org/standards/', published_date: '2016-07-01' },
  { id: 'std-gri-418', title: 'GRI 418: Customer Privacy 2016', description: '規範組織對客戶隱私與個人資料保護的揭露要求，包括資料外洩事件與客戶投訴處理。', category: 'standard', gri_reference: 'GRI 418', esg_category: 'Social', tags: ['GRI', 'Customer Privacy', 'Data Protection', 'GDPR'], source: 'https://www.globalreporting.org/standards/', published_date: '2016-07-01' },
  { id: 'std-tcfd', title: 'TCFD Recommendations', description: 'TCFD 建議企業依據「治理」、「策略」、「風險管理」及「指標與目標」四大支柱揭露氣候相關財務風險與機會。', category: 'standard', esg_category: 'Governance', tags: ['TCFD', 'Climate', 'Risk', 'Disclosure'], source: 'https://www.fsb-tcfd.org/', published_date: '2017-06-29' },
  { id: 'std-issb-s1', title: 'IFRS S1 General Requirements', description: 'IFRS S1 規定企業應揭露對其在短、中、長期產生重大影響之永續相關風險和機會的相關資訊。', category: 'standard', esg_category: 'Governance', tags: ['ISSB', 'IFRS S1', 'Sustainability'], source: 'https://www.ifrs.org/', published_date: '2024-01-01' },
  { id: 'std-issb-s2', title: 'IFRS S2 Climate-related Disclosures', description: 'IFRS S2 專注於氣候相關風險和機會的揭露，建立在 TCFD 框架之上。', category: 'standard', esg_category: 'Environmental', tags: ['ISSB', 'IFRS S2', 'Climate', 'GHG'], source: 'https://www.ifrs.org/', published_date: '2024-01-01' },
  { id: 'std-iso-14064', title: 'ISO 14064-1:2018 Greenhouse gases', description: '提供組織層級溫室氣體排放和移除的量化及報告規範。', category: 'standard', esg_category: 'Environmental', tags: ['ISO', 'GHG', 'Inventory', 'Verification'], source: 'https://www.iso.org/standard/66453.html', published_date: '2018-12-01' },
  { id: 'std-iso-14001', title: 'ISO 14001:2015 Environmental management systems', description: 'ISO 14001 規定環境管理系統的要求，協助組織提升環境績效。', category: 'standard', esg_category: 'Environmental', tags: ['ISO', 'EMS', 'Environmental Management'], source: 'https://www.iso.org/', published_date: '2015-09-15' },
  { id: 'std-iso-45001', title: 'ISO 45001:2018 Occupational health and safety', description: 'ISO 45001 規定職業健康與安全管理系統的要求，協助組織預防工作者傷害與健康損害。', category: 'standard', esg_category: 'Social', tags: ['ISO', 'Health', 'Safety', 'Workers', 'Management System'], source: 'https://www.iso.org/standard/63787.html', published_date: '2018-03-01' },
  { id: 'std-gri-biodiversity-2024', title: 'GRI 101: Biodiversity 2024', description: '生物多樣性報告標準重大更新，要求組織揭露對生物多樣性的依賴性、影響與復原行動。', category: 'standard', file_url: 'https://www.globalreporting.org/standards/media/1001/gri-101-biodiversity-2024.pdf', gri_reference: 'GRI 101', esg_category: 'Environmental', tags: ['GRI', 'Biodiversity', 'Nature', 'TNFD'], source: 'https://www.globalreporting.org/', published_date: '2024-01-25' },
  { id: 'std-sasb-tech', title: 'SASB Technology & Communications', description: '針對軟體與 IT 服務產業的永續會計標準，重點揭露能源管理、資安隱私、勞工實踐。', category: 'standard', esg_category: 'Social', tags: ['SASB', 'Technology', 'Software', 'IT Services'], source: 'https://sasb.org/', published_date: '2018-10-04' },
  { id: 'std-sasb-finance', title: 'SASB Financials - Commercial Banks', description: '針對商業銀行業的永續會計標準，重點揭露系統性風險管理、顧客隱私、金融包容性。', category: 'standard', esg_category: 'Governance', tags: ['SASB', 'Financials', 'Banking', 'Risk Management'], source: 'https://sasb.org/', published_date: '2018-10-04' },

  // ── Regulations ──
  { id: 'reg-tw-fsc', title: '金管會上市（櫃）公司永續發展路徑圖', description: '金管會規定台灣上市上櫃公司分階段提升 ESG 揭露標準，要求依 GRI 準則編製永續報告書。', category: 'regulation', esg_category: 'Governance', tags: ['台灣法規', '金管會', 'ESG', '永續報告'], source: 'https://www.fsc.gov.tw', published_date: '2023-01-01' },
  { id: 'reg-tw-climate-change', title: '氣候變遷因應法', description: '台灣氣候變遷因應法規定溫室氣體減量目標、碳費徵收機制及企業揭露義務。', category: 'regulation', esg_category: 'Environmental', tags: ['台灣法規', '氣候變遷', '碳費', '減量'], source: 'https://law.moj.gov.tw/', published_date: '2023-02-15' },
  { id: 'reg-tw-csr', title: '上市上櫃公司永續發展實務守則', description: '台灣證交所與櫃買中心共同制定，規範上市上櫃公司推動永續發展之治理架構與揭露要求。', category: 'regulation', esg_category: 'Governance', tags: ['台灣法規', 'CSR', '永續治理', '揭露'], source: 'https://www.twse.com.tw/', published_date: '2022-01-01' },
  { id: 'reg-eu-csrd', title: 'CSRD / ESRS', description: 'CSRD 是歐盟最新的永續報告法規，要求企業依 ESRS 揭露 ESG 資訊，引入「雙重重大性」原則。', category: 'regulation', esg_category: 'Governance', tags: ['EU', 'CSRD', 'ESRS', 'Double Materiality'], source: 'https://finance.ec.europa.eu/', published_date: '2024-01-01' },
  { id: 'reg-eu-cbam', title: 'EU CBAM Implementing Regulation', description: 'CBAM 對進入歐盟的高碳商品（鋼鐵、鋁、水泥、化肥、電力、氫氣）課徵碳關稅。', category: 'regulation', file_url: 'https://eur-lex.europa.eu/eli/reg/2023/956', esg_category: 'Environmental', tags: ['EU', 'CBAM', 'Carbon Border', 'Regulation'], source: 'https://eur-lex.europa.eu/eli/reg/2023/956', published_date: '2023-05-16' },
  { id: 'reg-eu-taxonomy', title: 'EU Taxonomy Regulation', description: '歐盟分類法規定六項環境目標，要求企業揭露符合永續分類法之營業收入、資本支出比例。', category: 'regulation', esg_category: 'Environmental', tags: ['EU', 'Taxonomy', 'Green Finance', 'Disclosure'], source: 'https://finance.ec.europa.eu/', published_date: '2021-07-01' },
  { id: 'reg-us-sec-climate', title: 'SEC Climate Disclosure Rule', description: '美國證券交易委員會要求上市公司揭露氣候相關風險、溫室氣體排放及氣候目標進展。', category: 'regulation', esg_category: 'Governance', tags: ['US', 'SEC', 'Climate', 'Disclosure', 'GHG'], source: 'https://www.sec.gov/', published_date: '2024-03-01' },

  // ── Case Studies ──
  { id: 'bench-global-2021', title: 'Global Benchmark: Microsoft Carbon Negative', description: 'Microsoft committed to be carbon negative by 2030 and remove all carbon emitted since 1975 by 2050.', category: 'case-study', esg_category: 'Environmental', tags: ['International', 'Benchmark', 'Carbon Negative', 'Technology'], source: 'https://www.microsoft.com/', published_date: '2021-01-01' },
  { id: 'bench-global-2022', title: 'Global Benchmark: Ørsted Renewable Energy', description: 'Ørsted transformed from fossil fuel to largest offshore wind developer, demonstrating science-based targets.', category: 'case-study', esg_category: 'Environmental', tags: ['International', 'Benchmark', 'Renewable Energy', 'Offshore Wind', 'SBTi'], source: 'https://orsted.com/', published_date: '2022-01-01' },
  { id: 'bench-global-2023', title: 'Global Benchmark: IKEA Circular Economy', description: 'IKEA committed to becoming climate positive by 2030, focusing on circular design and sustainable sourcing.', category: 'case-study', esg_category: 'Environmental', tags: ['International', 'Benchmark', 'Circular Economy', 'Retail', 'Climate Positive'], source: 'https://www.ikea.com/', published_date: '2023-01-01' },
  { id: 'bench-global-2024', title: 'Uniqlo Sustainable Supply Chain', description: 'Uniqlo leads in textile sustainability with recycling programs and responsible sourcing.', category: 'case-study', esg_category: 'Social', tags: ['International', 'Benchmark', 'Retail', 'Textile', 'Supply Chain', 'Recycling', 'Responsible Sourcing'], source: 'https://www.uniqlo.com', published_date: '2025-01-01' },
  { id: 'bench-tw-2023', title: 'Taiwan Benchmark: TSMC Renewable Energy', description: 'TSMC committed to net-zero operations by 2050, renewable energy usage exceeded 40% in 2023.', category: 'case-study', esg_category: 'Environmental', tags: ['Taiwan', 'Benchmark', 'TSMC', 'Renewable Energy', 'Net-Zero'], source: 'https://www.tsmc.com', published_date: '2023-01-01' },
  { id: 'bench-tw-2024', title: 'Taiwan Benchmark: Cathay Financial ESG Integration', description: 'Cathay Financial integrates ESG into investment decisions, winning multiple domestic ESG awards.', category: 'case-study', esg_category: 'Governance', tags: ['Taiwan', 'Benchmark', 'Cathay', 'Financial', 'ESG Integration'], source: 'https://www.cathayholdings.com', published_date: '2024-01-01' },
  { id: 'bench-tw-2025', title: 'Taiwan Benchmark: ASE Technology Water Stewardship', description: 'ASE Technology achieved water neutrality at major facilities, exemplifying industrial water stewardship.', category: 'case-study', esg_category: 'Environmental', tags: ['Taiwan', 'Benchmark', 'ASE', 'Water Stewardship', 'Semiconductor'], source: 'https://www.aseglobal.com', published_date: '2025-01-01' },
];

async function main() {
  // Check if table exists
  console.log('Checking table...');
  const check = await makeRequest('GET', '/rest/v1/reading_room_documents?select=count&limit=1');
  console.log('Table check:', check.status, check.body.substring(0, 100));
  
  if (check.status === 404) {
    console.log('\nERROR: Table reading_room_documents does not exist.');
    console.log('Please run the migration SQL first:');
    console.log('  supabase/migrations/20260620000000_create_reading_room_documents_table.sql');
    return;
  }
  
  // Insert documents
  console.log(`\nInserting ${documents.length} documents...`);
  let success = 0;
  let failed = 0;
  
  for (let i = 0; i < documents.length; i++) {
    const doc = documents[i];
    const result = await makeRequest('POST', '/rest/v1/reading_room_documents', doc);
    
    if (result.status >= 200 && result.status < 300) {
      console.log(`✓ [${i + 1}/${documents.length}] ${doc.id} (${doc.esg_category})`);
      success++;
    } else {
      console.log(`✗ [${i + 1}/${documents.length}] ${doc.id}: ${result.status} ${result.body.substring(0, 80)}`);
      failed++;
    }
    
    await new Promise(r => setTimeout(r, 100));
  }
  
  console.log(`\nDone! Success: ${success}, Failed: ${failed}`);
  
  // Summary by category
  const byCategory = {};
  for (const doc of documents) {
    byCategory[doc.esg_category] = (byCategory[doc.esg_category] || 0) + 1;
  }
  console.log('\nBy ESG category:');
  for (const [cat, count] of Object.entries(byCategory)) {
    console.log(`  ${cat}: ${count}`);
  }
}

main().catch(console.error);
