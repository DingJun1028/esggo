#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
掃描專案中的亂碼檔案並修復編碼問題
Scan project for garbled files and fix encoding issues
"""

import os
import re
from pathlib import Path

# 專案根目錄
PROJECT_ROOT = Path(r'c:\Project\esgss_junaikey_beta')

# 要掃描的檔案副檔名
EXTENSIONS = {'.ts', '.tsx', '.js', '.jsx', '.md', '.json', '.py'}

# 要排除的目錄
EXCLUDE_DIRS = {'node_modules', '.git', 'dist', 'build', '__pycache__', '.next', 'coverage'}

# 亂碼特徵模式 (UTF-8 被誤讀為其他編碼造成的亂碼)
GARBLED_PATTERNS = [
    r'娴欐睙',      # 浙江
    r'鎴戞槸',      # 我是
    r'鎴戠殑',      # 我的
    r'鏄',          # 是
    r'鍒╃敤',      # 利用
    r'鍙',          # 可
    r'锟斤拷',      # 常見亂碼
    r'锘',          # BOM 亂碼
    r'瑙ｅ喅',      # 解決
    r'娴佺▼',      # 流程
    r'鍔熻兘',      # 功能
    r'鍒嗘瀽',      # 分析
    r'鍒涘缓',      # 創建
    r'鍒楄〃',      # 列表
    r'鍙傛暟',      # 參數
    r'鍙橀噺',      # 變量
    r'鍙风爜',      # 號碼
    r'鍗囩',        # 升級
    r'鍗忚',        # 協議
    r'娴',          # 亂碼前綴
    r'鎴',          # 亂碼前綴
    r'鍒',          # 亂碼前綴
    r'鍙',          # 亂碼前綴
    r'鍔',          # 亂碼前綴
    r'瑙',          # 亂碼前綴
    r'闃',          # 亂碼前綴
    r'闁',          # 亂碼前綴
    r'闂',          # 亂碼前綴
    r'鍚',          # 亂碼前綴
    r'鍗',          # 亂碼前綴
]


def is_garbled(content: str) -> bool:
    """檢查內容是否包含亂碼"""
    for pattern in GARBLED_PATTERNS:
        if re.search(pattern, content):
            return True
    return False


def detect_encoding(file_path: Path) -> str:
    """檢測檔案編碼"""
    try:
        with open(file_path, 'rb') as f:
            raw_data = f.read()
        
        # 嘗試常見編碼
        encodings = ['utf-8', 'utf-8-sig', 'big5', 'gbk', 'cp950', 'utf-16', 'utf-16-le', 'utf-16-be']
        
        for enc in encodings:
            try:
                content = raw_data.decode(enc)
                # 檢查是否有亂碼
                if not is_garbled(content):
                    return enc
            except:
                continue
        
        return 'unknown'
    except Exception as e:
        print(f"Error detecting encoding for {file_path}: {e}")
        return 'unknown'


def scan_files():
    """掃描所有檔案"""
    garbled_files = []
    
    for root, dirs, files in os.walk(PROJECT_ROOT):
        # 排除特定目錄
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        
        for file in files:
            file_path = Path(root) / file
            if file_path.suffix.lower() in EXTENSIONS:
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='replace') as f:
                        content = f.read()
                    
                    if is_garbled(content):
                        original_encoding = detect_encoding(file_path)
                        garbled_files.append({
                            'path': str(file_path),
                            'encoding': original_encoding
                        })
                        print(f"[亂碼] {file_path} (原始編碼: {original_encoding})")
                except Exception as e:
                    print(f"[錯誤] 無法讀取 {file_path}: {e}")
    
    return garbled_files


def fix_file(file_path: str, original_encoding: str) -> bool:
    """修復單個檔案"""
    try:
        path = Path(file_path)
        
        # 讀取原始內容
        with open(path, 'rb') as f:
            raw_data = f.read()
        
        # 嘗試用原始編碼解碼
        if original_encoding != 'unknown':
            try:
                content = raw_data.decode(original_encoding)
            except:
                # 如果失敗，嘗試其他編碼
                for enc in ['big5', 'gbk', 'cp950', 'utf-8-sig']:
                    try:
                        content = raw_data.decode(enc)
                        break
                    except:
                        continue
                else:
                    print(f"  [失敗] 無法解碼 {file_path}")
                    return False
        else:
            # 嘗試所有編碼
            for enc in ['big5', 'gbk', 'cp950', 'utf-8-sig', 'utf-16', 'utf-16-le']:
                try:
                    content = raw_data.decode(enc)
                    if not is_garbled(content):
                        break
                except:
                    continue
            else:
                print(f"  [失敗] 無法解碼 {file_path}")
                return False
        
        # 寫入 UTF-8 格式
        with open(path, 'w', encoding='utf-8', newline='\n') as f:
            f.write(content)
        
        print(f"  [修復] {file_path}")
        return True
    except Exception as e:
        print(f"  [錯誤] 修復 {file_path} 失敗: {e}")
        return False


def main():
    print("=" * 60)
    print("掃描專案中的亂碼檔案...")
    print("=" * 60)
    
    garbled_files = scan_files()
    
    print("\n" + "=" * 60)
    print(f"發現 {len(garbled_files)} 個亂碼檔案")
    print("=" * 60)
    
    if garbled_files:
        print("\n開始修復...")
        fixed_count = 0
        for file_info in garbled_files:
            if fix_file(file_info['path'], file_info['encoding']):
                fixed_count += 1
        
        print("\n" + "=" * 60)
        print(f"修復完成: {fixed_count}/{len(garbled_files)} 個檔案")
        print("=" * 60)
    else:
        print("沒有發現亂碼檔案！")


if __name__ == '__main__':
    main()
