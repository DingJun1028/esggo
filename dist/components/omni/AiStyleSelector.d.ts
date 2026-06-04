import React from 'react';
interface AiStyleOption {
    key: string;
    label: string;
    description: string;
    icon?: React.ReactNode;
}
interface AiStyleSelectorProps {
    options: AiStyleOption[];
    value: string;
    onValueChange: (value: string) => void;
    disabled?: boolean;
}
declare const AiStyleSelector: React.FC<AiStyleSelectorProps>;
export default AiStyleSelector;
//# sourceMappingURL=AiStyleSelector.d.ts.map