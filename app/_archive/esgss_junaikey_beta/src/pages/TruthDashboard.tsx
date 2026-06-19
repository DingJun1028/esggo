import React, { useState, useEffect } from 'react';
import { Language } from '../types/index.ts';
import { DashboardProvider } from '../contexts/DashboardContext.tsx';
import KpiBox from '../components/dashboard/bento/KpiBox.tsx';
import TrendBox from '../components/dashboard/bento/TrendBox.tsx';
import BloodlineBox from '../components/dashboard/bento/BloodlineBox.tsx';
import AnchorVerifier from '../components/dashboard/bento/AnchorVerifier.tsx';
import DrillDownExplorer from '../components/dashboard/bento/DrillDownExplorer.tsx';
import AiAssistantBox from '../components/dashboard/bento/AiAssistantBox.tsx';
import { Reorder, motion, AnimatePresence } from 'framer-motion';
import { GripVertical, X } from 'lucide-react';
import { WidgetContextMenu } from '../components/dashboard/WidgetContextMenu.tsx';

interface TruthDashboardProps {
  language?: Language;
  isEditMode?: boolean;
}

interface WidgetItem {
  id: string;
  component: React.ReactNode;
  colSpan?: string; // e.g. 'md:col-span-2'
  defaultHeight?: string;
  name: string;
}

const TruthDashboard: React.FC<TruthDashboardProps> = ({
  language = 'zh-TW',
  isEditMode = false,
}) => {
  const isZh = language === 'zh-TW';

  // Widget Registry
  const initialWidgets: WidgetItem[] = [
    {
      id: 'kpi',
      name: 'KPI Overview',
      component: <KpiBox />,
      colSpan: 'md:col-span-2',
      defaultHeight: 'h-64',
    },
    { id: 'bloodline', name: 'Bloodline', component: <BloodlineBox />, defaultHeight: 'h-64' },
    { id: 'trend', name: 'Trend Analysis', component: <TrendBox />, defaultHeight: 'h-64' },
    { id: 'anchor', name: 'Anchor Verifier', component: <AnchorVerifier />, defaultHeight: 'h-64' },
    {
      id: 'spacer',
      name: 'Spacer',
      component: (
        <div className="p-4 text-gray-500 flex items-center justify-center h-full">
          Space Available
        </div>
      ),
      defaultHeight: 'h-64',
    },
    {
      id: 'explorer',
      name: 'Data Explorer',
      component: <DrillDownExplorer />,
      colSpan: 'md:col-span-2',
      defaultHeight: 'min-h-[400px]',
    },
    {
      id: 'ai',
      name: 'AI Assistant',
      component: <AiAssistantBox />,
      defaultHeight: 'min-h-[400px]',
    },
  ];

  const [items, setItems] = useState(initialWidgets);
  const [activeWidgetId, setActiveWidgetId] = useState<string | null>(null);

  // Load order from local storage
  useEffect(() => {
    const savedOrder = localStorage.getItem('dashboard_order');
    if (savedOrder) {
      const parsedOrder = JSON.parse(savedOrder) as string[];
      // Sort initialWidgets based on parsedOrder
      const ordered = parsedOrder
        .map(id => initialWidgets.find(w => w.id === id))
        .filter((w): w is WidgetItem => !!w);

      // Add any new items that might have been added to registry but not in storage
      const existingIds = new Set(ordered.map(w => w.id));
      const newItems = initialWidgets.filter(w => !existingIds.has(w.id));

      setItems([...ordered, ...newItems]);
    }
  }, []);

  // Save order when changed
  const handleReorder = (newOrder: WidgetItem[]) => {
    setItems(newOrder);
    localStorage.setItem('dashboard_order', JSON.stringify(newOrder.map(w => w.id)));
  };

  const handleRemove = (id: string) => {
    const newItems = items.filter(i => i.id !== id);
    handleReorder(newItems);
  };

  const handleResize = (id: string, size: 'half' | 'full') => {
    const newItems = items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          colSpan: size === 'full' ? 'md:col-span-2' : '', // Reset to 1 col
        };
      }
      return item;
    });
    setItems(newItems);
    // Don't save resize yet, just local session? Or save too?
    // To save resize, we'd need to store widget metadata not just ID list.
    // For now, let's just update local state.
  };

  // Close context menu when clicking outside (handled by overlay in main app usually, but here simple logic)
  useEffect(() => {
    if (!isEditMode) setActiveWidgetId(null);
  }, [isEditMode]);

  return (
    <DashboardProvider>
      <div
        className="p-0 lg:p-4 bg-gray-900 min-h-screen text-white"
        onClick={() => setActiveWidgetId(null)} // Close menu on bg click
      >
        <header className="mb-6 flex justify-between items-center px-4 pt-4 lg:px-0 lg:pt-0">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent uppercase tracking-tight">
              Truth Dashboard
            </h1>
            <p className="text-gray-400 text-sm font-medium">
              5T 協議集成：可溯、可追、透明、感官、不可篡改 (Sovereign 5T)
            </p>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-xs text-gray-500">v7.0.0-sentient</div>
            <div className="mt-1 px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 text-[10px] uppercase tracking-widest rounded-full animate-pulse">
              ✨ 永恆覺醒
            </div>
          </div>
        </header>

        {/* 🛠️ Edit Mode Indicator */}
        <AnimatePresence>
          {isEditMode && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-emerald-900/30 border border-emerald-500/30 rounded-lg p-3 mb-4 text-center text-emerald-400 text-sm font-mono"
            >
              🔧 Edit Mode Active: Drag to Reorder • Click Widget for Menu
            </motion.div>
          )}
        </AnimatePresence>

        <Reorder.Group
          axis="y"
          onReorder={handleReorder}
          values={items}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-min"
          as="ul"
        >
          {items.map(item => (
            <Reorder.Item
              key={item.id}
              value={item}
              drag={isEditMode}
              dragListener={isEditMode}
              onDragEnd={() => isEditMode && setActiveWidgetId(item.id)} // Show menu after drag
              onClick={e => {
                if (isEditMode) {
                  e.stopPropagation();
                  setActiveWidgetId(item.id);
                }
              }}
              className={`${item.colSpan || ''} ${item.defaultHeight} rounded-xl relative group`}
              style={{ listStyle: 'none' }}
            >
              {/* Shake Effect in Edit Mode */}
              <motion.div
                animate={isEditMode ? { rotate: [-0.5, 0.5, -0.5] } : { rotate: 0 }}
                transition={isEditMode ? { repeat: Infinity, duration: 0.3 } : {}}
                className={`h-full bg-gray-800 rounded-xl border overflow-hidden shadow-lg transition-all ${isEditMode ? 'border-emerald-500/50 cursor-move' : 'border-gray-700'}`}
              >
                {/* Widget Context Menu */}
                <WidgetContextMenu
                  isOpen={activeWidgetId === item.id}
                  onClose={() => setActiveWidgetId(null)}
                  onResize={size => handleResize(item.id, size)}
                  onHide={() => handleRemove(item.id)}
                  currentColSpan={item.colSpan}
                />

                {/* Widget Content */}
                <div className={`h-full ${isEditMode ? 'pointer-events-none opacity-80' : ''}`}>
                  {item.component}
                </div>
              </motion.div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>
    </DashboardProvider>
  );
};

export default TruthDashboard;
