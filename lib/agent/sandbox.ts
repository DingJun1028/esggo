/**
 * OmniAgent | Sandbox Executor
 * Provides an abstraction for running code in a secure, isolated environment.
 * Supports Simulated mode (Dev) and E2B mode (Production).
 */

export interface SandboxResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  results?: any;
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
export async function runInSandbox(
  code: string,
  options: SandboxOptions = { language: 'python' }
): Promise<SandboxResult> {
  const isE2BConfigured = !!process.env.E2B_API_KEY;

  if (isE2BConfigured) {
    return runProductionE2B(code, options);
  } else {
    return runSimulatedSandbox(code, options);
  }
}

/**
 * [Production] E2B Code Interpreter Integration
 * This requires the @e2b/code-interpreter package.
 */
async function runProductionE2B(code: string, options: SandboxOptions): Promise<SandboxResult> {
  console.log(`[Sandbox] Executing production code via E2B (${options.language})...`);

  // Implementation note: In a real environment, we would use:
  // const { CodeInterpreter } = await import('@e2b/code-interpreter');
  // const sandbox = await CodeInterpreter.create();
  // const execution = await sandbox.runCode(code);
  // ...

  throw new Error("E2B Integration requires @e2b/code-interpreter package installation.");
}

/**
 * [Dev/Mock] Simulated Sandbox Execution
 * Mimics behavior for UI testing and local development.
 */
async function runSimulatedSandbox(code: string, options: SandboxOptions): Promise<SandboxResult> {
  console.log(`[Sandbox] Executing simulated code (${options.language})...`);

  const executionPromise = async (): Promise<SandboxResult> => {
    // Artificial delay to simulate cloud execution
    await new Promise(r => setTimeout(r, 1500));

    // Basic simulation logic
    if (code.includes('error') || code.includes('fail')) {
      return {
        stdout: "",
        stderr: "Traceback (most recent call last):\n  File \"main.py\", line 4, in <module>\n    raise Exception(\"Simulated error\")",
        exitCode: 1,
        error: "Runtime execution failed in simulation.",
        isSimulated: true
      };
    }

    // Extract a simulated result if the code looks like a calculation
    let simulatedOutput = "Output captured from simulated execution.";
    if (code.includes('Emission Gap')) {
      simulatedOutput = "Emission Gap: 247 tCO2e";
    }

    return {
      stdout: simulatedOutput,
      stderr: "",
      exitCode: 0,
      isSimulated: true
    };
  };

  if (options.timeoutMs) {
    const timeoutPromise = new Promise<SandboxResult>((_, reject) =>
      setTimeout(() => reject(new Error(`Sandbox execution timed out after ${options.timeoutMs}ms`)), options.timeoutMs)
    );
    return Promise.race([executionPromise(), timeoutPromise]);
  }

  return executionPromise();
}
