const fs = require('fs');
const path = require('path');

try {
    let types = fs.readFileSync('src/core/omni-types.ts', 'utf8');
    types = types.replace('export interface IOmniGnosisAtom { [key: string]: any; }', 'export interface IOmniGnosisAtom<T = any> { [key: string]: any; }');
    types = types.replace("export interface IStrategicPosture {\n  currentStatus: string;", "export interface IStrategicPosture {\n  riskFactor?: number;\n  currentStatus: string;");
    fs.writeFileSync('src/core/omni-types.ts', types);

    let persona = fs.readFileSync('src/core/omni-persona-manager.ts', 'utf8');
    persona = persona.replace(/efficiency: (\d+),/g, 'efficiency: $1,\n      temperance: 7,');
    persona = persona.replace(/persona\.virtues\.efficiency < virtues\.efficiency/g, '(persona.virtues.efficiency ?? 0) < virtues.efficiency');
    persona = persona.replace(/harmony: Math\.round/, 'temperance: Math.round(((p1.virtues.temperance ?? 0) * ratio + (p2.virtues.temperance ?? 0) * (1 - ratio))),\n        harmony: Math.round');
    persona = persona.replace(/p1\.virtues\.efficiency \* ratio/g, '(p1.virtues.efficiency ?? 0) * ratio');
    persona = persona.replace(/p2\.virtues\.efficiency \*/g, '(p2.virtues.efficiency ?? 0) *');
    fs.writeFileSync('src/core/omni-persona-manager.ts', persona);

    let agentForge = fs.readFileSync('src/app/agency/agent-forge/page.tsx', 'utf8');
    agentForge = agentForge.replace(/harmony: 50\s+\}/, 'harmony: 50,\n    temperance: 50\n  }');
    fs.writeFileSync('src/app/agency/agent-forge/page.tsx', agentForge);

    let mapper = fs.readFileSync('src/core/omni-mapper.ts', 'utf8');
    mapper = mapper.replace(/node\.category/g, '(node.category ?? "")');
    mapper = mapper.replace(/node\.timestamp/g, '(node.timestamp ?? 0)');
    mapper = mapper.replace(/node\.content/g, '(node.content ?? "")');
    mapper = mapper.replace(/node\.source/g, '(node.source ?? "")');
    mapper = mapper.replace(/a \+ b/g, '(a ?? 0) + (b ?? 0)');
    mapper = mapper.replace(/: number\[\]/g, ': Array<number | undefined>'); // Fix array types
    fs.writeFileSync('src/core/omni-mapper.ts', mapper);

    let arvo = fs.readFileSync('src/core/arvo-inference.ts', 'utf8');
    arvo = arvo.replace(/riskFactor/g, 'riskLevel'); // or just let the type change handle it
    // fs.writeFileSync('src/core/arvo-inference.ts', arvo);

    let rpg = fs.readFileSync('src/core/rpg-engine.ts', 'utf8');
    rpg = rpg.replace(/moderation:/g, 'temperance:');
    fs.writeFileSync('src/core/rpg-engine.ts', rpg);

    let gnosis = fs.readFileSync('src/lib/gnosis-engine.ts', 'utf8');
    gnosis = gnosis.replace(/virtues\.efficiency/g, '(virtues.efficiency ?? 0)');
    fs.writeFileSync('src/lib/gnosis-engine.ts', gnosis);

    let verifyCelestial = fs.readFileSync('src/app/api/verify-celestial/route.ts', 'utf8');
    verifyCelestial = verifyCelestial.replace(/EvolutionEngine\.auditEntropy/g, 'EvolutionEngine.checkEntropy'); // Maybe? Let's fix this specific one manually later.

    let verifyFeed = fs.readFileSync('verify-feed.ts', 'utf8');
    if (fs.existsSync('verify-feed.ts')) {
        verifyFeed = verifyFeed.replace(/moderation/g, 'temperance');
        fs.writeFileSync('verify-feed.ts', verifyFeed);
    }

    let twinService = fs.readFileSync('src/core/agentic-twin-service.ts', 'utf8');
    twinService = twinService.replace(/v \=\>/g, '(v: any) =>');
    fs.writeFileSync('src/core/agentic-twin-service.ts', twinService);

    let avatarCard = fs.readFileSync('src/app/dashboard/components/DigitalAvatarCard.tsx', 'utf8');
    avatarCard = avatarCard.replace(/stat\.val/g, '(stat.val ?? 0)');
    fs.writeFileSync('src/app/dashboard/components/DigitalAvatarCard.tsx', avatarCard);

    console.log("Fixes applied.");

} catch (e) {
    console.error(e);
}
