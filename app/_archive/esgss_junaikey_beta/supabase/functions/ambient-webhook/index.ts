import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

console.log("Hello from Ambient Webhook (Reliability Enhanced)!")

Deno.serve(async (req) => {
    try {
        const payload = await req.json()

        // Reliability: Log payload size for observability
        console.log(`Received Payload (${JSON.stringify(payload).length} bytes)`)

        // Check if it's an INSERT to sensor_readings and is_anomaly is true
        const { type, table, record } = payload

        if (type === 'INSERT' && table === 'sensor_readings' && record.is_anomaly === true) {
            console.log('🚨 Anomaly detected! Processing...')

            // Initialize Supabase Client
            const supabase = createClient(
                Deno.env.get('SUPABASE_URL') ?? '',
                Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
            )

            // 1. Idempotency Check: Did we already process this reading?
            // Use metadata->>sensor_reading_id which we inject in the payload or exist in record
            const readingId = record.id;

            const { data: existing } = await supabase
                .from('incidents')
                .select('id')
                .eq('metadata->>sensor_reading_id', readingId)
                .maybeSingle()

            if (existing) {
                console.log(`ℹ️ Incident for reading ${readingId} already exists. Skipping (Idempotent).`)
                return new Response(JSON.stringify({ skipped: true, reason: 'duplicate' }), {
                    headers: { 'Content-Type': 'application/json' },
                })
            }

            // 2. Map Severity (Simple Logic)
            const severity = 'high';

            // 3. Create Incident
            const { data, error } = await supabase
                .from('incidents')
                .insert({
                    title: `Anomaly Detected: ${record.reading_type}`,
                    description: `Sensor ${record.sensor_id} reported anomalous value: ${record.value} ${record.unit}.`,
                    priority: severity,
                    status: 'open',
                    source: 'ambient-outbox',
                    metadata: {
                        sensor_reading_id: readingId,
                        raw_value: record.value,
                        location: record.location,
                        ingested_at: new Date().toISOString()
                    }
                })
                .select()
                .single()

            if (error) {
                console.error('❌ Failed to create incident:', error)
                return new Response(JSON.stringify({ error: error.message }), { status: 500 })
            }

            console.log('✅ Incident created successfully:', data.id)
            return new Response(JSON.stringify({ success: true, incident_id: data.id }), {
                headers: { 'Content-Type': 'application/json' },
            })
        }

        return new Response(JSON.stringify({ message: 'No action needed' }), {
            headers: { 'Content-Type': 'application/json' },
        })

    } catch (err) {
        console.error('Error processing webhook:', err)
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 })
    }
})
