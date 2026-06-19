import os

def unmangle_file(filepath):
    try:
        # Read the file assuming it has the "UTF-8 bytes as UTF-16LE characters" corruption
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if file looks like it needs unmangling
        # The typical sign is seeing the Mojibake characters like '‣' (from '# ') or '獇' (from 'Gs')
        # or just low-ascii text appearing as CJK characters.
        # But to be safe, we try to encode-decode and see if it looks "more ASCII-like" or has expected headers.
        
        try:
            raw_bytes = content.encode('utf-16-le')
            # Use 'replace' to handle any bytes that were mangled beyond validity
            restored = raw_bytes.decode('utf-8', errors='replace')
        except UnicodeError:
            # If conversion fails completely, skip
            print(f"Skipping {filepath}: Conversion failed")
            return

        # Simple heuristic: If restored content contains "ESG" or "# " or "## " while original didn't (or looked like CJK), it's a win.
        # Or if original was valid Chinese, this transformation would turn it into garbage bytes.
        # So we want to be sure.
        
        # Original corrupted README started with '‣'
        # Restored starts with '#'
        if '‣' in content[:10] or '獇' in content[:100] or (not content.startswith('#') and restored.startswith('#')):
            print(f"Restoring {filepath}...")
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(restored)
        else:
            print(f"Skipping {filepath}: Doesn't look like known Mojibake (Start: {content[:10]!r})")

    except Exception as e:
        print(f"Error processing {filepath}: {e}")

def main():
    directory = '.'
    for root, dirs, files in os.walk(directory):
        if 'node_modules' in root or '.git' in root or 'dist' in root or '.gemini' in root:
            continue
        for file in files:
            if file.endswith('.md'):
                filepath = os.path.join(root, file)
                unmangle_file(filepath)

if __name__ == "__main__":
    main()
