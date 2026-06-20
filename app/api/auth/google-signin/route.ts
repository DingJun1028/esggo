import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import { SignJWT } from 'jose';

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'omnicore_default_secret_key_please_change'
);

export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    
    // 嚴格執行核心驗證，確保憑證來自 Google 且發給您的 Client ID
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    if (!payload) {
      return NextResponse.json({ error: '無效的 Token 酬載' }, { status: 400 });
    }

    // 提取用戶核心識別數據
    const { sub: googleId, email, name, picture } = payload;
    
    // 簽署專屬的 Session JWT
    const sessionJwt = await new SignJWT({ googleId, email, name, picture })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET);
      
    const response = NextResponse.json({ 
      success: true, 
      user: { googleId, email, name, picture } 
    });

    // 寫入 HTTP-Only Cookie
    response.cookies.set({
      name: 'omni_session',
      value: sessionJwt,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Google One Tap 驗證失敗:', error);
    return NextResponse.json({ error: '認證過程中發生錯誤' }, { status: 401 });
  }
}
