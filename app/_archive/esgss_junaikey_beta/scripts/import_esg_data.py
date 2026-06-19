#!/usr/bin/env python3
"""
善向永續 ESG 數據匯入工具
用途：將 Excel/CSV 文件批量匯入 Supabase ESG 數據庫
支援格式：Excel (.xlsx) 和 CSV (.csv)
自動映射：組織名稱 -> UUID, 指標代碼 -> UUID
"""

import pandas as pd
from supabase import create_client, Client
import os
import argparse
import logging
from typing import Dict, List, Tuple
from datetime import datetime
import sys

# 設定日誌
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class ESGDataImporter:
    def __init__(self, supabase_url: str, supabase_key: str):
        self.supabase: Client = create_client(supabase_url, supabase_key)
        self.org_cache: Dict[str, str] = {}
        self.metric_cache: Dict[str, str] = {}

    def build_caches(self) -> None:
        """建立組織和指標的快取映射，減少資料庫查詢"""
        logger.info("建立資料映射快取...")

        # 獲取組織映射 (Name -> ID)
        try:
            orgs = self.supabase.table('org_units').select('id, name').execute()
            self.org_cache = {item['name']: item['id'] for item in orgs.data}
            logger.info(f"載入 {len(self.org_cache)} 個組織單位")
        except Exception as e:
            logger.error(f"載入組織數據失敗: {e}")
            raise

        # 獲取指標映射 (Code -> ID)
        try:
            metrics = self.supabase.table('metric_definitions').select('id, code').execute()
            self.metric_cache = {item['code']: item['id'] for item in metrics.data}
            logger.info(f"載入 {len(self.metric_cache)} 個指標定義")
        except Exception as e:
            logger.error(f"載入指標數據失敗: {e}")
            raise

    def validate_data(self, df: pd.DataFrame) -> List[str]:
        """驗證數據完整性和正確性"""
        errors = []
        required_columns = ['OrgName', 'MetricCode', 'PeriodStart', 'PeriodEnd', 'Value']

        # 檢查必要欄位
        for col in required_columns:
            if col not in df.columns:
                errors.append(f"缺少必要欄位: {col}")

        if errors:
            return errors

        # 檢查數據內容
        for index, row in df.iterrows():
            # 檢查組織是否存在
            if row['OrgName'] not in self.org_cache:
                errors.append(f"第 {index + 2} 行: 找不到組織 '{row['OrgName']}'")

            # 檢查指標是否存在
            if row['MetricCode'] not in self.metric_cache:
                errors.append(f"第 {index + 2} 行: 找不到指標代碼 '{row['MetricCode']}'")

            # 檢查數值格式
            try:
                float(row['Value'])
            except (ValueError, TypeError):
                errors.append(f"第 {index + 2} 行: 數值格式錯誤 '{row['Value']}'")

            # 檢查日期格式
            for date_col in ['PeriodStart', 'PeriodEnd']:
                try:
                    pd.to_datetime(row[date_col])
                except (ValueError, TypeError):
                    errors.append(f"第 {index + 2} 行: 日期格式錯誤 '{row[date_col]}'")

        return errors

    def transform_data(self, df: pd.DataFrame) -> List[Dict]:
        """將 DataFrame 轉換為 Supabase 可接受的格式"""
        payload = []

        for index, row in df.iterrows():
            try:
                # 查找對應的 UUID
                org_id = self.org_cache.get(row['OrgName'])
                metric_id = self.metric_cache.get(row['MetricCode'])

                if not org_id or not metric_id:
                    continue  # 已在驗證階段處理

                # 構建寫入物件
                record = {
                    "org_unit_id": org_id,
                    "metric_id": metric_id,
                    "period_start": pd.to_datetime(row['PeriodStart']).strftime('%Y-%m-%d'),
                    "period_end": pd.to_datetime(row['PeriodEnd']).strftime('%Y-%m-%d'),
                    "value": float(row['Value']),
                    "status": "draft",  # 匯入預設為草稿
                    "created_by": "SYSTEM_IMPORT"  # 標記來源
                }

                # 可選欄位
                if 'TargetValue' in row and pd.notna(row['TargetValue']):
                    record['target_value'] = float(row['TargetValue'])

                payload.append(record)

            except Exception as e:
                logger.warning(f"第 {index + 2} 行數據轉換失敗: {e}")
                continue

        return payload

    def import_data(self, file_path: str, batch_size: int = 100) -> Tuple[int, int]:
        """執行數據匯入"""
        logger.info(f"開始匯入文件: {file_path}")

        # 讀取文件
        try:
            if file_path.endswith('.xlsx'):
                df = pd.read_excel(file_path)
            elif file_path.endswith('.csv'):
                df = pd.read_csv(file_path)
            else:
                raise ValueError("不支援的文件格式。只支援 .xlsx 和 .csv")
        except Exception as e:
            logger.error(f"讀取文件失敗: {e}")
            raise

        logger.info(f"讀取到 {len(df)} 筆數據")

        # 驗證數據
        errors = self.validate_data(df)
        if errors:
            logger.error("數據驗證失敗:")
            for error in errors[:10]:  # 只顯示前10個錯誤
                logger.error(f"  {error}")
            if len(errors) > 10:
                logger.error(f"  ...還有 {len(errors) - 10} 個錯誤")
            raise ValueError("數據驗證失敗，請修正後重試")

        # 轉換數據
        payload = self.transform_data(df)
        if not payload:
            raise ValueError("沒有有效數據可匯入")

        logger.info(f"準備匯入 {len(payload)} 筆有效數據")

        # 批量寫入
        success_count = 0
        error_count = 0

        for i in range(0, len(payload), batch_size):
            batch = payload[i:i + batch_size]
            try:
                response = self.supabase.table('esg_readings').insert(batch).execute()
                success_count += len(batch)
                logger.info(f"成功匯入批次 {i//batch_size + 1}: {len(batch)} 筆")
            except Exception as e:
                error_count += len(batch)
                logger.error(f"批次 {i//batch_size + 1} 匯入失敗: {e}")

        return success_count, error_count

def main():
    parser = argparse.ArgumentParser(description='ESG 數據批量匯入工具')
    parser.add_argument('file', help='要匯入的 Excel 或 CSV 文件路徑')
    parser.add_argument('--batch-size', type=int, default=100, help='批次大小 (預設: 100)')
    parser.add_argument('--supabase-url', default=os.environ.get('SUPABASE_URL'), help='Supabase URL')
    parser.add_argument('--supabase-key', default=os.environ.get('SUPABASE_SERVICE_ROLE_KEY'), help='Supabase Service Role Key')

    args = parser.parse_args()

    # 檢查環境變數
    if not args.supabase_url or not args.supabase_key:
        logger.error("請設置 SUPABASE_URL 和 SUPABASE_SERVICE_ROLE_KEY 環境變數")
        sys.exit(1)

    # 檢查文件是否存在
    if not os.path.exists(args.file):
        logger.error(f"文件不存在: {args.file}")
        sys.exit(1)

    try:
        # 初始化匯入器
        importer = ESGDataImporter(args.supabase_url, args.supabase_key)

        # 建立快取
        importer.build_caches()

        # 執行匯入
        success_count, error_count = importer.import_data(args.file, args.batch_size)

        # 總結報告
        logger.info("=" * 50)
        logger.info("匯入完成總結:")
        logger.info(f"  成功匯入: {success_count} 筆")
        logger.info(f"  匯入失敗: {error_count} 筆")
        if error_count == 0:
            logger.info("✅ 所有數據匯入成功！")
        else:
            logger.warning("⚠️ 部分數據匯入失敗，請檢查日誌")

    except Exception as e:
        logger.error(f"匯入過程發生錯誤: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()