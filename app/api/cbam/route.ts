import { NextRequest, NextResponse } from 'next/server';
import {
  getCBAmFactors,
  getFactorByCategory,
  saveCBamCalculation,
  calculateCBamTax,
} from '@/lib/esg/cbam-calculator-store';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');
  const productId = searchParams.get('id');

  if (category) {
    const factor = await getFactorByCategory(category);
    return NextResponse.json({ factor });
  }

  const factors = await getCBAmFactors();
  return NextResponse.json({ factors, count: factors.length });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { productName, productCategory, quantity, unit, price, userId, countryOfOrigin } = body;

  if (!productName || !productCategory || !quantity) {
    return NextResponse.json(
      { error: 'Missing required fields: productName, productCategory, quantity' },
      { status: 400 }
    );
  }

  const factor = await getFactorByCategory(productCategory);
  if (!factor) {
    return NextResponse.json({ error: 'No emission factor found for category' }, { status: 404 });
  }

  const emissionFactor = factor.defaultEmissionFactor;
  const calculatedEmissions = quantity * emissionFactor;
  const tax = calculateCBamTax(calculatedEmissions);

  const calcId = await saveCBamCalculation({
    productName,
    productCategory,
    quantity,
    emissionFactor,
    calculatedEmissions,
    currency: 'USD',
    countryOfOrigin,
  });

  return NextResponse.json({
    calculation: {
      id: calcId,
      productName,
      productCategory,
      quantity,
      emissionFactor,
      calculatedEmissions,
      tax,
    },
  });
}
