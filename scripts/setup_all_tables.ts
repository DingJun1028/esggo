#!/usr/bin/env tsx
// ============================================================================
// OmniBlueTable 全域初始化 Runner
// 一鍵依序執行所有 setup_*.ts 建表腳本
//
// 使用方式：
//   npx tsx scripts/setup_all_tables.ts
//   npx tsx scripts/setup_all_tables.ts --only=esg_risk,compliance
//   npx tsx scripts/setup_all_tables.ts --dry-run
// ============================================================================

const MODULES: Array<{
    key: string;
    label: string;
    envKey: string;
    run: () => Promise<void>;
}> = [
    {
        key: 'notes_tasks',
        label: '萬能筆記 - 任務管理',
        envKey: 'OMNITABLE_TASKS_DATASHEET_ID',
        run: () => import('./setup_notes_tasks_table').then(m => (m as any).default?.() ?? (m as any).main?.()),
    },
    {
        key: 'daily_intelligence',
        label: '商情中心 - 每日情資庫',
        envKey: 'OMNITABLE_DAILY_INTELLIGENCE_DATASHEET_ID',
        run: () => import('./setup_daily_intelligence_table').then(m => (m as any).default?.() ?? (m as any).main?.()),
    },
    {
        key: 'esg_risk',
        label: 'ESG 風險稽核庫',
        envKey: 'OMNITABLE_ESG_RISK_DATASHEET_ID',
        run: () => import('./setup_esg_risk_audit_table').then(m => (m as any).default?.() ?? (m as any).main?.()),
    },
    {
        key: 'compliance',
        label: '合規引擎 - 掃描結果庫',
        envKey: 'OMNITABLE_COMPLIANCE_DATASHEET_ID',
        run: () => import('./setup_compliance_engine_table').then(m => (m as any).default?.() ?? (m as any).main?.()),
    },
    {
        key: 'governance',
        label: '治理稽核 - 事件日誌',
        envKey: 'OMNITABLE_GOVERNANCE_AUDIT_DATASHEET_ID',
        run: () => import('./setup_governance_audit_table').then(m => (m as any).default?.() ?? (m as any).main?.()),
    },
    {
        key: 'supplier',
        label: '供應鏈誠信 - 評估庫',
        envKey: 'OMNITABLE_SUPPLIER_INTEGRITY_DATASHEET_ID',
        run: () => import('./setup_supplier_integrity_table').then(m => (m as any).default?.() ?? (m as any).main?.()),
    },
    {
        key: 'vault',
        label: 'Vault Omni - 封存索引庫',
        envKey: 'OMNITABLE_VAULT_OMNI_DATASHEET_ID',
        run: () => import('./setup_vault_omni_table').then(m => (m as any).default?.() ?? (m as any).main?.()),
    },
    {
        key: 'swarm',
        label: 'OmniSwarm - 蜂群共識決策庫',
        envKey: 'OMNITABLE_SWARM_CONSENSUS_DATASHEET_ID',
        run: () => import('./setup_swarm_consensus_table').then(m => (m as any).default?.() ?? (m as any).main?.()),
    },
    {
        key: 'omni_table',
        label: 'ESG Risk Register (Demo)',
        envKey: 'OMNITABLE_ESG_REGISTER_DATASHEET_ID',
        run: () => import('./setup_omni_table').then(m => (m as any).default?.() ?? (m as any).main?.()),
    },
];

// ── CLI arg parsing ──────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const onlyArg = args.find(a => a.startsWith('--only='));
const onlyKeys = onlyArg ? onlyArg.replace('--only=', '').split(',').map(k => k.trim()) : null;

const targets = onlyKeys
    ? MODULES.filter(m => onlyKeys.includes(m.key))
    : MODULES;

// ── Runner ───────────────────────────────────────────────────────────────────

async function runAll() {
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║   OmniBlueTable 全域初始化 Runner  v1.0.0               ║');
    console.log('║   ESGGO 善向永續 × 5T Protocol                         ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');

    if (!process.env.OMNITABLE_API_KEY) {
        console.error('❌ 缺少環境變數 OMNITABLE_API_KEY，請先設定後再執行。');
        console.error('   參考 .env.example 中的 OMNITABLE_API_KEY 說明。');
        process.exit(1);
    }

    if (!process.env.OMNITABLE_SPACE_ID) {
        console.warn('⚠️  未設定 OMNITABLE_SPACE_ID，將使用預設值 spc_demo_12345');
    }

    if (isDryRun) {
        console.log('🧪 [DRY RUN] 以下模組將被建立（未實際執行）：\n');
        targets.forEach((m, i) => {
            console.log(`  ${i + 1}. [${m.key}] ${m.label}`);
            console.log(`     → .env key: ${m.envKey}`);
        });
        console.log('\n✅ Dry run 完成，未建立任何 Datasheet。');
        return;
    }

    const results: Array<{ key: string; label: string; status: 'ok' | 'fail'; error?: string }> = [];

    for (const [i, mod] of targets.entries()) {
        console.log(`\n${'─'.repeat(60)}`);
        console.log(`[${i + 1}/${targets.length}] 🚀 ${mod.label}  (key: ${mod.key})`);
        console.log(`${'─'.repeat(60)}`);

        try {
            await mod.run();
            results.push({ key: mod.key, label: mod.label, status: 'ok' });
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            console.error(`❌ 失敗: ${msg}`);
            results.push({ key: mod.key, label: mod.label, status: 'fail', error: msg });
        }
    }

    // ── Summary ────────────────────────────────────────────────────────
    console.log(`\n${'═'.repeat(60)}`);
    console.log('📊 執行摘要');
    console.log(`${'═'.repeat(60)}`);

    const ok   = results.filter(r => r.status === 'ok');
    const fail = results.filter(r => r.status === 'fail');

    ok.forEach(r => console.log(`  ✅ ${r.label}`));
    fail.forEach(r => console.log(`  ❌ ${r.label}  → ${r.error}`));

    console.log(`\n  成功: ${ok.length} / ${results.length}  |  失敗: ${fail.length}`);

    if (fail.length > 0) {
        console.log('\n⚠️  部分模組建立失敗，請確認 OMNITABLE_API_KEY 及網路連線後重試。');
        console.log('   可使用 --only=<key> 單獨重試失敗的模組：');
        fail.forEach(r => console.log(`     npx tsx scripts/setup_all_tables.ts --only=${r.key}`));
        process.exit(1);
    }

    console.log('\n🎉 所有模組初始化完成！請將各模組的 Datasheet ID 填入 .env.local。');
}

runAll();
