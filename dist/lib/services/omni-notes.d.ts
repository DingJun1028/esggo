/**
 * Server Action: 同步「任務」筆記到 OmniTable
 * @param taskContent 筆記內容
 */
export declare function syncTaskAction(taskContent: string): Promise<void>;
/**
 * Server Action: 同步「知識/研究」筆記到 Capacities 知識庫
 * @param type 筆記類型 ('knowledge' | 'research')
 * @param content 筆記內容
 */
export declare function syncKnowledgeAction(type: 'knowledge' | 'research', content: string): Promise<{
    success: boolean;
}>;
//# sourceMappingURL=omni-notes.d.ts.map