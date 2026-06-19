import { NextResponse } from 'next/server';
import { getMaterialityIssues } from '@/lib/services/materiality';

export async function GET() {
    const issues = await getMaterialityIssues();
    return NextResponse.json(issues);
}
