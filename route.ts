import { NextResponse } from 'next/server';
import { applyDataMasking, unmaskL2Data, generatePedersenCommitment, verifyCommitmentSum } from '@/lib/crypto-proof';
import { randomBytes } from 'crypto';
import * as secp from '@noble/secp256k1';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (body.action === 'mask') {
            const { data, level, l2KeyHex } = body;
            let masked = '';
            let outKeyHex = l2KeyHex;

            if (level === 'L2') {
                // 若無金鑰則動態生成一組 32 bytes 供本次模擬使用
                const key = l2KeyHex ? Buffer.from(l2KeyHex, 'hex') : randomBytes(32);
                outKeyHex = key.toString('hex');
                masked = applyDataMasking(data, level, { l2Key: key });
            } else {
                masked = applyDataMasking(data, level as any);
            }
            return NextResponse.json({ masked, l2KeyHex: outKeyHex });
        }

        if (body.action === 'unmask') {
            const { masked, l2KeyHex } = body;
            if (!l2KeyHex) return NextResponse.json({ error: 'Missing key' }, { status: 400 });
            const key = Buffer.from(l2KeyHex, 'hex');
            const unmasked = unmaskL2Data(masked, key);
            return NextResponse.json({ unmasked });
        }

        if (body.action === 'pedersen') {
            const { values } = body; // 接收數字陣列
            const commitments = await Promise.all(values.map((v: number) => generatePedersenCommitment(v)));

            // 計算總和承諾 (同態加總)
            let sumPoint = secp.Point.fromHex(commitments[0].commitment);
            for (let i = 1; i < commitments.length; i++) {
                sumPoint = sumPoint.add(secp.Point.fromHex(commitments[i].commitment));
            }
            const expectedTotal = sumPoint.toHex();
            const isValid = verifyCommitmentSum(commitments.map(c => c.commitment), expectedTotal);

            return NextResponse.json({ commitments, expectedTotal, isValid });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error: any) {
        console.error('[Crypto Simulator API]', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}