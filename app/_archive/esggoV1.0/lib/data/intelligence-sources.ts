export interface IntelligenceSource {
    id: string;
    group: string;
    institution: string;
    url: string;
    type: string;
    frequency: string;
    description: string;
}

export const INTELLIGENCE_SOURCES: IntelligenceSource[] = [
    // A. UN/政府間組織 (10)
    { id: "un-sdgs", group: "UN/政府間組織", institution: "UN SDGs Knowledge Platform", url: "https://sdgs.un.org", type: "全球 SDG 政策、會議、國家報告", frequency: "Weekly", description: "聯合國永續發展目標核心知識庫" },
    { id: "unep", group: "UN/政府間組織", institution: "UNEP (聯合國環境規劃署)", url: "https://www.unep.org", type: "氣氣候、污染、自然、生物多樣性", frequency: "Daily-Weekly", description: "全球環境治理" },
    { id: "unfccc", group: "UN/政府間組織", institution: "UNFCCC", url: "https://unfccc.int", type: "氣候談判、COP 文稿", frequency: "Daily", description: "氣候變遷公約" },
    { id: "ipcc", group: "UN/政府間組織", institution: "IPCC", url: "https://www.ipcc.ch", type: "氣候科學評估 (AR 系列)", frequency: "Fixed", description: "權威氣候科學" },
    { id: "undp", group: "UN/政府間組織", institution: "UNDP", url: "https://www.undp.org", type: "再生發展、治理、減貧", frequency: "Weekly", description: "聯合國開發計畫署" },
    { id: "who", group: "UN/政府間組織", institution: "WHO", url: "https://www.who.int", type: "健康、公共衛生、全球風險", frequency: "Daily", description: "世界衛生組織" },
    { id: "world-bank", group: "UN/政府間組織", institution: "World Bank", url: "https://www.worldbank.org", type: "氣候投資、政策貸款", frequency: "Weekly", description: "世界銀行" },
    { id: "oecd", group: "UN/政府間組織", institution: "OECD", url: "https://www.oecd.org", type: "永續政策、碳定價、治理", frequency: "Weekly", description: "經合組織" },
    { id: "iea", group: "UN/政府間組織", institution: "IEA", url: "https://www.iea.org", type: "能源轉型、能源市場", frequency: "Weekly", description: "國際能源署" },
    { id: "imf", group: "UN/政府間組織", institution: "IMF", url: "https://www.imf.org", type: "宏觀、轉型金融、風險", frequency: "Weekly", description: "國際貨幣基金組織" },

    // B. 國際智庫/NGO/研究機構 (10)
    { id: "wri", group: "國際智庫/NGO", institution: "WRI (世界資源研究所)", url: "https://www.wri.org", type: "氣候、土地利用、能源政策", frequency: "Daily", description: "全球資源政策分析" },
    { id: "wwf", group: "國際智庫/NGO", institution: "WWF", url: "https://www.worldwildlife.org", type: "生物多樣性、自然資本", frequency: "Weekly", description: "世界自然基金會" },
    { id: "iucn", group: "國際智庫/NGO", institution: "IUCN", url: "https://www.iucn.org", type: "物種名錄、自然政策", frequency: "Weekly", description: "國際自然保護聯盟" },
    { id: "nature-org", group: "國際智庫/NGO", institution: "Nature Conservancy", url: "https://www.nature.org", type: "自然保育、自然解方", frequency: "Weekly", description: "大自然保護協會" },
    { id: "cpi", group: "國際智庫/NGO", institution: "Climate Policy Initiative", url: "https://www.climatepolicyinitiative.org", type: "氣候金融、投資趨勢", frequency: "Weekly", description: "氣候政策倡議" },
    { id: "tpi", group: "國際智庫/NGO", institution: "Transition Pathway Initiative", url: "https://www.transitionpathwayinitiative.org", type: "企業轉型評估、氣候治理", frequency: "Quarterly", description: "轉型路徑倡議" },
    { id: "carbon-tracker", group: "國際智庫/NGO", institution: "Carbon Tracker", url: "https://carbontracker.org", type: "化石資產風險研究", frequency: "Monthly", description: "碳追蹤" },
    { id: "rmi", group: "國際智庫/NGO", institution: "RMI", url: "https://rmi.org", type: "能源效率、淨零解方", frequency: "Weekly", description: "落磯山研究所" },
    { id: "wef", group: "國際智庫/NGO", institution: "WEF", url: "https://www.weforum.org", type: "全球趨勢、產業倡議", frequency: "Daily", description: "世界經濟論壇" },
    { id: "ellen-macarthur", group: "國際智庫/NGO", institution: "Ellen MacArthur Foundation", url: "https://ellenmacarthurfoundation.org", type: "循環經濟、設計策略", frequency: "Weekly", description: "艾倫·麥克阿瑟基金會" },

    // C. 揭露/標準/評等與框架 (11)
    { id: "issb", group: "揭露/標準", institution: "IFRS / ISSB", url: "https://www.ifrs.org", type: "全球永續揭露標準 (S1/S2)", frequency: "Weekly", description: "國際永續準則委員會" },
    { id: "cdp", group: "揭露/標準", institution: "CDP", url: "https://www.cdp.net", type: "氣候、水、森林揭露", frequency: "Weekly", description: "碳揭露專案" },
    { id: "gri", group: "揭露/標準", institution: "GRI", url: "https://www.globalreporting.org", type: "全球永續報告準則", frequency: "Weekly", description: "全球報告倡議組織" },
    { id: "sbti", group: "揭露/標準", institution: "SBTi", url: "https://sciencebasedtargets.org", type: "科學基礎減量目標", frequency: "Weekly", description: "科學減碳目標倡議" },
    { id: "tnfd", group: "揭露/標準", institution: "TNFD", url: "https://tnfd.global", type: "自然相關財務揭露", frequency: "Monthly", description: "自然相關財務揭露框架" },
    { id: "pri", group: "揭露/標準", institution: "PRI", url: "https://www.unpri.org", type: "責任投資原則", frequency: "Weekly", description: "責任投資原則" },
    { id: "msci-esg", group: "揭露/標準", institution: "MSCI ESG", url: "https://www.msci.com/our-solutions/esg-investing", type: "ESG Ratings/Research", frequency: "Weekly", description: "MSCI ESG 評級" },
    { id: "sustainalytics", group: "揭露/標準", institution: "Sustainalytics", url: "https://www.sustainalytics.com", type: "ESG Risk Ratings", frequency: "Weekly", description: "Sustainalytics 評級" },
    { id: "dg-clima", group: "政策執行端", institution: "EC - DG CLIMA", url: "https://climate.ec.europa.eu/index_en", type: "歐盟氣候政策、CBAM", frequency: "Daily", description: "歐盟氣候行動" },
    { id: "sec-gov", group: "政策執行端", institution: "U.S. SEC", url: "https://www.sec.gov", type: "美國上市公司揭露", frequency: "Daily", description: "美國證管會" },
    { id: "epa-gov", group: "政策執行端", institution: "U.S. EPA", url: "https://www.epa.gov", type: "氣候風險與環境監管", frequency: "Weekly", description: "美國環保署" },

    // D. 市場價格與風險 (10)
    { id: "eex", group: "市場價格端", institution: "EEX", url: "https://www.eex.com", type: "EUA/EUAA 交易資訊", frequency: "Daily", description: "歐洲能量交易所" },
    { id: "ice", group: "市場價格端", institution: "ICE", url: "https://www.ice.com", type: "EUA 期貨與能源合約", frequency: "Daily", description: "洲際交易所" },
    { id: "eia", group: "市場價格端", institution: "U.S. EIA", url: "https://www.eia.gov", type: "能源統計與展望", frequency: "Daily", description: "美國能源資訊管理局" },
    { id: "lloyds", group: "市場價格端", institution: "Lloyd's", url: "https://www.lloyds.com", type: "新興風險、保險洞察", frequency: "Weekly", description: "勞合社" },
    { id: "imo", group: "風險事件端", institution: "IMO", url: "https://www.imo.org", type: "海事安全與規範", frequency: "Weekly", description: "國際海事組織" },
    { id: "ofac", group: "地緣與供應鏈", institution: "OFAC", url: "https://ofac.treasury.gov", type: "制裁名單與出口限制", frequency: "Daily", description: "美國外國資產控制辦公室" },
    { id: "eu-sanctions", group: "地緣與供應鏈", institution: "EU Sanctions Map", url: "https://www.sanctionsmap.eu", type: "EU 制裁措施查詢", frequency: "Daily", description: "歐盟制裁地圖" },
    { id: "un-comtrade", group: "地緣與供應鏈", institution: "UN Comtrade", url: "https://comtrade.un.org", type: "全球貿易統計數據", frequency: "Monthly", description: "聯合國商品貿易統計" },
    { id: "wto", group: "地緣與供應鏈", institution: "WTO Data", url: "https://data.wto.org", type: "關稅與貿易數據", frequency: "Weekly", description: "世界貿易組織數據門戶" },
    { id: "impact-alpha", group: "獨立媒體", institution: "ImpactAlpha", url: "https://impactalpha.com", type: "影響力投資市場動向", frequency: "Daily", description: "影響力金融新聞" },
    { id: "fsc-tw-2025", group: "政策執行端", institution: "金管會", url: "https://www.fsc.gov.tw", type: "強制性永續報告書申報", frequency: "Annual", description: "2025年起全體上市櫃公司強制申報永續報告書" },
    { id: "twse-template-2025", group: "揭露/標準", institution: "證交所", url: "https://cgc.twse.com.tw", type: "報告書模板與指引", frequency: "Fixed", description: "輔助產製永續報告書功能與參考範本" }
];
