/**
 * OmniBase
 * Base definition for Omni components
 */

export interface OmniBase {
  id: string;
  type: string;
  createdAt: number;
  updatedAt: number;
  metadata?: Record<string, any>;
}

export abstract class OmniComponent implements OmniBase {
  public id: string;
  public type: string;
  public createdAt: number;
  public updatedAt: number;

  constructor(type: string) {
    this.type = type;
    this.id = crypto.randomUUID();
    this.createdAt = Date.now();
    this.updatedAt = Date.now();
  }

  public touch(): void {
    this.updatedAt = Date.now();
  }
}
