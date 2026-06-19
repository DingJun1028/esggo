/**
 * 🌀 OmniState: The Contextual Guardian
 * Responsibility: Manage global state and source origins for the 5T protocol.
 */

class OmniState {
    private static instance: OmniState;
    private origin: string = 'GENESIS';

    private constructor() { }

    public static getInstance(): OmniState {
        if (!OmniState.instance) {
            OmniState.instance = new OmniState();
        }
        return OmniState.instance;
    }

    public setOrigin(origin: string) {
        this.origin = origin;
    }

    public getOrigin(): string {
        return this.origin;
    }

    public resetOrigin() {
        this.origin = 'GENESIS';
    }
}

export const omniState = OmniState.getInstance();
