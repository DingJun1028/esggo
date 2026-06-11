import { logEvent } from './logger';

export interface ComplianceResult {
  passed: boolean;
  messages: string[];
}

export interface EnvironmentalData {
  co2?: number;
  water?: number;
  waste?: number;
}

export interface SocialData {
  laborRights?: boolean;
  humanRights?: boolean;
  communityEngagement?: boolean;
}

export interface GovernanceData {
  boardDiversity?: unknown[]; // Array of unknown type, can be refined later if structure is known
  capitalSpending?: number;
  ethics?: boolean;
}

export function checkE(data: EnvironmentalData): ComplianceResult {
  const msgs: string[] = [];
  if (typeof data.co2 !== 'number') msgs.push('缺少或無效的 CO2 排放值 (co2)');
  else if (data.co2 > 10) msgs.push(`CO2 排放過高 (${data.co2}t)`);

  if (typeof data.water !== 'number') msgs.push('缺少或無效的用水量 (water)');
  else if (data.water > 5) msgs.push(`用水量過高 (${data.water}M L)`);

  if (typeof data.waste !== 'number') msgs.push(`缺少或無效的廢棄物量 (waste)`);
  else if (data.waste > 2) msgs.push(`廢棄物過高 (${data.waste}kT)`);

  const passed = msgs.length === 0;
  logEvent('Compliance', 'checkE', data, { passed, messages: msgs });
  return { passed, messages: msgs };
}

export function checkS(data: SocialData): ComplianceResult {
  const msgs: string[] = [];
  if (!data.laborRights) msgs.push('未滿勞工權利要求');
  if (!data.humanRights) msgs.push('未滿人權保障要求');
  if (!data.communityEngagement) msgs.push('缺少社會參與説明');

  const passed = msgs.length === 0;
  logEvent('Compliance', 'checkS', data, { passed, messages: msgs });
  return { passed, messages: msgs };
}

export function checkG(data: GovernanceData): ComplianceResult {
  const msgs: string[] = [];
  if (!Array.isArray(data.boardDiversity) || data.boardDiversity.length < 3) msgs.push('董事會多元化不足');
  if (typeof data.capitalSpending !== 'number' || data.capitalSpending <= 0) msgs.push('資本支出資訊缺失或無效');
  if (!data.ethics) msgs.push('缺少道德規範説明');

  const passed = msgs.length === 0;
  logEvent('Compliance', 'checkG', data, { passed, messages: msgs });
  return { passed, messages: msgs };
}

export function runComplianceCheck(payload: {
  environmental?: EnvironmentalData;
  social?: SocialData;
  governance?: GovernanceData;
}): { e: ComplianceResult; s: ComplianceResult; g: ComplianceResult } {
  const e = checkE(payload.environmental || {});
  const s = checkS(payload.social || {});
  const g = checkG(payload.governance || {});
  logEvent('Compliance', 'runAll', payload, { e, s, g });
  return { e, s, g };
}