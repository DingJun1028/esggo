/** 🎬 VFX 渲染參數 (VFX Presentation Parameters) */
export interface VFXParams {
  glowIntensity: number; // 基於晶體純度
  resonanceColor: string; // 基於德行主導屬性
  domainRippleScale: number; // 基於演化等級
  tesseractFold?: number; // [87/88] 4D 維度摺疊強度 (0-1)
}

/** 📡 同步封包 (Broad Sync Payload) */
export interface ArenaSyncPayload {
  componentId: string;
  attributes: any;
  vfx: VFXParams;
  timestamp: number;
}

/** 🏛️ 同步與呈現服務介面 */
export interface ISyncVFXService {
  prepareSyncPayload(core: any): ArenaSyncPayload;
  dispatchSync(payload: ArenaSyncPayload): Promise<void>;
}
