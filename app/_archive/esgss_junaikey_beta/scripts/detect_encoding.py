
import os

file_path = r'c:\Project\esgss_junaikey_beta\task.md'
encodings = ['utf-8', 'big5', 'gbk', 'utf-16', 'utf-16-le', 'utf-16-be', 'cp950']

with open(file_path, 'rb') as f:
    raw_data = f.read(2000)

for enc in encodings:
    print(f"--- Testing {enc} ---")
    try:
        content = raw_data.decode(enc)
        print(content[:500])
    except Exception as e:
        print(f"Failed with {enc}: {e}")
    print("\n")
