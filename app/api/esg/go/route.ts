import { NextResponse } from 'next/server';
import { DataOrchestratorServer } from '@/lib/services/esg/DataOrchestratorServer';
import { IEsgMetric } from '@/shared/types';

export async function POST(request: Request) {
  try {
    const { metrics }: { metrics: IEsgMetric[] } = await request.json();
    const result = await DataOrchestratorServer.executeGoSequence(metrics);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[API/ESG/GO] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
