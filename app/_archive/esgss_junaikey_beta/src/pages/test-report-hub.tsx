import React from 'react';
import { SustainabilityReportHub } from '@/components/Report/SustainabilityReportHub';

export default function TestReportHub() {
  return (
    <div className="h-screen w-screen bg-slate-900">
      <div className="p-4 bg-yellow-500/20 text-yellow-300 font-mono text-sm">
        🧪 TEST ROUTE: /test-report-hub - Direct access to SustainabilityReportHub
      </div>
      <div className="h-full">
        <SustainabilityReportHub />
      </div>
    </div>
  );
}
