import React from 'react';
import { ZKPRangeProof } from '../../lib/crypto-proof';
interface Props {
    proof: ZKPRangeProof;
    title?: string;
    onVerify?: (valid: boolean) => void;
}
export declare function ZKPRangeProofVisualizer({ proof, title, onVerify }: Props): React.JSX.Element;
export {};
//# sourceMappingURL=ZKPRangeProofVisualizer.d.ts.map