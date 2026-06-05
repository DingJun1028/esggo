import os
import re

def fix_file(path, replacements):
    try:
        with open(path, 'rb') as f:
            content = f.read()
            
        # strip BOM
        if content.startswith(b'\xef\xbb\xbf'):
            content = content[3:]
        if content.startswith(b'\xff\xfe'):
            content = content.decode('utf-16-le').encode('utf-8')
            
        text = content.decode('utf-8', errors='replace')
        
        for p, r in replacements:
            text = re.sub(p, r, text)
            
        with open(path, 'w', encoding='utf-8') as f:
            f.write(text)
        print(f"Fixed {path}")
    except Exception as e:
        print(f"Error {path}: {e}")

fix_file('app/environmental/page.tsx', [
    (r"unit: 'm[^\']*, hash_lock", r"unit: 'm3', hash_lock"),
    (r"unit: 'm\?.*?, hash_lock", r"unit: 'm3', hash_lock")
])

fix_file('app/editor/page.tsx', [
    (r"// \?\?步建\? Blue\.cc 紀\?\?\s*await fetch", r"// 同步建立 Blue.cc 紀錄\n      await fetch"),
    (r"\?\?\?稱 \(Metric Name\)", r"指標名稱 (Metric Name)"),
    (r"\?\?\(Value\)", r"數值 (Value)"),
    (r"\?\? \(Actions\)", r"操作 (Actions)"),
    (r"unit: 'm[^\']*, hash_lock", r"unit: 'm3', hash_lock")
])

fix_file('app/dashboard/metrics/social/page.tsx', [
    (r"<p className=\"text-sm text-gray-500 mt-1\">\n\s*員工性別比例.*\n\s*</p>", r'<p className="text-sm text-gray-500 mt-1">\n          員工性別比例\n        </p>'),
    (r"<p.*?員工性別比例.*?", r'<p className="text-sm text-gray-500 mt-1">員工性別比例</p>')
])

fix_file('app/data-connect/page.tsx', [
    (r"<p className=\"text-sm text-gray-500\">\n\s*安全.*\n\s*</p>", r'<p className="text-sm text-gray-500">\n          安全\n        </p>'),
    (r"<p.*?安全.*?", r'<p className="text-sm text-gray-500">安全</p>')
])
