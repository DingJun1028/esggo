import os
import re

def fix_file(path):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # 1. Replace catch (e: any) with catch (e: unknown)
        content = re.sub(r'catch\s*\((.*?):\s*any\)', r'catch (\1: unknown)', content)
        
        # 2. Replace : any with : unknown (common cases)
        # We target function params and property declarations
        content = re.sub(r':\s*any\b(?!\s*\[)', ': unknown', content)
        
        # 3. Replace any[] with unknown[]
        content = re.sub(r'any\[\]', 'unknown[]', content)
        
        # 4. Specific known fixes
        if 'soul.ts' in path:
             # Next.js module assign fix
             content = content.replace('module =', '_module =')
        
        if content != original_content:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
    except Exception as e:
        print(f"Error fixing {path}: {e}")
    return False

def main():
    fixed_count = 0
    for root, dirs, files in os.walk('.'):
        # Skip ignored directories
        if any(ignored in root for ignored in ['node_modules', '.next', '.firebase', '.vercel', 'src/dataconnect-generated', 'src/dataconnect-admin-generated']):
            continue
            
        for file in files:
            if file.endswith('.ts') or file.endswith('.tsx'):
                path = os.path.join(root, file)
                if fix_file(path):
                    fixed_count += 1
    
    print(f"Purification complete. Modified {fixed_count} files.")

if __name__ == "__main__":
    main()
