import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  
  if (!category) {
    return NextResponse.json({ success: false, error: "Category is required" }, { status: 400 });
  }

  // In a real app, this would trigger a background crawler or fetch from an external API
  // For this demo, we'll return a success message and some mock "new" data info
  return NextResponse.json({
    success: true,
    message: `Successfully triggered fetch for category: ${category}`,
    data: {
      category,
      last_fetch: new Date().toISOString(),
      status: "COMPLETED",
      new_records_found: Math.floor(Math.random() * 10)
    }
  });
}
