#!/usr/bin/env python3
"""獨立第三方驗證 — 5T-canon 證明閉環"""
import json, hashlib

proof_path = r'C:\Users\dingj\esggo\vault\5t-canon-proof.json'
with open(proof_path, 'r', encoding='utf-8') as f:
    artifact = json.load(f)

# 1. Hash Lock 驗證
content = artifact.get('content')
provided_hash = artifact.get('hash_lock')
serialized = json.dumps(content, sort_keys=True, default=str).encode('utf-8')
actual_hash = hashlib.sha256(serialized).hexdigest()
hash_match = provided_hash == actual_hash

# 2. 5T 必填欄位檢查
fields = ['source_origin', 'uuid', 'timestamp', 'evidence', 'version']
all_present = all(artifact.get(f) for f in fields)

# 3. Evidence 必為 dict
evidence_dict = isinstance(artifact.get('evidence'), dict)

passed = hash_match and all_present and evidence_dict

print("=" * 60)
print("  獨立第三方驗證 — 5T-canon 證明")
print("=" * 60)
print(f"  Hash Lock 驗證: {'✅ PASS' if hash_match else '❌ FAIL'}")
print(f"  5T 必填欄位: {'✅ PASS' if all_present else '❌ FAIL'}")
for f in fields:
    val = str(artifact[f])[:50]
    print(f"    - {f}: {val}")
print(f"  Evidence 為 dict: {'✅ PASS' if evidence_dict else '❌ FAIL'}")
print(f"\n  綜合結果: {'✅ PASS' if passed else '❌ FAIL'}")
print(f"  產出模型: {artifact['model']}")
print(f"  協議版本: {artifact['version']}")
print(f"  證明 UUID: {artifact['uuid']}")
print(f"  證明時間: {artifact['sealed_at']}")
print("=" * 60)
