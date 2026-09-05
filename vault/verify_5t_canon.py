#!/usr/bin/env python3
"""獨立第三方驗證：scripts/verify_5t.py 閉環測試"""
import sys, json, hashlib

# 載入 verify_5t.py
sys.path.insert(0, r'C:\Users\dingj\AppData\Local\hermes\skills\software-development\oa-team-5t-verification\scripts')
from verify_5t import verify_artifact

proof_path = r'C:\Users\dingj\esggo\vault\5t-canon-proof.json'
with open(proof_path, 'r', encoding='utf-8') as f:
    artifact = json.load(f)

passed, err = verify_artifact(artifact)

print("=" * 60)
print("  獨立第三方驗證 (verify_5t.py)")
print("=" * 60)
print(f"  結果: {'✅ PASS' if passed else '❌ FAIL'}")
if err:
    print(f"  錯誤: {err}")
else:
    print("  所有檢查通過:")
    for field, pillar in [
        ('source_origin', 'Traceable'),
        ('uuid', 'Trackable'),
        ('timestamp', 'Trackable'),
        ('evidence', 'Tangible'),
        ('version', 'Transparent')
    ]:
        val = str(artifact[field])[:40]
        print(f"    ✓ {pillar}: {field} = {val}")
    print(f"    ✓ Trustworthy: hash_lock = {artifact['hash_lock'][:20]}...")

print(f"\n  模型: {artifact['model']}")
print(f"  證明檔: {proof_path}")
print("=" * 60)
