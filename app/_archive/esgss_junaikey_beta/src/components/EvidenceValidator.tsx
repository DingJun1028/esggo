// src/components/EvidenceValidator.tsx
import React, { useState, useEffect } from 'react';

import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

// Define the type for an evidence record
interface Evidence {
  id: number;
  storage_path: string;
  data_type: string;
  metric_key: string;
  metric_value_numeric: string; // Comes as string from JSON
  status: 'pending_validation' | 'approved' | 'rejected';
  created_at: string;
}

const EvidenceValidator: React.FC = () => {
  const [pendingEvidence, setPendingEvidence] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';

  // Function to fetch pending evidence
  const fetchPendingEvidence = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiBaseUrl}/api/evidence/pending`, {
        headers: {
          // This is where you would put your actual auth token
          Authorization: `Bearer ${process.env.API_SECRET_TOKEN}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }
      const data: Evidence[] = await response.json();
      setPendingEvidence(data);
    } catch (err: any) {
      setError(err.message);
      omniLogger.error(LogCategory.SYSTEM, '[EvidenceValidator] Error fetching pending evidence:', { error: err });
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchPendingEvidence();
  }, []);

  // Function to handle status update
  const handleUpdateStatus = async (id: number, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/evidence/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.API_SECRET_TOKEN}`,
        },
        body: JSON.stringify({ status }), // validatorUserId could be added here
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update status');
      }

      // Remove the updated item from the list locally for a snappy UI response
      setPendingEvidence(prev => prev.filter(item => item.id !== id));
    } catch (err: any) {
      setError(`Failed to update item ${id}: ${err.message}`);
      omniLogger.error(LogCategory.SYSTEM, '[EvidenceValidator] `Error updating status for evidence ${id}:`', { error: err });
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading pending evidence...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Evidence Validation Queue</h1>
      {pendingEvidence.length === 0 ? (
        <p>No evidence is currently pending validation. Great job!</p>
      ) : (
        <div className="space-y-4">
          {pendingEvidence.map(item => (
            <div key={item.id} className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="font-bold text-gray-500 text-sm">Metric</h3>
                  <p className="text-lg">
                    {item.metric_key}:{' '}
                    <span className="font-semibold text-blue-600">
                      {parseFloat(item.metric_value_numeric).toLocaleString()}
                    </span>
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-500 text-sm">Document Type</h3>
                  <p className="text-lg">{item.data_type}</p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-500 text-sm">Submission Date</h3>
                  <p className="text-lg">{new Date(item.created_at).toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                <a
                  href={item.storage_path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View Original Document
                </a>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleUpdateStatus(item.id, 'approved')}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-150"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(item.id, 'rejected')}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-150"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EvidenceValidator;
