path = r'C:\Users\Administrator\AppData\Local\hermes\profiles\orchestrator\config.yaml'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

old = "API_SERVER_HOST: 0.0.0.0\n"
new = "API_SERVER_HOST: 0.0.0.0\nAPI_SERVER_PORT: 8642\nAPI_SERVER_KEY: 59552fc4c6b9246d392cffa07101cc8eaaf3fa0bfd2384fa2fb167f248c7ad58\n"
if old not in content:
    raise SystemExit('Target block not found')
if 'API_SERVER_PORT:' in content or 'API_SERVER_KEY:' in content:
    raise SystemExit('Keys already present')
content = content.replace(old, new, 1)
with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print('patched')
