import { Suspense } from 'react';
import DashboardContent from './DashboardContent';

export default function Page() {
  return (
    <Suspense fallback={
      <div className="page-wrap">
        <div className="skeleton" style={{ height: 38, width: 260, marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 18, width: 340, marginBottom: 28 }} />
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 110 }} />)}
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}