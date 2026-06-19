import { describe, it, expect } from 'vitest';
import { adk } from '../omni-adk';
import { DigitalTwin } from '../../lib/ncb-service';

describe('ADK Suite', () => {
    const mockTwin: DigitalTwin = {
        id: 1,
        twin_uuid: 'test-twin-001',
        nickname: 'Tester',
        avatar_type: 'SENTIENT',
        level: 9,
        exp: 100,
        rank: 'Novice',
        virtues: '{}',
        nature_law: 'Test Law',
        closing_law: 'Test End'
    };

    it('should activate a group of agents based on twin attributes', async () => {
        const result = await adk.activateDigitalTwinGroup(mockTwin);
        expect(result.sessionId).toContain('DT_GROUP');
        
        const agentRoles = result.agents.map(a => a.role);
        expect(agentRoles).toContain('Data Analyst');
        expect(agentRoles).toContain('Compliance Critic');
        expect(agentRoles).toContain('Strategic Synthesizer');
        expect(agentRoles).toContain('Gnosis Spiritual Guide'); // Sentient attribute
        expect(agentRoles).toContain('Resonance Bridge Architect'); // Level >= 8
    });

    it('should bootstrap swarm with real roles', async () => {
        const sessionId = await adk.bootstrapSwarm('Carbon Analysis');
        expect(sessionId).toContain('SWARM_SESSION');
    });

    it('should deploy crew with full metadata', async () => {
        const result = await adk.deployCrew({
            name: 'Audit Mission',
            agents: [
                { id: 'a1', role: 'Role A', model: 'm1', goal: 'g1', backstory: 'b1', capabilities: ['c1'] }
            ],
            tasks: ['Task 1']
        });
        expect(result.status).toBe('MISSION_ACTIVE');
        expect(result.results[0].capabilities).toContain('c1');
    });
});
