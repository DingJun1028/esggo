import { NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { getAdminApp } from '@/lib/firebase-admin';

function getAdminAuth() {
  return getAuth(getAdminApp());
}

async function getRequesterRole(request: Request): Promise<'admin' | 'TA' | 'student' | null> {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return null;

  try {
    const decoded = await getAdminAuth().verifyIdToken(token);
    const role = decoded['role'];
    if (role === 'admin' || role === 'TA' || role === 'student') {
      return role;
    }
    return null;
  } catch {
    return null;
  }
}

async function requireAdmin(request: Request): Promise<{ uid: string } | null> {
  const role = await getRequesterRole(request);
  if (role === 'admin') {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return null;
    try {
      const decoded = await getAdminAuth().verifyIdToken(token);
      return { uid: decoded.uid };
    } catch {
      return null;
    }
  }
  return null;
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ ok: false, message }, { status });
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const requester = await requireAdmin(request);
  if (!requester) return jsonError('Forbidden', 403);

  try {
    const userRecord = await getAdminAuth().getUser(params.id);
    const claims = (userRecord.customClaims ?? {}) as Record<string, unknown>;

    return NextResponse.json({
      ok: true,
      uid: userRecord.uid,
      email: userRecord.email,
      claims,
    });
  } catch (error) {
    console.error('[Admin] getUserClaims error:', error);
    return jsonError('User not found', 404);
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const requester = await requireAdmin(request);
  if (!requester) return jsonError('Forbidden', 403);

  try {
    const payload = await request.json();
    const role = payload.role;

    if (!['student', 'TA', 'admin'].includes(role)) {
      return jsonError('Invalid role. Must be student, TA, or admin', 400);
    }

    await getAdminAuth().setCustomClaims(params.id, { role });

    return NextResponse.json({
      ok: true,
      uid: params.id,
      role,
      message: 'Custom claims updated',
    });
  } catch (error) {
    console.error('[Admin] setCustomClaims error:', error);
    return jsonError('Failed to update claims', 500);
  }
}
