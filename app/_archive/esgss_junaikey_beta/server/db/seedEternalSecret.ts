import { query } from './index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seedEternalSecret() {
  console.log('🚀 Starting Eternal Secret Knowledge Ingestion...');

  try {
    // 1. Ensure Knowledge Base exists
    const kbResult = await query(
      `INSERT INTO knowledge_bases (name, description, embedding_model, vector_dimensions)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description
       RETURNING id`,
      ['eternal_secret', '奧秘元鑰核心哲學與 5T 協議 (Awakened Core)', 'text-embedding-004', 768]
    );

    const kbId = kbResult.rows[0].id;
    console.log(`✅ Knowledge Base confirmed: ${kbId}`);

    // 2. Read SSOT Contract
    const ssotPath = path.join(__dirname, '../../SSOT_Contract.md');
    const ssotContent = fs.readFileSync(ssotPath, 'utf-8');

    // 3. Ingest core chunks
    const chunks = [
      {
        content:
          '5T 協議（真、善、美、信）是 ESGss x JunAiKey 系統的最高準則。真 (Truth) 強調可追溯與可追蹤；善 (Goodness) 強調透明性；美 (Beauty) 強調具象化；信 (Trust) 強調不可篡改。',
        source: 'SSOT_Contract',
        metadata: { category: 'philosophy', pillar: '5T' },
      },
      {
        content:
          '自覺 (Self-Awareness) 是系統的首要支柱，意味著 Agent 能夠審計自身的行為並計算 SELF_RELIANCE_SCORE。',
        source: 'SSOT_Contract',
        metadata: { category: 'pillar', pillar: 'Self-Awareness' },
      },
      {
        content:
          '覺他 (Enlightening Others) 意味著系統輸出必須具備啟發性，通過 RAG 系統結合 Eternal Secret 哲學提供見解。',
        source: 'SSOT_Contract',
        metadata: { category: 'pillar', pillar: 'Enlightening Others' },
      },
      {
        content:
          '自立 (Self-Reliance) 強調結構的穩健性與代碼的獨立性，如 Type-safe 的組件與硬化的 Docker 容器。',
        source: 'SSOT_Contract',
        metadata: { category: 'pillar', pillar: 'Self-Reliance' },
      },
      {
        content:
          '利他 (Altruism) 是系統的最終目的，所有計算與決策必須以造福利害關係人與全球生態系統為宗旨。',
        source: 'SSOT_Contract',
        metadata: { category: 'pillar', pillar: 'Altruism' },
      },
    ];

    for (const chunk of chunks) {
      await query(
        `INSERT INTO memory_chunks (kb_id, content, source, metadata)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT DO NOTHING`,
        [kbId, chunk.content, chunk.source, JSON.stringify(chunk.metadata)]
      );
    }

    console.log(`✅ Ingested ${chunks.length} core philosophy chunks.`);
    console.log('🌟 Eternal Secret Awakening Sequence Complete.');
  } catch (error) {
    console.error('❌ Ingestion failed:', error);
    process.exit(1);
  }
}

seedEternalSecret();
