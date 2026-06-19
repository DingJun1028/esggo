import { v4 as uuidv4 } from 'uuid';

/**
 * 💎 IComponentCore: The universal soul of InfoOne components.
 * Ensuring every asset is Traceable, Trackable, and Trustworthy.
 */
import { IComponentCore as IBaseCore } from "@/core/IComponentCore";

export interface IComponentCore extends IBaseCore {}

/**
 * 🌀 SacredCommand: The high-level intent processed by the Agent Network.
 */
export interface ISacredCommand {
    id: string;
    originator: string;
    intent: string;
    payload: any;
    tags: string[];
}

/**
 * 🛠️ OmniAgent: A specialized functional unit within the Wings of Light.
 */
export interface IOmniAgent {
    uuid: string;
    name: string;
    role: 'AUDITOR' | 'STRATEGIST' | 'FORGER' | 'OBSERVER';
    capabilities: string[];
}
