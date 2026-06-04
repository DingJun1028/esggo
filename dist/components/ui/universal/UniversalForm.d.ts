import React from 'react';
export interface FormField {
    name: string;
    label: string;
    type: 'text' | 'number' | 'enum' | 'textarea' | 'date';
    options?: string[];
    required?: boolean;
    placeholder?: string;
}
export interface UniversalFormProps {
    fields: FormField[];
    onSubmit: (data: unknown) => void;
    onCancel?: () => void;
    initialValues?: unknown;
    submitLabel?: string;
    className?: string;
}
export declare function UniversalForm({ fields, onSubmit, onCancel, initialValues, submitLabel, className }: UniversalFormProps): React.JSX.Element;
//# sourceMappingURL=UniversalForm.d.ts.map