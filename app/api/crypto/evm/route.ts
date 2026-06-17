import { NextRequest } from 'next/server';

export type EvmAccountInfo = {
  address: string;
  balance: string;
  chainId: number;
  nonce: number;
};

export const GET = async (request: NextRequest) => {
  const address = request.nextUrl.searchParams.get('address');
  if (!address) {
    return Response.json({ error: 'Missing address query parameter' }, { status: 400 });
  }

  const info: EvmAccountInfo = {
    address,
    balance: '0.00',
    chainId: Number(process.env.NEXT_PUBLIC_EVM_CHAIN_ID ?? '1'),
    nonce: 0,
  };

  return Response.json(info, { status: 200 });
};
