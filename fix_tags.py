import re
import os

def fix(path):
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()

    # Catch ANY missing < before /tag> that is immediately following a CJK or ? character
    text = re.sub(r"([^\s<A-Za-z0-9])/(p|div|span|h[1-6]|button|Universal[a-zA-Z]+|td|tr|th|table|thead|tbody)>", r"\g<1></\g<2>>", text)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(text)

for root, _, files in os.walk('app'):
    for f in files:
        if f.endswith('.tsx') or f.endswith('.ts'):
            fix(os.path.join(root, f))
