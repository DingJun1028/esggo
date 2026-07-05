import re

with open('/var/www/esggo/apps/gateway/omni-server.mjs', 'r') as f:
    content = f.read()

# Fix the malformed import - find the broken line and replace it
lines = content.split('\n')
new_lines = []
for line in lines:
    if "from './model-router.mjs" in line and "setupReportRoutes" in line:
        # This is the malformed line, split it into two proper imports
        new_lines.append("import { inferTaskType, routeModel, formatRoutingResult } from './model-router.mjs';")
        new_lines.append("import { setupReportRoutes } from './esg-report.mjs';")
    else:
        new_lines.append(line)

content = '\n'.join(new_lines)

with open('/var/www/esggo/apps/gateway/omni-server.mjs', 'w') as f:
    f.write(content)

print('Fixed imports')
