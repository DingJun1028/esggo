import React, { useState, useEffect } from 'react';
// Assuming EvidenceVault will be in src/services. The path from src/omni/components is ../../services
import { EvidenceVault } from '@/services/EvidenceVault.ts';
import { EvidenceMetadata } from '@/types/omni-report.types.ts';

const EvidenceCard: React.FC<{ evidence: EvidenceMetadata }> = ({ evidence }) => (
  <div className="border border-gray-700 rounded-lg p-4 bg-gray-800/50 shadow-md hover:shadow-lg transition-shadow">
    <div className="flex items-center mb-2">
      <span className="text-2xl mr-3">📄</span>
      <h4 className="font-bold text-lg truncate">{evidence.originalFileName}</h4>
    </div>
    <div className="text-sm text-gray-400 space-y-1">
      <p>
        <span className="font-semibold">Hash:</span>{' '}
        <code className="text-xs bg-gray-700 p-1 rounded">
          {evidence.fileHash.substring(0, 12)}...
        </code>
      </p>
      {evidence.linkedTruthClaims && evidence.linkedTruthClaims.length > 0 ? (
        <p>
          <span className="font-semibold">Linked Truth:</span>{' '}
          <code className="text-xs bg-blue-900 text-blue-200 p-1 rounded">
            #TR-{evidence.linkedTruthClaims![0]?.substring(0, 6)}
          </code>
        </p>
      ) : (
        <p>
          <span className="font-semibold">Linked Truth:</span> <span>Not linked</span>
        </p>
      )}

      {evidence.blockchainTxHash ? (
        <p className="text-green-400">
          <span className="font-semibold">🔗 Anchored:</span>{' '}
          <code className="text-xs bg-green-900 text-green-300 p-1 rounded">
            {evidence.blockchainTxHash?.substring(0, 12)}...
          </code>
        </p>
      ) : (
        <p className="text-yellow-400">
          <span className="font-semibold">❌ Not anchored</span>
        </p>
      )}
    </div>
  </div>
);

export const EvidenceBrowser: React.FC = () => {
  const [evidenceList, setEvidenceList] = useState<EvidenceMetadata[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // In a real app, this would be an API call.
    // For now, we are using the in-memory EvidenceVault.
    setEvidenceList(EvidenceVault.getAllEvidence());
  }, []);

  const filteredEvidence = searchQuery ? EvidenceVault.search(searchQuery) : evidenceList;

  return (
    <div className="frosted-panel p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-white flex items-center">
        <span className="text-4xl mr-4">🗂️</span>
        Evidence Browser
      </h2>
      <input
        type="search"
        placeholder="Search for evidence by name, hash, or content..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        className="w-full p-3 mb-6 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      />

      {filteredEvidence.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvidence.map(evidence => (
            <EvidenceCard key={evidence.id} evidence={evidence} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-400">No evidence found.</p>
          {searchQuery && <p className="text-gray-500">Try a different search term.</p>}
        </div>
      )}
    </div>
  );
};

export default EvidenceBrowser;
