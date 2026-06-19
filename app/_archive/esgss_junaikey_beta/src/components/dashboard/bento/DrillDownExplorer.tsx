import React, { useState } from 'react';
import { useDashboard } from '../../../contexts/DashboardContext';
import { Eye, FileText } from 'lucide-react';

const mockData = [
  {
    id: 56,
    metric: 'electricity_usage_kwh',
    val: 850.5,
    co2e: 426.95,
    date: '2024-03-15',
    status: 'anchored',
  },
  {
    id: 45,
    metric: 'diesel_usage_L',
    val: 120,
    co2e: 310.2,
    date: '2024-03-10',
    status: 'anchored',
  },
  { id: 42, metric: 'water_usage_m3', val: 50, co2e: 0, date: '2024-03-05', status: 'approved' },
];

const DrillDownExplorer: React.FC = () => {
  const { dateRange, selectEvidence, selectedEvidenceId } = useDashboard();
  const [showModal, setShowModal] = useState(false);
  const [modalItem, setModalItem] = useState<any>(null);

  const filteredData = mockData.filter(d => {
    // Simple date filter logic logic for demo
    if (!dateRange.start) return true;
    return d.date >= dateRange.start! && d.date <= dateRange.end!;
  });

  const handleRowClick = (item: any) => {
    selectEvidence(item.id);
  };

  const handleViewSource = (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    setModalItem(item);
    setShowModal(true);
    selectEvidence(item.id); // Also select it
  };

  return (
    <div className="h-full flex flex-col bg-gray-800">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h3 className="text-gray-400 text-xs font-bold uppercase">
          Detailed Evidence Explorer (T1 & T3)
        </h3>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="bg-gray-900/50 sticky top-0">
            <tr>
              <th className="p-3 font-medium">ID</th>
              <th className="p-3 font-medium">Date</th>
              <th className="p-3 font-medium">Metric</th>
              <th className="p-3 font-medium text-right">Value</th>
              <th className="p-3 font-medium text-right">CO2e (kg)</th>
              <th className="p-3 font-medium text-center">Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/50">
            {filteredData.map(item => (
              <tr
                key={item.id}
                onClick={() => handleRowClick(item)}
                className={`cursor-pointer hover:bg-gray-700/50 transition-colors ${selectedEvidenceId === item.id ? 'bg-blue-900/20 border-l-2 border-blue-500' : ''}`}
              >
                <td className="p-3 text-white font-mono">#{item.id}</td>
                <td className="p-3">{item.date}</td>
                <td className="p-3 text-white">{item.metric}</td>
                <td className="p-3 text-right font-mono">{item.val}</td>
                <td className="p-3 text-right font-mono text-green-400">{item.co2e}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={e => handleViewSource(e, item)}
                    className="p-1 hover:text-white hover:bg-gray-600 rounded transition-colors"
                    title="View Original Proof"
                  >
                    <FileText size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Lightbox / Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gray-900 w-full max-w-6xl h-[80vh] rounded-2xl shadow-2xl border border-gray-700 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-white text-lg font-bold flex items-center">
                <Eye className="mr-2 text-blue-400" /> Evidence Source Verification: #{modalItem.id}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                &times;
              </button>
            </div>
            <div className="flex-1 flex overflow-hidden">
              {/* Metadata Panel */}
              <div className="w-1/3 p-6 bg-gray-800/50 border-r border-gray-700 overflow-y-auto">
                <h4 className="text-blue-400 text-xs font-bold uppercase mb-4">
                  T3: Calculable Proof
                </h4>
                <div className="space-y-4 text-sm text-gray-300">
                  <div>
                    <div className="text-gray-500 text-xs">Metric</div>
                    <div className="font-mono">{modalItem.metric}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs">Raw Value</div>
                    <div className="font-mono text-xl text-white">
                      {modalItem.val} <span className="text-sm text-gray-500">units</span>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-900 rounded border border-gray-700">
                    <div className="text-gray-500 text-xs mb-1">Calculation Logic</div>
                    <div className="font-mono text-xs text-green-400">
                      {modalItem.val} * 0.502 (Factor) = {modalItem.co2e}
                    </div>
                  </div>
                </div>

                <h4 className="text-blue-400 text-xs font-bold uppercase mb-4 mt-8">
                  T1: Traceable Source
                </h4>
                <div className="space-y-4 text-sm text-gray-300">
                  <div>
                    <div className="text-gray-500 text-xs">Emission Factor</div>
                    <div>Taipower 2023 Grid Factor</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs">Region</div>
                    <div>Taiwan (TW)</div>
                  </div>
                </div>
              </div>

              {/* PDF Preview */}
              <div className="w-2/3 bg-gray-950 flex items-center justify-center relative">
                <div className="text-center">
                  <FileText size={48} className="mx-auto text-gray-700 mb-4" />
                  <p className="text-gray-500">PDF Preview Placeholder</p>
                  <p className="text-xs text-gray-700">
                    (In real implementation, iframe loads signed URL)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DrillDownExplorer;
