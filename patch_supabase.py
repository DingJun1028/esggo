import os
import glob
import re

def patch_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    
    # Common pattern: createClient(process.env.NEXT_PUBLIC_SUPABASE_URL...
    # Replace process.env.NEXT_PUBLIC_SUPABASE_URL! or process.env.NEXT_PUBLIC_SUPABASE_URL with (process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://esggo.supabase.co')
    # but be careful not to nest it multiple times.
    
    content = re.sub(r"process\.env\.(NEXT_PUBLIC_SUPABASE_URL|SUPABASE_URL)(?!\s*\|\|)(!?)(?!\s*'https)", r"(process.env.\1 || 'https://esggo.supabase.co')", content)
    
    content = re.sub(r"process\.env\.(SUPABASE_SERVICE_ROLE_KEY|NEXT_PUBLIC_SUPABASE_ANON_KEY)(?!\s*\|\|)(!?)(?!\s*'dummy')", r"(process.env.\1 || 'dummy-key')", content)
    
    # Also patch if they did: const supabaseUrl = process.env['NEXT_PUBLIC_SUPABASE_URL'] || '';
    content = re.sub(r"process\.env\['NEXT_PUBLIC_SUPABASE_URL'\] \|\| ''", r"process.env['NEXT_PUBLIC_SUPABASE_URL'] || 'https://esggo.supabase.co'", content)
    content = re.sub(r"process\.env\['SUPABASE_SERVICE_ROLE_KEY'\] \|\| process\.env\['NEXT_PUBLIC_SUPABASE_ANON_KEY'\] \|\| ''", r"process.env['SUPABASE_SERVICE_ROLE_KEY'] || process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] || 'dummy-key'", content)
    
    # if it has "supabaseUrl, supabaseKey" and they are empty strings
    content = re.sub(r"const supabaseUrl = process\.env\.NEXT_PUBLIC_SUPABASE_URL \|\| '';", r"const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://esggo.supabase.co';", content)
    content = re.sub(r"const supabaseKey = process\.env\.SUPABASE_SERVICE_ROLE_KEY \|\| process\.env\.NEXT_PUBLIC_SUPABASE_ANON_KEY \|\| '';", r"const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-key';", content)

    # Some use: createClient(url, key) where url is empty
    # Let's just fix the variables.
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Patched {filepath}")

for root, dirs, files in os.walk('c:\\Project\\esggo\\app\\api'):
    for file in files:
        if file.endswith('.ts') or file.endswith('.tsx'):
            patch_file(os.path.join(root, file))
