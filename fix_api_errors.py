import os
import re

patterns = [
    (re.compile(r'catch\s*\((error|err|e|err2|e2|error2)\s*:\s*unknown\)'), r'catch (\1: any)'),
]

root_dir = r'C:\Project\esggo\esggo\app\api'

for root, dirs, files in os.walk(root_dir):
    for file in files:
        if file.endswith('.ts'):
            file_path = os.path.join(root, file)
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = content
            for pattern, replacement in patterns:
                new_content = pattern.sub(replacement, new_content)
            
            if new_content != content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Fixed: {file_path}")
