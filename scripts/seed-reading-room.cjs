// @ts-nocheck
// Seed reading_room_documents via Supabase REST API

const https = require('https');

const SUPABASE_URL = 'https://yhwfmavnhaivvgzeuklx.supabase.co';
const SERVICE_KEY = 'eyJhbG...BACK'; // Replace with actual service role key from .env

const documents = [
  { id: 'std-gri-2021', title: 'GRI 2021 Universal Standards', description: 'GRI 通用準則為所有組織提供關於一般揭露的基礎框架。', category: 'standard', gri_reference: 'GRI 2', esg_category: 'Governance', tags: ['GRI', 'Universal Standards', 'Governance'], source: 'https://www.globalreporting.org/standards/', published_date: '2023-01-01' },
  { id: 'std-gri-305', title: 'GRI 305: Emissions 2016', description: '規範組織對溫室氣體排放的揭露要求，涵蓋直接排放（範疇一）、能源間接排放（範疇二）及其他間接排放（範疇三）。', category: 'standard', gri_reference: 'GRI 305', esg_category: 'Environmental', tags: ['GRI', 'Emissions', 'Scope 1', 'Scope 2', 'Scope 3', 'GHG'], source: 'https://www.globalreporting.org/standards/media/1012/gri-305-emissions-2016.pdf', published_date: '2016-07-01' },
  { id: 'std-gri-302', title: 'GRI 302: Energy 2016', description: '規範組織對能源消耗、能源強度及再生能源使用情況的揭露要求。', category: 'standard', gri_reference: 'GRI 302', esg_category: 'Environmental', tags: ['GRI', 'Energy', 'Renewable Energy'], source: 'https://www.globalreporting.org/standards/media/1009/gri-302-energy-2016.pdf', published_date: '2016-07-01' },
  { id: 'std-tcfd', title: 'TCFD Recommendations', description: 'TCFD 建議企業依據「治理」、「策略」、「風險管理」及「指標與目標」四大支柱揭露氣候相關財務風險與機會。', category: 'standard', esg_category: 'Governance', tags: ['TCFD', 'Climate', 'Risk', 'Disclosure'], source: 'https://www.fsb-tcfd.org/', published_date: '2017-06-29' },
  { id: 'std-issb-s1', title: 'IFRS S1 General Requirements', description: 'IFRS S1 規定企業應揭露對其在短、中、長期產生重大影響之永續相關風險和機會的相關資訊。', category: 'standard', esg_category: 'Governance', tags: ['ISSB', 'IFRS S1', 'Sustainability'], source: 'https://www.ifrs.org/issued-standards/ifrs-sustainability-disclosure-standards/', published_date: '2024-01-01' },
  { id: 'std-issb-s2', title: 'IFRS S2 Climate-related Disclosures', description: 'IFRS S2 專注於氣候相關風險和機會的揭露，建立在 TCFD 框架之上。', category: 'standard', esg_category: 'Environmental', tags: ['ISSB', 'IFRS S2', 'Climate', 'GHG'], source: 'https://www.ifrs.org/issued-standards/ifrs-sustainability-disclosure-standards/ifrs-s2-climate-related-disclosures/', published_date: '2024-01-01' },
  { id: 'std-iso-14064', title: 'ISO 14064-1:2018 Greenhouse gases', description: '提供組織層級溫室氣體排放和移除的量化及報告規範。', category: 'standard', esg_category: 'Environmental', tags: ['ISO', 'GHG', 'Inventory', 'Verification'], source: 'https://www.iso.org/standard/66453.html', published_date: '2018-12-01' },
  { id: 'std-iso-14001', title: 'ISO 14001:2015 Environmental management systems', description: 'ISO 14001 規定環境管理系統的要求，協助組織提升環境績效。', category: 'standard', esg_category: 'Environmental', tags: ['ISO', 'EMS', 'Environmental Management'], source: 'https://www.iso.org/iso-14001-environmental-management.html', published_date: '2015-09-15' },
  { id: 'std-tw-fsc', title: '金管會上市（櫃）公司永續發展路徑圖', description: '金管會規定台灣上市上櫃公司分階段提升 ESG 揭露標準。', category: 'regulation', esg_category: 'Governance', tags: ['台灣法規', '金管會', 'ESG', '永續報告'], source: 'https://www.fsc.gov.tw', published_date: '2023-01-01' },
  { id: 'reg-eu-csrd', title: 'CSRD / ESRS', description: 'CSRD 是歐盟最新的永續報告法規，要求企業依 ESRS 揭露 ESG 資訊。', category: 'regulation', esg_category: 'Governance', tags: ['EU', 'CSRD', 'ESRS', 'Double Materiality'], source: 'https://finance.ec.europa.eu/capital-markets-union-and-financial-markets/company-reporting-and-auditing/company-reporting/corporate-sustainability-reporting_en', published_date: '2024-01-01' },
  { id: 'reg-eu-cbam', title: 'EU CBAM Implementing Regulation', description: 'CBAM 對進入歐盟的高碳商品課徵碳關稅。', category: 'regulation', file_url: 'https://eur-lex.europa.eu/eli/reg/2023/956', esg_category: 'Environmental', tags: ['EU', 'CBAM', 'Carbon Border', 'Regulation'], source: 'https://eur-lex.europa.eu/eli/reg/2023/956', published_date: '2023-05-16' },
  { id: 'std-gri-biodiversity-2024', title: 'GRI 101: Biodiversity 2024', description: 'Major update to biodiversity reporting standards.', category: 'standard', file_url: 'https://www.globalreporting.org/standards/media/1001/gri-101-biodiversity-2024.pdf', gri_reference: 'GRI 101', esg_category: 'Environmental', tags: ['GRI', 'Biodiversity', 'Nature'], source: 'https://www.globalreporting.org/', published_date: '2024-01-25' },
  { id: 'std-sasb-tech', title: 'SASB Technology & Communications', description: '針對軟體與 IT 服務產業的永續會計標準。', category: 'standard', esg_category: 'Social', tags: ['SASB', 'Technology', 'Software', 'IT Services'], source: 'https://sasb.org/standards/technology-communications/', published_date: '2018-10-04' },
  { id: 'bench-global-2021', title: 'Global Benchmark: Microsoft Carbon Negative', description: 'Microsoft committed to be carbon negative by 2030.', category: 'case-study', esg_category: 'Environmental', tags: ['International', 'Benchmark', 'Carbon Negative', 'Technology'], source: 'https://www.microsoft.com/en-us/sustainability/', published_date: '2021-01-01' },
  { id: 'bench-global-2022', title: 'Global Benchmark: Ørsted Renewable Energy', description: 'Ørsted transformed from fossil fuel to largest offshore wind developer.', category: 'case-study', esg_category: 'Environmental', tags: ['International', 'Benchmark', 'Renewable Energy', 'Offshore Wind', 'SBTi'], source: 'https://orsted.com/en/Sustainability', published_date: '2022-01-01' },
  { id: 'bench-tw-2023', title: 'Taiwan Benchmark: TSMC Renewable Energy', description: 'TSMC committed to net-zero operations by 2050.', category: 'case-study', esg_category: 'Environmental', tags: ['Taiwan', 'Benchmark', 'TSMC', 'Renewable Energy', 'Net-Zero'], source: 'https://www.tsmc.com', published_date: '2023-01-01' },
  { id: 'bench-tw-2024', title: 'Taiwan Benchmark: Cathay Financial ESG Integration', description: 'Cathay Financial integrates ESG into investment decisions.', category: 'case-study', esg_category: 'Governance', tags: ['Taiwan', 'Benchmark', 'Cathay', 'Financial', 'ESG Integration'], source: 'https://www.cathayholdings.com', published_date: '2024-01-01' },
];

function insertDoc(doc, index) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(doc);
    const options = {
      hostname: SUPABASE_URL.replace('https://', ''),
      path: '/rest/v1/reading_room_documents',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_KEY,
        'Authorization': 'Bearer ' + SERVICE_KEY,
        'Prefer': 'return=minimal,resolution=merge-duplicates'
      }
    };
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(`✓ [${index + 1}/${documents.length}] ${doc.id}`);
          resolve();
        } else {
          console.log(`✗ [${index + 1}/${documents.length}] ${doc.id}: ${res.statusCode} ${body}`);
          resolve(); // Continue on error
        }
      });
    });
    req.on('error', e => { console.log(`✗ ${doc.id}: ${e.message}`); resolve(); });
    req.write(postData);
    req.end();
  });
}

async function main() {
  console.log(`Inserting ${documents.length} documents...`);
  for (let i = 0; i < documents.length; i++) {
    await insertDoc(documents[i], i);
    await new Promise(r => setTimeout(r, 100)); // Rate limit
  }
  console.log('Done!');
}

main();
