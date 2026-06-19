#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
全面編碼修復腳本
修復專案中的亂碼檔案和編碼問題
"""

import os
import re
import json
from pathlib import Path

# 專案根目錄
ROOT_DIR = Path(__file__).parent.parent

# 亂碼模式（只保留真正的亂碼特徵，避免誤判正常繁體中文）
# 這些是 UTF-8 被錯誤解碼為 GBK/Big5 後的特徵
GARBLED_PATTERNS = [
    r'娴欐睙',      # 浙江的亂碼
    r'鎴戞槸',      # 我是
    r'鎴戠殑',      # 我的
    r'锟斤拷',      # 經典亂碼
    r'锘',          # BOM 亂碼
    r'瑙ｅ喅',      # 解決
    r'娴佺▼',      # 流程
    r'鍔熻兘',      # 功能
    r'鐢ㄦ埛',      # 用戶
    r'鏁版嵁',      # 數據
    r'绯荤粺',      # 系統
    r'閰嶇疆',      # 配置
    r'鎿嶄綔',      # 操作
    r'铏氭嫙',      # 虛擬
    r'鍗忓悓',      # 協同
    r'鍏冪礌',      # 元素
    r'瑙嗗浘',      # 視圖
    r'娴佹祦',      # 流水
    r'鍏崇郴',      # 關係
    r'缁撴灉',      # 結果
    r'鍙樺寲',      # 變化
    r'鍒嗘瀽',      # 分析
    r'娴嬭瘯',      # 測試
    r'鍙傛暟',      # 參數
    r'鍙橀噺',      # 變量
    r'瀵硅薄',      # 對象
    r'鏂规硶',      # 方法
    r'鍗忚皟',      # 協調
    r'鍏宠仈',      # 關聯
    r'缁勪欢',      # 組件
    r'鏈嶅姟',      # 服務
    r'\ufffd{2,}',  # 連續 Unicode replacement character (至少2個)
]

# 排除的目錄
EXCLUDE_DIRS = {
    'node_modules', '.git', '.venv', 'venv', '__pycache__', 
    'dist', 'build', '.next', 'coverage', '.vite',
    'esgss_junaikey_beta', 'shan-xiang-tech', 'crewai'
}

# 排除的檔案模式
EXCLUDE_PATTERNS = {
    r'\.pyc$', r'\.pyo$', r'\.exe$', r'\.dll$', r'\.so$',
    r'\.png$', r'\.jpg$', r'\.jpeg$', r'\.gif$', r'\.ico$',
    r'\.woff', r'\.ttf', r'\.eot', r'\.pdf$',
    r'package-lock\.json$', r'pnpm-lock\.yaml$',
    r'\.DS_Store$', r'Thumbs\.db$',
}

# 排除的檔案名稱（掃描腳本本身）
EXCLUDE_FILES = {
    'fix_all_encoding.py', 'full_encoding_scan.py', 'scan_and_fix_encoding.py',
    'detect_encoding.py', 'fix_encoding.py',
}


def should_exclude(path: Path) -> bool:
    """檢查是否應該排除該路徑"""
    # 檢查檔案名稱
    if path.name in EXCLUDE_FILES:
        return True
    
    # 檢查檔案模式
    name = path.name
    for pattern in EXCLUDE_PATTERNS:
        if re.search(pattern, name, re.IGNORECASE):
            return True
    
    return False


def has_garbled_content(content: str) -> bool:
    """檢查內容是否包含亂碼"""
    for pattern in GARBLED_PATTERNS:
        if re.search(pattern, content):
            return True
    return False


def fix_bom(filepath: Path) -> bool:
    """修復 UTF-8 BOM 問題"""
    try:
        with open(filepath, 'rb') as f:
            raw = f.read()
        
        # 檢查 BOM
        if raw.startswith(b'\xef\xbb\xbf'):
            # 移除 BOM
            with open(filepath, 'wb') as f:
                f.write(raw[3:])
            return True
        return False
    except Exception as e:
        print(f"  [錯誤] 處理 {filepath} 時發生錯誤: {e}")
        return False


def try_fix_encoding(filepath: Path) -> dict:
    """嘗試修復檔案編碼"""
    result = {
        'path': str(filepath),
        'status': 'unknown',
        'action': None,
        'error': None
    }
    
    # 優先使用 UTF-8 讀取
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        detected_encoding = 'utf-8'
        
        # UTF-8 成功解碼，檢查 BOM
        with open(filepath, 'rb') as f:
            raw = f.read()
        if raw.startswith(b'\xef\xbb\xbf'):
            # 移除 BOM
            with open(filepath, 'wb') as f:
                f.write(raw[3:])
            result['status'] = 'fixed'
            result['action'] = '移除 UTF-8 BOM'
            return result
        
        # UTF-8 成功解碼，不需要檢測亂碼（因為是正確的編碼）
        result['status'] = 'ok'
        return result
        
    except (UnicodeDecodeError, UnicodeError):
        # UTF-8 解碼失敗，嘗試其他編碼
        encodings = ['utf-8-sig', 'utf-16', 'utf-16-le', 'utf-16-be', 
                     'big5', 'gbk', 'gb2312', 'cp950', 'latin-1']
        
        content = None
        detected_encoding = None
        
        for enc in encodings:
            try:
                with open(filepath, 'r', encoding=enc) as f:
                    content = f.read()
                detected_encoding = enc
                break
            except (UnicodeDecodeError, UnicodeError):
                continue
        
        if content is None:
            result['status'] = 'error'
            result['error'] = '無法解碼檔案'
            return result
        
        # 非 UTF-8 編碼的檔案，檢查是否有亂碼
        if has_garbled_content(content):
            result['status'] = 'garbled'
            result['action'] = '需要手動檢查或刪除'
            return result
        
        result['status'] = 'ok'
        return result


def scan_and_fix():
    """掃描並修復所有檔案"""
    print("=" * 70)
    print("ESGSS JunAiKey Encoding Fix Tool")
    print("=" * 70)
    
    stats = {
        'total': 0,
        'ok': 0,
        'fixed': 0,
        'garbled': 0,
        'error': 0,
        'skipped': 0
    }
    
    garbled_files = []
    fixed_files = []
    
    # 掃描所有文字檔案
    text_extensions = {
        '.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.txt',
        '.py', '.yaml', '.yml', '.toml', '.ini', '.cfg',
        '.html', '.css', '.scss', '.sass', '.less',
        '.sh', '.bat', '.ps1', '.cmd',
        '.sql', '.prisma',
        '.env', '.example', '.sample'
    }
    
    # 使用 os.walk 代替 rglob 以處理損壞的路徑
    for root, dirs, files in os.walk(ROOT_DIR):
        # 過濾掉排除的目錄
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        
        for filename in files:
            try:
                filepath = Path(root) / filename
                
                if should_exclude(filepath):
                    stats['skipped'] += 1
                    continue
                
                # 檢查副檔名
                ext = filepath.suffix.lower()
                if ext not in text_extensions:
                    stats['skipped'] += 1
                    continue
                
                stats['total'] += 1
                result = try_fix_encoding(filepath)
                
                if result['status'] == 'ok':
                    stats['ok'] += 1
                elif result['status'] == 'fixed':
                    stats['fixed'] += 1
                    fixed_files.append(result)
                    print(f"  [FIX] {filepath.name}: {result['action']}")
                elif result['status'] == 'garbled':
                    stats['garbled'] += 1
                    garbled_files.append(result)
                    print(f"  [GARBLED] {filepath}")
                else:
                    stats['error'] += 1
            except (PermissionError, OSError) as e:
                stats['error'] += 1
                continue
    
    # 輸出統計
    print("\n" + "=" * 70)
    print("掃描完成!")
    print("=" * 70)
    print(f"  - 掃描檔案: {stats['total']} 個")
    print(f"  - 正常檔案: {stats['ok']} 個")
    print(f"  - 已修復: {stats['fixed']} 個")
    print(f"  - 亂碼檔案: {stats['garbled']} 個")
    print(f"  - 錯誤檔案: {stats['error']} 個")
    print(f"  - 已跳過: {stats['skipped']} 個")
    
    if garbled_files:
        print("\n" + "=" * 70)
        print("發現亂碼檔案（需要處理）:")
        print("=" * 70)
        for item in garbled_files:
            print(f"  - {item['path']}")
            if item['action']:
                print(f"    建議: {item['action']}")
    
    return stats, garbled_files, fixed_files


if __name__ == '__main__':
    scan_and_fix()
