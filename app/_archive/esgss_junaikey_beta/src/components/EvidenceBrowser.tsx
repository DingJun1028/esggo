import React, { useState, useEffect, useMemo, useDeferredValue } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { EvidenceVault } from '@/services/EvidenceVault';
import { EvidenceMetadata } from '@/types/omni-report.types';
import { Search } from 'lucide-react';
import { EvidenceCard } from './EvidenceCard';
import './EvidenceBrowser.css';

/**
 * @component EvidenceBrowser
 * @description A UI component for browsing, searching, and inspecting digital evidence
 * stored in the EvidenceVault. It provides a user-friendly interface for interacting
 * with evidence metadata.
 */
export const EvidenceBrowser: React.FC = () => {
  const [evidenceList, setEvidenceList] = useState<EvidenceMetadata[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // ⚡ Bolt: Defer the search query to prevent blocking the UI during typing
  // This keeps the input responsive even if filtering the list is expensive
  const deferredSearchQuery = useDeferredValue(searchQuery);

  // Effect to load all evidence from the vault on component mount.
  useEffect(() => {
    try {
      const allEvidence = EvidenceVault.getAllEvidence();
      setEvidenceList(allEvidence);
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '[EvidenceBrowser] Failed to load evidence from vault:', { error })
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Filter evidence based on the search query.
  // ⚡ Bolt: Memoize the filtered list to avoid re-filtering on every render
  // This ensures filtering only happens when the deferred search query or evidence list changes
  const filteredEvidence = useMemo(() => {
    return deferredSearchQuery
      ? evidenceList.filter(evidence =>
          evidence.originalFileName.toLowerCase().includes(deferredSearchQuery.toLowerCase())
        )
      : evidenceList;
  }, [evidenceList, deferredSearchQuery]);

  return (
    <div className="evidence-browser-container frosted-panel">
      <div className="browser-header">
        <h2 className="browser-title">🗂️ 佐證庫 (Evidence Vault)</h2>
        <div className="relative flex items-center w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          <input
            type="search"
            aria-label="Search evidence by filename"
            placeholder="搜尋證據 (Search Evidence by filename)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="search-input pl-10 w-full"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="loading-indicator">Loading Evidence...</div>
      ) : (
        <div className="evidence-timeline">
          {filteredEvidence.length > 0 ? (
            filteredEvidence.map(evidence => <EvidenceCard key={evidence.id} evidence={evidence} />)
          ) : (
            <div className="empty-state">
              <p>No evidence found.</p>
              {searchQuery && <p>Try adjusting your search query.</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
