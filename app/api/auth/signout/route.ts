import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  response.cookies.delete('omni_session');
  response.cookies.delete('omni_demo_session');
  
  return response;
}
