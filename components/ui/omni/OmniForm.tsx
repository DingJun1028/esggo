import { OmniComponentHeart } from '@esggo/types';
import React, { useState } from 'react';
import { cn } from '../../../lib/utils';
import { OmniInput, OmniSelect, OmniTextarea } from './OmniInput';
import { OmniButton } from './OmniButton';
import { ShieldCheck } from 'lucide-react';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'enum' | 'textarea' | 'date';
  options?: string[]; // for enum
  required?: boolean;
  placeholder?: string;
}

export interface OmniFormProps {
  /** [永恆覺醒] 萬能元件心核：無作妙德，圓通無礙 */
  omniHeart?: OmniComponentHeart;

  fields: FormField[];
  onSubmit: (data: unknown) => void;
  onCancel?: () => void;
  initialValues?: unknown;
  submitLabel?: string;
  className?: string;
}

export function OmniForm({
  fields,
  onSubmit,
  onCancel,
  initialValues = {},
  submitLabel = 'Submit',
  className,
  omniHeart
}: OmniFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>(initialValues as Record<string, any>);

  const handleChange = (name: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className={cn(
      "relative rounded-xl transition-all duration-500",
      omniHeart ? (
        omniHeart.resonanceState === 1.0 
          ? "border border-[#ffd700]/30 shadow-[0_0_20px_rgba(255,215,0,0.15)] bg-[#ffd700]/5 p-6" 
          : "border border-[#63a6b0]/30 shadow-[0_0_20px_rgba(99,166,176,0.1)] bg-[#63a6b0]/5 p-6"
      ) : "",
      className
    )}>
      {omniHeart && (
        <div className="absolute top-0 right-0 px-3 py-1 bg-[var(--theme-surface)] border-b border-l border-[var(--theme-border)] rounded-bl-lg text-[10px] font-mono flex items-center gap-1">
          <ShieldCheck size={12} className={omniHeart.resonanceState === 1.0 ? "text-[#ffd700]" : "text-[#63a6b0]"} />
          <span className={omniHeart.resonanceState === 1.0 ? "text-[#ffd700]" : "text-[#63a6b0]"}>
            OMNI-CORE 5T SECURED
          </span>
        </div>
      )}
      <form onSubmit={handleSubmit} className={cn("space-y-6", !omniHeart && className)}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {fields.map((field) => (
          <div key={field.name} className={cn("space-y-2", field.type === 'textarea' ? "md:col-span-2" : "")}>
            <label className="text-sm font-semibold tracking-wide text-[var(--theme-text)]">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            
            {field.type === 'textarea' ? (
              <OmniTextarea
                value={formData[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
                omniHeart={omniHeart}
              />
            ) : field.type === 'enum' ? (
              <OmniSelect
                value={formData[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                required={field.required}
                omniHeart={omniHeart}
              >
                <option value="">Select...</option>
                {field.options?.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </OmniSelect>
            ) : (
              <OmniInput
                type={field.type}
                value={formData[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
                omniHeart={omniHeart}
              />
            )}
          </div>
        ))}
      </div>
      
      <div className="flex justify-between items-center pt-4 border-t border-[var(--theme-border)]">
        <div className="flex-1">
          {omniHeart && omniHeart.fiveTState && (
            <div className="flex items-center space-x-2 text-[10px] font-mono opacity-80">
              <span className="text-[var(--theme-text-muted)]">5T:</span>
              <span className={omniHeart.fiveTState.tangible ? 'text-[#63a6b0]' : 'text-slate-500'}>Tan</span>
              <span className={omniHeart.fiveTState.traceable ? 'text-[#63a6b0]' : 'text-slate-500'}>Tra</span>
              <span className={omniHeart.fiveTState.trackable ? 'text-[#63a6b0]' : 'text-slate-500'}>Trk</span>
              <span className={omniHeart.fiveTState.transparent ? 'text-[#63a6b0]' : 'text-slate-500'}>Trp</span>
              <span className={omniHeart.fiveTState.trustworthy ? 'text-[#ffd700] font-bold' : 'text-slate-500'}>Tru</span>
            </div>
          )}
        </div>
        <div className="flex space-x-4">
          {onCancel && (
            <OmniButton type="button" variant="outline" onClick={onCancel}>
              Cancel
            </OmniButton>
          )}
          <OmniButton type="submit" variant="primary">
            {submitLabel}
          </OmniButton>
        </div>
      </div>
    </form>
  </div>
  );
}
