import { NextRequest, NextResponse } from "next/server";
import {
  proxyToNCBPublic,
  getRlsPolicies,
  extractTableFromPath,
  allowsPublicRead,
  allowsPublicWrite,
  requiresOwnerScope,
} from "@/lib/ncb-utils";

const json = (body: object, status = 200) =>
  new NextResponse(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const pathStr = path.join("/");
  const table = extractTableFromPath(pathStr);
  if (!table) return json({ error: "Invalid path" }, 400);

  const policies = await getRlsPolicies();
  const policy = policies[table];
  if (!allowsPublicRead(policy)) {
    return json({ error: "This table does not allow public read access" }, 403);
  }

  if (requiresOwnerScope(policy)) {
    const ownerId = req.nextUrl.searchParams.get("owner_id");
    if (!ownerId) return json({ error: "owner_id query parameter is required for this table" }, 400);
  }

  return proxyToNCBPublic(req, pathStr);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const pathStr = path.join("/");
  const table = extractTableFromPath(pathStr);
  const body = await req.text();
  if (!table) return json({ error: "Invalid path" }, 400);
  if (!pathStr.startsWith("create/")) {
    return json({ error: "Public route only allows create operations" }, 403);
  }

  const policies = await getRlsPolicies();
  const policy = policies[table];
  if (!allowsPublicWrite(policy)) {
    return json({ error: "This table does not allow public write access" }, 403);
  }

  if (requiresOwnerScope(policy) && body) {
    try {
      const parsed = JSON.parse(body);
      const ownerId = parsed.owner_id;
      if (!ownerId) return json({ error: "owner_id is required in the body for this table" }, 400);
      delete parsed.owner_id;
      delete parsed.user_id;
      parsed.user_id = ownerId;
      return proxyToNCBPublic(req, pathStr, JSON.stringify(parsed));
    } catch {
      return json({ error: "Invalid JSON body" }, 400);
    }
  }

  if (body) {
    try {
      const parsed = JSON.parse(body);
      delete parsed.user_id;
      delete parsed.owner_id;
      return proxyToNCBPublic(req, pathStr, JSON.stringify(parsed));
    } catch {
      return json({ error: "Invalid JSON body" }, 400);
    }
  }

  return proxyToNCBPublic(req, pathStr, body);
}
