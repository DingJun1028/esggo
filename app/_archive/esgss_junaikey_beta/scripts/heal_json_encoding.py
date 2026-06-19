
import json

def heal_json(file_path):
    # Using byte-based replacement for the replacement character if possible, 
    # or just string replacement on the decoded content.
    try:
        with open(file_path, 'rb') as f:
            raw_content = f.read()
        content = raw_content.decode('utf-8', errors='replace')
    except Exception as e:
        print(f"Error reading file: {e}")
        return

    # Direct mapping for known corrupted sequences
    # Using '' literal (replacement character) which is common in corrupted files
    replacements = {
        "能件心核": "萬能元件心核",
        "?能?件心核": "萬能元件心核",
        "核心": "數位核心",
        "ESG 核心": "ESG 數位分身",
        "ESG 數位分身": "ESG 數位分身",
        "4T 驗": "4T 驗證門戶",
        "策略導航": "策略導覽儀",
        "誠信標起": "誠信標籤·起源",
        "度證盾": "可靠度驗證盾",
        "模擬陣": "振動模擬矩陣",
        "測試": "應力測試場",
        "丹 AI": "王道阿丹 AI",
        "值鏡": "王道價值鏡",
        "人能導": "全人職能導圖",
        "潛能覺": "潛能覺醒之光",
        "": "領導力羅盤",
        "性核": "團隊韌性核心",
        "測陣": "評測矩陣",
    }

    healed_content = content
    for garbled, correct in replacements.items():
        healed_content = healed_content.replace(garbled, correct)

    # Simplified sweep for common characters if they appear alone
    # Note: be careful not to break valid characters
    # healed_content = healed_content.replace('', '核心') 

    try:
        data = json.loads(healed_content)
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"✅ Healed and formatted {file_path}")
    except json.JSONDecodeError as e:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(healed_content)
        print(f"⚠️ Saved text but JSON parsing failed: {e}")

if __name__ == "__main__":
    heal_json("c:/Project/esgss_junaikey_beta/src/data/impact_nexus_cards.json")
