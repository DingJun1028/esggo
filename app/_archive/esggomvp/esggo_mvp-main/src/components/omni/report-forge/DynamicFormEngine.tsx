'use client';

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Save, Send, AlertCircle } from 'lucide-react';
import { LiquidGlassContainer } from '../liquid-glass/LiquidGlassContainer';

export interface FormSchema {
    fields: {
        id: string;
        label: string;
        type: 'text' | 'number' | 'date' | 'select' | 'textarea';
        required?: boolean;
        placeholder?: string;
        options?: { label: string; value: string }[];
    }[];
}

interface DynamicFormEngineProps {
    schema: FormSchema;
    onSubmit: (data: any) => void;
    onSaveDraft?: (data: any) => void;
    initialData?: any;
    isLoading?: boolean;
    onChange?: (data: any) => void; // Added onChange prop
}

/**
 * ⚙️ DynamicFormEngine (永續動態表單引擎)
 * 基於 JSON Schema 自動渲染 Liquid Glass 視覺風格的表單。
 * 支援多種欄位型態、驗證邏輯與草稿暫存。
 */
export const DynamicFormEngine: React.FC<DynamicFormEngineProps> = ({
    schema,
    onSubmit,
    onSaveDraft,
    initialData = {},
    isLoading = false,
    onChange, // Destructure onChange
}) => {
    const methods = useForm({ defaultValues: initialData });
    const { register, handleSubmit, formState: { errors }, watch } = methods; // Added watch

    // Watch all fields and call onChange if provided
    React.useEffect(() => {
        if (onChange) {
            const subscription = watch((value, { name, type }) => {
                onChange(value);
            });
            return () => subscription.unsubscribe();
        }
    }, [watch, onChange]);

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {schema.fields.map((field) => (
                        <div key={field.id} className={`${field.type === 'textarea' ? 'md:col-span-2' : ''} space-y-2`}>
                            <label className="text-sm font-bold text-omni-text-main flex items-center gap-2">
                                {field.label}
                                {field.required && <span className="text-omni-primary">*</span>}
                            </label>

                            {field.type === 'textarea' ? (
                                <textarea
                                    {...register(field.id, { required: field.required })}
                                    placeholder={field.placeholder}
                                    className="omni-input min-h-[140px] resize-none focus:border-omni-primary/50 transition-all bg-omni-surface/30"
                                />
                            ) : field.type === 'select' ? (
                                <select
                                    {...register(field.id, { required: field.required })}
                                    className="omni-input appearance-none focus:border-omni-primary/50 transition-all bg-omni-surface/30"
                                >
                                    <option value="">{field.placeholder || '請選擇...'}</option>
                                    {field.options?.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type={field.type}
                                    {...register(field.id, { required: field.required })}
                                    placeholder={field.placeholder}
                                    className="omni-input focus:border-omni-primary/50 transition-all bg-omni-surface/30"
                                />
                            )}

                            {errors[field.id] && (
                                <motion.p
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-xs text-omni-danger flex items-center gap-1 mt-1 font-medium"
                                >
                                    <AlertCircle size={12} /> 此欄位為必填
                                </motion.p>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-12 pt-8 border-t border-omni-glass-border flex flex-wrap gap-4 items-center justify-between">
                    <div className="text-[10px] text-omni-text-muted font-mono bg-omni-surface/50 px-3 py-1.5 rounded-full border border-omni-glass-border tracking-wider">
                        NODE_ID: DF-ENGINE-V1.2
                    </div>

                    <div className="flex gap-4">
                        {onSaveDraft && (
                            <button
                                type="button"
                                onClick={() => onSaveDraft(methods.getValues())}
                                disabled={isLoading}
                                className="px-6 py-3 rounded-xl border border-omni-glass-border font-bold text-omni-text-main hover:bg-omni-surface-2 hover:border-omni-primary/30 transition-all flex items-center gap-2"
                            >
                                <Save size={18} /> 暫存草稿
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-10 py-3 rounded-xl bg-omni-primary text-white font-black hover:shadow-xl hover:shadow-omni-primary/30 active:scale-95 transition-all flex items-center gap-2"
                        >
                            <Send size={18} /> {isLoading ? '資產煉製中...' : '正式提交資產'}
                        </button>
                    </div>
                </div>
            </form>
        </FormProvider>
    );
};
