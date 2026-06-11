import os

def clean_utf8_in_dir(directory):
    count = 0
    for root, _, files in os.walk(directory):
        for f in files:
            if f.endswith('.tsx') or f.endswith('.ts'):
                path = os.path.join(root, f)
                with open(path, 'rb') as file:
                    data = file.read()
                
                try:
                    data.decode('utf-8')
                    # Valid utf-8, check for null bytes
                    if b'\x00' in data:
                        text = data.replace(b'\x00', b'').decode('utf-8')
                        with open(path, 'w', encoding='utf-8') as f_out:
                            f_out.write(text)
                        count += 1
                except UnicodeDecodeError:
                    # Corrupted utf-8 or big5
                    try:
                        text = data.decode('big5')
                    except UnicodeDecodeError:
                        text = data.decode('utf-8', errors='ignore')
                    
                    text = text.replace('\x00', '')
                    with open(path, 'w', encoding='utf-8') as f_out:
                        f_out.write(text)
                    count += 1
    print(f"Fixed {count} files.")

clean_utf8_in_dir('app')
