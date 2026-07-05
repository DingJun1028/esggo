with open('/var/www/esggo/apps/gateway/omni-server.mjs', 'r') as f:
    content = f.read()

# Add callCloudflareAI function after callOpenRouter
cloudflare_func = """
async function callCloudflareAI(modelId, userPrompt, systemPrompt = ESG_SYSTEM_PROMPT) {
  const CF_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
  const CF_ACCOUNT = process.env.CLOUDFLARE_ACCOUNT_ID;
  if (!CF_TOKEN || !CF_ACCOUNT) throw new Error('No Cloudflare credentials');

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];

  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT}/ai/run/${modelId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CF_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages,
      max_tokens: 1024,
      temperature: 0.7,
    }),
  });

  if (!res.ok) throw new Error(`Cloudflare AI ${res.status}: ${await res.text()}`);
  const j = await res.json();
  if (!j.success) throw new Error(`Cloudflare AI error: ${JSON.stringify(j.errors)}`);
  return j.result?.response || '';
}
"""

# Insert after callOpenRouter function
lines = content.split('\n')
new_lines = []
inserted = False
for line in lines:
    new_lines.append(line)
    if 'async function callOpenRouter' in line and not inserted:
        # Find the end of callOpenRouter function and insert after it
        pass
    if line.strip() == '// ── AI Dispatcher ─────────────────────────────────────────────' and not inserted:
        new_lines.insert(-1, cloudflare_func)
        inserted = True

content = '\n'.join(new_lines)

# Now update dispatchAI to try Cloudflare after OpenRouter
old_dispatch = """  // 3. OpenRouter with skill-selected model (vision-capable)
  if (OPENROUTER_KEY) {
    try {
      const content = await callOpenRouter(model, prompt, ESG_SYSTEM_PROMPT, imageUrl);
      return { content, provider: 'OpenRouter', model };
    } catch (e) {
      console.warn('[OmniGateway] OpenRouter fallback:', e.message);
    }
  }

  // 4. Mock"""

new_dispatch = """  // 3. OpenRouter with skill-selected model (vision-capable)
  if (OPENROUTER_KEY) {
    try {
      const content = await callOpenRouter(model, prompt, ESG_SYSTEM_PROMPT, imageUrl);
      return { content, provider: 'OpenRouter', model };
    } catch (e) {
      console.warn('[OmniGateway] OpenRouter fallback:', e.message);
    }
  }

  // 4. Cloudflare AI Workers
  if (process.env.CLOUDFLARE_API_TOKEN) {
    try {
      const cfModel = '@cf/meta/llama-3.3-70b-instruct-fp16';
      const content = await callCloudflareAI(cfModel, prompt, ESG_SYSTEM_PROMPT);
      return { content, provider: 'Cloudflare AI', model: cfModel };
    } catch (e) {
      console.warn('[OmniGateway] Cloudflare AI fallback:', e.message);
    }
  }

  // 5. Mock"""

content = content.replace(old_dispatch, new_dispatch)

with open('/var/www/esggo/apps/gateway/omni-server.mjs', 'w') as f:
    f.write(content)

print('Added Cloudflare AI integration')
