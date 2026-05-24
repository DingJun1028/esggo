import { Suspense } from 'react';
import DashboardContent from './DashboardContent';

function DashboardSkeleton() {
  return (
    <div style={{ padding: 24 }}>
      <div className="skeleton" style={{ height: 180, borderRadius: 16, marginBottom: 16 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 16 }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 120, borderRadius: 12 }} />
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <div className="skeleton" style={{ height: 280, borderRadius: 12 }} />
        <div className="skeleton" style={{ height: 280, borderRadius: 12 }} />
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}