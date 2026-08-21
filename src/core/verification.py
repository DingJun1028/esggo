import hashlib
import json
import time
from typing import Any, Dict, Optional, Tuple
from dataclasses import dataclass, asdict

@dataclass
class PurifiedArtifact:
    uuid: str
    version: str
    timestamp: float
    content: Any
    source_origin: str
    evidence: Dict[str, Any]
    hash_lock: str

class VerificationGate:
    """
    5T Protocol Verification Gate (ESG GO v0.5)
    Ensures all artifacts meet the 5T standards before they enter the production line.
    """
    
    @staticmethod
    def generate_hash(data: Any) -> str:
        """Trustworthy: Create an immutable Hash Lock for the content."""
        serialized = json.dumps(data, sort_keys=True, default=str).encode('utf-8')
        return hashlib.sha256(serialized).hexdigest()

    @classmethod
    def verify_5t(cls, artifact_data: Dict[str, Any]) -> Tuple[bool, Optional[str]]:
        """
        Verify the 5T Protocol:
        1. Traceable: Must have source_origin.
        2. Trackable: Must have uuid and timestamp.
        3. Tangible: Must have evidence of output/feedback.
        4. Transparent: Must have version and content.
        5. Trustworthy: Hash must match content.
        """
        if not artifact_data.get('source_origin'):
            return False, "Traceable Error: Missing source_origin"
            
        if not artifact_data.get('uuid') or not artifact_data.get('timestamp'):
            return False, "Trackable Error: Missing uuid or timestamp"
            
        if not artifact_data.get('evidence') or not isinstance(artifact_data['evidence'], dict):
            return False, "Tangible Error: Missing or invalid evidence store"
            
        if not artifact_data.get('version') or artifact_data.get('content') is None:
            return False, "Transparent Error: Missing version or content"
            
        content_hash = cls.generate_hash(artifact_data['content'])
        if artifact_data.get('hash_lock') != content_hash:
            return False, f"Trustworthy Error: Hash Lock mismatch. Expected {content_hash}"
            
        return True, None

    @classmethod
    def seal(cls, content: Any, source_origin: str, version: str = "v0.5.0", evidence: Optional[Dict] = None) -> PurifiedArtifact:
        """
        Seals a raw piece of content into a 5T Purified Artifact.
        """
        import uuid
        timestamp = time.time()
        hash_lock = cls.generate_hash(content)
        
        return PurifiedArtifact(
            uuid=str(uuid.uuid4()),
            version=version,
            timestamp=timestamp,
            content=content,
            source_origin=source_origin,
            evidence=evidence or {},
            hash_lock=hash_lock
        )

if __name__ == "__main__":
    gate = VerificationGate()
    my_artifact = gate.seal(
        content={"text": "大家好，我是壽司博士"}, 
        source_origin="QueenBee_Dispatch_01", 
        evidence={"user_feedback": "Positive", "brand_check": "Passed"}
    )
    is_valid, error = gate.verify_5t(asdict(my_artifact))
    print(f"Verification Result: {is_valid}, Error: {error}")
