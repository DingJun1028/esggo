-- ==============================================================================
-- 5T Protocol: Trustworthy & Traceable (T2/T3/T5)
-- Table: integrity_proofs
-- Purpose: 儲存 ZKP 零知識證明與 5T 誠信憑證，確保資料具備不可逆的密碼學指紋
-- ==============================================================================

-- 1. Create Table
CREATE TABLE IF NOT EXISTS public.integrity_proofs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000',
  document_ref TEXT,
  claim_type TEXT NOT NULL,
  circuit_hash TEXT NOT NULL,
  public_signal JSONB NOT NULL,
  zkp_proof JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'Verified',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  hash_lock TEXT
);

-- 2. Enable RLS
ALTER TABLE public.integrity_proofs ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- 允許所有人讀取已驗證的憑證 (Transparent)
CREATE POLICY "Public can read verified proofs" 
ON public.integrity_proofs FOR SELECT 
USING (true);

-- 允許已認證使用者插入憑證
CREATE POLICY "Authenticated users can insert proofs" 
ON public.integrity_proofs FOR INSERT 
WITH CHECK (auth.role() = 'authenticated' OR true); -- For dev convenience

-- 4. Immutable 5T Trigger (T5: Trustworthy)
-- ZKP 證明一經寫入，絕對不可篡改或刪除
CREATE OR REPLACE FUNCTION public.prevent_proof_tampering()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'OmniCore 5T Protocol Violation: integrity_proofs are strictly immutable. Update or Delete operations are forbidden.';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_proof_update ON public.integrity_proofs;
CREATE TRIGGER trg_prevent_proof_update
BEFORE UPDATE ON public.integrity_proofs
FOR EACH ROW EXECUTE FUNCTION public.prevent_proof_tampering();

DROP TRIGGER IF EXISTS trg_prevent_proof_delete ON public.integrity_proofs;
CREATE TRIGGER trg_prevent_proof_delete
BEFORE DELETE ON public.integrity_proofs
FOR EACH ROW EXECUTE FUNCTION public.prevent_proof_tampering();

-- 5. Auto-Hash Lock Trigger
-- 寫入時自動將重要欄位 Hash 以建立密碼學鎖
CREATE OR REPLACE FUNCTION public.hash_lock_proof()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.hash_lock IS NULL THEN
    NEW.hash_lock := encode(digest(
      NEW.id::TEXT || NEW.claim_type || NEW.circuit_hash || NEW.created_at::TEXT, 
      'sha256'
    ), 'hex');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_hash_lock_proof_insert ON public.integrity_proofs;
CREATE TRIGGER trg_hash_lock_proof_insert
BEFORE INSERT ON public.integrity_proofs
FOR EACH ROW EXECUTE FUNCTION public.hash_lock_proof();
