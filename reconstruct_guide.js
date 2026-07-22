const fs = require('fs');
const filePath = 'c:/Project/esggo/components/views/system/guide-view.tsx';

// 1. Define the fresh, clean content for the corrupted sections
const freshInterface = `interface ChapterData {
  title: string;
  items: string[];
  explanation: {
    purpose: string;
    why: string;
  };
}

const CHAPTER_CONTENT: Record<string, ChapterData> = {
  "1.01 報告期間及範疇 (Period & Scope)": {
    title: "1.01 報告期間及範疇 (Period & Scope)",
    items: [
      "2.01 報告邊界及範疇 (Boundary & Scope)",
      "1.03.3 數據彙整頻率 (Period & Freq)",
    ],
    explanation: {
      purpose: "界定報告書涵蓋的時間與企業邊界 (Define the time and corporate boundaries).",
      why: "確保數據可比性與透明度 (Ensure data comparability and transparency)."
    }
  },
  "1.02 關於本公司 (About Company)": {
    title: "1.02 關於本公司 (About Company)",
    items: ["1.01 組織架構與治理 (Organization & Governance)"],
    explanation: {
      purpose: "介紹公司背景與核心業務 (Introduce company background and core business).",
      why: "建立利害關係人之基本信任 (Establish basic trust with stakeholders)."
    }
  },
  "2.03.1.1 永續管理之角色及督導情形 (Oversight Role)": {
    title: "2.03.1.1 永續管理之角色及督導情形 (Oversight Role)",
    items: [
      "2.01 永續發展策略 (Sustainability Strategy)",
      "2.03.3 功能性委員會結構及運作情形 (Committee Status)"
    ],
    explanation: {
      purpose: "釐清董事會如何督導永續事務 (Clarify how the board oversees sustainability).",
      why: "符合公司法與 ESG 治理規範 (Comply with company law and ESG governance)."
    }
  },
  "5.02.2 職業安全與衛生 (Occupational Health & Safety)": {
    title: "5.02.2 職業安全與衛生 (OHS)",
    items: [
      "2.03.1.1 職業災害統計 (Work Injury Statistics)",
      "5.02.1 安全維護機制 (Safety Mechanisms)"
    ],
    explanation: {
      purpose: "追蹤員工健康與安全績效 (Track employee health and safety performance).",
      why: "履行企業社會責任並降低風險 (Fulfill CSR and mitigate risk)."
    }
  }
};
`;

// 2. Read the existing file
let content = fs.readFileSync(filePath, 'utf8');

// 3. Find segments to preserve (imports and React component logic)
// The interface starts where 'interface ChapterData' was (or its corrupted form)
// The object ends where 'const CHAPTERS = [' starts.
const interfaceStartMarker = 'interface ChapterDat'; // Use the corrupted prefix for matching
const dataEndMarker = 'const CHAPTERS = [';

let startIndex = content.indexOf(interfaceStartMarker);
if (startIndex === -1) {
    // Try other variants if first fails
    startIndex = content.indexOf('interface ChapterData');
}
const endIndex = content.indexOf(dataEndMarker);

if (startIndex !== -1 && endIndex !== -1) {
    const prefix = content.substring(0, startIndex);
    const suffix = content.substring(endIndex);
    
    const finalContent = prefix + freshInterface + '\n' + suffix;
    fs.writeFileSync(filePath, finalContent, 'utf8');
    console.log('Successfully reconstructed guide-view.tsx with fresh UTF-8 content.');
} else {
    console.error('Markers not found. Surgical replacement failed. Attempting global write.');
}
