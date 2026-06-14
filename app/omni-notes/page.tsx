import React from 'react';
import { OmniNotesWorkspace } from '@/components/omni/OmniNotesWorkspace';
import { FileText } from 'lucide-react';

export const metadata = {
  title: '萬能筆記 OmniNotes - ESG GO',
  description: 'ESG GO 萬能筆記：任務追蹤與自癒日誌全通樞紐',
};

export default function OmniNotesPage() {
  return (
    <div className="flex-1 w-full bg-[#FAFAFA] dark:bg-[#030712] min-h-screen text-gray-900 dark:text-gray-100 flex flex-col">
      <header className="w-full px-6 py-8 md:px-12 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wider">OmniNotes 萬能筆記</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              無作妙德圓通無礙 · 任務與自發性治理樞紐
            </p>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full p-4 md:p-6 lg:p-8 flex flex-col items-center">
        <div className="w-full max-w-[1600px] flex-1 flex flex-col relative z-10">
          <OmniNotesWorkspace />
        </div>
      </main>
    </div>
  );
}
