import React from 'react';
import { Terminal } from 'lucide-react';

interface NeonInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const NeonInput: React.FC<NeonInputProps> = ({ icon, ...props }) => {
  return (
    <div className="flex items-center gap-4 bg-green-900/10 border border-green-500/30 rounded px-4 py-2 focus-within:border-green-400/60 transition-all">
      {icon || <Terminal size={18} className="text-green-600" />}
      <input
        {...props}
        className="flex-1 bg-transparent border-none outline-none text-green-400 font-mono placeholder:text-green-900"
      />
    </div>
  );
};
