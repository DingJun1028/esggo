export interface Certificate {
  id: string;
  recipient: {
    id: string;
    name: string;
  };
  type: string;
  issuer: string;
  date: string;
  status: 'ACTIVE' | 'REVOKED';
  signature?: string;
  anchored?: boolean;
}

export class BerkeleyCertificationService {
  private blockchainService: any;

  constructor(blockchainService: any) {
    this.blockchainService = blockchainService;
  }

  async issueCertificate(user: { id: string; name: string }, type: string): Promise<Certificate> {
    const timestamp = Date.now();
    const certId = `BERK-${timestamp}-${Math.floor(Math.random() * 1000)}`;

    const certificate: Certificate = {
      id: certId,
      recipient: {
        id: user.id,
        name: user.name,
      },
      type: type,
      issuer: 'Berkeley Extension (Simulated)',
      date: new Date(timestamp).toISOString(),
      status: 'ACTIVE',
    };

    await this.anchorCertificate(certificate);

    return certificate;
  }

  async anchorCertificate(cert: Certificate): Promise<void> {
    const signature = this.generateHash(cert);
    console.log(`[BerkeleyCert] Anchoring Cert ${cert.id} (Hash: ${signature})...`);

    if (this.blockchainService) {
      // await this.blockchainService.anchorHash(signature);
    } else {
      console.log(`[BerkeleyCert] (Mock) Hash anchored to blockchain.`);
    }

    cert.signature = signature;
    cert.anchored = true;
  }

  private generateHash(obj: any): string {
    return `0x${Buffer.from(JSON.stringify(obj)).toString('base64').slice(0, 32)}`;
  }

  async verifyCertificate(certId: string): Promise<{ valid: boolean; timestamp: number }> {
    return { valid: true, timestamp: Date.now() };
  }
}
