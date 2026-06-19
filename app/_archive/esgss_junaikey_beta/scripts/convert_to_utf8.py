
import os

def convert_to_utf8(file_path):
    # Try different encodings
    encodings = ['utf-16', 'utf-16le', 'utf-16be', 'big5', 'gbk', 'utf-8']
    
    content = None
    for enc in encodings:
        try:
            with open(file_path, 'rb') as f:
                raw_data = f.read()
                content = raw_data.decode(enc)
            print(f"Successfully read {file_path} as {enc}")
            break
        except Exception:
            continue
            
    if content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Converted {file_path} to UTF-8")
    else:
        print(f"Failed to decode {file_path} with known encodings")

if __name__ == "__main__":
    convert_to_utf8("c:/Project/esgss_junaikey_beta/test_output.txt")
