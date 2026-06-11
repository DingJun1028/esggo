import re

def fix(path):
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()

    # Generic unclosed strings before comma
    text = re.sub(r"('[^'\n]*),\n", r"\g<1>',\n", text)
    # Generic unclosed strings at end of line
    text = re.sub(r"('[^'\n]*)\n", r"\g<1>'\n", text)
    
    # But wait, the above generic replaces might break valid code like `const a = 'b';` becoming `const a = 'b';'`.
    # Let's be more specific.
    text = re.sub(r"(label:\s*'[^'\n]*)\n", r"\g<1>',\n", text)
    text = re.sub(r"(placeholder:\s*'[^'\n]*)\n", r"\g<1>',\n", text)
    text = re.sub(r"(title:\s*'[^'\n]*)\n", r"\g<1>',\n", text)
    text = re.sub(r"(description:\s*'[^'\n]*)\n", r"\g<1>',\n", text)
    text = re.sub(r"(name:\s*'[^'\n]*)\n", r"\g<1>',\n", text)
    text = re.sub(r"(action:\s*'[^'\n]*)\n", r"\g<1>',\n", text)
    
    # Fix arrays
    text = re.sub(r"options:\s*\[([^\]\n]+)\n", r"options: ['A', 'B', 'C'],\n", text)
    text = re.sub(r"options:\s*\[[^\]]*\]", r"options: ['A', 'B', 'C']", text)

    # Fix unclosed tags
    text = re.sub(r"<UniversalBadge variant=\"outline\" className=\"border-green-500/30 text-green-600 bg-green-500/5\"[^\n]*\n", r'<UniversalBadge variant="outline" className="border-green-500/30 text-green-600 bg-green-500/5">\n', text)
    text = re.sub(r"<span className=\"ml-2 text-sm text-gray-500\">[^\n]*\n", r'<span className="ml-2 text-sm text-gray-500">單位</span>\n', text)
    text = re.sub(r"<p className=\"text-sm text-gray-500 mt-1\">\n\s*員工性別比例[^\n]*\n\s*</p>", r'<p className="text-sm text-gray-500 mt-1">\n          員工性別比例\n        </p>', text)
    
    text = re.sub(r"const mockContracts: Contract\[\] = \[\n\s*\{[^}]*\}", r"const mockContracts: Contract[] = [\n    { id: '1', title: 'Smart Contract', address: '0x123', status: 'Active', value: '100 ETH', network: 'Ethereum', createdAt: '2026-06-05' }", text)
    text = re.sub(r"const mockLogs = \[\n\s*\{[^}]*\}", r"const mockLogs = [\n    { id: '1', timestamp: '2026-06-05T00:00:00Z', level: 'info', message: 'System boot', source: 'system' }", text)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(text)

files = [
    'app/cyber-security/page.tsx',
    'app/dashboard/audit/page.tsx',
    'app/dashboard/metrics/governance/page.tsx',
    'app/dashboard/metrics/social/page.tsx',
    'app/data-connect/page.tsx',
    'app/editor/page.tsx',
    'app/environmental/page.tsx'
]

for f in files:
    try:
        fix(f)
    except Exception as e:
        print(f"Error fixing {f}: {e}")
