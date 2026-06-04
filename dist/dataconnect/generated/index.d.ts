/**
 * @dataconnect/generated — Stub Module
 *
 * This is a placeholder for the Firebase Data Connect SDK generated types.
 * Replace with actual generated code once `firebase dataconnect:sdk:generate` is run.
 */
export interface Task {
    id: string;
    [key: string]: unknown;
}
export interface Report {
    id: string;
    [key: string]: unknown;
}
export declare const listAllTasks: () => Promise<{
    data: {
        tasks: Task[];
    };
}>;
export declare const upsertTask: (_args: Record<string, unknown>) => Promise<{
    data: unknown;
}>;
export declare const getReportById: (_args: {
    id: string;
}) => Promise<{
    data: {
        report: Report | null;
    };
}>;
//# sourceMappingURL=index.d.ts.map