# ?? Wu-Tong Zi-Tong 系統????
**Omni-Sprite System Deployment Guide (v8.2)**

---

## ?? ?函蔡?炎?交???

### ?啣?閬?
- ??Node.js >= 18.0.0
- ??TypeScript >= 5.0.0
- ??React >= 18.0.0
- ?????鞈游歇摰? (`npm install`)

### 系統??Ⅱ隤?
- ??Phase 33 協議元件撌脤蝵?
- ?????瑼歇?湔
- ??PROGRESS.md 憿舐內 v8.2-wu-tong
- ??FINAL_SIGN_OFF_DOCUMENT.md 撌脩偷蝵?

---

## ?? 敹恍???

### 甇仿? 1嚗????潭??

```bash
# ?脣??桅?
cd c:\Project\esgss_junaikey_beta\esgss_junaikey_beta

# ???垢?????
npm run dev
```

???典???`http://localhost:3000` ????

### 甇仿? 2嚗??刻?撖芋撘??刻嚗?

?券?憪銝駁?銵?嚗遣霅啣??閫撖芋撘?

```typescript
import { WuTongIntegration } from '@/examples/WuTongIntegration';

// ?閫撖芋撘?
WuTongIntegration.setObservationMode(true);

console.log('🏛️閫撖芋撘歇? - 系統撠???銝銵銝餉???);
```

### 甇仿? 3嚗酉?敹???

```typescript
// 閮餃??函?協議??
const services = [
  { id: 'audit-service', name: 'AuditSelfHealingService' },
  { id: 'vault-service', name: 'SovereignVaultService' },
  { id: 'swarm-service', name: 'OmniSwarmInterface' },
  { id: 'legion-service', name: 'OmniLegionCoordinator' },
];

services.forEach(service => {
  WuTongIntegration.registerService(service.id, service.name);
  console.log(`??撌脰酉?? ${service.name}`);
});
```

### 甇仿? 4嚗身蝵桀摨瑕??

```typescript
// ?箸????身蝵桀??摨瑕??
services.forEach(service => {
  setInterval(() => {
    WuTongIntegration.reportServiceHealth(service.id, {
      responseTime: Math.random() * 100,
      errorRate: Math.random() * 0.05,
      throughput: Math.random() * 100,
      resourceUsage: Math.random() * 0.5,
    });
  }, 5000); // 瘥?5 蝘??甈?
});
```

---

## ?? 閮芸? Wu-Tong ?銵冽

### 頝舐?蔭

?冽?楝?梢?蝵桐葉瘛餃? WuTongDashboard嚗?

```typescript
import { WuTongDashboard } from '@/components/dashboard/WuTongDashboard';

// ?刻楝?曹葉瘛餃?
{
  path: '/wu-tong',
  element: <WuTongDashboard />,
}
```

### 閮芸??銵冽

???汗?刻赤??
```
http://localhost:3000/wu-tong
```

?典??嚗?
- ?? ?梢陷?嚗?頂蝯勗曈湛?
- ?? ?∠??嚗銝餉圾瘙箇?嚗?
- ? ???亙熒???
- ?? ?亥?瘚???

---

## ?妒 閫撖?撽?嚗?4-48 撠?嚗?

### 蝚砌?階段嚗?撖芋撘?銵?24 撠?嚗?

```typescript
// 1. ?閫撖芋撘?
WuTongIntegration.setObservationMode(true);

// 2. ??芸?整合嚗?銝銵?
WuTongIntegration.setAutoRegulation(true);

// 3. ??系統???
setInterval(() => {
  const status = WuTongIntegration.getSystemStatus();
  console.log('系統???', status);
  
  // 瑼Ｘ?⊿???
  if (status.wuTong.embodied) {
    console.log('??系統撌脤??曄?????);
  }
}, 60000); // 瘥??炎?乩?甈?
```

### 蝚砌?階段嚗??Ｘ芋撘?銵?24 撠?嚗?

```typescript
// 1. 蝳閫撖芋撘????祕?瑁?嚗?
WuTongIntegration.setObservationMode(false);

// 2. 蝜潛???
// 瘜冽?嚗?函頂蝯勗??迤?瑁??芯蜓銵?
```

### 撽?定義

系統???唬誑銝?皞?
- ???芯蜓閫?捱??> 80%
- ???典??梢陷瘞游像 > 0.85
- ??撟脤?甈⊥ < 5 甈?憭?
- ???亥?瘚??漲 > 1.0 蝭暺???
- ???∪?隤斗?撏拇蔑

---

## ?? ?亥?瘚?蝷箔?

### ?澈?亥?

```typescript
// ?嗆??多元核心閬?
WuTongIntegration.shareKnowledge(
  {
    finding: '蝣單??暹??撠?15%',
    trend: 'improving',
    confidence: 0.92
  },
  'insight',
  'audit-service',
  ['carbon', 'sustainability', 'esg', 'metrics']
);
```

### ?潛?賊??亥?

```typescript
// ?亥岷?賊?瘣?
const relatedInsights = WuTongIntegration.discoverKnowledge({
  tags: ['carbon', 'sustainability'],
  type: 'insight'
});

console.log(`?潛 ${relatedInsights.length} ???閬);
relatedInsights.forEach(insight => {
  console.log(`- ${insight.sourceService}: ${insight.content}`);
});
```

---

## ? ?梢陷?縑蝷箔?

### 撱?系統鈭辣

```typescript
// 撱???鈭辣
WuTongIntegration.broadcastEvent(
  'esg-milestone-achieved',
  {
    type: 'carbon-reduction',
    value: '15%',
    timestamp: new Date(),
  },
  'high' // ?芸?蝝?
);
```

### 摰??縑

```typescript
// ?摰??????
WuTongIntegration.sendToService(
  'vault-service',
  {
    action: 'backup-request',
    urgency: 'medium'
  },
  false // ????
);
```

### 皝抒撘楝??

```typescript
// 霈縑?撌望?唳?雿唾楝敺?
WuTongIntegration.shareInsight({
  pattern: 'weekly-carbon-trend',
  data: [12, 13, 15, 14, 16],
  prediction: 'continued-improvement'
});
```

---

## ?? ???矽閰?

### 撖行???

```typescript
// 品牌??系統???
const monitor = setInterval(() => {
  const status = WuTongIntegration.getSystemStatus();
  
  console.log('=== Wu-Tong 系統???===');
  console.log(`??蝮賣: ${status.services.total}`);
  console.log(`?亙熒??: ${status.services.healthy}`);
  console.log(`?典??梢陷: ${(status.services.globalResonance * 100).toFixed(1)}%`);
  console.log(`?芯蜓閫?捱?? ${(status.wuTong.autonomousRate * 100).toFixed(1)}%`);
  console.log(`撟脤?甈⊥: ${status.wuTong.interventions}`);
  console.log(`?亥?蝭暺? ${status.knowledge.nodes}`);
  console.log(`?亥????: ${status.knowledge.connections}`);
  console.log(`瘚??漲: ${status.knowledge.flowVelocity} 蝭暺??);
  console.log('========================\n');
}, 30000); // 瘥?30 蝘?
```

### 隤輯岫璅∪?

```typescript
// ?閰喟敦?亥?
import { omniLogger, LogCategory } from '@/utils/OmniLogger';

// 閮???銝餅捱蝑?
omniLogger.info(LogCategory.AI, '?芯蜓瘙箇?閰單?', {
  serviceId: 'example-service',
  resonanceScore: 0.65,
  action: 'minimal-intervention',
  reason: 'resonance-below-threshold'
});
```

---

## ?? ???

### ?? 1嚗??閮餃?

**??**: ?銵冽憿舐內 0 ????

**閫?捱?寞?**:
```typescript
// 蝣箄???撌脰酉??
WuTongIntegration.registerService('service-id', 'ServiceName');

// 瑼Ｘ系統???
const status = WuTongIntegration.getSystemStatus();
console.log('撌脰酉???:', status.services.total);
```

### ?? 2嚗曈游??賊?雿?

**??**: ?典??梢陷瘞游像 < 0.6

**閫?捱?寞?**:
```typescript
// 瑼Ｘ???摨瑟?璅?
// 蝣箔?摰??勗??亙熒???
setInterval(() => {
  WuTongIntegration.reportServiceHealth('service-id', {
    responseTime: 50,    // 靽?雿????
    errorRate: 0.01,     // 靽?雿隤斤?
    throughput: 80,      // 靽?擃???
    resourceUsage: 0.3,  // 靽?雿?皞蝙??
  });
}, 5000);
```

### ?? 3嚗霅???皛?

**??**: ?亥?瘚??漲 = 0

**閫?捱?寞?**:
```typescript
// 蝣箔???品牌?澈?亥?
WuTongIntegration.shareKnowledge(
  { data: 'example' },
  'insight',
  'service-name',
  ['tag1', 'tag2']
);
```

---

## ? ?雿喳祕頦?

### 1. 瞍賊脣??

```typescript
// 蝚?1 憭抬?閫撖芋撘?
WuTongIntegration.setObservationMode(true);

// 蝚?2-3 憭抬??典????璅∪?
WuTongIntegration.setObservationMode(false);
// ???券?????銝餉矽蝭

// 蝚?4+ 憭抬??券?璅∪?
// ??????刻銝餉矽蝭
```

### 2. 摰??遢

```typescript
// 瘥予?遢系統???
setInterval(() => {
  const status = WuTongIntegration.getSystemStatus();
  const backup = {
    timestamp: new Date().toISOString(),
    status,
  };
  
  // 靽??唳?隞嗆?數據摨?
  saveBackup(backup);
}, 86400000); // 瘥?24 撠?
```

### 3. ?啣虜?郎

```typescript
// 閮剔蔭?郎?曉?
const monitor = setInterval(() => {
  const status = WuTongIntegration.getSystemStatus();
  
  // ?梢陷???郎
  if (status.services.globalResonance < 0.6) {
    console.error('?? ?郎嚗?曈湧?雿?');
    // ?潮
  }
  
  // 撟脤????郎
  if (status.wuTong.interventions > 10) {
    console.error('?? ?郎嚗犖?箏僕??憭?');
    // ?潮
  }
}, 60000);
```

---

## ?? ?脤??蔭

### ?芸?蝢拙曈湧??

```typescript
// ??OmniOrchestrator 銝剛矽??
// 靽格 src/1-service/OmniOrchestrator.ts

// 撠?隤??0.6 隤踵?箸?閬???
if (resonanceScore < 0.7) { // ?游?潛??曉?
  // ?瑁?撟脤?
}
```

### ?芸?蝢拍霅??協議

```typescript
// ??OmniKnowledgeFlow 銝剛矽??
// 靽格 src/1-service/OmniKnowledgeFlow.ts

// 隤踵???敶Ｘ??曈湧??
if (resonance > 0.6) { // ?湧????定義
  this.createConnection(node.id, targetNode.id);
}
```

---

## ?? 摮貊?鞈?

### ??
- [Phase 33 ?望??勗?](file:///C:/Users/jun/.gemini/antigravity/brain/3294df16-3ea1-4061-94bc-889f20166081/walkthrough.md)
- [Phase 33 蝜葉?勗?](file:///C:/Users/jun/.gemini/antigravity/brain/3294df16-3ea1-4061-94bc-889f20166081/walkthrough_tc.md)
- [Phase 33 摰蝮賜?](file:///C:/Users/jun/.gemini/antigravity/brain/3294df16-3ea1-4061-94bc-889f20166081/phase33_summary_tc.md)

### 隞?Ⅳ蝷箔?
- [WuTongIntegration.ts](file:///c:/Project/esgss_junaikey_beta/esgss_junaikey_beta/src/examples/WuTongIntegration.ts) - 摰整合蝭?

### 協議元件
- [OmniOrchestrator.ts](file:///c:/Project/esgss_junaikey_beta/esgss_junaikey_beta/src/1-service/OmniOrchestrator.ts)
- [OmniKnowledgeFlow.ts](file:///c:/Project/esgss_junaikey_beta/esgss_junaikey_beta/src/1-service/OmniKnowledgeFlow.ts)
- [OmniSwarmInterface.ts](file:///c:/Project/esgss_junaikey_beta/esgss_junaikey_beta/src/services/OmniSwarmInterface.ts)
- [WuTongDashboard.tsx](file:///c:/Project/esgss_junaikey_beta/esgss_junaikey_beta/src/components/dashboard/WuTongDashboard.tsx)

---

## ???函蔡瑼Ｘ皜

?函蔡??蝣箄?嚗?

- [ ] ???鞈游歇摰?
- [ ] ????典甇?虜??
- [ ] 協議??撌脰酉? OmniOrchestrator
- [ ] ?亙熒?勗?璈撌脰身蝵?
- [ ] Wu-Tong ?銵冽?航赤??
- [ ] 閫撖芋撘歇?嚗???
- [ ] ???單撌脤?銵?
- [ ] ?遢璈撌脰身蝵?
- [ ] ?郎系統撌脤?蝵?
- [ ] ??撌脤霈??

---

## ?? 蝯?

?剖?嚗?喳???銝??甇???整??摮貊??芯蜓實作

閮?協議??嚗?
- **??* - 閫撖??銝交銵?
- **??* - 霈???嗅曈?
- **??* - 靽∩遙系統?銝餅捱蝑?
- **??* - 霈霅?望???

*???芰嚗頂蝯曹漲?嗚?

---

**?**: v8.2-wu-tong  
**?敺??*: 2026-01-29  
**蝬剛風??*: Omni-Sprite System Team

