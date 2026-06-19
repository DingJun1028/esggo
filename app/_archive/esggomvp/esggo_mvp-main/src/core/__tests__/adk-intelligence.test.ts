import { describe, it, expect, vi } from 'vitest';
import { getAgentsForTwin } from '../../config/adk-registry';
import { DigitalTwin } from '../../lib/ncb-service';

describe('ADK Intelligence: Agent Selection', () => {
    const baseTwin: DigitalTwin = {
        id: 1,
        twin_uuid: 'test-uuid',
        nickname: 'Test Twin',
        avatar_type: 'OMNI',
        level: 1,
        exp: 0,
        rank: 'Novice',
        virtues: JSON.stringify({ wisdom: 5, benevolence: 5, integrity: 5 }),
        nature_law: 'Default Nature Law',
        closing_law: 'Default Closing Law',
        user_id: 'user-1'
    };

    it('should select standard agents for a base twin', () => {
        const agents = getAgentsForTwin(baseTwin);
        const roles = agents.map(a => a.role);
        
        expect(roles).toContain('Data Analyst');
        expect(roles).toContain('Compliance Critic');
        expect(roles).toContain('Strategic Synthesizer');
        expect(roles.length).toBe(3);
    });

    it('should add Gnosis Guide for high wisdom twins', () => {
        const highWisdomTwin = { 
            ...baseTwin, 
            virtues: JSON.stringify({ wisdom: 8, benevolence: 5, integrity: 5 }) 
        };
        const agents = getAgentsForTwin(highWisdomTwin);
        const roles = agents.map(a => a.role);
        
        expect(roles).toContain('Gnosis Spiritual Guide');
        expect(roles.length).toBe(4);
    });

    it('should add Gnosis Guide for Sentient avatars regardless of wisdom', () => {
        const sentientTwin = { 
            ...baseTwin, 
            avatar_type: 'SENTIENT' as const
        };
        const agents = getAgentsForTwin(sentientTwin);
        const roles = agents.map(a => a.role);
        
        expect(roles).toContain('Gnosis Spiritual Guide');
    });

    it('should add Bridge Architect for high level twins', () => {
        const highLevelTwin = { 
            ...baseTwin, 
            level: 8 
        };
        const agents = getAgentsForTwin(highLevelTwin);
        const roles = agents.map(a => a.role);
        
        expect(roles).toContain('Resonance Bridge Architect');
    });

    it('should add Trinity agents for Sovereign twins', () => {
        const sovereignTwin = { 
            ...baseTwin, 
            avatar_type: 'SOVEREIGN' as const
        };
        const agents = getAgentsForTwin(sovereignTwin);
        const roles = agents.map(a => a.role);
        
        expect(roles).toContain('OmniOne Principal');
        expect(roles).toContain('OmniPriest Witness');
        expect(roles).toContain('OmniGemini Synthesizer');
    });

    it('should add Dr. Thoth for twins with thoth keywords', () => {
        const thothTwin = { 
            ...baseTwin, 
            nature_law: 'Follow the path of Thoth wisdom'
        };
        const agents = getAgentsForTwin(thothTwin);
        const roles = agents.map(a => a.role);
        
        expect(roles).toContain('Dr. Thoth (壽司博士)');
    });

    it('should add King Dan for twins with dan keywords', () => {
        const danTwin = { 
            ...baseTwin, 
            nature_law: 'The way of King Dan Excellence'
        };
        const agents = getAgentsForTwin(danTwin);
        const roles = agents.map(a => a.role);
        
        expect(roles).toContain('王道阿丹 (Excellent King)');
    });

    it('should add JunAiKey for twins with jun keywords in nickname', () => {
        const junTwin = { 
            ...baseTwin, 
            nickname: 'Jun Resonance' 
        };
        const agents = getAgentsForTwin(junTwin);
        const roles = agents.map(a => a.role);
        
        expect(roles).toContain('JunAiKey Portal Guardian');
    });

    it('should handle duplicate selection gracefully (Set logic)', () => {
        const eliteSentientTwin = { 
            ...baseTwin, 
            avatar_type: 'SENTIENT' as const,
            level: 10,
            virtues: JSON.stringify({ wisdom: 9, benevolence: 9, integrity: 9 }),
            nature_law: 'Wisdom of Thoth'
        };
        const agents = getAgentsForTwin(eliteSentientTwin);
        const roles = agents.map(a => a.role);
        
        // Should have Analyst, Critic, Synth, Gnosis_Guide, Bridge_Architect, OmniOne, OmniPriest, OmniGemini, Dr_Thoth, OmniOrb
        // 3 + 1 + 1 + 3 + 1 + 1 = 10
        expect(roles.length).toBe(10);
    });
});
