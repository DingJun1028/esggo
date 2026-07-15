'use client';

const TRACKS = [
  { title: 'ESG 永續報告師', weeks: 6, tag: 'CERT', color: '#009EB0' },
  { title: '5T 數據治理師', weeks: 6, tag: 'ZEN', color: '#3B82F6' },
];

const CAP = [
  'Week 1-3：永續報告準則與 ZKP 封印實做',
  'Week 4-6：GRI + OmniTag 實做資產',
  'Week 1-3：5T 協議 + Dashboard 可視化',
  'Week 4-6：資料治理 + OmniBaseCard 元件',
];

export default function LearningCenter() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-lg bg-accentTeal flex items-center justify-center text-white text-lg">🎓</div>
        <div>
          <h2 className="text-lg font-bold text-accentTeal">Learning center</h2>
          <p className="text-xs text-textSecondary">OmniCore × ESG × 5T</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-secondary border border-borderColor rounded-2xl p-5">
          <div className="text-xs text-textSecondary font-semibold tracking-wider mb-3">雙軌對照</div>
          <div className="flex gap-3">
            {TRACKS.map((t) => (
              <div key={t.title} className="flex-1 rounded-xl border border-borderColor/60 p-4">
                <div className="text-xs font-bold mb-1" style={{ color: t.color }}>{t.tag}</div>
                <div className="text-sm font-semibold mb-2">{t.title}</div>
                <div className="text-[11px] text-textSecondary">{t.weeks} 週 · 實做導向</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-secondary border border-borderColor rounded-2xl p-5">
          <div className="text-xs text-textSecondary font-semibold tracking-wider mb-3">Capstone 矩陣</div>
          <div className="flex flex-col gap-2">
            {CAP.map((name) => (
              <div key={name} className="flex items-center justify-between rounded-lg border border-borderColor/60 px-3 py-2">
                <div className="text-xs">{name}</div>
                <span className="text-[10px] font-bold px-2 py-[2px] rounded-md bg-accentTeal/15 text-accentTeal">CAP</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
