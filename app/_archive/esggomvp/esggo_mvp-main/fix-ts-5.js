const fs = require('fs');

try {
    let agentForge = fs.readFileSync('src/app/agency/agent-forge/page.tsx', 'utf8');
    agentForge = agentForge.replace(/courage: 50, efficiency: 50, harmony: 50,/g, 'courage: 50, \nefficiency: 50, \nharmony: 50,\ntemperance: 50,');
    agentForge = agentForge.replace(/courage: 50,\s*efficiency: 50,\s*harmony: 50\s*\}/g, 'courage: 50, efficiency: 50, harmony: 50, temperance: 50 }');
    agentForge = agentForge.replace(/efficiency: 50,\n\s*harmony: 50\n\s*\}/g, 'efficiency: 50,\n    harmony: 50,\n    temperance: 50\n  }');
    fs.writeFileSync('src/app/agency/agent-forge/page.tsx', agentForge);

    let trendEngine = fs.readFileSync('src/app/cognitive/trend-engine/page.tsx', 'utf8');
    trendEngine = trendEngine.replace(/return \{\s*uuid: "trend-001"/g, 'return { intent: "Mock AI Insight", \n        uuid: "trend-001"');
    fs.writeFileSync('src/app/cognitive/trend-engine/page.tsx', trendEngine);

    let arvo = fs.readFileSync('src/core/arvo-inference.ts', 'utf8');
    arvo = arvo.replace(/summary: "分析報告(.*?)"/g, 'targetGoal: "分析報告$1"');
    arvo = arvo.replace(/riskLevel: Math.random\(\) > 0.5 \? "High" : "Medium"/g, 'riskLevel: "Medium"');
    arvo = arvo.replace(/riskLevel: Math\.floor\(Math\.random\(\) \* 100\)/g, 'riskLevel: "High"');
    fs.writeFileSync('src/core/arvo-inference.ts', arvo);

    let intelGuardian = fs.readFileSync('src/core/intel-guardian.ts', 'utf8');
    intelGuardian = intelGuardian.replace(/return \[\n\s*\{\s*source: "(.*?)",\s*content: '(.*?)',\s*timestamp: (.*?),\s*category: '(.*?)'\s*\}/g, 'return [\n      { source: "$1", content: \'$2\', timestamp: $3, category: \'$4\' } as any');
    fs.writeFileSync('src/core/intel-guardian.ts', intelGuardian);

    let assessEngine = fs.readFileSync('src/core/omni-assessment-engine.ts', 'utf8');
    assessEngine = assessEngine.replace(/Object\.entries\(gradeWeights\)/g, '(Object.entries(gradeWeights) as [string, number][])');
    fs.writeFileSync('src/core/omni-assessment-engine.ts', assessEngine);

    let ident = fs.readFileSync('src/core/omni-identity.ts', 'utf8');
    ident = ident.replace(/return \{\s*uuid:/g, 'return { intent: "Mock", \n      uuid:');
    fs.writeFileSync('src/core/omni-identity.ts', ident);

    let mapper = fs.readFileSync('src/core/omni-mapper.ts', 'utf8');
    mapper = mapper.replace(/let vector =/g, 'let vector: any[] =');
    mapper = mapper.replace(/const value = dict\[key\];/g, 'const value = dict[key] as any;');
    mapper = mapper.replace(/Math\.max\(\.\.\.Object\.values\(categories\)\)/g, 'Math.max(...(Object.values(categories) as number[]))');
    fs.writeFileSync('src/core/omni-mapper.ts', mapper);

    let rpg = fs.readFileSync('src/core/rpg-engine.ts', 'utf8');
    rpg = rpg.replace(/record\.data\.category/g, 'record.data?.category');
    rpg = rpg.replace(/return record.data;/g, 'return (record.data as any);');
    rpg = rpg.replace(/evidence\.length/g, '(evidence?.length ?? 0)');
    fs.writeFileSync('src/core/rpg-engine.ts', rpg);

    console.log('Final TS patch script applied');
} catch (e) { console.error(e); }
