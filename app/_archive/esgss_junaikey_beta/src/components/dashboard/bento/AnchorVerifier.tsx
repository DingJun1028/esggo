import React, { useEffect, useState } from 'react';
import { useDashboard } from '../../../contexts/DashboardContext';

const AnchorVerifier: React.FC = () => {
  const { selectedEvidenceId } = useDashboard();
  const [anchorData, setAnchorData] = useState<{ hash: string; tx: string } | null>(null);

  useEffect(() => {
    // Logic to get anchor data from selected evidence details
    // In a real app, 'selectedEvidenceId' trigger might fetch details including anchor info,
    // OR DrillDownExplorer passed it to context.
    // For now, we simulate or assume it's fetched.
    if (selectedEvidenceId === 56) {
      // Demo ID
      setAnchorData({
        hash: '0xabc123...',
        tx: '0x123456789abcdef...',
      });
    } else {
      setAnchorData(null);
    }
  }, [selectedEvidenceId]);

  return (
    <div className="h-full p-4 flex flex-col justify-center items-center text-center bg-gray-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #4ade80 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      ></div>

      <h3 className="absolute top-4 left-4 text-gray-400 text-xs font-bold uppercase">
        Polygon Anchor (T4)
      </h3>

      {selectedEvidenceId && anchorData ? (
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 text-green-400 mb-3 mx-auto">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div className="text-white font-bold mb-1">Verified on Chain</div>
          <div className="text-gray-500 text-[10px] font-mono mb-3 break-all px-4">
            {anchorData.tx}
          </div>
          <a
            href={`https://polygonscan.com/tx/${anchorData.tx}`}
            target="_blank"
            rel="noreferrer"
            className="inline-block px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-blue-300 transition-colors"
          >
            View on PolygonScan
          </a>
        </div>
      ) : (
        <div className="text-gray-600 text-sm">
          {selectedEvidenceId
            ? 'This item is not anchored yet.'
            : 'Select an item to verify T4 proof.'}
        </div>
      )}
    </div>
  );
};

export default AnchorVerifier;
