import { logEvent } from './logger';
export function checkE(data) {
    const msgs = [];
    if (typeof data.co2 !== 'number')
        msgs.push('缺少或無效的 CO2 排放值 (co2)');
    else if (data.co2 > 10)
        msgs.push(`CO2 排放過高 (${data.co2}t)`);
    if (typeof data.water !== 'number')
        msgs.push('缺少或無效的用水量 (water)');
    else if (data.water > 5)
        msgs.push(`用水量過高 (${data.water}M L)`);
    if (typeof data.waste !== 'number')
        msgs.push('缺少或無效的廢棄物量 (waste)');
    else if (data.waste > 2)
        msgs.push(`廢棄物過高 (${data.waste}kT)`);
    const passed = msgs.length === 0;
    logEvent('Compliance', 'checkE', data, { passed, messages: msgs });
    return { passed, messages: msgs };
}
export function checkS(data) {
    const msgs = [];
    if (!data.laborRights)
        msgs.push('未滿勞工權利要求');
    if (!data.humanRights)
        msgs.push('未滿人權保障要求');
    if (!data.communityEngagement)
        msgs.push('缺少社會參與説明');
    const passed = msgs.length === 0;
    logEvent('Compliance', 'checkS', data, { passed, messages: msgs });
    return { passed, messages: msgs };
}
export function checkG(data) {
    const msgs = [];
    if (!Array.isArray(data.boardDiversity) || data.boardDiversity.length < 3)
        msgs.push('董事會多元化不足');
    if (typeof data.capitalSpending !== 'number' || data.capitalSpending <= 0)
        msgs.push('資本支出資訊缺失或無效');
    if (!data.ethics)
        msgs.push('缺少道德規範説明');
    const passed = msgs.length === 0;
    logEvent('Compliance', 'checkG', data, { passed, messages: msgs });
    return { passed, messages: msgs };
}
export function runComplianceCheck(payload) {
    const e = checkE(payload.environmental || {});
    const s = checkS(payload.social || {});
    const g = checkG(payload.governance || {});
    logEvent('Compliance', 'runAll', payload, { e, s, g });
    return { e, s, g };
}
//# sourceMappingURL=compliance.js.map