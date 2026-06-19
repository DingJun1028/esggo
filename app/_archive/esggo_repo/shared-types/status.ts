export type Id = string;
export type IsoDateTimeString = string;
export type SemanticVersion = string; // 當前鎖定核心版本: "8.5.0-Alpha"

export interface UserRef {
  id: Id;
  name: string;
  email: string;
}

export enum RecordLifecycleStatus {
  Draft = 'draft',
  Pending = 'pending',
  InReview = 'inReview',
  Approved = 'approved',
  Active = 'active',
  Completed = 'completed',
  Rejected = 'rejected',
  Expired = 'expired',
  Archived = 'archived'
}

export enum AttentionStatus {
  Normal = 'normal',
  Warning = 'warning',
  Critical = 'critical'
}
