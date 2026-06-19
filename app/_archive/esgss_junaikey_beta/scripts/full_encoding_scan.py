#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
全面掃描專案中的亂碼檔案
Full scan for garbled files in the project
"""

import os
import re
from pathlib import Path
from chardet import detect

# 專案根目錄
PROJECT_ROOT = Path(r'c:\Project\esgss_junaikey_beta')

# 要掃描的檔案副檔名
EXTENSIONS = {'.ts', '.tsx', '.js', '.jsx', '.md', '.json', '.py'}

# 要排除的目錄
EXCLUDE_DIRS = {'node_modules', '.git', 'dist', 'build', '__pycache__', '.next', 'coverage'}

# 亂碼特徵模式
GARBLED_PATTERNS = [
    r'娴欐睙', r'鎴戞槸', r'鎴戠殑', r'鏄', r'鍒╃敤', r'鍙',
    r'锟斤拷', r'锘', r'瑙ｅ喅', r'娴佺▼', r'鍔熻兘',
    r'鍒嗘瀽', r'鍒涘缓', r'鍒楄〃', r'鍙傛暟', r'鍙橀噺',
    r'娴', r'鎴', r'鍒', r'鍙', r'鍔', r'瑙', r'闃', r'闁', r'闂', r'鍚', r'鍗',
    r'\ufffd',  # Unicode replacement character
]

def is_garbled(content: str) -> tuple[bool, str]:
    """檢查內容是否包含亂碼，返回 (是否亂碼, 匹配的模式)"""
    for pattern in GARBLED_PATTERNS:
        if re.search(pattern, content):
            return True, pattern
    return False, ""

def scan_directory():
    """掃描目錄中的所有檔案"""
    results = {
        'garbled': [],
        'ok': [],
        'error': []
    }
    
    for root, dirs, files in os.walk(PROJECT_ROOT):
        # 排除特定目錄
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        
        for file in files:
            file_path = Path(root) / file
            if file_path.suffix.lower() not in EXTENSIONS:
                continue
            
            try:
                # 讀取檔案
                with open(file_path, 'rb') as f:
                    raw_data = f.read()
                
                # 嘗試 UTF-8 解碼
                try:
                    content = raw_data.decode('utf-8')
                    is_garb, pattern = is_garbled(content)
                    
                    if is_garb:
                        results['garbled'].append({
                            'path': str(file_path),
                            'pattern': pattern,
                            'encoding': 'utf-8 (with garbled content)'
                        })
                    else:
                        results['ok'].append(str(file_path))
                        
                except UnicodeDecodeError:
                    # UTF-8 解碼失敗，檢測編碼
                    detected = detect(raw_data)
                    encoding = detected.get('encoding', 'unknown')
                    
                    # 嘗試用檢測到的編碼解碼
                    try:
                        content = raw_data.decode(encoding)
                        is_garb, pattern = is_garbled(content)
                        
                        if is_garb:
                            results['garbled'].append({
                                'path': str(file_path),
                                'pattern': pattern,
                                'encoding': encoding
                            })
                        else:
                            results['ok'].append(str(file_path))
                    except:
                        results['error'].append({
                            'path': str(file_path),
                            'encoding': encoding
                        })
                        
            except Exception as e:
                results['error'].append({
                    'path': str(file_path),
                    'error': str(e)
                })
    
    return results

def main():
    print("=" * 70)
    print("全面掃描專案中的亂碼檔案")
    print("=" * 70)
    print()
    
    results = scan_directory()
    
    # 輸出結果
    print(f"掃描完成!")
    print(f"  - 正常檔案: {len(results['ok'])} 個")
    print(f"  - 亂碼檔案: {len(results['garbled'])} 個")
    print(f"  - 錯誤檔案: {len(results['error'])} 個")
    print()
    
    if results['garbled']:
        print("=" * 70)
        print("發現亂碼檔案:")
        print("=" * 70)
        for item in results['garbled']:
            print(f"  [亂碼] {item['path']}")
            print(f"         模式: {item['pattern']}, 編碼: {item['encoding']}")
    
    if results['error']:
        print("=" * 70)
        print("無法處理的檔案:")
        print("=" * 70)
        for item in results['error']:
            print(f"  [錯誤] {item['path']}")
            if 'error' in item:
                print(f"         錯誤: {item['error']}")
            else:
                print(f"         編碼: {item['encoding']}")
    
    # 寫入結果檔案
    output_file = PROJECT_ROOT / 'encoding_scan_results.txt'
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("編碼掃描結果\n")
        f.write("=" * 70 + "\n\n")
        f.write(f"正常檔案: {len(results['ok'])} 個\n")
        f.write(f"亂碼檔案: {len(results['garbled'])} 個\n")
        f.write(f"錯誤檔案: {len(results['error'])} 個\n\n")
        
        if results['garbled']:
            f.write("亂碼檔案列表:\n")
            f.write("-" * 70 + "\n")
            for item in results['garbled']:
                f.write(f"{item['path']}\n")
    
    print()
    print(f"結果已寫入: {output_file}")

if __name__ == '__main__':
    main()
