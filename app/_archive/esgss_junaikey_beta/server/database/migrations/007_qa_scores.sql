-- ===============================================
-- ESG GO Platform: QA Score Schema
-- Sprint 2: Report Quality Assessment
-- ===============================================

-- Table: qa_scores
-- Purpose: 儲存 ESG 報告品質評分結果
CREATE TABLE IF NOT EXISTS qa_scores (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign Keys
  user_id UUID NOT NULL,
  company_id UUID,
  report_id UUID, -- 可能是 sustainability_reports 或其他報告類型
  l1_assessment_id UUID REFERENCES health_check_results(id),
  
  -- Overall Score
  overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  grade VARCHAR(2) CHECK (grade IN ('A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F')),
  
  -- 5 Dimensions Scores (QA Score v0)
  completeness_score INTEGER CHECK (completeness_score >= 0 AND completeness_score <= 100),
  accuracy_score INTEGER CHECK (accuracy_score >= 0 AND accuracy_score <= 100),
  consistency_score INTEGER CHECK (consistency_score >= 0 AND consistency_score <= 100),
  comparability_score INTEGER CHECK (comparability_score >= 0 AND comparability_score <= 100),
  trustworthy_score INTEGER CHECK (trustworthy_score >= 0 AND trustworthy_score <= 100),
  
  -- Weighted Breakdown
  dimension_weights JSONB DEFAULT '{
    "completeness": 0.25,
    "accuracy": 0.25,
    "consistency": 0.20,
    "comparability": 0.15,
    "trustworthy": 0.15
  }'::jsonb,
  
  -- Gaps & Recommendations
  gaps JSONB DEFAULT '[]', -- QAGap[]
  recommendations JSONB DEFAULT '[]', -- string[]
  
  -- Evidence Count (影響 Trustworthy 分數)
  evidence_count INTEGER DEFAULT 0,
  locked_evidence_count INTEGER DEFAULT 0,
  
  -- Certification Eligibility
  is_certifiable BOOLEAN DEFAULT false,
  certification_requirements JSONB, -- 達標條件清單
  
  -- Metadata
  calculation_method VARCHAR(50) DEFAULT 'qa_score_v0',
  calculation_timestamp TIMESTAMP DEFAULT NOW(),
  
  -- 5T Protocol
  hash_signature VARCHAR(64),
  source_origin VARCHAR(255) DEFAULT 'qa_calculator',
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_qa_user_id ON qa_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_qa_company_id ON qa_scores(company_id) WHERE company_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_qa_report_id ON qa_scores(report_id) WHERE report_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_qa_assessment_id ON qa_scores(l1_assessment_id) WHERE l1_assessment_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_qa_overall_score ON qa_scores(overall_score DESC);
CREATE INDEX IF NOT EXISTS idx_qa_grade ON qa_scores(grade);
CREATE INDEX IF NOT EXISTS idx_qa_certifiable ON qa_scores(is_certifiable) WHERE is_certifiable = true;
CREATE INDEX IF NOT EXISTS idx_qa_created_at ON qa_scores(created_at DESC);

-- Composite Index: User + Created (for history queries)
CREATE INDEX IF NOT EXISTS idx_qa_user_created ON qa_scores(user_id, created_at DESC);

-- Trigger: Auto-update timestamp
CREATE OR REPLACE FUNCTION update_qa_score_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_qa_score_update
BEFORE UPDATE ON qa_scores
FOR EACH ROW
EXECUTE FUNCTION update_qa_score_timestamp();

-- Row Level Security
ALTER TABLE qa_scores ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own QA scores
CREATE POLICY qa_score_select_policy ON qa_scores
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own QA scores
CREATE POLICY qa_score_insert_policy ON qa_scores
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own QA scores
CREATE POLICY qa_score_update_policy ON qa_scores
  FOR UPDATE
  USING (auth.uid() = user_id);
