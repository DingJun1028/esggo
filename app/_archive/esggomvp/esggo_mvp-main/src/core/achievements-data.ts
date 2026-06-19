/**
 * 🏆 ESGss Achievements Matrix — Master Data
 * "Every Action is a Seed, Every Achievement is a Forest"
 */

import { IAchievement } from "./dtos/AlchemyState.dto";

export const MASTER_ACHIEVEMENTS: IAchievement[] = [
    // --- Initial / Foundational ---
    {
        id: 'ach-first-res',
        name: 'First Resonance',
        name_zh: '初次共鳴',
        description: 'Complete your first personal ESG dashboard set up.',
        description_zh: '完成您的首次個人 ESG 儀表板設定。',
        icon: 'Zap',
        category: 'Environment',
        expReward: 100
    },
    {
        id: 'ach-trace-master',
        name: 'Traceability Expert',
        name_zh: '溯源專家',
        description: 'Verify 50 data points using the 5T Protocol.',
        description_zh: '使用 5T 協議驗證 50 個數據點。',
        icon: 'Search',
        category: 'Governance',
        expReward: 500
    },
    {
        id: 'ach-zero-vulnerability',
        name: 'Zero Vulnerability',
        name_zh: '超零弱點',
        description: 'Achieve a 100% security score in your Sovereign Container.',
        description_zh: '在您的主權容器中達成 100% 的安全評分。',
        icon: 'ShieldCheck',
        category: 'Governance',
        expReward: 1000
    },

    // --- Environmental (E) ---
    {
        id: 'ach-carbon-novice',
        name: 'Carbon Novice',
        name_zh: '碳中和初學者',
        description: 'Calculate your first Scope 1 emission.',
        description_zh: '完成您的首次範疇一排放計算。',
        icon: 'Cloud',
        category: 'Environment',
        expReward: 200
    },
    {
        id: 'ach-green-energy',
        name: 'Renewable Advocate',
        name_zh: '再生能源倡議者',
        description: 'Switch to a 100% renewable energy source for one facility.',
        description_zh: '將一個設施切換至 100% 再生能源。',
        icon: 'Sun',
        category: 'Environment',
        expReward: 500
    },
    {
        id: 'ach-water-guardian',
        name: 'Water Guardian',
        name_zh: '水資源守護者',
        description: 'Reduce water intensity by 10% in a single quarter.',
        description_zh: '在單一季度內降低 10% 的用水強度。',
        icon: 'Droplets',
        category: 'Environment',
        expReward: 400
    },
    {
        id: 'ach-waste-warrior',
        name: 'Circular Warrior',
        name_zh: '循環戰士',
        description: 'Achieve zero waste-to-landfill for a production line.',
        description_zh: '實現生產線的廢棄物零填埋。',
        icon: 'Recycle',
        category: 'Environment',
        expReward: 600
    },
    {
        id: 'ach-net-zero-hero',
        name: 'Net Zero Hero',
        name_zh: '淨零英雄',
        description: 'Complete a full Net Zero transition roadmap.',
        description_zh: '完成完整的淨零轉型路線圖。',
        icon: 'Mountain',
        category: 'Environment',
        expReward: 2000
    },

    // --- Social (S) ---
    {
        id: 'ach-diversity-champion',
        name: 'DEI Champion',
        name_zh: '多元平權捍衛者',
        description: 'Implement a comprehensive Diversity, Equity, and Inclusion policy.',
        description_zh: '實施全面的多元、平等與共融政策。',
        icon: 'Users',
        category: 'Social',
        expReward: 500
    },
    {
        id: 'ach-safety-first',
        name: 'Safety Titan',
        name_zh: '工安巨擘',
        description: 'Achieve 365 consecutive days with zero lost-time injuries.',
        description_zh: '達成連續 365 天零工傷紀錄。',
        icon: 'HardHat',
        category: 'Social',
        expReward: 800
    },
    {
        id: 'ach-community-builder',
        name: 'Legacy Builder',
        name_zh: '傳承建立者',
        description: 'Donate over 1,000 volunteer hours to local ESG projects.',
        description_zh: '為當地 ESG 專案貢獻超過 1,000 小時志工時間。',
        icon: 'Heart',
        category: 'Social',
        expReward: 700
    },

    // --- Governance (G) ---
    {
        id: 'ach-bribery-shield',
        name: 'Ethics Shield',
        name_zh: '道德之盾',
        description: '100% of employees completed anti-bribery training.',
        description_zh: '100% 員工完成反賄賂培訓。',
        icon: 'Shield',
        category: 'Governance',
        expReward: 500
    },
    {
        id: 'ach-transparency-king',
        name: 'Transparency King',
        name_zh: '透明度之王',
        description: 'Publish full board meeting minutes for a fiscal year.',
        description_zh: '發布一整個財政年度的董事會會議紀錄。',
        icon: 'Eye',
        category: 'Governance',
        expReward: 600
    },
    {
        id: 'ach-data-sovereign',
        name: 'Data Sovereign',
        name_zh: '數據主權者',
        description: 'Successfully deployed a Sovereign Container for all ESG data.',
        description_zh: '為所有 ESG 數據成功部署主權容器。',
        icon: 'Database',
        category: 'Governance',
        expReward: 1200
    },

    // --- Learning & Academy ---
    {
        id: 'ach-academy-scholar',
        name: 'Academy Scholar',
        name_zh: '學術學者',
        description: 'Enroll in your first professional course at Berkeley Academy.',
        description_zh: '在 Berkeley 認證學院註冊您的第一門專業課程。',
        icon: 'GraduationCap',
        category: 'Social',
        expReward: 300
    },
    {
        id: 'ach-certified-auditor',
        name: 'Certified ESG Auditor',
        name_zh: '認證 ESG 稽核師',
        description: 'Complete the ESG Fundamentals & GRI Standards course.',
        description_zh: '完成 ESG 基礎與 GRI 標準課程。',
        icon: 'FileCheck',
        category: 'Governance',
        expReward: 1000
    },
    {
        id: 'ach-netzero-architect',
        name: 'Net Zero Architect',
        name_zh: '淨零建築師',
        description: 'Complete the ISO 14064-1 Carbon Accounting course.',
        description_zh: '完成 ISO 14064-1 碳盤查課程。',
        icon: 'Wind',
        category: 'Environment',
        expReward: 2000
    },
    {
        id: 'ach-berkeley-alumni',
        name: 'Berkeley Alumni',
        name_zh: 'Berkeley 校友',
        description: 'Successfully earn your first professional certificate.',
        description_zh: '成功獲得您的首張專業證照。',
        icon: 'BadgeCheck',
        category: 'Governance',
        expReward: 1000
    },
    {
        id: 'ach-omni-scholar',
        name: 'Omni Scholar',
        name_zh: '萬能學者',
        description: 'Complete 10 different courses across all categories.',
        description_zh: '完成跨類別的 10 門不同課程。',
        icon: 'Library',
        category: 'Governance',
        expReward: 5000
    }
];
