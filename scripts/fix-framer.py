#!/usr/bin/env python3
"""Batch replace framer-motion with CSS transitions."""
import re
import glob

ALL_TAGS = ['div','span','section','article','header','footer','main','nav','aside',
            'ul','li','p','a','button','form','table','tr','td','th','tbody','thead',
            'figure','figcaption','blockquote','pre','code','hr','img','video','audio',
            'canvas','svg','path','circle','rect','line']

def fix_file(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    if "framer-motion" not in content:
        return False
    orig = content

    # 1. Remove ALL framer-motion imports
    content = re.sub(r"import\s+.*from\s+'framer-motion';\n?", "", content)

    # 2. Replace <motion.X ...> with <X ...>
    for tag in ALL_TAGS:
        # <motion.tag attrs> -> <tag attrs> (with transition added if className exists)
        def replacer(m, _tag=tag):
            attrs = m.group(1) or ""
            if 'className="' in attrs:
                attrs = attrs.replace('className="', 'className="transition-all duration-300 ')
                return f'<{_tag}{attrs}>'
            elif attrs:
                return f'<{_tag} className="transition-all duration-300"{attrs}>'
            return f'<{_tag} className="transition-all duration-300">'
        content = re.sub(rf'<motion\.{tag}(\s[^>]*)>', replacer, content)
        content = re.sub(rf'<motion\.{tag}>', f'<{tag} className="transition-all duration-300">', content)

    # 3. Replace closing tags
    for tag in ALL_TAGS:
        content = content.replace(f'</motion.{tag}>', f'</{tag}>')

    # 4. Remove AnimatePresence
    content = re.sub(r'<AnimatePresence[^>]*>', '', content)
    content = content.replace('</AnimatePresence>', '')

    if content != orig:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        return True
    return False

files = [f for f in glob.glob("app/**/page.tsx", recursive=True) if "node_modules" not in f]
fixed = 0
for fp in files:
    try:
        if fix_file(fp):
            print(f"Fixed: {fp}")
            fixed += 1
    except Exception as e:
        print(f"ERR: {fp} - {e}")
print(f"\nTotal fixed: {fixed}")
