import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import {
  applyDataMasking,
  unmaskL2Data,
  generatePedersenCommitment,
  verifyCommitmentSum,
  MaskingLevel
} from '@/lib/crypto-proof';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'mask') {
      const { data, level } = body;
      const maskLevel = level as MaskingLevel;
      
      let l2KeyHex: string | undefined;
      const options: any = {};
      
      if (maskLevel === 'L2') {
        const l2Key = randomBytes(32);
        l2KeyHex = l2Key.toString('hex');
        options.l2Key = l2Key;
      } else if (maskLevel === 'L3') {
        options.l3Salt = randomBytes(16).toString('hex');
      }

      const masked = applyDataMasking(data, maskLevel, options);
      
      return NextResponse.json({ masked, l2KeyHex });
    }

    if (action === 'unmask') {
      const { masked, l2KeyHex } = body;
      try {
        const secretKey = Buffer.from(l2KeyHex, 'hex');
        const unmasked = unmaskL2Data(masked, secretKey);
        return NextResponse.json({ unmasked });
      } catch (error: any) {
        return NextResponse.json({ error: error.message || '解密失敗' }, { status: 400 });
      }
    }

    if (action === 'pedersen') {
      const { values } = body;
      
      if (!Array.isArray(values) || values.length === 0) {
        return NextResponse.json({ error: 'Values array is required' }, { status: 400 });
      }

      // Generate individual commitments
      const commitments = await Promise.all(
        values.map(v => generatePedersenCommitment(v))
      );

      // Extract just the commitment hex strings
      const commitmentHexes = commitments.map(c => c.commitment);

      // To verify homomorphic sum, the total commitment is simply the sum of individual commitments.
      // In a real scenario, the server would sum the commitments without knowing the values.
      // Here we simulate the server summing them to show the homomorphic property.
      
      import('@noble/secp256k1').then(secp => {
         // Because secp is dynamic, let's just do it cleanly.
      });
      // Actually we can just use verifyCommitmentSum to check, but we need expectedTotal.
      // Let's compute expectedTotal by importing secp256k1 here.
      const secp = await import('@noble/secp256k1');
      let sumPoint = secp.Point.fromHex(commitmentHexes[0]);
      for (let i = 1; i < commitmentHexes.length; i++) {
        sumPoint = sumPoint.add(secp.Point.fromHex(commitmentHexes[i]));
      }
      
      const expectedTotal = sumPoint.toHex();
      const isValid = verifyCommitmentSum(commitmentHexes, expectedTotal);

      return NextResponse.json({
        commitments: commitments.map(c => ({ value: c.value, commitment: c.commitment })),
        expectedTotal,
        isValid
      });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });

  } catch (error: unknown) {
    console.error('[Crypto API Error]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
