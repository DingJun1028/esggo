import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Minimize2, EyeOff, Info, Move } from 'lucide-react';

interface WidgetContextMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onResize: (size: 'half' | 'full') => void;
  onHide: () => void;
  position?: { x: number; y: number }; // Optional absolute positioning
  currentColSpan?: string;
}

export const WidgetContextMenu: React.FC<WidgetContextMenuProps> = ({
  isOpen,
  onClose,
  onResize,
  onHide,
  currentColSpan,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          className="absolute top-2 right-2 z-[60] bg-slate-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] p-2 min-w-[160px] flex flex-col gap-1"
          onClick={e => e.stopPropagation()} // Prevent click bubbling
        >
          <div className="text-[10px] text-slate-500 font-bold px-2 py-1 uppercase tracking-widest border-b border-white/5 mb-1">
            WIDGET ACTIONS
          </div>

          <button
            onClick={() => onResize(currentColSpan?.includes('col-span-2') ? 'half' : 'full')}
            className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-white/10 text-slate-300 hover:text-cyan-400 transition-colors text-xs"
          >
            {currentColSpan?.includes('col-span-2') ? (
              <>
                <Minimize2 size={14} /> <span>Shrink to Half</span>
              </>
            ) : (
              <>
                <Maximize2 size={14} /> <span>Expand to Full</span>
              </>
            )}
          </button>

          <button
            onClick={onHide}
            className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-red-500/10 text-slate-300 hover:text-red-400 transition-colors text-xs"
          >
            <EyeOff size={14} />
            <span>Hide Widget</span>
          </button>

          <div className="text-[10px] text-slate-600 px-2 py-1 mt-1 text-center font-mono">
            DRAG TO MOVE
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
