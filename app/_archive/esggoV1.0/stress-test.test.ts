import { describe, it, expect, vi } from 'vitest';
import { squadAutoAssignFlow } from './lib/genkit';

describe('AI Orchestrator Stress & Load Balance Test', () => {

    const mockTaskTemplate = {
        title: '任務',
        description: '這是一個需要專門技能的開發任務。',
    };

    const mockMembers = [
        { id: 'u-1', name: 'Alice', role: 'Frontend', skills: ['React', 'CSS'], isActive: true, currentWorkload: 0 },
        { id: 'u-2', name: 'Bob', role: 'Backend', skills: ['Node.js', 'SQL'], isActive: true, currentWorkload: 0 },
        { id: 'u-3', name: 'Charlie', role: 'Fullstack', skills: ['React', 'Node.js'], isActive: true, currentWorkload: 0 },
    ];

    it('連續派發 6 個任務時，AI 應能實現基本的負載平衡 (Mock 模式)', async () => {
        // 在開發/測試腳本中，如果沒有 API Key，squadAutoAssignFlow 會進入 Mock 模式
        // Mock 模式的邏輯是直接挑選工作負載最小的成員

        let membersState = [...mockMembers];
        const assignments: string[] = [];

        for (let i = 0; i < 6; i++) {
            const result = await squadAutoAssignFlow({
                task: { ...mockTaskTemplate, title: `任務 ${i + 1}` },
                members: membersState
            });

            assignments.push(result.assignedMemberId);

            // 更新狀態模擬真實負載增加
            membersState = membersState.map(m =>
                m.id === result.assignedMemberId
                    ? { ...m, currentWorkload: (m.currentWorkload || 0) + 1 }
                    : m
            );
        }

        // 6 個任務平均分配給 3 個人時，每個人應該剛好拿 2 個
        const counts = assignments.reduce((acc, curr) => {
            acc[curr] = (acc[curr] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        console.log('當前分配結果:', counts);

        expect(counts['u-1']).toBe(2);
        expect(counts['u-2']).toBe(2);
        expect(counts['u-3']).toBe(2);
    });

    it('當某位成員已嚴重過載時，AI 應選擇其他可用成員', async () => {
        const overloadedMembers = [
            { id: 'u-1', name: 'Alice', role: 'Frontend', skills: ['React'], isActive: true, currentWorkload: 10 }, // 爆量
            { id: 'u-2', name: 'Bob', role: 'Backend', skills: ['SQL'], isActive: true, currentWorkload: 1 },
        ];

        const result = await squadAutoAssignFlow({
            task: mockTaskTemplate,
            members: overloadedMembers
        });

        // 應避開 Alice 分配給 Bob
        expect(result.assignedMemberId).toBe('u-2');
        expect(result.reason).toContain('Bob');
    });
});
