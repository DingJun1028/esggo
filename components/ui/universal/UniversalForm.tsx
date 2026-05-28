import React, { useState } from 'react';
import { cn } from '../../../lib/utils';
import { UniversalInput } from './UniversalInput';
import { UniversalButton } from './UniversalButton';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'enum' | 'textarea' | 'date';
  options?: string[]; // for enum
  required?: boolean;
  placeholder?: string;
}

export interface UniversalFormProps {
  fields: FormField[];
  onSubmit: (data: any) => void;
  onCancel?: () => void;
  initialValues?: any;
  submitLabel?: string;
  className?: string;
}

export function UniversalForm({
  fields,
  onSubmit,
  onCancel,
  initialValues = {},
  submitLabel = 'Submit',
  className
}: UniversalFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>(initialValues);

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-6", className)}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {fields.map((field) => (
          <div key={field.name} className={cn("space-y-2", field.type === 'textarea' ? "md:col-span-2" : "")}>
            <label className="text-sm font-semibold tracking-wide text-[var(--theme-text)]">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            
            {field.type === 'textarea' ? (
              <textarea
                value={formData[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
                className="w-full min-h-[100px] px-3 py-2 bg-[var(--theme-surface)] border border-[var(--theme-border)] rounded-md text-[var(--theme-text)] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary)] transition-all resize-y"
              />
            ) : field.type === 'enum' ? (
              <select
                value={formData[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                required={field.required}
                className="w-full px-3 py-2 bg-[var(--theme-surface)] border border-[var(--theme-border)] rounded-md text-[var(--theme-text)] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary)] transition-all"
              >
                <option value="">Select...</option>
                {field.options?.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <UniversalInput
                type={field.type}
                value={formData[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
              />
            )}
          </div>
        ))}
      </div>
      
      <div className="flex justify-end space-x-4 pt-4 border-t border-[var(--theme-border)]">
        {onCancel && (
          <UniversalButton type="button" variant="outline" onClick={onCancel}>
            Cancel
          </UniversalButton>
        )}
        <UniversalButton type="submit" variant="primary">
          {submitLabel}
        </UniversalButton>
      </div>
    </form>
  );
}
