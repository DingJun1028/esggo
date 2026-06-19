/**
 * 💡 核心演算：OCR 炭資產轉換邏輯
 * --------------------------------------------------
 * [來源備註] 參考 ISO-14064-1 係數 (模擬 : 0.495 kgCO2e/kWh)
 * [狀態檢驗] 🟢 Traceable | 🔴 Immutable
 */

import { ICarbonAsset, CarbonAssetStatus } from '../../types/carbon';
import { v4 as uuidv4 } from 'uuid';

// ISO-14064-1 Coefficient (Taiwan Energy 2024 Proxy)
const CO2E_COEFFICIENT = 0.495;

export const calculateEmissions = (kwh: number): number => {
  // 💡 核心演算: Calculable
  return Number((kwh * CO2E_COEFFICIENT).toFixed(4));
};

export const createInitialAsset = (fileName: string, fileHash: string): ICarbonAsset => {
  return {
    id: uuidv4(),
    createdAt: Date.now(),
    version: '1.0.0-alpha',
    sourceOrigin: {
      fileName,
      fileHash,
      uploadTimestamp: Date.now(),
    },
    data: {},
    status: 'STATUS_UPLOADING',
    auditLog: [
      {
        action: 'ASSET_INITIALIZED',
        timestamp: Date.now(),
        actor: 'SYSTEM_OCR_CORE',
      },
    ],
  };
};

export const updateAssetStatus = (
  asset: ICarbonAsset,
  status: CarbonAssetStatus,
  note?: string
): ICarbonAsset => {
  return {
    ...asset,
    status,
    auditLog: [
      ...asset.auditLog,
      {
        action: `STATUS_CHANGE_TO_${status} ${note ? `(${note})` : ''}`,
        timestamp: Date.now(),
        actor: 'SYSTEM_OCR_CORE',
      },
    ],
  };
};

export const sealAsset = (asset: ICarbonAsset): ICarbonAsset => {
  // 🔴 Immutable Logic
  // In a real system, we would hash the entire object's content here.
  // For demo, we simulate a hash.
  const mockContentHash = `0x${Math.random().toString(16).substr(2, 64)}`;

  const sealedAsset = {
    ...asset,
    status: 'STATUS_FROZEN' as CarbonAssetStatus,
    evidenceHash: mockContentHash,
    sealTimestamp: Date.now(),
    auditLog: [
      ...asset.auditLog,
      {
        action: 'ASSET_SEALED_IMMUTABLE',
        timestamp: Date.now(),
        actor: 'PROTOCOL_3_PLUS_1',
      },
    ],
  };

  // Deep freeze only works at runtime, TypeScript `readonly` handles compile time.
  return Object.freeze(sealedAsset);
};
