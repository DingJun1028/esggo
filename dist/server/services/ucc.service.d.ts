/**
 * UCC Service
 * 實作「萬能元件心核」三位一體邏輯：標籤層、智庫層、元素層
 */
import { CreateUCCDTO, UCCPackage } from '../../shared/types/ucc.types';
export declare class UCCService {
    /**
     * 封裝證據為 UCC Package
     */
    packageEvidence(dto: CreateUCCDTO): Promise<UCCPackage>;
}
export declare const uccService: UCCService;
//# sourceMappingURL=ucc.service.d.ts.map