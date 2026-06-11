import fs from 'fs';

const files = [
    { file: 'app/environmental/page.tsx', domain: 'Environmental', action: '自動偵測到新排放源並已暫存。' },
    { file: 'app/social/page.tsx', domain: 'Social', action: '自動抓取人資系統新指標。' },
    { file: 'app/governance/page.tsx', domain: 'Governance', action: '自動載入內部稽核缺失項目。' }
];

files.forEach(({ file, domain, action }) => {
    let content = fs.readFileSync(file, 'utf8');

    // Make sure we import useOmniAgentBus
    if (!content.includes('useOmniAgentBus')) {
        content = content.replace(
            "import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';",
            "import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';\nimport { useOmniAgentBus } from '@/lib/omni-agent-bus';"
        );
    }

    // Add dispatchBus inside component
    if (!content.includes('const dispatchBus')) {
        content = content.replace(
            "const { data: dbAtoms, loading } = useESGAtoms",
            "const dispatchBus = useOmniAgentBus((state: any) => state.dispatch);\n  const { data: dbAtoms, loading } = useESGAtoms"
        );
    }

    // Trigger dispatchBus inside handleAddRecord
    content = content.replace(
        "setLocalData([newRecord, ...localData]);",
        `setLocalData([newRecord, ...localData]);\n    dispatchBus('OBSERVE', '${domain}Dashboard', '${action}');`
    );

    fs.writeFileSync(file, content);
});

console.log('Wired handleAddRecord to OmniAgentBus in E, S, G dashboards.');
