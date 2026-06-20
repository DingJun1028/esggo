-- =============================================================================
-- Reading Room Documents Seed Data
-- 在 Supabase SQL Editor 中執行此檔案
-- =============================================================================

-- 確保表格存在
CREATE TABLE IF NOT EXISTS public.reading_room_documents (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'standard',
  file_url TEXT,
  gri_reference TEXT,
  esg_category TEXT,
  tags TEXT[] DEFAULT '{}',
  source TEXT,
  published_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 確保 RLS 已啟用
ALTER TABLE public.reading_room_documents ENABLE ROW LEVEL SECURITY;

-- 建立政策（如果不存在）
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reading_room_documents' AND policyname = 'Everyone can read') THEN
    CREATE POLICY "Everyone can read" ON public.reading_room_documents FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reading_room_documents' AND policyname = 'Service role can manage') THEN
    CREATE POLICY "Service role can manage" ON public.reading_room_documents FOR ALL USING (true);
  END IF;
END $$;

-- 建立索引
CREATE INDEX IF NOT EXISTS idx_rr_documents_category ON public.reading_room_documents(category);
CREATE INDEX IF NOT EXISTS idx_rr_documents_esg ON public.reading_room_documents(esg_category);

-- =============================================================================
-- 插入文件資料
-- =============================================================================

INSERT INTO public.reading_room_documents (id, title, description, category, file_url, gri_reference, esg_category, tags, source, published_date) VALUES
-- Standards
('std-gri-2021', 'GRI 2021 Universal Standards', 'GRI 通用準則為所有組織提供關於一般揭露的基礎框架。', 'standard', NULL, 'GRI 2', 'Governance', ARRAY['GRI','Universal Standards','Governance'], 'https://www.globalreporting.org/standards/', '2023-01-01'),
('std-gri-305', 'GRI 305: Emissions 2016', '規範組織對溫室氣體排放的揭露要求，涵蓋範疇一、二、三。', 'standard', NULL, 'GRI 305', 'Environmental', ARRAY['GRI','Emissions','Scope 1','Scope 2','Scope 3','GHG'], 'https://www.globalreporting.org/standards/', '2016-07-01'),
('std-gri-302', 'GRI 302: Energy 2016', '規範組織對能源消耗、能源強度及再生能源使用情況的揭露要求。', 'standard', NULL, 'GRI 302', 'Environmental', ARRAY['GRI','Energy','Renewable Energy'], 'https://www.globalreporting.org/standards/', '2016-07-01'),
('std-gri-401', 'GRI 401: Employment 2016', '規範組織對員工僱用、勞資關係、職業健康與安全的揭露要求。', 'standard', NULL, 'GRI 401', 'Social', ARRAY['GRI','Employment','Labor','Health','Safety'], 'https://www.globalreporting.org/standards/', '2016-07-01'),
('std-gri-403', 'GRI 403: Occupational Health and Safety 2018', '規範組織對職業健康與安全管理體系、工作者參與、訓練的揭露要求。', 'standard', NULL, 'GRI 403', 'Social', ARRAY['GRI','Health','Safety','Workers','Training'], 'https://www.globalreporting.org/standards/', '2018-12-01'),
('std-gri-405', 'GRI 405: Diversity and Equal Opportunity 2016', '規範組織對多元化與平等機會的揭露要求。', 'standard', NULL, 'GRI 405', 'Social', ARRAY['GRI','Diversity','Equal Opportunity','Gender','Board'], 'https://www.globalreporting.org/standards/', '2016-07-01'),
('std-gri-413', 'GRI 413: Local Communities 2016', '規範組織對當地社區影響的揭露要求。', 'standard', NULL, 'GRI 413', 'Social', ARRAY['GRI','Local Communities','Impact Assessment'], 'https://www.globalreporting.org/standards/', '2016-07-01'),
('std-gri-418', 'GRI 418: Customer Privacy 2016', '規範組織對客戶隱私與個人資料保護的揭露要求。', 'standard', NULL, 'GRI 418', 'Social', ARRAY['GRI','Customer Privacy','Data Protection','GDPR'], 'https://www.globalreporting.org/standards/', '2016-07-01'),
('std-tcfd', 'TCFD Recommendations', 'TCFD 建議企業依據四大支柱揭露氣候相關財務風險與機會。', 'standard', NULL, NULL, 'Governance', ARRAY['TCFD','Climate','Risk','Disclosure'], 'https://www.fsb-tcfd.org/', '2017-06-29'),
('std-issb-s1', 'IFRS S1 General Requirements', 'IFRS S1 規定企業應揭露永續相關風險和機會的相關資訊。', 'standard', NULL, NULL, 'Governance', ARRAY['ISSB','IFRS S1','Sustainability'], 'https://www.ifrs.org/', '2024-01-01'),
('std-issb-s2', 'IFRS S2 Climate-related Disclosures', 'IFRS S2 專注於氣候相關風險和機會的揭露。', 'standard', NULL, NULL, 'Environmental', ARRAY['ISSB','IFRS S2','Climate','GHG'], 'https://www.ifrs.org/', '2024-01-01'),
('std-iso-14064', 'ISO 14064-1:2018 Greenhouse gases', '提供組織層級溫室氣體排放和移除的量化及報告規範。', 'standard', NULL, NULL, 'Environmental', ARRAY['ISO','GHG','Inventory','Verification'], 'https://www.iso.org/standard/66453.html', '2018-12-01'),
('std-iso-14001', 'ISO 14001:2015 EMS', 'ISO 14001 規定環境管理系統的要求。', 'standard', NULL, NULL, 'Environmental', ARRAY['ISO','EMS','Environmental Management'], 'https://www.iso.org/', '2015-09-15'),
('std-iso-45001', 'ISO 45001:2018 Occupational health and safety', 'ISO 45001 規定職業健康與安全管理系統的要求。', 'standard', NULL, NULL, 'Social', ARRAY['ISO','Health','Safety','Workers'], 'https://www.iso.org/standard/63787.html', '2018-03-01'),
('std-gri-biodiversity-2024', 'GRI 101: Biodiversity 2024', '生物多樣性報告標準重大更新。', 'standard', 'https://www.globalreporting.org/standards/media/1001/gri-101-biodiversity-2024.pdf', 'GRI 101', 'Environmental', ARRAY['GRI','Biodiversity','Nature','TNFD'], 'https://www.globalreporting.org/', '2024-01-25'),
('std-sasb-tech', 'SASB Technology & Communications', '針對軟體與 IT 服務產業的永續會計標準。', 'standard', NULL, NULL, 'Social', ARRAY['SASB','Technology','Software','IT Services'], 'https://sasb.org/', '2018-10-04'),
('std-sasb-finance', 'SASB Financials - Commercial Banks', '針對商業銀行業的永續會計標準。', 'standard', NULL, NULL, 'Governance', ARRAY['SASB','Financials','Banking','Risk Management'], 'https://sasb.org/', '2018-10-04'),

-- Regulations
('reg-tw-fsc', '金管會永續發展路徑圖', '金管會規定台灣上市上櫃公司分階段提升 ESG 揭露標準。', 'regulation', NULL, NULL, 'Governance', ARRAY['台灣法規','金管會','ESG','永續報告'], 'https://www.fsc.gov.tw', '2023-01-01'),
('reg-tw-climate-change', '氣候變遷因應法', '台灣氣候變遷因應法規定溫室氣體減量目標、碳費徵收機制。', 'regulation', NULL, NULL, 'Environmental', ARRAY['台灣法規','氣候變遷','碳費','減量'], 'https://law.moj.gov.tw/', '2023-02-15'),
('reg-tw-csr', '上市上櫃公司永續發展實務守則', '台灣證交所與櫃買中心共同制定之永續發展實務守則。', 'regulation', NULL, NULL, 'Governance', ARRAY['台灣法規','CSR','永續治理','揭露'], 'https://www.twse.com.tw/', '2022-01-01'),
('reg-eu-csrd', 'CSRD / ESRS', 'CSRD 是歐盟最新的永續報告法規，引入雙重重大性原則。', 'regulation', NULL, NULL, 'Governance', ARRAY['EU','CSRD','ESRS','Double Materiality'], 'https://finance.ec.europa.eu/', '2024-01-01'),
('reg-eu-cbam', 'EU CBAM Implementing Regulation', 'CBAM 對進入歐盟的高碳商品課徵碳關稅。', 'regulation', 'https://eur-lex.europa.eu/eli/reg/2023/956', NULL, 'Environmental', ARRAY['EU','CBAM','Carbon Border','Regulation'], 'https://eur-lex.europa.eu/eli/reg/2023/956', '2023-05-16'),
('reg-eu-taxonomy', 'EU Taxonomy Regulation', '歐盟分類法規定六項環境目標，要求企業揭露符合永續分類法之比例。', 'regulation', NULL, NULL, 'Environmental', ARRAY['EU','Taxonomy','Green Finance','Disclosure'], 'https://finance.ec.europa.eu/', '2021-07-01'),
('reg-us-sec-climate', 'SEC Climate Disclosure Rule', '美國證券交易委員會要求上市公司揭露氣候相關風險與溫室氣體排放。', 'regulation', NULL, NULL, 'Governance', ARRAY['US','SEC','Climate','Disclosure','GHG'], 'https://www.sec.gov/', '2024-03-01'),

-- Case Studies
('bench-global-2021', 'Microsoft Carbon Negative by 2030', 'Microsoft committed to be carbon negative by 2030.', 'case-study', NULL, NULL, 'Environmental', ARRAY['International','Benchmark','Carbon Negative','Technology'], 'https://www.microsoft.com/', '2021-01-01'),
('bench-global-2022', 'Ørsted Renewable Energy Transformation', 'Ørsted transformed to largest offshore wind developer.', 'case-study', NULL, NULL, 'Environmental', ARRAY['International','Benchmark','Renewable Energy','Offshore Wind','SBTi'], 'https://orsted.com/', '2022-01-01'),
('bench-global-2023', 'IKEA Circular Economy', 'IKEA committed to becoming climate positive by 2030.', 'case-study', NULL, NULL, 'Environmental', ARRAY['International','Benchmark','Circular Economy','Retail'], 'https://www.ikea.com/', '2023-01-01'),
('bench-global-2024', 'Uniqlo Sustainable Supply Chain', 'Uniqlo leads in textile sustainability with recycling programs.', 'case-study', NULL, NULL, 'Social', ARRAY['International','Benchmark','Textile','Supply Chain','Recycling'], 'https://www.uniqlo.com/', '2024-01-01'),
('bench-tw-2023', 'TSMC Renewable Energy', 'TSMC committed to net-zero operations by 2050.', 'case-study', NULL, NULL, 'Environmental', ARRAY['Taiwan','Benchmark','TSMC','Renewable Energy','Net-Zero'], 'https://www.tsmc.com', '2023-01-01'),
('bench-tw-2024', 'Cathay Financial ESG Integration', 'Cathay Financial integrates ESG into investment decisions.', 'case-study', NULL, NULL, 'Governance', ARRAY['Taiwan','Benchmark','Cathay','Financial','ESG Integration'], 'https://www.cathayholdings.com', '2024-01-01'),
('bench-tw-2025', 'ASE Technology Water Stewardship', 'ASE Technology achieved water neutrality at major facilities.', 'case-study', NULL, NULL, 'Environmental', ARRAY['Taiwan','Benchmark','ASE','Water Stewardship','Semiconductor'], 'https://www.aseglobal.com', '2025-01-01')

ON CONFLICT (id) DO NOTHING;

-- 驗證插入結果
SELECT esg_category, COUNT(*) as count
FROM public.reading_room_documents
GROUP BY esg_category
ORDER BY esg_category;
