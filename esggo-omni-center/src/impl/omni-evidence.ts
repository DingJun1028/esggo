import { createHash, randomUUID } from 'crypto';

export type EvidenceRecord = {
  readonly uuid: string;
  readonly sourceOrigin: string;
  readonly timestamp: number;
  readonly standard: string;
  readonly payloadHash: string;
  readonly status: 'verified' | 'pending' | 'failed';
};

export type VerificationInput = {
  readonly sourceOrigin: string;
  readonly standard?: string;
  readonly payload: unknown;
};

export class OmniEvidence {
  private records: EvidenceRecord[] = [];
  private readonly standard: string;

  constructor(standard = '[ISO-14064-1]') {
    this.standard = standard;
  }

  static hashPayload(payload: unknown): string {
    return createHash('sha256')
      .update(JSON.stringify(payload ?? {}))
      .digest('hex');
  }

  capture(input: VerificationInput): EvidenceRecord {
    const record = Object.freeze({
      uuid: randomUUID(),
      sourceOrigin: input.sourceOrigin,
      timestamp: Date.now(),
      standard: input.standard ?? this.standard,
      payloadHash: OmniEvidence.hashPayload(input.payload),
      status: 'pending',
    } as EvidenceRecord);

    this.records.push(record);
    return record;
  }

  verify(record: EvidenceRecord, payload: unknown): boolean {
    const expected = OmniEvidence.hashPayload(payload);
    const ok = record.payloadHash === expected;

    const idx = this.records.findIndex(r => r.uuid === record.uuid);
    if (idx >= 0) {
      this.records[idx] = Object.freeze({
        ...record,
        status: ok ? 'verified' : 'failed',
      }) as EvidenceRecord;
    }

    return ok;
  }

  getRecords(sourceOrigin?: string): readonly EvidenceRecord[] {
    if (!sourceOrigin) return Object.freeze([...this.records]);
    return Object.freeze(this.records.filter(r => r.sourceOrigin === sourceOrigin));
  }
}
