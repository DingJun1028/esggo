import os

def fix_big5_in_dir(directory):
    for root, _, files in os.walk(directory):
        for f in files:
            if f.endswith('.tsx') or f.endswith('.ts'):
                path = os.path.join(root, f)
                with open(path, 'rb') as file:
                    content = file.read()
                
                try:
                    # try utf-8 first
                    content.decode('utf-8')
                except UnicodeDecodeError:
                    try:
                        # try big5
                        text = content.decode('big5')
                        with open(path, 'w', encoding='utf-8') as file:
                            file.write(text)
                        print(f"Fixed Big5 encoding in {path}")
                    except UnicodeDecodeError:
                        print(f"Could not decode {path}")

fix_big5_in_dir('app')
