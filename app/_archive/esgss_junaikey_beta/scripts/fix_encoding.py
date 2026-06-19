
import os

file_path = r'c:\Project\esgss_junaikey_beta\task.md'
output_path = r'c:\Project\esgss_junaikey_beta\task_fixed.md'

try:
    with open(file_path, 'rb') as f:
        content = f.read()
    
    # Try decoding as CP950 (Big5)
    decoded = content.decode('cp950', errors='replace')
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(decoded)
    print("Successfully wrote fixed task to task_fixed.md")
except Exception as e:
    print(f"Error: {e}")
