export declare class OmniTableClient {
    private baseURL;
    private apiToken;
    private spaceId;
    constructor(apiToken: string, spaceId: string);
    private request;
    getRecords(datasheetId: string, params?: {
        pageSize?: number;
        pageNum?: number;
        viewId?: string;
        fields?: string[];
        filterByFormula?: string;
        cellFormat?: 'json' | 'string';
        fieldKey?: 'name' | 'id';
    }): Promise<{
        pageNum: number;
        records: Record<string, unknown>[];
        pageSize: number;
        total: number;
    }>;
    createRecords(datasheetId: string, records: Record<string, unknown>[], fieldKey?: 'name' | 'id'): Promise<unknown>;
    updateRecords(datasheetId: string, records: Record<string, unknown>[], fieldKey?: 'name' | 'id'): Promise<unknown>;
    deleteRecords(datasheetId: string, recordIds: string[]): Promise<any>;
    getFields(datasheetId: string, viewId?: string): Promise<any>;
    createField(datasheetId: string, field: Record<string, unknown>): Promise<any>;
    deleteField(datasheetId: string, fieldId: string): Promise<any>;
    getViews(datasheetId: string): Promise<any>;
    createDatasheet(datasheet: {
        name: string;
        description?: string;
        folderId?: string;
        preNodeId?: string;
        fields?: Record<string, unknown>[];
    }): Promise<any>;
    uploadAttachment(datasheetId: string, file: File): Promise<any>;
    getSpaces(): Promise<any>;
    getNodes(spaceId?: string): Promise<any>;
    searchNodes(type: 'Folder' | 'Datasheet' | 'Form' | 'Dashboard' | 'Mirror', permissions?: number[], query?: string): Promise<any>;
    getNodeDetails(nodeId: string): Promise<any>;
    createEmbedLink(nodeId: string, payload: Record<string, unknown>, theme?: 'light' | 'dark'): Promise<any>;
    getEmbedLinks(nodeId: string): Promise<any>;
    deleteEmbedLink(nodeId: string, linkId: string): Promise<any>;
    getMember(unitId: string, sensitiveData?: boolean): Promise<any>;
    updateMember(unitId: string, updates: {
        name?: string;
        teams?: string[];
        roles?: string[];
    }, sensitiveData?: boolean): Promise<any>;
    deleteMember(unitId: string): Promise<any>;
    getTeamMembers(unitId: string, sensitiveData?: boolean): Promise<any>;
    getSubTeams(unitId: string): Promise<any>;
    createTeam(team: {
        name: string;
        sequence?: number;
        parentUnitId?: string;
        roles?: string[];
    }): Promise<any>;
    updateTeam(unitId: string, updates: {
        name?: string;
        sequence?: number;
        parentUnitId?: string;
        roles?: string[];
    }): Promise<any>;
    deleteTeam(unitId: string): Promise<any>;
    getRoleUnits(unitId: string, sensitiveData?: boolean): Promise<any>;
    getRoles(pageSize?: number, pageNum?: number): Promise<any>;
    createRole(role: {
        name: string;
        sequence?: number;
    }): Promise<any>;
    updateRole(unitId: string, updates: {
        name?: string;
        sequence?: number;
    }): Promise<any>;
    deleteRole(unitId: string): Promise<any>;
    createChatCompletion(aiId: string, messages: Record<string, unknown>[], options?: {
        model?: string;
        functions?: Record<string, unknown>[];
        functionCall?: {
            name: string;
        };
        temperature?: number;
        topP?: number;
        stream?: boolean;
        stop?: string | string[];
        maxTokens?: number;
        presencePenalty?: number;
        frequencyPenalty?: number;
        user?: string;
    }): Promise<any>;
}
//# sourceMappingURL=omni-table-client.d.ts.map