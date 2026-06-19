-- 💡 ESGss JunAiKey: GRI 指標初始化數據
-- 預置常用的環境 (GRI 300) 指標數據

INSERT INTO esg_indicators (id, code, topic, standard, formula_logic, required_evidence)
VALUES 
(
    '00000000-0000-4000-8000-000000000302', 
    'GRI 302-1', 
    '組織內的能源消耗量', 
    'GRI', 
    '{"logic": "Total = Non-Renewable + Renewable + Purchased - Sold", "unit": "kWh"}',
    '["energy_bill", "purchase_record"]'
),
(
    '00000000-0000-4000-8000-000000000305', 
    'GRI 305-1', 
    '直接 (範疇 1) 溫室氣體排放', 
    'GRI', 
    '{"logic": "E = A * EF * GWP", "formula": "Activity_Data * Emission_Factor * GWP", "target_unit": "tCO2e"}',
    '["fuel_invoice", "emission_factor_table"]'
),
(
    '00000000-0000-4000-8000-000000000306', 
    'GRI 306-3', 
    '產生的廢棄物', 
    'GRI', 
    '{"logic": "Total Waste = Hazardous + Non-Hazardous", "unit": "Metric Tons"}',
    '["waste_transfer_note", "disposal_record"]'
)
ON CONFLICT (code) DO UPDATE 
SET topic = EXCLUDED.topic, 
    formula_logic = EXCLUDED.formula_logic, 
    required_evidence = EXCLUDED.required_evidence;
