/**
 * Simple hybrid state controller for OmniCLI + Jules integration.
 * Keeps track of whether the system is in ESG mode or Jules AI mode.
 * After every command, the controller checks if the latest result
 * signals a need to switch to Jules for a code fix or logic enhancement.
 */
export declare class StateController {
    private currentState;
    /**
     * After a command has finished, this method inspects the output or
     * task description to determine if a transition to Jules is necessary.
     */
    postCommandExecution(args: string[]): Promise<void>;
    /**
     * Trigger a Jules code generation or repair task based on a prompt.
     */
    triggerJulesFix(prompt: string): Promise<void>;
}
//# sourceMappingURL=state-controller.d.ts.map