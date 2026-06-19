import React from 'react';
import { EvidenceVault } from '@/services/EvidenceVault';
import { EvidenceMetadata } from '@/types/omni-report.types';
import { FileText, Hash, Link, CircleCheck, Fingerprint } from 'lucide-react';
import './EvidenceCard.css';

interface EvidenceCardProps {
  evidence: EvidenceMetadata;
}

/**
 * @component EvidenceCard
 * @description A card component to display the summary of a single piece of evidence.
 */
export const EvidenceCard: React.FC<EvidenceCardProps> = ({ evidence }) => {
  const isAnchored = !!evidence.blockchainTxHash;
  const isLinked = evidence.linkedTruthClaims && evidence.linkedTruthClaims.length > 0;

  const formatDate = (timestamp: number | string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="evidence-card">
      <div className="card-header">
        <FileText className="file-icon" />
        <h4 className="file-name" title={evidence.originalFileName}>
          {evidence.originalFileName}
        </h4>
      </div>
      <div className="card-body">
        <div className="metadata-item">
          <Hash className="metadata-icon" />
          <span className="metadata-label">File Hash:</span>
          <span className="metadata-value hash" title={evidence.fileHash}>
            {`${evidence.fileHash.substring(0, 12)}...`}
          </span>
        </div>
        <div className="metadata-item">
          <Fingerprint className="metadata-icon" />
          <span className="metadata-label">Witness:</span>
          <span className="metadata-value">{evidence.witness || 'N/A'}</span>
        </div>
        <div className="metadata-item">
          <span className="metadata-label">Uploaded:</span>
          <span className="metadata-value">{formatDate(evidence.uploadedAt)}</span>
        </div>
      </div>
      <div className="card-footer">
        <div className={`status-badge ${isLinked ? 'linked' : ''}`}>
          <Link className="status-icon" />
          <span>{isLinked ? `Linked (${evidence.linkedTruthClaims?.length})` : 'Not Linked'}</span>
        </div>
        <div className={`status-badge ${isAnchored ? 'anchored' : ''}`}>
          <CircleCheck className="status-icon" />
          <span>{isAnchored ? 'Anchored' : 'Not Anchored'}</span>
        </div>
      </div>
    </div>
  );
};
