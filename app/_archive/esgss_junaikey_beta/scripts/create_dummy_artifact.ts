import { IAcceptanceArtifact, sealArtifact } from '../src/core/IAcceptanceArtifact';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const artifactData: any = {
    uuid: 'test-artifact-' + Date.now(),
    timestamp: Date.now(),
    acceptanceStatus: 'PASS',
    entropyLevel: 0.1,
    environment: {
        nodeVersion: process.version,
        os: process.platform,
        seed: 12345
    },
    logicSnapshot: {
        input: { foo: 'bar' },
        expectedOutput: { result: 'success' },
        actualOutput: { result: 'success' },
        traceLog: [
            'Init module',
            'Process input',
            'Validate output'
        ]
    },
    evidence: {
        attachments: []
    }
};

const sealed = sealArtifact(artifactData);
const outputPath = path.join(__dirname, 'dummy_artifact.json');
fs.writeFileSync(outputPath, JSON.stringify(sealed, null, 2));
console.log(`Dummy artifact created at: ${outputPath}`);
