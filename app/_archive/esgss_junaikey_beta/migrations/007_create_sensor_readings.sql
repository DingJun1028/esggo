-- ============================================================================
-- Mitigation 007: Ambient Sensor Data Ingestion (Fixed Enum)
-- Purpose: Store real-time IoT sensor data for "Ambient AI" analysis.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.sensor_readings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sensor_id VARCHAR(100) NOT NULL,
    -- Fixed: Default must match existing enum 'internal','external','partner','public'
    type public.source_taxonomy DEFAULT 'internal', 
    reading_type VARCHAR(50) NOT NULL, -- e.g., 'Electricity', 'Water', 'Temp'
    value DECIMAL(15, 4) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    is_anomaly BOOLEAN DEFAULT false,
    
    -- Metadata constraints
    location VARCHAR(200),
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Optimize for time-series queries
CREATE INDEX IF NOT EXISTS idx_sensor_readings_time ON public.sensor_readings (timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_sensor_readings_sensor ON public.sensor_readings (sensor_id);
CREATE INDEX IF NOT EXISTS idx_sensor_readings_anomaly ON public.sensor_readings (is_anomaly) WHERE is_anomaly = true;

-- Enable RLS
ALTER TABLE public.sensor_readings ENABLE ROW LEVEL SECURITY;

-- Policy: Allow Service Role and authenticated devices to INSERT
CREATE POLICY "Enable insert for authenticated users and service role"
ON public.sensor_readings
FOR INSERT
TO authenticated, service_role
WITH CHECK (true);

-- Policy: Allow read access to authenticated users
CREATE POLICY "Enable read access for authenticated users"
ON public.sensor_readings
FOR SELECT
TO authenticated, service_role
USING (true);

DO $$
BEGIN
    RAISE NOTICE '✅ Table public.sensor_readings created successfully with correct enum values.';
END $$;
