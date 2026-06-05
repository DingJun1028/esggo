import os
import re

fixes = {
    # audit logs
    "action: 'GRI[302-1] ??????, timestamp:": "action: 'GRI[302-1] sync', timestamp:",
    "action: '跨部? HR D&I ???, timestamp:": "action: 'HR D&I', timestamp:",
    "action: '????決議?????, timestamp:": "action: 'Resolution', timestamp:",
    "action: '???ESG ?變更', timestamp:": "action: 'ESG update', timestamp:",
    
    # cyber security
    "title: '??????(Incident Response)',": "title: 'Incident Response',",
    "description: '????????????????,": "description: 'Incident response protocol',",
    
    # environmental
    "label: '????(Metric Name)',": "label: 'Metric Name',",
    "placeholder: 'e.g. ???????',": "placeholder: 'e.g. value',",
    "label: '??(Value)',": "label: 'Value',",
    "label: '?? (Unit)',": "label: 'Unit',",
    "options: ['??, '?, 'kWh', '%', '??],": "options: ['kg', 'L', 'kWh', '%', 'other'],",
    "label: '?? (Date)' },": "label: 'Date' },",
    "label: '????(Metric Name)' },": "label: 'Metric Name' },",
    "label: '??(Value)' },": "label: 'Value' },",
    "label: '?? (Unit)' },": "label: 'Unit' },",
    "label: '??稱 (Name)' },": "label: 'Name' },",
    "label: '?? (Actions)' },": "label: 'Actions' },",
    
    # data connect
    "name: '???稱 (Name)', placeholder:": "name: 'Name', placeholder:",
    "placeholder: 'e.g. Supabase ??',": "placeholder: 'e.g. Supabase',",
    "name: '???(URL)',": "name: 'URL',",
    "placeholder: 'https://...',": "placeholder: 'https://...',",
    "name: '?? (Token)', type:": "name: 'Token', type:",
}

def fix(path):
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()

    changed = False
    for bad, good in fixes.items():
        if bad in text:
            text = text.replace(bad, good)
            changed = True
            
    # Fix broken strings that span lines
    text = re.sub(r"label: '\?\?\?稱 \(Metric Name\)\n", "label: 'Metric Name',\n", text)
    text = re.sub(r"label: '\?\?\(Value\)\n", "label: 'Value',\n", text)
    text = re.sub(r"label: '\?\? \(Actions\)\n", "label: 'Actions',\n", text)
    
    text = re.sub(r"options: \['\?\?', '\?', 'kWh', '%', '\?\?'\],", "options: ['kg', 'L', 'kWh', '%', 'other'],", text)
    text = re.sub(r"label: '\?\?\?\?\(Metric Name\)',", "label: 'Metric Name',", text)
    text = re.sub(r"label: '\?\?\(Value\)',", "label: 'Value',", text)
    text = re.sub(r"label: '\?\? \(Unit\)',", "label: 'Unit',", text)
    
    text = text.replace("<UniversalBadge variant=\"outline\" className=\"border-green-500/30 text-green-600 bg-green-500/5\" ??", '<UniversalBadge variant="outline" className="border-green-500/30 text-green-600 bg-green-500/5">')
    text = text.replace('<span className="ml-2 text-sm text-gray-500">??', '<span className="ml-2 text-sm text-gray-500">單位</span>')
    text = text.replace('員工性別比例??', '員工性別比例</p>')

    if changed or True:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(text)

for root, _, files in os.walk('app'):
    for f in files:
        if f.endswith('.tsx') or f.endswith('.ts'):
            fix(os.path.join(root, f))
