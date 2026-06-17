import { NextRequest, NextResponse } from 'next/server';
import {
  getMatrixComponents,
  getMatrixComponentById,
  validateRouteInMatrix,
} from '@/lib/omni-core/matrix-store';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const route = searchParams.get('route');
  const id = searchParams.get('id');

  if (id) {
    const component = await getMatrixComponentById(id);
    return NextResponse.json({ component });
  }

  if (route) {
    const isValid = await validateRouteInMatrix(route);
    return NextResponse.json({ valid: isValid, route });
  }

  const components = await getMatrixComponents();
  return NextResponse.json({ components, count: components.length });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { route } = body;

  if (route) {
    const isValid = await validateRouteInMatrix(route);
    return NextResponse.json({ route, exists: isValid });
  }

  return NextResponse.json({ error: 'No route provided' }, { status: 400 });
}
