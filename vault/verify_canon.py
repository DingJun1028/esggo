import hashlib
import json

with open(r"C:\Users\dingj\esggo\vault\5t_canon_proof.json", "r", encoding="utf-8") as f:
    d = json.load(f)

c = json.dumps(d["content"], ensure_ascii=False, indent=2)
ts = d["timestamp"]
payload = f"OA-Team-30-SoulCanon|{c}|{ts}"

calc_hash = hashlib.sha256(payload.encode("utf-8")).hexdigest()
stored_hash = d["hash_lock"]

print("=" * 72)
print("  5T-CANON HASH LOCK VERIFICATION")
print("=" * 72)
print(f"  Calculated: {calc_hash}")
print(f"  Stored:     {stored_hash}")
print(f"  MATCH:      {calc_hash == stored_hash}")
print("=" * 72)

# Verify all 5T gates
gate = d["verification_gate"]
all_pass = all(v["status"] == "PASS" for v in gate.values())
print(f"\n  5T Gate Status:")
for k, v in gate.items():
    print(f"    {k:15s}: {v['status']}")
print(f"\n  ALL PASSED: {all_pass}")
print(f"\n  Artifact immutable: {d['immutable']}")
print(f"  Frozen at: {d['frozen_at']}")
print(f"\n  5T-CANON PROOF VALID: {calc_hash == stored_hash and all_pass and d['immutable']}")
