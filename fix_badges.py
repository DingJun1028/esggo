import os
import re

app_dir = r'c:\Project\esggo\app'
count = 0
for root, _, files in os.walk(app_dir):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = content
            # Flexible regex for ShieldCheck
            new_content = re.sub(
                r'icon=\{\s*<ShieldCheck\s+size=\{12\}\s*/>\s*\}>', 
                r'><ShieldCheck size={12} className="mr-1" />', 
                new_content
            )
            # Flexible regex for Brain
            new_content = re.sub(
                r'icon=\{\s*<Brain\s+size=\{12\}\s*/>\s*\}>', 
                r'><Brain size={12} className="mr-1" />', 
                new_content
            )
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print('Fixed:', filepath)
                count += 1

print('Total files fixed:', count)
