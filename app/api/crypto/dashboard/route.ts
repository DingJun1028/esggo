export type CryptoDashboardData = {
  portfolioValue: number;
  change24h: number;
  holdings: Array<{ symbol: string; amount: number; value: number; change24h: number }>;
  recentTransactions: Array<{ id: string; type: 'buy' | 'sell'; symbol: string; amount: number; price: number; timestamp: string }>;
};

export const GET = async () => {
  const data: CryptoDashboardData = {
    portfolioValue: 128500,
    change24h: 2.34,
    holdings: [
      { symbol: 'ETH', amount: 4.25, value: 76400, change24h: 3.1 },
      { symbol: 'BTC', amount: 0.45, value: 45200, change24h: 1.8 },
      { symbol: 'SOL', amount: 120, value: 6900, change24h: -0.5 },
    ],
    recentTransactions: [
      { id: 'tx-001', type: 'buy', symbol: 'ETH', amount: 0.5, price: 18000, timestamp: '2026-06-17T04:00:00Z' },
      { id: 'tx-002', type: 'sell', symbol: 'BTC', amount: 0.05, price: 106000, timestamp: '2026-06-16T14:20:00Z' },
    ],
  };

  return Response.json(data, { status: 200 });
};
