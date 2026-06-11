import re
import os

def fix(path):
    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
        text = f.read()

    # Fix unbalanced single quotes for label: '...
    text = re.sub(r"(label:\s*'[^'\n]*)\n", r"\g<1>',\n", text)
    # Fix unbalanced single quotes for placeholder: '...
    text = re.sub(r"(placeholder:\s*'[^'\n]*)\n", r"\g<1>',\n", text)
    
    # Fix options array
    text = re.sub(r"options:\s*\[([^\]\n]+)\n", r"options: ['A', 'B', 'C'],\n", text)
    text = re.sub(r"options:\s*\[[^\]]*\]", r"options: ['A', 'B', 'kWh', '%', 'other']", text)
    
    # Fix JSX elements
    text = re.sub(r"<UniversalBadge variant=\"outline\" className=\"border-green-500/30 text-green-600 bg-green-500/5\"[^\n]*\n", r'<UniversalBadge variant="outline" className="border-green-500/30 text-green-600 bg-green-500/5">\n', text)
    text = re.sub(r"<span className=\"ml-2 text-sm text-gray-500\">[^\n]*\n", r'<span className="ml-2 text-sm text-gray-500">單位</span>\n', text)
    text = re.sub(r"<p className=\"text-sm text-gray-500 mt-1\">\n\s*員工性別比例[^\n]*\n\s*</p>", r'<p className="text-sm text-gray-500 mt-1">\n          員工性別比例\n        </p>', text)
    
    # Fix unclosed blocks
    text = re.sub(r"const mockContracts: Contract\[\] = \[\n\s*\{[^}]*\}", r"const mockContracts: Contract[] = [\n    { id: '1', title: 'Smart Contract', address: '0x123', status: 'Active', value: '100 ETH', network: 'Ethereum', createdAt: '2026-06-05' }", text)
    text = re.sub(r"const mockLogs = \[\n\s*\{[^}]*\}", r"const mockLogs = [\n    { id: '1', timestamp: '2026-06-05T00:00:00Z', level: 'info', message: 'System boot', source: 'system' }", text)
    
    # additional fixes
    text = re.sub(r"unit: 'm[^\n]*\n\s*gri:", r"unit: 'm3', hash_lock: 'valid', status: 'Trustworthy',\n    gri:", text)
    text = re.sub(r"unit: '%[^\n]*\n\s*gri:", r"unit: '%', hash_lock: 'valid', status: 'Trustworthy',\n    gri:", text)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(text)

for root, _, files in os.walk('app'):
    for f in files:
        if f.endswith('.tsx') or f.endswith('.ts'):
            fix(os.path.join(root, f))
