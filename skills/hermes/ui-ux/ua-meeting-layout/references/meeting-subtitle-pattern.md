# 會議字幕設計模式

## 問題
觀眾同時觀看影片時，若字幕介面**遮擾畫面**，會破壞視訊體驗。

## 解決方案：懸浮免遮擾模式

### 1. 位置：右下角懸浮
```css
.subtitle-box {
  position: fixed;
  bottom: clamp(24px, 4vw, 48px);
  right: clamp(24px, 4vw, 48px);
}
```

### 2. 背景：半透明+模糊
```css
background: rgba(20, 27, 41, 0.92);
backdrop-filter: blur(8px);
-webkit-backdrop-filter: blur(8px);
```

### 3. 尺寸：RWD 自適應
```css
max-width: 90vw;
max-height: 35vh;
font-size: clamp(0.75rem, 1.6vw, 0.95rem);
```

### 4. 移動端：自動置左
```css
@media (max-width: 480px) {
  .subtitle-box { left: 12px; right: 12px; }
}
```

## ✅ 完整範例
見 `apps/universal-translator/public/stream.html` 中 `.subtitle-box` 類別設定。