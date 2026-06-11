import { createClient } from '@supabase/supabase-js';

// Load environment variables (Make sure to run with ts-node and dotenv if needed)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || SUPABASE_URL.includes('YOUR_')) {
  console.error('❌ Missing Supabase credentials. Please provide NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function runStressTest() {
  console.log('🚀 Initiating OmniCore Resonance Stress Test...');
  const channel = supabase.channel('omni-resonance-room');

  let activeBots = 0;
  const TOTAL_BOTS = 50;
  const MESSAGES_PER_BOT = 10;
  
  channel.on('presence', { event: 'sync' }, () => {
    const newState = channel.presenceState();
    const users = Object.values(newState).flat();
    console.log(`[Presence] Current Commanders Online: ${users.length}`);
  });

  channel.subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      console.log('✅ Connected to Realtime Channel. Spawning Commander Bots...');
      
      // Spawn bots in presence
      for (let i = 0; i < TOTAL_BOTS; i++) {
        await channel.track({
          user_id: `bot_commander_${i}`,
          email: `ghost_node_${i}@omnispace.dev`,
          online_at: new Date().toISOString(),
        });
        activeBots++;
      }

      console.log(`✅ ${activeBots} Ghost Nodes spawned. Initiating Telemetry Barrage...`);

      let msgCount = 0;
      const interval = setInterval(async () => {
        if (msgCount >= TOTAL_BOTS * MESSAGES_PER_BOT) {
          clearInterval(interval);
          console.log('🛑 Stress Test Complete. Disconnecting...');
          await channel.unsubscribe();
          process.exit(0);
        }

        const type = ['TRACE', 'COMPUTE', 'SEAL', 'MEMORY'][Math.floor(Math.random() * 4)];
        const botId = Math.floor(Math.random() * TOTAL_BOTS);
        
        const payload = {
          id: crypto.randomUUID(),
          type,
          payload: `[Stress Test] Automated telemetry ping from node ${botId}`,
          timestamp: new Date().toISOString(),
          user_email: `ghost_node_${botId}@omnispace.dev`
        };

        await channel.send({
          type: 'broadcast',
          event: 'omni_event',
          payload
        });

        // Also ping the local API to persist in NCBDB
        try {
          await fetch('http://localhost:3000/api/telemetry', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        } catch (e) {
          // Ignore fetch errors during stress test if server is offline
        }

        msgCount++;
        if (msgCount % 10 === 0) {
          process.stdout.write(`⚡ Sent ${msgCount} signals...\r`);
        }
      }, 50); // 20 messages per second
    }
  });
}

runStressTest();
