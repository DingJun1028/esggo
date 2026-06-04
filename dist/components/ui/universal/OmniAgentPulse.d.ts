import React from 'react';
export interface PulseTask {
    id: string;
    type: 'etl_sync' | 'memory_extraction' | 'zkp_seal';
    status: 'pending' | 'active' | 'completed' | 'failed';
    message: string;
}
export declare function OmniAgentPulse(): React.JSX.Element;
//# sourceMappingURL=OmniAgentPulse.d.ts.map