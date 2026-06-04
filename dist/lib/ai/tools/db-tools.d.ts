export declare const queryDatabaseTool: {
    name: string;
    description: string;
    execute: (input: {
        table: string;
        limit?: number;
        select?: string;
    }) => Promise<{
        success: boolean;
        data: ({
            error: true;
        } & "Received a generic string")[];
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        data?: undefined;
    }>;
};
export declare const insertDatabaseTool: {
    name: string;
    description: string;
    execute: (input: {
        table: string;
        payload: unknown;
    }) => Promise<{
        success: boolean;
        data: any[];
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        data?: undefined;
    }>;
};
//# sourceMappingURL=db-tools.d.ts.map