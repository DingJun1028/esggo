/**
 * 🔐 DataRoomService: Institutional Disclosure Vault
 * --------------------------------------------------
 * Manages high-security documents (Evidence) and their access
 * for institutional investors and regulators.
 */

import { v4 as uuidv4 } from 'uuid';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.js';
import { OmniStore, OmniNamespace } from '../OmniStore.js';

export interface DataRoomDocument {
  id: string;
  name: string;
  category: 'FINANCIAL' | 'ESG_DATA' | 'EVIDENCE' | 'REPORT';
  status: 'PROTECTED' | 'VERIFIED' | 'PUBLISHED';
  accessLevel: 1 | 2 | 3 | 4 | 5; // 5 = Maximum Security
  integrityHash: string;
  timestamp: number;
  url?: string;
}

export class DataRoomService {
  private static readonly STORE_KEY = 'dataroom_index';

  public static async getDocuments(): Promise<DataRoomDocument[]> {
    const res = OmniStore.getItem<DataRoomDocument[]>(OmniNamespace.SYSTEM, this.STORE_KEY);
    if (res.success && res.data) return res.data;

    // Default Mock Baseline
    const baseline: DataRoomDocument[] = [
      {
        id: uuidv4(),
        name: 'Annual GHG Inventory 2025.pdf',
        category: 'ESG_DATA',
        status: 'VERIFIED',
        accessLevel: 3,
        integrityHash: 'a8f9...2c1e',
        timestamp: Date.now() - 86400000 * 5,
      },
      {
        id: uuidv4(),
        name: 'TSBI Certification Audit.pdf',
        category: 'EVIDENCE',
        status: 'PROTECTED',
        accessLevel: 4,
        integrityHash: 'b7d2...9a3f',
        timestamp: Date.now() - 86400000 * 2,
      },
      {
        id: uuidv4(),
        name: 'Executive Alpha Report Q4.xlsx',
        category: 'FINANCIAL',
        status: 'PUBLISHED',
        accessLevel: 1,
        integrityHash: 'c1e4...8b5d',
        timestamp: Date.now(),
      },
    ];

    this.saveDocuments(baseline);
    return baseline;
  }

  public static saveDocuments(docs: DataRoomDocument[]): void {
    OmniStore.setItem(OmniNamespace.SYSTEM, this.STORE_KEY, docs);
  }

  public static async uploadDocument(
    name: string,
    category: DataRoomDocument['category']
  ): Promise<DataRoomDocument> {
    const docs = await this.getDocuments();
    const newDoc: DataRoomDocument = {
      id: uuidv4(),
      name,
      category,
      status: 'PROTECTED',
      accessLevel: 3,
      integrityHash: 'calculating...',
      timestamp: Date.now(),
    };

    docs.unshift(newDoc);
    this.saveDocuments(docs);

    omniLogger.info(LogCategory.BUSINESS, `Document registered in Data Room: ${name}`);
    return newDoc;
  }
}
