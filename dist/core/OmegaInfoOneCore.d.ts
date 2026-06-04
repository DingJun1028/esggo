/**
 * OmniInfoOneCore - The core of OmniInfoOne
 * Represents the immutable DNA of the system.
 */
export declare class OmniInfoOneCore {
    uuid: string;
    source_origin: string;
    hash_lock: string;
    constructor();
    generateKey(): string;
    private computeHashLock;
    /** Expose the core truth */
    get truth(): string;
}
//# sourceMappingURL=OmegaInfoOneCore.d.ts.map