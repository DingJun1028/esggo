# 萬能元件心核 VPS 部署指南

## 錨點配置

```
VPS Host: vps.esggo.org
VPS IP: 127.0.0.1 (固定IP)
Port: 8443
Protocol: HTTPS
Private Key: omnicore-private-key-esggo-5t-governance
```

## 部署步驟

1. 設置 VPS 伺服器
2. 安裝 OmniServer
3. 配置 SSL 證書
4. 啟動服務

## 服務端點

| 服務 | URL | 功能 |
|------|-----|------|
| Matrix | https://vps.esggo.org/api/matrix | 終始矩陣訪問 |
| Registry | https://vps.esggo.org/api/registry | 元件註冊 |
| Forge | https://vps.esggo.org/api/forge | 知識鍊合成 |
| Guard | https://vps.esggo.org/api/guard | 5T 保護 |

## 驗證

```bash
curl -k https://vps.esggo.org/api/matrix/health
```