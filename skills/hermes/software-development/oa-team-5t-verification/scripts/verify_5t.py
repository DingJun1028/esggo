import hashlib
import json
from typing import Any, Dict, Tuple, Optional

def verify_artifact(artifact: Dict[str, Any]) -> Tuple[bool, Optional[str]]:
    \"\"\"Standalone probe to verify if a JSON artifact meets 5T standards.\"\"\"
    # Hash check
    content = artifact.get('content')
    provided_hash = artifact.get('hash_lock')
    
    if content is None:
        return False, \"Missing content\"
        
    serialized = json.dumps(content, sort_keys=True, default=str).encode('utf-8')
    actual_hash = hashlib.sha256(serialized).hexdigest()
    
    if provided_hash != actual_hash:
        return False, f\"Trustworthy Error: Hash mismatch. Got {provided_hash}, expected {actual_hash}\"
    
    # Field checks
    checks = {
        'source_origin': 'Traceable',
        'uuid': 'Trackable',
        'timestamp': 'Trackable',
        'evidence': 'Tangible',
        'version': 'Transparent'
    }
    
    for field, pillar in checks.items():
        if not artifact.get(field):
            return False, f\"{pillar} Error: Missing {field}\"
            
    if not isinstance(artifact.get('evidence'), dict):
        return False, \"Tangible Error: Evidence must be a dictionary\"
        
    return True, None

if __name__ == \"__main__\":
    import sys
    if len(sys.argv) < 2:
        print(\"Usage: python verify_5t.py <artifact_json_file>\")
        sys.exit(1)
    
    try:
        with open(sys.argv[1], 'r') as f:
            data = json.load(f)
            success, err = verify_artifact(data)
            print(f\"5T Status: {'PASS' if success else 'FAIL'}\")
            if err: print(f\"Error: {err}\")
    except Exception as e:
        print(f\"File Error: {e}\")
        sys.exit(1)
