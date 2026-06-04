import React from 'react';
interface Step {
    id: string;
    label: string;
    description?: string;
}
interface BrandStepWizardProps {
    steps: Step[];
    currentStep: number;
    onStepClick?: (index: number) => void;
    orientation?: 'horizontal' | 'vertical';
}
export default function BrandStepWizard({ steps, currentStep, onStepClick, orientation }: BrandStepWizardProps): React.JSX.Element;
export {};
//# sourceMappingURL=BrandStepWizard.d.ts.map