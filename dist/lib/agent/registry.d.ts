import type { SkillRegistryItem } from './types';
export declare const SKILL_REGISTRY: SkillRegistryItem[];
export declare function getSkill(skillKey: string): SkillRegistryItem | undefined;
export declare function getSkillsByTaskType(taskType: string): SkillRegistryItem[];
export declare const TASK_TYPE_META: Record<string, {
    label: string;
    color: string;
    icon: string;
}>;
export declare const STATUS_META: Record<string, {
    label: string;
    color: string;
    bg: string;
}>;
//# sourceMappingURL=registry.d.ts.map