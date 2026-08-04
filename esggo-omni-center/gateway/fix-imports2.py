import re

with open('/var/www/esggo/apps/gateway/omni-server.mjs', 'r') as f:
    content = f.read()

# Remove all the broken import lines and replace with clean ones
# Find the section with imports
lines = content.split('\n')
new_lines = []
skip_next = False
imports_added = False

for i, line in enumerate(lines):
    if skip_next:
        skip_next = False
        continue
    
    # Skip lines that are broken model-router imports
    if 'import { inferTaskType' in line and './model-router.mjs' in line and not line.strip().endswith("';"):
        continue
    if 'import { setupReportRoutes' in line and not line.strip().endswith("';"):
        continue
    
    # Skip duplicate imports
    if 'import { inferTaskType' in line and imports_added:
        continue
    if 'import { setupReportRoutes' in line and imports_added:
        continue
    
    new_lines.append(line)
    
    # Add our imports after the last existing import
    if not imports_added and line.strip().startswith('import') and i > 20:
        # Check if next line is also an import
        if i + 1 < len(lines) and not lines[i + 1].strip().startswith('import'):
            new_lines.append("import { inferTaskType, routeModel, formatRoutingResult } from './model-router.mjs';")
            new_lines.append("import { setupReportRoutes } from './esg-report.mjs';")
            imports_added = True

content = '\n'.join(new_lines)

with open('/var/www/esggo/apps/gateway/omni-server.mjs', 'w') as f:
    f.write(content)

print('Fixed imports')
