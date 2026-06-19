# ?? Wu-Tong 系統敹恍?????
**Quick Reference Guide for Developers**

---

## ??5 ??敹恍???

### 1. 閮餃???
```typescript
import { WuTongIntegration } from '@/examples/WuTongIntegration';

WuTongIntegration.registerService('my-service', 'MyServiceName');
```

### 2. ?勗??亙熒???
```typescript
setInterval(() => {
  WuTongIntegration.reportServiceHealth('my-service', {
    responseTime: 45,
    errorRate: 0.02,
    throughput: 75,
    resourceUsage: 0.35
  });
}, 5000);
```

### 3. ?澈?亥?
```typescript
WuTongIntegration.shareKnowledge(
  { finding: '???潛' },
  'insight',
  'MyServiceName',
  ['tag1', 'tag2']
);
```

### 4. ?潮曈港縑??
```typescript
WuTongIntegration.broadcastEvent(
  'event-type',
  { data: 'payload' },
  'high'
);
```

### 5. ?亦?系統???
```typescript
const status = WuTongIntegration.getSystemStatus();
console.log(status);
```

---

## ?? 協議元件?

### OmniOrchestrator
**?券?*: ?芯蜓??蝺冽?  
**?辣**: `src/1-service/OmniOrchestrator.ts`

```typescript
// 閮餃???
orchestrator.registerService(id, name);

// ?勗??亙熒
orchestrator.reportHealth(id, metrics);

// ?脣????
const status = orchestrator.getSystemStatus();
```

### OmniKnowledgeFlow
**?券?*: ?芰?亥?瘚?  
**?辣**: `src/1-service/OmniKnowledgeFlow.ts`

```typescript
// 瘛餃??亥?蝭暺?
knowledgeFlow.addNode(content, type, source, tags);

// ?潛?賊??亥?
const insights = knowledgeFlow.discoverKnowledge(query);

// ?脣?瘚???
const analysis = knowledgeFlow.getFlowAnalysis();
```

### OmniSwarmInterface
**?券?*: ?梢陷?縑  
**?辣**: `src/services/OmniSwarmInterface.ts`

```typescript
// 撱?靽∟?
swarm.broadcastSystemEvent(event, data, priority);

// 摰??潮?
swarm.sendToNode(nodeId, payload, urgent);

// 皝抒撘楝??
swarm.emergentBroadcast(insight);
```

### WuTongDashboard
**?券?*: ?航???銵冽  
**?辣**: `src/components/dashboard/WuTongDashboard.tsx`

```typescript
// ?刻楝?曹葉雿輻
import { WuTongDashboard } from '@/components/dashboard/WuTongDashboard';

<Route path="/wu-tong" element={<WuTongDashboard />} />
```

---

## ? 撣貊璅∪?

### 璅∪? 1: ???芯蜓整合
```typescript
// 1. 閮餃???
WuTongIntegration.registerService('service-id', 'ServiceName');

// 2. 摰??亙熒?勗?
setInterval(() => {
  WuTongIntegration.reportServiceHealth('service-id', metrics);
}, 5000);

// 3. 系統?芸???銝血?閬?撟脤?
// ?⊿?憿?隞?Ⅳ嚗?
```

### 璅∪? 2: ?亥??曹澈???
```typescript
// ?澈瘣?
WuTongIntegration.shareKnowledge(
  { insight: '蝣單??暹?撠?15%' },
  'insight',
  'AuditService',
  ['carbon', 'esg']
);

// ?潛?賊?瘣?
const related = WuTongIntegration.discoverKnowledge({
  tags: ['carbon'],
  type: 'insight'
});
```

### 璅∪? 3: ?梢陷?縑
```typescript
// 撱???鈭辣
WuTongIntegration.broadcastEvent(
  'milestone-achieved',
  { type: 'carbon-reduction', value: '15%' },
  'high'
);

// ?嗡??????嗡蒂?踵?
```

### 璅∪? 4: 閫撖芋撘葫閰?
```typescript
// ?閫撖芋撘?
WuTongIntegration.setObservationMode(true);

// 系統????銝銵銝餉???
// ?冽摰皜祈岫

// 蝳閫撖芋撘???啣?嚗?
WuTongIntegration.setObservationMode(false);
```

---

## ?? ???

### ?⊿??暹?皞?
- ???芯蜓閫?捱??> 80%
- ???典??梢陷瘞游像 > 0.85
- ??撟脤?甈⊥ < 5/憭?
- ???亥?瘚??漲 > 1.0 蝭暺???

### ?亙熒??蝭?
```typescript
{
  responseTime: 0-1000,      // 瘥怎?嚗?雿?憟?
  errorRate: 0-1,            // 0-100%嚗?雿?憟?
  throughput: 0-1000,        // 隢?/蝘?頞?頞末
  resourceUsage: 0-1         // 0-100%嚗銝剜?憟?
}
```

### ?梢陷?設計
```
resonanceScore = 
  (1 - errorRate) * 0.4 +
  (1 - normalizedResponseTime) * 0.3 +
  normalizedThroughput * 0.2 +
  (1 - resourceUsage) * 0.1
```

---

## ? 隤輯岫?撌?

### ?亦?閰喟敦?亥?
```typescript
import { omniLogger, LogCategory } from '@/utils/OmniLogger';

omniLogger.info(LogCategory.AI, '隤輯岫靽⊥', {
  serviceId: 'my-service',
  action: 'autonomous-decision',
  details: { ... }
});
```

### ??系統???
```typescript
const monitor = setInterval(() => {
  const status = WuTongIntegration.getSystemStatus();
  console.log('????', status.services.total);
  console.log('?亙熒??:', status.services.healthy);
  console.log('?梢陷瘞游像:', status.services.globalResonance);
  console.log('?芯蜓??', status.wuTong.autonomousRate);
}, 30000);
```

### 瑼Ｘ?亥?瘚?
```typescript
const analysis = WuTongIntegration.getKnowledgeFlowAnalysis();
console.log('?亥?蝭暺?', analysis.totalNodes);
console.log('?????', analysis.totalConnections);
console.log('瘚??漲:', analysis.flowVelocity);
```

---

## ?? 撣貉???

### Q: ???芸?曉?銵冽嚗?
**A**: 蝣箄?撌脰矽??`registerService()` 銝血???摨瑞???

### Q: ?梢陷???嚗?
**A**: 瑼Ｘ?亙熒??嚗?交 `errorRate` ??`responseTime`??

### Q: ?亥?瘚??趙嚗?
**A**: 蝣箔???品牌隤輻 `shareKnowledge()`??

### Q: ?芯蜓撟脤???嚗?
**A**: 隤踵 `OmniOrchestrator.ts` 銝剔??梢陷?曉潘?暺? 0.6嚗?

---

## ? ?銵冽閮芸?

### ?砍?
```
http://localhost:3000/wu-tong
```

### ??啣?
```
https://your-domain.com/wu-tong
```

---

## ?? 摰??

- [?函蔡??](file:///c:/Project/esgss_junaikey_beta/esgss_junaikey_beta/WU_TONG_DEPLOYMENT_GUIDE.md)
- [?脣飛摰??](file:///C:/Users/jun/.gemini/antigravity/brain/3294df16-3ea1-4061-94bc-889f20166081/wu_tong_manifesto.md)
- [?望??勗?](file:///C:/Users/jun/.gemini/antigravity/brain/3294df16-3ea1-4061-94bc-889f20166081/walkthrough.md)
- [蝜葉?勗?](file:///C:/Users/jun/.gemini/antigravity/brain/3294df16-3ea1-4061-94bc-889f20166081/walkthrough_tc.md)
- [摰蝮賜?](file:///C:/Users/jun/.gemini/antigravity/brain/3294df16-3ea1-4061-94bc-889f20166081/phase33_summary_tc.md)

---

## ?? 協議????

### ??(Wu) - ?∠
> 閫撖??銝交撟脤?

### ??(Tong) - ?桅????
> ?????嗅曈?

### ??(Zi) - ?芯蜓
> ???函?瘙箇?

### ??(Tong) - ?芰敺芰
> ?亥??芰瘚?

---

**?**: v8.2-wu-tong  
**?湔**: 2026-01-29

*銝??交偌嚗??偶蝥?

