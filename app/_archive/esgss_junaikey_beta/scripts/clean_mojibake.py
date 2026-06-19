
import os
import re

# Emojis/Status mappings
REPLACEMENTS = {
    r'⚠️': '[WARN]',
    r'🚀': '[STARTUP]',
    r'✅': '[SUCCESS]',
    r'❌': '[ERROR]',
    r'🔄': '[RETRY]',
    r'📊': '[DATA]',
    r'🛡️': '[SECURITY]',
    r'🛑': '[STOP]',
    r'📦': '[POOL]',
    r'🌌': '[CORE]',
    r'🛰️': '[OFFLINE]',
    r'?蹎?': '[ALERT]',
    r'??': '[??]',  # To be handled manually or defaulted
}

def clean_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Skipping {filepath}: {e}")
        return

    original_content = content

    # 1. Fix literal "??" or "????" that are definitely corrupted placeholders
    # In some files, these are literally saved as '??' in UTF-8.
    
    # 2. Fix specific known mojibake patterns in comments
    # We'll target comments containing a mix of high-bit garbage.
    def mojibake_fixer(match):
        line = match.group(0)
        # If the line has many non-ascii characters without valid Chinese structure, it's likely mojibake
        non_ascii = len(re.findall(r'[^\x00-\x7F]', line))
        if non_ascii > 5 and '?' in line:
            return "// [Comment Purged - Encoding Issue]"
        return line

    content = re.sub(r'//.*', mojibake_fixer, content)
    content = re.sub(r'/\*[\s\S]*?\*/', mojibake_fixer, content)

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Cleaned: {filepath}")

def main():
    target_dir = r"c:\Project\esgss_junaikey_beta\esgss_junaikey_beta\server\src"
    for root, dirs, files in os.walk(target_dir):
        for file in files:
            if file.endswith(('.ts', '.js', '.tsx')):
                clean_file(os.path.join(root, file))

if __name__ == "__main__":
    main()
