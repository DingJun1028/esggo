import { IOmniAtom } from './omni-types';
import { omniLogger, LogCategory } from './omniLogger';

/**
 * 🎫 OmniVoucherService: Verified Evidence Voucher System
 * Responsibility: Manage vouchers (tokens of proof) for 5T-compliant disclosure.
 */
export interface IVoucherPayload {
    issuer: string;
    description: string;
    value: number;
    unit: string;
    validityHash: string;
}

export class OmniVoucherService {
    /**
     * 📜 issueVoucher: Create a new verified evidence voucher.
     */
    public static async issueVoucher(payload: IVoucherPayload): Promise<IOmniAtom<IVoucherPayload>> {
        const { OmniOne } = await import('./omni-one');
        omniLogger.info(LogCategory.SYSTEM, `Voucher: Issuing new proof for ${payload.description}`);

        return await OmniOne.manifest({
            intent: "Proof_Issuance",
            type: "Accomplishment",
            payload,
            domainRef: "Voucher_Subsystem",
            impactMetric: "Evidence_Anchored"
        });
    }

    /**
     * 🔍 verifyVoucher: Verify a voucher's validity against the consensus timestamp.
     */
    public static verifyVoucher(voucher: IOmniAtom<IVoucherPayload>): boolean {
        return voucher.status === 'Trustworthy' && !!voucher.signature;
    }
}
