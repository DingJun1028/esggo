import { IOmniAtom } from './omni-types';
import { UserKnowledgeBase } from './user-knowledge-base';
import { omniLogger, LogCategory } from './omniLogger';

/**
 * 🍱 SushiDoctorReporter: 壽司博士永續觀察者
 * 職責：蒸餾智庫情報，生成專業且具備人性的 ESG 報導。
 */
export class SushiDoctorReporter {

    /**
     * 📜 generateObserverReport: 生成永續觀察者週報/日報
     */
    public static async generateObserverReport(): Promise<string> {
        omniLogger.info(LogCategory.SYSTEM, 'SushiDoctor: Distilling intelligence for the Sustainability Observer report...');

        // 1. 從智庫中獲取最新偵情 (模擬 recall)
        const recentIntel = await UserKnowledgeBase.recallAllByDomain('OMNI-CRAWLER');

        if (recentIntel.length === 0) {
            return "🍣 壽司博士：目前海面上風平浪靜，尚無重大 ESG 波動需要報告。";
        }

        // 2. 蒸餾情報關鍵點
        const highlights = recentIntel.map(atom => {
            const p = atom.payload;
            return `- **${p.source}**: ${p.title} (核心實體: ${p.entities?.join(', ') || '通用'})`;
        }).join('\n');

        // 3. 壽司博士專業評論 (語氣建模)
        const report = `
# 🍱 壽司博士：永續觀察者報導 (Sustainability Observer)
**日期：${new Date().toLocaleDateString()} | 偵情深度：Deep-Scan 4.0**

---

### 🌊 市場情報蒸餾 (Intel Distillation)
根據萬能掃描中心對 30+ 情報源的實時監控，我們發現以下關鍵趨勢：

${highlights}

### 🍱 博士的「壽司碎片」評論：
1. **政策緊縮**：金管會的最新動作顯示，台灣 ESG 揭露正從「自願性」全面轉向「合規性」，範疇三的揭露將是未來兩年的「芥末炸彈」，企業需提早準備。
2. **國際對標**：ISSB 的全球化進展極快，這意味著「數據真理性 (5T)」將成為企業在國際市場生存的唯一憑證。
3. **策略建議**：不要只是填表，要把 ESG 數據轉化為「商業偵情」，利用這些資訊在供應鏈談判中取得優勢。

---
*「永續不是裝飾品，它是這塊壽司裡最核心的鮮鱼。」—— 壽司博士*
        `.trim();

        return report;
    }
}
