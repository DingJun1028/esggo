"""5T verification probe for the generated proof"""
import hashlib, json, sys

def verify_artifact(artifact):
    content = artifact.get('content')
    provided_hash = artifact.get('hash_lock')
    if content is None:
        return False, "Missing content"
    serialized = json.dumps(content, sort_keys=True, default=str).encode('utf-8')
    actual_hash = hashlib.sha256(serialized).hexdigest()
    if provided_hash != actual_hash:
        return False, f"Trustworthy Error: Hash mismatch. Got {provided_hash}, expected {actual_hash}"
    checks = {
        'source_origin': 'Traceable',
        'uuid': 'Trackable',
        'timestamp': 'Trackable',
        'evidence': 'Tangible',
        'version': 'Transparent'
    }
    for field, pillar in checks.items():
        if not artifact.get(field):
            return False, f"{pillar} Error: Missing {field}"
    if not isinstance(artifact.get('evidence'), dict):
        return False, "Tangible Error: Evidence must be a dictionary"
    return True, None

if __name__ == "__main__":
    path = sys.argv[1] if len(sys.argv) > 1 else r"C:\Users\dingj\esggo\vault\5t-canon-proof-ling-3.0-flash-fin.json"
    with open(path, 'r') as f:
        data = json.load(f)
    success, err = verify_artifact(data)
    print(f"5T Status: {'PASS' if success else 'FAIL'}")
    if err:
        print(f"Error: {err}")
    else:
        print("All 5T pillars verified: Traceable, Trackable, Tangible, Transparent, Trustworthy")
        print(f"UUID: {data['uuid']}")
        print(f"Hash Lock: {data['hash_lock'][:40]}...")
