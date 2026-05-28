import { NextResponse } from "next/server";

export async function GET() {
  const url = `${process.env.NCB_AUTH_API_URL}/providers?Instance=${process.env.NCB_INSTANCE}`;
  const res = await fetch(url);
  const data = await res.json();
  return NextResponse.json(data);
}
