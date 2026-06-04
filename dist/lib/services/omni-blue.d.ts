/**
 * OmniBlue | Blue.cc GraphQL Integration Client
 *
 * 串接 Blue.cc NoCMS 後端，透過 GraphQL API 讀取 / 寫入
 * Organization、Workspace（Project）、Record（Todo）等資料。
 *
 * 認證方式：Personal Access Token (PAT)
 *   - Token ID (cuid) → X-Bloo-Token-ID
 *   - Token Secret (pat_*) → X-Bloo-Token-Secret
 *   - Company ID (slug) → X-Bloo-Company-ID
 *   - Project ID (slug) → X-Bloo-Project-ID
 *
 * 參考文件：https://blue.app/api/start-guide/introduction
 *
 * 注意：Blue.cc 的實際 GraphQL schema 與官方文件有些許差異，
 *      本檔案已根據實際 introspection 結果調整。
 */
export interface BlueCcConfig {
    tokenId: string;
    tokenSecret: string;
    companyId: string;
    projectId?: string;
    baseUrl?: string;
}
export interface BlueCcCompany {
    id: string;
    name: string;
    slug: string;
}
export interface BlueCcProject {
    id: string;
    name: string;
    slug: string;
    updatedAt?: string;
    createdAt?: string;
}
export interface BlueCcTodoCustomField {
    id: string;
    value: any;
    customField?: {
        id: string;
        name: string;
        type: string;
    };
}
export interface BlueCcRecord {
    id: string;
    uid?: string;
    title: string;
    text?: string;
    done?: boolean;
    archived?: boolean;
    color?: string;
    duedAt?: string;
    startedAt?: string;
    completedAt?: string;
    createdAt?: string;
    updatedAt?: string;
    todoList?: {
        id: string;
        title: string;
    };
    todoCustomFields?: BlueCcTodoCustomField[];
    users?: {
        id: string;
        email: string;
        fullName: string;
    }[];
    tags?: {
        id: string;
        name: string;
        color: string;
    }[];
    commentCount?: number;
    checklistCount?: number;
    checklistCompletedCount?: number;
}
export interface BlueCcTodoList {
    id: string;
    title: string;
    todosCount?: number;
    completed?: boolean;
    position?: number;
    todos?: BlueCcRecord[];
}
export interface BlueCcQueryResult<T> {
    success: boolean;
    data?: T;
    error?: string;
}
export declare class BlueCcClient {
    private tokenId;
    private tokenSecret;
    private companyId;
    private projectId?;
    private baseUrl;
    constructor(config?: Partial<BlueCcConfig>);
    private request;
    getCurrentUser(): Promise<BlueCcQueryResult<{
        id: string;
        email: string;
        fullName: string;
        companies: BlueCcCompany[];
    }>>;
    getOrganization(): Promise<BlueCcQueryResult<BlueCcCompany>>;
    listProjects(): Promise<BlueCcQueryResult<{
        items: BlueCcProject[];
        totalItems: number;
    }>>;
    getProject(projectId: string): Promise<BlueCcQueryResult<BlueCcProject>>;
    listTodoLists(projectId?: string): Promise<BlueCcQueryResult<BlueCcTodoList[]>>;
    getTodoListWithTodos(listId: string, limit?: number): Promise<BlueCcQueryResult<BlueCcTodoList>>;
    listRecords(listId?: string): Promise<BlueCcQueryResult<{
        items: BlueCcRecord[];
        totalItems: number;
    }>>;
    getRecord(recordId: string): Promise<BlueCcQueryResult<BlueCcRecord>>;
    createRecord(title: string, listId?: string, customFields?: Record<string, any>): Promise<BlueCcQueryResult<BlueCcRecord>>;
    updateRecord(recordId: string, updates: {
        title?: string;
        done?: boolean;
        text?: string;
        customFields?: Record<string, any>;
    }): Promise<BlueCcQueryResult<BlueCcRecord>>;
    toggleRecordDone(recordId: string, done: boolean): Promise<BlueCcQueryResult<BlueCcRecord>>;
    listCustomFields(): Promise<BlueCcQueryResult<{
        id: string;
        name: string;
        type: string;
    }[]>>;
    getTodoGroups(type: 'TODO_LIST' | 'DUE_DATE' | 'ASSIGNEES' | 'TAGS', companyId?: string): Promise<BlueCcQueryResult<{
        items: {
            id: string;
            name: string;
            type: string;
            todoCount: number;
        }[];
        totalItems: number;
    }>>;
}
export declare const blueCc: BlueCcClient;
//# sourceMappingURL=omni-blue.d.ts.map