// ═══════════════════════════════════════════════════════════════
// ESGGO Skill Registry
// 自動註冊所有 ESG 技能
// ═══════════════════════════════════════════════════════════════

// 導入所有技能（會自動觸發 registerSkill）
import './carbon-calculation';
import './tcfd-analysis';
import './sdg-mapping';
import './compliance-review';
import './gri-report-draft';
import './materiality-matrix';

// 重新匯出基底類別和註冊函數
export {
  ESGSkill,
  registerSkill,
  getSkill,
  getAllSkills,
} from './index';

export type {
  SkillResult,
  SkillContext,
} from './index';
