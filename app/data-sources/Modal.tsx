
import { X } from 'lucide-react';

export function Modal({
  open,
  onClose,
  title,
  children,
  width = 'max-w-lg',
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string;
}) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0"
            onClick={onClose}
          />
          <div
            className={`relative bg-white rounded-2xl shadow-2xl ${width} w-full max-h-[85vh] flex flex-col`}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-sm font-black text-berkeley-blue">{title}</h3>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={14} />
              </button>
            </div>
            <div className="px-6 py-4 overflow-y-auto flex-1">{children}</div>
          </div>
        </div>
      )}
    </>
  );
}
