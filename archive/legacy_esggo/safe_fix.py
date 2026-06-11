import re

def safe_fix(path):
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()

    # Fix unclosed strings ending in Chinese placeholders
    text = re.sub(r"(label:\s*'[^'\n]*)\n", r"\g<1>',\n", text)
    text = re.sub(r"(placeholder:\s*'[^'\n]*)\n", r"\g<1>',\n", text)
    
    # Fix array options
    text = re.sub(r"options:\s*\[([^\]\n]+)\n", r"options: ['A', 'B', 'C'],\n", text)
    text = re.sub(r"options:\s*\[[^\]]*\]", r"options: ['kg', 'L', 'kWh', '%', 'other']", text)
    
    # Fix unit with unclosed quote
    text = re.sub(r"unit:\s*'[^',\n]*,\s*hash_lock:", r"unit: 'unit', hash_lock:", text)

    # Fix unclosed JSX tags
    text = text.replace('<UniversalBadge variant="outline" className="border-green-500/30 text-green-600 bg-green-500/5" \xef\xbf\xbd', '<UniversalBadge variant="outline" className="border-green-500/30 text-green-600 bg-green-500/5">')
    text = re.sub(r'<UniversalBadge variant="outline" className="[^"]*"[^>\n]*\n', '<UniversalBadge variant="outline" className="border-green-500/30 text-green-600 bg-green-500/5">\n', text)
    
    text = re.sub(r'<span className="ml-2 text-sm text-gray-500">[^<\n]*\n', '<span className="ml-2 text-sm text-gray-500">單位</span>\n', text)
    
    text = re.sub(r'<p className="text-sm text-gray-500 mt-1">\n\s*員工性別比例[^\n]*\n\s*</p>', '<p className="text-sm text-gray-500 mt-1">\n          員工性別比例\n        </p>', text)
    
    text = re.sub(r'<UniversalButton variant="ghost" size="sm" className="text-gray-400 hover:text-white"[^>\n]*\n', '<UniversalButton variant="ghost" size="sm" className="text-gray-400 hover:text-white">\n', text)
    
    # Editor specific unclosed `label:`
    text = re.sub(r"\{\s*key:\s*'[^']+',\s*label:\s*'[^'\n]+\n", r"{ key: 'key', label: 'label' },\n", text)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(text)

safe_fix('app/editor/page.tsx')
safe_fix('app/environmental/page.tsx')
