/**
 * OmniEsgCell Example Usage Page
 *
 * Showcases various usages of the Omni component.
 */

import React from 'react';
import { OmniEsgCell } from './OmniEsgCell.tsx';
import { OmniLabelFactory } from '../../../../types/index.ts';
import { omniLogger, LogCategory } from '../../../infrastructure/logging/OmniLogger.ts';

export function OmniEsgCellShowcase(): React.ReactElement {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold text-white">OmniEsgCell Omni Component Showcase</h1>

      {/* 1. Card Mode - ESG Data */}
      <section>
        <h2 className="text-lg mb-4 text-gray-300">Card Mode</h2>
        <div className="grid grid-cols-3 gap-6">
          <OmniEsgCell
            id="showcase-card-1"
            mode="card"
            label="Carbon Emissions"
            value="1,240 tCO2e"
            subValue="vs last month"
            confidence="high"
            verified
            dataLink="live"
            color="emerald"
            omniLabel={OmniLabelFactory.esgMetric('E')}
            onAiAnalyze={() =>
              omniLogger.info(LogCategory.AI, 'AI analyze triggered from Showcase')
            }
          />

          <OmniEsgCell
            id="showcase-card-2"
            mode="card"
            label="Employee Satisfaction"
            value="92%"
            confidence="medium"
            dataLink="ai"
            color="blue"
            omniLabel={OmniLabelFactory.esgMetric('S')}
          />

          <OmniEsgCell
            id="showcase-card-3"
            mode="card"
            label="Board Diversity"
            value="45%"
            confidence="high"
            verified
            dataLink="blockchain"
            color="purple"
            omniLabel={OmniLabelFactory.esgMetric('G')}
          />
        </div>
      </section>

      {/* 2. List Mode */}
      <section>
        <h2 className="text-lg mb-4 text-gray-300">List Mode</h2>
        <div className="space-y-4">
          <OmniEsgCell
            id="showcase-list-1"
            mode="list"
            label="Water Usage"
            value="125,000 L"
            confidence="high"
            dataLink="live"
            color="emerald"
          />
          <OmniEsgCell
            id="showcase-list-2"
            mode="list"
            label="Waste Recycling Rate"
            value="78%"
            confidence="medium"
            dataLink="ai"
            color="gold"
          />
        </div>
      </section>

      {/* 3. Cell Mode */}
      <section>
        <h2 className="text-lg mb-4 text-gray-300">Cell Mode</h2>
        <div className="grid grid-cols-4 gap-4">
          <OmniEsgCell id="cell-1" mode="cell" label="E" value="92" confidence="high" />
          <OmniEsgCell id="cell-2" mode="cell" label="S" value="88" confidence="medium" />
          <OmniEsgCell id="cell-3" mode="cell" label="G" value="95" confidence="high" />
          <OmniEsgCell id="cell-4" mode="cell" label="T" value="99" confidence="high" />
        </div>
      </section>

      {/* 4. Loading Status */}
      <section>
        <h2 className="text-lg mb-4 text-gray-300">Loading Status</h2>
        <div className="grid grid-cols-3 gap-6">
          <OmniEsgCell id="loading-card" mode="card" loading={true} label="" value={undefined} />
          <OmniEsgCell id="loading-list" mode="list" loading={true} label="" value={undefined} />
          <OmniEsgCell id="loading-cell" mode="cell" loading={true} label="" value={undefined} />
        </div>
      </section>
    </div>
  );
}
