import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { EvidenceBrowser } from '../EvidenceBrowser';
import { EvidenceVault } from '../../services/EvidenceVault';
import { omniLogger } from '../../omni/infrastructure/logging/OmniLogger';
import { EvidenceMetadata } from '../../types/omni-report.types';

// Mock dependencies
vi.mock('../../services/EvidenceVault', () => ({
  EvidenceVault: {
    getAllEvidence: vi.fn(),
  },
}));

vi.mock('../../omni/infrastructure/logging/OmniLogger', () => ({
  omniLogger: {
    error: vi.fn(),
  },
  LogCategory: {
    SYSTEM: 'SYSTEM',
  },
}));

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  Search: () => <span data-testid="search-icon">SearchIcon</span>,
  FileText: () => <span data-testid="file-text-icon">FileTextIcon</span>,
  Hash: () => <span data-testid="hash-icon">HashIcon</span>,
  Link: () => <span data-testid="link-icon">LinkIcon</span>,
  CircleCheck: () => <span data-testid="circle-check-icon">CircleCheckIcon</span>,
  Fingerprint: () => <span data-testid="fingerprint-icon">FingerprintIcon</span>,
}));

describe('EvidenceBrowser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockEvidence: EvidenceMetadata[] = [
    {
      id: '1',
      fileHash: 'hash1',
      vaultPath: 'path1',
      originalFileName: 'Contract.pdf',
      mimeType: 'application/pdf',
      uploadedAt: new Date().toISOString(),
      witness: 'System',
    },
    {
      id: '2',
      fileHash: 'hash2',
      vaultPath: 'path2',
      originalFileName: 'Invoice.png',
      mimeType: 'image/png',
      uploadedAt: new Date().toISOString(),
      witness: 'User',
    },
  ];

  it('renders evidence list correctly', async () => {
    // @ts-ignore
    EvidenceVault.getAllEvidence.mockReturnValue(mockEvidence);

    render(<EvidenceBrowser />);

    await waitFor(() => {
      expect(screen.getByText('Contract.pdf')).toBeInTheDocument();
      expect(screen.getByText('Invoice.png')).toBeInTheDocument();
    });
  });

  it('filters evidence based on search query', async () => {
    // @ts-ignore
    EvidenceVault.getAllEvidence.mockReturnValue(mockEvidence);

    render(<EvidenceBrowser />);

    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByText('Contract.pdf')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Search Evidence/i);
    fireEvent.change(searchInput, { target: { value: 'Contract' } });

    await waitFor(() => {
      expect(screen.getByText('Contract.pdf')).toBeInTheDocument();
      expect(screen.queryByText('Invoice.png')).not.toBeInTheDocument();
    });
  });
});
