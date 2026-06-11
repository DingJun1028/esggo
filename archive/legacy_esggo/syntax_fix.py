import re

def fix(path, rules):
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()
    for p, r in rules:
        text = re.sub(p, r, text)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(text)

fix('app/environmental/page.tsx', [
    (r"unit: 'm[^\n]*\n\s*gri:", r"unit: 'm3', hash_lock: 'valid', status: 'Trustworthy',\n    gri:"),
    (r"unit: '%[^\n]*\n\s*gri:", r"unit: '%', hash_lock: 'valid', status: 'Trustworthy',\n    gri:"),
    (r"<UniversalBadge variant=\"outline\" className=\"border-green-500/30 text-green-600 bg-green-500/5\"[^\n]*\n", r'<UniversalBadge variant="outline" className="border-green-500/30 text-green-600 bg-green-500/5">\n'),
    (r"<span className=\"ml-2 text-sm text-gray-500\">[^\n]*\n", r'<span className="ml-2 text-sm text-gray-500">單位: %</span>\n')
])

fix('app/editor/page.tsx', [
    (r"// \?\?步建\? Blue\.cc 紀\?\?\s+await fetch", r"// 同步建立 Blue.cc 紀錄\n      await fetch"),
    (r"// 同步建立 Blue.cc 紀錄\s+await fetch", r"// 同步建立 Blue.cc 紀錄\n      await fetch"),
    (r"指標名稱 \(Metric Name\)[^\n]*\n", r"指標名稱 (Metric Name)\n"),
    (r"數值 \(Value\)[^\n]*\n", r"數值 (Value)\n"),
    (r"操作 \(Actions\)[^\n]*\n", r"操作 (Actions)\n"),
    (r"unit: 'm[^\n]*\n\s*gri:", r"unit: 'm3', hash_lock: 'valid', status: 'Trustworthy',\n      gri:"),
])

fix('app/dashboard/metrics/social/page.tsx', [
    (r"<p className=\"text-sm text-gray-500 mt-1\">\n\s*員工性別比例[^\n]*\n\s*</p>", r'<p className="text-sm text-gray-500 mt-1">\n          員工性別比例\n        </p>'),
    (r"<p className=\"text-sm text-gray-500 mt-1\">員工性別比例[^\n]*", r'<p className="text-sm text-gray-500 mt-1">員工性別比例</p>')
])

fix('app/data-connect/page.tsx', [
    (r"<p className=\"text-sm text-gray-500\">\n\s*安全[^\n]*\n\s*</p>", r'<p className="text-sm text-gray-500">\n          安全\n        </p>'),
    (r"<p className=\"text-sm text-gray-500\">安全[^\n]*", r'<p className="text-sm text-gray-500">安全</p>')
])

try:
    fix('app/contracts/page.tsx', [
        (r"const mockContracts: Contract\[\] = \[\n\s*\{[^}]*\}", r"const mockContracts: Contract[] = [\n    { id: '1', title: 'Smart Contract', address: '0x123', status: 'Active', value: '100 ETH', network: 'Ethereum', createdAt: '2026-06-05' }")
    ])
except:
    pass

try:
    fix('app/dashboard/audit/page.tsx', [
        (r"const mockLogs = \[\n\s*\{[^}]*\}", r"const mockLogs = [\n    { id: '1', timestamp: '2026-06-05T00:00:00Z', level: 'info', message: 'System boot', source: 'system' }")
    ])
except:
    pass
