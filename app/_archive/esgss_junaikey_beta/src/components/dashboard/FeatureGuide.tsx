import React, { useState } from 'react';
import { HelpCircle, Info, CheckCircle, Zap } from 'lucide-react';
import { Button, Modal, ScrollArea } from '../ui';

interface FeatureGuideProps {
  title: string;
  description: string;
  benefits: string[];
  howToUse: string[];
}

export const FeatureGuide: React.FC<FeatureGuideProps> = ({
  title,
  description,
  benefits,
  howToUse,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground hover:text-white"
        onClick={() => setIsOpen(true)}
        title="Feature Guide"
      >
        <HelpCircle className="w-5 h-5" />
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={title}>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Description */}
            <div>
              <h4 className="flex items-center gap-2 font-bold text-blue-400 mb-2">
                <Info className="w-4 h-4" /> About this Feature
              </h4>
              <p className="text-sm text-gray-300 leading-relaxed">{description}</p>
            </div>

            {/* Benefits */}
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
              <h4 className="flex items-center gap-2 font-bold text-emerald-400 mb-3">
                <Zap className="w-4 h-4" /> Strategic Value
              </h4>
              <ul className="space-y-2">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* How to Use */}
            <div>
              <h4 className="flex items-center gap-2 font-bold text-amber-400 mb-3">
                <Zap className="w-4 h-4" /> How to Use
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300 marker:text-amber-500">
                {howToUse.map((step, index) => (
                  <li key={index} className="pl-1">
                    <span className="ml-1">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </ScrollArea>
      </Modal>
    </>
  );
};
