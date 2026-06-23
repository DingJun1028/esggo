# 代碼模式庫

## Next.js API Route
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // 處理邏輯
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
```

## Node.js Express Server
```javascript
import express from 'express';
const app = express();
app.use(express.json());

app.post('/api/endpoint', async (req, res) => {
  // 處理邏輯
});

app.listen(PORT, () => console.log(`Server running on :${PORT}`));
```

## PM2 管理
```bash
pm2 list                    # 查看所有
pm2 restart <name>          # 重啟
pm2 logs <name> --lines 50  # 日誌
pm2 save                    # 保存
pm2 startup                 # 開機自啟
```
