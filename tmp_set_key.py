import subprocess, os, sys

key = None
with open('.env', 'r') as f:
    for line in f:
        if 'NEXT_PUBLIC_GEMINI_API_KEY=' in line and not line.startswith('#'):
            key = line.strip().split('=', 1)[1]
            break

if not key:
    print('ERROR: Key not found')
    sys.exit(1)

print('Key length:', len(key))

key_file = os.path.join(os.environ.get('TEMP', 'C:\\Temp'), 'gemini_key.txt')
with open(key_file, 'w') as f:
    f.write(key)

result = subprocess.run(
    f'type {key_file} | npx vercel env add NEXT_PUBLIC_GEMINI_API_KEY production',
    capture_output=True,
    text=True,
    timeout=120,
    shell=True
)
print('stdout:', result.stdout[:300])
print('stderr:', result.stderr[:300])
print('rc:', result.returncode)
