export type OmniNoteVariant = "optimal" | "critical" | "lethal";

export interface OmniNote {
  id: string;
  note_id: string;
  type: "no-action" | "insight";
  title: string;
  content: string;
  dimensions: {
    truthful: number;   // 0-100
    transferful: number;
    thankful: number;
    tasteful: number;
    trustful: number;
  };
  variant: OmniNoteVariant;
  tags: string[];
  created_at: string;
  updated_at: string;
  spirit_feedback?: string;
  hash?: string; // For 5T Verification
}

export type CreateNoteInput = Omit<OmniNote, "id" | "note_id" | "created_at" | "updated_at">;
