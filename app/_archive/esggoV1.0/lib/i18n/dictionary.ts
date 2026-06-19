/**
 * Professional ESG Terminology Dictionary (英標繁博)
 * Aligned with GRI/SASB Standards and 5T Protocol.
 */
export const ESG_DICTIONARY = {
    // Core Platform Terms
    platform: {
        title: { zh: "OmniOne ESG 萬能永續平台", en: "OmniOne ESG Platform", ja: "OmniOne ESG プラットフォーム" },
        version: { zh: "專業企業版 v4.3", en: "Enterprise Edition v4.3", ja: "エンタープライズ版 v4.3" },
    },

    // 5T Protocol
    protocol_5t: {
        traceable: { zh: "可追溯性", en: "Traceability", ja: "トレーサビリティ" },
        transparent: { zh: "透明度", en: "Transparency", ja: "透明性" },
        trustworthy: { zh: "可信度", en: "Trustworthiness", ja: "信頼性" },
        tangible: { zh: "實體性", en: "Tangibility", ja: "実体性" },
        trackable: { zh: "可追蹤性", en: "Trackability", ja: "追跡可能性" },
    },

    // Matrix & Traceability
    matrix: {
        title: { zh: "終始矩陣", en: "Traceability Matrix", ja: "トレーサビリティ・マトリックス" },
        subtitle: { zh: "數據起源至報告之全生命週期追蹤", en: "End-to-End Data Lifecycle Tracking", ja: "データの起源からレポートまでのライフサイクル追跡" },
        intel_nodes: { zh: "情報節點 (Inception)", en: "Intel Nodes (Inception)", ja: "インテル・ノード (初期導入)" },
        evidence_vault: { zh: "證跡庫 (Verification)", en: "Evidence Vault (Verification)", ja: "証跡保管庫 (検証)" },
        wizard_flow: { zh: "精靈編撰 (Transformation)", en: "Wizard Flow (Transformation)", ja: "ウィザード・フロー (変換)" },
        final_manifest: { zh: "最終清單 (Manifestation)", en: "Final Manifest (Manifestation)", ja: "最終マニフェスト (顕在化)" },
    },

    // Sustainability Standards
    standards: {
        gri: { zh: "GRI 準則對標", en: "GRI Standards Alignment", ja: "GRIスタンダード・アライメント" },
        sasb: { zh: "SASB 產業準則", en: "SASB Industry Standards", ja: "SASB産業基準" },
        materiality: { zh: "重大性分析", en: "Materiality Analysis", ja: "重要性（マテリアリティ）分析" },
        double_materiality: { zh: "雙重重大性", en: "Double Materiality", ja: "ダブル・マテリアリティ" },
        scope_1: { zh: "範疇 1 直接排放", en: "Scope 1 Direct Emissions", ja: "スコープ1 直接排出" },
        scope_2: { zh: "範疇 2 能源間接排放", en: "Scope 2 Indirect Emissions", ja: "スコープ2 間接排出" },
        scope_3: { zh: "範疇 3 價值鏈間接排放", en: "Scope 3 Value Chain Emissions", ja: "スコープ3 バリューチェーン排出" },
    },

    // Alignment View
    alignment: {
        view_title: { zh: "認證對標中心", en: "Alignment Center", ja: "アライメント・センター" },
        hero_description: { zh: "洞悉核心永續指標，精準對標國際標準，引領 AI 與實體產業的高效融合。", en: "Analyze core sustainability metrics, align with international standards, and lead the integration of AI and physical industries.", ja: "コア・サステナビリティ指標を分析し、国際基準に適合させ、AIと実体産業の融合をリードします。" },
        launch_wizard: { zh: "啟動引導精靈", en: "Launch Wizard", ja: "ウィザードを起動" },
        tab_standards: { zh: "合規標準", en: "Compliance Standards", ja: "コンプライアンス基準" },
        tab_skills: { zh: "技能矩陣", en: "Skill Matrix", ja: "スキル・マトリックス" },
        tab_databases: { zh: "數據中心", en: "Data Center", ja: "データセンター" },
        wizard_title: { zh: "ESG 導入精靈", en: "ESG Implementation Wizard", ja: "ESG導入ウィザード" },
        wizard_subtitle: { zh: "回答幾個簡單問題，系統將自動為您建議最合適的撰寫排分與數據收集方向。", en: "Answer a few simple questions, and the system will automatically suggest the most suitable writing priority and data collection direction.", ja: "いくつかの簡単な質問に答えると、システムが最適な執筆の優先順位とデータ収集の方向性を自動的に提案します。" },
        step: { zh: "步驟", en: "Step", ja: "ステップ" },
        next: { zh: "下一步", en: "Next", ja: "次へ" },
        return: { zh: "返回", en: "Return", ja: "戻る" },
        complete: { zh: "完成評估", en: "Complete Assessment", ja: "評価を完了" },
        q_industry: { zh: "貴公司主要從事哪項產業別？", en: "What is your primary industry?", ja: "主な業種は何ですか？" },
        opt_mfg: { zh: "製造業", en: "Manufacturing", ja: "製造業" },
        opt_srv: { zh: "服務業", en: "Service", ja: "サービス業" },
        opt_tech: { zh: "科技業", en: "Technology", ja: "テクノロジー業" },
        opt_fin: { zh: "金融業", en: "Finance", ja: "金融業" },
    },
    scope3: {
        view_title: { zh: "供應鏈範疇三監測", en: "Supply Chain Radar", ja: "サプライチェーン・スコープ3レーダー" },
        hero_description: { zh: "即時監測全球一級與二級供應商網絡的範疇三排放量。", en: "Real-time Scope 3 emission monitoring across your global supplier network.", ja: "グローバルなサプライヤーネットワークのスコープ3排出量をリアルタイムで監視します。" },
        total_emissions: { zh: "範疇三總排放量", en: "Total Scope 3 Emissions", ja: "スコープ3総排出量" },
        high_risk_partners: { zh: "高風險合作夥伴", en: "High Risk Partners", ja: "高リスクパートナー" },
        top_emitting_region: { zh: "最高排放區域", en: "Top Emitting Region", ja: "最大排出地域" },
        data_confidence: { zh: "數據信心指數", en: "Data Confidence", ja: "データ信頼度" },
        intensity_radar: { zh: "排放強度分佈", en: "Intensity Radar", ja: "排出強度レーダー" },
        partner_inventory: { zh: "夥伴清單", en: "Partner Inventory", ja: "パートナーインベントリ" },
        active_nodes: { zh: "作用中節點", en: "Active Nodes", ja: "アクティブノード" },
        ai_insight_title: { zh: "AI 預測性分析", en: "AI Predictive Insight", ja: "AI予測インサイト" },
        generate_mitigation: { zh: "生成減緩方案", en: "Generate Mitigation Plan", ja: "緩和策を生成" },
        region_global: { zh: "全球", en: "Global", ja: "グローバル" },
        region_china: { zh: "大中華區", en: "China", ja: "中華圏" },
        region_asia: { zh: "亞太區", en: "Asia Pac", ja: "アジア太平洋" },
        region_europe: { zh: "歐洲", en: "Europe", ja: "欧州" },
        region_namerica: { zh: "北美", en: "N. America", ja: "北米" },
    }
};

export type ESGDictionary = typeof ESG_DICTIONARY;
export type DictionaryKey = keyof ESGDictionary;
