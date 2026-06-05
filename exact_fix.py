import os

def fix(path):
    with open(path, 'r', encoding='utf-8', errors='replace') as f:
        text = f.read()
        
    old_text = text

    if 'data-connect' in path:
        text = text.replace("name: '???\u7a31 (Name)', placeholder:", "name: 'Name', placeholder:")
        text = text.replace("name: '???(URL)',", "name: 'URL',")
        text = text.replace("name: '?? (Token)', type:", "name: 'Token', type:")
        text = text.replace("} ?/p>", "}</p>")

    if 'metrics' in path and 'social' in path:
        text = text.replace("} ?/p>", "}</p>")
        text = text.replace("</UniversalBadge>\n      )\n    ) },", "</UniversalBadge>\n      )\n    } },")

    if 'audit' in path:
        text = text.replace("}','", "},")
        text = text.replace("}'\n", "}\n")

    if 'cyber-security' in path:
        text = text.replace("description: '????????????????,", "description: 'protocol',")
        text = text.replace("title: '??????(Incident Response)',", "title: 'Incident Response',")
        
    if 'editor' in path:
        text = text.replace("source_origin: 'Auto-Agent' }','", "source_origin: 'Auto-Agent' },")
        text = text.replace("source_origin: 'Manual' }','", "source_origin: 'Manual' },")
        text = text.replace("source_origin: 'System' }','", "source_origin: 'System' },")
        text = text.replace("console.error('Fetch Error:', e);'", "console.error('Fetch Error:', e);")
        text = text.replace('title="5T ????', 'title="5T Integrity"')
        text = text.replace('title="\ufffd~??????', 'title="System Sync"')
        text = text.replace('title="~??????', 'title="System Sync"')

    if 'environmental' in path:
        text = text.replace("label: '????(Metric Name)',", "label: 'Metric Name',")
        text = text.replace("options: ['??, '?, 'kWh', '%', '??],", "options: ['A','B','C'],")
        text = text.replace("??????/UniversalBadge>", "??????</UniversalBadge>")
        text = text.replace("?/UniversalBadge>", "</UniversalBadge>")
        text = text.replace("?/span>", "</span>")
        text = text.replace("?/UniversalButton>", "</UniversalButton>")

    if old_text != text:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(text)

for root, _, files in os.walk('app'):
    for f in files:
        if f.endswith('.tsx') or f.endswith('.ts'):
            fix(os.path.join(root, f))
