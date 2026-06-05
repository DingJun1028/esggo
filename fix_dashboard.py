import re

with open('app/dashboard/page.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Add imports
imports_to_add = """
import { IAtomicComponent, atomicManager } from '@/lib/design-system/atomic-core';
import { UniversalToggle } from '@/components/ui/universal/UniversalToggle';
"""
text = text.replace("import { getUniversalNotesAction", imports_to_add + "import { getUniversalNotesAction")

# Replace Atomic components in JSX
text = re.sub(r'<Atomic', '<Universal', text)
text = re.sub(r'</Atomic', '</Universal', text)

with open('app/dashboard/page.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
