import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import Stripe from 'https://esm.sh/stripe@11.16.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  apiVersion: '2022-11-15',
  httpClient: Stripe.createFetchHttpClient(),
})

const cryptoProvider = Stripe.createSubtleCryptoProvider()

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const signature = req.headers.get('Stripe-Signature')
    const body = await req.text()
    const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

    if (!signature || !endpointSecret) {
      throw new Error('Missing signature or secret')
    }

    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      endpointSecret,
      undefined,
      cryptoProvider
    )

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log(`🔔 Processing event: ${event.type}`)

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any
      const companyId = session.client_reference_id
      const customerId = session.customer
      const subscriptionId = session.subscription

      if (companyId) {
        const { error } = await supabase
          .from('company_profiles')
          .update({
            stripe_customer_id: customerId,
            subscription_status: 'active',
            subscription_tier: session.amount_total > 50000 ? 'Enterprise' : 'Pro'
          })
          .eq('company_id', companyId)

        if (error) throw error
        console.log(`✅ Subscription provisioned for company: ${companyId}`)
      }
    }

    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as any
      const customerId = subscription.customer

      const { error } = await supabase
        .from('company_profiles')
        .update({ subscription_status: 'inactive', subscription_tier: 'Free' })
        .eq('stripe_customer_id', customerId)

      if (error) throw error
      console.log(`❌ Subscription revoked for customer: ${customerId}`)
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err: any) {
    console.error(`❌ Webhook Error: ${err.message}`)
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
