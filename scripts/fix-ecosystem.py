import os

env_file = '/var/www/esggo/.env'
config_file = '/var/www/esggo/ecosystem.config.cjs'

# Read .env
env = {}
with open(env_file) as f:
    for line in f:
        t = line.strip()
        if t and not t.startswith('#'):
            idx = t.find('=')
            if idx > 0:
                env[t[:idx].strip()] = t[idx+1:].strip()

# Read ecosystem config
with open(config_file) as f:
    c = f.read()

old = """env: {
        NODE_ENV: 'production',
        PORT: 3000,
      }"""

new = """env: {
        NODE_ENV: 'production',
        PORT: 3000,
        OPENROUTER_API_KEY: '""" + env.get('OPENROUTER_API_KEY','') + """',
        OPENROUTER_MODEL: '""" + env.get('AI_MODEL','google/gemma-4-31b-it:free') + """',
        GEMINI_API_KEY: '""" + env.get('GEMINI_API_KEY','') + """',
        NEXT_PUBLIC_SUPABASE_URL: '""" + env.get('NEXT_PUBLIC_SUPABASE_URL','') + """',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: '""" + env.get('NEXT_PUBLIC_SUPABASE_ANON_KEY','') + """',
        SUPABASE_SERVICE_ROLE_KEY: '""" + env.get('SUPABASE_SERVICE_ROLE_KEY','') + """',
      }"""

c = c.replace(old, new)
with open(config_file, 'w') as f:
    f.write(c)
print('Done - env vars added to ecosystem.config.cjs')
