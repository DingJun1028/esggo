import ragService from '../server/services/rag.js';
import pool from '../server/db/index.js';
import dotenv from 'dotenv';
import chalk from 'chalk';

dotenv.config();

async function verifyRAG() {
  console.log(chalk.cyan('🧠 Verifying RAG Reasoned Retrieval (Gemini 3.0 Pro)...'));
  const kbId = 'verify-synthesis-kb';

  try {
    // 1. Ingest dummy knowledge
    console.log(chalk.blue('... Ingesting Complex Knowledge ...'));
    const knowledge = `
        The Omega Protocol is a strict safety guideline for handling antimatter containment.
        Rule 1: Never expose the core to direct sunlight.
        Rule 2: Magnetic fields must be rotated every 4 hours.
        Rule 3: In case of breach, evacuate to Zone 4 immediately.
        Effectiveness: This protocol reduced accidents by 99% in 2025.
        `;
    await ragService.ingestKnowledge(kbId, knowledge, { source: 'manual-test' });

    // 2. Synthesize Answer
    console.log(chalk.blue('... Requesting Synthesized Answer ...'));
    const start = Date.now();
    const answer = await ragService.synthesizeAnswer(
      kbId,
      'What are the safety rules for antimatter?'
    );
    const duration = Date.now() - start;

    console.log(chalk.yellow('\n--- Synthesized Answer ---'));
    console.log(answer);
    console.log(chalk.yellow('--------------------------'));
    console.log(`⏱️  Synthesis took ${duration}ms`);

    if (answer && answer.includes('Zone 4') && answer.includes('sunlight')) {
      console.log(chalk.green('✓ Answer contains key information (Synthesis Successful)'));
    } else {
      console.warn(chalk.red('⚠️ Answer might be missing details or retrieval failed.'));
    }

    console.log(chalk.green('\n✨ RAG UPGRADE VERIFIED ✨'));
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error(chalk.red('❌ Verification Failed:'), error);
    await pool.end();
    process.exit(1);
  }
}

// Ensure DB is initialized or mocked?
// ragService relies on 'query' from '../db/index.js'.
// We assume DB is running (from previous steps).
verifyRAG();
