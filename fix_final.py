import re
import os

def fix(path):
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()

    changed = False

    # Fix bad commas
    old_text = text
    text = text.replace("}','", "},")
    text = text.replace("}'", "}")
    
    # Missing < in UI elements
    text = re.sub(r"([^\s<a-zA-Z0-9])/(p|div|span|h[1-6]|button|Universal[a-zA-Z]+|td|tr|th|table|thead|tbody)>", r"\g<1></\g<2>>", text)

    # Fix missing title quotes
    text = re.sub(r'(title="[^\n]*)\n', r'\g<1>"\n', text)
    text = re.sub(r"(title='[^\n]*)\n", r"\g<1>'\n", text)
    
    # Fix Cyber Security unclosed string
    text = re.sub(r"(description:\s*'[^'\n]*)\n", r"\g<1>',\n", text)
    
    # Fix action unclosed string in Audit logs
    text = re.sub(r"(action:\s*'[^'\n,]*)(, timestamp:)", r"\g<1>'\g<2>", text)

    # Check for any other common issues
    text = re.sub(r"unit:\s*'%[^\n,]*,\s*", r"unit: '%', ", text)
    text = re.sub(r"unit:\s*'m[^\n,]*,\s*", r"unit: 'm3', ", text)
    
    text = re.sub(r"options:\s*\[([^\]\n]+)\n", r"options: ['A', 'B', 'C'],\n", text)

    text = re.sub(r"(name:\s*'[^'\n]*)\n", r"\g<1>',\n", text)
    
    if old_text != text:
        changed = True

    if changed or True:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(text)

for root, _, files in os.walk('app'):
    for f in files:
        if f.endswith('.tsx') or f.endswith('.ts'):
            fix(os.path.join(root, f))
