// app/api/auth/google-signin/route.ts
import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

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
    
    // [此處編寫您的業務邏輯]：例如查詢/建立資料庫用戶、核發 Session JWT 等
    
    return NextResponse.json({ 
      success: true, 
      user: { googleId, email, name, picture } 
    });

  } catch (error) {
    console.error('Google One Tap 驗證失敗:', error);
    return NextResponse.json({ error: '認證過程中發生錯誤' }, { status: 401 });
  }
}
