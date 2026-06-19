import React, { memo } from 'react';
import { RuneChart } from './charts/RuneChart';
import { EnergyDistribution } from './charts/EnergyDistribution';

export const Overview = memo(() => {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
      role="region"
      aria-label="System overview dashboard"
    >
      <RuneChart />
      <EnergyDistribution />
    </div>
  );
});

Overview.displayName = 'Overview';
