import re
import os

def clean_binary(path):
    with open(path, 'rb') as f:
        data = f.read()
    if b'\x00' in data:
        data = data.replace(b'\x00', b'')
        with open(path, 'wb') as f:
            f.write(data)

for root, _, files in os.walk('app'):
    for f in files:
        if f.endswith('.tsx') or f.endswith('.ts'):
            clean_binary(os.path.join(root, f))
