import os
import shutil

WIKI_DIR = r"c:\Project\esggo\esggo\docs\wiki_archive"

def decode_filename(filename):
    try:
        # Try to encode as utf-8, then decode as big5 (sometimes terminal output does this)
        # Or maybe it's just big5 strings that got interpreted as utf-8 and then saved?
        # Let's just try to read the content and give it a good name based on the content or prefix.
        if '-' in filename:
            return filename.split('-')[0] + '.md'
        return filename
    except Exception as e:
        return filename

for f in os.listdir(WIKI_DIR):
    if not f.endswith('.md'):
        continue
    filepath = os.path.join(WIKI_DIR, f)
    
    # Try reading as Big5
    try:
        with open(filepath, 'rb') as file:
            content_bytes = file.read()
        
        # skip if already utf8?
        try:
            content_str = content_bytes.decode('utf-8')
            # It's already utf-8
        except UnicodeDecodeError:
            # Decode as Big5
            content_str = content_bytes.decode('big5', errors='replace')
        
        # Some prefixes
        prefix = f.split('-')[0] if '-' in f else 'Doc'
        if f == 'Home.md':
            new_name = 'Home.md'
        elif '5T' in f:
            new_name = '5T-Protocol.md'
        elif f.startswith('AI-Platform'):
            new_name = 'AI-Platform.md'
        elif f.startswith('API-Setup'):
            new_name = 'API-Setup.md'
        elif f.startswith('Academy'):
            new_name = 'Academy.md'
        elif f.startswith('Advisors'):
            new_name = 'Advisors.md'
        elif f.startswith('Advisory'):
            new_name = 'Advisory.md'
        elif f.startswith('Agents'):
            new_name = 'Agents.md'
        elif f.startswith('Audit-Log'):
            new_name = 'Audit-Log.md'
        elif f.startswith('Audit-Verify'):
            new_name = 'Audit-Verify.md'
        elif f.startswith('Consulting'):
            new_name = 'Consulting.md'
        elif f.startswith('Digital-Twin'):
            new_name = 'Digital-Twin.md'
        elif f.startswith('Environmental'):
            new_name = 'Environmental.md'
        elif f.startswith('Finance'):
            new_name = 'Finance.md'
        elif f.startswith('Governance'):
            new_name = 'Governance.md'
        elif f.startswith('Health-Check'):
            new_name = 'Health-Check.md'
        elif f.startswith('Intelligence'):
            new_name = 'Intelligence.md'
        elif f.startswith('Library'):
            new_name = 'Library.md'
        elif f.startswith('Materiality'):
            new_name = 'Materiality.md'
        elif f.startswith('Profile'):
            new_name = 'Profile.md'
        elif f.startswith('Publish'):
            new_name = 'Publish.md'
        elif f.startswith('Reading-Room'):
            new_name = 'Reading-Room.md'
        elif f.startswith('Roadmap'):
            new_name = 'Roadmap.md'
        elif f.startswith('Social'):
            new_name = 'Social.md'
        elif f.startswith('Stakeholders'):
            new_name = 'Stakeholders.md'
        elif f.startswith('Supply-Chain'):
            new_name = 'Supply-Chain.md'
        elif f.startswith('SustainWrite'):
            new_name = 'SustainWrite.md'
        elif f.startswith('System-Test'):
            new_name = 'System-Test.md'
        elif f.startswith('Tasks'):
            new_name = 'Tasks.md'
        elif f.startswith('Templates'):
            new_name = 'Templates.md'
        elif f.startswith('Vault'):
            new_name = 'Vault.md'
        else:
            new_name = 'Misc-' + f.split('.')[0][-5:] + '.md'
            
        new_filepath = os.path.join(WIKI_DIR, new_name)
        
        with open(new_filepath, 'w', encoding='utf-8') as file:
            file.write(content_str)
            
        if f != new_name:
            os.remove(filepath)
            print(f"Renamed and converted {f} to {new_name}")
        else:
            print(f"Converted {f}")
            
    except Exception as e:
        print(f"Failed to process {f}: {e}")
