with open('/var/www/esggo/apps/gateway/omni-server.mjs', 'r') as f:
    content = f.read()

with open('/var/www/esggo/apps/gateway/report-routes-inline.js', 'r') as f:
    routes = f.read()

# Find the line with app.get('/health' and insert routes after it
lines = content.split('\n')
new_lines = []
inserted = False

for line in lines:
    new_lines.append(line)
    if "app.get('/health'" in line and not inserted:
        new_lines.append('')
        new_lines.append('// ═══════════════════════════════════════════════════════════════')
        new_lines.append('// ESG Report Routes')
        new_lines.append('// ═══════════════════════════════════════════════════════════════')
        new_lines.append(routes)
        new_lines.append('')
        inserted = True

with open('/var/www/esggo/apps/gateway/omni-server.mjs', 'w') as f:
    f.write('\n'.join(new_lines))

print('Inserted report routes')
