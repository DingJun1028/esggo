import React from 'react';
export interface OmniAgentCardProps {
    id: string;
    name: string;
    role: string;
    rarity?: 'verified' | 'awakened' | 'experimental';
    imageUrl?: string;
    fiveTStatus?: [boolean, boolean, boolean, boolean, boolean];
    confidenceScore?: number;
    skills?: string[];
    jsonSchema?: string;
}
export default function OmniAgentCard({ id, name, role, rarity, imageUrl, // Default fallback
fiveTStatus, confidenceScore, skills, jsonSchema }: OmniAgentCardProps): React.JSX.Element;
//# sourceMappingURL=OmniAgentCard.d.ts.map