import React from 'react';

export const SustainabilityReport: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-[#050505] text-white">
      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-[#0ab8b2]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>

      <h2 className="text-2xl font-bold mb-2 text-white">2026 Sustainability Report</h2>
      <p className="text-slate-400 max-w-md mb-8">
        This report is automatically generated based on the 5 Ke Protocol. All data points are
        traceable and immutable.
      </p>

      <div className="flex gap-4">
        <button className="px-6 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm">
          View Summary
        </button>
        <button className="px-6 py-2 rounded-lg bg-[#0ab8b2] hover:bg-[#089994] text-black font-medium transition-colors text-sm flex items-center gap-2">
          <span>Download PDF</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SustainabilityReport;
