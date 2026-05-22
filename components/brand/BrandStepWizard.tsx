'use client';
import React from 'react';
import { Check } from 'lucide-react';

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

export default function BrandStepWizard({ steps, currentStep, onStepClick, orientation = 'horizontal' }: BrandStepWizardProps) {
  if (orientation === 'vertical') {
    return (
      <div className="space-y-0">
        {steps.map((step, i) => {
          const done = i < currentStep;
          const active = i === currentStep;
          return (
            <div key={step.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 cursor-pointer ${done ? 'bg-[#003262] text-white' : active ? 'bg-[#FDB515] text-[#003262]' : 'bg-slate-100 text-slate-400'}`}
                  onClick={() => onStepClick?.(i)}
                >
                  {done ? <Check size={12} /> : i + 1}
                </div>
                {i < steps.length - 1 && <div className="w-px h-8 bg-slate-200 my-1" />}
              </div>
              <div className="pb-4">
                <p className={`text-sm font-medium ${active ? 'text-[#003262]' : done ? 'text-slate-600' : 'text-slate-400'}`}>{step.label}</p>
                {step.description && <p className="text-xs text-slate-400">{step.description}</p>}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex items-center w-full">
      {steps.map((step, i) => {
        const done = i < currentStep;
        const active = i === currentStep;
        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center" onClick={() => onStepClick?.(i)}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer transition-all ${done ? 'bg-[#003262] text-white' : active ? 'bg-[#FDB515] text-[#003262]' : 'bg-slate-100 text-slate-400'}`}>
                {done ? <Check size={12} /> : i + 1}
              </div>
              <p className={`text-[11px] mt-1 text-center max-w-[60px] leading-tight ${active ? 'text-[#003262] font-medium' : 'text-slate-400'}`}>{step.label}</p>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-px mx-1 mb-4 ${done ? 'bg-[#003262]' : 'bg-slate-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}