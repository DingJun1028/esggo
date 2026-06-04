/**
 * OmniAgent | Sandbox Executor
 * Provides an abstraction for running code in a secure, isolated environment.
 * Supports Simulated mode (Dev) and E2B mode (Production).
 */
export interface SandboxResult {
    stdout: string;
    stderr: string;
    exitCode: number;
    results?: unknown;
    error?: string;
    isSimulated: boolean;
}
export interface SandboxOptions {
    language: 'python' | 'javascript';
    dependencies?: string[];
    timeoutMs?: number;
}
/**
 * Main Sandbox Execution Entry Point
 */
export declare function runInSandbox(code: string, options?: SandboxOptions): Promise<SandboxResult>;
//# sourceMappingURL=sandbox.d.ts.map