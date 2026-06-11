import re
import os

def aggressive_fix(path):
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()

    # 1. Unclosed single quotes with nothing else on the line
    text = re.sub(r"(label:\s*'[^'\n]*)\n", r"\g<1>',\n", text)
    text = re.sub(r"(placeholder:\s*'[^'\n]*)\n", r"\g<1>',\n", text)
    text = re.sub(r"(title:\s*'[^'\n]*)\n", r"\g<1>',\n", text)
    text = re.sub(r"(description:\s*'[^'\n]*)\n", r"\g<1>',\n", text)
    text = re.sub(r"(name:\s*'[^'\n]*)\n", r"\g<1>',\n", text)
    text = re.sub(r"(unit:\s*'[^'\n]*)\n", r"\g<1>',\n", text)
    text = re.sub(r"(color:\s*'[^'\n]*)\n", r"\g<1>',\n", text)
    text = re.sub(r"(trend:\s*'[^'\n]*)\n", r"\g<1>',\n", text)

    # 2. Unclosed string literals before comma
    text = re.sub(r"('[^'\n]*),\n", r"\g<1>',\n", text)

    # 3. Bad arrays like options: ['A', 'B 
    text = re.sub(r"options:\s*\[([^\]\n]+)\n", r"options: ['A', 'B', 'C'],\n", text)
    text = re.sub(r"options:\s*\[[^\]]*\]", r"options: ['A', 'B', 'C']", text)

    # 4. Bad JSX tags (unclosed quotes or tags)
    text = re.sub(r"<UniversalBadge variant=\"outline\" className=\"border-green-500/30 text-green-600 bg-green-500/5\"[^\n]*\n", r'<UniversalBadge variant="outline" className="border-green-500/30 text-green-600 bg-green-500/5">\n', text)
    text = re.sub(r"<UniversalBadge variant=\"outline\" className=\"[^\"]*\"\s*[^>]*\n", r'<UniversalBadge variant="outline" className="border-green-500/30">\n', text)
    text = re.sub(r"<span className=\"ml-2 text-sm text-gray-500\">[^\n]*\n", r'<span className="ml-2 text-sm text-gray-500">單位</span>\n', text)
    text = re.sub(r"<p className=\"text-sm text-gray-500 mt-1\">\n\s*員工性別比例[^\n]*\n\s*</p>", r'<p className="text-sm text-gray-500 mt-1">\n          員工性別比例\n        </p>', text)
    
    # 5. Fix arrays with unclosed objects
    text = re.sub(r"const mockContracts: Contract\[\] = \[\n\s*\{[^}]*\}", r"const mockContracts: Contract[] = [\n    { id: '1', title: 'Smart Contract', address: '0x123', status: 'Active', value: '100 ETH', network: 'Ethereum', createdAt: '2026-06-05' }", text)
    text = re.sub(r"const mockLogs = \[\n\s*\{[^}]*\}", r"const mockLogs = [\n    { id: '1', timestamp: '2026-06-05T00:00:00Z', level: 'info', message: 'System boot', source: 'system' }", text)

    # 6. Any remaining `unit: 'm...`
    text = re.sub(r"unit:\s*'m[^\n,]*,\s*", r"unit: 'm3', ", text)
    text = re.sub(r"unit:\s*'%[^\n,]*,\s*", r"unit: '%', ", text)
    
    # 7. Unclosed `{ key: '...', label: '...` in editor/page.tsx
    text = re.sub(r"\{\s*key:\s*'[^']+',\s*label:\s*'[^'\n]+\n", r"{ key: 'key', label: 'label' },\n", text)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(text)

for root, _, files in os.walk('app'):
    for f in files:
        if f.endswith('.tsx') or f.endswith('.ts'):
            try:
                aggressive_fix(os.path.join(root, f))
            except:
                pass
