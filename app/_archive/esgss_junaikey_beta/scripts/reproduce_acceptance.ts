import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { EntropyForge } from '../src/core/EntropyForge';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { IAcceptanceArtifact } from '../src/core/IAcceptanceArtifact';

// Simple argument parser
const args = process.argv.slice(2);
const artifactPath = args[0];

if (!artifactPath) {
    console.error('Usage: ts-node reproduce_acceptance.ts <path-to-artifact.json>');
    process.exit(1);
}

const main = async () => {
    try {
        console.log(`🔍 Reading artifact from: ${artifactPath}`);
        const absolutePath = path.isAbsolute(artifactPath) ? artifactPath : path.resolve(process.cwd(), artifactPath);

        if (!fs.existsSync(absolutePath)) {
            console.error(`❌ File not found: ${absolutePath}`);
            process.exit(1);
        }

        const artifactContent = fs.readFileSync(absolutePath, 'utf-8');
        const artifact: IAcceptanceArtifact = JSON.parse(artifactContent);

        console.log(`🧩 Artifact UUID: ${artifact.uuid}`);
        console.log(`📊 Acceptance Status: ${artifact.acceptanceStatus}`);

        const forge = new EntropyForge('Playwright');

        // 1. Purify (Verify Hash Lock)
        console.log('🛡️ Verifying artifact integrity...');
        const isValid = await forge.purify(artifact);

        if (!isValid) {
            console.error('❌ Artifact integrity check failed! Hash lock mismatch.');
            process.exit(1);
        }
        console.log('✅ Artifact integrity verified.');

        // 2. Forge Script
        console.log('🔨 Forging reproduction script...');
        const testScript = forge.forgeTestScript(artifact);

        // 3. Save Script
        const outputDir = path.join(__dirname, '../tests/reproduction');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const outputFilename = `repro_${artifact.uuid}.spec.ts`;
        const outputPath = path.join(outputDir, outputFilename);

        fs.writeFileSync(outputPath, testScript);
        console.log(`💾 Test script saved to: ${outputPath}`);

        // 4. (Optional) Hints for running
        console.log('\n🚀 To run this reproduction:');
        console.log(`npx playwright test ${outputPath}`);

    } catch (error) {
        console.error('❌ Error during reproduction:', error);
        process.exit(1);
    }
};

main();
