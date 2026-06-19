import { omniThinkTank } from '../core/omniCore';
import { omniLogger } from '@/omni/infrastructure/logging/OmniLogger';

import { ESGKnowledgeBase } from '../types/omniCore';
import { omniLogger, LogCategory } from '../services/omniLogger';
import { omniKnowledge } from '../services/omniKnowledge';

async function verifyThinkTank() {
    omniLogger.info(LogCategory.SYSTEM, '🚀 Starting Omni Think Tank & ESG RAG Verification');

    // 1. Seed some ESG knowledge
    omniLogger.info(LogCategory.SYSTEM, 'Step 1: Seeding ESG Knowledge');
    await omniKnowledge.store({
        type: 'system_insight',
        content: 'GRI 305 specifically addresses carbon emissions and energy consumption reporting standards.',
        metadata: {
            knowledgeBase: ESGKnowledgeBase.GRI_STANDARDS,
            timestamp: Date.now(),
            language: 'zh-TW',
            tags: ['GRI', 'Carbon']
        }
    });

    await omniKnowledge.store({
        type: 'system_insight',
        content: 'TCFD framework emphasizes climate-related financial risk disclosure across four pillars: Governance, Strategy, Risk Management, and Metrics & Targets.',
        metadata: {
            knowledgeBase: ESGKnowledgeBase.TCFD_FRAMEWORK,
            timestamp: Date.now(),
            language: 'zh-TW',
            tags: ['TCFD', 'Risk']
        }
    });

    // 2. Test RAG Retrieval
    omniLogger.info(LogCategory.SYSTEM, 'Step 2: Testing RAG Retrieval');
    const query = '什麼是 GRI 305？';
    const results = await omniThinkTank.query(query, {
        knowledgeBases: [ESGKnowledgeBase.GRI_STANDARDS]
    });

    omniLogger.info(LogCategory.SYSTEM, '[VerifyThinkTankRAG] \n--- RAG Retrieval Results ---');
    results.forEach((r, i) => {
        omniLogger.info(LogCategory.SYSTEM, '[VerifyThinkTankRAG] Info', { data: `${i + 1}. [${r.metadata.knowledgeBase}] ${r.content} (Score: ${r.similarity.toFixed(2)})` });
    });

    if (results.length > 0 && results[0].content.includes('GRI 305')) {
        omniLogger.info(LogCategory.SYSTEM, '✅ RAG Retrieval Successful');
    } else {
        omniLogger.error(LogCategory.SYSTEM, '❌ RAG Retrieval Failed or context mismatch');
    }

    // 3. Test ARVO Reasoning
    omniLogger.info(LogCategory.SYSTEM, 'Step 3: Testing ARVO Reasoning Workflow');
    const reasoningInput = {
        query: '請分析 TCFD 與 GRI 在碳管理上的協同作用。',
        context: { knowledgeBases: [ESGKnowledgeBase.GRI_STANDARDS, ESGKnowledgeBase.TCFD_FRAMEWORK] }
    };

    const reasonResult = await omniThinkTank.reason(reasoningInput);

    omniLogger.info(LogCategory.SYSTEM, '[VerifyThinkTankRAG] \n--- ARVO Reasoning Result ---');
    omniLogger.info(LogCategory.SYSTEM, '[VerifyThinkTankRAG] Info', { data: `Conclusion: ${reasonResult.conclusion}` });
    omniLogger.info(LogCategory.SYSTEM, '[VerifyThinkTankRAG] Info', { data: `Confidence: ${reasonResult.confidence.toFixed(2)}` });
    omniLogger.info(LogCategory.SYSTEM, '[VerifyThinkTankRAG] Stages trace logged in OmniLogger.');

    if (reasonResult.conclusion && reasonResult.confidence > 0.8) {
        omniLogger.info(LogCategory.SYSTEM, '✅ ARVO Reasoning Successful');
    } else {
        omniLogger.error(LogCategory.SYSTEM, '❌ ARVO Reasoning Failed or low confidence');
    }

    omniLogger.info(LogCategory.SYSTEM, '🏁 Verification Complete');
}

verifyThinkTank().catch(err => {
    omniLogger.error(LogCategory.SYSTEM, '[VerifyThinkTankRAG] Verification Error:', { error: err });
    process.exit(1);
});
