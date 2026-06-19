import { OmniOne } from './omni-one';
import { OmniAssessmentEngine } from './omni-assessment-engine';
import { EvolutionEngine } from './evolution-engine';
import { IAvatarCore, ESGRecord } from './omni-types';
import { omniLogger, LogCategory } from './omniLogger';

async function runAvatarVerification() {
    omniLogger.info(LogCategory.SYSTEM, "🚀 Starting Epic 8: Avatar Evolution Verification...");

    // 1. 初始化一個基礎分身
    let myAvatar: IAvatarCore = {
        uuid: 'user-001-avatar',
        version: '1.0.0',
        timestamp: Date.now(),
        status: 'Active',
        evidence: {},
        nickname: '永續探索者',
        avatarType: 'SOVEREIGN',
        level: 1,
        exp: 0,
        rank: '初學者 (Novice)',
        virtues: {
            wisdom: 10,
            benevolence: 10,
            courage: 10,
            integrity: 10,
            moderation: 10,
            harmony: 10
        },
        natureLaw: '上善若水',
        closingLaw: '以終為始',
        visualAssets: {
            baseIcon: 'default',
            auraEffect: 'aqua',
            rankBadge: 'lv1'
        },
        impactMetric: '0',
        isFrozen: false,
        lifecycle_events: []
    } as any;

    // 2. 模擬獲得一個「環境永續：碳盤存」資產 (Atom)
    const carbonReportAtom = await OmniOne.manifest<ESGRecord>({
        intent: '2026 Q1 碳盤存報告',
        type: 'Intelligence',
        payload: {
            indicatorId: 'GRI-305-1',
            value: 450,
            unit: 'tCO2e',
            reward: 500
        } as any,
        tags: ['ENVIRONMENT', 'CARBON'],
        domainRef: 'CARBON-HUB' // 必填項
    });

    const assessmentEngine = OmniAssessmentEngine.getInstance();
    const assessmentResult = await assessmentEngine.assessAtom(carbonReportAtom);

    // 3. 執行進化 (Evolution)
    const evolvedAvatar = EvolutionEngine.evoluteAvatar(myAvatar, assessmentResult);

    // 4. 再次模擬一個「社會責任」資產
    const socialAtom = await OmniOne.manifest<ESGRecord>({
        intent: '員工關懷計畫',
        type: 'Intelligence',
        payload: {
            indicatorId: 'SOCIAL-001',
            value: 100,
            unit: 'points',
            reward: 600
        } as any,
        tags: ['SOCIAL', 'COMMUNITY'],
        domainRef: 'SOCIAL-HUB' // 必填項
    });

    const assessmentResult2 = await assessmentEngine.assessAtom(socialAtom);
    const finalAvatar = EvolutionEngine.evoluteAvatar(evolvedAvatar, assessmentResult2);

    omniLogger.info(LogCategory.SYSTEM, `Final Level: ${finalAvatar.level}`);
    if (finalAvatar.level > 1) {
        omniLogger.info(LogCategory.SYSTEM, "✅ Epic 8 Core Chain: VERIFIED");
    } else {
        throw new Error("❌ Avatar evolution failed validation.");
    }
}

runAvatarVerification().catch(err => {
    console.error(err);
    process.exit(1);
});
