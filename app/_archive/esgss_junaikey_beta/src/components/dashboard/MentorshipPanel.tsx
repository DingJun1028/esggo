import React, { memo, useState, useCallback } from 'react';
import { Card, Button, Badge } from '@/components/ui';
import { GraduationCap, Lightbulb, ChevronRight } from 'lucide-react';

export const MentorshipPanel = memo(() => {
  const [isGuidanceVisible, setIsGuidanceVisible] = useState(false);

  const toggleGuidance = useCallback(() => {
    setIsGuidanceVisible(prev => !prev);
  }, []);

  const handleInherit = useCallback(() => {
    alert('已自動套用優化邏輯！');
  }, []);

  return (
    <Card
      className="p-5 border-dashed border-2 border-indigo-200 bg-indigo-50/50 dark:bg-indigo-900/10"
      role="region"
      aria-labelledby="mentorship-heading"
    >
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-indigo-600" aria-hidden="true" />
          <h3 id="mentorship-heading" className="font-bold text-lg">
            AVOS 師徒系統
          </h3>
        </div>
        <Badge variant="outline" className="bg-white">
          LV. 4 煉金導師
        </Badge>
      </header>

      <div className="space-y-4">
        <div
          className="p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-indigo-100"
          role="status"
          aria-live="polite"
        >
          <div className="flex gap-3">
            <div className="mt-1" aria-hidden="true">
              <Lightbulb className="h-5 w-5 text-amber-500 animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                「注意到你在處理區域數據，建議加入 <strong>Optional Chaining</strong>{' '}
                以增強符文穩定性。」
              </p>
              <Button
                variant="ghost"
                className="p-0 h-auto text-xs text-indigo-600 mt-2 flex items-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onClick={toggleGuidance}
                aria-expanded={isGuidanceVisible}
                aria-label={isGuidanceVisible ? 'Hide detailed guidance' : 'Show detailed guidance'}
              >
                查看詳細奧義說明 <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        </div>

        {isGuidanceVisible && (
          <div className="text-xs leading-relaxed text-slate-500 bg-slate-100 p-3 rounded border-l-2 border-indigo-500 animate-in fade-in slide-in-from-top-2 duration-300">
            <p className="mb-2">
              <strong>奧義來源：</strong> 核心架構師指令 #v6.0
            </p>
            <p>
              透過 `EARTHBONE_ZONES?.length`
              檢查，可以確保在數據尚未加載完成時，系統不會因為讀取未定義屬性而發生崩潰（The Big Bang
              Error）。
            </p>
          </div>
        )}

        <Button
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onClick={handleInherit}
          aria-label="點擊以繼承導師經驗並優化當前代碼"
        >
          繼承此項奧義
        </Button>
      </div>
    </Card>
  );
});

MentorshipPanel.displayName = 'MentorshipPanel';
